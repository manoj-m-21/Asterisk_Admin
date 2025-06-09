import React, { useState } from 'react';
import '../styles/Help.css';
import { FaChevronDown, FaChevronUp, FaUpload, FaFileAudio, FaExclamationTriangle, FaQuestionCircle } from 'react-icons/fa';

const Help = () => {
    const [activeSection, setActiveSection] = useState(null);

    const toggleSection = (sectionId) => {
        setActiveSection(activeSection === sectionId ? null : sectionId);
    };

    const sections = [
        {
            id: 'getting-started',
            title: 'Getting Started',
            icon: <FaQuestionCircle />,
            content: (
                <>
                    <h3>Welcome to Asterisk Admin</h3>
                    <p>This application helps you manage your Asterisk PBX system's media files efficiently. Here's what you need to know to get started:</p>
                    
                    <h4>Key Features</h4>
                    <ul>
                        <li>Upload and manage audio files</li>
                        <li>Search through your media library</li>
                        <li>Preview audio files before using them</li>
                        <li>Organize files with custom names and descriptions</li>
                    </ul>

                    <h4>System Requirements</h4>
                    <ul>
                        <li>Modern web browser (Chrome, Firefox, Safari, or Edge)</li>
                        <li>Stable internet connection</li>
                        <li>Access to your Asterisk server</li>
                    </ul>
                </>
            )
        },
        {
            id: 'uploading-files',
            title: 'Uploading Files',
            icon: <FaUpload />,
            content: (
                <>
                    <h3>How to Upload Files</h3>
                    <p>Follow these steps to upload new audio files to your system:</p>
                    
                    <ol>
                        <li>Click the "Upload" button in the navigation bar</li>
                        <li>Select one or more audio files from your computer</li>
                        <li>Add a custom name and description (optional)</li>
                        <li>Click "Upload" to process the files</li>
                    </ol>

                    <h4>Supported File Types</h4>
                    <ul>
                        <li>WAV (.wav)</li>
                        <li>MP3 (.mp3)</li>
                        <li>GSM (.gsm)</li>
                        <li>ULAW (.ulaw)</li>
                    </ul>

                    <h4>File Size Limits</h4>
                    <p>Maximum file size: 10MB per file</p>
                </>
            )
        },
        {
            id: 'managing-files',
            title: 'Managing Files',
            icon: <FaFileAudio />,
            content: (
                <>
                    <h3>File Management</h3>
                    <p>Learn how to effectively manage your audio files:</p>

                    <h4>Searching Files</h4>
                    <ul>
                        <li>Use the search bar to find files by name or description</li>
                        <li>Filter results by file type</li>
                        <li>Sort files by date, name, or size</li>
                    </ul>

                    <h4>File Operations</h4>
                    <ul>
                        <li>Preview: Click the play button to listen to a file</li>
                        <li>Download: Click the download icon to save a file locally</li>
                        <li>Delete: Use the delete button to remove unwanted files</li>
                    </ul>

                    <h4>Best Practices</h4>
                    <ul>
                        <li>Use descriptive names for easy identification</li>
                        <li>Add detailed descriptions for important files</li>
                        <li>Regularly clean up unused files</li>
                    </ul>
                </>
            )
        },
        {
            id: 'troubleshooting',
            title: 'Troubleshooting',
            icon: <FaExclamationTriangle />,
            content: (
                <>
                    <h3>Common Issues and Solutions</h3>
                    
                    <h4>Upload Issues</h4>
                    <ul>
                        <li><strong>File too large:</strong> Ensure your file is under 10MB</li>
                        <li><strong>Unsupported format:</strong> Convert your file to a supported format</li>
                        <li><strong>Upload fails:</strong> Check your internet connection and try again</li>
                    </ul>

                    <h4>Playback Issues</h4>
                    <ul>
                        <li><strong>Audio won't play:</strong> Try refreshing the page or using a different browser</li>
                        <li><strong>Poor audio quality:</strong> Check if the original file is of good quality</li>
                    </ul>

                    <h4>Search Issues</h4>
                    <ul>
                        <li><strong>No results found:</strong> Try using different search terms</li>
                        <li><strong>Slow search:</strong> Wait a moment as the system processes your request</li>
                    </ul>
                </>
            )
        }
    ];

    return (
        <div className="help-container">
            <h1>Help Center</h1>
            <p className="help-intro">
                Find answers to common questions and learn how to use the Asterisk Admin application effectively.
            </p>

            <div className="help-sections">
                {sections.map((section) => (
                    <div key={section.id} className="help-section">
                        <div 
                            className={`section-header ${activeSection === section.id ? 'active' : ''}`}
                            onClick={() => toggleSection(section.id)}
                        >
                            <div className="section-title">
                                <span className="section-icon">{section.icon}</span>
                                <h2>{section.title}</h2>
                            </div>
                            <span className="section-toggle">
                                {activeSection === section.id ? <FaChevronUp /> : <FaChevronDown />}
                            </span>
                        </div>
                        <div className={`section-content ${activeSection === section.id ? 'active' : ''}`}>
                            {section.content}
                        </div>
                    </div>
                ))}
            </div>

            <div className="help-footer">
                <p>Still need help? Contact your system administrator or refer to the <a href="https://www.asterisk.org/docs/">Asterisk documentation</a> for more information.</p>
            </div>
        </div>
    );
};

export default Help; 