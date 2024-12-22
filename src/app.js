import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path"; 

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static(path.join(path.resolve(), "public"))); 
app.use(cookieParser());

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(path.resolve(), "views"));
 

// Import Routes
import userRouter from "./routes/user.routes.js";

// Routes
app.use("/api/v1/users", userRouter);

// Basic route for testing EJS
app.get("/", (req, res) => {
    res.render("pages/home");
});

export { app };
