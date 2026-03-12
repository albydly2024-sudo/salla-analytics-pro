const sallaService = require('../services/salla');

exports.getDashboardData = async (req, res) => {
    try {
        const { timeframe = '7d' } = req.query;
        // Try to fetch real data
        // If the token is invalid (401), we will catch it and return dummy data for demonstration
        
        let storeInfo, ordersData, productsData;

        try {
            storeInfo = await sallaService.getStoreInfo();
            ordersData = await sallaService.getOrders();
            productsData = await sallaService.getProducts();
        } catch (apiError) {
             if (apiError.response && apiError.response.status === 401) {
                 console.log("Token is unauthorized. Using dummy data for demonstration.");
                 return res.json(getDummyData(timeframe));
             }
             throw apiError; // Re-throw if it's not a 401
        }

        // Process real data (Placeholder logic, assuming Salla pagination structure)
        const totalOrders = ordersData.data.length;
        const totalSales = ordersData.data.reduce((sum, order) => sum + (order.amounts?.total?.amount || 0), 0);
        const totalProducts = productsData.data.length;

        // Extracting some basic charts data
        const salesByDate = {};
        ordersData.data.forEach(order => {
           const date = order.created_at.split(' ')[0]; // YYYY-MM-DD
           salesByDate[date] = (salesByDate[date] || 0) + (order.amounts?.total?.amount || 0);
        });

        res.json({
            success: true,
            isDummy: false,
            store: storeInfo.data,
            kpis: {
                totalOrders,
                totalSales,
                totalProducts
            },
            charts: {
                salesByDate: Object.keys(salesByDate).map(date => ({ date, amount: salesByDate[date] }))
            }
        });

    } catch (error) {
        console.error("Dashboard Controller Error:", error);
        res.status(500).json({ success: false, error: "Failed to fetch dashboard data" });
    }
};

function getDummyData(timeframe) {
    let salesData = [];
    
    // Generate dummy data based on timeframe
    if (timeframe === 'today') {
        salesData = [
            { date: '10:00', amount: 300 },
            { date: '12:00', amount: 800 },
            { date: '14:00', amount: 400 },
            { date: '16:00', amount: 150 },
            { date: '18:00', amount: 950 },
        ];
    } else if (timeframe === '30d') {
        salesData = Array.from({length: 30}, (_, i) => ({
            date: `2023-11-${String(i+1).padStart(2, '0')}`,
            amount: Math.floor(Math.random() * 5000) + 1000
        }));
    } else {
        // Default 7 days
        salesData = [
            { date: '2023-10-01', amount: 1200 },
            { date: '2023-10-02', amount: 1500 },
            { date: '2023-10-03', amount: 900 },
            { date: '2023-10-04', amount: 2200 },
            { date: '2023-10-05', amount: 1800 },
            { date: '2023-10-06', amount: 2500 },
            { date: '2023-10-07', amount: 3100 },
        ];
    }

    const totalSales = salesData.reduce((sum, item) => sum + item.amount, 0);

    return {
        success: true,
        isDummy: true,
        store: {
            name: "متجر الفخامة (تجريبي)",
            domain: "luxury-store.salla.sa",
            avatar: "https://via.placeholder.com/150"
        },
        kpis: {
            totalOrders: timeframe === 'today' ? 45 : (timeframe === '30d' ? 5240 : 1245),
            totalSales: totalSales,
            totalProducts: 342,
            conversionRate: timeframe === 'today' ? "3.1%" : "4.2%"
        },
         charts: {
            salesByDate: salesData,
            topProducts: [
                { name: 'عطر ليالي النواعم', sales: timeframe === 'today' ? 12 : 450 },
                { name: 'ساعة كلاسيك فضية', sales: timeframe === 'today' ? 5 : 320 },
                { name: 'حقيبة جلد طبيعي', sales: timeframe === 'today' ? 8 : 210 },
            ]
        }
    }
}
