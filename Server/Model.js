import mongoose from "mongoose";

mongoose.set("toJSON", {
    virtuals: true,
    transform: (doc, converted) => {
        delete converted._id; // ta bort _id när vi skickar (detta ersätter med id istället)
        delete converted.__v; // ta bort __v när vi skickar
    },
});

const userSchema = new mongoose.Schema({
    email: String, // dogBook i databasen ska ha "Name" property av typen String
    userName: String, // dogBook i databasen ska ha "Nick" property av typen String
    followers: Array, // dogBook i databasen ska ha "Friends" property av typen Array
});

const tweetSchema = new mongoose.Schema({
    email: String, // dogBook i databasen ska ha "Name" property av typen String
    userName: String, // dogBook i databasen ska ha "Nick" property av typen String
    followers: Array, // dogBook i databasen ska ha "Friends" property av typen Array
});

const UserModel = mongoose.model("User", userSchema);
const TweetModel = mongoose.model("Tweet", tweetSchema);

export { UserModel, TweetModel }; // skapa model och exportera