import mongoose ,{Schema} from "mongoose";

const LikeSchema = new Schema({
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    blog:{
        type:Schema.Types.ObjectId,
        ref:"Blog"
    },
    likeBy:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }

},{timestamps:true})


export const Like = mongoose.model('Like',LikeSchema)

