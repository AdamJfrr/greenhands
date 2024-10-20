import './App.css';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NavBar from './components/navbar/NavBar';
import { Routes, Route, Navigate } from 'react-router-dom';
import Index from './pages/Index';
import LogIn from './pages/Login';
import SignUp from './pages/Signup';
import { logIn } from './store/authSlice';
import Search from './pages/Search';
import UserProfile from './pages/UserProfile';
import BecomeMember from './pages/BecomeMember';

const App = () => {
  const dispatch = useDispatch();
  const loggedIn = useSelector((state) => state.auth.loggedIn);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        dispatch(logIn({ user }));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
      }
    }
  }, [dispatch]);

  return (
    <div className='App'>
      <NavBar />
      <Routes>
        <Route path='/' element={<Index />} />
        <Route path='/login' element={<LogIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/search' element={<Search />} />
        <Route path="/users/:userId" element={<UserProfile />} />
        <Route
          path="/becomesitter"
          element={loggedIn ? <BecomeMember /> : <Navigate to="/" replace />}
        />
      </Routes>
    </div>
  );
};

export default App;
