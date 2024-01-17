import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage from './styles/45271.jpg'

function FirstPage() {
  const containerStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh', // Asigură-te că întreaga înălțime a paginii este acoperită de imaginea de fundal
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center'}
 
    return(
    <div style={containerStyle}>
      <div className="px-4 py-5 my-5 text-center" >
      <h1 className="display-5 fw-bold">WELCOME BACK!</h1>
      <div className="col-lg-6 mx-auto">
        <p className="lead mb-4  ">Are you a student or a teacher?</p>
        <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
          <Link to="/Login" type="button" className="btn btn-outline-info btn-lg px-4 gap-3" fdprocessedid="ygq5mh">Student</Link>
          <Link to="/LoginTeacher" type="button"  className="btn btn-outline-secondary btn-lg px-4" fdprocessedid="yy7bz8" >Teacher</Link>
        </div>
      </div>
    </div>
  </div>
  )
}

export default FirstPage