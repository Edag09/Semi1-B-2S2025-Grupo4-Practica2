const { Usuario } = require('../models');
const { hashPassword, comparePassword } = require('../utils/passwords');
const { generateToken } = require('../utils/jwt');

/**
 * Registrar un nuevo usuario
 */
const register = async (userData) => {
  try {
    const { username, email, password, foto_url } = userData;

    // Validar que los campos requeridos estén presentes
    if (!username || !email || !password) {
      throw new Error('Username, email y password son requeridos');
    }

    // Verificar si el usuario ya existe
    const existingUser = await Usuario.findOne({
      where: { email }
    });

    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    // Verificar si el username ya existe
    const existingUsername = await Usuario.findOne({
      where: { username }
    });

    if (existingUsername) {
      throw new Error('El username ya está en uso');
    }

    // Hashear la contraseña
    const password_hash = await hashPassword(password);

    // Crear el usuario
    const newUser = await Usuario.create({
      username,
      email,
      password_hash,
      foto_url: foto_url || null
    });

    // Generar token
    const token = generateToken({
      id_usuario: newUser.id_usuario,
      username: newUser.username,
      email: newUser.email
    });

    // Retornar usuario sin contraseña y con token
    return {
      usuario: {
        id_usuario: newUser.id_usuario,
        username: newUser.username,
        email: newUser.email,
        foto_url: newUser.foto_url,
        creado_en: newUser.creado_en
      },
      token
    };
  } catch (error) {
    // Manejar errores de validación de Sequelize
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(e => e.message);
      throw new Error(messages.join(', '));
    }
    throw error;
  }
};

/**
 * Iniciar sesión
 */
const login = async (credentials) => {
  try {
    const { email, password } = credentials;

    // Validar campos requeridos
    if (!email || !password) {
      throw new Error('Email y password son requeridos');
    }

    // Buscar usuario con contraseña incluida
    const user = await Usuario.scope('withPassword').findOne({
      where: { email }
    });

    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    // Verificar contraseña
    const isPasswordValid = await comparePassword(password, user.password_hash);

    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas');
    }

    // Generar token
    const token = generateToken({
      id_usuario: user.id_usuario,
      username: user.username,
      email: user.email
    });

    // Retornar usuario sin contraseña y con token
    return {
      usuario: {
        id_usuario: user.id_usuario,
        username: user.username,
        email: user.email,
        foto_url: user.foto_url,
        creado_en: user.creado_en
      },
      token
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Obtener perfil de usuario por ID
 */
const getProfile = async (userId) => {
  try {
    const user = await Usuario.findByPk(userId);

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return {
      id_usuario: user.id_usuario,
      username: user.username,
      email: user.email,
      foto_url: user.foto_url,
      creado_en: user.creado_en
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Actualizar perfil de usuario
 */
const updateProfile = async (userId, updateData) => {
  try {
    const user = await Usuario.findByPk(userId);

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Solo permitir actualizar ciertos campos
    const allowedFields = ['username', 'email', 'foto_url'];
    const filteredData = {};

    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    }

    // Si se está actualizando el username, verificar que no exista
    if (filteredData.username && filteredData.username !== user.username) {
      const existingUsername = await Usuario.findOne({
        where: { username: filteredData.username }
      });
      if (existingUsername) {
        throw new Error('El username ya está en uso');
      }
    }

    // Si se está actualizando el email, verificar que no exista
    if (filteredData.email && filteredData.email !== user.email) {
      const existingEmail = await Usuario.findOne({
        where: { email: filteredData.email }
      });
      if (existingEmail) {
        throw new Error('El email ya está registrado');
      }
    }

    await user.update(filteredData);

    return {
      id_usuario: user.id_usuario,
      username: user.username,
      email: user.email,
      foto_url: user.foto_url,
      creado_en: user.creado_en
    };
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(e => e.message);
      throw new Error(messages.join(', '));
    }
    throw error;
  }
};

/**
 * Cambiar contraseña
 */
const changePassword = async (userId, passwords) => {
  try {
    const { currentPassword, newPassword } = passwords;

    if (!currentPassword || !newPassword) {
      throw new Error('Contraseña actual y nueva contraseña son requeridas');
    }

    if (newPassword.length < 6) {
      throw new Error('La nueva contraseña debe tener al menos 6 caracteres');
    }

    // Buscar usuario con contraseña
    const user = await Usuario.scope('withPassword').findByPk(userId);

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Verificar contraseña actual
    const isPasswordValid = await comparePassword(currentPassword, user.password_hash);

    if (!isPasswordValid) {
      throw new Error('La contraseña actual es incorrecta');
    }

    // Hashear nueva contraseña
    const password_hash = await hashPassword(newPassword);

    // Actualizar contraseña
    await user.update({ password_hash });

    return { message: 'Contraseña actualizada exitosamente' };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword
};
