import jwt from 'jsonwebtoken';
 
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"
 
  if (!token) {
    return res.status(401).json({ message: 'Token tidak ditemukan. Silakan login.' });
  }
 
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, nama, email, role }
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token tidak valid atau kadaluarsa.' });
  }
};
 
export default verifyToken;