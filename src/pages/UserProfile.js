import classes from './UserProfile.module.css';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { Timestamp } from 'firebase/firestore';
import Calendar from '../components/calendar/Calendar';

const UserProfile = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUserData({ id: userDoc.id, ...userDoc.data() });
        } else {
          alert('User not found');
        }
      } catch (error) {
        alert('Error fetching user data: ' + error.message);
      }
    };

    fetchUser();
  }, [userId]);

  const editLastName = (lName) => {
    return ' ' + lName.charAt(0);
  };

  const formatDate = (timestamp) => {
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate().toLocaleDateString();
    }
    return '';
  };

  const addBooking = async (startDate, endDate) => {
    console.log(startDate,endDate)
    try {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, {
        bookings: arrayUnion(`${startDate}/${endDate}`)
      });
      alert("Booking added successfully!");
      window.location.reload();
    } catch (error) {
      alert("Error adding booking: " + error.message);
    }
  };

  return (
    <div className={classes.profile}>
      {userData ? (
        <>
          <div className={classes.left}>
            <div className={classes.topLeft}>
              <div className={classes.imageBlock}>
                <img src={userData['image']} alt="User profile" />
              </div>
              <div className={classes.infoBlock}>
                <div className={classes.topInfoBlock}>
                  <div className={classes.name}>
                    {userData['firstName'] + editLastName(userData['lastName'])}
                  </div>
                  <div className={classes.rating}>
                    {userData['rating']} &#9733;
                  </div>
                </div>
                <div className={classes.bottomInfoBlock}>
                  <div className={classes.membership}>
                    Member since: {formatDate(userData['createdAt'])}
                  </div>
                </div>
              </div>
            </div>
            <div className={classes.bottomLeft}>
              {userData['bio']}
            </div>
          </div>

          <div className={classes.right}>
            <Calendar addBooking={addBooking} bookings={userData['bookings']} />
          </div>
        </>
      ) : (
        <p className={classes.loading}>Loading user data...</p>
      )}
    </div>
  );
};

export default UserProfile;
