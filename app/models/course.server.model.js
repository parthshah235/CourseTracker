const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CourseSchema = new Schema({
    courseCode: String,
    courseName: String,
    section: String,
    semester: String
});
mongoose.model('Course', CourseSchema);

module.exports.courseSchema = CourseSchema;
module.exports.courseModel = mongoose.model('Course', CourseSchema)
