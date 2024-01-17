import express from 'express';
import {
  createTeacher,
  getTeacherById,
  getTeachers,
  deleteTeacher,
  loginTeacher,
  updateTeacher
} from "../dataAccess/teacherDA.js";

let teacherRouter = express.Router();

teacherRouter.route('/teacher').post(async (req, res) => {
  return res.json(await createTeacher(req.body));
});

teacherRouter.route('/teacher').get(async (req, res) => {
  return res.json(await getTeachers());
});

teacherRouter.route('/teacher/:id').get(async (req, res) => {
  return res.json(await getTeacherById(req.params.id));
});

teacherRouter.route('/teacher/:id').delete(async (req, res) => {
  return res.json(await deleteTeacher(req.params.id));
});

// RUTE FORMULAR
// 1. înregistrare profesor
teacherRouter.post('/teacher/register', async (req, res) => {
  try {
    const { name, surname, email, password } = req.body;
    const newTeacher = await createTeacher({
      TeacherName: name,
      TeacherSurName: surname,
      TeacherEmail: email,
      TeacherPassword: password,
    });
    res.status(201).json({ message: 'Teacher registered successfully', teacher: newTeacher });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 2. autentificare profesor
teacherRouter.post('/teacher/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Received login request:', req.body);

    const teacher = await loginTeacher(email, password);

    if (teacher) {
      console.log('Login successful:', teacher);
      res.status(200).json({ message: 'Login successful', teacher });
    } else {
      console.log('Invalid email or password');
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

teacherRouter.route('/teacher/update/:id').put(async (req, res) => {
  try {
    const teacherId = req.params.id;
    const { TeacherName, TeacherSurName, TeacherEmail, TeacherPassword, NumberRequests } = req.body;

    const updatedTeacher = await updateTeacher(teacherId, {
      TeacherName,
      TeacherSurName,
      TeacherEmail,
      TeacherPassword,
      NumberRequests
    });

    if (updatedTeacher) {
      res.status(200).json({ message: 'Teacher updated successfully', request: updatedTeacher });
    } else {
      res.status(404).json({ error: 'Teacher not found' });
    }
  } catch (error) {
    console.error('Error updating Teacher:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default teacherRouter;
