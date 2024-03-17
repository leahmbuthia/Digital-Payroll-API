import { Router } from 'express';
import { createPosition, deletePosition, getPositionById, getPositions, updatePosition } from "../controller/PositionController.js";
const PositionRouter = Router();

PositionRouter.post("/position", createPosition);
PositionRouter.get("/position", getPositions);
PositionRouter.get('/position/:positionID', getPositionById);
PositionRouter.put('/position/:positionID', updatePosition);
PositionRouter.delete('/position/:positionID', deletePosition);

export default PositionRouter;
