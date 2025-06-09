const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    size: {
        type: Number,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    mimetype: {
        type: String,
        required: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    },
    category: { // New field
        type: String,
        enum: ['Public Announcement', 'Other'], 
        default: 'Public Announcement',
        required: true
    }
});

// Normalize file paths
mediaSchema.pre('save', function(next) {
    if (this.path) {
        this.path = this.path.replace(/\\/g, '/');
    }
    next();
});

module.exports = mongoose.model('Media', mediaSchema);
