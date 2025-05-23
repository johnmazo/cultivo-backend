import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productoRoutes from './routes/producto.routes.js';
import authRoutes from './routes/auth.routes.js';
import pedidoRoutes from './routes/pedido.routes.js';
import adminRoutes from './routes/admin.routes.js';


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/productos', productoRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
