import { Button, Card, CardActions, CardContent, CardHeader, FormControl, Grid, Stack, TextField, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import moment from 'moment';
import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import userApi from '../api/userApi';

import PageHeader from '../components/PageHeader';

const QRScan = () => {
    const [data, setData] = useState();
    const handleScan = async (result, error) => {
        console.log("abc", result);

        if (result) {
            const res = await userApi.getOne(result.text)
            console.log("Res", res);

            setData(res);
        }
    }

    const columns = [
        {
            field: 'vaccine', headerName: 'vaccine',
            renderCell: (params) => params.value.name,
            width: 220
        },
        {
            field: 'vaccineLot',
            headerName: 'Vaccine Lot',
            renderCell: (params) => params.value.name,
            width: 220
        },
        {
            field: 'createdAt',
            headerName: 'Time',
            renderCell: (params) => (moment(params.value).format('DD-MM-YY HH:mm:ss')),
            width: 220
        }
    ];
    return (
        <>
            <PageHeader title="Scan user QR" />
            <Grid container spacing={4}>
                <Grid item md={3} sm={4} xs={12}>
                    <Card
                        elevation={0}
                    >
                        <CardContent>
                            <QrReader
                                scanDelay={1000}
                                style={{ width: '100%' }}
                                onResult={handleScan}
                                facingMode='user'
                            />
                        </CardContent>
                        <CardActions>
                            <Button
                                variant="contained"
                                onClick={() => setData(null)}
                            >
                                Reset
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
                {
                    data && <Grid item md={9} sm={8} xs={12}>
                        <Stack spacing={4}>
                            <Card elevation={0}>
                                <CardHeader title={<Typography variant="h6">
                                    User info
                                </Typography>} />
                                <CardContent>
                                    <Grid container spacing={2}>
                                        <Grid item sm={6} xs={12}>
                                            <FormControl fullWidth margin='normal'>
                                                <TextField id="outlined-basic" label="Id card" variant="outlined" value={data.idNumber} InputProps={{ readOnly: true }} />
                                            </FormControl>
                                        </Grid>
                                        <Grid item sm={6} xs={12}>
                                            <FormControl fullWidth margin='normal'>
                                                <TextField id="outlined-basic" label="Full name" variant="outlined" value={data.fullname} InputProps={{ readOnly: true }} />
                                            </FormControl>
                                        </Grid>
                                        <Grid item sm={6} xs={12}>
                                            <FormControl fullWidth margin='normal'>
                                                <TextField id="outlined-basic" label="Phone" variant="outlined" value={data.phoneNumber} InputProps={{ readOnly: true }} />
                                            </FormControl>
                                        </Grid>
                                        <Grid item sm={6} xs={12}>
                                            <FormControl fullWidth margin='normal'>
                                                <TextField id="outlined-basic" label="Address" variant="outlined" value={data.address} InputProps={{ readOnly: true }} />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                            <Card elevation={0}>
                                <CardHeader title={<Typography variant="h6">
                                    Vaccinated information
                                </Typography>} />
                                <CardContent>
                                    <DataGrid
                                        autoHeight
                                        rows={data.vaccinated}
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
                        </Stack>
                    </Grid>
                }

            </Grid>
        </>
    );
};

export default QRScan;