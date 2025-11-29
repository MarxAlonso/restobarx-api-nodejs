-- Crear tabla de pagos
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  mp_payment_id VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,
  status_detail VARCHAR(100),
  transaction_amount DECIMAL(10, 2) NOT NULL,
  payment_method_id VARCHAR(50),
  payer_email VARCHAR(255),
  order_id INTEGER REFERENCES orders(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear índice para búsquedas rápidas
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_mp_payment_id ON payments(mp_payment_id);
