import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/RecordingsManager.css';
// import logo from '../assets/cr2-removebg-preview.png'

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  else if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  else return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function RecordingsManager() {
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/recordings')
      .then(res => {
        setRecordings(res.data.recordings);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load recordings:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="recordings-container">
      <h1 className="recordings-title">
        {/* <img className='logo-img' src={logo} alt='call-recording'></img> */}
        📂 Call Recordings
      </h1>
      {loading ? (
        <p>Loading...</p>
      ) : recordings.length === 0 ? (
        <p>No recordings found.</p>
      ) : (
        <div className="recordings-table-wrapper">
          <table className="recordings-table">
            <thead>
              <tr>
                <th>Filename</th>
                <th>Size</th>
                <th>Duration (sec)</th>
                <th>Play</th>
              </tr>
            </thead>
            <tbody>
              {recordings.map((file, idx) => (
                <tr key={idx}>
                  <td>{file.name}</td>
                  <td>{formatBytes(file.size)}</td>
                  <td>{file.duration != null ? file.duration : 'N/A'}</td>
                  <td>
                    <button
                      className="play-button"
                      onClick={() => setSelectedFile(file.name)}
                    >
                      ▶️ Play
                    </button>
                    {selectedFile === file.name && (
                      <audio controls autoPlay>
                        <source
                          src={`http://localhost:5000/api/recordings/play/${file.name}`}
                          type="audio/wav"
                        />
                        Your browser does not support the audio tag.
                      </audio>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default RecordingsManager;
