import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import './App.css'
import AppLayout from './pages/AppLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Place from './pages/Place';
import PlaceDetail from './pages/PlaceDetail';
import QRScan from './pages/QRScan';
import User from './pages/User';
import UserCreate from './pages/UserCreate';
import UserDetail from './pages/UserDetail';
import Vaccine from './pages/Vaccine';
import VaccineDetail from './pages/VaccineDetail';
import {toggle} from './redux/slide-bar/slideBarSlice';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="/user" element={<User />} />
          <Route path="/user/create" element={<UserCreate />} />
          <Route path="/user/:id" element={<UserDetail />} />
          <Route path="/vaccine" element={<Vaccine />} />
          <Route path="/vaccine/:id" element={<VaccineDetail />} />
          <Route path="/place" element={<Place />} />
          <Route path="/place/:id" element={<PlaceDetail />} />
          <Route path="/qr-scan" element={<QRScan />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
