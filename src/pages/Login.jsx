import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../handlers/authHandler';
import bgImage from "../assets/images/login-bg.png";

import { Box, Button, Card, FormControl, Input, InputLabel, TextField, Typography } from '@mui/material/';
import LoadingButton from '@mui/lab/LoadingButton';
import authApi from '../api/authApi';

const Login = () => {
    const [loginErr, setLoginErr] = useState();
    const [username, setUsername] = useState('');
    const [usernameErrText, setUsernameErrText] = useState('');
    const [password, setPassword] = useState('');
    const [passwordErrText, setPasswordErrText] = useState('');
    const [onSubmit, setOnSubmit] = useState(false);

    let navigate = useNavigate();
    useEffect(() => {
        const checkToken = async () => {
            const res = await isAuthenticated();
            if (res) return navigate("/")
        }
        checkToken()
    }, [])

    const handleBlur = () => {
        if (username === '') {
            setUsernameErrText("Username cannot be empty.")
        } else {
            setUsernameErrText("")
        }

        if (password === '') {
            setPasswordErrText("Password cannot be empty.")
        } else if (password.length < 6) {
            setPasswordErrText("Your password must be at least 6 characters")
        } else {
            setPasswordErrText('')
        }
    }

    const handleSubmit = async () => {
        if (onSubmit) return
        setLoginErr(undefined)
        
        handleBlur()
        
        
        const checkErr = {
            username: username.trim().length === 0 ? 'Username cannot be empty.' : '',
            password: password.trim().length === 0 ? 'Password cannot be empty.' : '',
        }
        setUsernameErrText(checkErr.username)
        setPasswordErrText(checkErr.password)

        if (checkErr.username !== '' || checkErr.password !== '') return

        const params = {
            username,
            password
        }
        setOnSubmit(true)
        try {
            const res = await authApi.login(params)
            localStorage.setItem("token", res.token)
            setOnSubmit(false)
            navigate("/")
        } catch (error) {
            if (error.response.status === 401) {
                setLoginErr(error.response.data)
            }
            setOnSubmit(false)
        }

    }

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'flex-start',
                backgroundImage: {md: `url(${bgImage})`, xs: 'none'},
                backgroundSize: 'cover',
                backgroundPosition: 'right',
                
            }}
        >
            <Card sx={{ width: '100%', maxWidth: {md: '600px', xs: '100%'} }}>
                <Box
                    sx={{
                        height: '100vh',
                        width: '100%',
                        maxWidth: '400px',
                        '& .MuiTextField-root': { mb: 3 },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        flexDirection: 'column',
                        padding: '5rem 1rem',
                        margin: 'auto'
                    }}
                >
                    <Typography
                        variant="h5"
                        mb='3rem'
                        fontWeight='700'
                    >VACCINE PASSPORT</Typography>
                    <FormControl fullWidth>
                        <TextField 
                            id="outlined-basic" 
                            label="Username" 
                            variant="outlined" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            error={usernameErrText.length !== 0}
                            helperText={usernameErrText}
                            onBlur={handleBlur}
                        />
                    </FormControl>
                    <FormControl fullWidth>
                        <TextField 
                            id="outlined-basic" 
                            label="Password" 
                            type="password"
                            variant="outlined" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            error={passwordErrText.length !== 0}
                            helperText={passwordErrText}
                            onBlur={handleBlur}
                        />
                    </FormControl>
                    {
                        loginErr && <FormControl fullWidth>
                            <Typography
                                color="error"
                            >{loginErr}</Typography>
                        </FormControl>
                    }
                    <LoadingButton
                        fullWidth
                        size='large'
                        sx={{ marginTop: '1rem' }}
                        variant="contained"
                        onClick={handleSubmit}
                    >
                        Sign in
                    </LoadingButton>
                </Box>
            </Card>
        </Box>
    );
};

export default Login;