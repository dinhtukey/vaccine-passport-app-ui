import React, { useState } from 'react';
import { useEffect } from 'react';
import { Link } from "react-router-dom";

import PageHeader from '../components/PageHeader';
import placeApi from '../api/placeApi';
import { Button, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const Place = () => {
    const [placeList, setPlaceList] = useState([]);
    useEffect(() => {
        const getListPlace = async () => {
            const res = await placeApi.getAll();
            setPlaceList(res);
        }
        getListPlace();
    }, [])
    const columns = [
        {
            field: 'name', headerName: 'Name',
            renderCell: (params) => <Button
                variant="text"
                component={Link}
                to={`/place/${params.row.id}`}
            >
                {params.value}
            </Button>,
            width: 220
        },
        {
            field: 'creator',
            headerName: 'Create by',
            renderCell: (params) => <Button
                variant="text"
                component={Link}
                to={`/user/${params.value.id}`}
            >
                {params.value.fullname}
            </Button>,
            width: 220
        },
        {
            field: 'userVisitLast24h',
            headerName: 'User check in last 24h',
            renderCell: (params) => params.value.length,
            width: 220
        },
        {
            field: 'address',
            headerName: 'Address',
            width: 220
        }
    ];
    return (
        <>
            <PageHeader title="Place list" />
            {
                placeList && <Paper
                    elevation={0}
                >
                    <DataGrid
                        autoHeight
                        rows={placeList}
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


        </>
    );
};

export default Place;