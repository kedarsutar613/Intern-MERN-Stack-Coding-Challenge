const axios = require('axios');
const Product = require('../model/Product');

// Fetch and seed data from third-party API
exports.initializeDatabase = async (req, res) => {
    try {
        const { data } = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        await Product.deleteMany(); // Clear existing data
        await Product.insertMany(data); // Insert new data
        res.status(200).json({ message: 'Database initialized successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get list of transactions with search and pagination
exports.getTransactions = async (req, res) => {
    const { page = 1, perPage = 10, search = '', month } = req.query;
    const monthIndex = new Date(`${month} 1, 2000`).getMonth(); // Convert month to index
    
    let query = {};
    if (month) query.dateOfSale = { $gte: new Date(2000, monthIndex, 1), $lt: new Date(2000, monthIndex + 1, 1) };
    if (search) query.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { price: new RegExp(search, 'i') }
    ];
    
    try {
        const products = await Product.find(query)
            .skip((page - 1) * perPage)
            .limit(perPage);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get statistics of transactions
exports.getStatistics = async (req, res) => {
    const { month } = req.query;
    const monthIndex = new Date(`${month} 1, 2000`).getMonth();

    try {
        const totalSales = await Product.aggregate([
            { $match: { dateOfSale: { $gte: new Date(2000, monthIndex, 1), $lt: new Date(2000, monthIndex + 1, 1) }, sold: true } },
            { $group: { _id: null, totalSales: { $sum: "$price" }, totalSold: { $sum: 1 } } }
        ]);

        const totalNotSold = await Product.countDocuments({ sold: false });
        res.status(200).json({ totalSales, totalNotSold });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
