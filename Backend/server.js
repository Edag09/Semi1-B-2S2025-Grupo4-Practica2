// server.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const fs = require('fs');
const https = require('https');
const path = require('path');
const { connectDB } = require('./config/db.js');
const errorHandler = require('./middlewares/error');

const authRoutes = require('./routes/auth.routes.js');
const categoriesRoutes = require('./routes/categories.routes.js');
const recipesRoutes = require('./routes/recipes.routes.js');
const favoritesRoutes = require('./routes/favorites.routes.js');
const commentsRoutes = require('./routes/comments.routes.js');
const uploadRoutes = require('./routes/upload.routes.js');

dotenv.config();
const app = express();
const PORT = process.env.PORT;

// ===== Middlewares =====
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// ===== Conexión BD con Sequelize =====
connectDB()
  .then(() => console.log('✅ MySQL conectado con Sequelize'))
  .catch(err => {
    console.error('❌ Error BD:', err.message);
    process.exit(1);
  });

// ===== Health-check =====
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'recipebox-backend',
    ts: new Date().toISOString(),
  });
});

// ===== Rutas =====
app.use('/auth', authRoutes);
app.use('/categorias', categoriesRoutes);
app.use('/recetas', recipesRoutes);
app.use('/favoritos', favoritesRoutes);
app.use('/comentarios', commentsRoutes);
app.use('/upload', uploadRoutes);

// ===== Middleware de manejo de errores =====
app.use(errorHandler);

// ===== 404 =====
app.use((_, res) => res.status(404).json({ error: 'Recurso no encontrado' }));

// ===== Crear servidor HTTPS =====
const sslPath = path.join(__dirname, 'ssl');
const options = {
  key: fs.readFileSync(path.join(sslPath, 'key.pem')),
  cert: fs.readFileSync(path.join(sslPath, 'cert.pem')),
};

https.createServer(options, app).listen(8080, '0.0.0.0', () => {
  console.log('✅ Servidor HTTPS corriendo en puerto 8080');
});
