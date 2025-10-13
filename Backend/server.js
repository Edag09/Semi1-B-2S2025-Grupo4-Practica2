// server.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db.js');
const errorHandler = require('./middlewares/error');

const authRoutes = require('./routes/auth.routes.js');
const categoriesRoutes = require('./routes/categories.routes.js');
const recipesRoutes = require('./routes/recipes.routes.js');
const favoritesRoutes = require('./routes/favorites.routes.js');
const commentsRoutes = require('./routes/comments.routes.js');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 80;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Conexión BD con Sequelize
connectDB()
  .then(() => console.log('✅ MySQL conectado con Sequelize'))
  .catch(err => {
    console.error('❌ Error BD:', err.message);
    process.exit(1);
  });

// Health-check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'recipebox-backend', ts: new Date().toISOString() });
});

// Rutas
app.use('/auth', authRoutes);
app.use('/categorias', categoriesRoutes);
app.use('/recetas', recipesRoutes);
app.use('/favoritos', favoritesRoutes);
app.use('/comentarios', commentsRoutes);
// app.use('/users', usersRoutes);

// Middleware de manejo de errores (debe estar después de las rutas)
app.use(errorHandler);

// 404
app.use((_, res) => res.status(404).json({ error: 'Recurso no encontrado' }));


// Arranque
app.listen(PORT,"0.0.0.0", () => {
  console.log(`🚀 Backend listo en ${PORT}`);
});
