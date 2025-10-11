const { sequelize } = require('../models');

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente');
    
    // Sincronizar modelos (solo en desarrollo)
    // await sequelize.sync({ alter: true }); // Descomentar si quieres que Sequelize actualice las tablas
    
    return sequelize;
  } catch (error) {
    console.error('❌ Error BD:', error.message);
    throw error;
  }
};

module.exports = { connectDB, sequelize };
