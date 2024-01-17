import express from 'express';
import {
  createStudent,
  getStudentById,
  getStudents,
  deleteStudent,
  loginStudent,
} from "../dataAccess/studentDA.js";

let studentRouter = express.Router();

studentRouter.route('/student').post(async (req, res) => {
  return res.json(await createStudent(req.body));
});

studentRouter.route('/student').get(async (req, res) => {
  return res.json(await getStudents());
});

studentRouter.route('/student/:id').get(async (req, res) => {
  return res.json(await getStudentById(req.params.id));
});

studentRouter.route('/student/:id').delete(async (req, res) => {
  return res.json(await deleteStudent(req.params.id));
});


//RUTE FORMULAR
//1.inregistrare student
studentRouter.post('/student/register', async (req, res) => {
  try {
    const { name, surname, group, email, password } = req.body;
    const newStudent = await createStudent({
      StudentName: name,
      StudentSurName: surname,
      StudentGroup: group,
      StudentEmail: email,
      StudentPassword: password,
    });
    res.status(201).json({ message: 'Student registered successfully', student: newStudent });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

//2. autentificare student
studentRouter.post('/student/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Received login request:', req.body);

    const student = await loginStudent(email, password);

    if (student) {
      console.log('Login successful:', student);
      res.status(200).json({ message: 'Login successful', student });
    } else {
      console.log('Invalid email or password');
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




export default studentRouter;
