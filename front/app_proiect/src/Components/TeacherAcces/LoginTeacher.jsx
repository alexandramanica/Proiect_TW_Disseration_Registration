import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import validation from './LoginValidation'
import Alert from '@mui/material/Alert';
import axios from 'axios'


function LoginTeacher() {
    const [values,setValues]=useState({
        email:'',
        password:''
    })
    
    const[error,setErrors]=useState({});
    const navigate = useNavigate();
    const [showError, setShowError] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        const err = validation(values);
        setErrors(err);
    
        if ( err.email === '' &&  err.password === '') {
          axios.post("http://localhost:8001/api/teacher/login", values)
                .then((res) => {
                 // Salvarea informațiilor utilizatorului în localStorage
                localStorage.setItem('currentUser', JSON.stringify(res.data));
                //navigare homeStud
                navigate("/HomeTeacher");
      })
      .catch((err) =>  setShowError(true));

        }
      };

    const handleInput=(event)=>{
        setValues(prev=>({...prev,[event.target.name]:event.target.value}));
    }

    const handleAlertClose = () => {
      setShowError(false);
    };

  return (
    <div className='d-flex vh-100 justify-content-center align-items-center bg-info-subtle'>
        <div className='p-3 bg-white w-25 rounded '>
        <h2 className='d-flex vh-25 justify-content-center align-items-center'>Log in </h2>
            <form  onSubmit={handleSubmit}>
                <div className='mb-3'>
                    <label htmlFor='email'>Email</label>
                    <input type='email' placeholder='Enter email' className='form-control ' name='email'
                    onChange={handleInput}/>
                    {error.email &&<span className='text-danger'>{error.email}</span>}
                </div>
                <div className='mb-3'>
                    <label htmlFor='password' >Password</label>
                    <input type='password' placeholder='Enter password' className='form-control'  name='password'
                     onChange={handleInput}/>
                     {error.password &&<span className='text-danger'>{error.password}</span>}
                </div>
                <button type="submit" className='btn btn-outline-info w-100'><strong>Login</strong></button>
                <p></p>
                <Link to='/RegisterTeacher'className='btn btn-outline-dark border w-100 text-decoration-none'><strong>Create account</strong></Link>
                <p></p>
                <Link to='/' type="button" className="btn btn-dark btn-sm">Go back</Link>
            </form>
        </div>
        {showError && (
        <Alert onClose={handleAlertClose} severity="error" sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9999 }}>
          Password and email don't match! Please try again!
        </Alert>
      )}
    </div>
  )
}

export default LoginTeacher