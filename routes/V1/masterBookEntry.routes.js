const express = require("express");
const router = express.Router();

const masterBookController = require("../../controller/V1/MasterBookEntry.js");

const { protect } = require("../../middleware/auth.middleware.js");

// here / is equal to /api/Book
router.get('/', masterBookController.getAllBook);

// Display one user by ID
router.get('/:id', masterBookController.getBookById);

// Login
router.post('/login', masterBookController.loginUser);

// Signup
router.post('/signup', masterBookController.sigbUp);

// Delete user by email
router.delete('/:email', masterBookController.deleteUserByEmail);

//issue book
router.post('/issuebook',masterBookController)

module.exports = router;