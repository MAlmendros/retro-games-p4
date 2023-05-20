const { users } = require("../data/user.data");

/**
 * GET - Users ('/api/users')
 * @param {*} request 
 * @param {*} response 
 */
const getUsers = async(request, response) => {
    response.status(200).json(users);
}


/**
 * GET - User by ID ('/api/users/:id')
 * @param {*} request 
 * @param {*} response 
 */
const getUser = async(request, response) => {
    const id = request.params.id;

    const selectedUser = users.find((user) => user.id === parseInt(id));

    if (selectedUser) {
        response.status(200).json(selectedUser);
    } else {
        response
            .status(404)
            .json({
                status: 404,
                message: `El usuario no existe.`
            });
    }
}

/**
 * POST - Create user ('/api/users')
 * @param {*} request 
 * @param {*} response 
 */
const createUser = async(request, response) => {
    let newUser = request.body;

    let selectedUser = users.find((user) => user.email === newUser.email);

    if (selectedUser) {
        response
            .status(404)
            .json({
                status: 404,
                message: `Este correo electrónico ya está registrado.`
            });
    } else if (!newUser || !newUser.avatar || !newUser.email || !newUser.username || !newUser.password) {
        response
            .status(404)
            .json({
                status: 404,
                message: `Rellene todos los datos.`
            });
    } else {
        const ids = users.map((user) => user.id);
        let id = Math.max(...ids) + 1;

        newUser = {
            id,
            ...newUser,
            room: {}
        };
        users.push(newUser);

        response.status(200).json(newUser);
    }
}

/**
 * PUT - Update user ('/api/users/:id')
 * @param {*} request 
 * @param {*} response 
 */
const updateUser = async(request, response) => {
    const userId = request.params.id;
    const updateValues = request.body;

    let selectedUser = users.find((user) => user.id === parseInt(userId));

    if (!selectedUser) {
        response
            .status(404)
            .json({
                status: 404,
                message: `El usuario que desea actualizar no existe`,
            })
    } else {
        let updateUser = {
            id: selectedUser.id,
            ...updateValues,
            room: {},
        };

        const iUser = users.findIndex((user) => user.id === selectedUser.id);
        users[iUser] = updateUser;

        response.status(200).json(updateUser);
    }
}

/**
 * DELETE - Update user ('/api/users/:id')
 * @param {*} request 
 * @param {*} response 
 */
const deleteUser = async(request, response) => {
    const userId = request.params.id;

    let selectedUser = users.find((user) => user.id === parseInt(userId));

    if (!selectedUser) {
        response
            .status(404)
            .json({
                status: 404,
                message: `El usuario que desea eliminar no existe`,
            })
    } else {
        const iUser = users.findIndex((user) => user.id === selectedUser.id);
        users.splice(iUser, 1);

        response.status(200).json(selectedUser);
    }
}

/**
 * POST - Login ('/api/users/login')
 * @param {*} request 
 * @param {*} response 
 */
const login = async(request, response) => {
    const userData = request.body;

    if (!userData || !userData.email || !userData.password) {
        response
            .status(404)
            .json({
                status: 404,
                message: `Rellene todos los datos.`
            });
    } else {
        let selectedUser = users.find((user) => user.email === userData.email && user.password === userData.password);

        if (!selectedUser) {
            response
                .status(404)
                .json({
                    status: 404,
                    message: `El usuario con correo electrónico "${userData.email}" no existe o la contraseña es incorrecta.`
                });
        } else {
            response.status(200).json(selectedUser);
        }
    }
}

////////// Basic Users API Rest //////////

module.exports.getUsers = getUsers;
module.exports.getUser = getUser;
module.exports.createUser = createUser;
module.exports.updateUser = updateUser;
module.exports.deleteUser = deleteUser;

////////// Extended Users API Rest //////////

module.exports.login = login;
