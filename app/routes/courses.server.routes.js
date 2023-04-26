const students = require('../controllers/students.server.controller');
const courses = require('../controllers/courses.server.controller');
//
module.exports = function (app) {
    app.route('/courses')
        .get(courses.list)
    //
    //app.route('/courses/:courseId')
    //    .get(courses.read);
    //
    //app.param('couseId', courses.courseByID);
}