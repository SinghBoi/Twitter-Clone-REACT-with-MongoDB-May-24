import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { userModel } from "./Model.js";

const app = express();
app.use(cors()); // Middleware för att tillåta extern kommunikation
app.use(bodyParser.json()); // Middleware för att kunna ta emot JSON-format

function validatePassword(password) {
	const char = /[!@#$%^&*()_+={}\[\];:'"<>,.?/]/;
	const num = /\d/;
	return password.length >= 8 && char.test(password) && num.test(password);
}

app.get("/users", async (req, res) => {
    const users = await userModel.find(); // hämta alla users från databas
    res.status(200).json(users);
});

app.post("/login", async (req, res) => {  
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email: email });
        if (!user) { 
            return res.status(400).json({ error: "No Such User Exists" });
        }

        if (password !== user.password) {  // Validate password stored in the database
            return res.status(400).json({ error: "Invalid credentials" })
        }

        res.status(200).json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
});

app.post("/signUp", async (req, res) => {
    const user = new userModel(req.body);

    try {
        const oldUsers = await userModel.findOne({ email: req.body.email })
        if (oldUsers) {  // Check if email already exists
            return res.status(400).json({ error: "Email already exists" });
        }

        if (!validatePassword( req.body.password )) { // Validate password (if needed)
            console.log("Password issues ")
            return res.status(400).json({
                error: "Password must be atleast 8 characters, containing one numeric and one special character"
        })}
        
        const newUser = await user.save(); // Save the new user to the database
        res.status(201).json(newUser);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
});

app.get("/profile/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findOne({ _id: id }); // hämta alla users från databas
        if (user.followers.length) {
        const query = { _id: { $in: user.followers } };
        const followers = await userModel.find(query);
        user.followers = followers; 
        }
        if (user.followings.length) {
        const query = { _id: { $in: user.followings } };
        const followings = await userModel.find(query);
        user.followings = followings;
        }
        if (user.likes.length) {
        const query = { _id: { $in: user.likes } };
        const likes = await userModel.find(query);
        user.likes = likes;
        }
        res.status(200).json(user);
    } catch (err) {
        console.log(err.message)
        res.status(500).send()
    }
});

// app.put("/users/:id", async (req, res) => {
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

//         res.status(200).json(updatedUser);
//     } catch (err) {
//         console.log(err.message)
//         res.status(500).send()
//     }
// });

// app.delete("/users/:id", async (req, res) => {
//     try { 
//         const { id } = req.params;
//         const deletedUser = await userModel.findByIdAndDelete(id); // ta bort en user från databas
//         await userModel.updateMany({ followings: id }, { $pull: { followings: id } }); // ta bort user från andras followings listor
//         await userModel.updateMany({ likes: id }, { $pull: { likes: id } }); // ta bort user likes från andras followings listor
//         res.status(200).json(deletedUser);
//     } catch (err) {
//         console.log(err.message)
//         res.status(500).send()
//     }
// });

const start = async () => {
	try {
		const dbUrl = "mongodb://localhost:27017/TwitterClone";
		await mongoose.connect(dbUrl);
		app.listen(9000, () => console.log("Server started on port 9000"));
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};

start();
