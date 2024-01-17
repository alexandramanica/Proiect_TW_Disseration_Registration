import express from 'express';
import {
  createSession,
  getSessionById,
  getSessions,
  deleteSession,
} from "../dataAccess/sessionDA.js";

let sessionRouter = express.Router();

sessionRouter.route('/session').post(async (req, res) => {
  return res.json(await createSession(req.body));
   
});

sessionRouter.route('/session').get(async (req, res) => {
    return res.json(await getSessions());
});

sessionRouter.route('/session/:id').get(async (req, res) => {
    return res.json(await getSessionById(req.params.id));
});

sessionRouter.route('/session/:id').delete(async (req, res) => { 
    return res.json(await deleteSession(req.params.id));
});

// //adaugare sesiune
sessionRouter.post('/session/add', async (req, res) => {
  try {
    const { title, startDate, endDate, currentApplications, teacherId } = req.body;
    const newSession = await createSession({
      Title: title,
      StartDate: startDate,
      EndDate: endDate,
      CurrentApplications: currentApplications,
      TeacherId: teacherId
    });
    res.status(201).json({ message: 'Student registered successfully', session: newSession });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default sessionRouter;
