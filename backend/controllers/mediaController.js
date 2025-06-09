const Media = require('../models/Media');
const path = require('path');
const fs = require('fs');
const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
const ffmpeg = require('fluent-ffmpeg'); // Import fluent-ffmpeg
const SSH_CONFIG = require('../config/sshConfig');

// Helper function to convert media to .wav
const convertToWav = (inputPath, outputPath) => {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .output(outputPath)
            .audioCodec('pcm_s16le') // Set audio codec to WAV format
            .on('end', () => {
                console.log('Conversion finished');
                resolve(outputPath);
            })
            .on('error', (err) => {
                console.error('Error during conversion:', err);
                reject(err);
            })
            .run();
    });
};

// Upload media and save to MongoDB
const uploadMedia = async (req, res) => {
    const { category = 'Other' } = req.body;
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { originalname, size, path: filePath, mimetype } = req.file;

        // Generate a unique filename for the .wav version
        const fileNameWithoutExt = path.parse(originalname).name;
        const timestamp = Date.now();
        const wavFileName = `${timestamp}-${fileNameWithoutExt}.wav`;
        const convertedFilePath = path.join(__dirname, '..', 'uploads', wavFileName);

        // Convert the file to .wav format if it is not already .wav
        if (!originalname.endsWith('.wav')) {
            try {
                await convertToWav(filePath, convertedFilePath);
                fs.unlinkSync(filePath); // Delete original file after conversion
            } catch (conversionError) {
                return res.status(500).json({ message: 'Error converting file to .wav', error: conversionError.message });
            }
        } else {
            // If it's already a .wav file, copy it to uploads folder
            fs.copyFileSync(filePath, convertedFilePath);
            fs.unlinkSync(filePath); // Delete the original uploaded file
        }

        // Create new media document for MongoDB
        const media = new Media({
            name: wavFileName,
            size,
            path: convertedFilePath.replace(/\\/g, '/'), // Convert Windows path to MongoDB format
            mimetype: 'audio/wav', // Update mimetype for .wav
            uploadedAt: new Date(),
            category
        });

        try {
            await media.save();
            console.log('File saved to MongoDB');

            // Upload to Asterisk server
            const remotePath = `/var/lib/asterisk/sounds/en/${wavFileName}`;

            try {
                // Connect to SSH
                await ssh.connect(SSH_CONFIG);
                console.log('SSH connection established');

                // Upload file
                await ssh.putFile(convertedFilePath, remotePath);
                console.log(`File uploaded to Asterisk at ${remotePath}`);

                // Set ownership and permissions
                await ssh.execCommand(`sudo chown asterisk:asterisk ${remotePath}`);
                await ssh.execCommand(`sudo chmod 644 ${remotePath}`);

                console.log(`Permissions updated for ${remotePath}`);

                // Disconnect SSH
                ssh.dispose();

                res.status(201).json({
                    message: 'File uploaded successfully to uploads folder and Asterisk server',
                    data: media
                });
            } catch (uploadError) {
                console.error('Error uploading file to Asterisk server:', uploadError);
                // Don't delete the local file if Asterisk upload fails
                res.status(500).json({ message: 'Error uploading file to Asterisk server', error: uploadError.message });
            }
        } catch (saveError) {
            // Delete the uploaded file if saving fails
            try {
                fs.unlinkSync(convertedFilePath);
            } catch (err) {
                console.error('Error deleting file after save error:', err);
            }

            if (saveError.code === 11000) { // Duplicate file error
                return res.status(409).json({ message: 'File with this name already exists', error: 'DUPLICATE_FILE' });
            }
            throw saveError;
        }
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ message: 'Error uploading file', error: error.message });
    }
};

// Get all media files from MongoDB
const getAllMedia = async (req, res) => {
    try {
        const mediaFiles = await Media.find().sort({ uploadedAt: -1 });
        res.status(200).json(mediaFiles);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching media files', error: error.message });
    }
};

// Play media file
const playMedia = async (req, res) => {
    try {
        const fileName = req.params.path;
        const decodedFileName = decodeURIComponent(fileName);
        const localPath = path.join(__dirname, '..', 'uploads', decodedFileName);

        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

        // Try local first
        if (fs.existsSync(localPath)) {
            console.log('Playing from local path:', localPath);
            const stat = fs.statSync(localPath);
            
            res.setHeader('Content-Type', 'audio/wav');
            res.setHeader('Content-Length', stat.size);
            res.setHeader('Content-Disposition', `inline; filename="${decodedFileName}"`);

            const fileStream = fs.createReadStream(localPath);
            
            fileStream.on('error', (error) => {
                console.error('Error reading file stream:', error);
                if (!res.headersSent) {
                    res.status(500).json({ message: 'Error reading file', error: error.message });
                }
            });

            req.on('close', () => {
                fileStream.destroy();
            });

            fileStream.pipe(res);
            return;
        }

        // If file not found locally, try Asterisk server
        const remotePath = `/var/lib/asterisk/sounds/en/${decodedFileName}`;
        
        try {
            await ssh.connect(SSH_CONFIG);
            const result = await ssh.execCommand(`cat "${remotePath}"`);
            
            if (result.code !== 0) {
                throw new Error(result.stderr || 'Error streaming file');
            }

            res.setHeader('Content-Type', 'audio/wav');
            res.setHeader('Content-Disposition', `inline; filename="${decodedFileName}"`);
            res.send(result.stdout);
        } catch (sshError) {
            console.error('SSH streaming error:', sshError);
            if (!res.headersSent) {
                res.status(500).json({ message: 'Error streaming from remote server', error: sshError.message });
            }
        } finally {
            ssh.dispose();
        }
    } catch (error) {
        console.error('Error in playMedia:', error);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
};

const deleteMedia = async (req, res) => {
    const { id } = req.params;

    try {
        const media = await Media.findById(id);

        if (!media) {
            return res.status(404).json({ message: 'Media not found in database' });
        }

        const remotePath = `/var/lib/asterisk/sounds/en/${media.name}`;

        // Attempt SSH deletion
        await ssh.connect(SSH_CONFIG);
        const sshResponse = await ssh.execCommand(`rm "${remotePath}"`);
        await ssh.dispose();

        if (sshResponse.code !== 0) {
            console.error('SSH deletion error:', sshResponse.stderr);
            return res.status(500).json({ message: 'Failed to delete file from remote server', error: sshResponse.stderr });
        }

        // Remove local file just in case it's still there
        const localPath = path.join(__dirname, '..', 'uploads', `${path.parse(media.name).name}.wav`);
        if (fs.existsSync(localPath)) {
            fs.unlinkSync(localPath);
        }

        await media.deleteOne();

        res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ message: 'Failed to delete the file', error: error.message });
    }
};


module.exports = { uploadMedia, getAllMedia, playMedia, deleteMedia };
