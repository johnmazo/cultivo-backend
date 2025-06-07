import express from 'express';
import db from '../config/db.js';
import { crearPedido } from '../controllers/pedido.controller.js';

const router = express.Router();

router.post('/', crearPedido);
router.post('/', async (req, res) => {
  const { cliente_id, productos, total } = req.body;

  try {
    const [result] = await db.query(
      'INSERT INTO pedidos (cliente_id, fecha_pedido, total) VALUES (?, NOW(), ?)',
      [cliente_id, total]
    );

    const pedidoId = result.insertId;

    for (const producto of productos) {
      await db.query(
        'INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
        [pedidoId, producto.id, producto.cantidad, producto.precio]
      );
    }

    res.status(201).json({ message: 'Pedido creado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el pedido' });
  }
});

export default router;
