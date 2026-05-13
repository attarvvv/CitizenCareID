import categoryService from '../services/categoryService.js';

const categoryController = {
  async getAll(req, res) {
    try {
      const data = await categoryService.getAll();
      return res.json({ data });
    } catch (err) {
      return res.status(500).json({ message: 'Server error.' });
    }
  },

  async create(req, res) {
    const { nama } = req.body;
    if (!nama) return res.status(400).json({ message: 'Nama kategori wajib diisi.' });
    try {
      const data = await categoryService.create(nama);
      return res.status(201).json({ message: 'Kategori ditambahkan.', data });
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'Kategori sudah ada.' });
      return res.status(500).json({ message: 'Server error.' });
    }
  },

  async update(req, res) {
    const { nama } = req.body;
    if (!nama) return res.status(400).json({ message: 'Nama kategori wajib diisi.' });
    try {
      const cat = await categoryService.findById(req.params.id);
      if (!cat) return res.status(404).json({ message: 'Kategori tidak ditemukan.' });
      await categoryService.update(req.params.id, nama);
      return res.json({ message: 'Kategori diupdate.' });
    } catch (err) {
      return res.status(500).json({ message: 'Server error.' });
    }
  },

  async delete(req, res) {
    try {
      const cat = await categoryService.findById(req.params.id);
      if (!cat) return res.status(404).json({ message: 'Kategori tidak ditemukan.' });
      await categoryService.delete(req.params.id);
      return res.json({ message: 'Kategori dihapus.' });
    } catch (err) {
      if (err.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(400).json({ message: 'Kategori masih digunakan laporan.' });
      }
      return res.status(500).json({ message: 'Server error.' });
    }
  },
};

export default categoryController;
