/**
 * Script de prueba para verificar el sistema de autenticación
 * Ejecutar con: node test-auth.js
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:8080';

// Colores para consola
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`)
};

// Usuario de prueba
const testUser = {
  username: `testuser_${Date.now()}`,
  email: `test_${Date.now()}@example.com`,
  password: 'password123',
  foto_url: 'https://i.pravatar.cc/150?img=1'
};

let token = null;
let userId = null;

async function testRegister() {
  log.info('🧪 Probando registro de usuario...');
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, testUser);
    
    if (response.data.success && response.data.data.token) {
      token = response.data.data.token;
      userId = response.data.data.usuario.id_usuario;
      log.success('Usuario registrado correctamente');
      log.info(`   Token: ${token.substring(0, 30)}...`);
      log.info(`   User ID: ${userId}`);
      return true;
    }
    return false;
  } catch (error) {
    log.error(`Error en registro: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function testLogin() {
  log.info('🧪 Probando inicio de sesión...');
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    
    if (response.data.success && response.data.data.token) {
      token = response.data.data.token;
      log.success('Inicio de sesión exitoso');
      return true;
    }
    return false;
  } catch (error) {
    log.error(`Error en login: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function testLoginInvalid() {
  log.info('🧪 Probando login con credenciales inválidas...');
  try {
    await axios.post(`${BASE_URL}/auth/login`, {
      email: testUser.email,
      password: 'wrongpassword'
    });
    log.error('No se detectó error con credenciales inválidas');
    return false;
  } catch (error) {
    if (error.response?.status === 400) {
      log.success('Credenciales inválidas rechazadas correctamente');
      return true;
    }
    log.error(`Error inesperado: ${error.message}`);
    return false;
  }
}

async function testGetProfile() {
  log.info('🧪 Probando obtener perfil...');
  try {
    const response = await axios.get(`${BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success && response.data.data.username === testUser.username) {
      log.success('Perfil obtenido correctamente');
      log.info(`   Username: ${response.data.data.username}`);
      return true;
    }
    return false;
  } catch (error) {
    log.error(`Error al obtener perfil: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function testUpdateProfile() {
  log.info('🧪 Probando actualizar perfil...');
  try {
    const newUsername = `updated_${Date.now()}`;
    const response = await axios.put(
      `${BASE_URL}/auth/profile`,
      { username: newUsername },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    if (response.data.success && response.data.data.username === newUsername) {
      log.success('Perfil actualizado correctamente');
      log.info(`   Nuevo username: ${newUsername}`);
      return true;
    }
    return false;
  } catch (error) {
    log.error(`Error al actualizar perfil: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function testChangePassword() {
  log.info('🧪 Probando cambio de contraseña...');
  try {
    const response = await axios.put(
      `${BASE_URL}/auth/change-password`,
      {
        currentPassword: testUser.password,
        newPassword: 'newpassword123'
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    if (response.data.success) {
      log.success('Contraseña cambiada correctamente');
      testUser.password = 'newpassword123';
      return true;
    }
    return false;
  } catch (error) {
    log.error(`Error al cambiar contraseña: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function testUnauthorizedAccess() {
  log.info('🧪 Probando acceso sin token...');
  try {
    await axios.get(`${BASE_URL}/auth/profile`);
    log.error('Se permitió acceso sin token');
    return false;
  } catch (error) {
    if (error.response?.status === 401) {
      log.success('Acceso sin token rechazado correctamente');
      return true;
    }
    log.error(`Error inesperado: ${error.message}`);
    return false;
  }
}

async function testInvalidToken() {
  log.info('🧪 Probando acceso con token inválido...');
  try {
    await axios.get(`${BASE_URL}/auth/profile`, {
      headers: { Authorization: 'Bearer invalid_token_here' }
    });
    log.error('Se permitió acceso con token inválido');
    return false;
  } catch (error) {
    if (error.response?.status === 401) {
      log.success('Token inválido rechazado correctamente');
      return true;
    }
    log.error(`Error inesperado: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 Iniciando pruebas del sistema de autenticación');
  console.log('='.repeat(60) + '\n');

  const tests = [
    { name: 'Registro', fn: testRegister },
    { name: 'Login', fn: testLogin },
    { name: 'Login Inválido', fn: testLoginInvalid },
    { name: 'Obtener Perfil', fn: testGetProfile },
    { name: 'Actualizar Perfil', fn: testUpdateProfile },
    { name: 'Cambiar Contraseña', fn: testChangePassword },
    { name: 'Acceso Sin Token', fn: testUnauthorizedAccess },
    { name: 'Token Inválido', fn: testInvalidToken }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    console.log('');
    const result = await test.fn();
    if (result) {
      passed++;
    } else {
      failed++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Resultados de las pruebas');
  console.log('='.repeat(60));
  log.success(`Pruebas exitosas: ${passed}`);
  if (failed > 0) {
    log.error(`Pruebas fallidas: ${failed}`);
  }
  console.log('='.repeat(60) + '\n');

  if (failed === 0) {
    log.success('🎉 ¡Todas las pruebas pasaron correctamente!');
  } else {
    log.warn('⚠️  Algunas pruebas fallaron. Revisar los errores arriba.');
  }
}

// Verificar si el servidor está corriendo
async function checkServer() {
  try {
    await axios.get(`${BASE_URL}/health`);
    return true;
  } catch (error) {
    log.error('El servidor no está corriendo en ' + BASE_URL);
    log.info('Ejecuta: npm run dev');
    return false;
  }
}

// Ejecutar pruebas
(async () => {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await runTests();
  }
  process.exit(0);
})();
