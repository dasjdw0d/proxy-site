const express = require('express');
const { createBareServer } = require('@tomphttp/bare-server-node');
const http = require('http');
const path = require('path');

// Add debugging
const DEBUG = true;
function debug(...args) {
    if (DEBUG) console.log('[Debug]', ...args);
}

const app = express();
const port = process.env.PORT || 8000;

// Initialize server with app
const server = http.createServer(app);

// Create bare server
const bareServer = createBareServer('/bare/', {
    logErrors: true
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public'), {
    extensions: ['html', 'css', 'js', 'json'],
    index: 'index.html'
}));

// Add request logging middleware
app.use((req, res, next) => {
    debug(`${req.method} ${req.url}`);
    next();
});

// Handle requests
server.on('request', (req, res) => {
    if (bareServer.shouldRoute(req)) {
        debug('Bare server handling request:', req.url);
        bareServer.routeRequest(req, res);
    } else {
        debug('Express handling request:', req.url);
        app(req, res);
    }
});

// Handle upgrades
server.on('upgrade', (req, socket, head) => {
    if (bareServer.shouldRoute(req)) {
        debug('Bare server handling upgrade:', req.url);
        bareServer.routeUpgrade(req, socket, head);
    } else {
        debug('Closing socket upgrade:', req.url);
        socket.end();
    }
});

// Error handling
bareServer.on('error', (err) => {
    console.error('Bare server error:', err);
});

// Start server
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    debug('Debug mode enabled');
});

// Handle process termination
process.on('SIGINT', () => {
    debug('Shutting down...');
    server.close();
    process.exit();
});