const User = require('../models/user');
const utils = require('../utilities/utils');

// const create = async (req, res, next) => {
//     try {
//         const { userId, publicKey } = req.body;
//         if (!userId || !publicKey) throw new Error('Missing required information');
//         const existingUser = await User.findOne({ _id: userId });
//         if (existingUser) throw new Error('Record already exists');
//         await User.create({ _id: userId, publicKey });
//         res.status(204).json({});
//     } catch (error) {
//         console.error(error);
//         utils.respondWithStatus(res, 400, error.message);
//     }
// }

const createUser = async (userId, username) =>{
    try {
        const existingUser = await User.findOne({ _id: userId });
        if (existingUser) throw new Error('Record already exists');
        await User.create({ _id: userId, username });
    } catch (error) {
        console.error(error);
    }
}

const deleteUser = async (userId) =>{
    try {
        await User.findOneAndDelete({ _id: userId });
    } catch (error) {
        console.error(error);
    }
}

const update = async (req, res, next) => {
    try {
        const { userId, publicKey } = req.body;
        if (!userId || !publicKey) throw new Error('Missing required information');
        const updated = await User.findOneAndUpdate({ _id: userId }, { publicKey }, { new: true });
        if(!updated) return utils.respondWithStatus(res,404,'Record not found');
        res.status(204).json({});
    } catch (error) {
        console.error(error);
        utils.respondWithStatus(res, 400, error.message);
    }
}

// const deleteOne = async (req, res, next) => {
//     try {
//         const { userId } = req.body;
//         if (!userId) throw new Error('Missing required information');
//         await User.findOneAndDelete({ _id: userId });
//         res.status(204).json({});
//     } catch (error) {
//         console.error(error);
//         utils.respondWithStatus(res, 400, error.message);
//     }
// }

module.exports = {
    // create,
    // delete: deleteOne,
    createUser,
    deleteUser,
    update,
}