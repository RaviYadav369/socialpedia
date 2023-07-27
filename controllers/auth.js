import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Register user
export const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body
        const user = await User.findOne({ email: email })
        if (user) {
            return res.status(400).json({ msg: "User Already Exit with this Email" })
        }
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt)

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000)
        })
        const saveUser = await newUser.save()
        const token = jwt.sign({ id: saveUser._id }, process.env.JWT_SECRET)
        res.status(201).json({ token, saveUser })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

//Loging IN

export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        console.log(email, password);
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(400).json({ msg: "User Not Found" })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(401).json({ msg: "Invalid Credentials" })

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        delete user.password;
        res.status(200).json({ token, user })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}