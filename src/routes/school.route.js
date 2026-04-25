import { Router } from "express";
import schoolController from "../controllers/school.controller.js";
import validateDto from "../shared/middlewares/dtoValidation.middleware.js";
import { createSchoolDto, updateSchoolDto } from "../dtos/school.dto.js";
const router = Router();
const BaseUrl = "/schools"


router.get(BaseUrl, schoolController.getSchools);
router.get(`${BaseUrl}/:id`, schoolController.getSchool);
router.post(BaseUrl, validateDto(createSchoolDto), schoolController.createSchool);
router.put(`${BaseUrl}/:id`, validateDto(updateSchoolDto), schoolController.updateSchool);
router.delete(`${BaseUrl}/:id`, schoolController.deleteSchool)

export default router;