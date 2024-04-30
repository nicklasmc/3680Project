import { React, useState, useEffect, localStorage} from 'react';
import '../styles/Signup.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
// import AuthContext from '../auth/AuthContext';
import { useContext } from 'react';

const Login = () => {
  const [loginRequest, setLoginRequest] = useState(false);
  const [user, setUser] = useState({ username: null, password: null });
  // const { setToken } = useContext(AuthContext);
 
  // call if loginRequest changed && it is true
  useEffect(() => {
    if (loginRequest) {
      console.log("user is ->", user);
      const callLogin = async () => {
        console.log("In here...");
        try {
          const response = await axios.post(
            "http://localhost:4000/api/users/login",
            user
          );
          if (response.status === 201) {
            console.log("Incorrect login information");
            
            localStorage.removeItem("token");
            setLoginRequest(false);
          } else if (response.status === 200) {
            console.log("Successful login _>", response);
            console.log(" message --->", response.data.message);
            let token = response.data.token;
            console.log("token", token);
            console.log("typeof token:", typeof(token));
            console.log("token --->", response.data.token);
           
            window.localStorage.setItem("jwt-token", token);
            setLoginRequest(false);
          }
        } catch (err) {
          setToken(null);
          localStorage.removeItem("token");
          console.log("Unknown error -> ", err);
          setLoginRequest(false);
        }
      };
      callLogin();
    }
  }, [loginRequest]);

  // sanitize user input
  const saveUserData = (e) => {
    e.preventDefault();
    const newUsername = document.getElementById("username").value;
    const newPassword = document.getElementById("password").value;
    if (newUsername != null && newPassword != null) {
      setUser({
        username: newUsername,
        password: newPassword,
      });
      setLoginRequest(newUsername);
    } else {
      console.log("Please enter a username or password!");
    }
  };

  // for debugging, remove in final version
  useEffect(() => {
    if (user.username != null && user.password != null) {
      console.log(user);
    }
  }, [user]);

  return (
    <div className='container signup-page'>
      <div className='login-container'>
        <form className='signup-form'>
          <div className='login-title'>
            <div className='login-return'>
              <Link to="/">&#60; &#160;Go Back</Link>
            </div>
            <h1>Welcome Back!</h1>
            <p className='signup-title-text'>We're happy to have you here!</p>
          </div>
          <div className='login-content'>
            <label className='signup-label'>
              <p>
                Username <span>*</span>
              </p>
              <input
                type='username'
                id='username'
                className='signup-input'
                required
              />
            </label>

            <label className='signup-label'>
              <p>
                Password <span>*</span>
              </p>
              <input
                type='password'
                id='password'
                className='signup-input'
                required
              />
            </label>
            <div className='signup-button-can'>
              <button
                className='signup-button'
                onClick={(e) => saveUserData(e)}
              >
                Log In
              </button>
              <Link to='/signup'>
                <p className='signup-button-link'>Don't have an Account?</p>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
