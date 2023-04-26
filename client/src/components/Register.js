import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';

export default function Register({ showSnackBar, setTokens }) {
	const [studentNumber, setStudentNumber] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [address, setAddress] = useState('');
	const [city, setCity] = useState('');
	const [phone, setPhone] = useState('');
	const [program, setProgram] = useState('');

	// errors
	const [emailError, setEmailError] = useState({error: false, errorMsg: ""});
	const [passwordError, setPasswordError] = useState({error: false, errorMsg: ""});
	const [firstNameError, setFirstNameError] = useState({error: false, errorMsg: ""});
	const [lastNameError, setLastNameError] = useState({error: false, errorMsg: ""});
	const [studentnumberError, setStudentNumberError] = useState({error: false, errorMsg: ""});

	const apiUrl = `http://localhost:5000/student/create`;
	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();

		let sbMsg = '';
		let isValid = true;
		const emailRegex = /.+\@.+\..+/;

		// reset errors 
		resetErrors();

		if (studentNumber.trim() === '') {
			setStudentNumberError({error: true, errorMsg: "Student number is required"});
			isValid = false;
		}

		if (firstName.trim() === '') {
			setFirstNameError({error: true, errorMsg: "First Name is required"});
			isValid = false;
		}

		if (lastName.trim() === '') {
			setLastNameError({error: true, errorMsg: "Last Name is required"});
			isValid = false;
		}

		if (email.trim() === '') {
			setEmailError({error: true, errorMsg: "Email is required"});
			isValid = false;
		} else if (!email.trim().match(emailRegex)) {
			setEmailError({error: true, errorMsg: "Enter a valid Email"});
			isValid = false;
		}

		if (password.trim() === '') {
			setPasswordError({error: true, errorMsg: "Password is required"});
			isValid = false;
		} else if (password.trim().length < 7) {
			setPasswordError({error: true, errorMsg: "Password must be at least 7 characters"});
			isValid = false;
		}

		// proceed when all required field is valid
		if (isValid) {

			const studentRequest = {
				studentNumber: studentNumber,
				email: email,
				password: password,
				firstName: firstName,
				lastName: lastName,
				address: address,
				city: city,
				phoneNumber: phone,
				program: program,
				enrolledCourses: []
			}

			console.log('create student request -> ', studentRequest);

			axios.post(apiUrl, studentRequest)
      .then((result) => {
        console.log('create result -> ', result);
				sbMsg = 'Registration Successful';
				showSnackBar({message: sbMsg, severity: 'success'});
				setTokens(result);
				navigate('/myprofile');
      })
			.catch((error) => {
				console.log(error);
			});
		}
	}

	const resetErrors = () => {
		setStudentNumberError({error: false, errorMsg: ""});
		setEmailError({error: false, errorMsg: ""});
		setPasswordError({error: false, errorMsg: ""});
		setFirstNameError({error: false, errorMsg: ""});
		setLastNameError({error: false, errorMsg: ""});
	}

  return (
    <Container>
			<Typography
				variant="h5" color="textPrimary"
				gutterBottom
			>
				Registration Form
			</Typography>
			<Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
				<form autoComplete="off" noValidate onSubmit={handleSubmit}>
				<div>
						<FormControl sx={{ m: 1, width: '50ch' }} >
							<TextField
								onChange={(e) => setStudentNumber(e.target.value)}
								label="Student Number"
								variant="outlined"
								color="primary"
								type="text"
								required
								error={studentnumberError.error}
								helperText={studentnumberError.errorMsg}
							/>
						</FormControl>
					</div>

					<div>
						<FormControl sx={{ m: 1, width: '50ch' }} >
							<TextField 
								onChange={(e) => setEmail(e.target.value)}
								label="Email"
								variant="outlined"
								color="primary"
								type="email"
								required
								error={emailError.error}
								helperText={emailError.errorMsg}
							/>
						</FormControl>
						
						<FormControl sx={{ m: 1, width: '50ch' }} >
							<TextField 
								onChange={(e) => setPassword(e.target.value)}
								label="Password"
								variant="outlined"
								color="primary"
								type="password"
								required
								error={passwordError.error}
								helperText={passwordError.errorMsg}
							/>
						</FormControl>
					</div>
					<div>
						<FormControl sx={{ m: 1, width: '50ch' }} >
							<TextField 
								onChange={(e) => setFirstName(e.target.value)}
								label="First Name"
								variant="outlined"
								color="primary"
								required
								error={firstNameError.error}
								helperText={firstNameError.errorMsg}
							/>
						</FormControl>
						
						<FormControl sx={{ m: 1, width: '50ch' }} >
							<TextField 
								onChange={(e) => setLastName(e.target.value)}
								label="Last Name"
								variant="outlined"
								color="primary"
								required
								error={lastNameError.error}
								helperText={lastNameError.errorMsg}
							/>
						</FormControl>
					</div>

					<div>
						<FormControl sx={{ m: 1,  width: '50ch' }} >
							<TextField 
								onChange={(e) => setAddress(e.target.value)}
								label="Address"
								variant="outlined"
								color="primary"
							/>
						</FormControl>

						<FormControl sx={{ m: 1, width: '50ch' }} >
							<TextField 
								onChange={(e) => setCity(e.target.value)}
								label="City"
								variant="outlined"
								color="primary"
							/>
						</FormControl>
					</div>

					<div>
						<FormControl sx={{ m: 1, width: '50ch' }} >
							<TextField 
								onChange={(e) => setPhone(e.target.value)}
								label="Phone"
								variant="outlined"
								color="primary"
							/>
						</FormControl>

						<FormControl sx={{ m: 1, width: '50ch' }} >
							<TextField 
								onChange={(e) => setProgram(e.target.value)}
								label="Program"
								variant="outlined"
								color="primary"
							/>
						</FormControl>
					</div>
					<br />
					<div style={{display: 'flex', justifyContent:'flex-end', width:'100%'}}>
						<Button
							type="submit"
							color="primary"
							variant="contained"
							endIcon={<KeyboardArrowRight />}
						> Submit </Button>
					</div>
				</form>
			</Box>
		</Container>
  )
}
