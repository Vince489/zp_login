require('dotenv').config();

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const auth = require("./../../middleware/auth");
const { createNewUser, authenticateUser } = require("../user/controller");
const { sendVerificationOTPEmail } = require("./../email_verification/controller");
const User = require('./model');
const generateUsername = require('../../utils/names'); 
const { body, validationResult } = require('express-validator');


// Get all users endpoint
router.get('/', async (req, res) => {
  try {
    // Fetch all users from the database, excluding password and airdropReceived
    const users = await User.find();

    // Respond with the users
    res.status(200).json(users);
  } catch (error) {
    // Handle errors 
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Signup endpoint
router.post('/signup',
    // Validation middleware for userName, email, and password
    [
        body('userName').notEmpty().withMessage('Username is required'),
        body('email').isEmail().withMessage('Invalid email format'),
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
            let { userName, email, password } = req.body;
            userName = userName.trim();
            email = email.trim();
            password = password.trim();

            // Check for empty input fields
            if (!(userName && email && password)) {
                throw new Error("Empty input fields!");
            }

            // Check for valid userName format
            if (!/^[a-zA-Z0-9 ]*$/.test(userName)) {
                throw new Error("Invalid userName entered");
            }

            // Check for valid email format
            if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
                throw new Error("Invalid email entered");
            }

            // Check for password length
            if (password.length < 6) {
                throw new Error("Password is too short!");
            }

            // Generate unique codeName
            const codeName = await generateUsername();

            // Check if user already exists
            const existingUser = await User.findOne({ $or: [{ userName }, { email }] });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Create new user
            const newUser = await createNewUser({
              userName,
              codeName,
              email,
              password,
            });

            await sendVerificationOTPEmail(email);

            // Respond with success message
            res.status(201).json({
                message: 'User created successfully',
                codeName: newUser.codeName,
            });
        } catch (error) {
            // Handle errors
            console.error(error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
);

// Login endpoint
// router.post('/login', async (req, res) => {
//   try {
//     // Extract user data from request body
//     const { userName, password } = req.body;

//     // Check if user exists
//     const user = await User.findOne({ userName });
//     if (!user) {
//       return res.status(401).json({ message: 'Invalid username or password' });
//     }

//     // Compare passwords
//     const passwordMatch = await bcrypt.compare(password, user.password);
//     if (!passwordMatch) {
//       return res.status(401).json({ message: 'Invalid username or password' });
//     }

//     // Update isAuthenticated field to true
//     user.isAuthenticated = true;
//     await user.save();

//     // Generate JWT token
//     const token = jwt.sign({ userId: user._id, isAuthenticated: user.isAuthenticated }, process.env.JWT_SECRET);

//     // Set the JWT token as a secure cookie
//     res.cookie('jwt', token, {
//       httpOnly: true,
//       secure: true, // Set to true if your app uses HTTPS
//       sameSite: 'strict' // Set the sameSite attribute to mitigate CSRF attacks
//     });

//     // Authentication successful
//     res.status(200).json({ 
//       message: 'Login successful',
//       user: user,
//       token: token, 
//     });
//   } catch (error) {
//     // Handle errors
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

router.post('/login', async (req, res) => {
  try {
    // Extract user data from request body
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // Check if email and password are empty
    if (!trimmedEmail || !trimmedPassword) {
      throw new Error("Empty credentials supplied!");
    }

    // Authenticate user
    const authenticatedUser = await authenticateUser({ email: trimmedEmail, password: trimmedPassword });

    if (!authenticatedUser) {
      // If authentication fails, check if the email exists in the database
      const userWithEmail = await User.findOne({ email: trimmedEmail });
      if (!userWithEmail) {
        // If the email doesn't exist, return an error message
        return res.status(401).json({ message: 'Invalid email' });
      } else {
        // If the email exists but the password is incorrect, return a different error message
        return res.status(401).json({ message: 'Incorrect password' });
      }
    }

    // Set the JWT token as a secure cookie
    const token = authenticatedUser.token; // Access token from authenticatedUser object
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: false, // Set to true if your app uses HTTPS
      sameSite: 'strict' // Set the sameSite attribute to mitigate CSRF attacks
    });

    // Authentication successful
    res.status(200).json({ 
      message: 'Login successful',
      user: authenticatedUser.user, // Access user object from authenticatedUser
      tokenz: token, 
    });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});





// Verify JWT token
router.get('/verify', (req, res) => {
  // Access the token from the req object
  const token = req.token;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Respond with the decoded token
    res.status(200).json(decoded);
  });
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

// Endpoint to verify JWT token and extract user ID
router.post('/verifyJWT', extractUserId, async (req, res) => {
  console.log('User ID:', req);
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
