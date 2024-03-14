require('dotenv').config();

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./model');
const generateUsername = require('../../utils/names'); 
const { body, validationResult } = require('express-validator');


// Get all users endpoint
router.get('/', async (req, res) => {
  try {
    // Fetch all users from the database, excluding password and airdropReceived
    const users = await User.find({}, { password: 0, airdropReceived: 0, transactions: 0});

    // Respond with the users
    res.status(200).json(users);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Signup endpoint
router.post('/register', 
    // Validation middleware for userName and password
    [
        body('userName').notEmpty().withMessage('Username is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    ],
    async (req, res) => {
        try {
            // Check for validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // Extract user data from request body
            const { userName, password } = req.body;

            // Generate unique codeName
            const codeName = await generateUsername(); 

            // Check if user already exists
            const existingUser = await User.findOne({ userName });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create new user
            const newUser = new User({
                userName,
                codeName,
                password: hashedPassword
            });

            // Save the user to the database
            await newUser.save();

            // Respond with success message
            res.status(201).json({ 
                message: 'User created successfully',
                codeName: newUser.codeName,
            });
        } catch (error) {
            // Handle errors
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
);

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    // Extract user data from request body
    const { userName, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username' });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Set the JWT token as a secure cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: true, // Set to true if your app uses HTTPS
      maxAge: 3600000, // Token expiration time in milliseconds (1 hour)
      sameSite: 'strict' // Set the sameSite attribute to mitigate CSRF attacks
    });

    // Authentication successful
    res.status(200).json({ 
      message: 'Login successful',
      user: user,
      token: token, 
    });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Subsequent middleware or route handler that requires the token
router.get('/protected-route', (req, res) => {
  // Access the token from the req object
  const token = req.token;

});

// Route to get user data
// Middleware to extract user ID from JWT token
const extractUserId = (req, res, next) => {
  // Extract JWT token from request headers
  const token = req.headers.authorization?.split(' ')[1];

  // Verify and decode the token to extract user ID
  if (token) {
    try {
      const decoded = jwt.verify(token, '123coolboy');
      req.userId = decoded.userId; // Assuming user ID is stored in the token
    } catch (error) {
      console.error('Error decoding JWT token:', error);
    }
  }

  next(); // Call the next middleware
};

// Apply the middleware to the route
router.get('/getUser', extractUserId, async (req, res) => {
  try {
    const userData = await User.findById(req.userId);
    if (!userData) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// Logout endpoint
router.post('/logout', (req, res) => {
  try {
    // Clear the JWT cookie by setting it to an empty value with an expired date
    res.clearCookie('jwt', { path: '/' }); // Replace 'jwt' with your cookie name
    
    // Send a response indicating successful logout
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



 
module.exports = router;
