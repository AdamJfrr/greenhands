import classes from './Menu.module.css';
import {Link} from 'react-router-dom';
import React from 'react';
import {useSelector,useDispatch} from 'react-redux';
import {logOut} from '../../store/authSlice';

const Menu = () => {
  const {loggedIn,user} = useSelector(state=>state.auth)
  console.log(loggedIn,user)
  const dispatch = useDispatch();

  const signOutHandler = () => {
    dispatch(logOut())
    localStorage.removeItem('user');
  }
  const loggedOutMenu =
  <div className={classes.menu}>
    <Link to='/search' className={classes.link}>SEARCH</Link>
    <Link to='/login' className={classes.link}>LOG IN</Link>
    <Link to='/signup' className={classes.link}>SIGN UP</Link>
  </div>

  const loggedInMenu =
  <div className={classes.menu}>
    <Link to='/search' className={classes.link}>SEARCH</Link>
    <Link to='/becomesitter' className={classes.link}>BECOME A SITTER</Link>
    <button onClick={signOutHandler} className={classes.signoutbutton}>LOG OUT</button>
  </div>

  return (
    <div>
      {loggedIn?loggedInMenu:loggedOutMenu}
    </div>
  )
}
export default Menu;
