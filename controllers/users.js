import User from "../models/User.js";

export const self = async (req, res) => {
    try {
        const { id } = req.user;
        const currUser = await User.findById(id)
        // const { firstName, lastName, email } = currUser
        // console.log(currUser);
        res.status(200).json({ user: { ...currUser} })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

export const getUser = async (req, res) => {
    try {  
        const { id } = req.params;
        const user = await User.findById(id)
        res.status(200).json({ user })

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}
export const getUserFriends = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id)
        const friend = await Promise.all(
            user.friends.map((id) => User.findById(id))
        )
        const formattedFriend = friend.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath }
            }
        )
        res.status(200).json(formattedFriend)

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

export const addRemoveFriend = async (req, res) => {
    try {
        const { id, friendID } = req.params
        const user = await User.findById(id)
        const friend = await User.findById(friendID)

        if (user.friends.includes(friendID)) {
            user.friends = user.friends.filter((id) => id !== friendID)
            friend.friends = friend.friends.filter((id) => id !== id)

        } else {
            user.friends.push(friendID)
            friend.friends.push(id)
        }
        await user.save()
        await friend.save()
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        )
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath }
            }
        )
        res.status(200).json(formattedFriends)

    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}