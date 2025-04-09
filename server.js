const express = require('express');
const fs = require('fs');
const path = require('path');
const os = require('os');
const app = express();
const port = 8080; // ポート8080を維持（必要なら3000などに変更）

app.use(express.static('public'));

app.get('/config', (req, res) => {
  const configPath = path.join(__dirname, 'config.txt');
  fs.readFile(configPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading config.txt:', err);
      return res.status(500).json({ error: 'Failed to read config file' });
    }
    const config = {};
    data.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) config[key.trim()] = value.trim();
    });
    res.json(config);
  });
});

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) { // Wi-Fiインターフェースを優先
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const localIP = getLocalIP();

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://${localIP}:${port}`);
});