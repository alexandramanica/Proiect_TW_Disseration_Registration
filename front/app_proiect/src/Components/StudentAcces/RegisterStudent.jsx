import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import validation from './RegisterValidationStudent.jsx';
import axios from 'axios';

function Register() {
  const [values, setValues] = useState({
  email: '',
  password: '',
  name: '',
  surname: '',
  group: 0,
});
  const [error, setErrors] = useState({});

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const err = validation(values);
    setErrors(err);

    if (err.name === '' && err.surname === '' && err.email === '' && err.group === '' && err.password === '') {
      axios.post("http://localhost:8001/api/student/register", values)
            .then((res) => {
            navigate("/Login");
  }).catch((err) => console.log(err));
    }
  };

  const handleInput = (event) => {
  setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };


  return (
    <div className='d-flex vh-100 justify-content-center align-items-center bg-info-subtle'>
        <div className='p-3 bg-white w-25  rounded'>
            <h2 className='d-flex vh-25 justify-content-center align-items-center'>Sign Up</h2>
            <form  onSubmit={handleSubmit}>
            <div className='mb-3'>
                    <label htmlFor='Name'>Name</label>
                    <input type='text' placeholder='Enter name' className='form-control' onChange={handleInput} name='name'/>
                    {error.email &&<span className='text-danger'>{error.name}</span>}
                </div>
                <div className='mb-3'>
                    <label htmlFor='Surame'>Surname</label>
                    <input type='text' placeholder='Enter surname' className='form-control'  onChange={handleInput} name='surname'/>
                    {error.email &&<span className='text-danger'>{error.surname}</span>}
                </div>
                <div className='mb-3'>
                    <label htmlFor='Group'>Group</label>
                    <input type='number' placeholder='Enter group' className='form-control'  onChange={handleInput} name='group'/>
                    {error.email &&<span className='text-danger'>{error.group}</span>}
                </div>
                <div className='mb-3'>
                    <label htmlFor='email'>Email</label>
                    <input type='email' placeholder='Enter email' className='form-control'  onChange={handleInput} name='email'/>
                    {error.email &&<span className='text-danger'>{error.email}</span>}
                </div>
                <div className='mb-3'>
                    <label htmlFor='password' >Password</label>
                    <input type='password' placeholder='Enter password' className='form-control'  onChange={handleInput} name='password'/>
                     {error.password &&<span className='text-danger'>{error.password}</span>}
                </div>
                <button className='btn btn-outline-info w-100'><strong>Register</strong></button>
                <p></p>
                <Link to='/Login' className='btn btn-outline-dark border w-100 text-decoration-none'><strong>Login</strong></Link>
                <p></p>
                <Link to='/' type="button" className="btn btn-dark btn-sm">Go back</Link>
            </form>
        </div>
    </div>
  );
}

export default Register;
