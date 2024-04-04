import User from "../models/user.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const register = async(req,res)=>{
    try {
        const hashedPassword = bcrypt.hashSync(req.body.password,10)
        const newUser = new User({
            ...req.body,
            password:hashedPassword
        })
        await newUser.save()
        res.status(201).send("User has been created.")

    } catch (err) {
        res.status(500).send("Something went wrong!")
    }
}

export const login = async(req,res)=>{
    try {
        const user = await User.findOne({username:req.body.username})

        if(!user){
            return res.status(404).send("User not found!")
        }

        const isCorrect = bcrypt.compareSync(req.body.password,user.password)

        if(!isCorrect){
            return res.status(404).send("User not found!")
        }

        const token = jwt.sign({
            id:user._id,
            isSeller:user.isSeller
        },
        process.env.JWT_KEY
        )

        const {password,...info} = user._doc

        res.status(200).cookie("accessToken",token,{
            httpOnly:true
        }).send(info)

    } catch (err) {
        res.status(500).send("Something went wrong!")
    }
}

export const logout = async(req,res)=>{
    
}