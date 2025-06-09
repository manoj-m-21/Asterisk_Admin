const Client = require('ssh2-sftp-client');
const sftp = new Client();

sftp.connect({
  host: '172.16.0.140', // replace with your VM's IP
  port: '22',
  username: 'server',
  password: 'Admin@123' // or use privateKey if preferred
}).then(() => {
  return sftp.list('/var/asterisk-recordings/');
}).then(data => {
  console.log('Directory contents:', data);
}).catch(err => {
  console.error('SFTP error:', err.message);
});
