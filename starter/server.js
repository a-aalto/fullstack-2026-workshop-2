const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

// MIME types for different file extensions
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json'
};

// Create HTTP server
const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    // /api/time endpoint that returns current date/time as JSON
    try {
        if (req.url === '/api/time' && req.method === 'GET') {
            const currentDateTime = new Date().toISOString();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                datetime: currentDateTime,
                timestamp: Date.now()
            }));
            return;
        }
        
        // Map URLs to HTML files in the public folder
        let filePath;

        // home page
        if (req.url === '/') {
            
            filePath = path.join(PUBLIC_DIR, 'index.html');
        }

       // about page
        else if (req.url === '/about') {
            filePath = path.join(PUBLIC_DIR, '/about.html');
        }

        // contact page
        else if (req.url === '/contact') {
            filePath = path.join(PUBLIC_DIR, '/contact.html');
        }

        // Handle requests for CSS files from /styles/ folder
        else if (req.url.startsWith('/styles/')) {
            filePath = path.join(PUBLIC_DIR, req.url);
            
            // Prevent path traversal attacks (../ in URL)
            const normalizedPath = path.normalize(filePath);
            if (!normalizedPath.startsWith(PUBLIC_DIR)) {
                handle404(res);
                return;
            }
        }
        
        else {
            // No route matched -> 404
            handle404(res);
            return;
        }

        // Read the file and send it to the client
        
        // Get the file extension (e.g., '.html', '.css')
        const extname = path.extname(filePath);
        
        // Get the content type from MIME_TYPES object
        const contentType = MIME_TYPES[extname] || 'text/html';

        // Read the file
        fs.readFile(filePath, (err, content) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    // File not found
                    handle404(res);
                } else {
                    // Server error
                    handleServerError(res, err);
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });

    } catch (error) {
        // Catch any unexpected errors
        handleServerError(res, error);
    }
});

// Function to handle 404 errors (Page Not Found)
function handle404(res) {
    // Create the path to 404.html
    const notFoundPath = path.join(PUBLIC_DIR, '404.html');
    
    // Try to read and serve the 404.html file
    // If successful: Send 404 status with the HTML content
    // If failed: Send 404 status with plain text "404 - Page Not Found"
    
    fs.readFile(notFoundPath, (err, content) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 - Page Not Found');
        } else {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
        }
    });
    
}

// Function to handle 500 errors (Server Error)
function handleServerError(res, error) {

    // Log the error
    console.error("Server error (500).");
    
    // Create the path to 500.html
    const serverErrorPath = path.join(PUBLIC_DIR, '500.html');
    
    // Try to read and serve the 500.html file
    // If successful: Send 500 status with the HTML content
    // If failed: Send 500 status with plain text "500 - Internal Server Error"

    fs.readFile(serverErrorPath, (err, content) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('505 - Internal Server Error');
        } else {
            res.writeHead(500, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
        }
    });
}

// Start the server -> listening for requests on PORT 3000
server.listen(PORT, () => {
    // Log a message when the server is running
    console.log(`Server is running on http://localhost:${PORT}`);
    
    // show available routes
    console.log('Available routes:');
    console.log('  GET /              -> index.html');
    console.log('  GET /about         -> about.html');
    console.log('  GET /contact       -> contact.html');
});
