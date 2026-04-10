import express from 'express';
import { saleBannerController } from '../controllers';
import { userJWT } from '../helper';

const router = express.Router();

// Admin Route (Upsert)
router.post('/update', userJWT, saleBannerController.update_sale_banner);

// Website/Admin Route (Fetch the single banner)
router.get('/', saleBannerController.get_sale_banner);

export const saleBannerRouter = router;
