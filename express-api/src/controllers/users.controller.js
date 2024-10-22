//Importamos el model de users
const UsersModel = require('../models/user.model');
// importamos el location model
const LocationModel = require('../models/location.model');
//importamos el teacher model
const TeacherModel = require('../models/teacher.model');
//importar el subject model
const SubjectModel = require('../models/subject.model');
//Importamos la librería para encriptar la clave
const bcrypt = require("bcryptjs");
// Importamos el modulo del token
const { createToken } = require('../helpers/utils');
const jsonwebtoken = require('jsonwebtoken');

var nodemailer = require('nodemailer');
const { sendEmail } = require('../helpers/mail')

// Modelo 1 de register con todos los datos
// En este primer modelo los 3 formularios son enviados y 
// debe generarse en front el envío de todos como un objeto 
// los datos del user en userForm, 
// los datos del teacher en teacherForm y 
// los datos de location el locationForm
const register = async (req, res) => {
    // #swagger.tags = ['Users']
    // #swagger.description = 'Endpoint to register a Users.'
    /* #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Users information.',
            required: true,
            schema: { $ref: "#/definitions/Users" }
    } */
    try {
        //primero se encripta la password
        req.body.userForm.password = bcrypt.hashSync(req.body.userForm.password, 10);

        //insertar primero location porque no depende de ninguna tabla
        const [location] = await LocationModel.insertLocationNoDuplicate(req.body.locationForm);

        //tomar id del location y asignarselo al user
        req.body.userForm.location_id = location[0].id;

        // insertamos el user
        const [resultUser] = await UsersModel.insertUser(req.body.userForm);
        const [user] = await UsersModel.selectUserByIdWhithOutLocation(resultUser.insertId);

        // Elimino el teacherSwitch porque creo que es mejor controlar 
        // el tipo de usuario con el rol, porque puede pasar que 
        // teacherSwitch es teacher pero el rol_id que se recibe es de estudiante
        // y eso seria incorrecto. Tal como lo tienes actualmente en tu ejemplo
        // TODO - checkear el rol con la base de datos y no con el numero 1 (estudiante)
        if (req.body.userForm.role_id === 1) {
            return res.json({
                userForm: user[0],
                locationForm: location[0]
            });
        };

        // si es un teacher, continuamos
        req.body.teacherForm.user_id = user[0].id;
        const [resulTeacher] = await TeacherModel.insertTeacher(req.body.teacherForm);
        const [teacher] = await TeacherModel.selectTeacherOnlyTableById(resulTeacher.insertId);

        // insertar Materias
        req.body.subjectForm.teacher_id = resulTeacher.insertId;
        const [resultSubject] = await SubjectModel.insertSubject(req.body.subjectForm);

        //enviar email a los admins
        const [admins] = await UsersModel.selectAllUsers(3);
        let toBcc = 'teacherapptfm@outlook.es';

        if (admins.length > 0) {
            admins.forEach((admin) => {
                toBcc = toBcc + ',' + admin.email;
            });
        }
        try {
            const info = await sendEmail(toBcc, "msA");

            return res.status(201).json({
                message: "You should receive an email",
                info: info.messageId,
                //preview: nodemailer.getTestMessageUrl(info),
                userForm: user[0],
                teacherForm: teacher[0],
                locationForm: location[0]
            });
        } catch (error) {
            return res.status(201).json({
                message: "Teacher has been added but there is an error.",
                fatal: error.message
            });
        }
        /* res.json({
            user: user[0],
            teacher: teacher[0],
            location: location[0]
        }); */

    } catch (error) {
        return res.json({ fatal: error.message });
    };
};

//Elaboramos el login
const login = async (req, res) => {
    // #swagger.tags = ['Users']
    // #swagger.description = 'Endpoint to register a Users.'
    /* #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Users information.',
            required: true,
            schema: { $ref: "#/definitions/UsersLogin" }
    } */
    try {
        const { email, password } = req.body;

        //hay que hacer el find para buscar en la bd el email ¿Tenemos el email en la base de datos?
        const [user] = await UsersModel.selectUserByEmail(email);

        if (user.length === 0) {
            return res.json({ fatal: 'Error en email y/o password' })
        };

        // ¿Coincide la password con la de la BD?
        const equals = bcrypt.compareSync(password, user[0].password);
        if (!equals) {
            return res.json({ fatal: "Error en email y/o contraseña" });
        };

        //aquí tendríamos que redirigir a alguna pag que ya no sea libre
        res.json({
            token: createToken(user[0])
        });
    } catch (error) {
        res.json({ fatal: error.message });
    };


};

// Activar, desactivar y dar de baja a usuarios
const updateUserStatusById = async (req, res) => {
    const { id, status } = req.body; // Recuperamos id y status del front
    try {
        // Validar que el status number sea correcto
        if (typeof status !== 'number' || ![1, 2, 3].includes(status)) {
            return res.json({ fatal: 'Número de status no válido' });
        };

        // Hacer el update a la bbdd
        const result = await UsersModel.updateStatusById(id, status);

        // Obtener respuestas
        res.json({ result });
    } catch (error) {
        return res.json({ fatal: 'Internal Server Error' });
    }
};

const getAllUsers = async (req, res) => {
    /**#swagger.tags = ['Users']
       #swagger.description = 'Endpoint to get all Users.'
    */
    try {
        const [students] = await UsersModel.selectAllUsers(1);
        const [teachers] = await UsersModel.selectAllUsers(2);

        return res.json({
            students: students,
            teachers: teachers
        });

    } catch (error) {
        res.json({ fatal: error.message });
    }
};


module.exports = { register, login, updateUserStatusById, getAllUsers } // , location }