const db = require('../config/db');
const bcrypt = require('bcrypt');

const userModel = {
  // Crear un nuevo usuario
  async create(userData) {
    const { name, email, password, role = 'CLIENT', phone = null } = userData;
    
    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const query = `
      INSERT INTO users (name, email, password, role, phone, is_active)
      VALUES ($1, $2, $3, $4, $5, true)
      RETURNING id, name, email, role, phone, is_active, created_at, updated_at
    `;
    
    const result = await db.query(query, [name, email, hashedPassword, role, phone]);
    return result.rows[0];
  },
  
  // Buscar usuario por email
  async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await db.query(query, [email]);
    return result.rows[0];
  },
  
  // Buscar usuario por ID
  async findById(id) {
    const query = 'SELECT id, name, email, role, phone, is_active, created_at, updated_at FROM users WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  },
  
  // Actualizar usuario
  async update(id, userData) {
    const { name, email, phone, isActive } = userData;
    
    const query = `
      UPDATE users
      SET name = COALESCE($1, name),
          email = COALESCE($2, email),
          phone = COALESCE($3, phone),
          is_active = COALESCE($4, is_active),
          updated_at = NOW()
      WHERE id = $5
      RETURNING id, name, email, role, phone, is_active, created_at, updated_at
    `;
    
    const result = await db.query(query, [name, email, phone, isActive, id]);
    return result.rows[0];
  },
  
  // Obtener todos los clientes
  async getClients() {
    const query = `
      SELECT id, name, email, phone, is_active, created_at, updated_at
      FROM users
      WHERE role = 'CLIENT'
      ORDER BY created_at DESC
    `;
    
    const result = await db.query(query);
    return result.rows;
  },
  
  // Eliminar usuario
  async delete(id) {
    const query = 'DELETE FROM users WHERE id = $1';
    await db.query(query, [id]);
    return true;
  },

  // Update para clientes (sin tocar email ni rol)
async updateClientProfile(id, userData) {
  const { name, phone } = userData;

  const query = `
    UPDATE users
    SET name = COALESCE($1, name),
        phone = COALESCE($2, phone),
        updated_at = NOW()
    WHERE id = $3 AND role = 'CLIENT'
    RETURNING id, name, email, role, phone, is_active, created_at, updated_at
  `;
  
  const result = await db.query(query, [name, phone, id]);
  return result.rows[0];
}

};

module.exports = userModel;