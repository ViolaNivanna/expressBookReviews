const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//  see if the username exists in the list of registered users, to avoid duplications and keep the username unique
const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

// Register new users, post request that accepts username and password through the body. The user doesn’t have to be authenticated to access this endpoint.
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message : "User successfully registred. Now you can login"})
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
/*
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});
*/
// Using Promises
public_users.get('/books', async function (req, res) {
    try {
      // Asynchronously wait for JSON.stringify
      const booksJSON = await new Promise((resolve, reject) => {
        resolve(JSON.stringify({ books }, null, 4));
      });
  
      // Send async response
      res.send(booksJSON);
  
    } catch (err) {
      res.status(500).send("An error occurred while getting the list of books.");
    }
});

// Get book details based on ISBN
/*
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn])
 });
 */
// Using Promises
public_users.get('/books/isbn/:isbn', async function (req, res) {
    try {
      // Asynchronously wait for finding book with wanted ISBN
      const isbnBook = await new Promise((resolve, reject) => {
        const isbn = req.params.isbn;
        resolve(books[isbn]);
      });
  
      // Send async response
      res.send(isbnBook);
  
    } catch (err) {
      res.status(500).send("An error occurred while getting the book with ISBN " + isbn);
    }
  });
    
  
// Get book details based on author
/*
public_users.get('/author/:author',function (req, res) {
    
  //1. Obtain all the keys for the ‘books’ object.
  //2. Iterate through the ‘books’ array & check the author matches the one provided in the request parameters.
    
  const author = req.params.author;
  
  let bookDetails = Object.values(books);
  
  let filteredBooks = bookDetails.filter(book => book.author === author);
  
  res.send(filteredBooks)
});
*/
  
// Using Promises
public_users.get('/books/author/:author', async function (req, res) {
  try {
    // Asynchronously wait for finding book by author
    const authorBook = await new Promise((resolve, reject) => {
      const author = req.params.author;
      let bookDetails = Object.values(books);
      let filteredBooks = bookDetails.filter(book => book.author === author);
        
      resolve(filteredBooks);
    });
  
    // Send async response
    res.send(authorBook);
  
  } catch (err) {
    res.status(500).send("An error occurred while finding book by author " + author);
  }
});
  

// Get all books based on title
/*
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;

  let bookDetails = Object.values(books);

  let filteredBooks = bookDetails.filter(book => book.title === title);

  res.send(filteredBooks)
});
*/
// Using Promises
public_users.get('/books/title/:title', async function (req, res) {
    try {
      // Asynchronously wait for finding book by title
      const titleBook = await new Promise((resolve, reject) => {
        const title = req.params.title;
        let bookDetails = Object.values(books);
        let filteredBooks = bookDetails.filter(book => book.title === title);
        
        resolve(filteredBooks);
      });
  
      // Send async response
      res.send(titleBook);
  
    } catch (err) {
      res.status(500).send("An error occurred while finding book with title " + title);
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]["reviews"])
});

module.exports.general = public_users;
