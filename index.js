const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs"); 
require("dotenv").config();

const Book = require("./models/bookModel");

const app = express();

app.use(express.json());

// Make uploaded images accessible
app.use("/uploads", express.static("uploads"));



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,

  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|webp/;

    const extension = path.extname(file.originalname).toLowerCase();

    if (allowedTypes.test(extension)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  }
});



const PORT = process.env.PORT || 5000;

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/bookify";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("DB connected successfully!"))
  .catch((err) => console.log("DB connection error:", err));




app.post("/books", upload.single("image"), async (req, res) => {
  try {
    // Check if image was uploaded
    if (!req.file) {
      return res.status(400).json({
        status: "fail",
        message: "Book image is required"
      });
    }

    const newBook = await Book.create({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,

      // Save image path in MongoDB
      image: `/uploads/${req.file.filename}`
    });

    res.status(201).json({
      status: "success",
      data: { book: newBook }
    });

  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message
    });
  }
});




app.get("/books", async (req, res) => {
  try {
    const books = await Book.find();

    res.status(200).json({
      status: "success",
      results: books.length,
      data: { books }
    });

  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message
    });
  }
});



app.get("/books/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        status: "fail",
        message: "Book not found"
      });
    }

    res.status(200).json({
      status: "success",
      data: { book }
    });

  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message
    });
  }
});



// =========================
// UPDATE BOOK
// =========================

app.patch("/books/:id", upload.single("image"), async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        status: "fail",
        message: "Book not found"
      });
    }

    // تجهيز البيانات للتحديث بشكل آمن
    const updateData = {};
    if (req.body.title) updateData.title = req.body.title;
    if (req.body.description) updateData.description = req.body.description;
    if (req.body.price) updateData.price = req.body.price;
    if (req.body.category) updateData.category = req.body.category;

    // إذا تم رفع صورة جديدة أثناء التعديل
    if (req.file) {
      if (book.image) {
        const oldImagePath = path.join(__dirname, book.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      status: "success",
      data: { book: updatedBook }
    });

  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message
    });
  }
});

app.delete("/books/:id", async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);

    if (!deletedBook) {
      return res.status(404).json({
        status: "fail",
        message: "Book not found"
      });
    }

    if (deletedBook.image) {
      const imagePath = path.join(__dirname, deletedBook.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.status(204).json({
      status: "success",
      data: null
    });

  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message
    });
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});