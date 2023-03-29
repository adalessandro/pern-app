import express from 'express'
import { find, get, login, update, create, remove, updatePassword } from '../controllers/user.controller'
import { isRoot } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/:id', isRoot, get);

router.get('/', isRoot,find);

router.post('/', isRoot,create)

router.put('/:id', isRoot,update)

router.patch('/:id', updatePassword)

router.delete('/:id', isRoot,remove)

router.post('/login', login);


export default router;