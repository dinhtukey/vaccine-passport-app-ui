import LoadingButton from '@mui/lab/LoadingButton';
import { Autocomplete, Box, Button, Card, CardContent, FormControl, Grid, Stack, TextField, Typography } from '@mui/material';
import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import addressList from '../assets/dvhcvn.json';
import userApi from '../api/userApi';
import CustomDialog from '../components/CustomDialog';

const UserCreate = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [idCard, setIdCard] = useState('');
    const [idCardErr, setIdCardErr] = useState(false);
    const [fullname, setFullname] = useState('');
    const [fullnameErr, setFullnameErr] = useState(false);
    const [phone, setPhone] = useState('');
    const [phoneErr, setPhoneErr] = useState(false);
    const [address, setAddress] = useState();
    const [addressErr, setAddressErr] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogText, setDialogText] = useState('');
    const [dialogType, setDialogType] = useState('');

    const handleClick = async () => {
        if (loading) return;
        //! '' => true
        const err = [!idCard, !fullname, !phone, !address];

        setIdCardErr(!idCard);
        setPhoneErr(!phone);
        setFullnameErr(!fullname);
        setAddressErr(!address);

        if (!err.every(e => !e)) return
         
        setLoading(true)

        const params = {
            phoneNumber: phone,
            idNumber: idCard,
            fullname: fullname,
            address: address.name
        }

        console.log("paras", params);
        
        try {
            const res = await userApi.create(params);
            setLoading(false)
            navigate('/user')
        } catch (error) {
            console.log(error);
            setLoading(false);
            setDialogOpen(true);
            setDialogText(error.response.data);
            setDialogType('error')
        }
        
    }
    return (
        <>
            <Box
                sx={{
                    width: {md: '40%' ,sm: '100%', xs: '100%'}
                }}
                
            >
                <PageHeader title="Create user" rightContent={
                    <Stack direction="row" spacing={2}>
                        <Button
                            onClick={() => navigate("/user")}
                        >Cancel</Button>
                        <LoadingButton
                            variant="contained"
                            onClick={handleClick}
                            loading={loading}
                        >
                            Create
                        </LoadingButton>
                    </Stack>

                } />

                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Card elevation={0}>
                            <CardContent>
                                <FormControl fullWidth margin='normal'>
                                    <TextField id="outlined-basic" label="Id card" variant="outlined" value={idCard} onChange={(e) => setIdCard(e.target.value)} error={idCardErr} />
                                </FormControl>
                                <FormControl fullWidth margin='normal'>
                                    <TextField id="outlined-basic" label="Full name" variant="outlined" value={fullname} onChange={(e) => setFullname(e.target.value)} error={fullnameErr} />
                                </FormControl>
                                <FormControl fullWidth margin='normal'>
                                    <TextField id="outlined-basic" label="Phone" variant="outlined" type="number" value={phone} onChange={(e) => setPhone(e.target.value)} error={phoneErr} />
                                </FormControl>
                                <FormControl fullWidth margin='normal'>
                                    <Autocomplete
                                        // disablePortal
                                        options={addressList.data}
                                        getOptionLabel={(option) => option.name}
                                        renderOption={(props, option) => (
                                            <Box component="li" {...props}>
                                                {option.name}
                                            </Box>
                                        )}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Address"
                                                inputProps={{
                                                    ...params.inputProps,
                                                    autoComplete: 'new-password', // disable autocomplete and autofill
                                                }}
                                                error={addressErr}
                                            />
                                        )}
                                        value={address}
                                        onChange={(event, newValue) => {
                                            setAddress(newValue);
                                        }}
                                    />
                                </FormControl>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
            <CustomDialog
                open={dialogOpen}
                showIcon
                type={dialogType}
                content={
                    <Typography>
                        {dialogText}
                    </Typography>
                }
                action={
                    <Box>
                        <Button onClick={() => setDialogOpen(false)}>
                            OK
                        </Button>
                    </Box>
                }
            />
        </>
    );
};

export default UserCreate;