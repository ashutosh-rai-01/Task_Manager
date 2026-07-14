const UserModel = require('../Models/Usermodel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'All fields (name, email, password) are required',
                success: false
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: 'Password must be at least 6 characters long',
                success: false
            });
        }

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists with this email',
                success: false
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({
            message: 'User registered successfully',
            success: true
        });
    } catch (err) {
        console.error('Register Error:', err);
        res.status(500).json({
            message: 'Internal server error during registration',
            success: false,
            error: err.message
        });
    }
};

const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required',
                success: false
            });
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: 'Invalid email or password',
                success: false
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: 'Invalid email or password',
                success: false
            });
        }

        // Generate JWT
        const tokenPayload = {
            id: user._id,
            email: user.email
        };

        const secret = process.env.JWT_SECRET || 'super_secret_key_12345_task_manager_auth_system_2026';
        const token = jwt.sign(tokenPayload, secret, { expiresIn: '24h' });

        res.status(200).json({
            message: 'Login successful',
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({
            message: 'Internal server error during login',
            success: false,
            error: err.message
        });
    }
};

module.exports = {
    Register,
    Login
};
