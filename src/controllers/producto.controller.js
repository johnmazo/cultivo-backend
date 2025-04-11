import db from '../config/db.js';

export const getProductos = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM producto');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
};


export const getProductoById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM producto WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar el producto' });
  }
};


export const createProducto = async (req, res) => {
  try {
    const { nombre, precio, categoria, url_imagen } = req.body;

    if (!nombre || !precio || !categoria || !url_imagen) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const [result] = await db.query(
      'INSERT INTO producto (nombre, precio, categoria, url_imagen) VALUES (?, ?, ?, ?)',
      [nombre, precio, categoria, url_imagen]
    );

    res.status(201).json({ id: result.insertId, nombre, precio, categoria, url_imagen });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el producto' });
  }
};


export const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, precio, categoria, url_imagen } = req.body;

    await db.query(
      'UPDATE producto SET nombre = ?, precio = ?, categoria = ?, url_imagen = ? WHERE id = ?',
      [nombre, precio, categoria, url_imagen, id]
    );

    res.json({ message: 'Producto actualizado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
};

export const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM producto WHERE id = ?', [id]);
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
};
