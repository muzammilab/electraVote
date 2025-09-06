const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    age: {
      type: Number,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["voter", "admin"],
      default: "voter",
    },
    aadharCardNumber: {
      type: String,
      required: true,
      unique: true,
    },
    
    // isVoted: { type: Boolean, default: false }, 
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const user = this;

  // Hash password before saving only if it is modified or new
  if (!user.isModified("password")) return next();

  try {     
    // hash the password generation
    const salt = await bcrypt.genSalt(10);

    // hash the password using the salt
    const hashedPassword = await bcrypt.hash(user.password, salt);

    // Also Calculate age based on DOB before saving
    const today = new Date(); 
    const birthDate = new Date(this.dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    user.age = age;
    console.log("Calculated age is:", age);
    
    // replace the plain text password with hashed password
    user.password = hashedPassword;

    next();
  } catch (error) {
    return next(error);
  }

});

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    // use bcrypt to compare the provided password with hashed password
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = mongoose.model("User", userSchema);
