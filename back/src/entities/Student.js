import db from '../dbConfig.js';
import Sequelize from 'sequelize';

const Student = db.define('Student', {
  StudentId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  StudentName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  StudentSurName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  StudentGroup: {
    type: Sequelize.INTEGER, 
    allowNull: false,
  },
  StudentEmail: {
    type: Sequelize.STRING,
    allowNull: true, // sau true în funcție de nevoile tale
  },
  StudentPassword: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  IsRequestApproved: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
});

//creare fortata
// Student.sync({ force: true })
//   .then(() => {
//     console.log('Tabela Student a fost recreată cu succes.');
//   })
//   .catch((error) => {
//     console.error('Eroare la recrearea tabelei Student:', error);
//   });

export default Student;
