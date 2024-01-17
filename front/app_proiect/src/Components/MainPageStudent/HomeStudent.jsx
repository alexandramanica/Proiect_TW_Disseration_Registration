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
import {get} from '../../api/Calls'
import NavbarStudent from '../CompReusable/NavbarStudent';
import { useNavigate } from 'react-router-dom';

function HomeStudent() {
  
  const [teachers, setTeachers] = React.useState([]); //variabila initiala setata ca un array gol ce va prelua datele din bd
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const navigate = useNavigate();

  //Preluare din local storage
  const currentUserString = localStorage.getItem('currentUser');
  const currentUser = JSON.parse(currentUserString);
  const userName = currentUser?.student?.StudentName;
  const userSurName = currentUser?.student?.StudentSurName;

  //Definire Tabel
  //-------------------------------------------------------------
  const columns = [
    { id: 'TeacherName', label: 'Teacher Name', minWidth: 170 },
    { id: 'TeacherSurName', label: 'Teacher SurName', minWidth: 100 },
    { id: 'TeacherEmail', label: 'Teacher Email', minWidth: 170 },
  ];

  //functie aducere date
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await get('/teacher'); 
        setTeachers(data);
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
  //-------------------------------------------------------------

  //functie de salvare 
  const handleChooseTeacher = (teacherId) => {
    setSelectedTeacherId(teacherId);
    localStorage.setItem('selectedTeacherId', teacherId.toString());
    navigate('/ChoosePage')
  };

  return (
    <div>
    <NavbarStudent/>

    <div className="container my-5">
      <div className="position-relative p-5 text-center text-muted bg-subtle  border border-dashed rounded-5">
      <h1 className="text-body-emphasis">Welcome back,    
        <span className="text-warning"> {userName} {userSurName}</span>
      </h1>
        <p className="col-lg-6 mx-auto mb-4">Please select your favorite teacher from the table below!</p>
    </div>
    </div>

    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70 vh' }}>
    <Paper sx={{ width: '95%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
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
            {teachers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((teacher) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={teacher.TeacherId}>
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align}>
                      {teacher[column.id]}
                    </TableCell>
                  ))}
                   <TableCell key="actions" align="right">
                   <Button className='btn btn-warning w-100'
                   onClick={() => handleChooseTeacher(teacher.TeacherId)}>
                      Choose teacher
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={teachers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
    </div>
    </div>
  );
}

export default HomeStudent;
