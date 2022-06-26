import React from 'react';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import HealthAndSafetyOutlinedIcon from '@mui/icons-material/HealthAndSafetyOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import QrCodeScannerOutlinedIcon from '@mui/icons-material/QrCodeScannerOutlined';
import { Link, useLocation } from 'react-router-dom';
import { Button, colors, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {toggle} from '../redux/slide-bar/slideBarSlice';

const slideBarNav = [
    {
        text: "Dashboard",
        path: "/",
        icon: <DashboardOutlinedIcon />
    },
    {
        text: "User",
        path: "/user",
        icon: <PersonOutlineOutlinedIcon />
    },
    {
        text: "Place",
        path: "/place",
        icon: <PlaceOutlinedIcon />
    },
    {
        text: "Vaccine",
        path: "/vaccine",
        icon: <HealthAndSafetyOutlinedIcon />
    },
    {
        text: "QR scan",
        path: "/qr-scan",
        icon: <QrCodeScannerOutlinedIcon />
    }
]
const SlideBar = () => {
    const { pathname } = useLocation();
    const dispatch = useDispatch();
    const slideBarCheck = useSelector(state => state.slidebar.value)
    const active = slideBarNav.findIndex(item => item.path === pathname);
    const [openDrawer, setOpenDrawer] = useState(false);

    useEffect(() => {
        setOpenDrawer(slideBarCheck);
    }, [slideBarCheck])
    return (
        <Drawer
            // container={window.document.body}
            variant={openDrawer ? 'temporary' : ''}
            sx={{
                width: 300,
                height: '100vh',
                boxShadow: '0px 1px 4px 1px rgb(0 0 0 / 12%)',
                '& .MuiDrawer-paper': {
                    boxSizing: 'border-box',
                    width: 300,
                    borderRight: 0
                }
            }}
            onClose={() => dispatch(toggle())}
            open={openDrawer}
        >
            <Toolbar />
            <List>
                {
                    slideBarNav.map((item, index) => (
                        <ListItemButton
                        onClick={() => dispatch(toggle())}
                            key={index}
                            selected={active === index}
                            component={Link}
                            to={item.path}
                            sx={{
                                width: 'calc(100% - 20px)',
                                margin: '5px auto',
                                borderRadius: '10px',
                                '&.Mui-selected': {
                                    color: colors.blue['A700']
                                },
                                '&.Mui-selected:hover': {
                                    backgroundColor: colors.blue['200']
                                }
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    color: index === active ? colors.blue['A700'] : colors.green['500']
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                sx={{
                                    '& span': {
                                        fontWeight: index === active && '500'
                                    }
                                }}
                            />
                        </ListItemButton>

                    ))
                }
            </List>
        </Drawer>
    );
};

export default SlideBar;