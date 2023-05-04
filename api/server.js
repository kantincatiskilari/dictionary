import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import AuthRoute from './routes/auth.js';
import UserRoute from './routes/users.js';
import EntryRoute from './routes/entries.js';
import TopicRoute from './routes/topics.js';
import cookieParser from 'cookie-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
dotenv.config();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req,file,cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({storage: storage});

mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("Connected to DB"))
.catch((err) => console.log(err));

//middlewares
app.use(cookieParser());
app.use(express.json());
app.use("/api/images", express.static(path.join(__dirname, "/images")));
app.post('/api/upload', upload.single('image'), (req,res) => {
    const image = req.file
    res.status(200).json(image)
});
app.use("/api/users",UserRoute);
app.use("/api/auth",AuthRoute);
app.use("/api/topics",TopicRoute);
app.use("/api/entries",EntryRoute);

//error handler
app.use((err,req,res,next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong."
    return res.status(status).json({
        success: false,
        status,
        message
    });
});

app.listen(4400,() => console.log(`Server running on port: 4400`));