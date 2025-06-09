// backend/routes/extensionRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
    getExtensions,
    addExtension,
    updateExtension,
    deleteExtension,
    getExtensionStatuses,
} = require('../controllers/extensionController');
const Extension = require('../models/Extension');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/profile-pictures');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Add new extension with auto-generated password
router.post('/', upload.single('profilePicture'), addExtension);

// Get all extensions
router.get('/', getExtensions);

// Get online/offline status of extensions
router.get('/status/check', getExtensionStatuses);

// Get extension by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const extension = await Extension.findById(id);

        if (!extension) {
            return res.status(404).json({ message: 'Extension not found' });
        }

        res.status(200).json(extension);
    } catch (error) {
        console.error('Error fetching extension by ID:', error);
        res.status(500).json({ message: 'Error fetching extension' });
    }
});

// Update extension and password by ID
router.put('/:id', upload.single('profilePicture'), updateExtension);

// Delete extension by ID
router.delete('/:id', deleteExtension);

module.exports = router;