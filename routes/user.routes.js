const userController = require('../controllers/user.controller');

var express = require('express');
var router = express.Router();

///////// Basic Users API Rest /////////

/**
 * @swagger
 * /api/users:
 *   post:
 *     tags:
 *       - Usuarios
 *     summary: Crear un usuario.
 *     description: Crear un usuario. Se necesita un body.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nombre del usuario.
 *                 example: Usuario 5
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario.
 *                 example: 123456
 *               avatar:
 *                 type: string
 *                 description: Avatar del usuario.
 *                 example: avatar-1
 *     responses:
 *       200:
 *         description: Usuario creado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID del usuario.
 *                   example: 1
 *                 username:
 *                   type: string
 *                   description: Nombre del usuario.
 *                   example: Marian Almendros
 *                 password:
 *                   type: string
 *                   description: Contraseña del usuario.
 *                   example: 123456
 *                 avatar:
 *                   type: string
 *                   description: Avatar del usuario.
 *                   example: avatar-3
 *                 room:
 *                   type: object
 *                   description: Sala de juego actual del usuario.
 *                   example: {}
 */
router.post('/', userController.createUser);

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *       - Usuarios
 *     summary: Listado de usuarios.
 *     description: Listado de usuarios. No necesita de ningún parámetro.
 *     responses:
 *       200:
 *         description: Listado de usuarios.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID del usuario.
 *                     example: 1
 *                   username:
 *                     type: string
 *                     description: Nombre del usuario.
 *                     example: Marian Almendros
 *                   password:
 *                     type: string
 *                     description: Contraseña del usuario.
 *                     example: 123456
 *                   avatar:
 *                     type: string
 *                     description: Avatar del usuario.
 *                     example: avatar-3
 *                   room:
 *                     type: object
 *                     description: Sala de juego actual del usuario.
 *                     example: {}
 */
router.get('/', userController.getUsers);

/**
 * @swagger
 * /api/users/:id:
 *   get:
 *     tags:
 *       - Usuarios
 *     summary: Información de un usuario.
 *     description: Información de un usuario. Se necesita un ID como parámetro.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario que se busca.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Información de un usuario.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID del usuario.
 *                   example: 1
 *                 username:
 *                   type: string
 *                   description: Nombre del usuario.
 *                   example: Marian Almendros
 *                 password:
 *                   type: string
 *                   description: Contraseña del usuario.
 *                   example: 123456
 *                 avatar:
 *                   type: string
 *                   description: Avatar del usuario.
 *                   example: avatar-3
 *                 room:
 *                   type: object
 *                   description: Sala de juego actual del usuario.
 *                   example: {}
 */
router.get('/:id', userController.getUser);

/**
 * @swagger
 * /api/users/:id:
 *   put:
 *     tags:
 *       - Usuarios
 *     summary: Actualizar un usuario.
 *     description: Actualizar un usuario. Se necesita un ID como parámetro y un body.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a actualizar.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nombre del usuario.
 *                 example: Usuario 5
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario.
 *                 example: 123456
 *               avatar:
 *                 type: string
 *                 description: Avatar del usuario.
 *                 example: avatar-1
 *     responses:
 *       200:
 *         description: Usuario actualizado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID del usuario.
 *                   example: 1
 *                 username:
 *                   type: string
 *                   description: Nombre del usuario.
 *                   example: Marian Almendros
 *                 password:
 *                   type: string
 *                   description: Contraseña del usuario.
 *                   example: 123456
 *                 avatar:
 *                   type: string
 *                   description: Avatar del usuario.
 *                   example: avatar-3
 *                 room:
 *                   type: object
 *                   description: Sala de juego actual del usuario.
 *                   example: {}
 */
router.put('/:id', userController.updateUser);

/**
 * @swagger
 * /api/users/:id:
 *   delete:
 *     tags:
 *       - Usuarios
 *     summary: Borrar un usuario.
 *     description: Borrar un usuario. Se necesita un ID como parámetro.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a borrar.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario borrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID del usuario.
 *                   example: 1
 *                 username:
 *                   type: string
 *                   description: Nombre del usuario.
 *                   example: Marian Almendros
 *                 password:
 *                   type: string
 *                   description: Contraseña del usuario.
 *                   example: 123456
 *                 avatar:
 *                   type: string
 *                   description: Avatar del usuario.
 *                   example: avatar-3
 *                 room:
 *                   type: object
 *                   description: Sala de juego actual del usuario.
 *                   example: {}
 */
router.delete('/:id', userController.deleteUser);

///////// Extended Users API Rest /////////

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     tags:
 *       - Usuarios
 *     summary: Iniciar sesión.
 *     description: Iniciar sesión. Se necesita un body.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario.
 *                 example: usuario@uoc.edu
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario.
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Inicio de sesión.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID del usuario.
 *                   example: 1
 *                 username:
 *                   type: string
 *                   description: Nombre del usuario.
 *                   example: Marian Almendros
 *                 password:
 *                   type: string
 *                   description: Contraseña del usuario.
 *                   example: 123456
 *                 avatar:
 *                   type: string
 *                   description: Avatar del usuario.
 *                   example: avatar-3
 *                 room:
 *                   type: object
 *                   description: Sala de juego actual del usuario.
 *                   example: {}
 */
router.post('/login', userController.login);

module.exports = router;
