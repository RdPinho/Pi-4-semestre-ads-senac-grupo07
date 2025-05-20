import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import Appointment from '../pages/Appointment';
import Confirmation from '../pages/Confirmation';
import AvailableTimes from '../pages/AvailableTimes';
import BookingForm from '../pages/BookingForm';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/appointment" element={<Appointment />} />
      <Route path="/times" element={<AvailableTimes />} />
      <Route path="/confirmation" element={<Confirmation />} />
      <Route path='/bookingform' element={<BookingForm />}/>
    </Routes>
  );
}
