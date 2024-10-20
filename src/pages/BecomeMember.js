import classes from './BecomeMember.module.css';
import { useSelector } from 'react-redux';
import React, { useRef } from 'react';
import { setDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

const BecomeMember = () => {
  const imageRef = useRef();
  const bioRef = useRef();
  const currUser = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const handleBecomeMember = async () => {
    try {
      const userRef = doc(db, 'users', currUser.uid);
      await updateDoc(userRef, {
        becomeMember: true,
        bio: bioRef.current.value,
      });
      navigate('/search');
    } catch (error) {
      console.error('Error updating becomeMember:', error.message);
    }
  };

  return (
    <div className={classes.becomeMemberPage}>
      <div className={classes.leftContent}>
        <p className={classes.subHeader}>
          Want to become a member and join Green Hands? Please fill out the below information.
        </p>
        <div className={classes.imageDiv}>
          <label className={classes.label}>Choose an image</label>
          <input
            className={classes.imageInput}
            ref={imageRef}
            type="file"
            accept="image/*"
          />
        </div>
        <div className={classes.bioDiv}>
          <label className={classes.label}>Tell us more about yourself</label>
          <textarea
            id="message"
            placeholder="Type your message here..."
            className={classes.textArea}
            ref={bioRef}
          />
        </div>
        <button
          onClick={handleBecomeMember}
          className={classes.memberButton}
        >
          Become a Member
        </button>
      </div>
    </div>
  );
};

export default BecomeMember;
