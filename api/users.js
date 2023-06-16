const { Router } = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const jwtSecret = "SuperSecret"
const { User } = require('../models/user')
const router = Router()
const { requireAuthentication } = require("../lib/auth")

//create a user
router.post('/', async (req, res, next) => {
    const { name, email, password, role } = req.body
    const hash = await bcrypt.hash(password, 8)

    try {
        const newUser = await User.create({name, email, password: hash, role})
        res.status(201).json({
            id: newUser.id, 
            name: newUser.name, 
            email: newUser.email, 
            role: newUser.role})
    } catch(error) {
        console.error('Error creating new user:', error)
        res.status(500).json({ error: 'Failed to create a new user.'})
    }
})


//user login
router.post('/login', async (req, res, next) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ where: {email} })

        if(!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).send({ error: 'Invalid email or password.' })
        }

        const token = jwt.sign({ userId: user.id}, jwtSecret, { expiresIn: '24h' })
        res.status(200).json({ token })
    } catch(error) {
        console.error('Error during login:', error)
        res.status(401).send({ error: 'Failed to log in.'} )
    }
})


//user get data from id
router.get('/:id', requireAuthentication, async (req, res, next) => {
    const userId = req.params.id

    try {
        const user = await User.findByPk(userId, { attributes: { exclude: ['password'] } })
        
        if(!user) {
            return res.status(404).json({ error: 'User not found.' })
        }

        res.status(200).json(user)
    } catch (error) {
        console.error('Error retrieving user:', error)
        res.status(500).json({ error: 'Failed to retrieve user.' })
    }
})

module.exports = router