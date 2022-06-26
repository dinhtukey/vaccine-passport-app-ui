import { Autocomplete, Box, Button, Card, CardContent, CardHeader, FormControl, TextField, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from "react-router-dom";
import React from 'react';
import { useState } from 'react';
import moment from "moment"
import CustomDialog from './CustomDialog';
import LoadingButton from '@mui/lab/LoadingButton';
import { useEffect } from 'react';
import vaccineApi from '../api/vaccineApi';
import userApi from '../api/userApi';

const columns = [
    {
        field: 'vaccine', headerName: 'Vaccine', width: 200,
        renderCell: (params) => <Button
            variant="text"
            component={Link}
            to={`/vaccine/${params.value.id}`}
        >
            {params.value.name}
        </Button>,
    },
    {
        field: 'vaccineLot',
        headerName: 'Vaccine Lot',
        width: 200,
        renderCell: (params) => params.value.name
    },
    {
        field: 'createdAt',
        headerName: 'Time',
        width: 220,
        renderCell: (params) => moment(params.value).format('DD-MM-YY HH:mm:ss')
    }
];

const UserVaccine = ({ user }) => {
    const [userVaccines, setUserVaccines] = useState(user.vaccinated);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState('');
    const [vaccineList, setVaccineList] = useState([]);
    const [selectedVaccine, setSelectedVaccine] = useState();
    const [vaccineLots, setVaccineLots] = useState([]);
    const [selectedLot, setSelectedLot] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getVaccineList = async () => {
            try {
                const res = await vaccineApi.getAll();
                setVaccineList(res);
            } catch (error) {
                console.log(error);
            }
        }
        getVaccineList();
    }, [])

    useEffect(() => {
        if (!selectedVaccine) {
            setVaccineLots([]);
            setSelectedLot(null);
            return;
        }
        setVaccineLots(selectedVaccine.vaccineLots);
    }, [selectedVaccine])

    const handleResetForm = () => {
        setDialogOpen(false);
        setSelectedVaccine(null);
    }

    const handleAddUserVaccinated = async () => {
        if (loading) return;
        const err = [!selectedVaccine, !selectedLot];

        if (!err.every(e => !e)) return;
        setLoading(true);

        const params = {
            vaccine: selectedVaccine.id,
            vaccineLot: selectedLot.id,
            user: user.id
        }

        try {
            const res = await userApi.vaccinated(params);
            handleResetForm();
            setUserVaccines([res, ...userVaccines]);
        } catch (error) {
            console.log(error);

        } finally {
            setLoading(false);
        }
    }
    return (
        <>
            <Card elevation={0}>
                <CardHeader
                    title={<Typography
                        variant="h6"
                    >
                        Vaccinated information
                    </Typography>}
                    action={
                        <Button
                            variant="contained"
                            onClick={() => setDialogOpen(true)}
                        >
                            Add Vaccinated
                        </Button>
                    }
                />
                <CardContent
                    sx={{ height: '100%', width: '100%' }}
                >
                    <DataGrid
                        autoHeight
                        rows={userVaccines}
                        columns={columns}
                        pageSize={6}
                        rowsPerPageOptions={[6]}
                        density='comfortable'
                        showCellRightBorder
                        showColumnRightBorder
                        disableSelectionOnClick
                    />
                </CardContent>
            </Card>
            <CustomDialog
                open={dialogOpen}
                title='Add user vaccinated'
                type={dialogType}
                content={
                    <Box
                        sx={{ width: { xs: '100%', sm: '400px' } }}
                    >
                        <FormControl fullWidth margin='normal'>
                            <Autocomplete
                                options={vaccineList}
                                getOptionLabel={(option) => option.name}
                                renderOption={(props, option) => (
                                    <Box component="li" {...props}>
                                        {option.name}
                                    </Box>
                                )}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Vaccine"
                                        inputProps={{
                                            ...params.inputProps,
                                            autoComplete: 'new-password', // disable autocomplete and autofill
                                        }}
                                    />
                                )}
                                value={selectedVaccine}
                                onChange={(event, newValue) => {
                                    setSelectedVaccine(newValue);
                                }}
                            />
                        </FormControl>
                        <FormControl fullWidth margin='normal'>
                            <Autocomplete
                                options={vaccineLots}
                                getOptionLabel={(option) => option.name}
                                renderOption={(props, option) => (
                                    <Box component="li" {...props}>
                                        {option.name}
                                    </Box>
                                )}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Vaccine lot"
                                        inputProps={{
                                            ...params.inputProps,
                                            autoComplete: 'new-password', // disable autocomplete and autofill
                                        }}
                                    />
                                )}
                                value={selectedLot}
                                onChange={(event, newValue) => {
                                    setSelectedLot(newValue);
                                }}
                            />
                        </FormControl>
                    </Box>
                }
                action={
                    <Box>
                        <Button
                            onClick={handleResetForm}
                        >
                            Cancel
                        </Button>
                        <LoadingButton
                            variant="contained"
                            loading={loading}
                            onClick={handleAddUserVaccinated}
                        >
                            Ok
                        </LoadingButton>
                    </Box>
                }
            />
        </>
    );
};

export default UserVaccine;