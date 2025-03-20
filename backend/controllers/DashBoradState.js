const moment = require("moment");
const Customer = require("../models/Customer");
const Sale = require("../models/Sales");

const DashboardStats = async (req, res) => {
    try {
        // Get the start of the previous month
        const lastMonthStart = moment().subtract(1, "months").startOf("month");
        const lastMonthEnd = moment().subtract(1, "months").endOf("month");

        // Get the start of the last hour
        const lastHour = moment().subtract(1, "hours").toDate();

        // Calculate current values
        const totalRevenueResult = await Sale.aggregate([
            { $group: { _id: null, totalAmount: { $sum: { $toDouble: "$amount" } } } }
        ]);
        const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].totalAmount : 0;

        const activeCustomers = await Customer.countDocuments({ status: { $in: ["Pending", "Completed"] } });
        const totalSales = await Sale.countDocuments();
        const activeDeals = await Sale.countDocuments({ status: "Pending" });

        // Fetch previous month revenue
        const lastMonthRevenueResult = await Sale.aggregate([
            { $match: { createdAt: { $gte: lastMonthStart.toDate(), $lte: lastMonthEnd.toDate() } } },
            { $group: { _id: null, totalAmount: { $sum: { $toDouble: "$amount" } } } }
        ]);
        const lastMonthRevenue = lastMonthRevenueResult.length > 0 ? lastMonthRevenueResult[0].totalAmount : 0;

        // Fetch previous month customers
        const lastMonthCustomers = await Customer.countDocuments({
            createdAt: { $gte: lastMonthStart.toDate(), $lte: lastMonthEnd.toDate() }
        });

        // Fetch previous month sales
        const lastMonthSales = await Sale.countDocuments({
            createdAt: { $gte: lastMonthStart.toDate(), $lte: lastMonthEnd.toDate() }
        });

        // Fetch active deals in the last hour
        const lastHourDeals = await Sale.countDocuments({
            createdAt: { $gte: lastHour }
        });

        // Calculate percentage changes
        const revenueChange = lastMonthRevenue
            ? ((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
            : 0;

        const customerChange = lastMonthCustomers
            ? ((activeCustomers - lastMonthCustomers) / lastMonthCustomers) * 100
            : 0;

        const salesChange = lastMonthSales
            ? ((totalSales - lastMonthSales) / lastMonthSales) * 100
            : 0;

        const dealsChange = lastHourDeals ? `+${lastHourDeals} ` : "+0 ";

        res.status(200).json({
            totalRevenue,
            activeCustomers,
            totalSales,
            activeDeals,
            revenueChange: revenueChange.toFixed(1),
            customerChange: customerChange.toFixed(1),
            salesChange: salesChange.toFixed(1),
            dealsChange
        });
    } catch (error) {
        res.status(500).json({ message: "Error in fetching Dashboard Stats", error });
    }
};

module.exports = { DashboardStats };
