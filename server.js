const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files
app.use(express.static(__dirname));
app.use(express.json());

// Serve pages from the pages directory
app.use('/pages', express.static(path.join(__dirname, 'pages')));

// API endpoint to save pages to actual files
app.post('/api/save-page', (req, res) => {
    const { title, url, category, customCategory, htmlContent } = req.body;
    
    if (!title || !url || !htmlContent) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Create directory for the category if it doesn't exist
    const categoryPath = category === 'custom' ? customCategory : category;
    const dirPath = path.join(__dirname, 'pages', categoryPath);
    
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
    
    // Write the HTML file
    const filePath = path.join(dirPath, `${url}.html`);
    fs.writeFileSync(filePath, htmlContent);
    
    res.json({ success: true, path: `/pages/${categoryPath}/${url}.html` });
});

// Create pages directory if it doesn't exist
if (!fs.existsSync(path.join(__dirname, 'pages'))) {
    fs.mkdirSync(path.join(__dirname, 'pages'));
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});