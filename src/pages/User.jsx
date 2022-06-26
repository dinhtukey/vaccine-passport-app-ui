import { Box, Button, Card, Paper, Typography } from '@mui/material';
import React from 'react';
import { Link } from "react-router-dom";
import { useState } from 'react';
import { useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';

import PageHeader from '../components/PageHeader';
import userApi from "../api/userApi";
import CustomDialog from '../components/CustomDialog';

const User = () => {
    const [userList, setUserList] = useState([]);
    const [pageSize, setPageSize] = useState(9);

    useEffect(() => {
        const getAllUser = async () => {
            try {
                const res = await userApi.getAll();
                setUserList(res);
            } catch (error) {
                console.log(error);
            }
        }
        getAllUser();
    }, [])

    const columns = [
        {
            field: 'idNumber', headerName: 'ID card',
            renderCell: (params) => <Button
                variant="text"
                component={Link}
                to={`/user/${params.row.id}`}
            >
                {params.value}
            </Button>,
            width: 220
        },
        {
            field: 'fullname',
            headerName: 'Full name',
            width: 220
        },
        {
            field: 'phoneNumber',
            headerName: 'Phone number',
            width: 150
        },
        {
            field: 'vaccine',
            headerName: 'Vaccinated',
            width: 250,
            renderCell: (params) => <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center'
                }}
                color={params.value.length > 1 ? 'green' : params.value.length === 1 ? 'yellow' : 'red'}
            >
                {
                    params.value.length > 1 && <VerifiedUserIcon />
                }
                {
                    params.value.length === 1 && <ShieldOutlinedIcon />
                }
                {
                    params.value.length < 1 && <ErrorOutlineOutlinedIcon />
                }

                <Typography
                    variant='body2'
                    sx={{
                        marginLeft: '10px',
                        fontWeight: 500
                    }}
                >
                    Vaccinated with {params.value.length} dose{params.value.length > 1 ? 's' : ''}
                </Typography>
            </Box>
        },
        {
            field: 'address',
            headerName: 'Address',
            width: 220
        },
        {
            field: 'id',
            headerName: 'Action',
            width: 170,
            renderCell: (params) => <Button
                variant="text"
                component={Link}
                to={`/user/${params.row.id}`}
                startIcon={<OpenInNewOutlinedIcon />}
            >
                Detail
            </Button>
        }
    ];

    return (
        <>
            <PageHeader title="User list" rightContent={
                <Button
                    variant='contained'
                    component={Link}
                    to='/user/create'
                    startIcon={<PersonAddOutlinedIcon />}
                >Create</Button>
            } />
            <Paper elevation={0}>
                <DataGrid
                    autoHeight
                    rows={userList}
                    columns={columns}
                    pageSize={6}
                    rowsPerPageOptions={[6]}
                    density='comfortable'
                    showCellRightBorder
                    showColumnRightBorder
                    disableSelectionOnClick
                />
            </Paper>

        </>
    );
};

export default User;