
import NavbarTeacher from '../CompReusable/NavbarTeacher'
import React, { useState } from 'react'
import { Box, Typography } from "@mui/material"
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import axios from 'axios';
import {get} from '../../api/Calls'

function HomeTeacher() {

  //---PRELUARE LOCAL STORAGE
  const currentUserString = localStorage.getItem('currentUser');
  const currentUser = JSON.parse(currentUserString);
  const teacherId = currentUser?.teacher?.TeacherId;
  const userName = currentUser?.teacher?.TeacherName;
  const userSurName = currentUser?.teacher?.TeacherSurName;
 
  //TABEL
  //------------------------------------------------------------------------------
  const columns = [
    { id: 'SessionId', label: 'Session ID', minWidth: 170 },
    { id: 'Title', label: 'Title', minWidth: 170, align: 'right' },
    { id: 'TeacherId', label: 'Teacher ID', minWidth: 170, align: 'right' },
    { id: 'StartDate', label: 'Start Date', minWidth: 170, align: 'right' },
    { id: 'EndDate', label: 'End Date', minWidth: 170, align: 'right' },
  ];

  const [sessions, setSessions] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showError, setShowError] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleAlertErrorClose = () => {
    setShowError(false);
  };
  const handleAlertClose = () => {
    setShowAlert(false);
  };

  React.useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await get('/session');
      const filteredSessions = data.filter(session => session.TeacherId === teacherId);
      setSessions(filteredSessions);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
    fetchData();
  }, [teacherId]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  //------------------------------------------------------------------------------

  //--ADAUGARE SESIUNE
  //------------------------------------------------------------------------------
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleSessionSubmit = async () => {
    try {
      //preluare date de start si end pentru sesiunea nou adaugata
      const startISO = startDate.toISOString();
      const endISO = endDate.toISOString();
  
     //verificare existenta conflicte - some returneaza true daca un el al array ul respecta conditia (adica se suprapune)
      const hasConflict = sessions.some(session => {
        const sessionStart = new Date(session.StartDate).toISOString();
        const sessionEnd = new Date(session.EndDate).toISOString();
  
      //comparam intervalele de timp 
        return (
          (startISO >= sessionStart && startISO <= sessionEnd) ||
          (endISO >= sessionStart && endISO <= sessionEnd) ||
          (startISO <= sessionStart && endISO >= sessionEnd)
        );
      });
  
      if (hasConflict) {
        console.error('The new session conflicts with an existing session.');
        setShowError(true);
      } else {
        const sessionData = {
          title: title,
          startDate: startISO,
          endDate: endISO,
          currentApplications: 0,
          teacherId: teacherId,
        };
  
        const response = await axios.post('http://localhost:8001/api/session/add', sessionData);
        setShowAlert(true);
        console.log(response.data);
      }
    } catch (error) {
      console.error('Error submitting session:', error);
    }
  };

  return (
    <div>
    <LocalizationProvider dateAdapter={AdapterDayjs}>

      <NavbarTeacher />

      <div className="container my-5">
        <div className="position-relative p-5 text-center text-muted bg-subtle  border border-dashed rounded-5">
        <h1 className="text-body-emphasis">Welcome back,    
          <span className="text-warning"> {userName} {userSurName}</span>
        </h1>
          <p className="col-lg-6 mx-auto mb-4">Here you can see and add your sessions using the controls below! </p>
      </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <TextField id="Title" label="Title" variant="outlined" value={title} onChange={(e) => setTitle(e.target.value)} />
          <DatePicker label="Start Date" value={startDate} onChange={(date) => setStartDate(date)} renderInput={(params) => <TextField {...params} variant="outlined" />} />
          <DatePicker label="End Date" value={endDate} onChange={(date) => setEndDate(date)} renderInput={(params) => <TextField {...params} variant="outlined" />} />
        </div>
        <Button
          style={{ background: '#FFC107', marginTop: '10px' }}
          startIcon={<AddCircleIcon />}
          variant="contained"
          onClick={handleSessionSubmit}
        >
          New Session
        </Button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh', marginTop: '20px' }}>
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
                    </TableCell>
              </TableRow>
            ))}
            </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={sessions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
      {showError && (
      <Alert onClose={handleAlertErrorClose} severity="error" sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9999 }}>
        There's already a session with this time frame!
      </Alert>
    )}

      {showAlert && (
      <Alert onClose={handleAlertClose} severity="success" sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9999 }}>
       Session added succesfully! Please refresh page!
      </Alert>
      )}
    </LocalizationProvider>
  </div>
   
  )
}

export default HomeTeacher;