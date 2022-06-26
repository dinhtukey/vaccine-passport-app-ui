import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Button, Card, CardActions, CardContent, FormControl, Grid, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import vaccineApi from '../api/vaccineApi';
import CustomDialog from '../components/CustomDialog';
import PageHeader from '../components/PageHeader';
import VaccineLot from '../components/VaccineLot';


const VaccineDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vaccine, setVaccine] = useState();
    const [loading, setLoading] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [name, setName] = useState('');
    const [nameErr, setNameErr] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogText, setDialogText] = useState('');
    const [dialogType, setDialogType] = useState('');

    useEffect(() => {
        const getVaccine = async () => {
            const res = await vaccineApi.getOne(id);
            setVaccine(res)
            setName(res.name)
        }
        getVaccine();
    }, [])

    const handleDeleteVaccine = async () => {
        if (loadingDelete) return;
        setLoading(true);

        try {
            await vaccineApi.delete(id);
            navigate("/vaccine")
        } catch (error) {
            setDialogText("Delete vaccine failed");
            setDialogType("error");
            setLoadingDelete(false);
            setDialogOpen(true);
        }
    }

    const handleUpdateVaccine = async () => {
        if (loading) return;
        const err = !name;
        setNameErr(!name);

        if (err) return;
        setLoading(true);

        try {
            const res = await vaccineApi.update(id, { name: name });
            console.log(res);

            setDialogText("Update vaccine successfully");
            setDialogType("success");
        } catch (error) {
            setDialogText("Update vaccine failed");
            setDialogType("error");
        } finally {
            setLoading(false);
            setDialogOpen(true);
        }
    }

    const resetPage = async () => {
        try {
            const res = await vaccineApi.getOne(id);
            setVaccine(res)
            setName(res.name)
        } catch (error) {
            console.log(error);
            
        }
    }
    return (
        <>
            <PageHeader
                title="Vaccine Detail"
                rightContent={
                    <LoadingButton
                        color="error"
                        loading={loadingDelete}
                        onClick={handleDeleteVaccine}
                    >
                        Delete
                    </LoadingButton>
                }
            />
            <Grid container spacing={4}>
                <Grid item sm={4} xs={12}>
                    {
                        vaccine &&
                        <Card
                            elevation={0}
                        >
                            <CardContent>

                                <FormControl fullWidth margin='normal'>
                                    <TextField id="outlined-basic" label="Vaccine name" variant="outlined" value={name} onChange={(e) => setName(e.target.value)} error={nameErr} />
                                </FormControl>
                                <FormControl fullWidth margin='normal'>
                                    <TextField id="outlined-basic" label="Available" variant="outlined" InputProps={{ readOnly: true }} value={vaccine.quantity - vaccine.vaccinated} />
                                </FormControl>
                                <FormControl fullWidth margin='normal'>
                                    <TextField id="outlined-basic" label="Quantity" variant="outlined" InputProps={{ readOnly: true }} value={vaccine.quantity} />
                                </FormControl>
                                <FormControl fullWidth margin='normal'>
                                    <TextField id="outlined-basic" label="Vaccinated" variant="outlined" InputProps={{ readOnly: true }} value={vaccine.vaccinated} />
                                </FormControl>
                            </CardContent>
                            <CardActions
                                sx={{
                                    padding: '0 16px 16px 16px'
                                }}
                            >
                                <LoadingButton loading={loading} onClick={handleUpdateVaccine} variant="contained">Update</LoadingButton>
                            </CardActions>
                        </Card>
                    }
                </Grid>
                <Grid item sm={8} xs={12}>
                    {
                        vaccine && <VaccineLot
                            vaccine={vaccine}
                            onSuccess={resetPage}
                        />
                    }

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

export default VaccineDetail;