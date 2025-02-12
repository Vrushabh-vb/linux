require('dotenv').config(); // ✅ Load env variables first
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const secretKey = process.env.JWT_SECRET || 'fallbackSecret';

// 🔹 User Login Function
exports.userLogin = async (req, res) => {
    const { email, password } = req.body;
    console.log('User login attempt with email:', email);

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Internal Server Error');
        }

        if (results.length > 0) {
            console.log('Found user:', results[0]);
            const validPassword = await bcrypt.compare(password, results[0].password);
            if (!validPassword) {
                console.log('Invalid password for user');
                return res.status(400).send('Invalid credentials.');
            }

            const token = jwt.sign({ id: results[0].user_id, role: 'user' }, secretKey, { expiresIn: '1h' });

            return res.header('auth-token', token).send({
                token,
                role: 'user',
                user_id: results[0].user_id,
                username: results[0].username
            });
        }

        console.log('No user found with email:', email);
        return res.status(400).send('Invalid credentials.');
    });
};

// 🔹 User Registration Function
exports.registerUser = async (req, res) => {
    const { username, password, email, phone_number } = req.body; // ❌ Removed user_id

    console.log('Request Body:', req.body);
    console.log('Password:', password);

    if (!password) {
        return res.status(400).send('Password is required.');
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        db.query(
            'INSERT INTO users (username, password, email, phone_number) VALUES (?, ?, ?, ?)', // ❌ Removed user_id
            [username, hashedPassword, email, phone_number],
            (err, results) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).send('Internal Server Error');
                }
                res.status(200).send({ message: 'User registered successfully.' });
            }
        );
    } catch (error) {
        console.error('Error during password hashing:', error);
        res.status(500).send('Internal Server Error');
    }
};
