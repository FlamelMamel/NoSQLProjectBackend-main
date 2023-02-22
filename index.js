import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { registerValidator, loginValidator } from './validators/auth.js';
import { addDoctorValidator } from './validators/doctor.js';
import { adminValidator } from './validators/admin.js';
import checkUser from './middlewares/checkUser.js';
import checkAdmin from './middlewares/checkAdmin.js';
import { UserController, DoctorController, AdminController, AppointmentController, HospitalController } from './controllers/index.js';
import checkDoctor from './middlewares/checkDoctor.js';
import multer from 'multer';

mongoose.set("strictQuery", false);
mongoose.connect(
     'mongodb+srv://admin:fDJOm5IhWXOwd0Hp@cluster0.5cekcxl.mongodb.net/hospitalDB?retryWrites=true&w=majority'
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
app.post('/user/appointment', checkUser, AppointmentController.bookAppointment);
app.post('/user/update', checkUser, UserController.updateUserProfile);

app.get('/doctors', checkUser, DoctorController.getAllDoctors);
app.post('/doctor/register', addDoctorValidator, DoctorController.register);
app.post('/doctor/login', loginValidator, DoctorController.login);
app.get('/doctor/myprofile', checkDoctor, DoctorController.getMyProfile);
app.post('/doctor/appointment', checkDoctor, AppointmentController.add);
app.post('/doctor/upload/profilepicture', checkDoctor, upload.single('docimg'), DoctorController.uploadProfilePicture);
app.post('/doctor/upload/cv', checkDoctor, upload.single('cv'), DoctorController.uploadCV);
app.post('/doctor/delete/profilepicture', checkDoctor, DoctorController.deleteProfilePicture);
app.get('/doctor/appointments/notstarted', checkDoctor, DoctorController.getAllMyNotStartedAppointments);

app.get('/hospitals', HospitalController.getAllHospitals);
app.get('/hospitals/cities', HospitalController.getAllCitiesForSorting);
app.get('/hospitals/:city', HospitalController.getAllHospitalsFromCity);

app.post('/admin/register', adminValidator, AdminController.register);
app.post('/admin/login', adminValidator, AdminController.login);
app.post('/admin/doctor/confirm', checkAdmin, AdminController.confirm);
app.post('/admin/doctor/deny', checkAdmin, AdminController.deny);
app.get('/admin/doctors', checkAdmin, AdminController.getAllDoctorsWithoutAccess);
app.get('/admin/hospitals/noinfo', checkAdmin, AdminController.getAllHospitalsWithoutInfo);
app.post('/admin/hospital/update', checkAdmin, AdminController.updateHospitalInfo);
app.post('/admin/hospital/upload', checkAdmin, upload.single('hospitalImg'), AdminController.uploadHospitalImage);


const port = process.env.PORT || 4000;

app.listen(port, (err) => {
     if(err){
          return console.log(err);
     }
     console.log("The web site is running!");
});
