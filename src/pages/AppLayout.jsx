import { Box, colors, Toolbar } from '@mui/material';
import React, { useEffect } from 'react';
import { Outlet, useNavigate } from "react-router-dom";
import SlideBar from '../components/SlideBar';
import TopNav from '../components/TopNav';
import { isAuthenticated } from '../handlers/authHandler';

const AppLayout = () => {
    let navigate = useNavigate();
    useEffect(() => {
        const checkToken = async () => {
            const res = await isAuthenticated();
            console.log("rés", res);

            if (!res) return navigate("/login")
        }
        checkToken()
    }, [])
    return (
        <Box>
            <TopNav />
            <Box sx={{display: "flex"}}>
                <SlideBar />
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 3,
                        height: '100%',
                        backgroundColor: colors.grey['100'],
                        width: 'max-content'
                    }}
                >
                    <Toolbar />
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
};

export default AppLayout;