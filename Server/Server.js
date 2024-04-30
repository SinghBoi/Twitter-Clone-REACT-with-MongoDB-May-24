import express from "express";
import session from "express-session";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { userModel, tweetModel } from "./Model.js";

const app = express();
app.use(cors()); // Middleware för att tillåta extern kommunikation
app.use(bodyParser.json()); // Middleware för att kunna ta emot JSON-format

app.use(session({
    secret: 'your_secret_key_here',
    resave: false,
    saveUninitialized: false
}));

// Authentication Middleware
const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    next();
};

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

        if (password !== user.password) { // Validate password stored in the database
            return res.status(400).json({ error: "Invalid credentials" })
        }

        // Store user ID in session after successful login
        req.session.userId = user._id;

        res.status(201).json(user);
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

app.get("/tweets", requireAuth, async (req, res) => {
    try {
        // Fetch tweets and populate the 'postedBy' field with user information
        const tweets = await tweetModel.find({ postedBy: req.session.userId }).populate('postedBy', 'name email');
        res.status(200).json(tweets);
    } catch (error) {
        console.error("Error fetching tweets:", error);
        res.status(500).json({ error: error.message });
    }
});

app.post("/tweet", async (req, res) => {
    const { text, userId } = req.body; // Assuming userId is provided in the request body

    try {
        // Create a new tweet document with the provided text and userId
        const newTweet = new tweetModel({
            text,
            postedBy: userId // Assuming userId is the _id of the user who posted the tweet
        });

        // Save the new tweet to the database
        const savedTweet = await newTweet.save();

        res.status(201).json(savedTweet);
    } catch (error) {
        console.error("Error creating tweet:", error);
        res.status(500).json({ error: error.message });
    }
});

app.get("/profile", async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    // Fetch user profile based on userId from session
    const user = await userModel.findById(req.session.userId);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
});

app.get("/profile/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findOne({ _id: id }); // hämta alla users från databas
        // if (user.followers.length) {
        // const query = { _id: { $in: user.followers } };
        // const followers = await userModel.find(query);
        // user.followers = followers; 
        // }
        // if (user.followings.length) {
        // const query = { _id: { $in: user.followings } };
        // const followings = await userModel.find(query);
        // user.followings = followings;
        // }
        // if (user.likes.length) {
        // const query = { _id: { $in: user.likes } };
        // const likes = await userModel.find(query);
        // user.likes = likes;
        // }
        res.status(201).json(user);
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

app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
            return res.status(500).json({ error: "Failed to logout" });
        }
        res.clearCookie("connect.sid"); // Clear session cookie
        res.status(200).json({ message: "Logout successful" });
    });
});

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
