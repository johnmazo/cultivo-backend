import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import db from '../config/db.js';

export async function login(req, res) {
  const { whatsapp, contrasena } = req.body;

  try {
    const [users] = await db.query('SELECT * FROM cliente WHERE whatsapp = ?', [whatsapp]);
    if (users.length === 0) return res.status(401).json({ error: 'Credenciales inválidas' });

    const user = users[0];
    const validPassword = await bcrypt.compare(contrasena, user.contrasena);
    if (!validPassword) return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.json({ token, user: { id: user.id, nombre: user.nombre, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
}

export async function registro(req, res) {
  const { nombre, whatsapp, torre, apartamento, unidad_residencial, contrasena } = req.body;

  console.log('Body recibido:', req.body); // 🕵️ Ver qué llega

  try {
    const [exists] = await db.query('SELECT * FROM cliente WHERE whatsapp = ?', [whatsapp]);
    if (exists.length > 0) return res.status(400).json({ error: 'El número ya está registrado' });

    const hashed = await bcrypt.hash(contrasena, 10);

    const [result] = await db.query(
      'INSERT INTO cliente (nombre, whatsapp, torre, apartamento, unidad_residencial, contrasena, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nombre, whatsapp, torre, apartamento, unidad_residencial, hashed, 'usuario']
    );

    res.status(201).json({ message: 'Usuario registrado', id: result.insertId });
  } 
  catch (error) {
    console.error('Error en registro:', error); // 💥 Log de error visible en Railway
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
}
