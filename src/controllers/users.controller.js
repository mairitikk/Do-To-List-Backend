//Importamos el model de users
const UsersModel = require("../models/user.model");
//Importamos la librería para encriptar la clave
const bcrypt = require("bcryptjs");
// Importamos el modulo del token
const { createToken } = require("../helpers/utils");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Insert the user
    const [result] = await UsersModel.insertUserSimple({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    return res.status(500).json({ fatal: error.message });
  }
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
      return res.json({ fatal: "Error en email y/o password" });
    }

    // ¿Coincide la password con la de la BD?
    const equals = bcrypt.compareSync(password, user[0].password);
    if (!equals) {
      return res.json({ fatal: "Error en email y/o contraseña" });
    }

    //aquí tendríamos que redirigir a alguna pag que ya no sea libre
    res.json({
      token: createToken(user[0]),
    });
  } catch (error) {
    res.json({ fatal: error.message });
  }
};

// Activar, desactivar y dar de baja a usuarios
const updateUserStatusById = async (req, res) => {
  const { id, status } = req.body; // Recuperamos id y status del front
  try {
    // Validar que el status number sea correcto
    if (typeof status !== "number" || ![1, 2, 3].includes(status)) {
      return res.json({ fatal: "Número de status no válido" });
    }

    // Hacer el update a la bbdd
    const result = await UsersModel.updateStatusById(id, status);

    // Obtener respuestas
    res.json({ result });
  } catch (error) {
    return res.json({ fatal: "Internal Server Error" });
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
      teachers: teachers,
    });
  } catch (error) {
    res.json({ fatal: error.message });
  }
};

module.exports = { register, login, updateUserStatusById, getAllUsers }; // , location }
