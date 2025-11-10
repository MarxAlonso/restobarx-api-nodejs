/**
 * @file database.js
 * @description Configuración y conexión a la base de datos PostgreSQL utilizando el módulo `pg`.
 * Gestiona un pool de conexiones y expone una función para realizar consultas SQL de forma segura.
 */

const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Pool de conexiones a la base de datos PostgreSQL.
 * La configuración utiliza la variable de entorno `DATABASE_URL`.
 * 
 * @type {Pool}
 * @property {string} connectionString - URL de conexión definida en `.env` (por ejemplo: postgres://user:password@host:port/dbname).
 * @property {Object} ssl - Configuración SSL para entornos de producción.
 * @property {boolean} ssl.rejectUnauthorized - Permite conexiones seguras en entornos con certificados autofirmados.
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } 
});

/**
 * Ejecuta una consulta SQL en la base de datos.
 * 
 * @async
 * @function query
 * @param {string} text - Sentencia SQL a ejecutar.
 * @param {Array} [params] - Parámetros opcionales para la consulta preparada.
 * @returns {Promise<Object>} Resultado de la consulta (`rows`, `rowCount`, etc.).
 * @throws {Error} Si ocurre un error durante la ejecución de la consulta.
 * 
 * @example
 * const { query } = require('./database');
 * const result = await query('SELECT * FROM users WHERE id = $1', [1]);
 * console.log(result.rows);
 */
module.exports = {
  query: (text, params) => pool.query(text, params),

  /**
   * Instancia del pool de conexiones para consultas más avanzadas.
   * 
   * @type {Pool}
   * @example
   * const { pool } = require('./database');
   * const client = await pool.connect();
   * try {
   *   const res = await client.query('SELECT NOW()');
   *   console.log(res.rows);
   * } finally {
   *   client.release();
   * }
   */
  pool
};
