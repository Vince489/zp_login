router.post('/login', async (req, res, next) => {
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

    // Add the token to the req object
    req.token = token;

    // Authentication successful
    res.status(200).json({ 
      message: 'Login successful',
      token: token, // Send the JWT token back to the client
      user: user, 
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
