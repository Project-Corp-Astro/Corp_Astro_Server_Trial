import { getAllAuthenticationLogs, getAuthenticationLogById } from "../controllers/auth.controller";
import { registerDevice } from "../controllers/user_devices.controler";
import { RequestHandler } from "express";
import { authenticate } from "../../../middleware/auth.middleware";
import { notifyUser } from "../controllers/user_devices.controler";
import { Router } from "express";

const authRoutes = Router();

//get all authentication logs   
authRoutes.get('/authentication-logs',  getAllAuthenticationLogs as unknown as RequestHandler);
//get authentication log by id 
authRoutes.get('/authentication-logs/:id', getAuthenticationLogById as unknown as RequestHandler);
//register device by user id 
authRoutes.post('/user-devices',  registerDevice as unknown as RequestHandler);
//notify user by user id 
authRoutes.post('/user-notify',  notifyUser as unknown as RequestHandler);

export default authRoutes;

