import express from 'express';
import {
  createRequest,
  getRequestById,
  updateRequest,
  updateRequestReject,
  getRequests,
  deleteRequest,
} from "../dataAccess/requestDA.js";


let requestRouter = express.Router();

requestRouter.route('/request').post(async (req, res) => {
  return res.json(await createRequest(req.body));
});

requestRouter.route('/request').get(async (req, res) => {
  return res.json(await getRequests());
});

requestRouter.route('/request/:id').get(async (req, res) => {
  return res.json(await getRequestById(req.params.id));
});

requestRouter.route('/request/:id').delete(async (req, res) => {
  return res.json(await deleteRequest(req.params.id));
});

//adaugare request
requestRouter.post('/request/add', async (req, res) => {
  try {
    console.log('Received data in createRequest:', req.body);

    const { Status, RejectionReason, StudentId, TeacherId, SessionId,isApproved } = req.body;

    const newRequest = await createRequest({
      Status: Status,
      RejectionReason: RejectionReason,
      StudentId: StudentId,
      TeacherId: TeacherId,
      SessionID: SessionId,
      isApproved:isApproved,
    });

    res.status(201).json({ message: 'Request registered successfully', request: newRequest });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

requestRouter.route('/request/update/:id').put(async (req, res) => {
  try {
    const requestId = req.params.id;
    const { Status, RejectionReason, StudentId, TeacherId, SessionId, isApproved} = req.body;

    const updatedRequest = await updateRequest(requestId, {
      Status,
      RejectionReason,
      StudentId,
      TeacherId,
      SessionID: SessionId,
      isApproved
    });

    if (updatedRequest) {
      res.status(200).json({ message: 'Request updated successfully', request: updatedRequest });
    } else {
      res.status(404).json({ error: 'Request not found' });
    }
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


requestRouter.route('/request/update/reject/:id').put(async (req, res) => {
  try {
    const requestId = req.params.id;
    const { Status, RejectionReason, StudentId, TeacherId, SessionId, isApproved} = req.body;

    const updatedRequest = await updateRequestReject(requestId, {
      Status,
      RejectionReason,
      StudentId,
      TeacherId,
      SessionID: SessionId,
      isApproved
    });

    if (updatedRequest) {
      res.status(200).json({ message: 'Request updated successfully', request: updatedRequest });
    } else {
      res.status(404).json({ error: 'Request not found' });
    }
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


export default requestRouter;
