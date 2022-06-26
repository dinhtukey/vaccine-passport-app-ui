import { Box, Button, FormControl, Paper, TextField, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import vaccineApi from '../api/vaccineApi';
import moment from "moment"

import PageHeader from '../components/PageHeader';
import CustomDialog from '../components/CustomDialog';
import LoadingButton from '@mui/lab/LoadingButton';

const Vaccine = () => {
    const [vaccines, setVaccines] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        const getVaccines = async () => {
            const res = await vaccineApi.getAll();
            setVaccines(res)
        }
        getVaccines();
    }, [])

    const columns = [
        {
            field: 'name', headerName: 'Name',
            renderCell: (params) => <Button
                variant="text"
                component={Link}
                to={`/vaccine/${params.row.id}`}
            >
                {params.value}
            </Button>,
            width: 220
        },
        {
            field: 'quantity',
            headerName: 'Quantity',
            width: 220
        },
        {
            field: 'vaccinated',
            headerName: 'Vaccinated',
            width: 150
        },
        {
            field: 'id',
            headerName: 'Availabel',
            width: 150,
            renderCell: (params) => (params.row.quantity - params.row.vaccinated)
        },
        {
            field: 'vaccineLots',
            headerName: 'Lots',
            renderCell: (params) => (params.value.length)
        },
        {
            field: 'createdAt',
            headerName: 'Created At',
            renderCell: (params) => (moment(params.value).format('DD-MM-YY HH:mm:ss')),
            width: 220
        }
    ];

    const handleCreateSuccess = (res) => {
        setVaccines([res, ...vaccines]);
        setDialogOpen(false);
    }

    const handleCancel = () => {
        setDialogOpen(false);
    }

    return (
        <>
            <PageHeader title="Vaccine list" rightContent={
                <Button
                    variant='contained'
                    onClick={() => setDialogOpen(true)}
                >Create</Button>
            }>
            </PageHeader>
            {
                vaccines && <Paper elevation={0}>
                    <DataGrid
                        autoHeight
                        rows={vaccines}
                        columns={columns}
                        pageSize={6}
                        rowsPerPageOptions={[6]}
                        density='comfortable'
                        showCellRightBorder
                        showColumnRightBorder
                        disableSelectionOnClick
                    />
                </Paper>
            }

            <VaccineCreateDialog
                dialogOpen={dialogOpen}
                onSuccess={handleCreateSuccess}
                onCancel={handleCancel}
            />
        </>
    );
};

export default Vaccine;

const VaccineCreateDialog = ({ dialogOpen, onSuccess, onCancel }) => {
    const [name, setName] = useState();
    const [nameErr, setNameErr] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleCreateVaccine = async () => {
        if (loading) return;
        const err = !name;
        setNameErr(err);

        if (err) return;
        setLoading(true);
        try {
            const res = await vaccineApi.create({ name });
            setName('');
            onSuccess(res);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
    return (
        <CustomDialog
            open={dialogOpen}
            title="Add vaccine"
            // showIcon
            // type={dialogType}
            content={
                <Box>
                    <FormControl fullWidth margin='normal'>
                        <TextField id="outlined-basic" label="Vaccine name" variant="outlined" value={name} onChange={(e) => setName(e.target.value)} error={nameErr} />
                    </FormControl>
                </Box>
            }
            action={
                <Box
                    width={{sm:'400px', xs: '100%'}}
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end'
                    }}
                >
                    <Button
                        onClick={() => onCancel()}
                    >
                        Cancel
                    </Button>
                    <LoadingButton
                        variant="contained"
                        loading={loading}
                        onClick={handleCreateVaccine}
                    >
                        Create
                    </LoadingButton>
                </Box>
            }
        />
    )
}