import React, { useState } from 'react';
import '../styles/Support.css';
import { FaChevronDown, FaChevronUp, FaHeadset, FaPhone, FaEnvelope, FaClock, FaComments } from 'react-icons/fa';

const Support = () => {
    const [activeSection, setActiveSection] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
        priority: 'medium'
    });

    const toggleSection = (sectionId) => {
        setActiveSection(activeSection === sectionId ? null : sectionId);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the form data to your backend
        console.log('Form submitted:', formData);
        // Reset form
        setFormData({
            name: '',
            email: '',
            subject: '',
            message: '',
            priority: 'medium'
        });
        alert('Thank you for your message. Our support team will get back to you soon.');
    };

    const sections = [
        {
            id: 'contact-info',
            title: 'Contact Information',
            icon: <FaHeadset />,
            content: (
                <>
                    <div className="contact-info">
                    <h3>How to Reach Us</h3>
                    <p>Our support team is available to help you with any issues or questions you may have.</p>
                        <h4>Support Channels</h4>
                        <ul>
                            <li><FaPhone /> Phone: +1 (555) 123-4567</li>
                            <li><FaEnvelope /> Email: info@ecoprosus.ai</li>
                            <li><FaClock /> Hours: Monday - Friday, 10:00 AM - 6:00 PM EST</li>
                        </ul>
                    </div>
                </>
            )
        },
        {
            id: 'faq',
            title: 'Frequently Asked Questions',
            icon: <FaComments />,
            content: (
                <>
                    <h3>Common Questions</h3>
                    
                    <h4>Account & Access</h4>
                    <ul>
                        <li><strong>How do I reset my password?</strong> Click the "Forgot Password" link on the login page.</li>
                        <li><strong>How do I change my account settings?</strong> Go to Admin Settings in the navigation menu.</li>
                    </ul>

                    <h4>Technical Issues</h4>
                    <ul>
                        <li><strong>Why can't I upload files?</strong> Check your file size and format requirements.</li>
                        <li><strong>How do I troubleshoot audio playback?</strong> Ensure your browser supports the audio format.</li>
                    </ul>
                </>
            )
        }
    ];

    return (
        <div className="support-container">
            <h1>Support Center</h1>
            <p className="support-intro">
                Need assistance? Our support team is here to help you with any questions or issues.
            </p>

            <div className="contact-form">
                <h3>Contact Support</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter your name"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="subject">Subject</label>
                        <input
                            type="text"
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter subject"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="priority">Priority</label>
                        <select
                            id="priority"
                            name="priority"
                            value={formData.priority}
                            onChange={handleInputChange}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter your message"
                        />
                    </div>
                    <button type="submit" className="submit-btn">Submit</button>
                </form>
            </div>

            <div className="support-sections">
                {sections.map((section) => (
                    <div key={section.id} className="support-section">
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

            <div className="support-footer">
                <p>For urgent issues, please call our support hotline or refer to the <a href="/help">Help Center</a> for more information.</p>
            </div>
        </div>
    );
};

export default Support; 