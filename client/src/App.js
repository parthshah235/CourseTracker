import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import { useEffect } from 'react';
import Login from './components/Login';
import StudentList from './components/StudentList';
import Layout from './components/Layout';
import EnrolledCourses from './components/EnrolledCourses';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useState, forwardRef } from 'react';
import Register from './components/Register';
import axios from 'axios';
import PrivateRoute from './PrivateRoute';
import { AuthContext } from "./auth";
import MyProfile from './components/MyProfile';
import Logout from './components/Logout';
import AllCourses from './components/AllCourses';
import Classlist from './components/Classlist';

const theme = createTheme();

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function App() {
  const existingTokens = JSON.parse(localStorage.getItem("tokens"));
  const [authTokens, setAuthTokens] = useState(existingTokens);
  const navigate = useNavigate();
  
  const apiUrl = 'http://localhost:5000/';
  const [sbSeverity, setSbSeverity] = useState('success');
  const [sbMsg, setSbMsg] = useState('');
  const [openSb, setOpenSb] = useState(false);
  const showSnackBar = (options) => {
    if (options) {
      setSbSeverity(options.severity);
      setSbMsg(options.message);
      setOpenSb(true);
    }
  }

  const setTokens = (data) => {
    setAuthTokens(data);
    localStorage.setItem("tokens", JSON.stringify(data));
  }

  const clearTokens = () => {
    setAuthTokens(null);
  }

  const handleSbClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSb(false);
  };

  const handleLogin = async (email, password) => {
    console.log('email -> ', email);
    console.log('password -> ', password);
    const loginUrl = apiUrl + "login"

    try {
      const loginRequest = { auth: { email, password } };
      const loginResponse = await axios.post(loginUrl, loginRequest);

      console.log(loginResponse);
      console.log(loginResponse.data);

      const responseData = loginResponse.data;

      if (responseData.data === null && responseData.status === 'error') {
        console.log('error found on login');
        const errorMsg = loginResponse.data.message;
        showSnackBar({message: errorMsg, severity: 'error'});
      } else {
        console.log('no error found on login');
        setTokens(loginResponse.data);
        navigate("/myprofile");
      }

    } catch(e) {
      console.log('error trying to login -> ', e);
    }
  }

  const checkCookie = async () => {
    const cookieUrl = apiUrl + "read_cookie";
    try {
      console.log('check cookie');

      const cookieResponse = await axios.get(cookieUrl);
      console.log(cookieResponse);
      // if (res.data.screen !== undefined) {
      //   setScreen(res.data.screen);
      //   console.log(res.data.screen)
      // }
    } catch (e) {
      
      console.log(e);
    }
  }

  useEffect(() => {
    checkCookie();
  }, []);

  return (
    <div>
      {/*  { authTokens, setAuthTokens: setTokens }}> */}
      <ThemeProvider theme={theme}>
        <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>

          <Layout>
            <Routes>
              <Route path="/" element={<Login handleLogin={handleLogin} />} />
              <Route path="/students" element={<StudentList />} />
              <Route path="/register" element={<Register showSnackBar={showSnackBar} setTokens={setTokens} />} />
              <Route path="/mycourses" element={<PrivateRoute><EnrolledCourses showSnackBar={showSnackBar} /></PrivateRoute>} />
              <Route path="/myprofile" element={<PrivateRoute><MyProfile showSnackBar={showSnackBar} /></PrivateRoute>} />
              <Route path="/logout" element={<PrivateRoute><Logout clearTokens={clearTokens} showSnackBar={showSnackBar} /></PrivateRoute>} />
              <Route path="/courses" element={<PrivateRoute><AllCourses showSnackBar={showSnackBar} /></PrivateRoute>} />
              <Route path="/classlist" element={<PrivateRoute><Classlist showSnackBar={showSnackBar} /></PrivateRoute>} />
            </Routes>
          </Layout>

        </AuthContext.Provider>

        <Snackbar
          anchorOrigin={{vertical: 'top', horizontal: 'right'}}
          open={openSb}
          onClose={handleSbClose}
          autoHideDuration={5000}                    
        >
          <Alert severity={sbSeverity} onClose={handleSbClose}>{sbMsg}</Alert>
        </Snackbar>
      </ThemeProvider>
      
    </div>
  );
}

