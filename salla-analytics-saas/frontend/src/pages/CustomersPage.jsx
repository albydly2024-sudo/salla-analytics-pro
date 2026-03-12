import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2, AlertTriangle, Search, UserCircle } from 'lucide-react';

function CustomersPage() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                setLoading(true);
                const response = await axios.get('https://salla-backend-a3mt.onrender.com/api/customers');
                setCustomers(response.data.data);
            } catch (err) {
                setError("فشل في جلب بيانات العملاء");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

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
                    <h2 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 'bold' }}>دليل العملاء</h2>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.4rem' }}>قائمة العملاء وبيانات التواصل الخاصة بهم.</p>
                </div>
                
                 <div className="search-bar glass-panel" style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 1rem', borderRadius: '12px', gap: '8px' }}>
                    <Search size={18} color="var(--text-muted)" />
                    <input type="text" placeholder="بحث بالاسم أو الجوال..." style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none' }} />
                </div>
            </header>

            <div className="table-container glass-panel">
                <table className="glass-table">
                    <thead>
                        <tr>
                            <th>العميل</th>
                            <th>تاريخ التسجيل</th>
                            <th>رقم الهاتف</th>
                            <th>البريد الإلكتروني</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map(customer => (
                            <tr key={customer.id} className="table-row">
                                <td style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <UserCircle size={24} color="var(--text-muted)" />
                                    </div>
                                    <span style={{ fontWeight: 'bold' }}>{customer.first_name} {customer.last_name}</span>
                                </td>
                                <td>{customer.created_at}</td>
                                <td style={{ color: 'var(--primary)', direction: 'ltr', textAlign: 'right' }}>{customer.mobile}</td>
                                <td style={{ color: 'var(--text-muted)' }}>{customer.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default CustomersPage;
