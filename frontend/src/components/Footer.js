import React from 'react';
import { Link } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';
import '../styles/Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>About Us</h3>
                    <p>
                        Asterisk Admin is a comprehensive management system for Asterisk PBX,
                        providing powerful tools for managing extensions, media files, and system configurations.
                    </p>
                </div>

                <div className="footer-section">
                    <h3>Quick Links</h3>
                    <div className="quick-links-container">
                        <div className="quick-links-column">
                            <ul>
                                <li><Link to="/home">Home</Link></li>
                                <li><Link to="/add-extension">Add Extension</Link></li>
                                <li><Link to="/view-extensions">View Extensions</Link></li>
                                <li><Link to="/add-media">Add Media</Link></li>
                            </ul>
                        </div>
                        <div className="quick-links-column">
                            <ul>
                                <li><Link to="/view-media">View Media</Link></li>
                                <li><Link to="/help">Help Center</Link></li>
                                <li><Link to="/support">Support</Link></li>
                                <li><Link to="/analytics">Analytics</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="footer-section">
                    <h3>Contact Us</h3>
                    <ul className="contact-info">
                        <li>
                            <FaPhone />
                            <span>+1 (555) 123-4567</span>
                        </li>
                        <li>
                            <FaEnvelope />
                            <span>info@ecoprosus.ai</span>
                        </li>
                        <li>
                            <FaMapMarkerAlt />
                            <span>123 Tech Street, Silicon Valley, CA 94025</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="social-icons">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <FaFacebook />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                        <FaTwitter />
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                        <FaLinkedin />
                    </a>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                        <FaGithub />
                    </a>
                </div>
                <div className="copyright">
                    © {currentYear} Asterisk Admin. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;