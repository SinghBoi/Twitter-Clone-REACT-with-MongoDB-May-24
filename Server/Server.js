import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { userModel, tweetModel } from "./Model.js";

const app = express();
app.use(cors()); // middleware för att tillåta extern kommunikation
app.use(bodyParser.json()); // middleware för att kunna ta emot json format

function validatePassword(password) {
    const char = /[!@#$%^&*()_+={}\[\];:'"<>,.?/]/;
    const num = /\d/;
    const length = 8;

    return password.length >= 8 && char.test(password) && num.test(password);
}

app.get("/users", async (req, resp) => {
    const users = await userModel.find(); // hämta alla users från databas
    resp.status(200).json(users);
});

app.get("/users/:id", async (req, resp) => {  
    try {
        const { id } = req.params;
        const { email, password } = req.body;
        const user = await userModel.findOne({ _id: id, email: email, password: password });

        if (!user) { 
            return resp.status(401).send("No Such User Exists");
        }

        if (password !== user.password) {  // Validate password stored in the database
            return resp.status(401).send("Invalid Credentials");
        }

        resp.status(200).json(user);
    } catch (err) {
        console.error(err.message);
        resp.status(500).send();
    }
});

app.post("/users", async (req, resp) => {
    const user = new userModel(req.body);

    try {
        if (!(await userModel.findOne({ email: email }))) {  // Check if email already exists
            return resp.status(401).send("User Already Exists");
        }

        if (!validatePassword(password)) { // Validate password (if needed)
            return resp.status(401).send(
                "Password must be atleast 8 characters, containing one numeric and one special character"
            )}
        
        const newUser = await user.save(); // Save the new user to the database
        resp.status(201).json(newUser);
    } catch (err) {
        console.error(err.message);
        resp.status(500).send();
    }
});


// app.get("/users/:id", async (req, resp) => {
//     try {
//         const { id } = req.params;
//         const user = await userModel.findOne({ _id: id }); // hämta alla users från databas
//         if (user.followers.length) {
//         const query = { _id: { $in: user.followers } };
//         const followers = await userModel.find(query);
//         user.followers = followers; 
//         }
//         if (user.followings.length) {
//         const query = { _id: { $in: user.followings } };
//         const followings = await userModel.find(query);
//         user.followings = followings;
//         }
//         if (user.likes.length) {
//         const query = { _id: { $in: user.likes } };
//         const likes = await userModel.find(query);
//         user.likes = likes;
//         }
//         resp.status(200).json(user);
//     } catch (err) {
//         console.log(err.message)
//         resp.status(500).send()
//     }
// });

// app.put("/users/:id", async (req, resp) => {
//     try {
//         const { id } = req.params;
//         await userModel.updateOne({ _id: id }, req.body); 
//         const updatedUser = await userModel.findById(id); 
        
//         const followings = { _id: { $in: updatedUser.followings } };
//         const userFollowings = await userModel.find(followings);
//         await userModel.updateMany({}, { $pull: { followings: updatedUser.id } });
//         await userModel.updateMany(query, { $push: { followings: updatedUser.id } });
//         updatedUser.followings = userFollowings;
        
//         const followers = { _id: { $in: updatedUser.followers } };
//         const userFollowers = await userModel.find(followers);
//         await userModel.updateMany({}, { $pull: { followers: updatedUser.id } });
//         await userModel.updateMany(query, { $push: { followers: updatedUser.id } });
//         updatedUser.followers = userFollowers;

//         resp.status(200).json(updatedUser);
//     } catch (err) {
//         console.log(err.message)
//         resp.status(500).send()
//     }
// });

// app.delete("/users/:id", async (req, resp) => {
//     try { 
//         const { id } = req.params;
//         const deletedUser = await userModel.findByIdAndDelete(id); // ta bort en user från databas
//         await userModel.updateMany({ followings: id }, { $pull: { followings: id } }); // ta bort user från andras followings listor
//         await userModel.updateMany({ likes: id }, { $pull: { likes: id } }); // ta bort user likes från andras followings listor
//         resp.status(200).json(deletedUser);
//     } catch (err) {
//         console.log(err.message)
//         resp.status(500).send()
//     }
// });






const start = async () => {
    try {
        const dbUrl = "mongodb://localhost:27017/TwitterClone";
        await mongoose.connect(dbUrl); // connecta med databas via url (detta kan vara atlas)
        app.listen(9000, () => console.log("Server started on port 9000"));
    } catch (error) {
        // om något blir fel i connection stoppa server
        console.error(error);
        process.exit(1);
    }
};
start();