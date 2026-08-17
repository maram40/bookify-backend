# Bookify Backend

## Project Description

Bookify is a backend API for managing books. The project provides CRUD operations for books and supports image uploading using Multer.

## Features

* Create a new book
* Get all books
* Get a single book by ID
* Update a book
* Delete a book
* Upload a book image using Multer
* Store the uploaded image path with the book data in MongoDB
* Serve uploaded images through the API

## Technologies Used

* Node.js
* Express.js
* MongoDB
* Mongoose
* Multer
* Nodemon
* dotenv

## Project Structure

The main project contains the following important files and folders:

* `index.js` — Main server file and API routes
* `models/bookModel.js` — Book database model
* `uploads/` — Stores uploaded book images
* `package.json` — Project dependencies and scripts
* `.env` — Environment variables

## How to Run the Project

1. Open the project folder in the terminal.
2. Install the project dependencies.
3. Make sure MongoDB is available.
4. Start the server using the project's start command.
5. The API runs on port 5000 by default.

## API Usage

### Create a Book

Send a POST request to `/books`.

The request uses `multipart/form-data` and contains the book title, description, price, category, and an image file.

The image field must be named `image`.

### Get All Books

Send a GET request to `/books` to retrieve all books stored in the database.

### Get One Book

Send a GET request to `/books/:id` and provide the book ID to retrieve a specific book.

### Update a Book

Send a PATCH request to `/books/:id` with the information that needs to be updated.

### Delete a Book

Send a DELETE request to `/books/:id` to delete a specific book.

## File Upload

Book images are uploaded using Multer.

The uploaded image is saved inside the `uploads/` folder, and its path is stored with the corresponding book document in MongoDB.

## Example of Creating a Book

When creating a book, the request should contain:

* Title: The book title
* Description: A short description of the book
* Price: The book price
* Category: The book category
* Image: The book cover image

The request should be sent as `multipart/form-data`.

## Server

The backend server runs on port 5000 by default.

The API base URL is:

`http://localhost:5000`
