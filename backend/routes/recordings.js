const express = require('express');
const path = require('path');
const Client = require('ssh2-sftp-client');
const { Client: SSHClient } = require('ssh2');
const cors = require('cors');
const { Readable } = require('stream'); // Node.js readable stream
const SSH_CONFIG = require('../config/sshConfig');

const router = express.Router();

const recordingsDir = '/var/asterisk-recordings';

// Helper: Get duration using ffprobe via SSH
function getDuration(fileName) {
  return new Promise((resolve) => {
    const conn = new SSHClient();
    const remotePath = `${recordingsDir}/${fileName}`;
    const ffprobeCmd = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${remotePath}"`;

    conn
      .on('ready', () => {
        conn.exec(ffprobeCmd, (err, stream) => {
          if (err) {
            conn.end();
            return resolve(null);
          }

          let output = '';
          stream.on('data', (chunk) => (output += chunk.toString()));
          stream.on('close', () => {
            conn.end();
            const duration = parseFloat(parseFloat(output.trim()).toFixed(2));
            resolve(isNaN(duration) ? null : duration);
          });
        });
      })
      .on('error', () => resolve(null))
      .connect(SSH_CONFIG);
  });
}

// CORS middleware for handling pre-flight requests globally
router.use(cors());

// GET /api/recordings - List recordings with durations
router.get('/', async (req, res) => {
  const sftp = new Client();

  try {
    await sftp.connect(SSH_CONFIG);
    const files = await sftp.list(recordingsDir);
    const audioFiles = files.filter((file) => /\.(wav|mp3|ogg)$/i.test(file.name));
    await sftp.end();

    const recordingsWithDurations = await Promise.all(
      audioFiles.map(async (file) => {
        const duration = await getDuration(file.name);
        return { ...file, duration };
      })
    );

    res.json({ recordings: recordingsWithDurations });
  } catch (err) {
    console.error('Failed to fetch recordings:', err.message);
    res.status(500).json({ error: 'Unable to read recordings from VM' });
  }
});

// GET /api/recordings/play/:filename - Stream file
router.get('/play/:filename', async (req, res) => {
  const fileName = req.params.filename;
  const filePath = `${recordingsDir}/${fileName}`;
  const ext = path.extname(fileName).toLowerCase();

  let contentType = 'audio/wav';
  if (ext === '.mp3') contentType = 'audio/mpeg';
  else if (ext === '.ogg') contentType = 'audio/ogg';

  const sftp = new Client();

  try {
    await sftp.connect(SSH_CONFIG);
    const stream = await sftp.get(filePath); // Get the file (this could be a buffer or stream)

    // Debugging: Check the type of `stream`
    console.log('Stream type:', typeof stream);

    // Handle buffer case
    if (Buffer.isBuffer(stream)) {
      console.log('Received buffer stream');
      const bufferStream = new Readable();
      bufferStream.push(stream); // Push the buffer data to the stream
      bufferStream.push(null); // End the stream
      bufferStream.pipe(res); // Pipe it to the response
      bufferStream.on('end', () => {
        console.log('Buffer stream ended');
        res.end(); // Ensure the response is properly closed
      });
    } else if (stream && stream.pipe) {
      console.log('Received readable stream');
      stream.pipe(res); // If it's already a readable stream, pipe it directly
      stream.on('end', () => {
        console.log('Stream ended');
        res.end(); // Ensure the response is properly closed
      });
    } else {
      console.error('The retrieved stream is neither a buffer nor a readable stream.');
      throw new Error('Stream type error');
    }

    // ✅ CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // ✅ Audio headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);

    // ✅ CORP header to resolve resource policy issue
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

  } catch (err) {
    console.error('Failed to stream recording:', err);
    res.status(500).json({ error: 'Unable to stream recording from VM' });
  } finally {
    // Close the SFTP connection after stream is sent
    sftp.end();
  }
});

module.exports = router;
