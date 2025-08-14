import USER from "../models/userModel.js";



export const signupController = async (req, res, next) => {
    try {
        const { username, email, password,phone,city} = req.body;
        if (!username || !email || !password || !phone || !city) {
          return res.status(400).json({
            message: "All field are required",
          });
        }

        if (password.length <= 6) {
            return res.status(400).json({
                message: "Password must be at least 6 character"
            });
        }

        const existingUser = await USER.findOne({ email, username,phone });
        if (existingUser)
            return res.status(400).json({ success: false, message: "User already exist" });

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await USER.create({
          username,
          email,
          password: hashedPassword,
          phone,
          city,
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
      return res.status(400).json({
        message: "All field are required",
      });
    
    }
    if (password.length <= 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
      
    }
    const user = await USER.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
      
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
      
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

export const  logoutController = async(req,res)=>{
  try {
    res
      .clearCookie("token")
      .status(200)
      .json({ message: "User logged out successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message:"Error in logout"
    })
  }
}