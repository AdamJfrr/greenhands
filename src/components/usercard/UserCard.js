import classes from './Usercard.module.css';
import React from 'react';
import {Link} from 'react-router-dom';

const UserCard = ({ uid, ...props }) => {
  return (
    <Link className={classes.link} to={`/users/${uid}`}>
      <div className={classes.card}>
        <div className={classes.rating}><div className={classes.ratingDiv}>{props.rating} &#9733;</div></div>
        <div className={classes.imageBlock}><img src={props.source}/></div>
        <div className={classes.name}>{props.name}</div>
        <div className={classes.member}><div className={classes.memberDate}>Member since: {props.memberDate}</div></div>
      </div>
    </Link>
  )
}

export default UserCard;
