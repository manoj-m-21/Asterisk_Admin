import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/AddMedia.css";

const AddMedia = () => {
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');
    const [existingFiles, setExistingFiles] = useState([]);
    const [mediaType, setMediaType] = useState('other'); // default selection

    useEffect(() => {
        const fetchExistingFiles = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/media');
                setExistingFiles(response.data);
            } catch (error) {
                console.error('Error fetching existing files:', error);
            }
        };

        fetchExistingFiles();
    }, []);

    const isFileDuplicate = (fileName) => {
        const baseFileName = fileName.replace(/^\d+-/, '');
        return existingFiles.some(existingFile => {
            const existingBaseName = existingFile.name.replace(/^\d+-/, '');
            return existingBaseName.toLowerCase() === baseFileName.toLowerCase();
        });
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && isFileDuplicate(selectedFile.name)) {
            alert('This file already exists in the system. Please choose a different file.');
            e.target.value = '';
            setFile(null);
            return;
        }
        setFile(selectedFile);
    };

    const handleUpload = async () => {
        if (!file) {
            setUploadStatus('Please select an audio file.');
            return;
        }

        const formData = new FormData();
        formData.append('media', file);
        formData.append('isPublicAnnouncement', mediaType === 'public'); // 👈 Send media type

        try {
            const response = await axios.post('http://localhost:5000/api/media/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.status === 200 || response.status === 201) {
                setUploadStatus('File uploaded successfully!');
                setFile(null);
                setExistingFiles(prev => [...prev, response.data.data]);
                alert('File uploaded successfully!');
                const fileInput = document.querySelector('input[type="file"]');
                if (fileInput) fileInput.value = '';
            } else {
                throw new Error(`Unexpected status code: ${response.status}`);
            }
        } catch (error) {
            if (error.response?.status === 409) {
                setUploadStatus('File already exists. Please choose a different file.');
                alert('This file already exists in the system.');
            } else {
                setUploadStatus('Error uploading file. Please try again.');
                alert(`Upload failed: ${error.response?.data?.message || error.message}`);
            }
            setFile(null);
            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput) fileInput.value = '';
        }
    };

    return (
        <div className="add-media-container">
            <h1> 🎧 ADD MEDIA FILE</h1>
            <input
                className='addMedia'
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
            />

            {/* Media Type Selection */}
            <div className="radio-group">
                <label>
                    <input
                        type="radio"
                        name="mediaType"
                        value="public"
                        checked={mediaType === 'public'}
                        onChange={() => setMediaType('public')}
                    />
                    Public Announcement File
                </label>
                <label>
                    <input
                        type="radio"
                        name="mediaType"
                        value="other"
                        checked={mediaType === 'other'}
                        onChange={() => setMediaType('other')}
                    />
                    Other Media File
                </label>

            </div>

            <button onClick={handleUpload} className="btn-upload">
                Upload
            </button>
            {uploadStatus && <p className="upload-status">{uploadStatus}</p>}
        </div>
    );
};

export default AddMedia;
