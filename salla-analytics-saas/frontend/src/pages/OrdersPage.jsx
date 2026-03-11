import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2, AlertTriangle, Search } from 'lucide-react';

function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:5000/api/orders');
                setOrders(response.data.data);
            } catch (err) {
                setError("فشل في جلب طلبات المتجر");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'مكتمل': return 'badge-success';
            case 'قيد التنفيذ': return 'badge-pending';
            case 'ملغي':
            case 'مسترجع': return 'badge-danger';
            default: return 'badge-neutral';
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '400px' }}>
                <Loader2 className="primary-text spin" size={48} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', marginTop: '2rem' }}>
               <AlertTriangle color="red" size={48} style={{ marginBottom: '1rem' }} />
               <h2 style={{ color: '#fca5a5' }}>{error}</h2>
            </div>
        );
    }

    return (
        <div className="page-container">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 'bold' }}>سجل الطلبات</h2>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.4rem' }}>متابعة وتحليل جميع طلبات المتجر الحديثة.</p>
                </div>
                
                <div className="search-bar glass-panel" style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 1rem', borderRadius: '12px', gap: '8px' }}>
                    <Search size={18} color="var(--text-muted)" />
                    <input type="text" placeholder="بحث برقم الطلب..." style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none' }} />
                </div>
            </header>

            <div className="table-container glass-panel">
                <table className="glass-table">
                    <thead>
                        <tr>
                            <th>رقم الطلب</th>
                            <th>العميل</th>
                            <th>التاريخ</th>
                            <th>المبلغ</th>
                            <th>الحالة</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id} className="table-row">
                                <td style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{order.reference_id}</td>
                                <td>{order.customer?.first_name} {order.customer?.last_name}</td>
                                <td style={{ color: 'var(--text-muted)' }}>{order.created_at}</td>
                                <td style={{ fontWeight: 'bold' }}>{order.amounts?.total?.amount} {order.amounts?.total?.currency}</td>
                                <td>
                                    <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default OrdersPage;
