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

    try {
        // ========================================
        // TODO: Task 6 (Bonus) - API Endpoint
        // ========================================
        // Create a /api/time endpoint that returns current date/time as JSON
        // Uncomment and complete the code below:
        
        /*
        if (req.url === '/api/time' && req.method === 'GET') {
            const currentDateTime = new Date().toISOString();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                datetime: currentDateTime,
                timestamp: Date.now()
            }));
            return;
        }
        */


        // ========================================
        // TODO: Task 2 - Route Mapping
        // ========================================
        // Map URLs to HTML files in the public folder
        // Complete the if-else chain below:
        
        let filePath;
        if (req.url === '/') {
            // Home page
            filePath = path.join(PUBLIC_DIR, 'index.html');
        } 
        // TODO: Add 'else if' for '/about' -> 'about.html'
        // Example: else if (req.url === '/about') { filePath = path.join(PUBLIC_DIR, 'about.html'); }
        
        
        // TODO: Add 'else if' for '/contact' -> 'contact.html'
        
        
        // ========================================
        // TODO: Task 4 - Serve CSS Files
        // ========================================
        // Handle requests for CSS files from /styles/ folder
        // Uncomment and complete the security check:
        
        /*
        else if (req.url.startsWith('/styles/')) {
            filePath = path.join(PUBLIC_DIR, req.url);
            
            // Security: Prevent path traversal attacks (../ in URL)
            const normalizedPath = path.normalize(filePath);
            if (!normalizedPath.startsWith(PUBLIC_DIR)) {
                handle404(res);
                return;
            }
        }
        */
        else {
            // No route matched -> 404
            handle404(res);
            return;
        }


        // ========================================
        // TODO: Task 3 - Serve Files
        // ========================================
        // Read the file and send it to the client
        // Complete the code below:
        
        // Step 1: Get the file extension (e.g., '.html', '.css')
        const extname = path.extname(filePath);
        
        // Step 2: Get the content type from MIME_TYPES object
        const contentType = MIME_TYPES[extname] || 'text/html';

        // Step 3: Read the file
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
                // TODO: Send success response
                // Use res.writeHead() to set status code 200 and Content-Type header
                // Use res.end() to send the file content
                
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });

    } catch (error) {
        // Catch any unexpected errors
        handleServerError(res, error);
    }
});


// ========================================
// TODO: Task 5 - Error Handling Functions
// ========================================

// Function to handle 404 errors (Page Not Found)
function handle404(res) {
    // Step 1: Create the path to 404.html
    const notFoundPath = path.join(PUBLIC_DIR, '404.html');
    
    // Step 2: Try to read and serve the 404.html file
    // TODO: Use fs.readFile() to read notFoundPath
    // If successful: Send 404 status with the HTML content
    // If failed: Send 404 status with plain text "404 - Page Not Found"
    
    // Example structure:
    /*
    fs.readFile(notFoundPath, (err, content) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 - Page Not Found');
        } else {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
        }
    });
    */
}

// Function to handle 500 errors (Server Error)
function handleServerError(res, error) {
    // Step 1: Log the error to the console
    // TODO: Use console.error() to log the error
    
    
    // Step 2: Create the path to 500.html
    const serverErrorPath = path.join(PUBLIC_DIR, '500.html');
    
    // Step 3: Try to read and serve the 500.html file
    // TODO: Similar to handle404, read serverErrorPath and serve it
    // If successful: Send 500 status with the HTML content
    // If failed: Send 500 status with plain text "500 - Internal Server Error"
    
}


// ========================================
// TODO: Task 1 - Start the Server
// ========================================
// Start listening for requests on PORT 3000
server.listen(PORT, () => {
    // TODO: Log a message to indicate the server is running
    // Example: console.log(`Server is running on http://localhost:${PORT}`);
    
    
    // Bonus: You can also log the available routes for better user experience
    /*
    console.log('Available routes:');
    console.log('  GET /              -> index.html');
    console.log('  GET /about         -> about.html');
    console.log('  GET /contact       -> contact.html');
    */
});
