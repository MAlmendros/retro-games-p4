const { User } = require('../models/user.model');
const { users } = require('../data/user.data');

const createUser = async(request, response) => {
    const body = request.body;

    const selectedUser = await User.findOne({ email: body.email });

    if (selectedUser) {
        response
            .status(404)
            .json({
                status: 404,
                message: `Este correo electrónico ya está registrado.`
            });
    } else if (!body || !body.avatar || !body.email || !body.username || !body.password) {
        response
            .status(404)
            .json({
                status: 404,
                message: `Rellene todos los datos.`
            });
    } else {
        const users = await User.find();
        const ids = users.map((user) => user.id);
        const id = ids.length ? Math.max(...ids) + 1 : 1;
        
        try {
            let user = new User({
                id: id ? id : 1,
                username: body.username,
                email: body.email,
                password: body.password,
                avatar: body.avatar,
                room: null
            });

            await user.save();
            response.status(200).json(user);
        } catch (error) {
            response
                .status(404)
                .json({ status: 404, message: `Ha ocurrido un error.` });
        }
    }
}

const getUsers = async(request, response) => {
    try {
        const users = await User.find();
        response.status(200).json(users);
    } catch (error) {
        response
            .status(404)
            .json({ status: 404, message: `Ha ocurrido un error.` });
    }
}

const getUser = async(request, response) => {
    const id = request.params.id;

    try {
        const user = await User.findOne({ id });

        if (!user) {
            response
                .status(404)
                .json({ status: 404, message: `El usuario no existe.` });
        } else {
            response.status(200).json(user);
        }
    } catch (error) {
        response
            .status(404)
            .json({ status: 404, message: `Ha ocurrido un error.` });
    }
}

const updateUser = async(request, response) => {
    const id = request.params.id;
    let body = request.body;

    const user = await User.findOne({ id });

    if (!user) {
        response
            .status(404)
            .json({
                status: 404,
                message: `El usuario que desea actualizar no existe`,
            })
    } else if (!body || !body.avatar || !body.email || !body.username || !body.password) {
        response
            .status(404)
            .json({
                status: 404,
                message: `Falta algún dato para poder actualizar el usuario.`
            });
    } else {
        try {
            const updateValues = {
                id,
                ...body,
                room: null,
            };

            const updateUser = await User.findOneAndUpdate({ id }, updateValues, { new: true });
            response.status(200).json(updateUser);
        } catch (error) {
            response
                .status(404)
                .json({ status: 404, message: `Ha ocurrido un error.` });
        }
    }
}

const deleteUser = async(request, response) => {
    const id = request.params.id;

    const user = await User.findOne({ id });

    if (!user) {
        response
            .status(404)
            .json({
                status: 404,
                message: `El usuario que desea eliminar no existe`,
            })
    } else {
        try {
            await User.deleteOne({ id });
            response.status(200).json(user);
        } catch (error) {
            response
                .status(404)
                .json({ status: 404, message: `Ha ocurrido un error.` });
        }
    }
}

const login = async(request, response) => {
    const body = request.body;

    if (!body || !body.email || !body.password) {
        response
            .status(404)
            .json({
                status: 404,
                message: `Rellene todos los datos.`
            });
    } else {
        const user = await User.findOne({ email: body.email, password: body.password });

        if (!user) {
            response
                .status(404)
                .json({
                    status: 404,
                    message: `El usuario con correo electrónico "${body.email}" no existe o la contraseña es incorrecta.`
                });
        } else {
            try {
                response.status(200).json(user);
            } catch (error) {
                response
                    .status(404)
                    .json({ status: 404, message: `Ha ocurrido un error.` });
            }
        }
    }
}

////////// Basic Users API Rest //////////
module.exports.createUser = createUser;
module.exports.getUsers = getUsers;
module.exports.getUser = getUser;
module.exports.updateUser = updateUser;
module.exports.deleteUser = deleteUser;

////////// Extended Users API Rest //////////
module.exports.login = login;
