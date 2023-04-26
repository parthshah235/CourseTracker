// Load the module dependencies
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { courseSchema, courseModel } = require('./course.server.model');
const saltRounds = 10;
//Define a schema
const Schema = mongoose.Schema;

//Define a new 'StudentSchema'
var StudentSchema = new Schema({
    studentNumber: Number,
    password: {
		type: String,
		// Validate the 'password' value length
		validate: [
			(password) => password && password.length > 6,
			'Password should be at least 7 characters'
		]
	},
    firstName: String,
    lastName: String,
    address: String,
    city: String,
    phoneNumber: Number,
    email: {
		type: String,
		// Validate the email format
		match: [/.+\@.+\..+/, "Please fill a valid email address"]
	},
    program: String,
    enrolledCourses: [courseSchema]
});

//Use a pre-save middleware to hash the password
// before saving it into the database
StudentSchema.pre('save', function(next){
    //hash the password before saving it
    this.password = bcrypt.hashSync(this.password, saltRounds);
    next();
})

// Create an instance method for authenticating student
StudentSchema.methods.authenticate = function(password) {
    //compare the hashed password of the database
    //with the hashed version of the password the user enters
    return this.password === bcrypt.hashSync(password, saltRounds);
};

// Configure the 'StudentSchema' to use getters and virtuals when transforming to JSON
StudentSchema.set('toJSON', {
    getters: true,
    virtuals: true
});

// Create the 'Student' model out of the 'StudentSchema'
mongoose.model('Student', StudentSchema);