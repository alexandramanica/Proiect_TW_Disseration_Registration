import React, { useState } from 'react'
import { Box, Typography } from "@mui/material"
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Alert from '@mui/material/Alert';
import {get} from '../../api/Calls'
import NavbarStudent from '../CompReusable/NavbarStudent';
import Modal from '@mui/material/Modal';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import axios from 'axios';


function StudentRequest() {
    
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    p: 4,
  };

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  const [requests, setRequests] = useState([]);
  const [requestId,setRequestId]=useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  //Gestionare fisiere
  const [fileName, setFileName] = useState(null);
  const [fileId, setFileId]=useState(null);
  const [filePath,setFilePath]=useState(null);
  const [fileReqId,setFileReqId]=useState(null);
  const [fileStatus,setFileStatus]=useState(null);

  const [showNewButton, setShowNewButton] = useState(false);
  const navigate = useNavigate();

  //Modale si alerte
  const [file, setFile] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [openStatus, setOpenStatus] = React.useState(false);
  const [isFileSent, setIsFileSent] = useState(false);

  const currentUserString = localStorage.getItem('currentUser');
  const currentUser = JSON.parse(currentUserString);
  const studentId = currentUser?.student?.StudentId;

  //TABEL
  //------------------------------------------------------------------------------------
  const columns = [
    { id: 'RequestId', label: 'Request ID', minWidth: 130, align: 'right' },
    { id: 'Status', label: 'Status', minWidth: 170, align: 'right' },
    { id: 'RejectionReason', label: 'Rejection Reason', minWidth: 170, align: 'right' },
    { id: 'StudentId', label: 'Student ID', minWidth: 170, align: 'right' },
    { id: 'TeacherId', label: 'Teacher ID', minWidth: 170, align: 'right' },
    { id: 'SessionID', label: 'Session ID', minWidth: 170, align: 'right' },
  ];

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await get('/request');
        const filteredRequest = data.filter(request => request.StudentId === studentId);
        setRequests(filteredRequest);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [studentId]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0); 
  };
  //------------------------------------------------------------------------------------

  const handleAlertClose = () => {
    setShowAlert(false);
  };
 
  //----- MODALA 1
  //------------------------------------------------------------------------------------
  const handleOpen = (requestId) => {
   setRequestId(requestId); 
   console.log(requestId,'req');
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

 //----- MODALA 2
  //------------------------------------------------------------------------------------

  const handleOpenStatus = async (request) => {
    try {
      setOpenStatus(true);
      const requestId=request.RequestId;
      console.log(requestId);
      const response = await fetch(`http://localhost:8001/api/fileUpload/findByRequestId/${requestId}`);
      console.log(response);
      const data = await response.json();
      
      if (response.ok) {
       console.log('Datele despre fisier:', data);
       const numeFisier = data.FileName;
       const idFisier=data.FileId
       const pathFisier=data.FilePath;
       const fisierReqId=data.RequestId;
       const fisierStatus=data.Status;

       setFileName(numeFisier);
       setFileId(idFisier);
       setFilePath(pathFisier);
       setFileReqId(fisierReqId);
       setFileStatus(fisierStatus);
       //console.log(fileStatus);
      //////

       console.log(idFisier);
      } else {
       console.error('Eroare:', data.message);
      }
    } catch (error) {
      console.error('Error fetching file details:', error);
    }
  };

  const handleCloseStatus = () => setOpenStatus(false);

  //----- GESTIONARE FISIERE
  //------------------------------------------------------------------------------------
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      
      if (!file) {
        console.error('No file selected for upload.');
        return;
      }  
      const formData = new FormData();
      formData.append('file', file);
      formData.append('requestId', requestId);
      
      console.log("hhhhhhhhh");
      setIsFileSent(true);
      await axios.post('http://localhost:8001/api/fileUpload/upload', formData);
      console.log("ggggg");

      setShowAlert(true);

    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  React.useEffect(() => {
    if (file) {
      handleUpload(); 
    }
  }, [file, fileReqId]); 
  //------------------------------------------------------------------------------------

   
  return (
    <div>
    <NavbarStudent/>
    <div className="container my-5">
      <div className="p-5 text-center bg-body-tertiary rounded-3 border border-warning">
        <h1 className="text-body-emphasis">Your requests</h1>
        <p className="lead">
          Please see and interact with your requests using the table below!
        </p>
      </div>
    </div>
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh', marginTop: '20px' }}>
        <Paper sx={{ width: '95%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth, fontWeight: 'bold', color: "#023e8a" }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                  <TableCell align="right" style={{ minWidth: 170, fontWeight: 'bold', color: "#023e8a" }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((request) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={request.RequestId}>
                      {columns.map((column) => (
                        <TableCell key={column.id} align={column.align}>
                          {request[column.id]}
                        </TableCell>
                      ))}
                   <TableCell key="actions" align="right">
                    {request.Status === 'Approved' && (
                      // Verifică starea isFileSent și afișează butonul corespunzător
                      isFileSent ? (
                        <div>
                        <Button sx={{background:'#FFC107'}} variant="contained" size="medium" endIcon={<AssignmentIndIcon/>} onClick={() => handleOpenStatus(request)}>
                          See request status
                        </Button>
                      </div>
                      ) : (
                        <div>
                          <Button sx={{background:'#FFC107'}} variant="contained" size="medium"  endIcon={<UploadFileIcon /> } onClick={() => handleOpen(request.RequestId)} >
                            Load file
                          </Button>
                        </div>
                      )
                    )}
                  </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={requests.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Upload request
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
           Please upload your request using the button below
          </Typography>
          <Button component="label" variant="contained" startIcon={<CloudUploadIcon />} sx={{marginTop:'10px'}}  onClick={() => handleUpload(Request.requestId)}>
          Upload file
          <VisuallyHiddenInput type="file" onChange={handleFileChange} />
        </Button>
        </Box>
      </Modal>
    </div>
    <div>
      <Modal
        open={openStatus}
        onClose={handleCloseStatus}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
         <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Request Info
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            File Name: {fileName}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
           File Status: {fileStatus}
          </Typography>
          {fileStatus === 'Rejected' && (
              <Button component="label" variant="contained" startIcon={<CloudUploadIcon />} sx={{marginTop:'10px'}}  onClick={() => handleUpload(Request.requestId)}>
                 Upload file
                <VisuallyHiddenInput type="file" onChange={handleFileChange} />
               </Button>
            )}
          </Box>
      </Modal>
    </div>
    {showAlert && (
        <Alert onClose={handleAlertClose} severity="success" sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9999 }}>
          The request has been sent to the teacher! Please wait for their response!
        </Alert>
      )}
    </div>
  );
}

export default StudentRequest;