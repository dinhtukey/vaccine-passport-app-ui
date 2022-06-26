import CoronavirusOutlinedIcon from "@mui/icons-material/CoronavirusOutlined"
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined"
import { useTheme } from "@mui/material/styles"
import { useNavigate } from "react-router-dom"
import { logout } from '../handlers/authHandler'
import avtImage from '../assets/images/avt.jpg'
import { AppBar, Avatar, Button, colors, IconButton, Menu, MenuItem, Stack, Toolbar, Typography } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from "react"
import { useDispatch } from "react-redux"

import { toggle } from '../redux/slide-bar/slideBarSlice'



const TopNav = () => {
    const theme = useTheme()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseDropdown = () => {
        setAnchorEl(null)
    }
    const handleClose = () => {
        setAnchorEl(null);
        logout(navigate);
    };
    return (
        <AppBar
            position="fixed"
            sx={{
                backgroundColor: colors.common.white,
                color: colors.common.black,
                zIndex: theme.zIndex.drawer + 1,
                boxShadow: '0px 1px 4px rgb(0 0 0 / 12%)'
            }}
            elevation={0}
        >
            <Toolbar
                bgcolor={"background.default"} color={"text.primary"}
            >
                <IconButton onClick={() => dispatch(toggle())} edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                    <MenuIcon />
                </IconButton>
                <IconButton
                    onClick={() => navigate('/')}
                >
                    <CoronavirusOutlinedIcon
                        sx={{
                            color: colors.red['800']
                        }}
                    />
                </IconButton>
                <Typography
                    variant="h6"
                    component="div"
                    sx={{ flexGrow: 1, marginLeft: '10px' }}
                >
                    VACCINE PASSPORT
                </Typography>
                <Stack spacing={2} alignItems="center">
                    <Button
                        onClick={handleClick}
                    >
                        <Avatar sx={{
                            width: '30px',
                            height: '30px'
                        }} alt="Logo" src={avtImage} />
                    </Button>

                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleCloseDropdown}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem onClick={handleClose}>
                            {/* <IconButton aria-label="logout" sx={{
                                color: colors.blue['800'],
                            }}
                                onClick={() => logout(navigate)}
                            > */}
                            <ExitToAppOutlinedIcon sx={{ marginRight: '5px', color: colors.blue['800'] }} />
                            <Typography>
                                Log out
                            </Typography>
                            {/* </IconButton> */}
                        </MenuItem>
                    </Menu>

                </Stack>
            </Toolbar>
        </AppBar>
    );
};

export default TopNav;