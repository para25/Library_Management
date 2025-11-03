// services/frappeService.js
const axios = require('axios');

const FRAPPE_BASE_URL = 'https://frappe.io/api/method/frappe-library';

exports.fetchBooks = async(params = {}) => {
    try {
        const { data } = await axios.get(FRAPPE_BASE_URL, { params });
        return data.message || []; // Frappe returns books in `message` field
    } catch (error) {
        console.error('❌ Error fetching books from Frappe API:', error.message);
        throw new Error('Failed to fetch books from Frappe API');
    }
};