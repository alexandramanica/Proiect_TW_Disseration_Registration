import express from 'express';
import db from '../dbConfig.js';

let masterRouter = express.Router();

masterRouter.route('/create').get(async (req, res) => {
    try{
        await db.sync({force : false})   //force pe false? - de revazut 
        res.status(201).json({message : 'created'})
    }
    catch(err){
        console.warn(err)
        res.status(500).json({message : 'server error'})
    }
});

export default masterRouter;