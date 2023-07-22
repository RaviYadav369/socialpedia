import Post from '../models/Post.js'
import User from '../models/User.js';

//create
export const createPost = async (req, res) => {
    try {
        const { userID, description, picturePath } = req.body;
        const user = await User.findById(userID)
        const newPost = new Post({
            userID,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: []
        })
        await newPost.save()
        const post = await Post.find();

        res.status(201).json(post)

    } catch (err) {
        res.status(409).json({ error: err.message })
    }
}

//Read
export const getFeedPosts = async (req, res) => {
    try {
        const post = await Post.find()
        res.status(200).json(post)
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const userPosts = await Post.findById({ userID })
        res.status(200).json(userPosts)
    } catch (err) {
        res.status(403).json({ error: err.message })
    }
}

export const likePost = async(req,res)=>{
    try {
        const {id} = req.params;
        const {userId} = req.body;
        const post = await Post.findById({id})
        const isLiked = post.likes.get(userId)

        if(isLiked){
            post.likes.delete(userId)
        }else{
            post.likes.set(userId,true)
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            {likes:post.likes},
            {new:true}
        )
        res.status(200).json(updatedPost)

    } catch (err) {
        res.status(404).json({error:err.message})
    }
}