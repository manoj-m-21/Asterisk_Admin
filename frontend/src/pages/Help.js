import React, { useState } from 'react';
import '../styles/Help.css';
import { FaChevronDown, FaChevronUp, FaQuestionCircle, FaPhone, FaFileUpload, FaCog } from 'react-icons/fa';

function Help() {
    const [activeSection, setActiveSection] = useState(null);

    const toggleSection = (section) => {
        if (activeSection === section) {
            setActiveSection(null);
        } else {
            setActiveSection(section);
        }
    };

    const sections = [
        {
            id: 'getting-started',
            title: 'Getting Started',
            icon: <FaQuestionCircle />,
            content: (
                <div>
                    <h3>Welcome to Asterisk Admin</h3>
                    <p>Asterisk Admin is a comprehensive management tool for your Asterisk PBX system. This dashboard allows you to manage extensions, media files, and system settings.</p>
                    <h4>Key Features:</h4>
                    <ul>
                        <li>Extension Management</li>
                        <li>Media File Upload and Management</li>
                        <li>System Configuration</li>
                        <li>User Authentication</li>
                    </ul>
                    <p>To get started, use the sidebar menu to navigate to different sections of the application.</p>
                </div>
            )
        },
        {
            id: 'extensions',
            title: 'Managing Extensions',
            icon: <FaPhone />,
            content: (
                <div>
                    <h3>Extension Management</h3>
                    <p>Extensions are the core of your PBX system. They allow users to make and receive calls.</p>
                    <h4>Adding Extensions:</h4>
                    <ol>
                        <li>Navigate to "Add Extension" from the sidebar</li>
                        <li>Fill in the required information (Employee Name, Extension Number, Mobile, Email)</li>
                        <li>Click "Add Extension" to save</li>
                    </ol>
                    <h4>Viewing Extensions:</h4>
                    <p>Go to "View All Extensions" to see a list of all configured extensions.</p>
                    <h4>Modifying Extensions:</h4>
                    <p>Use the "Modify Extension" option to update existing extension details.</p>
                </div>
            )
        },
        {
            id: 'media',
            title: 'Media Management',
            icon: <FaFileUpload />,
            content: (
                <div>
                    <h3>Media Files</h3>
                    <p>Media files are used for announcements, hold music, and other audio features in your PBX system.</p>
                    <h4>Uploading Media:</h4>
                    <ol>
                        <li>Go to "Add Media" from the sidebar</li>
                        <li>Click "Choose File" to select a WAV file</li>
                        <li>Click "Upload" to add the file to your system</li>
                    </ol>
                    <h4>Viewing Media:</h4>
                    <p>Navigate to "All Media Files" to see a list of all uploaded media files.</p>
                    <h4>Playing Media:</h4>
                    <p>You can preview media files by clicking the "Play" button next to each file.</p>
                </div>
            )
        },
        {
            id: 'settings',
            title: 'System Settings',
            icon: <FaCog />,
            content: (
                <div>
                    <h3>Admin Settings</h3>
                    <p>Configure system-wide settings to customize your Asterisk PBX experience.</p>
                    <h4>Available Settings:</h4>
                    <ul>
                        <li>System Configuration</li>
                        <li>User Management</li>
                        <li>Backup and Restore</li>
                        <li>Logging Options</li>
                    </ul>
                    <p>Access these settings from the "Settings" option in the sidebar menu.</p>
                </div>
            )
        },
        {
            id: 'troubleshooting',
            title: 'Troubleshooting',
            icon: <FaQuestionCircle />,
            content: (
                <div>
                    <h3>Common Issues and Solutions</h3>
                    <h4>Extension Not Working:</h4>
                    <ul>
                        <li>Verify the extension is properly configured</li>
                        <li>Check if the device is registered to the server</li>
                        <li>Ensure the correct codec is being used</li>
                    </ul>
                    <h4>Media Files Not Playing:</h4>
                    <ul>
                        <li>Confirm the file is in WAV format</li>
                        <li>Check file permissions</li>
                        <li>Verify the file path is correct</li>
                    </ul>
                    <h4>System Performance Issues:</h4>
                    <ul>
                        <li>Check server resources (CPU, memory)</li>
                        <li>Review logs for errors</li>
                        <li>Consider restarting the Asterisk service</li>
                    </ul>
                </div>
            )
        }
    ];

    return (
        <div className="help-container">
            <h1>HELP CENTER</h1>
            <p className="help-intro">Find answers to common questions and learn how to use Asterisk Admin effectively.</p>
            
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
                <p>Still need assistance? Contact our support team at <a href="mailto:support@ecoprosus.com">support@ecoprosus.com</a></p>
            </div>
        </div>
    );
}

export default Help; 