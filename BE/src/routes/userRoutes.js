import express        from 'express';
import userController from '../controllers/userController.js';
import verifyToken    from '../middlewares/authMiddleware.js';
import authorizeRole  from '../middlewares/rolesMiddleware.js';

const router = express.Router();

// Semua route user → harus login + super_admin
router.use(verifyToken, authorizeRole('super_admin'));

router.get('/',     userController.getAll);
router.get('/:id',  userController.getById);
router.post('/',    userController.create);
router.put('/:id',  userController.update);
router.delete('/:id', userController.delete);

export default router;
