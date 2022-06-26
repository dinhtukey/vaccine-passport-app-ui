import { Button, Card, CardContent, CardHeader, styled, Typography, Box, FormControl, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useState } from 'react';
import moment from "moment";
import LoadingButton from '@mui/lab/LoadingButton';
import CustomDialog from './CustomDialog';
import vaccineLotApi from '../api/vaccineLotApi';

const VaccineLot = ({ vaccine, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState('');
    const [checkAddOrUpdate, setCheckAddOrUpdate] = useState();
    const [name, setName] = useState('');
    const [nameErr, setNameErr] = useState(false);
    const [quantity, setQuantity] = useState('');
    const [quantityErr, setQuantityErr] = useState(false);
    const [selectedLot, setSelectedLot] = useState();

    const columns = [
        {
            field: 'name', headerName: 'Name lot',
            width: 170
        },
        {
            field: 'quantity',
            headerName: 'Quantity',
            width: 150
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
            field: 'createdAt',
            headerName: 'Created At',
            renderCell: (params) => (moment(params.value).format('DD-MM-YY HH:mm:ss')),
            width: 150
        },
        {
            field: '_id',
            headerName: 'Actions',
            width: 180,
            renderCell: (params) => (
                <>
                    <LoadingButton
                        loading={loadingDelete}
                        color="error"
                        onClick={() => handleDeleteVaccineLot(params.row)}
                    >
                        Delete
                    </LoadingButton>
                    <Button
                        onClick={() => selectLot(params.row)}
                    >
                        Edit
                    </Button>
                </>
            )
        }
    ];

    const selectLot = (lot) => {
        setName(lot.name);
        setQuantity(lot.quantity);
        setSelectedLot(lot);
        setDialogOpen(true); 
        setCheckAddOrUpdate('update');
    }

    const handleDeleteVaccineLot = async (lot) => {
        if (loadingDelete) return;
        setLoadingDelete(true);
        try {
            await vaccineLotApi.delete(lot._id);
            onSuccess();
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingDelete(false);
        }
    }

    const handleAddVaccineLot = async () => {   
        if (loading) return;
        const err = [!name, !quantity];
        setNameErr(!name);
        setQuantityErr(!quantity);

        if (!err.every(e => !e)) return
        setLoading(true);

        const params = {
            vaccineId: vaccine.id,
            name,
            quantity,
        }
        try {
            if (checkAddOrUpdate === 'add') {
                const res = await vaccineLotApi.create(params);
            } else if (checkAddOrUpdate === 'update') {
                console.log("abc", selectedLot);
                
                const res = await vaccineLotApi.update(selectedLot.id, {name, quantity});
            }
            
            setName('');
            setQuantity('');
            onSuccess();
            setDialogOpen(false);
        } catch (error) {
            console.log(error);
            
        } finally {
            setLoading(false)
        }
    }

    const handleResetForm = () => {
        setName('');
        setQuantity('');
        setSelectedLot(undefined);
        setDialogOpen(false);
    }
    return (
        <>
            <Card>
                <CardHeader
                    title={<Typography
                        variant="h6"
                    >
                        Vaccine Lots information
                    </Typography>}
                    action={
                        <Button
                            variant="contained"
                            onClick={() => {setDialogOpen(true); setCheckAddOrUpdate('add')}}
                        >
                            Add lot
                        </Button>
                    }
                />
                <CardContent>
                    <DataGrid
                        autoHeight
                        rows={vaccine.vaccineLots}
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
                title={checkAddOrUpdate === 'add' ? 'Add vaccine lot' : 'Update vaccint lot'}
                type={dialogType}
                content={
                    <Box>
                        <FormControl fullWidth margin='normal'>
                            <TextField id="outlined-basic" label="Vaccine name lot" variant="outlined" value={name} onChange={(e) => setName(e.target.value)} error={nameErr} />
                        </FormControl>
                        <FormControl fullWidth margin='normal'>
                            <TextField id="outlined-basic" label="Quantity" variant="outlined" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} error={quantityErr} />
                        </FormControl>
                    </Box>
                }
                action={
                    <Box>
                        <Button onClick={handleResetForm}>
                            Cancel
                        </Button>
                        <LoadingButton
                            loading={loading}
                            onClick={handleAddVaccineLot}
                            variant="contained"
                        >
                            Ok
                        </LoadingButton>
                    </Box>
                }
            />
        </>
    );
};

export default VaccineLot;