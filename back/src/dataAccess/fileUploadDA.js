import FileUpload from "../entities/FileUpload.js";

const createFileUpload = async (fileUploadData) => {
  try {
    console.log('Received data in createFileUpload:', fileUploadData);
    const newFileUpload = await FileUpload.create(fileUploadData);
    console.log('FileUpload created:', newFileUpload);
    return newFileUpload;
  } catch (error) {
    console.error('Error creating FileUpload:', error);
    throw error;
  }
};

async function getFileUploads() {
  return await FileUpload.findAll();
}

async function getFileUploadById(id) {
  return await FileUpload.findByPk(id);
}

async function deleteFileUpload(id) {
  const fileUpload = await FileUpload.findByPk(id);

  if (fileUpload) {
    await fileUpload.destroy();
    console.log('FileUpload deleted:', fileUpload);
    return fileUpload;
  } else {
    return null;
  }
}

 async function findByField ( value) {
  try {
    const fileUpload = await FileUpload.findOne({
      where: {
        RequestId: value,
        Sender: 'Student'
      },
    });

    return fileUpload;
  } catch (error) {
    console.error('Error fetching FileUpload:', error);
    throw error;
  }
};

 async function updateFileUpload  (fileId, updatedData)  {
  try {
    // Find the file by fileId
    const file = await FileUpload.findByPk(fileId);

    // If the file is found, update its attributes
    if (file) {
      await file.update(updatedData);
      console.log('File updated successfully.');
      return file;
    } else {
      return { error: true, msg: "No entity found" };
    }
  } catch (error) {
    console.error('Error updating FileUpload:', error);
    throw error;
  }
};




export { createFileUpload, getFileUploads, getFileUploadById, deleteFileUpload,findByField,updateFileUpload };
