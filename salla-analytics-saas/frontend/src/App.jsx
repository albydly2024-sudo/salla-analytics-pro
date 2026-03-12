import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Settings, 
  TrendingUp,
  Package,
  AlertTriangle,
  Loader2,
  Bell,
  Download
} from 'lucide-react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar
} from 'recharts';
import './index.css';

// Import New Pages
import OrdersPage from './pages/OrdersPage';
import ProductsPage from './pages/ProductsPage';
import CustomersPage from './pages/CustomersPage';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [timeframe, setTimeframe] = useState('7d'); // Default to 7 days

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Pointing to our local node.js backend, passing the timeframe filter
        const response = await axios.get(`https://salla-backend-a3mt.onrender.com/api/dashboard?timeframe=${timeframe}`);
        setData(response.data);
      } catch (err) {
        setError("فشل في جلب البيانات من الخادم");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'dashboard') {
        fetchDashboardData();
    }
  }, [timeframe, activeTab]);

  const handleExportCSV = () => {
      if (!data) return;
      
      const headers = ['المقياس', 'القيمة'];
      const rows = [
          ['إجمالي المبيعات', data.kpis.totalSales],
          ['إجمالي الطلبات', data.kpis.totalOrders],
          ['المنتجات النشطة', data.kpis.totalProducts],
          ['معدل التحويل', data.kpis.conversionRate],
      ];
      
      let csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
          + headers.join(",") + "\n"
          + rows.map(e => e.join(",")).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `salla_report_${timeframe}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  if (error) {
    return (
        <div className="app-container" style={{ alignItems: 'center', justifyContent: 'center' }}>
           <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
               <AlertTriangle color="red" size={48} style={{ marginBottom: '1rem' }} />
               <h2 style={{ color: '#fca5a5' }}>{error}</h2>
               <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>تأكد من تشغيل خادم الباك-إند (Node.js)</p>
           </div>
        </div>
    )
  }

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar glass-panel">
        <div className="brand">
          <TrendingUp className="brand-icon" size={32} />
          <span>ذكاء سلة</span>
        </div>
        
        <nav>
          <ul className="nav-list">
            <li className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
              <LayoutDashboard size={20} />
              <span>الرئيسية</span>
            </li>
            <li className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
              <ShoppingBag size={20} />
              <span>الطلبات</span>
            </li>
            <li className={`nav-item ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
              <Package size={20} />
              <span>المنتجات</span>
            </li>
            <li className={`nav-item ${activeTab === 'customers' ? 'active' : ''}`} onClick={() => setActiveTab('customers')}>
              <Users size={20} />
              <span>العملاء</span>
            </li>
            <li style={{ marginTop: 'auto' }} className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
              <Settings size={20} />
              <span>الإعدادات</span>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        
        {/* Topbar / Status */}
        <header className="header-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
                <h1 className="gradient-text">مرحباً بك في لوحة القيادة 🚀</h1>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>بيانات متجرك يتم تحديثها ومراقبتها آلياً بدون أي تدخل منك.</p>
            </div>
            
            <div className="header-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
               {/* Time Filters */}
               {activeTab === 'dashboard' && data && (
                   <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '12px' }}>
                       <button onClick={() => setTimeframe('today')} className={`filter-btn ${timeframe === 'today' ? 'active' : ''}`}>اليوم</button>
                       <button onClick={() => setTimeframe('7d')} className={`filter-btn ${timeframe === '7d' ? 'active' : ''}`}>7 أيام</button>
                       <button onClick={() => setTimeframe('30d')} className={`filter-btn ${timeframe === '30d' ? 'active' : ''}`}>30 يوم</button>
                   </div>
               )}

               {data?.store && (
                   <div className="glass-panel" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '10px', borderRadius: '100px' }}>
                       <img src={data.store.avatar} alt="Store Avatar" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                       <span style={{ fontWeight: '600' }}>{data.store.name}</span>
                   </div>
               )}
               {activeTab === 'dashboard' && data && (
                  <button onClick={handleExportCSV} className="glass-panel" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '12px', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', background: 'transparent' }}>
                      <Download size={18} />
                      <span style={{ fontSize: '0.9rem' }}>تصدير</span>
                  </button>
               )}
               <div className="glass-panel" style={{ padding: '0.7rem', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <Bell size={20} />
               </div>
            </div>
        </header>

        {/* Global Loading Overlay inside Dashboard */}
        {loading && activeTab === 'dashboard' && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 className="primary-text spin" size={48} />
            </div>
        )}

        {activeTab === 'dashboard' ? (
            <>
                {data?.isDummy && (
                    <div className={`status-banner dummy glass-panel`}>
                        <AlertTriangle size={24} />
                        <div>
                            <strong>وضع العرض التجريبي (Demo Mode)</strong>
                            <p style={{ fontSize: '0.9rem', marginTop: '0.2rem' }}>رمز الـ Token الخاص بسلة غير صالح حالياً. رجاءً قم بإضافة الرمز الصحيح من صفحة الإعدادات.</p>
                        </div>
                    </div>
                )}

                {/* KPI Grid */}
                <section className="kpi-grid">
                  <KpiCard 
                    title="إجمالي المبيعات" 
                    value={`${data?.kpis?.totalSales.toLocaleString()} ر.س`} 
                    icon={<TrendingUp />} 
                    trend="+12%" 
                  />
                  <KpiCard 
                    title="إجمالي الطلبات" 
                    value={data?.kpis?.totalOrders} 
                    icon={<ShoppingBag />} 
                    trend="+5.4%" 
                  />
                  <KpiCard 
                    title="المنتجات النشطة" 
                    value={data?.kpis?.totalProducts} 
                    icon={<Package />} 
                    trend="0%" 
                  />
                  <KpiCard 
                    title="معدل التحويل" 
                    value={data?.kpis?.conversionRate || "N/A"} 
                    icon={<Users />} 
                    trend="+1.2%" 
                  />
                </section>

                {/* Charts Grid */}
                <section className="charts-grid">
                    {/* Main Area Chart */}
                    <div className="chart-card glass-panel">
                        <h3 className="chart-title">المبيعات خلال 7 أيام الماضية</h3>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <AreaChart data={data?.charts?.salesByDate}  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: 'var(--glass-bg)', backdropFilter: 'blur(10px)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: '#fff' }}
                                        itemStyle={{ color: 'var(--primary)' }}
                                    />
                                    <Area type="monotone" dataKey="amount" name="المبيعات (ر.س)" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Bar Chart - Top Products */}
                    <div className="chart-card glass-panel">
                        <h3 className="chart-title">المنتجات الأكثر مبيعاً</h3>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <BarChart data={data?.charts?.topProducts} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" stroke="var(--text-muted)" fontSize={12} width={100} tickLine={false} axisLine={false} />
                                    <Tooltip 
                                        cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                        contentStyle={{ backgroundColor: 'var(--glass-bg)', backdropFilter: 'blur(10px)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: '#fff' }}
                                    />
                                    <Bar dataKey="sales" name="المبيعات" fill="var(--primary)" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </section>
            </>
        ) : activeTab === 'orders' ? (
            <OrdersPage />
        ) : activeTab === 'products' ? (
            <ProductsPage />
        ) : activeTab === 'customers' ? (
            <CustomersPage />
        ) : (
            <SettingsPage reloadData={() => window.location.reload()} />
        )}

      </main>
    </div>
  );
}

function KpiCard({ title, value, icon, trend }) {
    const isPositive = trend.includes('+');
    
    return (
        <div className="kpi-card glass-panel kpi-hoverable">
            <div className="kpi-header">
                <span>{title}</span>
                <div className="kpi-icon-box">{icon}</div>
            </div>
            <div className="kpi-value">{value}</div>
            <div style={{ 
                fontSize: '0.85rem', 
                color: isPositive ? 'var(--primary)' : '#a1a1aa',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                <span style={{ padding: '2px 8px', borderRadius: '20px', background: isPositive ? 'var(--primary-glow)' : 'rgba(255,255,255,0.05)' }}>
                    {trend}
                </span>
                <span style={{ color: 'var(--text-muted)' }}>مقارنة بالأسبوع الماضي</span>
            </div>
        </div>
    )
}

function SettingsPage({ reloadData }) {
    const [token, setToken] = useState('');
    const [status, setStatus] = useState({ loading: false, message: '', type: '' });

    useEffect(() => {
        axios.get('https://salla-backend-a3mt.onrender.com/api/settings')
            .then(res => setToken(res.data.sallaToken || ''))
            .catch(console.error);
    }, []);

    const saveSettings = async () => {
        setStatus({ loading: true, message: '', type: '' });
        try {
            await axios.post('https://salla-backend-a3mt.onrender.com/api/settings', { sallaToken: token });
            setStatus({ loading: false, message: 'تم حفظ التوكن بنجاح! يتم تحديث لوحة التحكم الآن...', type: 'success' });
            setTimeout(() => {
                reloadData();
            }, 1500);
        } catch (error) {
            setStatus({ loading: false, message: 'حدث خطأ أثناء الحفظ', type: 'error' });
        }
    };

    return (
        <div className="glass-panel" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', marginTop: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                <div className="kpi-icon-box" style={{ background: 'var(--primary-glow)' }}>
                    <Settings style={{ color: 'var(--primary)'}} />
                </div>
                <h2>إعدادات الربط متجر سلة</h2>
            </div>
            
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.6' }}>
                قم بإدخال رمز التوكن الشخصي الخاص بمتجرك (Personal Access Token) الذي حصلت عليه من بوابة شركاء سلة. سيمكن هذا النظام من قراءة المبيعات وعرض الإحصائيات الفورية لمتجرك الفعلي.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label style={{ fontWeight: '600', color: '#e4e4e7' }}>Salla Access Token (رمز الوصول)</label>
                <input 
                    type="password"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="ضع التوكن الخاص بك هنا... يبدأ عادة بـ SP_"
                    className="glass-input"
                />
                
                <button 
                    onClick={saveSettings} 
                    disabled={status.loading}
                    className="primary-btn glass-button"
                >
                    {status.loading ? <Loader2 className="spin" size={20} /> : 'حفظ الإعدادات وبدء المزامنة'}
                </button>

                {status.message && (
                    <div className={`status-banner ${status.type} glass-panel`} style={{ marginTop: '1rem', padding: '1rem' }}>
                        <p>{status.message}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default App;
