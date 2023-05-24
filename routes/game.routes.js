const gameController = require('../controllers/game.controller');

var express = require('express');
var router = express.Router();

///////// Basic Rooms API Rest /////////

/**
 * @swagger
 * /api/games:
 *   post:
 *     tags:
 *       - Juegos
 *     summary: Crear un juego.
 *     description: Crear un juego. Se necesita un body.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomId:
 *                 type: integer
 *                 description: ID de la sala de juego donde se jugará el juego.
 *                 example: 1
 *               userId:
 *                 type: integer
 *                 description: ID del usuario que quiere unirse al juego.
 *                 example: 1
 *     responses:
 *       200:
 *         description: Juego creado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID del juego.
 *                   example: 1
 *                 name:
 *                   type: string
 *                   description: Nombre del juego.
 *                   example: Juego 1
 *                 players:
 *                   type: array
 *                   description: Jugadores dentro del juego.
 *                   example: []
 */
router.post('/', gameController.createGame);

/**
 * @swagger
 * /api/games:
 *   get:
 *     tags:
 *       - Juegos
 *     summary: Listado de juegos.
 *     description: Listado de juegos. No necesita de ningún parámetro.
 *     responses:
 *       200:
 *         description: Listado de juegos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID del juego.
 *                     example: 1
 *                   name:
 *                     type: string
 *                     description: Nombre del juego.
 *                     example: Juego 1
 *                   players:
 *                     type: array
 *                     description: Jugadores dentro del juego.
 *                     example: []
 */
router.get('/', gameController.getGames);

/**
 * @swagger
 * /api/games/:id:
 *   get:
 *     tags:
 *       - Juegos
 *     summary: Información de un juego.
 *     description: Información de un juego. Se necesita un ID como parámetro.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del juego que se busca.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Información de un juego.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID del juego.
 *                   example: 1
 *                 name:
 *                   type: string
 *                   description: Nombre del juego.
 *                   example: Juego 1
 *                 players:
 *                   type: array
 *                   description: Jugadores dentro del juego.
 *                   example: {}
 */
router.get('/:id', gameController.getGame);

/**
 * @swagger
 * /api/games/:id:
 *   put:
 *     tags:
 *       - Juegos
 *     summary: Actualizar un juego.
 *     description: Actualizar un juego. Se necesita un ID como parámetro y un body.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del juego a actualizar.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomId:
 *                 type: integer
 *                 description: ID de la sala de juego.
 *                 example: 1
 *               userId:
 *                 type: integer
 *                 description: ID del usuario.
 *                 example: 1
 *     responses:
 *       200:
 *         description: Juego actualizado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID del juego.
 *                   example: 1
 *                 name:
 *                   type: string
 *                   description: Nombre del juego.
 *                   example: Juego 1
 *                 players:
 *                   type: array
 *                   description: Jugadores dentro del juego.
 *                   example: []
 */
router.put('/:id', gameController.updateGame);

/**
 * @swagger
 * /api/games/:id:
 *   delete:
 *     tags:
 *       - Juegos
 *     summary: Borrar un juego.
 *     description: Borrar un juego. Se necesita un ID como parámetro.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del juego a borrar.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID del usuario.
 *                 example: 1
 *     responses:
 *       200:
 *         description: Juego borrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID del juego.
 *                   example: 1
 *                 name:
 *                   type: string
 *                   description: Nombre del juego.
 *                   example: Juego 1
 *                 players:
 *                   type: array
 *                   description: Jugadores dentro del juego.
 *                   example: {}
 */
router.delete('/:id', gameController.deleteGame);

///////// Extended Rooms API Rest /////////

/**
 * @swagger
 * /api/games/:id/conquer-cell:
 *   post:
 *     tags:
 *       - Juegos
 *     summary: Conquistar una celda.
 *     description: Conquistar una celda. Se necesita un ID como parámetro y un body.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del juego donde se está jugando.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gameId:
 *                 type: integer
 *                 description: ID del juego donde se conquista la celda.
 *                 example: 1
 *               userId:
 *                 type: integer
 *                 description: ID del usuario que conquista la celda.
 *                 example: 1
 *               cell:
 *                 type: integer
 *                 description: Celda a conquistar.
 *                 example: 1
 *     responses:
 *       200:
 *         description: Juego actualizado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 game:
 *                   type: object
 *                   description: Información del juego.
 *                   example: Juego 1
 *                 cellId:
 *                   type: integer
 *                   description: Celda conquistada.
 *                   example: 1
 *                 iPlayer:
 *                   type: integer
 *                   description: Posición del jugador que ha conquistado la celda.
 *                   example: 1
 */
router.post('/:id/conquer-cell', gameController.conquerCell);

module.exports = router;
