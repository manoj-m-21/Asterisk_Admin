const fs = require("fs");
const { NodeSSH } = require("node-ssh");
const path = require("path");
const SSH_CONFIG = require('../config/sshConfig');

const ssh = new NodeSSH();

const REMOTE_PATH = "/etc/asterisk/pjsip.custom.conf";


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

async function writeToRemoteAsterisk(extension, password) {
    const content = formatExtensionBlock(extension, password);

    try {
        await ssh.connect({
            ...SSH_CONFIG,
            tryKeyboard: true,
            onKeyboardInteractive: (name, instructions, lang, prompts, finish) => {
                finish([SSH_CONFIG.password]);
            },
        });

        // Step 1: Append extension config
        const escapedContent = content.replace(/'/g, `'\\''`);
        const appendResult = await ssh.execCommand(
            `bash -c "echo '${escapedContent}' >> ${REMOTE_PATH}"`
        );

        if (appendResult.stderr) {
            console.error("❌ Remote command error (append):", appendResult.stderr);
            return;
        }

        console.log(`✅ Extension ${extension} written to remote Asterisk config.`);

        // Step 2: Reload PJSIP
        const reloadResult = await ssh.execCommand(`sudo asterisk -rx "pjsip reload"`);

        if (reloadResult.stderr) {
            console.error("⚠️ PJSIP Reload stderr:", reloadResult.stderr);
        } else {
            console.log("🔁 PJSIP Reloaded successfully.\n", reloadResult.stdout);
        }
    } catch (error) {
        console.error("❌ SSH write error:", error);
    } finally {
        ssh.dispose();
    }
}

async function deleteExtensionFromAsterisk(extension) {
    try {
        await ssh.connect({
            ...SSH_CONFIG,
            tryKeyboard: true,
            onKeyboardInteractive: (name, instructions, lang, prompts, finish) => {
                finish([SSH_CONFIG.password]);
            },
        });

        const deleteCommand = `
sudo sed -i '/^\\[${extension}\\]/,/^$/d' ${REMOTE_PATH};
sudo sed -i '/^\\[auth${extension}\\]/,/^$/d' ${REMOTE_PATH};
sudo sed -i '/^\\[${extension}\\]/,/^$/d' ${REMOTE_PATH}
`;

        const result = await ssh.execCommand(deleteCommand);
        if (result.stderr) {
            console.error("❌ Error deleting extension from remote:", result.stderr);
            return;
        }

        console.log(`🗑️ Extension ${extension} removed from Asterisk config.`);

        // Reload pjsip
        const reloadResult = await ssh.execCommand(`sudo asterisk -rx "pjsip reload"`);

        if (reloadResult.stderr) {
            console.error("⚠️ PJSIP Reload stderr:", reloadResult.stderr);
        } else {
            console.log("🔁 PJSIP Reloaded after delete.\n", reloadResult.stdout);
        }
    } catch (error) {
        console.error("❌ SSH delete error:", error);
    } finally {
        ssh.dispose();
    }
}

async function fetchAllExtensionStatuses() {
    try {
        await ssh.connect({
            ...SSH_CONFIG,
            tryKeyboard: true,
            onKeyboardInteractive: (name, instructions, lang, prompts, finish) => {
                finish([SSH_CONFIG.password]);
            },
        });

        // Run the Asterisk command to fetch endpoint status
        const result = await ssh.execCommand(`sudo asterisk -rx "pjsip show endpoints"`);
        console.log("⚡ Asterisk Output:", result.stdout);  // Log the output from Asterisk

        if (result.stderr) {
            console.error("❌ Error from Asterisk:", result.stderr);
            throw new Error(result.stderr);
        }

        // Process the command output
        const output = result.stdout;
        console.log("📊 Raw Output:", output);  // Log the raw output

        const lines = output.split('\n');
        const statusMap = {};
        let currentExt = null;

        for (let line of lines) {
            line = line.trim();

            // Match the line that starts a new endpoint
            const endpointMatch = line.match(/^Endpoint:\s+(\d+)\//);
            if (endpointMatch) {
                currentExt = endpointMatch[1]; // Store extension number
            }

            // Match the Contact line with status (ensure flexible matching for 'Avail', 'Unavailable', or 'Unknown')
            const contactMatch = line.match(/^Contact:\s+\S+\s+\S+\s+(Avail|Unavailable|Unknown|Not in use)/i);
            if (contactMatch && currentExt) {
                const status = contactMatch[1].toLowerCase();
                // Handle the status properly
                if (status === 'avail') {
                    statusMap[currentExt] = 'Available';
                } else if (status === 'unavailable') {
                    statusMap[currentExt] = 'Unavailable';
                } else if (status === 'not in use') {
                    statusMap[currentExt] = 'Offline';  // Handling 'Not in use' status
                } else {
                    statusMap[currentExt] = 'Offline';  // Handling any other status
                }
            }
        }

        // Log the processed status map to verify the result
        // At the end of fetchAllExtensionStatuses, before returning:
        console.log("📊 Final Status Output:");
        for (const [ext, status] of Object.entries(statusMap)) {
            console.log(`{'${ext}': '${status}'}`);
        }
        // Log the final status map

        return statusMap;
    } catch (error) {
        console.error("❌ Error fetching statuses from Asterisk:", error);
        throw error;
    } finally {
        ssh.dispose();
    }
}


module.exports = {
    writeToRemoteAsterisk,
    deleteExtensionFromAsterisk,
    fetchAllExtensionStatuses // <-- add this
};

