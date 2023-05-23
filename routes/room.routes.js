const roomController = require('../controllers/room.controller');

var express = require('express');
var router = express.Router();

///////// Basic Rooms API Rest /////////

/**
 * @swagger
 * /api/rooms:
 *   post:
 *     tags:
 *       - Salas de juego
 *     summary: Crear una sala de juego.
 *     description: Crear una sala de juego. Se necesita un body.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre de la sala de juego.
 *                 example: Sala de juego 5
 *     responses:
 *       200:
 *         description: Sala de juego creada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID de la sala de juego.
 *                   example: 1
 *                 name:
 *                   type: string
 *                   description: Nombre de la sala de juego.
 *                   example: Sala de juego 1
 *                 limit:
 *                   type: integer
 *                   description: Límite de jugadores de la sala de juego.
 *                   example: 2
 *                 players:
 *                   type: array
 *                   description: Jugadores dentro de la sala de juego.
 *                   example: []
 */
router.post('/', roomController.createRoom);

/**
 * @swagger
 * /api/rooms:
 *   get:
 *     tags:
 *       - Salas de juego
 *     summary: Listado de salas de juego.
 *     description: Listado de salas de juego. No necesita de ningún parámetro.
 *     responses:
 *       200:
 *         description: Listado de salas de juego.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID de la sala de juego.
 *                     example: 1
 *                   name:
 *                     type: string
 *                     description: Nombre de la sala de juego.
 *                     example: Sala de juego 1
 *                   limit:
 *                     type: integer
 *                     description: Límite de jugadores de la sala de juego.
 *                     example: 2
 *                   players:
 *                     type: array
 *                     description: Jugadores dentro de la sala de juego.
 *                     example: []
 */
router.get('/', roomController.getRooms);

/**
 * @swagger
 * /api/rooms/:id:
 *   get:
 *     tags:
 *       - Salas de juego
 *     summary: Información de una sala de juego.
 *     description: Información de una sala de juego. Se necesita un ID como parámetro.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la sala de juego que se busca.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Información de una sala de juego.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID de la sala de juego.
 *                   example: 1
 *                 name:
 *                   type: string
 *                   description: Nombre de la sala de juego.
 *                   example: Sala de juego 1
 *                 limit:
 *                   type: integer
 *                   description: Límite de jugadores de la sala de juego.
 *                   example: 2
 *                 players:
 *                   type: array
 *                   description: Jugadores dentro de la sala de juego.
 *                   example: {}
 */
router.get('/:id', roomController.getRoom);

/**
 * @swagger
 * /api/rooms/:id:
 *   put:
 *     tags:
 *       - Salas de juego
 *     summary: Actualizar una sala de juego.
 *     description: Actualizar una sala de juego. Se necesita un ID como parámetro y un body.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la sala de juego a actualizar.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre de la sala de juego.
 *                 example: Sala de juego 5
 *     responses:
 *       200:
 *         description: Sala de juego actualizada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID de la sala de juego.
 *                   example: 1
 *                 name:
 *                   type: string
 *                   description: Nombre de la sala de juego.
 *                   example: Sala de juego 1
 *                 limit:
 *                   type: integer
 *                   description: Límite de jugadores de la sala de juego.
 *                   example: 2
 *                 players:
 *                   type: array
 *                   description: Jugadores dentro de la sala de juego.
 *                   example: []
 */
router.put('/:id', roomController.updateRoom);

/**
 * @swagger
 * /api/rooms/:id:
 *   delete:
 *     tags:
 *       - Salas de juego
 *     summary: Borrar una sala de juego.
 *     description: Borrar una sala de juego. Se necesita un ID como parámetro.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la sala de juego a borrar.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sala de juego borrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID de la sala de juego.
 *                   example: 1
 *                 name:
 *                   type: string
 *                   description: Nombre de la sala de juego.
 *                   example: Sala de juego 1
 *                 limit:
 *                   type: integer
 *                   description: Límite de jugadores de la sala de juego.
 *                   example: 2
 *                 players:
 *                   type: array
 *                   description: Jugadores dentro de la sala de juego.
 *                   example: {}
 */
router.delete('/:id', roomController.deleteRoom);

///////// Extended Rooms API Rest /////////

/**
 * @swagger
 * /api/rooms/add-player:
 *   post:
 *     tags:
 *       - Salas de juego
 *     summary: Añadir jugador a la sala de juego.
 *     description: Añadir jugador a la sala de juego. Se necesita un body.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomId:
 *                 type: integer
 *                 description: ID de la sala de juego a actualizar.
 *                 example: 1
 *               userId:
 *                 type: integer
 *                 description: ID del usuario a añadir a la sala de juego.
 *                 example: 1
 *     responses:
 *       200:
 *         description: Jugador añadido a la sala de juego.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID de la sala de juego.
 *                   example: 1
 *                 name:
 *                   type: string
 *                   description: Nombre de la sala de juego.
 *                   example: Sala de juego 1
 *                 limit:
 *                   type: integer
 *                   description: Límite de jugadores de la sala de juego.
 *                   example: 2
 *                 players:
 *                   type: array
 *                   description: Jugadores dentro de la sala de juego.
 *                   example: {}
 */
router.post('/add-player', roomController.addPlayer);

/**
 * @swagger
 * /api/rooms/remove-player:
 *   post:
 *     tags:
 *       - Salas de juego
 *     summary: Eliminar jugador de la sala de juego.
 *     description: Eliminar jugador de la sala de juego. Se necesita un body.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomId:
 *                 type: integer
 *                 description: ID de la sala de juego a actualizar.
 *                 example: 1
 *               userId:
 *                 type: integer
 *                 description: ID del usuario a eliminar de la sala de juego.
 *                 example: 1
 *     responses:
 *       200:
 *         description: Jugador eliminado de la sala de juego.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID de la sala de juego.
 *                   example: 1
 *                 name:
 *                   type: string
 *                   description: Nombre de la sala de juego.
 *                   example: Sala de juego 1
 *                 limit:
 *                   type: integer
 *                   description: Límite de jugadores de la sala de juego.
 *                   example: 2
 *                 players:
 *                   type: array
 *                   description: Jugadores dentro de la sala de juego.
 *                   example: {}
 */
router.post('/remove-player', roomController.removePlayer);

module.exports = router;
