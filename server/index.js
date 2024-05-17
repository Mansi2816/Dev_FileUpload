const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');

const app = express();
const PORT = 5000;

// Middlewares
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/FileUpload')
  .then(() => {
    console.log('Connected to MongoDB successfully');
    // Start the server once connected to the database
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Define Schema and Model for File Upload
const fileSchema = new mongoose.Schema({
  // Define schema fields for your file upload
  // Example: name, type, size, path, etc.
  name: String,
  type: String,
  size: Number,
  path: String
});
const File = mongoose.model('File', fileSchema);

// Multer Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './files');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Route for file upload
app.post("/upload-files", upload.single("file"), async (req, res) => {
  try {
    console.log(req.file); // Log uploaded file details
    // Save file details to MongoDB or perform other operations
    res.send('File uploaded successfully');
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).send('Internal Server Error');
  }
});
