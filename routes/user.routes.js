const userController = require('../controllers/user.controller');

var express = require('express');
var router = express.Router();

///////// Basic Users API Rest /////////

/**
 * GET - Users ('/api/users')
 */
router.get('/', userController.getUsers);

/**
 * GET - User by ID ('/api/users/:id')
 */ 
router.get('/:id', userController.getUser);

/**
 * POST - Create User ('/api/users')
 */
router.post('/', userController.createUser);

/**
 * PUT - Update User ('/api/users/:id')
 */
router.put('/:id', userController.updateUser);

/**
 * DELETE - Delete User ('/api/users/:id')
 */
router.delete('/:id', userController.deleteUser);

///////// Extended Users API Rest /////////

/**
 * POST - Login ('/api/users/login')
 */
router.post('/login', userController.login);

module.exports = router;
