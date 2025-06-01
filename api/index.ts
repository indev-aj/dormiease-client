import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from './router.js';

dotenv.config();

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(cors());

app.use("/api", routes);

app.get("/", (req, res) => {
    res.send("Backend is running");
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
