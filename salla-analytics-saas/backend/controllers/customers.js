const sallaService = require('../services/salla');

exports.getCustomers = async (req, res) => {
    try {
        let customersData;

        try {
            customersData = await sallaService.getCustomers();
        } catch (apiError) {
             if (apiError.response && apiError.response.status === 401) {
                 return res.json(getDummyCustomers());
             }
             throw apiError;
        }

        res.json({
            success: true,
            isDummy: false,
            data: customersData.data
        });

    } catch (error) {
        console.error("Customers API Error:", error);
        res.status(500).json({ success: false, error: "Failed to fetch customers data" });
    }
};

function getDummyCustomers() {
    return {
        success: true,
        isDummy: true,
        data: [
            { id: 3001, first_name: 'أحمد', last_name: 'عبدالله', mobile: '+966500000001', email: 'ahmed@example.com', created_at: '2023-01-15' },
            { id: 3002, first_name: 'سارة', last_name: 'محمد', mobile: '+966500000002', email: 'sara@example.com', created_at: '2023-02-20' },
            { id: 3003, first_name: 'خالد', last_name: 'العتيبي', mobile: '+966500000003', email: 'khalid@example.com', created_at: '2023-03-10' },
            { id: 3004, first_name: 'نورة', last_name: 'الفهد', mobile: '+966500000004', email: 'nouf@example.com', created_at: '2023-04-05' },
            { id: 3005, first_name: 'فيصل', last_name: 'سعود', mobile: '+966500000005', email: 'faisal@example.com', created_at: '2023-05-12' },
            { id: 3006, first_name: 'مها', last_name: 'علي', mobile: '+966500000006', email: 'maha@example.com', created_at: '2023-06-25' },
            { id: 3007, first_name: 'تركي', last_name: 'الغامدي', mobile: '+966500000007', email: 'turki@example.com', created_at: '2023-07-30' },
            { id: 3008, first_name: 'ريم', last_name: 'العمري', mobile: '+966500000008', email: 'reem@example.com', created_at: '2023-08-14' }
        ]
    };
}
