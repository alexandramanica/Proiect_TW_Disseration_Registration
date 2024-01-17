import Request from "../entities/Request.js";
import Student from "../entities/Student.js";
import db from "../dbConfig.js";


const createRequest = async (requestData) => {
  try {
    console.log('Received data in createRequest:', requestData);
    const newRequest = await Request.create(requestData);
    console.log('Request created:', newRequest);
    return newRequest;
  } catch (error) {
    console.error('Error creating Request:', error);
    throw error;
  }
};

async function getRequests() {
  return await Request.findAll();
}

async function getRequestById(id) {
  return await Request.findByPk(id);
}

async function deleteRequest(id) {
  let request = await Request.findByPk(id);

  if (!request) {
    console.log("This Request has already been deleted");
    return;
  }

  return await request.destroy();
}

// În funcția ta de actualizare
async function updateRequest(requestId, updateData) {
  try {
    // Obține cererea existentă
    const existingRequest = await Request.findByPk(requestId);

    // Verifică dacă studentul are deja o cerere aprobată
    const studentId = existingRequest.StudentId;
    const student = await Student.findByPk(studentId);
    if (student.IsRequestApproved) {
      throw new Error('Studentul are deja o cerere aprobată.');
    }

    // Actualizează cererea cu noile date
    const updatedRequest = await existingRequest.update(updateData);

    // Actualizează și studentul pentru a indica că are o cerere aprobată
    await student.update({ IsRequestApproved: true });

    // Alte acțiuni după actualizare (dacă este cazul)

    return updatedRequest;
  } catch (error) {
    console.error('Error updating request:', error);
    throw error;
  }
}

async function updateRequestReject(requestId, updateData) {
  try {
    const existingRequest = await Request.findByPk(requestId);

    if (!existingRequest) {
      return { error: true, msg: "No entity found" };
    }

    await existingRequest.update(updateData);
    console.log('Request updated successfully.');

    return { error: false, msg: "Success", obj: "Success" };
  } catch (error) {
    console.error('Error updating request:', error);
    return { error: true, msg: "Error updating request" };
  }
}

export {
  createRequest,
  getRequestById,
  updateRequest,
  updateRequestReject,
  getRequests,
  deleteRequest,
};
