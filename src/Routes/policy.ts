import { Router } from "express";
import { policyController } from "../controllers";
import { adminJWT } from "../helper";

const router = Router();

router.post("/add",adminJWT, policyController.add_policy);
router.put("/edit",adminJWT, policyController.add_policy);
router.get("/all", policyController.get_policy_by_type);

export const policyRouter = router;
