import { Order, OrderStatus } from '../types';

export const getStatusColor = (status: OrderStatus) => {
    switch (status) {
        case 'Pendiente de Aprobación':
            return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
        case 'Recibido':
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
        case 'En Desarrollo':
            return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
        case 'Despachado':
            return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400';
        case 'En Envío':
            return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
        case 'Entregado':
            return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
};

export const generateOrderSummary = (order: Order) => {
    const summary = `
📦 PEDIDO #${order.id.slice(-6)}
━━━━━━━━━━━━━━━━━━━━━━━━
👤 Cliente: ${order.customerInfo?.name || 'Cliente SAGFO'}
📞 Tel: ${order.customerInfo?.phone || 'Sin teléfono'}
📍 Ubicación: ${order.customerInfo?.city || 'Sin ciudad'}, ${order.customerInfo?.department || 'Sin depto'}${order.customerInfo?.country ? ` (${order.customerInfo.country})` : ''}
🏠 Dirección: ${order.customerInfo?.address || 'No especificada'}

💰 RESUMEN FINANCIERO
- Total: $${order.financials?.totalOrderValue?.toLocaleString() || '0'}
- Pagado: $${order.financials?.amountPaid?.toLocaleString() || '0'}
- Pendiente: $${order.financials?.amountPending?.toLocaleString() || '0'}
- Método: ${order.paymentMethod === 'production' ? 'Producción (50/50)' : order.paymentMethod === 'standard' ? 'Pago Total' : 'Mixto'}

🛒 PRODUCTOS
${order.items.map(item => {
        let details = `- ${item.quantity}x ${item.equipment.name}`;
        if (item.structureColor) details += `\n  • Estructura: ${item.structureColor}`;
        if (item.upholsteryColor) details += `\n  • Tapicería: ${item.upholsteryColor}`;
        if (item.selectedWeight) details += `\n  • Peso: ${item.selectedWeight}`;
        return details;
    }).join('\n')}

📝 ESTADO: ${order.status.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━━
generado por SAGFO Elite v2
    `.trim();
    return summary;
};
