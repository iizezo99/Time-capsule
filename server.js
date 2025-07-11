const express = require('express');
const path = require('path');
const app = express();

// Serve all static files (HTML, CSS, JS, images, etc.) from the project root
app.use(express.static(__dirname));

// Fallback: always serve index.html for unknown routes (for SPA-like behavior)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Frontend server running at http://localhost:${PORT}`);
});
