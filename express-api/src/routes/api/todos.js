const router = require('express').Router();
const TodoController = require('../../controllers/todos.controller');

// Peticiones GET
router.get('/', TodoController.getAlltodos);
router.get('/pagination/:page/:perPage', TodoController.getAlltodosPagination);
router.get('/:todoId', TodoController.gettodoById);
router.get('/all/:userId', TodoController.gettodoByIdUserAllData);
router.get('/:todoState', TodoController.getAlltodosByState);
router.get('/user/:userId', TodoController.gettodoByUserId);

//Peticiones POST
router.post('/', TodoController.createtodo);

//Peticiones PUT
router.put('/:todoId', TodoController.updatetodo);

//Peticiones DELETE
router.delete('/:todoId', TodoController.deletetodo);

module.exports = router;