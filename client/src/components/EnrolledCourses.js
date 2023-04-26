import React, { useEffect, useState } from "react";
import './pages.css'
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import axios from "axios";
import EnrolledCourseCard from "./EnrolledCourseCard";
import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useAuth } from "../auth";
import { TextField } from "@mui/material";

/*const useStyles = makeStyles((theme) => {
  return {
    courseListHeading: {
      paddingBottom: "5px",
    },
  };
});*/

export default function EnrolledCourses({ showSnackBar }) {
  const { authTokens } = useAuth();
  const [studentId, setStudentId] = useState(authTokens.data.id);
  //const classes = useStyles();
  const [student, setStudent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState(null);
  const [dropCourseConfirmMsg, setDropCourseConfirmMsg] = useState("");
  const [openConfirmDropCourse, setOpenConfirmDropCourse] =
    React.useState(false);
  const [listError, setListError] = useState(false);
  const apiUrl = `http://localhost:5000/student/`;
  const navigate = useNavigate();
  const [section, setSection] = useState("");
  const [semester, setSemester] = useState("");

  // for Dialog Form
  const [openUpdateCourseDialog, setOpenUpdateCourseDialog] = useState(false);

  const handleUpdateCourseClose = () => {
    setOpenUpdateCourseDialog(false);
  };

  const updateStudentCourse = () => {
    let sbMsg = "";

    const updateStudentUrl = apiUrl + studentId;

    const updatedCourses = courses.filter(
      (aCourse) => aCourse.courseCode !== course.courseCode
    );

    const updateCourseData = {
      courseCode: course.courseCode,
      courseName: course.courseName,
      section: section,
      semester: semester,
    };
    updatedCourses.push(updateCourseData);
    const studentRequest = { ...student, enrolledCourses: updatedCourses };
    console.log(studentRequest);

    axios
      .put(updateStudentUrl, studentRequest)
      .then((result) => {
        sbMsg = `Update course ${course.courseCode} - ${course.courseName} successful`;
        showSnackBar({ message: sbMsg, severity: "success" });
        setCourse(null);
        // set the local copy of courses
        setCourses(updatedCourses);
      })
      .catch((error) => {
        sbMsg = `Update course ${course.courseCode} - ${course.courseName} failed`;
        showSnackBar({ message: sbMsg, severity: "error" });
      });

    handleUpdateCourseClose();
  };

  const handleAction = (course, action) => {
    setCourse(course);
    console.log("Do ", action);
    console.log("On course ", course);
    if (action === "Drop Course") {
      const confirmMsg = `Are you sure you want to drop ${course.courseCode} - ${course.courseName}?`;
      setDropCourseConfirmMsg(confirmMsg);
      setOpenConfirmDropCourse(true);
    } else if (action === "Class List") {
      navigate("/classlist", { state: { courseCode: course.courseCode } });
      setCourse(null);
    } else if (action === "Edit Course") {
      setOpenUpdateCourseDialog(true);
    }
  };

  const executeDropCourse = () => {
    let sbMsg = "";
    console.log("confirm drop on course ", course);
    const updatedCourses = courses.filter(
      (aCourse) => aCourse.courseCode !== course.courseCode
    );

    const studentRequest = { ...student };
    studentRequest.enrolledCourses = updatedCourses;
    console.log("update request -> ", studentRequest);
    const updateUrl = apiUrl + studentId;

    axios
      .put(updateUrl, studentRequest)
      .then((result) => {
        // set the local copy of courses
        setCourses(updatedCourses);
        sbMsg = `Drop course ${course.courseCode} - ${course.courseName} successful`;
        showSnackBar({ message: sbMsg, severity: "success" });
      })
      .catch((error) => {
        sbMsg = `Drop course ${course.courseCode} - ${course.courseName} failed`;
        showSnackBar({ message: sbMsg, severity: "error" });
      });

    // clear selected course
    onCloseConfirmDropCourseDialog();
  };

  const onCloseConfirmDropCourseDialog = () => {
    console.log("onCloseConfirmDropCourseDialog");
    setCourse(null);
    setOpenConfirmDropCourse(false);
  };

  useEffect(() => {
    const getStudentUrl = apiUrl + studentId;
    const fetchData = async () => {
      axios
        .get(getStudentUrl)
        .then((result) => {
          console.log("get student result: ", result);
          setStudent(result.data);
        })
        .catch((error) => {
          console.log("error fetching get student data: ", error);
        });
    };

    fetchData();
  }, [studentId]);

  // get the current courses of the student
  useEffect(() => {
    if (student && student.enrolledCourses.length > 0) {
      setCourses(student.enrolledCourses);
    }
  }, [student]);

  useEffect(() => {
    if (course) {
      setSemester(course.semester);
      setSection(course.section);
    }
  }, [course]);

  return (
    <div>
      {courses.length > 0 ? (
        <div>
          <Typography
            variant="h5"
            color="textPrimary"
            className="courseListHeading"
          >
            My Courses
          </Typography>

          <Grid container spacing={3}>
            {courses.map((course) => (
              <Grid item key={course.courseCode} xs={12} md={6} lg={4}>
                <EnrolledCourseCard
                  course={course}
                  handleAction={handleAction}
                />
              </Grid>
            ))}
          </Grid>
          <Dialog
            open={openConfirmDropCourse}
            onClose={onCloseConfirmDropCourseDialog}
          >
            <DialogTitle>Confirm Drop Course</DialogTitle>

            <DialogContent>
              <DialogContentText>{dropCourseConfirmMsg}</DialogContentText>
            </DialogContent>

            <DialogActions>
              <Button autoFocus onClick={onCloseConfirmDropCourseDialog}>
                Cancel
              </Button>
              <Button onClick={executeDropCourse}>Confirm</Button>
            </DialogActions>
          </Dialog>
        </div>
      ) : (
        <Typography variant="h5" color="textPrimary">
          No Enrolled Courses Found
        </Typography>
      )}

      {course && (
        <div>
          <Dialog
            open={openUpdateCourseDialog}
            onClose={handleUpdateCourseClose}
          >
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
                value={section}
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
                value={semester}
                type="text"
                fullWidth
                variant="outlined"
                InputProps={{ style: { fontSize: 12 } }}
                InputLabelProps={{ style: { fontSize: 12 } }}
                onChange={(e) => setSemester(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleUpdateCourseClose}>Cancel</Button>
              <Button onClick={updateStudentCourse}>Submit</Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </div>
  );
}
