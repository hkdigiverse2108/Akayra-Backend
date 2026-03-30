import { Router } from "express";
import { policyController } from "../controllers";

const router = Router();

router.post("/add", policyController.add_policy);
router.put("/edit", policyController.add_policy);
router.get("/all", policyController.get_policy_by_type);

export const policyRouter = router;
