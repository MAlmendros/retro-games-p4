const { Room } = require('../models/room.model');
const { User } = require('../models/user.model');

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
                id,
                username: body.username,
                email: body.email,
                password: body.password,
                avatar: body.avatar,
                room: null,
                roomIndex: -1
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
        let returnUsers = [];

        for (const user of users) {
            if (user.room) {
                const room = await Room.findOne({ id: user.room });
                returnUsers.push({ ...user._doc, room });
            } else {
                returnUsers.push({ ...user._doc });
            }
        }

        response.status(200).json(returnUsers);
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
            if (user.room) {
                const room = await Room.findOne({ id: user.room });

                response.status(200).json({ ...user._doc, room });
            } else {
                response.status(200).json(user);
            }
        }
    } catch (error) {
        response
            .status(404)
            .json({ status: 404, message: `Ha ocurrido un error.` });
    }
}

const updateUser = async(request, response) => {
    const id = request.params.id;
    const body = request.body;

    const user = await User.findOne({ id });

    if (!user) {
        response
            .status(404)
            .json({
                status: 404,
                message: `El usuario que desea actualizar no existe.`,
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
            const updateValues = { id, ...body };
            const updateUser = await User.findOneAndUpdate({ id }, updateValues, { new: true });
            
            if (updateUser.room) {
                const room = await Room.findOne({ id: updateUser.room });

                response.status(200).json({ ...updateUser._doc, room });
            } else {
                response.status(200).json(updateUser);
            }
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
                message: `El usuario que desea eliminar no existe.`,
            })
    } else {
        try {
            let deleteUser = { ...user._doc };

            if (user.room) {
                const room = await Room.findOne({ id: user.room });
                deleteUser.room = room;
            }

            await User.deleteOne({ id });
            
            response.status(200).json(deleteUser);
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
        try {
            const user = await User.findOne({ email: body.email, password: body.password });

            if (!user) {
                response
                    .status(404)
                    .json({
                        status: 404,
                        message: `El usuario con correo electrónico "${body.email}" no existe o la contraseña es incorrecta.`
                    });
            } else {
                if (user.room) {
                    const room = await Room.findOne({ id: user.room });

                    response.status(200).json({ ...user._doc, room });
                } else {
                    response.status(200).json(user);
                }
            }
        } catch (error) {
            response
                .status(404)
                .json({ status: 404, message: `Ha ocurrido un error.` });
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
