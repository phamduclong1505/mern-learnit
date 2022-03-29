const express = require('express')
const router = express.Router()
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const verifyToken = require('../middleware/auth')
const User = require('../models/User')

router.get('/', verifyToken, async(req, res) => {
    try{
        const user = await User.findById(req.userId).select('-password')
        if(!user) {
            return res.status(400).json({success: false, message: 'User not found'})
        }
        res.json({success: true, user})
    }catch(error){
        console.log(error)
        res.status(500).json({success: false, message: 'Server eror'})

    }
})

router.post('/register', async(req, res) => {
    const {username, password} = req.body

    // Simple validation
    if(!username || !password) {
        return res.status(400).json({success: false, message: 'Missing param'})
    }else {
        try{
            const user = await User.findOne({username})
            if(user) {
                return res.status(400).json({success: false, message: 'User existed'})
            }
            const hashedPassword = await argon2.hash(password)
            const newUser = new User({username, password: hashedPassword})
            await newUser.save()

            const accessToken = jwt.sign({userId: newUser._id}, process.env.ACCESS_TOKEN_SECRET)
            res.json({success: true, message: 'User created success', accessToken})
        } catch(error){
            console.log(error)
            res.status(500).json({success: false, message: 'Server eror'})

        }
    }
})



//@route POST api/auth/login
//@desc Login user
//@access Public
router.post('/login', async(req, res) => {
    const {username, password} = req.body
    if(!username || !password) {
        return res.status(400).json({success: false, message: 'Missing param'})
    }else {
        try{
            const user = await User.findOne({username})
            if(!user) {
                return res.status(400).json({success: false, message: 'Incorrect username'})
            }
            const passwordValid = await argon2.verify(user.password, password)
            if(!passwordValid) {
                return res.status(400).json({success: false, message: 'Incorrect password'})
            }
            //const newUser = new User({username, password: hashedPassword})
            //await newUser.save()

            const accessToken = jwt.sign({userId: user._id}, process.env.ACCESS_TOKEN_SECRET)
            res.json({success: true, message: 'Logged in success', accessToken})
        } catch(error){
            console.log(error)
            res.status(500).json({success: false, message: 'Server eror'})

        }
    }
})

module.exports = router