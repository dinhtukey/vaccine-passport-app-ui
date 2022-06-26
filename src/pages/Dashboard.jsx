import { Box, Button, Card, CardContent, CardHeader, colors, Grid, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useEffect } from 'react';
import AddModeratorOutlinedIcon from '@mui/icons-material/AddModeratorOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { DataGrid } from '@mui/x-data-grid';
import moment from 'moment'
import { Link } from "react-router-dom";

import adminApi from '../api/adminApi';
import { useDispatch } from 'react-redux';
import { toggle} from '../redux/slide-bar/slideBarSlice';
import { useSelector } from 'react-redux';

const Dashboard = () => {
    const dispatch = useDispatch();
    const slideBarCheck = useSelector(state => state.slidebar.value) 
    const [summaryData, setSummaryData] = useState();
    useEffect(() => {
        const getDataSummary = async () => {
            try {
                const res = await adminApi.getSummary();
                setSummaryData(res);
            } catch (error) {
                console.log(error);
            }
        }
        getDataSummary();
    }, [])

    return (
        <Stack spacing={4}>
            <div>
                <Grid container spacing={2}>
                    <Grid item md={3} sm={6} xs={12}>
                        <Card elevation={0}>
                            <CardContent
                                sx={{
                                    '& .MuiCardContent-root:last-child': {
                                        paddingBottom: 0
                                    }
                                }}
                            >
                                {
                                    summaryData && <SummaryInfo
                                        title='Total user'
                                        number={summaryData.totalUser}
                                        icon={<PersonOutlineOutlinedIcon sx={{ fontSize: '2.5rem' }} color="warning" />}
                                    />
                                }
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item md={3} sm={6} xs={12}>
                        <Card elevation={0}>
                            <CardContent>
                                {
                                    summaryData && <SummaryInfo
                                        title='User vaccinated'
                                        number={summaryData.userVaccinated}
                                        icon={<VerifiedUserOutlinedIcon sx={{ fontSize: '2.5rem' }} color="success" />}
                                    />
                                }
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item md={3} sm={6} xs={12}>
                        <Card elevation={0}>
                            <CardContent>
                                {
                                    summaryData && <SummaryInfo
                                        title='Available vaccine dose'
                                        number={summaryData.availableVaccineDose}
                                        icon={<AddModeratorOutlinedIcon sx={{ fontSize: '2.5rem' }} color="primary" />}
                                    />
                                }
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item md={3} sm={6} xs={12}>
                        <Card elevation={0}>
                            <CardContent>
                                {
                                    summaryData && <SummaryInfo
                                        title='Total places'
                                        number={summaryData.totalPlace}
                                        icon={<RoomOutlinedIcon sx={{ fontSize: '2.5rem' }} color="error" />}
                                    />
                                }
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </div>

            <div>
                <Grid container spacing={2}>
                    <Grid item md={4} sm={4} xs={12}>
                        <Card elevation={0}>
                            <CardHeader
                                title={<Typography variant="h6">Vaccinated analyst</Typography>}
                            />
                            <CardContent>
                                {
                                    summaryData && <VaccinatedChart chartData={summaryData.userVaccinatedAnalyst} />
                                }
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item md={8} sm={8} xs={12}>
                        <Card elevation={0}>
                            <CardHeader
                                title={<Typography variant="h6">Lastest vaccine lots</Typography>}
                                action={
                                    <Button
                                        component={Link}
                                        to="/vaccine"
                                    >
                                        Manage vaccine
                                    </Button>
                                }
                            />
                            <CardContent>
                                {
                                    summaryData && <LastestVaccineLotTable list={summaryData.latestVaccineLot} />
                                }
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

            </div>

        </Stack>
    );
};

export default Dashboard;

const SummaryInfo = ({ title, number, icon }) => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
            }}
        >
            <Stack spacing={2}>
                <Typography variant='body2' fontWeight="600">
                    {title}
                </Typography>
                <Typography variant='h4' fontWeight="600">
                    {number}
                </Typography>
            </Stack>
            <div>
                {icon}
            </div>
        </Box>
    )
}

const VaccinatedChart = ({ chartData }) => {
    ChartJS.register(ArcElement, Tooltip, Legend);
    const data = {
        labels: [
            `1 dose ${Math.floor(chartData.userWithOneDose / chartData.totalUser * 100)}%`,
            `Upper 2 doses ${Math.floor(chartData.userWithAboveTwoDose / chartData.totalUser * 100)}%`,
            `0 dose ${Math.floor(chartData.userWithZeroDose / chartData.totalUser * 100)}%`
        ],
        datasets: [
            {
                label: '# of Votes',
                data: [
                    chartData.userWithOneDose,
                    chartData.userWithAboveTwoDose,
                    chartData.userWithZeroDose
                ],
                backgroundColor: [
                    colors.yellow['700'],
                    colors.green['700'],
                    colors.red['700']
                ],
                borderColor: [
                    colors.yellow['700'],
                    colors.green['700'],
                    colors.red['700']
                ],
                borderWidth: 1,
            },
        ],
    };
    return (
        <Pie data={data} />
    )
}


const LastestVaccineLotTable = ({ list }) => {
    const columns = [
        { field: 'name', headerName: 'Lot number', width: 200 },
        {
            field: 'vaccine',
            headerName: 'Vaccine',
            width: 200,
            renderCell: (params) => params.value.name,
        },
        {
            field: 'quantity',
            headerName: 'Quantity',
            width: 150,
        },
        {
            field: 'createdAt',
            headerName: 'Time',
            width: 220,
            renderCell: (params) => moment(params.value).format('DD-MM-YYYY HH:mm:ss')
        }
    ];

    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                autoHeight
                rows={list}
                columns={columns}
                pageSize={5}
                hideFooter
                density='comfortable'
                rowsPerPageOptions={[5]}
                showCellRightBorder
                showColumnRightBorder
                disableSelectionOnClick
            />
        </div>
    )
}