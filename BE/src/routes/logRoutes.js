import express       from 'express';
import logController from '../controllers/logController';
import verifyToken   from '../middleware/authMiddleware';
import authorizeRole from '../middleware/rolesMiddleware';
import upload        from '../middleware/multerMiddleware';

const router = express.Router();

router.get('/',              verifyToken, logController.getAll);
router.get('/:id',           verifyToken, logController.getById);
router.post('/',             verifyToken, upload.single('gambar'), logController.create);
router.put('/:id',           verifyToken, upload.single('gambar'), logController.update);
router.patch('/:id/status',  verifyToken, authorizeRole('admin', 'super_admin'), logController.updateStatus);
router.delete('/:id',        verifyToken, logController.delete);

export default router;
