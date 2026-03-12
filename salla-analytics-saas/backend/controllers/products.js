const sallaService = require('../services/salla');

exports.getProducts = async (req, res) => {
    try {
        let productsData;

        try {
            productsData = await sallaService.getProducts();
        } catch (apiError) {
             if (apiError.response && apiError.response.status === 401) {
                 return res.json(getDummyProducts());
             }
             throw apiError;
        }

        res.json({
            success: true,
            isDummy: false,
            data: productsData.data
        });

    } catch (error) {
        console.error("Products API Error:", error);
        res.status(500).json({ success: false, error: "Failed to fetch products data" });
    }
};

function getDummyProducts() {
    return {
        success: true,
        isDummy: true,
        data: [
            { id: 2001, name: 'ساعة كلاسيك فضية', price: { amount: 350, currency: 'SAR' }, quantity: 15, status: 'active', sku: 'SKU-001', main_image: 'https://via.placeholder.com/50' },
            { id: 2002, name: 'عطر ليالي النواعم', price: { amount: 250, currency: 'SAR' }, quantity: 42, status: 'active', sku: 'SKU-002', main_image: 'https://via.placeholder.com/50' },
            { id: 2003, name: 'حقيبة جلد طبيعي', price: { amount: 550, currency: 'SAR' }, quantity: 3, status: 'out_of_stock', sku: 'SKU-003', main_image: 'https://via.placeholder.com/50' },
            { id: 2004, name: 'نظارة شمسية رياضية', price: { amount: 120, currency: 'SAR' }, quantity: 89, status: 'active', sku: 'SKU-004', main_image: 'https://via.placeholder.com/50' },
            { id: 2005, name: 'حذاء رياضي مريح', price: { amount: 300, currency: 'SAR' }, quantity: 12, status: 'active', sku: 'SKU-005', main_image: 'https://via.placeholder.com/50' },
            { id: 2006, name: 'طقم إكسسوارات ذهبي', price: { amount: 800, currency: 'SAR' }, quantity: 0, status: 'out_of_stock', sku: 'SKU-006', main_image: 'https://via.placeholder.com/50' },
            { id: 2007, name: 'محفظة رجالية فاخرة', price: { amount: 150, currency: 'SAR' }, quantity: 55, status: 'active', sku: 'SKU-007', main_image: 'https://via.placeholder.com/50' },
            { id: 2008, name: 'سماعات بلوتوث لاسلكية', price: { amount: 299, currency: 'SAR' }, quantity: 20, status: 'hidden', sku: 'SKU-008', main_image: 'https://via.placeholder.com/50' }
        ]
    };
}
