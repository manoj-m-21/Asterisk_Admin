const fs = require("fs");
const path = require("path");
const TEST_FILE = path.join(__dirname, "../test/pjsip_test.conf");

function formatExtensionBlock(ext, pass) {
  return `
[${ext}]
type = endpoint
context = from-internal
dtmf_mode = auto
disallow = all
allow = ulaw,alaw,ilbc,opus,h264
auth = auth${ext}
aors = ${ext}
direct_media = no
rewrite_contact = yes
force_rport = yes
rtp_symmetric = yes
transport = transport-udp
timers = no
rtp_timeout = 30
rtp_timeout_hold = 30
message_context = messages
language = en-en
sdp_session = asterisk
callerid = ${ext}<${ext}>
ice_support = no

[auth${ext}]
type = auth
auth_type = userpass
username = ${ext}
password = ${pass}

[${ext}]
type = aor
max_contacts = 5
qualify_frequency = 60
qualify_timeout = 5
`;
}

function saveTestExtension(extension, password) {
  const block = formatExtensionBlock(extension, password);
  fs.appendFile(TEST_FILE, block, (err) => {
    if (err) return console.error("❌ Error writing test file:", err);
    console.log(`✅ Test extension ${extension} written to test file.`);
  });
}

async function writeExtensionToAsterisk(extension, password) {
    try {
        saveTestExtension(extension, password);
    } catch (error) {
        console.error("Error writing extension to Asterisk test file:", error);
        throw error;
    }
}

module.exports = { writeExtensionToAsterisk };
