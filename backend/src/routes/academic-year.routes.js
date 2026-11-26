import { Router } from 'express';
import { getPool } from '../config/database.js';
import { createAcademicYearController } from '../controllers/academic-year.controller.js';
import { AcademicYearRepository } from '../repositories/academic-year.repository.js';
import { AcademicYearService } from '../services/academic-year.service.js';

const repository = new AcademicYearRepository(getPool);
const service = new AcademicYearService(repository);
const controller = createAcademicYearController(service);
const router = Router();

router.get('/academic-years', controller.list);
router.post('/academic-years', controller.create);
router.put('/academic-years/:id', controller.update);
router.delete('/academic-years/:id', controller.remove);

export default router;
