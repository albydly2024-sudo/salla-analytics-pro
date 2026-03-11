import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2, AlertTriangle, Search, Package } from 'lucide-react';

function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:5000/api/products');
                setProducts(response.data.data);
            } catch (err) {
                setError("فشل في جلب قائمة المنتجات");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'active': return 'badge-success';
            case 'out_of_stock': return 'badge-danger';
            case 'hidden': return 'badge-neutral';
            default: return 'badge-neutral';
        }
    };

    const translateStatus = (status) => {
        switch (status) {
            case 'active': return 'نشط';
            case 'out_of_stock': return 'نفذت الكمية';
            case 'hidden': return 'مخفي';
            default: return status;
        }
    }

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
                    <h2 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 'bold' }}>إدارة المنتجات</h2>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.4rem' }}>عرض ومراقبة المخزون الخاص بمتجرك.</p>
                </div>
                
                 <div className="search-bar glass-panel" style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 1rem', borderRadius: '12px', gap: '8px' }}>
                    <Search size={18} color="var(--text-muted)" />
                    <input type="text" placeholder="بحث عن منتج..." style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none' }} />
                </div>
            </header>

            <div className="table-container glass-panel">
                <table className="glass-table">
                    <thead>
                        <tr>
                            <th>المنتج</th>
                            <th>رمز SKU</th>
                            <th>السعر</th>
                            <th>المخزون المتوفر</th>
                            <th>الحالة</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id} className="table-row">
                                <td style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                        {product.main_image ? <img src={product.main_image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/> : <Package size={20} color="var(--text-muted)" />}
                                    </div>
                                    <span style={{ fontWeight: 'bold' }}>{product.name}</span>
                                </td>
                                <td style={{ color: 'var(--text-muted)' }}>{product.sku}</td>
                                <td style={{ fontWeight: 'bold' }}>{product.price?.amount} {product.price?.currency}</td>
                                <td style={{ color: product.quantity <= 5 && product.quantity > 0 ? '#fbbf24' : (product.quantity === 0 ? '#ef4444' : '#fff') }}>
                                    {product.quantity} قطعة
                                </td>
                                <td>
                                    <span className={`status-badge ${getStatusBadgeClass(product.status)}`}>
                                        {translateStatus(product.status)}
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

export default ProductsPage;
