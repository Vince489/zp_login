const express = require("express");
const router = express.Router();
const vrtAccount = require('./model')
const  verifyToken  = require("../../middleware/auth");
const User = require('../user/model')

// create vrtaccount for logged in user
router.post("/", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        if (!user) return res.status(400).json({ message: "User not found" });
        const newVrtAccount = new vrtAccount({
            user: req.user.id,
            accountName: req.body.accountName,
            accountNumber: req.body.accountNumber,
            bankName: req.body.bankName,
            accountType: req.body.accountType,
            accountBalance: req.body.accountBalance
        });
        const vrtAccount = await newVrtAccount.save();
        res.json(vrtAccount);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;