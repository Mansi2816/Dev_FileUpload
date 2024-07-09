import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { Workbook } from 'exceljs';  // Import the exceljs library to process Excel files

const app = express();

// To make the uploaded file accessible, we will use static
app.use("/files", express.static(path.join(__dirname, "../files")));

const PORT = 5000;

// Middlewares
app.use(express.json());
app.use(cors());

// Ensure the files directory exists
const filesDir = path.join(__dirname, '../files');
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

// Define type(interface) and Schema and Model for File Upload
interface IFile extends mongoose.Document {
  name: string;
  type: string;
  size: number;
  path: string;
}

const fileSchema = new mongoose.Schema<IFile>({
  name: { type: String, required: true },
  type: { type: String, required: true },
  size: { type: Number, required: true },
  path: { type: String, required: true }
});

const File = mongoose.model<IFile>('File', fileSchema);

// Multer Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, filesDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix);
  }
});

const upload = multer({ storage: storage });

// Route for file upload
app.post("/upload-files", upload.single("file"), async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).send({ status: "error", message: "No file uploaded" });
  }
  
  const { originalname, mimetype, size, filename } = req.file;

  // Check if the file is an Excel file
  if (mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && mimetype !== 'application/vnd.ms-excel') {
    return res.status(400).send({ status: "error", message: "Invalid file type. Only Excel files are allowed." });
  }

  // Process the Excel file
  try {
    const workbook = new Workbook();
    await workbook.xlsx.readFile(path.join(filesDir, filename));
    const worksheet = workbook.worksheets[0];  // Assuming you want to work with the first sheet

    // Read data from the worksheet and collect it in an array
    const rows: any[] = [];
    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      rows.push(row.values);
      console.log(`Row ${rowNumber}: ${row.values}`);
    });

    // Save file metadata to the database
    const newFile = new File({
      name: originalname,
      type: mimetype,
      size: size,
      path: filename
    });

    await newFile.save();
    
    // Return the saved file information along with the Excel data
    res.send({ status: "ok", file: newFile, excelData: rows });
  } catch (error) {
    res.status(500).json({ status: "error", message: (error as Error).message  });
  }
});

app.get("/get-files", async (req: Request, res: Response) => {
  try {
    const files = await File.find({});
    res.send({ status: "ok", data: files });
    console.log(files);
    
  } catch (error) {
    res.status(500).json({ status: "error", message: (error as Error).message });
  }
});

// APIs
app.get("/", (req: Request, res: Response) => {
  res.send("Success!!!!!!");
});
