// Requerimos el modelo para las comprobaciones en las bases de datos.
const TeachersModel = require('../models/teacher.model');
// El primer validador sería chequear si ese profesor existe antes de realizar un get, un push o un delete a través del id.
const checkTeacherById = async (req, res, next) => {
    //primero nos traemos el id del user
    const { teacherId } = req.params;
    try {
        //buscamos el estudiante por su id
        const [teacher] = await TeachersModel.selectTeacherById(teacherId);
        // Generamos el condicional para la respuesta del validador
        if (!teacher) {
            return res.json({ message: 'El profesor no existe' });
        } else {
            next();
        };
    } catch (error) {
        res.json({ fatal: error.message });
    };
};



module.exports = { checkTeacherById };