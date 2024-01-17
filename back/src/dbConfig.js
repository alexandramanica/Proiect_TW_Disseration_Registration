import { Sequelize } from 'sequelize';
import env from 'dotenv';

env.config();

const db = new Sequelize({
    dialect: 'mysql',
    database: 'disertatieproiect',
    username: 'root',
    password: 'password',  
    logging: false,
    define: {
    timestamps: false,
    freezeTableName: true
    }  
})

export default db;