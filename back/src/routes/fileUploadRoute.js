import express from 'express';
import { createFileUpload, getFileUploadById, getFileUploads, deleteFileUpload,findByField,updateFileUpload } from '../dataAccess/fileUploadDA.js';
import multer from 'multer';
import FileUpload from '../entities/FileUpload.js';

let fileUploadRouter = express.Router();

//Configurare mullter pentru manipulare de fisiere
//----------------------------------------------------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Directorul în care vor fi stocate fișierele încărcate
},
  filename: function (req, file, cb) {
    cb(null, file.originalname);
},
});
//----------------------------------------------------------
const upload = multer({ storage: storage });

fileUploadRouter.route('/fileUpload').post(async (req, res) => {
    return res.json(await createFileUpload(req.body));
  });
  
  fileUploadRouter.route('/fileUpload').get(async (req, res) => {
    return res.json(await getFileUploads());
  });
  
  fileUploadRouter.route('/fileUpload/:id').get(async (req, res) => {
    return res.json(await getFileUploadById(req.params.id));
  });
  
  fileUploadRouter.route('/fileUpload/:id').delete(async (req, res) => {
    return res.json(await deleteFileUpload(req.params.id));
  });

// Adăugare de fișier încărcat
// fileUploadRouter.route('/fileUpload/add').post(async (req, res) => {
//   try {
//     const { FileName, FilePath, RequestID, IsUploaded } = req.body;

//     const newFileUpload = await createFileUpload({
//       FileName,
//       FilePath,
//       RequestID,
//       IsUploaded,
//     });

//     res.status(201).json({ message: 'File uploaded successfully', fileUpload: newFileUpload });
//   } catch (error) {
//     console.error('Error creating file upload:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Obținere toate fișierele încărcate
// fileUploadRouter.route('/fileUpload').get(async (req, res) => {
//   try {
//     const fileUploads = await getFileUploads();
//     res.status(200).json(fileUploads);
//   } catch (error) {
//     console.error('Error getting file uploads:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Obținere fișier încărcat după ID
// fileUploadRouter.route('/fileUpload/:id').get(async (req, res) => {
//   try {
//     const fileUploadId = req.params.id;
//     const fileUpload = await getFileUploadById(fileUploadId);

//     if (fileUpload) {
//       res.status(200).json(fileUpload);
//     } else {
//       res.status(404).json({ error: 'File upload not found' });
//     }
//   } catch (error) {
//     console.error('Error getting file upload by ID:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

fileUploadRouter.route('/fileUpload/upload').post(upload.single('file'), async (req, res) => {
  try {
    console.log(req.file);
    console.log(req.body.requestId);

    const newFile = await createFileUpload({
      FileName: req.file.originalname,
      FilePath: `uploads/${req.file.filename}`, 
      RequestId: req.body.requestId,
      Status:'Pending', 
    });

    res.status(200).json({ message: 'File uploaded successfully!' });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

fileUploadRouter.route('/fileUpload/upload/teacher').post(upload.single('file'), async (req, res) => {
  try {


    console.log(req.file);
    console.log(req.body.requestId);

    const newFile = await createFileUpload({
      FileName: req.file.originalname,
      FilePath: `uploads/${req.file.filename}`, 
      RequestId: req.body.requestId,
      Status:'Pending', 
      Sender:'Teacher',
    });

    res.status(200).json({ message: 'File uploaded successfully!' });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

fileUploadRouter.get('/fileUpload/findByRequestId/:value', async (req, res) => {
  const { value } = req.params;
  console.log(value,'hhh');
  try {
    const fileUpload = await findByField(value);
    
    if (fileUpload) {
      const fileUploadData = fileUpload.toJSON();
      res.json(fileUploadData);
      console.log('Datele despre fișier:', fileUploadData);
    } else {
      res.status(404).json({ message: 'FileUpload nu a fost găsit.' });
    }
  } catch (error) {
    console.error('Eroare în findByRequestId route:', error);
    res.status(500).json({ message: 'Eroare internă.' });
  }
});


fileUploadRouter.route('/fileupload/update/:id').put(async (req, res) => {
  try {
    const fileId = req.params.id;
    const { FileName,FilePath,RequestId,Status,Sender} = req.body;

    // Update the FileUpload record
    const updatedFileUpload = await updateFileUpload(fileId, {
        FileName,
        FilePath,
        RequestId,
        Status,
        Sender,
    });

    if (updatedFileUpload) {
      res.status(200).json({ message: 'FileUpload updated successfully', request: updatedFileUpload });
    } else {
      res.status(404).json({ error: 'FileUpload not found' });
    }
  } catch (error) {
    console.error('Error updating FileUpload:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


export default fileUploadRouter;