import { configureStore } from '@reduxjs/toolkit'
import slideBarSlice from './slide-bar/slideBarSlice'

export const store = configureStore({
  reducer: {
    slidebar: slideBarSlice
  },
})