import express from 'express';
import db from '../config/db.js';

const router = express.Router();

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
