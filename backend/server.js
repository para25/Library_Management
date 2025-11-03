const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db.js');

app.use(cors());
app.use(express.json());

connectDB();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World. This is the backend server.');
})


const bookRoutes = require('./routes/bookRoutes.js');
app.use('/api/books', bookRoutes);


const memberRoutes = require('./routes/memberRoutes.js')
app.use('/api/members', memberRoutes)


const transactionRoutes = require('./routes/transactionRoutes.js');
app.use('/api/transactions', transactionRoutes);


const importRoutes = require('./routes/importRoutes.js');
app.use('/api/import', importRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})