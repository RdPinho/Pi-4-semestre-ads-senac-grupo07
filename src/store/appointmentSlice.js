// src/store/appointmentSlice.js
import { createSlice } from '@reduxjs/toolkit';

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState: {
    servico: '',
  },
  reducers: {
    setServico(state, action) {
      state.servico = action.payload;
    },
  },
});

export const { setServico } = appointmentSlice.actions;
export default appointmentSlice.reducer;
