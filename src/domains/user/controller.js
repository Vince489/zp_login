const User = require("../user/model");
const { hashData } = require("./../../utils/hashData");
const createToken = require("./../../utils/createToken");
const { verifyHashedData } = require("./../../utils/hashData");


const createNewUser = async (data) => {
  try {
    const { userName, codeName, email, password } = data;

    // Checking if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw Error("User with the provided email already exists");
    }

    // hash password
    const hashedPassword = await hashData(password);
    const newUser = new User({
      userName,
      codeName,
      email,
      password: hashedPassword,
    });
    // save user
    const createdUser = await newUser.save();
    return createdUser;
  } catch (error) {
    throw error;
  }
};

const authenticateUser = async (data) => {
  try {
    const { email, password } = data;

    // Find user by username
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Invalid username or password");
    }

    if (!user.verified) {
      throw Error("Email hasn't been verified yet. Check your inbox.");
    }

    // Verify password
    const hashedPassword = user.password;
    const passwordMatch = await verifyHashedData(password, hashedPassword);

    if (!passwordMatch) {
      throw new Error("Invalid username or password entered");
    }

    // Update isAuthenticated field to true
    user.isAuthenticated = true;

    // Generate JWT token
    const tokenData = { userId: user._id, email, isAuthenticated: user.isAuthenticated};
    const token = await createToken(tokenData);

    // Assign token to user
    user.token = token;

    return { token, user};
  } catch (error) {
    throw error;
  }
};

module.exports = { createNewUser, authenticateUser };
