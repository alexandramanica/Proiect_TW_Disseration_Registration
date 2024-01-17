
import NavbarTeacher from '../CompReusable/NavbarTeacher'
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
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import Alert from '@mui/material/Alert';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ArticleIcon from '@mui/icons-material/Article';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { get, post, put, remove } from '../../api/Calls'; 


function RequestsPage() {

  const columns = [
    { id: 'RequestId', label: 'Request ID', minWidth: 170, align: 'right' },
    { id: 'Status', label: 'Status', minWidth: 170, align: 'right' },
    { id: 'RejectionReason', label: 'Rejection Reason', minWidth: 170, align: 'right' },
    { id: 'StudentId', label: 'Student ID', minWidth: 170, align: 'right' },
    { id: 'SessionID', label: 'Session ID', minWidth: 170, align: 'right' },
    { id: 'ActionStatus', label: 'Action Status', minWidth: 300, align: 'right' },
  ];

  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [showAlert, setShowAlert] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showErrorMaxNumber, setShowErrorMaxNumber] = useState(false);
  const [showErrorAlreadyAprpoved, setShowErrorAlreadyApproved] = useState(false);
  const [showRequestAccepted, setShowRequestAccepted] = useState(false);
  const [showRequestRejected, setShowRequestRejected] = useState();
  const [showNewButton, setShowNewButton] = useState(false);
  const [showSeeReqButton, setShowSeeReqButton]=useState(false);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedRequestSigned, setSelectedRequestSigned] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [fileId, setFileId]=useState(null);
  const [filePath,setFilePath]=useState(null);
  const [fileReqId,setFileReqId]=useState(null);
  const [fileStatus,setFileStatus]=useState(null);
  const [file, setFile] = useState(null); //trimitere fisier
  const [isFileSent, setIsFileSent]=useState(null);

  const [open, setOpen] = React.useState(false);
  const [openReq, setOpenreq] = React.useState(false);

  const currentUserString = localStorage.getItem('currentUser');
  const currentUser = JSON.parse(currentUserString);
  const teacherId = currentUser?.teacher?.TeacherId;

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

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await get('/request');
        const filteredRequest = data.filter(request => request.TeacherId === teacherId);
        const requestsWithActionStatus = filteredRequest.map(request => ({ ...request, ActionStatus: 'Pending' }));
        setRequests(requestsWithActionStatus);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [teacherId]);

  //de revazut aici
  const handleChangePage = (event, newPage) => {
    const totalPages = Math.ceil(requests.length / rowsPerPage);
    setPage(newPage >= totalPages ? totalPages - 1 : newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0); 
  };

  const handleAlertClose = () => {
    setShowAlert(false);
    setShowRequestAccepted(false);
    setShowRequestRejected(false);
  };

  const handleAlertErrorClose = () => {
    setShowError(false);
    setShowErrorMaxNumber(false);
    setShowErrorAlreadyApproved(false);
  };
  
  const handleRejectRequest = async (selectedRequest) => {
    try {
      const rejectionReason = document.getElementById('tbReject').value;
      if (!rejectionReason) {
        setShowError(true);
        return;
      }
  
      if (!selectedRequest || !selectedRequest.RequestId) {
        console.error('Selected request or RequestId is undefined.');
        return;
      }
  
      const requestData = {
        Status: 'Rejected',
        RejectionReason: rejectionReason,
        StudentId: selectedRequest.StudentId,
        TeacherId: teacherId,
        SessionId: selectedRequest.SessionID,
        isApproved:'No'
      };

      setRequests((prevRequests) =>
        prevRequests.map((prevRequest) =>
          prevRequest.RequestId === selectedRequest.RequestId
            ? { ...prevRequest, ...requestData }
            : prevRequest
        )
      );

      await put('/request/update/reject', selectedRequest.RequestId, requestData);
  
      setShowAlert(true);
    } catch (error) {
      console.error('Error submitting request:', error);
    }
  };

  const handleAcceptRequest = async (selectedRequest) => {
    try {

      const currentUserHandleString = localStorage.getItem('currentUser');
      const currentUserHandle = JSON.parse(currentUserHandleString);
      const maxNumberRequests = 5;

      if (currentUserHandle?.teacher?.NumberRequests >= maxNumberRequests) {
        console.error('Limita de cereri aprobate a fost atinsă.');
        setShowErrorMaxNumber(true);
        return;
      }

  
      const requestData = {
        Status: 'Approved',
        RejectionReason: '-',
        StudentId: selectedRequest.StudentId,
        TeacherId: teacherId,
        SessionId: selectedRequest.SessionID,
        isApproved:'Yes'
      };
  
      const teacherData = {
        TeacherName: currentUserHandle?.teacher?.TeacherName,
        TeacherSurName: currentUserHandle?.teacher?.TeacherSurName,
        TeacherEmail: currentUserHandle?.teacher?.TeacherEmail,
        TeacherPassword: currentUserHandle?.teacher?.TeacherPassword,
        NumberRequests: currentUserHandle?.teacher?.NumberRequests + 1,
       
      };
  
      // Setează starea cererii și profesorului
      setRequests((prevRequests) =>
        prevRequests.map((prevRequest) =>
          prevRequest.RequestId === selectedRequest.RequestId
            ? { ...prevRequest, ...requestData }
            : prevRequest
        )
      );
  
      // Așteaptă actualizarea cererii înainte de a continua
      await put('/request/update', selectedRequest.RequestId, requestData);
  
      // Așteaptă actualizarea profesorului înainte de a continua
      await put('/teacher/update', teacherId, teacherData);
  
      // Actualizează starea utilizatorului în localStorage
      localStorage.setItem('currentUser', JSON.stringify({ ...currentUser, teacher: teacherData }));
    } catch (error) {
      console.error('Error submitting request:', error);
      setShowErrorAlreadyApproved(true);
    }
  };



  const handleOpen = (request) => {
    console.log('Selected Request:', request);
    setSelectedRequest(request);
    setOpen(true);
  };

  const handleOpenReq = async (request) => {
    setSelectedRequestSigned(request);
  
    try {
      setOpenreq(true);
      const requestId=request.RequestId;

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
      //////

       console.log(idFisier);
      } else {
       console.error('Eroare:', data.message);
      }
    } catch (error) {
      console.error('Error fetching file details:', error);
    }
  };

  const handleFileUpdateAccept = async () => {
    try {
      const fileData = {
        FileName:fileName,
        FilePath:filePath,
        RequestId:fileReqId,
        Status:'Approved',
        Sender:'Student',
      };
  
      await put('http://localhost:8001/api/fileupload/update',fileId, fileData);
      setShowRequestAccepted(true);
      setShowNewButton(true);
  
    } catch (error) {
      console.error('Error submitting request:', error);
    }
  };

  const handleFileUpdateReject = async () => {
    try {
      const fileData = {
        FileName:fileName,
        FilePath:filePath,
        RequestId:fileReqId,
        Status:'Rejected',
        Sender:'Student',
      };
  
      await put('http://localhost:8001/api/fileupload/update',fileId, fileData);
      setShowRequestRejected(true);
  
    } catch (error) {
      console.error('Error submitting request:', error);
    }
  };
  
  const handleClose = () => {
    setSelectedRequest(null); // Resetăm selectedRequest când închidem modalul
    setOpen(false);
  };

  const handleCloseReq = () => {
    setSelectedRequestSigned(null); // Resetăm selectedRequest când închidem modalul
    setOpenreq(false);
    setFileName(null);
    setFilePath(null);
    setFileReqId(null);
    setFileId(null);
    setShowNewButton(false);
  };

  //HANDLE PE FISIERE
  //----------------------------------------------------------------------------------------
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    console.log('haha', selectedFile);
    setFile(selectedFile);
  }

  const handleUpload = async () => {
    try {
          if (!file) {
            console.error('No file selected for upload.');
            return;
          }  

      const formData = new FormData();
      formData.append('file', file);
      formData.append('requestId', fileReqId);
      console.log('FormData:', formData);

      const response = await axios.post('http://localhost:8001/api/fileUpload/upload/teacher', formData);

        if (response.status === 200) {
          console.log('File uploaded successfully!');
          setIsFileSent(true);
        } else {
          console.error('File upload failed:', response.data);
        }
      } catch (error) {
      console.error('Error uploading file:', error);
    }
  };
  
  //!!!!!
  React.useEffect(() => {
    if (file) {
      handleUpload(); 
    }
  }, [file, fileReqId]); 
  //----------------------------------------------------------------------------------------

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    p: 4,
  };

  return (
   <div>
      <NavbarTeacher />

      <div className="container my-5">
      <div className="p-5 text-center bg-body-tertiary rounded-3 border border-warning">
        <h1 className="text-body-emphasis">Your requests</h1>
        <p className="lead">
          Please see and interact with your requests using the table below!
        </p>
      </div>
    </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh', marginTop: '20px' }}>
        <Paper sx={{ width: '85%', overflow: 'hidden' }}>
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
                        {column.id === 'ActionStatus' ? (
                          request.Status === 'Pending' ? (
                            <div>
                              <Button variant="outlined" sx={{marginRight:'10px'}} startIcon={<DeleteIcon />} onClick={() => handleOpen(request)}>
                                Reject
                              </Button>
                              <Button variant="contained" endIcon={<SendIcon />} onClick={() => handleAcceptRequest(request)} >
                                Accept
                              </Button>
                            </div>
                          )  : request.Status === 'Approved' ? (
                            <Button sx={{background:'#FFC107'}} variant="contained" color="primary" startIcon={<ArticleIcon/>} onClick={() => handleOpenReq(request)}>
                             See request
                            </Button>
                          ): request.Status === 'Rejected' ? (
                            <div>The request was rejected!</div>
                          ) : null
                        ) : (
                          request[column.id]
                        )}
                      </TableCell>
                    ))}
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
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{marginBottom:'10px'}}>
            Rejection reason
          </Typography>
          <TextField sx={{ width: '340px',marginBottom:'10px' }}
            id="tbReject"
            placeholder="Please write the rejection reason of this request"
            multiline/>
           <Button variant="outlined" startIcon={<DeleteIcon />} onClick={() => handleRejectRequest(selectedRequest)}>
            Reject
          </Button>

        </Box>
      </Modal>
      <Modal
        open={openReq}
        onClose={handleCloseReq}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
         <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Upload request
          </Typography>
          {fileName !== null ? (
            <div>
              <p>Numele fișierului: {fileName}</p>
              {fileStatus === 'Pending' ? (
              <div>
                <Button variant="outlined" sx={{marginRight:'10px'}} startIcon={<DeleteIcon />} onClick={() => handleFileUpdateReject()}>
                  Reject
                </Button>
                <Button variant="contained" endIcon={<SendIcon />} onClick={() => handleFileUpdateAccept()} >
                  Accept
                </Button>
                {showNewButton && (
                 <div>
                  <p>Please upload your request using the button below!</p>
                  <Button component="label" variant="contained" startIcon={<CloudUploadIcon />} sx={{marginTop:'10px'}}  onClick={() => handleUpload()}>
                    Upload file
                  <VisuallyHiddenInput type="file" onChange={handleFileChange} />
                  </Button>
                  </div>
                )}
                 </div> ) : (
                  <p>Status: {fileStatus}</p>)}
            </div>
          )  : (
            <div>
              <p>This student hasn't submitted a request!</p>
            </div>
          )}
        </Box>
      </Modal>
      <div>
      {showAlert && (
      <Alert onClose={handleAlertClose} severity="success" sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9999 }}>
        You've rejected the request and sent the response!
      </Alert>
      )}

      {showError && (
        <Alert onClose={handleAlertErrorClose} severity="error" sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9999 }}>
          Please provide a rejection reason.
        </Alert>
      )}
        {showErrorMaxNumber && (
        <Alert onClose={handleAlertErrorClose} severity="error" sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9999 }}>
          You've reached the max number of students!
        </Alert>
      )}
       {showErrorAlreadyAprpoved&& (
        <Alert onClose={handleAlertErrorClose} severity="error" sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9999 }}>
          This student is already approved by you or someone else! Please, refresh!
        </Alert>
      )}
       {showRequestAccepted && (
      <Alert onClose={handleAlertClose} severity="success" sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9999 }}>
        The request was succesefully accepted! Please, load your response!
      </Alert>
      )}
      {showRequestRejected && (
      <Alert onClose={handleAlertClose} severity="success" sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9999 }}>
        The request was succesefully rejected! 
      </Alert>
      )}
      </div>
    </div>
  )
}

export default RequestsPage;