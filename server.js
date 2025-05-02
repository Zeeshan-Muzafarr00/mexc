const express = require('express');
const { checkForUpdates } = require('./index');
const app = express();
const port = process.env.PORT || 3000;

// Basic health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start the server
app.listen(port, () => {
    console.log(`MEXC Watcher server running on port ${port}`);
    console.log('Health check available at: http://localhost:' + port + '/health');
    
    // Start the watcher
    checkForUpdates();
    setInterval(checkForUpdates, 5 * 60 * 1000);
}); 