import db from '../dbConfig.js';
import Sequelize from 'sequelize';

const Teacher = db.define('Teacher', {
    TeacherId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    TeacherName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    TeacherSurName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    TeacherEmail: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    TeacherPassword: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    NumberRequests: {
        type: Sequelize.INTEGER,
        defaultValue: 0, // Valoarea implicită
        allowNull:true
      }
  });

  // Teacher.sync({ force: true })
  // .then(() => {
  //   console.log('Tabela Student a fost recreată cu succes.');
  // })
  // .catch((error) => {
  //   console.error('Eroare la recrearea tabelei Student:', error);
  // });

  export default Teacher;