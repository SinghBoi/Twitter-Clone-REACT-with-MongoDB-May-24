import mongoose from "mongoose";

mongoose.set("toJSON", {
    virtuals: true,
    transform: (doc, converted) => {
        delete converted._id; // ta bort _id när vi skickar (detta ersätter med id istället)
        delete converted.__v; // ta bort __v när vi skickar
    },
});

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, 
    username: String,
    about: String,
    employment: String,
    hometown: String,
    website: String,
});

const tweetSchema = new mongoose.Schema({
    text: String,
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "UserData" },
    date: { type: Date, default: Date.now }
    // followings: Array, 
    // followers: Array, 
    // likes: Boolean,
});

const userModel = mongoose.model("UserData", userSchema);
const tweetModel = mongoose.model("TweetData", tweetSchema);

export { userModel, tweetModel }; // skapa model och exportera