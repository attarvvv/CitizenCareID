import express       from 'express';
import logController from '../controllers/logController.js';
import verifyToken   from '../middlewares/authMiddleware.js';
import authorizeRole from '../middlewares/rolesMiddleware.js';
import upload        from '../middlewares/multerMiddleware.js';

const router = express.Router();

router.get('/',              verifyToken, logController.getAll);
router.get('/:id',           verifyToken, logController.getById);
router.post('/',             verifyToken, upload.single('gambar'), logController.create);
router.put('/:id',           verifyToken, upload.single('gambar'), logController.update);
router.patch('/:id/status',  verifyToken, authorizeRole('admin', 'super_admin'), logController.updateStatus);
router.delete('/:id',        verifyToken, logController.delete);

export default router;
