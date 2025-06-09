import React, { useState } from 'react';
import "../styles/Navbar.css";
import {
    FaQuestionCircle, FaComments, FaBell, FaBars, FaTimes, FaHome, FaUserCog, FaSignOutAlt,
    FaPhone, FaPlus, FaList, FaMicrophone, FaFileAudio, FaHistory, FaChevronDown, FaChevronUp,
    FaUserFriends, FaHeadset, FaTools, FaChartBar, FaFolderOpen
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import logo from '../assets/logo.png';

function Navbar() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [collapsedSections, setCollapsedSections] = useState({});

    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to logout?");
        if (confirmLogout) {
            localStorage.removeItem('userToken');
            navigate('/');
        }
    };

    const handleGoHome = () => {
        navigate('/home');
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const toggleSection = (section) => {
        setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const renderSection = (title, icon, key, items) => (
        <ul>
            <h4 onClick={() => toggleSection(key)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {icon} {title} {collapsedSections[key] ? <FaChevronUp /> : <FaChevronDown />}
            </h4>
            {!collapsedSections[key] && items.map((item, idx) => (
                <li key={idx}>
                    <Link to={item.to} onClick={item.onClick || toggleMenu}>
                        {item.icon} {item.label}
                    </Link>
                </li>
            ))}
        </ul>
    );

    return (
        <>
            <div className='navbar'>
                <div className='leftside'>
                    <button className="menu-btn" onClick={toggleMenu}>
                        {menuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                    <div className="logo-container" onClick={handleGoHome}>
                        <img src={logo} alt="Asterisk Logo" className="navbar-logo" />
                        {/* <h1>ECOPROSUS</h1> */}
                    </div>
                </div>
                <div className='rightside'>
                    <input type="text" className="search-bar" placeholder="Enter your search query" />
                    <button className="icon-btn ">
                        <Link to="/help">
                            <FaQuestionCircle />
                        </Link>
                    </button>
                    <button className="icon-btn">
                        <Link to="/support">
                            <FaComments />
                            {/* <span> Support</span> */}
                        </Link>
                    </button>
                    <button className="icon-btn">
                        <Link to="/notification">
                            <FaBell />
                        </Link>
                    </button>
                    <button className="logout-btn" onClick={handleLogout}>
                        <FaSignOutAlt />
                    </button>
                </div>
            </div>

            {/* Menu Overlay */}
            <div className={`menu-overlay ${menuOpen ? 'active' : ''}`} onClick={toggleMenu}></div>

            {/* Side Menu */}
            <div className={`side-menu ${menuOpen ? 'open' : ''}`}>
                {/* <input type="text" className="sidebar-search" placeholder="Search menu..." /> */}

                {renderSection("GENERAL", <FaHome />, 'general', [
                    { to: "/home", label: "Home", icon: <FaHome /> },
                    { to: "/admin-settings", label: "Settings", icon: <FaUserCog /> },
                    { to: "/", label: "Logout", icon: <FaSignOutAlt />, onClick: handleLogout }
                ])}

                {renderSection("EXTENSIONS", <FaPhone />, 'extensions', [
                    { to: "/extension", label: "Add Extension", icon: <FaPlus /> },
                    { to: "/all-extensions", label: "View All Extensions", icon: <FaList /> }
                ])}

                {renderSection("MEDIA", <FaMicrophone />, 'media', [
                    { to: "/add-media", label: "Add Media", icon: <FaPlus /> },
                    { to: "/view-media", label: "All Media Files", icon: <FaFileAudio /> }
                ])}

                {renderSection("CDR", <FaHistory />, 'cdr', [
                    { to: "/call-logs", label: "Call Logs", icon: <FaHistory /> }
                ])}

                {renderSection("USERS / ADMINS", <FaUserFriends />, 'users', [
                    { to: "/user-management", label: "Manage Users", icon: <FaUserFriends /> }
                ])}

                {renderSection("LIVE CALL MONITORING", <FaHeadset />, 'live-calls', [
                    { to: "/live-calls", label: "Monitor Calls", icon: <FaHeadset /> }
                ])}

                {renderSection("SYSTEM MANAGEMENT", <FaTools />, 'system', [
                    { to: "/system-settings", label: "System Settings", icon: <FaTools /> }
                ])}

                {renderSection("REPORTS / ANALYTICS", <FaChartBar />, 'reports', [
                    { to: "/analytics", label: "Analytics Dashboard", icon: <FaChartBar /> }
                ])}

                {renderSection("RECORDINGS MANAGER", <FaFolderOpen />, 'recordings', [
                    { to: "/recordings", label: "Manage Recordings", icon: <FaFolderOpen /> }
                ])}

                {renderSection("HELP / SUPPORT", <FaQuestionCircle />, 'help', [
                    { to: "/help", label: "Help Center", icon: <FaQuestionCircle /> },
                    { to: "/support", label: "Support", icon: <FaComments /> }
                ])}
            </div>
        </>
    );
}

export default Navbar;
