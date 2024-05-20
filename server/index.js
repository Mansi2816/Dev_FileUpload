const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();

//to make this uploaded file accessible, we will use static
app.use("/files", express.static("files"));

const PORT = 5000;

// Middlewares
app.use(express.json());
app.use(cors());

// Ensure the files directory exists
const filesDir = path.join(__dirname, 'files');
if (!fs.existsSync(filesDir)) {
  fs.mkdirSync(filesDir);
}

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/FileUpload')
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
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix);
  }
});

require("./PdfDetails")
const PdfSchema = mongoose.model("PdfDetails")

const upload = multer({ storage: storage });

// Route for file upload
app.post("/upload-files", upload.single("file"), async (req, res) => {
  console.log(req.file);
  const title = req.body.title;
  const fileName = req.file.filename;
  try {
    await PdfSchema.create({ title: title, pdf: fileName });
    res.send({ status: "ok" });
  } catch (error) {
    res.json({ status: error });
  }
});

app.get("/get-files", async (req, res) => {
  try {
    PdfSchema.find({}).then((data) => {
      res.send({ status: "ok", data: data });
    });
  } catch (error) {}
});

//apis----------------------------------------------------------------
app.get("/", async (req, res) => {
  res.send("Success!!!!!!");
});