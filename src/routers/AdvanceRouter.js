import { Router } from 'express';
import { createAdvance, deleteAdvance, getAdvanceById, updateAdvance } from '../controller/AdvanceController.js';

const AdvanceRouter = Router();

// AdvanceRouter.get('/overtime', getAdvanceById);
AdvanceRouter.post('/advance', createAdvance);
AdvanceRouter.put('/advance/:AdvanceID', updateAdvance);
// AdvanceRouter.get('/overtime/:OvertimeID', getAdvanceById);
AdvanceRouter.delete('/advance/:AdvanceID', deleteAdvance);

export default AdvanceRouter;
