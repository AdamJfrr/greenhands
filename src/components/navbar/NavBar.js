import classes from './NavBar.module.css';
import Menu from './Menu';
import {Link} from 'react-router-dom';
import React from 'react';
const NavBar = () => {
  return (
    <div className={classes.navbar}>
      <Link to='/' className={classes.logo}>GREEN HAND</Link>
      <Menu/>
    </div>
  )
}
export default NavBar;
