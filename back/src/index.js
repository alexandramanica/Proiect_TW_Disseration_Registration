import express from 'express';
import cors from 'cors';
import env from 'dotenv';
import DB_Init from './entities/DB_init.js';
import masterRouter from  './routes/masterRoute.js';
import studentRouter from './routes/studentRoute.js';
import teacherRouter from './routes/teacherRoute.js';
import requestRouter from './routes/requestRoute.js';
import sessionRoute from  './routes/sessionRoute.js'
import fileUploadRouter from './routes/fileUploadRoute.js';


env.config();

let app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({
  extended: true
}));

//initializare schimb de fisier folosind multer


// app.post('/request/upload/:requestId', upload.single('file'), (req, res) => {
//   const requestId = req.params.requestId;
//   // Poți utiliza requestId pentru a asocia fișierul cu o anumită cerere
//   // Salvează numele fișierului în baza de date sau într-o altă structură de date aferentă cererilor

//   console.log(req.file);
//   res.send('File uploaded!');
//});


//initializare bd + rute

DB_Init();
app.use("/api", masterRouter);
app.use("/api", studentRouter);
app.use("/api", teacherRouter);
app.use("/api", requestRouter);
app.use("/api", sessionRoute);
app.use("/api", fileUploadRouter);


let port = /*process.env.PORT ||*/ 8001;   //de vazut care faza cu env  -> daca se schimba portul sa schimbam si rutele
app.listen(port);
console.log('API is runnning at ' + port);


