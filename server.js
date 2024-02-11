// server.js

const express = require('express');
const bodyParser = require('body-parser');
const Web3 = require('web3');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://nutankumari211:nutan%40123%40@cluster0.pmxpstx.mongodb.net/database_blockchain?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.once('open', () => console.log('Connected to MongoDB'));
db.on('error', err => console.error('MongoDB connection error:', err));

// Initialize Web3 with your Ethereum node URL
const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/ee957335fc0e4c4b965827f692695495'));


// Define mongoose schema and model for alerts
const alertSchema = new mongoose.Schema({
    address: String,
    amount: Number,
    notificationMethod: String,
    notificationAddress: String
});

const Alert = mongoose.model('Alert', alertSchema);

// Define routes for fetching address details, balance, transactions, and setting up alerts

app.get('/api/address/:address', async (req, res) => {
    try {
        const address = req.params.address;
        const balance = await web3.eth.getBalance(address);
        res.json({ balance });
    } catch (error) {
        console.error('Error fetching address details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/balance/:address', async (req, res) => {
    try {
        const address = req.params.address;
        // Logic to fetch ERC20 token balances
        const tokenBalances = {}; // Placeholder for ERC20 token balances
        res.json({ balances: tokenBalances });
    } catch (error) {
        console.error('Error fetching balance:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/transactions/:address', async (req, res) => {
    try {
        const address = req.params.address;
        const transactions = await web3.eth.getTransactionCount(address);
        res.json({ transactions });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/alerts', async (req, res) => {
    try {
        const { address, amount, notificationMethod, notificationAddress } = req.body;
        const alert = new Alert({
            address,
            amount,
            notificationMethod,
            notificationAddress
        });
        await alert.save();
        res.sendStatus(201);
    } catch (error) {
        console.error('Error setting up alert:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/alerts', async (req, res) => {
    try {
        const alerts = await Alert.find();
        res.json(alerts);
    } catch (error) {
        console.error('Error fetching alerts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
