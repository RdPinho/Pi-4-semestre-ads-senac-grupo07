// src/store/appointmentSlice.js
import { configureStore, createSlice } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import appointmentReducer from './appointmentSlice';

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState: {
    servico: '',
    time: '',
    userInfo: {},
  },
  reducers: {
    setServico(state, action) {
      state.servico = action.payload;
    },
    setTime(state, action) {
      state.time = action.payload;
    },
    setUserInfo(state, action) {
      state.userInfo = action.payload;
    },
  },
});

export const { setServico, setTime, setUserInfo } = appointmentSlice.actions;
export default appointmentSlice.reducer;
export const store = configureStore({
  reducer: {
    user: userReducer,
    appointment: appointmentReducer,
  },
});