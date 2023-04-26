import { Box, Container, Typography } from '@mui/material'
import TextField from '@mui/material/TextField';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import React, { useState, useEffect } from 'react'
import { useAuth } from "../auth";
import axios from 'axios';

export default function MyProfile({showSnackBar}) {
	const { authTokens } = useAuth();
	const [studentId, setStudentId] = useState(authTokens.data.id);
	const [student, setStudent] = useState(null);
	
	const [studentNumber, setStudentNumber] = useState('');
	const [email, setEmail] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [address, setAddress] = useState('');
	const [city, setCity] = useState('');
	const [phone, setPhone] = useState('');
	const [program, setProgram] = useState('');

	const [fieldDisabled, setFieldDisabled] = useState(true);
	const [showEdit, setShowEdit] = useState(true);

	// errors
	const [firstNameError, setFirstNameError] = useState({error: false, errorMsg: ""});
	const [lastNameError, setLastNameError] = useState({error: false, errorMsg: ""});

	const apiUrl = `http://localhost:5000/student/`;
	// const navigate = useNavigate();

	// get the student data
	useEffect(() => {
		const getStudentUrl = apiUrl + studentId;
		console.log('fetch =>', getStudentUrl);
		const fetchData = async () => {
			axios.get(getStudentUrl)
				.then(result => {
					console.log('get student result: ', result);
					setStudent(result.data);

				}).catch((error) => {
					console.log('error fetching get student data: ', error);
				})
		};

		fetchData();
	}, [studentId]);

	useEffect(() => {
		if (student) {
			console.log('set values -> ', student);
			setStudentNumber(student.studentNumber);
			setEmail(student.email);
			setFirstName(student.firstName);
			setLastName(student.lastName);
			setAddress(student.address);
			setCity(student.city);
			setPhone(student.phoneNumber || '');
			setProgram(student.program);
		}
		
	}, [student])

	const handleSubmit = (e) => {
		e.preventDefault();

		let sbMsg = '';
		let isValid = true;

		// reset errors 
		resetErrors();

		if (firstName.trim() === '') {
			setFirstNameError({error: true, errorMsg: "First Name is required"});
			isValid = false;
		}

		if (lastName.trim() === '') {
			setLastNameError({error: true, errorMsg: "Last Name is required"});
			isValid = false;
		}

		// proceed when all required field is valid
		if (isValid) {

			const studentRequest = {
				email: email,
				firstName: firstName,
				lastName: lastName,
				address: address,
				city: city,
				phoneNumber: phone,
				program: program,
			}

			const updateUrl = apiUrl + studentId;
			console.log('create student request -> ', studentRequest);

			axios.put(updateUrl, studentRequest)
      .then((result) => {
        console.log('update result -> ', result);
				sbMsg = 'Profile update Successful';
				showSnackBar({message: sbMsg, severity: 'success'});
      })
			.catch((error) => {
				console.log(error);
				sbMsg = `Profile update failed`;
				showSnackBar({message: sbMsg, severity: 'error'});
			});

			disableEdit();
		}
	}

	const resetErrors = () => {
		setFirstNameError({error: false, errorMsg: ""});
		setLastNameError({error: false, errorMsg: ""});
	}

	const cancelEdit = () => {
		// reset original values and clear errors
		setStudentNumber(student.studentNumber);
		setEmail(student.email);
		setFirstName(student.firstName);
		setLastName(student.lastName);
		setAddress(student.address);
		setCity(student.city);
		setPhone(student.phoneNumber || '');
		setProgram(student.program);

		resetErrors();
		disableEdit();
	}

	const enableEdit = () => {
		setShowEdit(false);
		setFieldDisabled(false);
	}

	const disableEdit = () => {
		setShowEdit(true);
		setFieldDisabled(true);
	}

  return (
    <Container>
			<Typography
			variant="h5" color="textPrimary"
			gutterBottom
			>
				My Profile
      </Typography>
			
			<Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
				<form autoComplete="off" noValidate>
				<div>
						<FormControl sx={{ m: 1, width: '50ch' }} >
							<TextField
								onChange={(e) => setStudentNumber(e.target.value)}
								value={studentNumber}
								label="Student Number"
								variant="outlined"
								color="primary"
								type="text"
								disabled
							/>
						</FormControl>

						<FormControl sx={{ m: 1, width: '50ch' }} >
							<TextField 
								onChange={(e) => setEmail(e.target.value)}
								value={email}
								label="Email"
								variant="outlined"
								color="primary"
								type="email"
								disabled
							/>
						</FormControl>
					</div>

					<div>
						<FormControl sx={{ m: 1, width: '50ch' }} >
							<TextField 
								onChange={(e) => setFirstName(e.target.value)}
								value={firstName}
								label="First Name"
								variant="outlined"
								color="primary"
								required
								error={firstNameError.error}
								helperText={firstNameError.errorMsg}
								disabled={fieldDisabled}
							/>
						</FormControl>
						
						<FormControl sx={{ m: 1, width: '50ch' }} >
							<TextField 
								onChange={(e) => setLastName(e.target.value)}
								value={lastName}
								label="Last Name"
								variant="outlined"
								color="primary"
								required
								error={lastNameError.error}
								helperText={lastNameError.errorMsg}
								disabled={fieldDisabled}
							/>
						</FormControl>
					</div>

					<div>
						<FormControl sx={{ m: 1,  width: '50ch' }} >
							<TextField 
								onChange={(e) => setAddress(e.target.value)}
								value={address}
								label="Address"
								variant="outlined"
								color="primary"
								disabled={fieldDisabled}
							/>
						</FormControl>

						<FormControl sx={{ m: 1, width: '50ch' }} >
							<TextField 
								onChange={(e) => setCity(e.target.value)}
								value={city}
								label="City"
								variant="outlined"
								color="primary"
								disabled={fieldDisabled}
							/>
						</FormControl>
					</div>

					<div>
						<FormControl sx={{ m: 1, width: '50ch' }} >
							<TextField 
								onChange={(e) => setPhone(e.target.value)}
								value={phone}
								label="Phone"
								variant="outlined"
								color="primary"
								disabled={fieldDisabled}
							/>
						</FormControl>

						<FormControl sx={{ m: 1, width: '50ch' }} >
							<TextField 
								onChange={(e) => setProgram(e.target.value)}
								value={program}
								label="Program"
								variant="outlined"
								color="primary"
								disabled={fieldDisabled}
							/>
						</FormControl>
					</div>
					<br />
					{showEdit ?
						<div style={{display: 'flex', justifyContent:'flex-end', width:'100%'}}>
						<Button
							type="button"
							color="warning"
							variant="contained"
							endIcon={<ModeEditOutlineOutlinedIcon />}
							onClick={enableEdit}
						> Edit </Button>
						</div>
					:
					<div style={{display: 'flex', justifyContent:'flex-end', width:'100%'}}>
						<Button
							type="button"
							color="primary"
							variant="contained"
							endIcon={<KeyboardArrowRight />}
							onClick={handleSubmit}
							style={{marginRight: '5px'}}
						> Submit </Button>
						<Button
							
							type="button"
							color="error"
							variant="contained"
							endIcon={<HighlightOffOutlinedIcon />}
							onClick={cancelEdit}
						> Cancel </Button>
					</div>
					}
				</form>
			</Box>
    </Container>
  )
}
