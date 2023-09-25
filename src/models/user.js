const mongoose = require('mongoose');
const crypt = require('../utilities/crypto-service');

const userSchema = new mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        publicKey: String
    },
    {
        timestamps: true
    });

userSchema.pre('save', async function (next) {
    if (this.isModified('publicKey')) {
        if (!crypt.verifyPublicKeyFormat(this.publicKey)) {
            return next(new Error('Invalid key'));
        }
    }
    return next();
});

module.exports = mongoose.model('User', userSchema);