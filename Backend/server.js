// server.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { getPool } = require('./config/db.js');

// const authRoutes = require('./routes/auth.routes.js');
// const usersRoutes = require('./routes/users.routes.js');
// const recipesRoutes = require('./routes/recipes.routes.js');
// const categoriesRoutes = require('./routes/categories.routes.js');
// const favoritesRoutes = require('./routes/favorites.routes.js');
// opcional
// const commentsRoutes = require('./routes/comments.routes.js');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Conexión BD (ping)
getPool()
  .then(pool => pool.query('SELECT 1'))
  .then(() => console.log('✅ MySQL conectado'))
  .catch(err => {
    console.error('❌ Error BD:', err.message);
    process.exit(1);
  });

// Health-check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'recipebox-backend', ts: new Date().toISOString() });
});

// Rutas
// app.use('/auth', authRoutes);
// app.use('/users', usersRoutes);
// app.use('/recetas', recipesRoutes);
// app.use('/categorias', categoriesRoutes);
// app.use('/favoritos', favoritesRoutes);
// app.use('/comentarios', commentsRoutes); // opcional

// 404
app.use((_, res) => res.status(404).json({ error: 'Recurso no encontrado' }));

// Arranque
app.listen(PORT, () => {
  console.log(`🚀 Backend listo en http://localhost:${PORT}`);
});
