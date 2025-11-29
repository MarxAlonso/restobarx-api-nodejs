const { MercadoPagoConfig, Payment } = require('mercadopago');
const PaymentModel = require('../models/paymentModel');
const OrderModel = require('../models/orderModel');

// Configurar Mercado Pago
const client = new MercadoPagoConfig({ accessToken: 'TEST-1318655515975150-112915-e97e43ea908003bd0cb7e8fb6dac4d4c-3018908368' });

const processPayment = async (req, res, next) => {
    try {
        const { transaction_amount, token, description, installments, payment_method_id, issuer_id, payer, orderId } = req.body;

        const payment = new Payment(client);

        const body = {
            transaction_amount,
            token,
            description,
            installments,
            payment_method_id,
            issuer_id,
            payer
        };

        // Crear pago en Mercado Pago
        const result = await payment.create({ body });

        if (result.status === 'approved' || result.status === 'in_process') {
            // Guardar pago en base de datos
            const paymentData = {
                mp_payment_id: result.id,
                status: result.status,
                status_detail: result.status_detail,
                transaction_amount: result.transaction_amount,
                payment_method_id: result.payment_method_id,
                payer_email: payer.email,
                order_id: orderId || null
            };

            await PaymentModel.create(paymentData);

            // Actualizar estado de la orden a PAID
            if (orderId && result.status === 'approved') {
                await OrderModel.updateStatus(orderId, 'PAID');
            }
        }

        res.status(201).json(result);
    } catch (error) {
        console.error('Error al procesar el pago:', error);
        next(error);
    }
};

const getPayments = async (req, res, next) => {
    try {
        const payments = await PaymentModel.getAll();
        res.status(200).json(payments);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    processPayment,
    getPayments
};
