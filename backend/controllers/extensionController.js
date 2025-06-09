const Extension = require('../models/Extension');
// const { writeExtensionToAsterisk } = require('../utils/sshUtils');
const { writeToRemoteAsterisk, deleteExtensionFromAsterisk, fetchAllExtensionStatuses } = require("../utils/sshWriter");
const { NodeSSH } = require("node-ssh");
const path = require('path');
const fs = require('fs');

// Generate a password for the extension
const generatePassword = (extension, mobile) => {
    if (!mobile || mobile.length < 6) return extension;
    return `${extension}${mobile.slice(-6)}`.slice(0, 10); // Limit to 10 characters
};

// Add a new extension
const addExtension = async (req, res) => {
    const { username, extension, mobile, email } = req.body;
    let profilePicturePath = null;

    // Basic validation of required fields
    if (!username || !extension) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // Check for duplicate extension
        const existingExtension = await Extension.findOne({ extension });
        if (existingExtension) {
            return res.status(400).json({ message: 'Extension already exists!' });
        }

        // Handle profile picture upload
        if (req.file) {
            profilePicturePath = `/uploads/profile-pictures/${req.file.filename}`;
        }

        // Generate the password
        const password = generatePassword(extension, mobile);

        // Create new extension document
        const newExtension = new Extension({
            username,
            extension,
            mobile,
            email,
            password,
            profilePicture: profilePicturePath
        });

        // Save extension to MongoDB
        const savedExtension = await newExtension.save();

        // Write the extension to Asterisk config via SSH
        await writeToRemoteAsterisk(extension, password);

        res.status(201).json({ 
            message: 'Extension added successfully', 
            data: savedExtension 
        });
    } catch (error) {
        // If there was an error and a file was uploaded, delete it
        if (req.file) {
            const filePath = path.join(__dirname, '..', req.file.path);
            fs.unlink(filePath, (err) => {
                if (err) console.error('Error deleting uploaded file:', err);
            });
        }
        console.error('Error adding extension:', error.stack);
        res.status(500).json({ message: 'Error adding extension', error: error.message });
    }
};


// Get all extensions
const getExtensions = async (req, res) => {
    try {
        const extensions = await Extension.find();
        res.status(200).json(extensions);
    } catch (error) {
        console.error('Error fetching extensions:', error.stack);
        res.status(500).json({ message: 'Error fetching extensions', error: error.message });
    }
};

// Update an existing extension by ID
const updateExtension = async (req, res) => {
    const { id } = req.params;
    const { username, extension, mobile, email } = req.body;
    let profilePicturePath = null;

    // Basic validation of required fields
    if (!username || !extension) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const existingExtension = await Extension.findById(id);
        if (!existingExtension) {
            return res.status(404).json({ message: 'Extension not found' });
        }

        // Handle profile picture upload
        if (req.file) {
            // Delete old profile picture if it exists
            if (existingExtension.profilePicture) {
                const oldFilePath = path.join(__dirname, '..', existingExtension.profilePicture);
                fs.unlink(oldFilePath, (err) => {
                    if (err) console.error('Error deleting old profile picture:', err);
                });
            }
            profilePicturePath = `/uploads/profile-pictures/${req.file.filename}`;
        }

        const updateData = {
            username,
            extension,
            mobile,
            email,
            ...(profilePicturePath && { profilePicture: profilePicturePath })
        };

        const updatedExtension = await Extension.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        res.status(200).json({ 
            message: 'Extension updated successfully', 
            data: updatedExtension 
        });
    } catch (error) {
        // If there was an error and a new file was uploaded, delete it
        if (req.file) {
            const filePath = path.join(__dirname, '..', req.file.path);
            fs.unlink(filePath, (err) => {
                if (err) console.error('Error deleting uploaded file:', err);
            });
        }
        console.error('Error updating extension:', error.stack);
        res.status(500).json({ message: 'Error updating extension', error: error.message });
    }
};

const getExtensionStatuses = async (req, res) => {
    try {
        const statusMap = await fetchAllExtensionStatuses();
        
        // Map "Available" to "Online" and "Unavailable" to "Offline"
        const mappedStatuses = {};
        Object.keys(statusMap).forEach((extension) => {
            mappedStatuses[extension] = statusMap[extension] === "Available" ? "Online" : "Offline";
        });

        res.status(200).json(mappedStatuses);
    } catch (error) {
        res.status(500).json({ message: "Error fetching statuses", error: error.message });
    }
};


// Delete an extension by ID
const deleteExtension = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedExtension = await Extension.findByIdAndDelete(id);

        if (!deletedExtension) {
            return res.status(404).json({ message: 'Extension not found' });
        }

        // Delete profile picture if it exists
        if (deletedExtension.profilePicture) {
            const filePath = path.join(__dirname, '..', deletedExtension.profilePicture);
            fs.unlink(filePath, (err) => {
                if (err) console.error('Error deleting profile picture:', err);
            });
        }

        const extNum = deletedExtension.extension;
        console.log(`🗑️ Deleting extension ${extNum} from Asterisk...`);

        // Delete from Asterisk config
        await deleteExtensionFromAsterisk(extNum);

        res.status(200).json({ message: `Extension ${extNum} deleted successfully` });
    } catch (error) {
        console.error('Error deleting extension:', error.stack);
        res.status(500).json({ message: 'Error deleting extension', error: error.message });
    }
};


module.exports = { addExtension, getExtensions, updateExtension, deleteExtension, getExtensionStatuses };
