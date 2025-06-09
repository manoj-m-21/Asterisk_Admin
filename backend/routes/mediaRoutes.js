const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
    uploadMedia,
    getAllMedia,
    playMedia,
    deleteMedia
} = require('../controllers/mediaController');
const Media = require('../models/Media');

const router = express.Router();

const allowedTypes = ['.wav', '.gsm', '.ulaw', '.alaw'];

// Multer storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '..', 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// File type filter
const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Only .wav, .gsm, .ulaw, .alaw files are allowed'), false);
    }
};

// Multer middleware
const upload = multer({ storage, fileFilter });

// Upload route
router.post('/upload', upload.single('media'), uploadMedia);

// Get all media files
router.get('/', getAllMedia);

// Play audio file
router.get('/play/:path', playMedia);

// Download file
router.get('/download/:path', (req, res) => {
    const fileName = req.params.path;
    const filePath = path.join(__dirname, '..', 'uploads', fileName);

    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).json({ message: 'File not found for download' });
    }
});

// Delete media
router.delete('/delete/:id', deleteMedia);

module.exports = router;
