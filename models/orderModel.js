const db = require('../config/db');

const orderModel = {
  // Crear una nueva orden
  async create(orderData) {
    const { userId, items, totalPrice } = orderData;

    const client = await db.pool.connect(); // ✅ obtener cliente del pool

    try {
      await client.query('BEGIN'); // ✅ iniciar transacción correctamente

      // Crear la orden
      const orderQuery = `
        INSERT INTO orders (user_id, total_price, status)
        VALUES ($1, $2, 'PENDING')
        RETURNING id, user_id, total_price, status, created_at, updated_at
      `;
      const orderResult = await client.query(orderQuery, [userId, totalPrice]);
      const order = orderResult.rows[0];

      // Insertar los ítems de la orden
      for (const item of items) {
        const orderItemQuery = `
          INSERT INTO order_items (order_id, menu_id, quantity)
          VALUES ($1, $2, $3)
        `;
        await client.query(orderItemQuery, [order.id, item.menuId, item.quantity]);
      }

      await client.query('COMMIT'); // ✅ confirmar transacción
      return { orderId: order.id };

    } catch (error) {
      await client.query('ROLLBACK'); // ✅ revertir si algo falla
      throw error;

    } finally {
      client.release(); // ✅ liberar conexión siempre
    }
  },

  // Obtener órdenes de un usuario
  async getByUserId(userId) {
    const ordersQuery = `
      SELECT o.id, o.user_id, o.total_price, o.status, o.created_at, o.updated_at
      FROM orders o
      WHERE o.user_id = $1
      ORDER BY o.created_at DESC
    `;

    const ordersResult = await db.query(ordersQuery, [userId]);
    const orders = ordersResult.rows;

    // Obtener los ítems de cada orden
    for (const order of orders) {
      const itemsQuery = `
        SELECT oi.menu_id, oi.quantity, m.title, m.price
        FROM order_items oi
        JOIN menu_items m ON oi.menu_id = m.id
        WHERE oi.order_id = $1
      `;

      const itemsResult = await db.query(itemsQuery, [order.id]);
      order.items = itemsResult.rows;
    }

    return orders;
  },

  // Obtener todas las órdenes (para admin)
  async getAll() {
    const ordersQuery = `
      SELECT o.id, o.user_id, o.total_price, o.status, o.created_at, o.updated_at,
             u.name as user_name, u.email as user_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `;

    const ordersResult = await db.query(ordersQuery);
    const orders = ordersResult.rows;

    // Obtener los ítems de cada orden
    for (const order of orders) {
      const itemsQuery = `
        SELECT oi.menu_id, oi.quantity, m.title, m.price
        FROM order_items oi
        JOIN menu_items m ON oi.menu_id = m.id
        WHERE oi.order_id = $1
      `;

      const itemsResult = await db.query(itemsQuery, [order.id]);
      order.items = itemsResult.rows;
    }

    return orders;
  },

  // Actualizar estado de una orden
  async updateStatus(orderId, status) {
    const query = `
      UPDATE orders
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id, user_id, total_price, status, created_at, updated_at
    `;

    const result = await db.query(query, [status, orderId]);
    return result.rows[0];
  },

  // Obtener órdenes recientes (para polling de notificaciones)
  async getRecentOrders(minutes = 5) {
    const ordersQuery = `
      SELECT o.id, o.user_id, o.total_price, o.status, o.created_at, o.updated_at,
             u.name as user_name, u.email as user_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.created_at >= NOW() - INTERVAL '${minutes} minutes'
      ORDER BY o.created_at DESC
    `;

    const ordersResult = await db.query(ordersQuery);
    const orders = ordersResult.rows;

    // Obtener los ítems de cada orden
    for (const order of orders) {
      const itemsQuery = `
        SELECT oi.menu_id, oi.quantity, m.title, m.price
        FROM order_items oi
        JOIN menu_items m ON oi.menu_id = m.id
        WHERE oi.order_id = $1
      `;

      const itemsResult = await db.query(itemsQuery, [order.id]);
      order.items = itemsResult.rows;
    }

    return orders;
  }
};

module.exports = orderModel;