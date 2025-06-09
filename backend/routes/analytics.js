const express = require('express');
const router = express.Router();
const { NodeSSH } = require('node-ssh');
const SSH_CONFIG = require('../config/sshConfig');

const ssh = new NodeSSH();

// Helper function to execute Asterisk CLI commands
async function executeAsteriskCommand(command) {
  try {
    await ssh.connect({
      ...SSH_CONFIG,
      tryKeyboard: true,
      onKeyboardInteractive: (name, instructions, lang, prompts, finish) => {
        finish([SSH_CONFIG.password]);
      },
    });

    const result = await ssh.execCommand(`sudo asterisk -rx "${command}"`);
    
    if (result.stderr) {
      throw new Error(result.stderr);
    }

    return result.stdout;
  } catch (error) {
    console.error('Error executing Asterisk command:', error);
    throw error;
  } finally {
    ssh.dispose();
  }
}

// Get call statistics
router.get('/stats', async (req, res) => {
  try {
    // Get active calls
    const activeCalls = await executeAsteriskCommand('core show calls count');
    const activeCallsCount = parseInt(activeCalls.trim()) || 0;

    // Get active channels
    const activeChannels = await executeAsteriskCommand('core show channels count');
    const activeChannelsCount = parseInt(activeChannels.trim()) || 0;

    // Get call volume for the last 7 days
    const callVolume = await executeAsteriskCommand('core show calls last 7 days');
    const callVolumeData = parseCallVolumeData(callVolume);

    // Get call distribution
    const callDistribution = await executeAsteriskCommand('core show calls distribution');
    const callDistributionData = parseCallDistributionData(callDistribution);

    res.json({
      stats: {
        totalCalls: activeCallsCount,
        activeUsers: activeChannelsCount,
        averageCallDuration: 4.5, // This would need to be calculated from actual call data
        callSuccessRate: 92 // This would need to be calculated from actual call data
      },
      callVolumeData,
      callDistributionData
    });
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    res.status(500).json({ error: 'Failed to fetch analytics data' });
  }
});

// Helper function to parse call volume data
function parseCallVolumeData(data) {
  const lines = data.split('\n');
  const volumeData = [];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Initialize with zero values
  days.forEach(day => {
    volumeData.push({ name: day, calls: 0 });
  });

  // Parse the actual data
  lines.forEach(line => {
    const match = line.match(/(\w+)\s+(\d+)/);
    if (match) {
      const day = match[1].substring(0, 3);
      const calls = parseInt(match[2]);
      const index = volumeData.findIndex(d => d.name === day);
      if (index !== -1) {
        volumeData[index].calls = calls;
      }
    }
  });

  return volumeData;
}

// Helper function to parse call distribution data
function parseCallDistributionData(data) {
  const lines = data.split('\n');
  const distributionData = [];
  
  lines.forEach(line => {
    const match = line.match(/(\w+)\s+calls:\s+(\d+)/);
    if (match) {
      distributionData.push({
        name: match[1],
        value: parseInt(match[2])
      });
    }
  });

  return distributionData;
}

module.exports = router; 