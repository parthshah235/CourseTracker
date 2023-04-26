import { Container, Grid } from '@mui/material';
import './pages.css'
import Typography from '@mui/material/Typography'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import StudentCard from './StudentCard';

/*const useStyles = makeStyles((theme) => {
	return {
		studentListHeading: {
			paddingBottom: "5px"
		}
	}
})*/

export default function StudentList() {
	//const classes = useStyles();
	const [students, setStudents] = useState([]);
	const [listError, setListError] = useState(false);
	const apiUrl = 'http://localhost:5000/students';

	useEffect(() =>{
		const fetchData = async () => {
			axios.get(apiUrl)
				.then(result => {
					console.log('result: ', result);
					setStudents(result.data);

				}).catch((error) => {
					console.log('error fetching data: ', error);
				})
		};

		fetchData();
	}, [])
	

  return (
    <Container>
			{ students.length > 0 ?
				<div>
					<Typography variant="h5" color="textPrimary" className="studentListHeading">
						Student List
					</Typography>
				
					<Grid container spacing={3}>
						{students.map(student => (
							<Grid item key={student.id} xs={12} md={6} lg={4}>
								<StudentCard student={student} />
							</Grid>
						))}
					</Grid>
				</div>
				:
				<Typography variant="h5" color="textPrimary">
					No students found
				</Typography>
			}
    </Container>
  )
}
