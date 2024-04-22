import mongoose from "mongoose";

mongoose.set("toJSON", {
    virtuals: true,
    transform: (doc, converted) => {
        delete converted._id; // ta bort _id när vi skickar (detta ersätter med id istället)
        delete converted.__v; // ta bort __v när vi skickar
    },
});

const userSchema = new mongoose.Schema({
    email: String,
    password: String, 
    userName: String, 
    followings: Array, 
    followers: Array, 
    likes: Boolean, 
});

const tweetSchema = new mongoose.Schema({
    userName: String, 
    followings: Array, 
    followers: Array, 
    likes: Boolean,
});

const userModel = mongoose.model("UserData", userSchema);
const tweetModel = mongoose.model("TweetData", tweetSchema);

export { userModel, tweetModel }; // skapa model och exportera