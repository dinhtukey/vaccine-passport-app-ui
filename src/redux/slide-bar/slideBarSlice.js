import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: false,
}

export const slideBarSlice = createSlice({
  name: 'slidebar',
  initialState,
  reducers: {
    toggle: (state) => {
      state.value = !state.value
    }
  },
})

// Action creators are generated for each case reducer function
export const { toggle } = slideBarSlice.actions

export default slideBarSlice.reducer