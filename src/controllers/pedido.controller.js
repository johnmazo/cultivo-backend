// controllers/pedido.controller.js (nuevo archivo)
import db from '../config/db.js';
import { enviarMensajeWhatsApp } from '../utils/twilio.js';

export async function crearPedido(req, res) {
  const { cliente_id, productos, total } = req.body;

  try {
    const [clienteData] = await db.query('SELECT * FROM cliente WHERE id = ?', [cliente_id]);
    if (clienteData.length === 0) return res.status(404).json({ error: 'Cliente no encontrado' });

    // 💾 Guardar pedido (puedes extender con insert de pedido_detalle)
    const [result] = await db.query('INSERT INTO pedidos (cliente_id, total) VALUES (?, ?)', [cliente_id, total]);
    
    // 🟩 Preparar mensaje
    const mensaje = `¡Hola ${clienteData[0].nombre}! 🛒 Muchas gracias por tu compra en Cultivo.\n\nProductos:\n${productos.map(p => `• ${p.cantidad} x ${p.nombre} ($${p.precio})`).join('\n')}\n\nTotal: $${total}`;

    // 🟨 Enviar mensaje
    await enviarMensajeWhatsApp(clienteData[0].whatsapp, mensaje);

    res.status(201).json({ message: 'Pedido creado y mensaje enviado' });
  } catch (error) {
    console.error('Error al crear pedido:', error);
    res.status(500).json({ error: 'Error al crear pedido' });
  }
}
