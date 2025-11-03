const Member = require('../models/memberModel');



const addMember = async(req, res) => {
    try {
        const { name, email, phone } = req.body;

        if (!name || !email) {
            return res.status(400).json({ message: 'Name and Email are required.' });
        }

        const existingMember = await Member.findOne({ email });
        if (existingMember) {
            return res.status(409).json({ message: 'Member with this email already exists.' });
        }

        const newMember = new Member({
            name,
            email,
            phone,
        });

        const savedMember = await newMember.save();
        res.status(201).json({ message: 'Member added successfully.', member: savedMember });
    } catch (error) {
        console.error('Error adding member:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


const deleteMember = async(req, res) => {
    try {
        const { id } = req.params;

        const deletedMember = await Member.findByIdAndDelete(id);

        if (!deletedMember) {
            return res.status(404).json({ message: 'Member not found.' });
        }

        res.json({ message: 'Member deleted successfully.', member: deletedMember });
    } catch (error) {
        console.error('Error deleting member:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getAllMembers = async(req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page || '1'));
        const limit = Math.max(1, parseInt(req.query.limit || '20'));
        const skip = (page - 1) * limit;

        const [members, total] = await Promise.all([
            Member.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
            Member.countDocuments()
        ]);

        res.json({
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
            members
        });
    } catch (error) {
        console.error('Error fetching members:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getMemberById = async(req, res) => {
    try {
        const { id } = req.params;
        const member = await Member.findById(id);

        if (!member) {
            return res.status(404).json({ message: 'Member not found.' });
        }

        res.json({ member });
    } catch (error) {
        console.error('Error fetching member details:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const searchMembers = async(req, res) => {
    try {
        const q = (req.query.q || '').trim();

        if (!q) {
            return res.status(400).json({ message: 'Query parameter q is required' });
        }

        const page = Math.max(1, parseInt(req.query.page || '1'));
        const limit = Math.max(1, parseInt(req.query.limit || '20'));
        const skip = (page - 1) * limit;

        // Search by name or email using regex (case-insensitive)
        const searchQuery = {
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { email: { $regex: q, $options: 'i' } }
            ]
        };

        const [results, total] = await Promise.all([
            Member.find(searchQuery).sort({ createdAt: -1 }).skip(skip).limit(limit),
            Member.countDocuments(searchQuery)
        ]);

        res.json({
            q,
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
            results
        });
    } catch (error) {
        console.error('Error searching members:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    addMember,
    deleteMember,
    getAllMembers,
    getMemberById,
    searchMembers,
};