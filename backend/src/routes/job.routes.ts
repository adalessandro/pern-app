import express from 'express'
import { get, find, create, update, remove } from '../controllers/job.controller'
import { hasWriteRole } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/:id', get);

router.get('/', find);

router.post('/', hasWriteRole, create);

router.put('/:id', hasWriteRole, update);

router.delete('/:id', hasWriteRole, remove);

export default router;