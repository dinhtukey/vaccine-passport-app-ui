import LoadingButton from '@mui/lab/LoadingButton';
import { Autocomplete, Box, Button, Card, CardActions, CardContent, FormControl, Grid, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useState } from 'react';
import QRCode from "react-qr-code";
import { useParams } from 'react-router-dom';
import userApi from '../api/userApi';
import addressList from '../assets/dvhcvn.json';
import CustomDialog from '../components/CustomDialog';
import PageHeader from '../components/PageHeader';
import UserVaccine from '../components/UserVaccine';

const UserDetail = () => {
    const { id } = useParams();
    const [user, setUser] = useState();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogText, setDialogText] = useState('');
    const [dialogType, setDialogType] = useState('');
    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await userApi.getOne(id);
                setUser(res)
            } catch (error) {
                console.log(error)
            }
        }
        getUser()
    }, [])

    const handleUpdateSuccess = () => {
        setDialogOpen(true);
        setDialogText("Update successfully");
        setDialogType('success')
    }

    const handleUpdateError = (msg) => {
        setDialogOpen(true);
        setDialogText(msg);
        setDialogType('error')
    }
    return (
        <>
            <PageHeader title="User Detail" />
            <Grid container spacing={4}>
                <Grid item sm={8} xs={12}>
                    <Stack spacing={4}>
                        {
                            user && <UserInfo
                                user={user}
                                onUpdateSuccess={handleUpdateSuccess}
                                onUpdateError={handleUpdateError}
                            />
                        }
                        {
                            user && <UserVaccine user={user} />
                        }
                    </Stack>
                </Grid>
                <Grid item sm={4} xs={12}>
                    <Card elevation={0}>
                        <CardContent
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {
                                user && <QRCode
                                    level="H"
                                    value={user.id}
                                    size={180}

                                />
                            }
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
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

export default UserDetail;

const UserInfo = ({ user, onUpdateSuccess, onUpdateError }) => {
    const [idCard, setIdCard] = useState(user.idNumber);
    const [idCardErr, setIdCardErr] = useState(false);
    const [fullname, setFullname] = useState(user.fullname);
    const [fullnameErr, setFullnameErr] = useState(false);
    const [phone, setPhone] = useState(user.phoneNumber);
    const [phoneErr, setPhoneErr] = useState(false);
    const [address, setAddress] = useState(addressList.data.find(e => e.name === user.address) || undefined);
    const [addressErr, setAddressErr] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleUpdateUser = async () => {
        if (loading) return
        const err = [!idCard, !fullname, !phone, !address]

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

        try {
            const res = await userApi.update(user.id, params);
            setLoading(false)
            onUpdateSuccess()
        } catch (error) {
            console.log(error);
            setLoading(false);
            onUpdateError(error.response.data)
        }
    }
    return <Card elevation={0}>
        <CardContent>
            <Grid container spacing={2}>
                <Grid item sm={6} xs={12}>
                    <FormControl fullWidth margin='normal'>
                        <TextField id="outlined-basic" label="Id card" variant="outlined" value={idCard} onChange={(e) => setIdCard(e.target.value)} error={idCardErr} />
                    </FormControl>
                </Grid>
                <Grid item sm={6} xs={12}>
                    <FormControl fullWidth margin='normal'>
                        <TextField id="outlined-basic" label="Full name" variant="outlined" value={fullname} onChange={(e) => setFullname(e.target.value)} error={fullnameErr} />
                    </FormControl>
                </Grid>
                <Grid item sm={6} xs={12}>
                    <FormControl fullWidth margin='normal'>
                        <TextField id="outlined-basic" label="Phone" variant="outlined" type="number" value={phone} onChange={(e) => setPhone(e.target.value)} error={phoneErr} />
                    </FormControl>
                </Grid>
                <Grid item sm={6} xs={12}>
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
                </Grid>

            </Grid>
        </CardContent>
        <CardActions
            sx={{
                padding: '0 16px 16px 16px'
            }}
        >
            <LoadingButton loading={loading} onClick={handleUpdateUser} variant="contained">Update</LoadingButton>
        </CardActions>
    </Card>
}