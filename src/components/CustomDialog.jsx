import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';

const CustomDialog = props => {
    return (
        <Dialog
            open={props.open}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {props.title}
                {
                    props.showIcon && <Box>
                        {
                            props.type === 'success' && <CheckCircleOutlinedIcon color='success' sx={{fontSize:'3rem'}} />
                        }
                        {
                            props.type === 'error' && <ErrorOutlineOutlinedIcon color='error' sx={{fontSize:'3rem'}} />
                        }
                    </Box>
                }
            </DialogTitle>
            <DialogContent>
                {props.content}
            </DialogContent>
            <DialogActions>
                {props.action}
            </DialogActions>
        </Dialog>
    );
};

CustomDialog.propTypes = {
    title: PropTypes.string,
    content: PropTypes.node,
    action: PropTypes.node,
    open: PropTypes.bool,
    type: PropTypes.string,
    showIcon: PropTypes.bool
};

export default CustomDialog;