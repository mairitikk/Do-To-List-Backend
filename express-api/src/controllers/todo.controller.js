const TeacherModel = require('../models/');

const getAllTeachers = async (req, res) => {
    /**#swagger.tags = ['Teachers']
       #swagger.description = 'Endpoint to get all Teachers.'
    */
    try {
        const [result] = await TeacherModel.selectAllTeachers();
        res.json(result);
    } catch (error) {
        res.json({ fatal: error.message });
    }
};


const getAllTeachersPagination = async (req, res) => {
    /**#swagger.tags = ['Teachers']
       #swagger.description = 'Endpoint to get all Teachers.'
    */
    try {

        const { page, perPage } = req.params;

        // contamos el total de profes
        const [resultCount] = await TeacherModel.countAllTeachers();

        const [result] = await TeacherModel.selectAllTeachersLimit(parseInt(page), parseInt(perPage));
        res.json({
            total_pages: parseInt(resultCount[0].count / parseInt(perPage)),
            results: result
        });
    } catch (error) {
        res.json({ fatal: error.message });
    }
};

const getAllTeachersByState = async (req, res) => {
    /**#swagger.tags = ['Teachers']
       #swagger.description = 'Endpoint to get all Teachers by state.'
    */
    try {
        const { teacherState } = req.params;
        const [result] = await TeacherModel.selectAllTeachersByState(teacherState);
        res.json(result);
    } catch (error) {
        res.json({ fatal: error.message });
    }
};

const getTeacherById = async (req, res) => {
    /**#swagger.tags = ['Teachers']
       #swagger.description = 'Endpoint to get a Teacher.'
    */
    try {
        const { teacherId } = req.params;
        const [result] = await TeacherModel.selectTeacherById(teacherId);
        res.json(result[0]);
    } catch (error) {
        res.json({ fatal: error.message });
    }
};

const getTeacherByIdUserAllData = async (req, res) => {
    /**#swagger.tags = ['Teachers']
       #swagger.description = 'Endpoint to get a Teacher.'
    */
    try {
        const { userId } = req.params;
        const [result] = await TeacherModel.selectTeacherByIdUserAllData(userId);
        console.log(result)
        res.json(result[0]);
    } catch (error) {
        res.json({ fatal: error.message });
    }
};

const getTeacherByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const [result] = await TeacherModel.selectTeacherByUserId(userId);
        res.json(result);
    } catch (error) {
        res.json({ fatal: error.message });
    }
}

const createTeacher = async (req, res) => {
    // #swagger.tags = ['Teachers']
    // #swagger.description = 'Endpoint to create a Teacher.'
    /* #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Teacher information.',
            required: true,
            schema: { $ref: "#/definitions/Teachers" }
    } */
    try {
        const [result] = await TeacherModel.insertTeacher(req.body);
        const [teacher] = await TeacherModel.selectTeacherById(result.insertId);
        res.json(teacher[0]);
    } catch (error) {
        res.json({ fatal: error.message });
    }
};

const updateTeacher = async (req, res) => {
    // #swagger.tags = ['Teachers']
    // #swagger.description = 'Endpoint to update a Teacher.'
    /* #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Teacher information.',
            required: true,
            schema: { $ref: "#/definitions/Teachers" }
    } */
    try {
        const { teacherId } = req.params;
        const result = await TeacherModel.updateFullTeacherById(teacherId, req.body);
        /*  if (result.changedRows == 0) {
             res.status(404).send('Teacher does not change ');
         } else {
            res.status(200).send("Teacher modified successfuly");
         } */
        res.json(result)
    } catch (error) {
        res.json({ fatal: error.message });
    }
};

const deleteTeacher = async (req, res) => {
    /**#swagger.tags = ['Teachers']
       #swagger.description = 'Endpoint to delete a Teacher.'
    */
    try {
        const { teacherId } = req.params;
        const [result] = await TeacherModel.deleteTeacherById(teacherId);

        if (result.affectedRows == 0) {
            res.status(404).send('Teacher not found');
        } else {
            res.status(200).send("Teacher deleted successfuly");
        }
    } catch (error) {
        res.json({ fatal: error.message });
    }
};

module.exports = { getAllTeachers, getTeacherById, createTeacher, updateTeacher, deleteTeacher, getAllTeachersByState, getAllTeachersPagination, getTeacherByIdUserAllData, getTeacherByUserId 