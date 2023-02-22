import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { registerValidator, loginValidator } from './validators/auth.js';
import checkUser from './middlewares/checkUser.js';

import { register, login, getMyProfile, updateUserProfile }  from './controllers/UserController.js';

import multer from 'multer';

mongoose.set("strictQuery", false);
mongoose.connect(
     'mongodb+srv://Flamel:hgnk5f8fr@cluster0.8mp3abp.mongodb.net/users?retryWrites=true&w=majority'
).then(() => {
     console.log('DB connected');
}).catch((err) => {
     console.log("DB didn't connect", err);
});

const app = express();
app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
     destination: (_, __, callback) => {
          callback(null, 'uploads');
     },
     filename: (_, file, callback) => {
          callback(null, file.originalname);
     }
});

app.use('/uploads', express.static('uploads'));

const upload = multer({ storage });


app.get('/', async(req, res) => {
     res.send("something...");
});

app.post('/user/register', register);
app.post('/user/login', login);

const port = process.env.PORT || 4000;

app.listen(port, (err) => {
     if(err){
          return console.log(err);
     }
     console.log("The web site is running!");
});
