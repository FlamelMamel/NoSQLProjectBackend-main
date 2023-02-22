import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { registerValidator, loginValidator } from './validators/auth.js';
import checkUser from './middlewares/checkUser.js';

import UserController from './controllers/UserController.js';

import multer from 'multer';

mongoose.set("strictQuery", false);
mongoose.connect(
     'mongodb+srv://Flamel:jvY26UBU6i0r5pig@cluster0.8mp3abp.mongodb.net/?retryWrites=true&w=majority'
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

app.post('/user/register', registerValidator, UserController.register); 
app.post('/user/login', loginValidator, UserController.login);
app.get('/user/myprofile', checkUser, UserController.getMyProfile);
app.post('/user/update', checkUser, UserController.updateUserProfile);

const port = process.env.PORT || 4001;

app.listen(port, (err) => {
     if(err){
          return console.log(err);
     }
     console.log("The web site is running!");
});
