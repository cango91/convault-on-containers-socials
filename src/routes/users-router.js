const express = require('express');
const router = express.Router();
const usersCtrl = require('../controllers/users-controller');

// router.post('/', usersCtrl.create);
router.put('/', usersCtrl.update);
// router.delete('/', usersCtrl.delete);

module.exports = router;