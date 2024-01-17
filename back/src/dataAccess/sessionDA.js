import Session from "../entities/Session.js";

const createSession = async (sessionData) => {
  try {
    console.log('Received data in createSession:', sessionData);
    const newSession = await Session.create(sessionData);
    console.log('Session created:', newSession);
    return newSession;
  } catch (error) {
    console.error('Error creating Session:', error);
    throw error;
  }
};

async function getSessions() {
  return await Session.findAll();
}

async function getSessionById(id) {
  return await Session.findByPk(id);
}

async function deleteSession(id) {
  let session = await Session.findByPk(id);

  if (!session) {
    console.log("This Session has already been deleted");
    return;
  }

  return await session.destroy();
}

export {
  createSession,
  getSessionById,
  getSessions,
  deleteSession,
};
