import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { UserModel, TweetModel } from "./Model.js";

const app = express();
app.use(cors()); // middleware för att tillåta extern kommunikation
app.use(bodyParser.json()); // middleware för att kunna ta emot json format

app.get("/Users", async (req, resp) => {
    const users = await UserModel.find(); // hämta alla dogs från databas
    resp.status(200).json(users);
});






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