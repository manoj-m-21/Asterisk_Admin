require('dotenv').config();

const SSH_CONFIG = {
  host: process.env.SSH_HOST,
  port: process.env.SSH_PORT || 22,
  username: process.env.SSH_USER,
  password: process.env.SSH_PASS,
};

module.exports = SSH_CONFIG;