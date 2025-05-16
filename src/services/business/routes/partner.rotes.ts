import express from 'express';
import { createPartner, deletePartner, getAllPartners, getAllPartnersByBusinessId, getPartner, updatePartner } from '../controllers/partner.controller';

const partnerRouter = express.Router();
//create partner by user id     
partnerRouter.post('/business-partner', createPartner as unknown as express.RequestHandler);
//get all partners by user id       
partnerRouter.get('/business-partner/:user_id', getAllPartners as unknown as express.RequestHandler);
//get partner by partner id     
partnerRouter.get('/business-partner/:partner_id/:user_id', getPartner as unknown as express.RequestHandler);
//update partner by partner id      
partnerRouter.put('/business-partner/:partner_id/:user_id', updatePartner as unknown as express.RequestHandler);
//delete partner by partner id  
partnerRouter.delete('/business-partner/:partner_id/:user_id', deletePartner as unknown as express.RequestHandler);
//get all partners by business id   and user id 
partnerRouter.get('/business-partner/business/:business_id/:user_id', getAllPartnersByBusinessId as unknown as express.RequestHandler);
export default partnerRouter;
