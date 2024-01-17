import NavbarStudent from '../CompReusable/NavbarStudent'
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
import Alert from '@mui/material/Alert';
import {get} from '../../api/Calls'
import axios from 'axios';


function ChoosePage() {
  
  //---Preluare Local Storage
  const currentUserString = localStorage.getItem('currentUser');
  const currentUser = JSON.parse(currentUserString);
  const studentId = currentUser?.student?.StudentId;
  const teacherId= localStorage.getItem('selectedTeacherId'); 

  const [sessions, setSessions] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  //ALERTA
  //------------------------------------------------------------
  const [showAlert, setShowAlert] = useState(false);

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  //TABEL
  //----------------------------------------------------------------
  const columns = [
    { id: 'SessionId', label: 'Session ID', minWidth: 170 },
    { id: 'Title', label: 'Title', minWidth: 170, align: 'right' },
    { id: 'StartDate', label: 'Start Date', minWidth: 170, align: 'right' },
    { id: 'EndDate', label: 'End Date', minWidth: 170, align: 'right' },
  ];

 React.useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await get('/session');
      const filteredSessions = data.filter(session => session.TeacherId === parseInt(teacherId));
      setSessions(filteredSessions);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  fetchData();
}, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  //----------------------------------------------------------------

  //---Functie salvare local storage
  const handleChooseTeacher = (sessionId) => {
      setSelectedSessionId(sessionId);
      localStorage.setItem('selectedSessionId', sessionId.toString());
  };
    
  //---Functie de salvare in bd a sesiunilor
  const handleRequestSubmit = async () => {
      try {
        const sessionId=localStorage.getItem('selectedSessionId');
        
        const requestData = {
          Status:'Pending',
          RejectionReason :null,
          StudentId:parseInt(studentId),
          TeacherId: parseInt(teacherId),
          SessionId: sessionId
        };
        console.log('Submitting request with data:', requestData);
        const response = await axios.post('http://localhost:8001/api/request/add', requestData);
        console.log('Submitting response with data:',response.data);

        setShowAlert(true);
      } catch (error) {
        console.error('Error submitting request:', error);
      }
    };

  //----Functie apelare button - apel de doua alte functii
  const handleButtonClick = (sessionId) => {
      handleChooseTeacher(sessionId);
      handleRequestSubmit();
      
    };
  
  return (
    <div>
      <NavbarStudent />

      <div className="container my-5">
      <div className="p-5 text-center bg-body-tertiary rounded-3 border border-warning">
        <h1 className="text-body-emphasis">Session to choose from</h1>
        <p className="lead">
          Please choose the session that suits your preferences!
        </p>
      </div>
    </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', marginTop: '20px' }}>
        <Paper sx={{ width: '95%', overflow: 'hidden', maxHeight: '100%' }}>
          <TableContainer sx={{ maxHeight: '100%' }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth, fontWeight: 'bold', color:"#023e8a" }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              <TableCell align="right" style={{ minWidth: 170, fontWeight: 'bold', color: "#023e8a" }}></TableCell>
              </TableRow>
              </TableHead>
              <TableBody>
                {sessions
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((session) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={session.SessionId}>
                        {columns.map((column) => (
                        <TableCell key={column.id} align={column.align}>
                            {column.id === 'TeacherId' ? session.TeacherId : session[column.id]}
                        </TableCell>
                        ))}
                    <TableCell key="actions" align="right">
                        <Button className='btn btn-warning w-100'
                         onClick={() =>handleButtonClick(session.SessionId)}>
                         Choose session
                         </Button>
                    </TableCell>
            </TableRow>
            ))}
            </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[4, 10, 15]}
            component="div"
            count={sessions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
      
      {showAlert && (
        <Alert onClose={handleAlertClose} severity="success" sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9999 }}>
          You've chosen this session with succes! Please wait for the teacher to respond to you request!
        </Alert>
      )}
  </div>
   
  )
};

export default ChoosePage