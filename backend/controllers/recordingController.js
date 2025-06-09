const { Client } = require('ssh2');

exports.getRecordings = (req, res) => {
  const conn = new Client();

  conn.on('ready', () => {
    // First list all .wav files
    conn.exec('ls /var/asterisk-recordings/*.wav', (err, stream) => {
      if (err) return res.status(500).json({ error: 'SSH error during ls' });

      let fileList = '';
      stream.on('data', chunk => {
        fileList += chunk.toString();
      });

      stream.on('close', () => {
        const files = fileList
          .split('\n')
          .map(f => f.trim())
          .filter(f => f.length > 0);

        if (files.length === 0) {
          conn.end();
          return res.json({ recordings: [] });
        }

        const recordings = [];
        let pending = files.length;

        files.forEach(file => {
          // Get duration using ffprobe
          const ffprobeCmd = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${file}" && stat --format="%s %X %Y" "${file}"`;

          conn.exec(ffprobeCmd, (err, stream) => {
            if (err) {
              recordings.push({ name: file.split('/').pop(), duration: null });
              if (--pending === 0) {
                conn.end();
                return res.json({ recordings });
              }
              return;
            }

            let output = '';
            stream.on('data', chunk => {
              output += chunk.toString();
            });

            stream.on('close', () => {
              const [durationLine, statsLine] = output.trim().split('\n');
              const [size, accessTime, modifyTime] = statsLine.split(' ').map(Number);

              recordings.push({
                name: file.split('/').pop(),
                size,
                accessTime: accessTime * 1000,
                modifyTime: modifyTime * 1000,
                duration: durationLine ? parseFloat(parseFloat(durationLine).toFixed(2)) : null,
              });

              if (--pending === 0) {
                conn.end();
                return res.json({ recordings });
              }
            });
          });
        });
      });
    });
  }).connect({
    host: '172.16.0.140',
    port: 22,
    username: 'server',
    password: 'Admin@123',
  });
};
