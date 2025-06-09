const mongoose = require('mongoose');
const Media = require('../models/Media');
const fs = require('fs');
require('dotenv').config();

async function cleanupDuplicates() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Find all files
        const allFiles = await Media.find().sort({ uploadedAt: -1 });
        const seenNames = new Set();
        const duplicates = [];

        // Identify duplicates
        for (const file of allFiles) {
            if (seenNames.has(file.name)) {
                duplicates.push(file);
            } else {
                seenNames.add(file.name);
            }
        }

        console.log(`Found ${duplicates.length} duplicate files`);

        // Delete duplicates and their files
        for (const duplicate of duplicates) {
            console.log(`Deleting duplicate: ${duplicate.name}`);
            
            // Delete the physical file
            if (fs.existsSync(duplicate.path)) {
                fs.unlinkSync(duplicate.path);
                console.log(`Deleted file: ${duplicate.path}`);
            }

            // Delete from database
            await Media.deleteOne({ _id: duplicate._id });
            console.log(`Deleted from database: ${duplicate._id}`);
        }

        console.log('Cleanup completed successfully');
    } catch (error) {
        console.error('Error during cleanup:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

// Run the cleanup
cleanupDuplicates();