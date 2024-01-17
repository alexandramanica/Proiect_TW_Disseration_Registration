import db from '../dbConfig.js';
import Sequelize from 'sequelize';

const Request = db.define('Request', {
  RequestId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  Status: {
    type: Sequelize.ENUM('Pending', 'Approved', 'Rejected'),
    defaultValue: 'Pending',
    allowNull: false,
  },
  RejectionReason: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  StudentId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  TeacherId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  SessionID: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  isApproved: {
    type: Sequelize.ENUM('Yes','No'),
    defaultValue: 'No',
    allowNull: false,
  },
});


// Request.sync({ force: true })
//   .then(() => {
//     console.log('Tabela Request a fost recreată cu succes.');
//   })
//   .catch((error) => {
//     console.error('Eroare la recrearea tabelei Student:', error);
//   });

export default Request;