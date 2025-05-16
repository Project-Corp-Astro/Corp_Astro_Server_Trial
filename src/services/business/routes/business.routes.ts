import express from 'express';
import { createBusinessProfile, deleteBusinessProfile, getAllBusinessProfiles, getAllBusinessProfilesAndPartnersByUser, getBusinessProfileById, updateBusinessProfile } from '../controllers/businessProfile.controller';

const businessProfileRouter = express.Router();

//create business profile by user id 
businessProfileRouter.post('/', createBusinessProfile as express.RequestHandler    ); // Create
//get business profile by business id   
businessProfileRouter.get('/:id/:user_id', getBusinessProfileById as express.RequestHandler); // Read
//update business profile by business id 
businessProfileRouter.put('/:business_id/:user_id', updateBusinessProfile as express.RequestHandler); // Update
//delete business profile by business id 
businessProfileRouter.delete('/:id/:user_id', deleteBusinessProfile as express.RequestHandler); // Delete
//get all business by user id   
businessProfileRouter.get('/user/:user_id/businesses', getAllBusinessProfiles as express.RequestHandler);
//get all business profiles and partners by user id 
businessProfileRouter.get('/business-partner/:user_id/:business_id', getAllBusinessProfilesAndPartnersByUser as express.RequestHandler); // Get all for a user

export default businessProfileRouter;
