const mongoose = require('mongoose');

const extensionSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    extension: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    mobile: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Extension = mongoose.models.Extension || mongoose.model('Extension', extensionSchema);

module.exports = Extension;