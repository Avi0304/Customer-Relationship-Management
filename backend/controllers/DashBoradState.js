const Customer = require('../models/Customer');
const Sale = require('../models/Sales');

const DashboardStats = async(req,res) => {
    try {
        const totalRevenue = await Sale.aggregate([
            {
                $group: {
                    _id: null,
                    totalAmount: {$sum: {$toDouble: "$amount"}},
                }
            }
        ])

        const activeCustomers = await Customer.countDocuments({
            status: {$in: ["Pending","Completed"]}
        });

        const totalSales = await Sale.countDocuments();

        const activeDeals = await Sale.countDocuments({
            status: 'Pending'
        })

        res.status(200).json({totalRevenue: totalRevenue[0]?.totalAmount || 0, activeCustomers, totalSales, activeDeals})
    } catch (error) {
        res.status(500).json({message: 'Error in fetching DashBoard Stats: ', error});
    }
}

module.exports = {DashboardStats}