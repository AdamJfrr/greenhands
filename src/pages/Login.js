import classes from './Login.module.css';
import {Link} from 'react-router-dom';
import React, {useRef,useState} from 'react';
import plant1 from '../images/plant 1.png';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import {useNavigate} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {logIn} from '../store/authSlice';

const Login = () => {
  const emailRef = useRef();
  const passRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [success,setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [error,setError] = useState(false);
  console.log(success,error)

  const submitInfoHandler = async(e) =>{
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passRef.current.value;

    try{
      const loginUser = await signInWithEmailAndPassword(auth, email, password);
      const user = loginUser.user;
      dispatch(logIn({user}));
      setSuccess(true);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/');
    }
    catch (error) {
      setError(true)
      setErrorMessage(error.message)
    }
  }

  return(
    <div className={classes.loginPage}>
      <div className={classes.left}>
        <div className={classes.header}> Log In </div>
        {success&&<p className={classes.alert}>Log in successful</p>}
        {setError&&<p className={classes.alert}>{errorMessage}</p>}
        <form onSubmit={submitInfoHandler} className={classes.form}>
          <input ref={emailRef} type='email' placeholder='Email' required/>
          <input ref={passRef} type='password' placeholder='Password' required/>
          <div className={classes.reminder}>Don't have an account with Green Hands? <Link className={classes.reminderLink} to='/signup'>Sign up here</Link></div>
          <div className={classes.reminder}>Forgot password? <Link className={classes.reminderLink} to='/signup'>Recover here</Link></div>
          <button type='submit'>Log In </button>
        </form>
      </div>
      <div className={classes.right}>
        <img src={plant1}/>
      </div>
    </div>
  )
}
export default Login;
