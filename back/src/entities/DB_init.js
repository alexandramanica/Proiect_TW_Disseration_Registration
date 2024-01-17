import mysql from 'mysql2/promise.js'
import env from 'dotenv';
import Student from './Student.js';
import Teacher from './Teacher.js';
import Request from './Request.js';
import Session from './Session.js';
import FileUpload from './FileUpload.js';
import {reqTeacher} from './dbConst.js';
import {reqStudent} from './dbConst.js';

//creare db+ asocieri intre tabele

env.config();

function Create_DB(){
    let conn;

    mysql.createConnection({
        user: "root",  //probleme la accesare .env? 
        password:"password"
    })
    .then((connection) => {
        conn = connection;
        return connection.query('CREATE DATABASE IF NOT EXISTS DisertatieProiect')
    })
    .then(() => {
        return conn.end()
    })
    .catch((err) => {
        console.warn(err.stack)
    })
}

function FK_Config(){

    // // ----------------------- 1-n -------------------------------------
    Teacher.hasMany(Request, {as: reqTeacher,  foreignKey: "TeacherId"});
    Request.belongsTo(Teacher, {foreignKey: "TeacherId"})

    Student.hasMany(Request, {as: reqStudent,  foreignKey: "StudentId"});
    Request.belongsTo(Student, {foreignKey: "StudentId"})

    Teacher.hasMany(Session, { foreignKey: 'TeacherId' });
    Session.belongsTo(Teacher, { foreignKey: 'TeacherId' });

    Session.hasMany(Request, { foreignKey: 'SessionID' });
    Request.belongsTo(Session, { foreignKey: 'SessionID' });

    Request.hasMany(FileUpload, { foreignKey: 'RequestId' });
    FileUpload.belongsTo(Request, { foreignKey: 'RequestId' });
    
}

function DB_Init(){
    Create_DB();
    FK_Config();
}

export default DB_Init;