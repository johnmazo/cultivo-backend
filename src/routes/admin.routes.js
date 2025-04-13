import express from 'express';
import db from '../config/db.js';

const router = express.Router();

router.get('/historial-clientes', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        c.id AS cliente_id,
        c.nombre,
        c.whatsapp,
        p.id_pedido,
        p.fecha_pedido,
        dp.cantidad,
        dp.precio_unitario,
        pr.nombre AS producto
      FROM pedidos p
      JOIN cliente c ON c.id = p.cliente_id
      JOIN detalle_pedido dp ON dp.id_pedido = p.id_pedido
      JOIN producto pr ON pr.id = dp.id_producto
      ORDER BY c.id, p.fecha_pedido DESC;
    `);
    
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener historial', err);
    res.status(500).json({ error: 'Error al obtener el historial de clientes' });
  }
});

// Ruta: GET /api/admin/estadisticas
router.get('/estadisticas', async (req, res) => {
  try {
    // Total de clientes
    const [clientes] = await db.query('SELECT COUNT(*) AS total_clientes FROM cliente');

    // Total de pedidos
    const [pedidos] = await db.query('SELECT COUNT(*) AS total_pedidos, SUM(total) AS total_facturado FROM pedidos');

    // Productos vendidos (sumar cantidades por producto)
    const [productosVendidos] = await db.query(`
      SELECT p.nombre, SUM(dp.cantidad) AS total_vendidos, SUM(dp.cantidad * dp.precio_unitario) AS total_recaudado
      FROM detalle_pedido dp
      JOIN producto p ON dp.id_producto = p.id
      GROUP BY p.nombre
    `);

    res.json({
      total_clientes: clientes[0].total_clientes,
      total_pedidos: pedidos[0].total_pedidos,
      total_facturado: pedidos[0].total_facturado || 0,
      productos: productosVendidos
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas admin:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
