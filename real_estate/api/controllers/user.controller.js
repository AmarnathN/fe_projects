import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.utils.js";

export const updateUser = async (req, res, next) => {
    if(req.params.id !== req.user.id){
        return next(errorHandler(401, "Unauthorized! you can only update your account"));
    }
    try{
        if(req.body.password){
            req.body.password = await bcryptjs.hashSync(req.body.password, 10);
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
            },
        },{new: true});
        const { password, ...restOfUser } = updatedUser._doc;
        res.status(200).json(restOfUser);
    }catch(err){
        console.log(err);
        next(errorHandler(500, "Failed to update user"));
    }
}
