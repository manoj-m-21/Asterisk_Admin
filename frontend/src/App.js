import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import Modify from './pages/Modify';
import AllExtensions from './pages/AllExtension';
import ExtensionDetails from './pages/ExtensionDetails';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Extension from './pages/Extension';
import AddMedia from './pages/AddMedia';
import ViewMedia from './pages/ViewMedia';
import AdminSettings from './pages/AdminSettings';
import Help from './components/Help';
import Support from './components/Support';
import CallLogs from './pages/CallLogs';
import RecordingsManager from './pages/RecordingsManager';
import UserManagement from './pages/UserManagement';
import SystemSettings from './pages/SystemSettings';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from './components/Footer';
import Analytics from './pages/Analytics';


function App() {
  const [data, setData] = useState([]);

  // Fetch data from the backend when the app loads
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/extensions');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Load data initially
  useEffect(() => {
    fetchData();
  }, []);

  // Add New Extension
  const handleAddExtension = (newExtension) => {
    setData([...data, newExtension]);
  };

  // Update Extension Data
  const handleUpdate = (updatedExtension) => {
    const updatedData = data.map((item) =>
      item.extension === updatedExtension.extension ? updatedExtension : item
    );
    setData(updatedData);
  };

  return (
    <Router>
      <AppContent
        data={data}
        fetchData={fetchData} // Pass fetchData to Extension page to reload data
        handleAddExtension={handleAddExtension}
        handleUpdate={handleUpdate}
      />
    </Router>
  );
}

function AppContent({ data, fetchData, handleAddExtension, handleUpdate }) {
  const location = useLocation();
  const showNavbar = location.pathname !== '/';
  const showFooter = location.pathname !== '/'; // Don't show footer on login page

  return (
    <div className="App">
      {showNavbar && <Navbar />}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<Home data={data} />} />
          <Route path="/extension" element={<Extension onAddExtension={handleAddExtension} fetchData={fetchData} />} />
          <Route path="/modify" element={<Modify onUpdate={handleUpdate} />} />
          <Route path="/all-extensions" element={<AllExtensions />} />
          <Route path="/extension/:id" element={<ExtensionDetails />} />
          <Route path="/add-media" element={<AddMedia />} />
          <Route path="/view-media" element={<ViewMedia />} />
          <Route path="/admin-settings" element={<AdminSettings />} />
          <Route path="/help" element={<Help />} />
          <Route path="/support" element={<Support />} />
          <Route path="/call-logs" element={<CallLogs />} />
          <Route path='/recordings' element={<RecordingsManager />} />
          <Route path='/user-management' element={<UserManagement />} />
          <Route path='/system-settings' element={<SystemSettings />} />
          <Route path='/analytics' element={<Analytics />} />
        </Routes>
      </div>
      {showFooter && <Footer />}
    </div>
  );
}

export default App;
