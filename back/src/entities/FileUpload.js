import db from '../dbConfig.js';
import Sequelize from 'sequelize';

const FileUpload = db.define('FileUpload', {
  FileId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  FileName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  FilePath: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  RequestId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  Status: {
    type: Sequelize.ENUM('Pending', 'Approved', 'Rejected'),
    defaultValue: 'Pending',
    allowNull: false,
  },
  Sender: {
    type: Sequelize.ENUM('Student', 'Teacher'),
    defaultValue: 'Student',
    allowNull: false,
  },
});

// FileUpload.sync({ force: true })
//   .then(() => {
//     console.log('Tabela Files a fost recreată cu succes.');
//   })
//   .catch((error) => {
//     console.error('Eroare la recrearea tabelei Student:', error);
//   });

export default FileUpload;