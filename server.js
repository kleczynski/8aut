const http = require('http');

let change = false;

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    if (!change) {
        res.end('<h1>Initial Content</h1>');
        change = true;
    } else {
        res.end('<h1>Changed Content</h1>');
    }
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});
