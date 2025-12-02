// Servicio de notificaciones en tiempo real

const notificationService = {
    // Enviar notificación de nueva orden a los administradores
    sendNewOrderNotification: (orderData) => {
        try {
            const io = global.io;

            if (!io) {
                console.warn('⚠️ Socket.IO no está disponible');
                return;
            }

            const notification = {
                id: `order-${orderData.id}-${Date.now()}`,
                type: 'NEW_ORDER',
                orderId: orderData.id,
                userName: orderData.userName || 'Cliente',
                userEmail: orderData.userEmail || '',
                totalPrice: orderData.totalPrice,
                itemCount: orderData.items?.length || 0,
                timestamp: new Date().toISOString(),
                read: false
            };

            // Emitir a todos los administradores conectados
            io.to('admins').emit('new-order', notification);

            console.log('📢 Notificación enviada a admins:', notification);

            return notification;
        } catch (error) {
            console.error('❌ Error al enviar notificación:', error);
        }
    },

    // Enviar actualización de estado de orden
    sendOrderStatusUpdate: (orderId, newStatus) => {
        try {
            const io = global.io;

            if (!io) {
                console.warn('⚠️ Socket.IO no está disponible');
                return;
            }

            const update = {
                orderId,
                status: newStatus,
                timestamp: new Date().toISOString()
            };

            io.to('admins').emit('order-status-update', update);

            console.log('📢 Actualización de estado enviada:', update);

            return update;
        } catch (error) {
            console.error('❌ Error al enviar actualización:', error);
        }
    }
};

module.exports = notificationService;
