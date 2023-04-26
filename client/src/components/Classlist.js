import { ListItemButton, ListItemText } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import PersonIcon from "@mui/icons-material/Person";
import { useLocation } from "react-router-dom";
import Typography from "@mui/material/Typography";

export default function ClassList(props) {
  const { state } = useLocation();
  console.log(state);
  const courseCode = state.courseCode;
  const [studentsInCourse, setStudentsInCourse] = useState([]);
  const apiUrl = `http://localhost:5000/students/${courseCode}`;

  useEffect(() => {
    const fetchData = async () => {
      axios
        .get(apiUrl)
        .then((result) => {
          console.log("result: ", result);
          setStudentsInCourse(result.data);
        })
        .catch((error) => {
          console.log("error fetching data: ", error);
        });
    };
    fetchData();
  }, []);

  return (
    <div>
      {studentsInCourse.length !== 0 ? (
        <div>
          <Typography variant="h5" color="textPrimary">
            Class List of {courseCode}
          </Typography>
          <Box
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          >
            <nav aria-label="Course List">
              {studentsInCourse.map((item, idx) => (
                <ListItem disablePadding key={item.id}>
                  <ListItemButton>
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText>
                      {item.firstName + " " + item.lastName}
                    </ListItemText>
                  </ListItemButton>
                </ListItem>
              ))}
            </nav>
          </Box>
        </div>
      ) : (
        <Typography variant="h5" color="textPrimary">
          No students found
        </Typography>
      )}
    </div>
  );
}
