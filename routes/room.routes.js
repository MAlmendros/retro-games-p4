const roomController = require('../controllers/room.controller');

var express = require('express');
var router = express.Router();

///////// Basic Rooms API Rest /////////

/**
 * POST - Create Room ('/api/rooms')
 */
router.post('/', roomController.createRoom);

/**
 * GET - Rooms ('/api/rooms')
 */
router.get('/', roomController.getRooms);

/**
 * GET - Room by ID ('/api/rooms/:id')
 */
router.get('/:id', roomController.getRoom);

/**
 * PUT - Update Room ('/api/rooms/:id')
 */
router.put('/:id', roomController.updateRoom);

/**
 * DELETE - Delete Room ('/api/rooms/:id')
 */
router.delete('/:id', roomController.deleteRoom);

///////// Extended Rooms API Rest /////////

/**
 * PUT - Add Player ('/api/rooms/add-player')
 */
router.put('/add-player', roomController.addPlayer);

/**
 * PUT - Remove Player ('/api/rooms/remove-player')
 */
router.put('/remove-player', roomController.removePlayer);

module.exports = router;
