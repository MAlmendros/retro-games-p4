const gameController = require('../controllers/game.controller');

var express = require('express');
var router = express.Router();

///////// Basic Rooms API Rest /////////

/**
 * POST - Create Game ('/api/games')
 */
router.post('/', gameController.createGame);

/**
 * GET - Games ('/api/games')
 */
router.get('/', gameController.getGames);

/**
 * GET - Game by ID ('/api/games/:id')
 */
router.get('/:id', gameController.getGame);

/**
 * PUT - Update Game ('/api/games/:id')
 */
router.put('/:id', gameController.updateGame);

/**
 * DELETE - Delete Game ('/api/games/:id')
 */
router.delete('/:id', gameController.deleteGame);

///////// Extended Rooms API Rest /////////

/**
 * PUT - Conquer Cell ('/api/games/:id/conquer-cell')
 */
router.put('/:id/conquer-cell', gameController.conquerCell);

module.exports = router;
