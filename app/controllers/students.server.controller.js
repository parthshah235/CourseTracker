// Load the module dependencies
const Student = require("mongoose").model("Student");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const config = require("../../config/config");
const jwtExpirySeconds = 300;
const jwtKey = config.secretKey;

//
// Create a new error handling controller method
const getErrorMessage = function (err) {
  // Define the error message variable
  var message = "";

  // If an internal MongoDB error occurs get the error message
  if (err.code) {
    switch (err.code) {
      // If a unique index error occurs set the message error
      case 11000:
      case 11001:
        message = "Email already exists";
        break;
      // If a general error occurs set the message error
      default:
        message = "Something went wrong";
    }
  } else {
    // Grab the first error message from a list of possible errors
    for (const errName in err.errors) {
      if (err.errors[errName].message) message = err.errors[errName].message;
    }
  }

  // Return the message error
  return message;
};

// Create a new student
exports.create = function (req, res, next) {
  // Create a new instance of the 'Student' Mongoose model
  var student = new Student(req.body); //get data from React form
  console.log("body: " + req.body.firstName);

  // Use the 'Student' instance's 'save' method to save a new student document
  student.save(function (err) {
    if (err) {
      // Call the next middleware with an error message
      console.log('create error -> ', err);
      return next(err);
    } else {
      // Use the 'response' object to send a JSON response
      res.json(student);
    }
  });
};
//
// Returns all students
exports.list = function (req, res, next) {
  // Use the 'Student' instance's 'find' method to retrieve a new user document
  // http://localhost:5000/students
  Student.find({}, function (err, students) {
    if (err) {
      return next(err);
    } else {
      res.json(students);
    }
  });
};
//
//'read' controller method to display a user
exports.read = function (req, res) {
  // Use the 'response' object to send a JSON response
  res.json(req.student);
};
//
// 'studentByID' controller method to find a student by its id
exports.studentByID = function (req, res, next, id) {
  // Use the 'Student' static 'findOne' method to retrieve a specific student
  Student.findOne(
    {
      _id: id,
    },
    (err, student) => {
      if (err) {
        // Call the next middleware with an error message
        return next(err);
      } else {
        // Set the 'req.student' property
        req.student = student;
        console.log(student);
        // Call the next middleware
        next();
      }
    }
  );
};
//
// 'studentsByCourseCode' controller method to find students by CourseCode
exports.studentsByCourseCode = function (req, res, next, courseCode) {
console.log("getting studentsbycoursecode");
  Student.find({ "enrolledCourses.courseCode": courseCode }, (err, student) => {
    if (err) {
      return next(err);
    } else {
      // Set the 'req.student' property
      //req.student = student;
      res.json(student);
      console.log(student);
      // Call the next middleware
      next();
    }
  });
};

// update student
//update a user by id
exports.update = function(req, res, next) {
  Student.findByIdAndUpdate(req.student.id, req.body, { new: true }, function (err, student) {
    if (err) {
      console.log(err);
      return next(err);
    }
    res.json(student);
  });
};

exports.authenticate = function(req, res, next) {
  console.log(req.body)
	const studentEmail = req.body.auth.email;
	const password  = req.body.auth.password;
	console.log(password)
	console.log(studentEmail)

  // find the student with the given email
  Student.findOne({email: studentEmail}, (err, student) => {
    if (err) {
      return next(err);
    } else {
      console.log('student response -> ', student);
      if (student == null) {
        return res.json({status:"error", message: "Invalid username/password!!!", data: null});
      }
      // compare passwords
      if(bcrypt.compareSync(password, student.password)) {
        // Create a new token with the user id in the payload
  			// and which expires 300 seconds after issue
        const token = jwt.sign({ id: student._id, email: student.email }, jwtKey, 
          {algorithm: 'HS256', expiresIn: jwtExpirySeconds });
        console.log('token:', token)

        // set the cookie as the token string, with a similar max age as the token
				// here, the max age is in milliseconds
        res.cookie('token', token, { maxAge: jwtExpirySeconds * 1000,httpOnly: true});
        res.status(200).send({ status: "success", data: student });

        req.student = student;
        // call the next middleware
        next();
      } else {
        res.json({status:"error", message: "Invalid username/password!!!", data: null});
      }
    }
  });
};

exports.isSignedIn = (req, res) => {
  // Obtain the session token from the requests cookies,
	// which come with every request
  console.log('cookies request -', req.cookies);
	const token = req.cookies.token
	console.log(token)

  // if the cookie is not set, return 'auth'
	if (!token) {
	  return res.send({ data: null }).end();
	}

  var payload;
  try {
	  // Parse the JWT string and store the result in `payload`.
	  // Note that we are passing the key in this method as well. This method will throw an error
	  // if the token is invalid (if it has expired according to the expiry time we set on sign in),
	  // or if the signature does not match
	  payload = jwt.verify(token, jwtKey)
	} catch (e) {
	  if (e instanceof jwt.JsonWebTokenError) {
		// the JWT is unauthorized, return a 401 error
		return res.status(401).end()
	  }
	  // otherwise, return a bad request error
	  return res.status(400).end()
	}
  
	// Finally, token is ok, return the username given in the token
	res.status(200).send({ data: payload });
};
