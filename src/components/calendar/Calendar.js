import React, { useState, useEffect } from 'react';
import classes from './Calendar.module.css';
import { useSelector } from 'react-redux';

const Calendar = ({ bookings, ...props }) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [bookedDays, setBookedDays] = useState([]);
  const loggedIn = useSelector((state) => state.auth.loggedIn);
  const [isNotLoggedIn, setIsNotloggedIn] = useState(false);
  const [isAlreadyBooked, setIsAlreadyBooked] = useState(false);
  const [isBookedInRange, setIsBookedInRange] = useState(false);
  const [isCorrectDateOrder, setIsCorrectDateOrder] = useState(false);

  useEffect(() => {
    const parseBookings = () => {
      const booked = bookings.flatMap((booking) => {
        const [startDateStr, endDateStr] = booking.split('/');
        const [startDay, startMonth, startYear] = startDateStr.split('-').map(Number);
        const [endDay, endMonth, endYear] = endDateStr.split('-').map(Number);

        const startDate = new Date(startYear, startMonth - 1, startDay);
        const endDate = new Date(endYear, endMonth - 1, endDay);

        let dateArray = [];
        let currentDate = new Date(startDate);

        while (currentDate <= endDate) {
          dateArray.push(currentDate.toLocaleDateString('en-CA'));
          currentDate.setDate(currentDate.getDate() + 1);
        }
        return dateArray;
      });
      setBookedDays(booked);
    };

    if (Array.isArray(bookings) && bookings.length) {
      parseBookings();
    } else {
      setBookedDays([]);
    }
  }, [bookings]);

  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const firstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const days = daysInMonth(currentMonth, currentYear);
  const firstDay = firstDayOfMonth(currentMonth, currentYear);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const isDayBooked = (day) => {
    const dayString = new Date(currentYear, currentMonth, day).toLocaleDateString('en-CA');
    return bookedDays.includes(dayString);
  };

  const selectDay = (day) => {
    // Clear alert states when a new day is selected
    setIsNotloggedIn(false);
    setIsAlreadyBooked(false);
    setIsBookedInRange(false);
    setIsCorrectDateOrder(false);

    const selectedDate = new Date(currentYear, currentMonth, day);
    const selectedDateString = selectedDate.toLocaleDateString('en-CA');

    if (bookedDays.includes(selectedDateString)) {
      setIsAlreadyBooked(true);
      return;
    }

    if (!selectedStartDate || selectedEndDate) {
      setSelectedStartDate(selectedDate);
      setSelectedEndDate(null);
      setIsBookedInRange(false);
    } else {
      if (selectedDate < selectedStartDate) {
        setIsCorrectDateOrder(true);
        setSelectedStartDate(null);
        setSelectedEndDate(null);
        return;
      }

      let hasBookedDayInRange = false;
      let tempDate = new Date(selectedStartDate);
      while (tempDate <= selectedDate) {
        if (bookedDays.includes(tempDate.toLocaleDateString('en-CA'))) {
          hasBookedDayInRange = true;
          break;
        }
        tempDate.setDate(tempDate.getDate() + 1);
      }

      if (hasBookedDayInRange) {
        setIsBookedInRange(true);
        setSelectedStartDate(null);
        setSelectedEndDate(null);
      } else {
        setSelectedEndDate(selectedDate);
      }
    }
  };

  const isSelectedInRange = (day) => {
    const currentDate = new Date(currentYear, currentMonth, day);
    if (selectedStartDate && selectedEndDate) {
      return currentDate >= selectedStartDate && currentDate <= selectedEndDate;
    }
    return false;
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const addBookingHandler = () => {
    setIsNotloggedIn(false);
    setIsAlreadyBooked(false);
    setIsBookedInRange(false);
    setIsCorrectDateOrder(false);

    if (!loggedIn) {
      setIsNotloggedIn(true);
      return;
    }
    const formattedStartDate = formatDate(selectedStartDate);
    const formattedEndDate = formatDate(selectedEndDate);
    if (formattedStartDate && formattedEndDate) {
      props.addBooking(formattedStartDate, formattedEndDate);
    }
  };

  return (
    <div className={classes.calendarContainer}>
      {isNotLoggedIn && <p className={classes.alert}>Please log in to proceed with booking</p>}
      {isAlreadyBooked && <p className={classes.alert}>This day is already booked. Please select a different day</p>}
      {isBookedInRange && <p className={classes.alert}>Selected range includes booked days. Please choose another range</p>}
      {isCorrectDateOrder && <p className={classes.alert}>End date cannot be before start date. Please select a valid range</p>}
      <div className={classes.monthHeader}>
        <button
          onClick={prevMonth}
          className={classes.arrowButton}
          disabled={currentMonth === today.getMonth() && currentYear === today.getFullYear()}
        >
          &#60;
        </button>
        <span>{monthNames[currentMonth]} {currentYear}</span>
        <button onClick={nextMonth} className={classes.arrowButton}>&#62;</button>
      </div>

      <div className={classes.daysHeader}>
        {weekDays.map((day, index) => (
          <span key={index}>{day}</span>
        ))}
      </div>

      <div className={classes.daysGrid}>
        {Array.from({ length: firstDay }).map((_, index) => (
          <div key={index} className={classes.emptyDay}></div>
        ))}
        {Array.from({ length: days }).map((_, day) => (
          <button
            key={day + 1}
            className={`${classes.dayCircle} ${isSelectedInRange(day + 1) ? classes.selectedRange : ''} ${isDayBooked(day + 1) ? classes.bookedDay : ''}`}
            onClick={() => selectDay(day + 1)}
            disabled={isDayBooked(day + 1)}
          >
            {day + 1}
          </button>
        ))}
      </div>

      <div className={classes.footer}>
        <button
          disabled={!selectedStartDate || !selectedEndDate}
          onClick={addBookingHandler}
          className={classes.bookButton}
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default Calendar;
