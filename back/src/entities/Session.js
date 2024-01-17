import Sequelize from 'sequelize';
import db from '../dbConfig.js';

const Session = db.define('Session', {
  SessionId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  Title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  StartDate: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  EndDate: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  // CurrentApplications: {
  //   type: Sequelize.INTEGER,
  //   allowNull: false,
  // },
  TeacherId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

// Session.sync({ force: true })
//   .then(() => {
//     console.log('Tabela a fost recreată cu succes.');
//   })
//   .catch((error) => {
//     console.error('Eroare la recrearea tabelei Student:', error);
//   });

export default Session;
