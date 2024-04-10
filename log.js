router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    // Authenticate user
    const { user, token } = await authenticateUser({ email, password });

    // Set the JWT token as a secure cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: true, // Set to true if your app uses HTTPS
      sameSite: 'strict' // Set the sameSite attribute to mitigate CSRF attacks
    });

    // Authentication successful
    res.status(200).json({ 
      message: 'Login successful',
      user: user,
      token: token, 
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: error.message });
  }
});