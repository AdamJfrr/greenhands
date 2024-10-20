import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { logIn } from '../store/authSlice';
import classes from './Signup.module.css';
import plant1 from '../images/plant 1.png';

const SignUp = () => {
  const emailRef = useRef();
  const passRef = useRef();
  const cityRef = useRef();
  const firstNameRef = useRef();
  const lastNameRef = useRef();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [error, setError] = useState(false);

  const submitInfoHandler = async (e) => {
    e.preventDefault();

    const email = emailRef.current.value;
    const password = passRef.current.value;
    const city = cityRef.current.value;
    const firstName = firstNameRef.current.value;
    const lastName = lastNameRef.current.value;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        firstName: firstName,
        lastName: lastName,
        email: email,
        city: city.charAt(0).toUpperCase() + city.slice(1).toLowerCase(),
        createdAt: new Date(),
        rating: 0,
        becomeMember:false,
        bookings:[]
      });

      dispatch(logIn({ user }));
      setSuccess(true);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/');
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className={classes.signupPage}>
      <div className={classes.left}>
        <div className={classes.header}>Sign Up</div>

        {success && <p className={classes.alert}>Log in successful</p>}
        {error && <p className={classes.alert}>{errorMessage}</p>}

        <form onSubmit={submitInfoHandler} className={classes.form}>
          <input ref={firstNameRef} type="text" placeholder="First Name" required />
          <input ref={lastNameRef} type="text" placeholder="Last Name" required />
          <input ref={emailRef} type="email" placeholder="Email" required />
          <input ref={passRef} type="password" placeholder="Password" required />
          <input ref={cityRef} type="text" placeholder="City" required />

          <div className={classes.reminder}>
            Already part of Green Hands?
            <Link className={classes.reminderLink} to="/login">Log In here</Link>
          </div>

          <button type="submit">Sign Up</button>
        </form>
      </div>

      <div className={classes.right}>
        <img src={plant1} alt="Plant" />
      </div>
    </div>
  );
};

export default SignUp;
