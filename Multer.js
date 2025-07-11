const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const app = express();

// Storage config: save all files in 'uploads', prefix filename with date
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads';
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const datePrefix = `${year}-${month}-${day}`;
    cb(null, `${datePrefix}-${file.originalname}`);
  }
});

// File filter to allow only images except .ico and .webp
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (
    (file.mimetype.startsWith('image/')) &&
    ext !== '.ico' &&
    ext !== '.webp'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (not .ico or .webp) are allowed!'), false);
  }
};

const upload = multer({ storage, fileFilter });

// Serve uploads folder
app.use('/uploads', express.static('uploads'));

app.use(cors());

// Helper: Recursively get all image filenames in uploads and subfolders
const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg'];
function getAllImageFilenames(dir) {
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  list.forEach(file => {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      results = results.concat(getAllImageFilenames(filePath));
    } else if (IMAGE_EXTS.includes(path.extname(file.name).toLowerCase())) {
      results.push(file.name);
    }
  });
  return results;
}

app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded or invalid file type.');
  }
  // Return the correct file URL for frontend preview
  const fileUrl = '/' + req.file.path.replace(/\\/g, '/'); // for Windows compatibility
  res.json({ fileUrl });
});

app.get('/gallery', (req, res) => {
  try {
    const filenames = getAllImageFilenames('uploads');
    res.json(filenames);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read uploads folder.' });
  }
});

app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
