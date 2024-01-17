import logo from './logo.svg';
import './App.css';
import Login from './Components/StudentAcces/Login';
import Register from './Components/StudentAcces/RegisterStudent'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import { Link } from 'react-router-dom';
import HomeStudent from './Components/MainPageStudent/HomeStudent';
import LoginTeacher from './Components/TeacherAcces/LoginTeacher';
import RegisterTeacher from './Components/TeacherAcces/RegisterTeacher';
import HomeTeacher from './Components/MainPageTeacher/HomeTeacher';
import RequestsPage from './/Components/MainPageTeacher/RequestsPage'
import FirstPage from './Components/FirstPage';
import StudentRequest from './Components/MainPageStudent/StudentRequest';
import ChoosePage from './Components/MainPageStudent/ChoosePage';


function App() {
  return (
    
    <BrowserRouter>

    <Routes>
      <Route path='/' element={<FirstPage/>}></Route>
      <Route path='/Register' element={<Register/>}></Route>
      <Route path='/HomeStudent' element={<HomeStudent/>}></Route>
      <Route path='/Login' element={<Login/>}></Route>
      <Route path='/LoginTeacher' element={<LoginTeacher/>}></Route>
      <Route path='/RegisterTeacher' element={<RegisterTeacher/>}></Route>
      <Route path='/HomeTeacher' element={<HomeTeacher/>}></Route>
      <Route path='/RequestsPage'  element={<RequestsPage/>}></Route>
      <Route path='/StudentRequest'  element={<StudentRequest/>}></Route>
      <Route path='/ChoosePage'  element={<ChoosePage/>}></Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
