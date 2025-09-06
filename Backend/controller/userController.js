const User = require("../model/user");
const { generateToken, jwtAuthMiddleware } = require("../jwt");

// Signup controller
// URL : POST /user/signup
exports.postSignup = async (req, res) => {
  try {
    // Assuming request body has user data
    const data = req.body;

    // Only one admin allowed
    if (data.role === "admin") {
      const existingAdmin = await User.findOne({ role: "admin" });
      if (existingAdmin) {
        return res.status(400).json({ error: "Admin already exists, Only one admin allowed" });
      }
    }

    // Check if Aadhaar already exists
    const existingAadhar = await User.findOne({
      aadharCardNumber: data.aadharCardNumber,
    });
    if (existingAadhar) {
      return res.status(400).json({ error: "Aadhaar number already registered" });
    }

    // const hashedPassword = await bcrypt.hash(req.body.password, 12);
    // Password will be hashed in pre-save hook of user model

    // Create new user document using mongoose model
    const newUser = new User(data);

    // Save the new user to database
    const response = await newUser.save();
    console.log("User created successfully:", response);

    // Creating payload to send for JWT token
    const payload = {
      id: response._id,
    };
    console.log(JSON.stringify(payload));

    const token = generateToken(payload);
    console.log("Generated Token is:", token);
    res.status(200).json({ message: "User created successfully", token, role: response.role,});
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
    // res.status(500).json({ error: "Internal server error" });
  }
};

// Login controller
// URL : POST /user/login
exports.postLogin = async (req, res) => {
  try {
    const { aadharCardNumber, password } = req.body;

    // Find user by aadharCardNumber
    const user = await User.findOne({ aadharCardNumber: aadharCardNumber });

    // If user does not exist or password does not match, return error
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Creating payload to send for JWT token
    const payload = {
      id: user._id,
    };

    const token = generateToken(payload);
    res.status(200).json({ message: "Login successful", token, role: user.role });
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// Get all users (Voters only)
// URL : GET /user/getAll
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "voter" })
      .select("-password -aadharCardNumber"); // Exclude password & Aadhaar number
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// User controller
// URL : GET /user/single
exports.getSingleUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password"); // Exclude password & aadhar field
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// Profile controller
// URL : GET /user/profile
exports.getProfile = async (req, res) => {
  try {
    const userData = req.user;
    console.log("User data from token:", userData);

    // req.user is set in jwtAuthMiddleware after token verification
    const userId = userData.id;

    // Fetch user profile from database by userId
    const user = await User.findById(userId); // .select("-password"); // Exclude password field from response
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// Change password controller
// URL : PUT /user/profile/change
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from JWT Token

    const { currentPassword, newPassword } = req.body; // Destructure current and new password from request body

    // Find user by Id
    const user = await User.findById(userId);

    // If current password does not match, return error
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    // Update user's password
    user.password = newPassword; // Password will be hashed in pre-save hook of user model
    const updatedUser = await user.save(); // Save updated password to database

    res
      .status(200)
      .json({ message: "Password changed successfully", updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// Update user profile (no password update here)
// URL : PUT /user/profile/update
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT middleware
    const updates = req.body;

    // Prevent password update here
    if (updates.password) {
      delete updates.password;
    }

    // Check for unique email conflict
    // if (updates.email) {
    //   const existingEmail = await User.findOne({ email: updates.email, _id: { $ne: userId } });
    //   if (existingEmail) {
    //     return res.status(400).json({ error: "Email already in use by another account" });
    //   }
    // }

    // Check for unique aadhar conflict
    if (updates.aadharCardNumber) {
      const existingAadhar = await User.findOne({
        aadharCardNumber: updates.aadharCardNumber,
        _id: { $ne: userId },
      });
      if (existingAadhar) {
        return res
          .status(400)
          .json({ error: "Aadhaar number already in use by another account" });
      }
    }

    // If dob is updated, recalculate age
    if (updates.dob) {
      const today = new Date();
      const birthDate = new Date(updates.dob);
      let age = today.getFullYear() - birthDate.getFullYear();
      const month = today.getMonth() - birthDate.getMonth();
      if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      updates.age = age;
    }

    // Update in DB
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password"); // never return password

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT middleware  
    const deletedUser = await User.findByIdAndDelete(userId).select("-password"); // never return password
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};
