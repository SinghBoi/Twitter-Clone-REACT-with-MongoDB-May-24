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

// Hämta alla användare
app.get("/users", async (req, resp) => {
	try {
		const users = await userModel.find();
		resp.status(200).json(users);
	} catch (err) {
		console.error(err.message);
		resp.status(500).send("Server error");
	}
});

// Logga in användare
app.post("/login", async (req, resp) => {
	try {
		const { email, password } = req.body;
		const user = await userModel.findOne({ email });
		if (!user) {
			return resp.status(401).send("No such user exists");
		}
		if (password !== user.password) {
			return resp.status(401).send("Invalid credentials");
		}
		resp.status(200).json(user);
	} catch (err) {
		console.error(err.message);
		resp.status(500).send("Server error");
	}
});

// Registrera ny användare med slumpmässiga bildlänkar
app.post("/signUp", async (req, resp) => {
	const { email, password, ...rest } = req.body;

	try {
		if (await userModel.findOne({ email })) {
			return resp.status(409).send("User already exists");
		}
		if (!validatePassword(password)) {
			return resp
				.status(400)
				.send(
					"Password must be at least 8 characters, containing one numeric and one special character"
				);
		}

		// Generera bildlänkar
		const backgroundUrl = `https://picsum.photos/1920/1080`;
		const avatarUrl = `https://picsum.photos/200`;

		// Skapa en ny användare med bild-URL:er
		const newUser = new userModel({
			email,
			password,
			backgroundUrl,
			avatarUrl,
			...rest,
		});

		await newUser.save();
		resp.status(201).json(newUser);
	} catch (err) {
		console.error(err.message);
		resp.status(500).send("Server error");
	}
});

// Hämta specifik användare
app.get("/users/:id", async (req, resp) => {
	try {
		const user = await userModel.findById(req.params.id);
		if (!user) {
			return resp.status(404).send("User not found");
		}
		resp.status(200).json(user);
	} catch (err) {
		console.error(err.message);
		resp.status(500).send("Server error");
	}
});

// Uppdatera en användare
app.put("/users/:id", async (req, resp) => {
	try {
		const updatedUser = await userModel.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true }
		);
		if (!updatedUser) {
			return resp.status(404).send("User not found");
		}
		resp.status(200).json(updatedUser);
	} catch (err) {
		console.error(err.message);
		resp.status(500).send("Server error");
	}
});

// Ta bort en användare
app.delete("/users/:id", async (req, resp) => {
	try {
		const deletedUser = await userModel.findByIdAndDelete(req.params.id);
		if (!deletedUser) {
			return resp.status(404).send("User not found");
		}
		resp.status(200).json({ message: "User deleted successfully" });
	} catch (err) {
		console.error(err.message);
		resp.status(500).send("Server error");
	}
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
