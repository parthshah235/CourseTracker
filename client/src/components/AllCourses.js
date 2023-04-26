import React, { useEffect, useState } from "react";
import { Container, Grid } from "@mui/material";

import Typography from "@mui/material/Typography";
import axios from "axios";
import CourseCard from "./AllCoursesCard";
import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { DialogActions } from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useAuth } from "../auth";


/*const useStyles = makeStyles((theme) => {
  return {
    courseListHeading: {
      paddingBottom: "5px",
    },
  };
});*/

export default function AllCourses({showSnackBar}) {
  //const classes = useStyles();
  const [courses, setCourses] = useState([]);
  const apiUrl = "http://localhost:5000/student/";
  const courseApiUrl = "http://localhost:5000/courses";

  const { authTokens } = useAuth();
  const [studentId, setStudentId] = useState(authTokens.data.id);
  const [course, setCourse] = useState(null);
  const [student, setStudent] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [section, setSection] = useState('');
  const [semester, setSemester] = useState('');

  const navigate = useNavigate();

  // for Dialog Form
  const [openEnrollDialog, setopenEnrollDialog] = useState(false);

  // const handleClickOpen = () => {
  //   setopenEnrollDialog(true);
  // };

  const handleEnrollClose = () => {
    setopenEnrollDialog(false);
  };

  // end of - for Dialog Form

  const handleAction = (course, action) => {
    setCourse(course);
    console.log("Do ", action);
    console.log("On course ", course);
    if (action === "Class List") {
      navigate("/classlist", { state: { courseCode: course.courseCode } });
      setCourse(null);
    } else if (action === "Enroll") {
      setopenEnrollDialog(true);
    }
    // reset the selected course
    // setCourse(null);
  };

  // get course obj
  useEffect(() => {
    const fetchData = async () => {
      axios
        .get(courseApiUrl)
        .then((result) => {
          console.log("result: ", result);
          setCourses(result.data);
        })
        .catch((error) => {
          console.log("error fetching data: ", error);
        });
    };
    fetchData();
  }, []);

  // get student obj
  useEffect(() => {
    const getStudentUrl = apiUrl + studentId;
    const fetchData = async () => {
      axios
        .get(getStudentUrl)
        .then((result) => {
          console.log("result: ", result);
          setStudent(result.data);
        })
        .catch((error) => {
          console.log("error fetching data: ", error);
        });
    };
    fetchData();
  }, [studentId]);

  // get the current courses of the student
  useEffect(() => {
    if (student && student.enrolledCourses.length > 0) {
      setEnrolledCourses(student.enrolledCourses);
    }
  }, [student]);

  const enrollStudentToCourse = () => {
    let sbMsg = '';
    const studentRequest = {...student};
    const updateStudentUrl = apiUrl + studentId;
    
    const enrollData = {
      courseCode: course.courseCode,
      courseName: course.courseName,
      section: section,
      semester: semester};
      studentRequest.enrolledCourses.push(enrollData);
      console.log(studentRequest);


      axios.put(updateStudentUrl, studentRequest)
      .then((result) => {
				sbMsg = `Enroll course ${course.courseCode} - ${course.courseName} successful`;
				showSnackBar({message: sbMsg, severity: 'success'});
        navigate("/mycourses")
        setCourse(null);
      })
			.catch((error) => {
				sbMsg = `Enroll course ${course.courseCode} - ${course.courseName} failed`;
				showSnackBar({message: sbMsg, severity: 'error'});
			});
      handleEnrollClose();
  }


  


  return (
    <Container>
      {courses.length > 0 ? (
        <div>
          <Typography
            variant="h5"
            color="textPrimary"
            className="courseListHeading"
          >
            All Courses
          </Typography>

          <Grid container spacing={3}>
            {courses.map((course) => (
              <Grid item key={course.id} xs={12} md={6} lg={4}>
                <CourseCard course={course} handleAction={handleAction} />
              </Grid>
            ))}
          </Grid>
        </div>
      ) : (
        <Typography variant="h5" color="textPrimary">
          No courses found
        </Typography>
      )}

      {course && (
        <div>
          <Dialog open={openEnrollDialog} onClose={handleEnrollClose}>
            <DialogTitle>Course Code: {course.courseCode}</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="courseCode"
                label="Course Code"
                value={course.courseCode}
                type="text"
                fullWidth
                disabled
                variant="outlined"
                InputProps={{ style: { fontSize: 12 } }}
                InputLabelProps={{ style: { fontSize: 12 } }}
              />
              <TextField
                autoFocus
                margin="dense"
                id="courseName"
                label="Course Name"
                value={course.courseName}
                type="text"
                fullWidth
                disabled
                variant="outlined"
                InputProps={{ style: { fontSize: 12 } }}
                InputLabelProps={{ style: { fontSize: 12 } }}
              />
              <TextField
                autoFocus
                margin="dense"
                id="section"
                label="Section"
                type="text"
                fullWidth
                variant="outlined"
                InputProps={{ style: { fontSize: 12 } }}
                InputLabelProps={{ style: { fontSize: 12 } }}
                onChange={(e) => setSection(e.target.value)}
              />
              <TextField
                autoFocus
                margin="dense"
                id="semester"
                label="Semester"
                type="text"
                fullWidth
                variant="outlined"
                InputProps={{ style: { fontSize: 12 } }}
                InputLabelProps={{ style: { fontSize: 12 } }}
                onChange={(e) => setSemester(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleEnrollClose}>Cancel</Button>
              <Button onClick={enrollStudentToCourse}>Submit</Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </Container>
  );
}
