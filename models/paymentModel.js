const db = require('../config/db');

const PaymentModel = {
    // Crear un nuevo registro de pago
    create: async (paymentData) => {
        const {
            mp_payment_id,
            status,
            status_detail,
            transaction_amount,
            payment_method_id,
            payer_email,
            order_id
        } = paymentData;

        const query = `
      INSERT INTO payments (
        mp_payment_id, 
        status, 
        status_detail, 
        transaction_amount, 
        payment_method_id, 
        payer_email, 
        order_id,
        created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *
    `;

        const values = [
            mp_payment_id,
            status,
            status_detail,
            transaction_amount,
            payment_method_id,
            payer_email,
            order_id
        ];

        const result = await db.query(query, values);
        return result.rows[0];
    },

    // Obtener todos los pagos (para admin)
    getAll: async () => {
        const query = `
      SELECT p.*, u.name as user_name, u.email as user_email 
      FROM payments p
      LEFT JOIN orders o ON p.order_id = o.id
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY p.created_at DESC
    `;

        const result = await db.query(query);
        return result.rows;
    },

    // Obtener pago por ID
    getById: async (id) => {
        const query = 'SELECT * FROM payments WHERE id = $1';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }
};

module.exports = PaymentModel;
