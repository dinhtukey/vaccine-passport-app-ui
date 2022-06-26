import { Box, Button, Card, CardContent, CardHeader, Grid, Stack, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";
import QRCode from "react-qr-code";

import placeApi from '../api/placeApi';
import PageHeader from '../components/PageHeader';

const PlaceDetail = () => {
    const { id } = useParams();
    const [place, setPlace] = useState();

    useEffect(() => {
        const getPlace = async () => {
            const res = await placeApi.getOne(id);
            setPlace(res);
        }
        getPlace();
    }, [])

    const columns = [
        {
            field: 'name', headerName: 'Name',
            width: 170
        },
        {
            field: 'phone',
            headerName: 'Phone',
            width: 150
        },
        {
            field: 'address',
            headerName: 'Address',
            width: 150
        },
        {
            field: 'createdAt',
            headerName: 'Created At',
            renderCell: (params) => (moment(params.value).format('DD-MM-YY HH:mm:ss')),
            width: 150
        }
    ];
    return (
        <>
            <PageHeader title="Place detail" />
            <Grid container spacing={4}>
                <Grid item md={4} sm={4} xs={12}>

                    <Card
                        elevation={0}
                    >
                        <CardContent>
                            {
                                place && <Stack spacing={2}>
                                    <div>
                                        <Typography variant="body2">
                                            Name
                                        </Typography>
                                        <Typography variant="h6">
                                            {place.name}
                                        </Typography>
                                    </div>
                                    <div>
                                        <Typography variant="body2">
                                            Address
                                        </Typography>
                                        <Typography variant="h6">
                                            {place.address}
                                        </Typography>
                                    </div>
                                    <div>
                                        <Typography variant="body2">
                                            Created by
                                        </Typography>
                                        <Button
                                            variant="text"
                                            component={Link}
                                            to={`/user/${place.creator.id}`}
                                        >
                                            {place.creator.fullname}
                                        </Button>
                                    </div>
                                </Stack>
                            }
                        </CardContent>
                    </Card>
                    <Card
                        elevation={0}
                    >
                        <CardContent>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {
                                    place && <QRCode
                                        id='place-qr'
                                        value={place._id}
                                        size={180}
                                        level='H'
                                    />
                                }
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item md={8} sm={8} xs={12}>
                    <Card elevation={0}>
                        <CardHeader
                            title={<Typography>
                                User visit in last 24h
                            </Typography>}
                        />
                        <CardContent
                        >
                            {
                                place && <DataGrid
                                    autoHeight
                                    rows={place.userVisitLast24h}
                                    columns={columns}
                                    pageSize={6}
                                    rowsPerPageOptions={[6]}
                                    density='comfortable'
                                    showCellRightBorder
                                    showColumnRightBorder
                                    disableSelectionOnClick
                                />
                            }
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
};

export default PlaceDetail;