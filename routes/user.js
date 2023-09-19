const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');
const middlewareController = require('../controllers/middlewareController');

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getSingleUser);
// router.get('/:id', userController.getSingleUser);
router.delete('/:id', middlewareController.verifyTokenAndAdminAuth, userController.deleteUser);

module.exports = router;
