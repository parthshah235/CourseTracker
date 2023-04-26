//Load the 'students' controller
var students = require('../controllers/students.server.controller');
var express = require('express');
var router = express.Router();
// Define the routes module' method
module.exports = function (app) {
    // handle a get request made to /students path
    // and list students when /students link is selected
    //app.get("/students",students.requiresLogin,students.list); // go to http://localhost:3000/students
    app.get("/students", students.list);
    app.post('/student/create', students.create);
    
    //
    // Set up the 'students' parameterized routes
    app.route('/student/:studentId')
    .get(students.read)
    .put(students.update)
    //.delete(students.delete)
    // Set up the 'studentId parameter middleware
    // All param callbacks will be called before any handler of
    // any route in which the param occurs, and they will each
    // be called only once in a request - response cycle,
    // even if the parameter is matched in multiple routes
    app.param('studentId', students.studentByID);
    // authenticate student
    app.post('/login', students.authenticate);
    //app.get('/signout', student.signout);
    app.get('/read_cookie', students.isSignedIn);
    
    // path to a protected page
    //app.get('/welcome',students.welcome);
    app.route('/students/:courseCode')
    .get(students.studentsByCourseCode)
    app.param('courseCode', students.studentsByCourseCode)
};