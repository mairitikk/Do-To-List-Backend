//const { checkToken } = require('../middlewares/auth.middleware');

const router = require("express").Router();

// Rutas
router.use("/todo", require("./api/todos"));

router.use("/user", require("./api/users"));

module.exports = router;
