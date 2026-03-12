const sallaService = require('../services/salla');

exports.getOrders = async (req, res) => {
    try {
        let ordersData;

        try {
            ordersData = await sallaService.getOrders();
        } catch (apiError) {
             if (apiError.response && apiError.response.status === 401) {
                 return res.json(getDummyOrders());
             }
             throw apiError;
        }

        res.json({
            success: true,
            isDummy: false,
            data: ordersData.data
        });

    } catch (error) {
        console.error("Orders API Error:", error);
        res.status(500).json({ success: false, error: "Failed to fetch orders data" });
    }
};

function getDummyOrders() {
    return {
        success: true,
        isDummy: true,
        data: [
            { id: 1001, reference_id: '#ORD-1001', created_at: '2023-11-20 14:30', status: 'مكتمل', amounts: { total: { amount: 350, currency: 'SAR' } }, customer: { first_name: 'أحمد', last_name: 'عبدالله' } },
            { id: 1002, reference_id: '#ORD-1002', created_at: '2023-11-20 12:15', status: 'قيد التنفيذ', amounts: { total: { amount: 1250, currency: 'SAR' } }, customer: { first_name: 'سارة', last_name: 'محمد' } },
            { id: 1003, reference_id: '#ORD-1003', created_at: '2023-11-20 10:05', status: 'مكتمل', amounts: { total: { amount: 45, currency: 'SAR' } }, customer: { first_name: 'خالد', last_name: 'العتيبي' } },
            { id: 1004, reference_id: '#ORD-1004', created_at: '2023-11-19 22:45', status: 'ملغي', amounts: { total: { amount: 800, currency: 'SAR' } }, customer: { first_name: 'نورة', last_name: 'الفهد' } },
            { id: 1005, reference_id: '#ORD-1005', created_at: '2023-11-19 18:30', status: 'مكتمل', amounts: { total: { amount: 210, currency: 'SAR' } }, customer: { first_name: 'فيصل', last_name: 'سعود' } },
            { id: 1006, reference_id: '#ORD-1006', created_at: '2023-11-19 16:20', status: 'بانتظار المراجعة', amounts: { total: { amount: 560, currency: 'SAR' } }, customer: { first_name: 'مها', last_name: 'علي' } },
            { id: 1007, reference_id: '#ORD-1007', created_at: '2023-11-18 11:10', status: 'مكتمل', amounts: { total: { amount: 120, currency: 'SAR' } }, customer: { first_name: 'تركي', last_name: 'الغامدي' } },
            { id: 1008, reference_id: '#ORD-1008', created_at: '2023-11-18 09:00', status: 'قيد التنفيذ', amounts: { total: { amount: 3300, currency: 'SAR' } }, customer: { first_name: 'ريم', last_name: 'العمري' } },
            { id: 1009, reference_id: '#ORD-1009', created_at: '2023-11-17 15:45', status: 'مكتمل', amounts: { total: { amount: 95, currency: 'SAR' } }, customer: { first_name: 'سعد', last_name: 'الشهراني' } },
            { id: 1010, reference_id: '#ORD-1010', created_at: '2023-11-17 08:20', status: 'مسترجع', amounts: { total: { amount: 450, currency: 'SAR' } }, customer: { first_name: 'عبير', last_name: 'الدوسري' } },
        ]
    };
}
