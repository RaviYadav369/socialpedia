import express from 'express'

import {
    getUser,
    getUserFriends,
    addRemoveFriend,
    self
} from '../controllers/users.js'

import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

router.get('/', verifyToken, self)
router.get('/:id' ,getUser)
router.get('/:id/friends', verifyToken, getUserFriends)
router.patch('/:id/:friendID', verifyToken, addRemoveFriend)


export default router