import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaPlay, FaStop, FaTrash } from 'react-icons/fa'; // Import icons
import "../styles/ViewMedia.css";

const ViewMedia = () => {
    const [mediaFiles, setMediaFiles] = useState([]);
    const [playingFile, setPlayingFile] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalFile, setModalFile] = useState(null);
    const [activeTab, setActiveTab] = useState('other'); // New state for tab switching
    const audioRef = useRef(null);

    // Function to extract filename from path
    const getFileName = (filePath) => {
        return filePath.split('/').pop().split('\\').pop();
    };

    // Fetch all media files
    useEffect(() => {
        const fetchMediaFiles = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/media');
                setMediaFiles(response.data);
            } catch (error) {
                console.error('Error fetching media files:', error);
            }
        };

        fetchMediaFiles();
    }, []);

    // Play audio file
    const handlePlay = (fileName) => {
        if (audioRef.current) {
            // Get the full filename from the mediaFiles array
            const file = mediaFiles.find(f => f.name === fileName);
            if (!file) {
                console.error('File not found in mediaFiles array');
                return;
            }

            // Extract just the filename from the path
            const fullFileName = getFileName(file.path);
            console.log('Attempting to play:', fullFileName);

            const audioUrl = `http://localhost:5000/api/media/play/${encodeURIComponent(fullFileName)}`;
            audioRef.current.src = audioUrl;

            // Add error event listener
            audioRef.current.onerror = (e) => {
                console.error('Audio playback error:', e);
                alert('Failed to play the audio file. Please check the console for details.');
            };

            audioRef.current.play()
                .then(() => {
                    console.log('Audio playback started');
                    setPlayingFile(fileName);
                })
                .catch(err => {
                    console.error('Error playing media:', err);
                    alert('Failed to play the audio file');
                });
        }

        setShowModal(true);
        setModalFile(fileName);
    };

    // Stop audio
    const handleStop = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setPlayingFile(null);
        }
    };

    const handleDelete = async (id, remotePath) => {
        if (window.confirm('Are you sure you want to delete this file?')) {
            try {
                // Step 1: Perform the DELETE request to the backend
                const response = await axios.delete(`http://localhost:5000/api/media/delete/${id}`, { data: { remotePath } });
                
                if (response.status === 200) {
                    // Step 2: Remove file from local state (frontend)
                    setMediaFiles(prevFiles => prevFiles.filter(file => file._id !== id));
                    alert('File deleted successfully');
                }
            } catch (error) {
                console.error('Error deleting media:', error);
                alert('Failed to delete the file. Please try again.');
            }
        }
    };
    


    // Filter media files based on type (public announcement or other)
    const filteredFiles = mediaFiles.filter(file =>
        activeTab === 'public' ? !file.isPublicAnnouncement : file.isPublicAnnouncement
    );

    return (
        <div className="view-media-container">
            <h1>📂 MEDIA FILES </h1>

            {/* Tabs for switching between public announcement and other audio files */}
            <div className="tabs">
                <button
                    className={`tab-btn ${activeTab === 'public' ? 'active' : ''}`}
                    onClick={() => setActiveTab('public')}
                >
                    Public Announcement Files
                </button>

                <button
                    className={`tab-btn ${activeTab === 'other' ? 'active' : ''}`}
                    onClick={() => setActiveTab('other')}
                >
                    Other Audio Files
                </button>

            </div>

            {/* Display files based on active tab */}
            <div className="media-files-container">
                <table className="media-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Size (KB)</th>
                            <th>Date Uploaded</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredFiles.map((file, index) => (
                            <tr key={index}>
                                <td>{file.name}</td>
                                <td>{(file.size / 1024).toFixed(2)} KB</td>
                                <td>{new Date(file.uploadedAt).toLocaleDateString()}</td>
                                <td>
                                    {playingFile === file.name ? (
                                        <button onClick={handleStop} className="btn-stop">
                                            <FaStop /> Stop
                                        </button>
                                    ) : (
                                        <button onClick={() => handlePlay(file.name)} className="btn-play">
                                            <FaPlay /> Play
                                        </button>
                                    )}
                                    <button onClick={() => handleDelete(file._id, file.remotePath)} className="btn-delete">
                                        <FaTrash /> Delete
                                    </button>
                                    <a href={`http://localhost:5000/api/media/download/${getFileName(file.path)}`} download>
                                        <button className="btn-download">Download</button>
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Audio Player Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h3>{modalFile}</h3>
                        <audio ref={audioRef} controls autoPlay />
                        <button onClick={() => setShowModal(false)}>Close</button>
                    </div>
                </div>
            )}

            {/* Audio Player */}
            <audio ref={audioRef} />
        </div>
    );
};

export default ViewMedia;
