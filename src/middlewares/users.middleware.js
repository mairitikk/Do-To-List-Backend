// // Requerimos el modelo para las comprobaciones en las bases de datos.
const UsersModel = require('../models/teacher.model');

const checkUserById = async (req, res, next) => {
    //primero nos traemos el id del user
    const { userId } = req.params;
    try {

        const [user] = await UsersModel.selectStudentById(userId);

        if (!user) {
            return res.json({ message: 'El usuario no existe' });
        } else {
            next();
        };
    } catch (error) {
        res.json({ fatal: error.message });
    };
};



module.exports = { checkUserById };