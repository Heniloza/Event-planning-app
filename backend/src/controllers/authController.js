import USER from "../models/userModel.js";



export const signupController = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            res.status(400).json({
                message: "All field are required"
            });
        }
        if (password.length <= 6) {
            res.status(400).json({
                message: "Password must be at least 6 character"
            });
        }
        const existingUser = await USER.findOne({ email, username });
        if (existingUser)
            res.status(400).json({ success: false, message: "User already exist" });
        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await USER.create({
            username,
            email,
            password: hashedPassword,
        });
        res.status(201).json({ user: newUser, message: "New User created" });
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to signup",
            error
        });
    }
};

export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        message: "All field are required",
      });
      return;
    }
    if (password.length <= 6) {
      res.status(400).json({
        message: "Password must be at least 6 characters",
      });
      return;
    }
    const user = await USER.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }
    res.status(200).json({
      user,
      message: "User logged in successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to Login",
      error,
    });
  }
};