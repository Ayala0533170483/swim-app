const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../logs/server.log');

function log(message, data = null) {
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] ${message}${data ? ' | ' + JSON.stringify(data) : ''}\n`;

  fs.appendFile(logFilePath, logLine, err => {
    if (err) {
      console.error('Failed to write log:', err);
    }
  });
}

module.exports = { log };
