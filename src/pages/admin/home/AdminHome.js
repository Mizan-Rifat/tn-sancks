import { Box, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import AppBackdrop from 'components/backdrop/AppBackdrop';
import { Navigate } from 'react-router-dom';
import { fetchOrderRequests } from 'redux/slices/orderRequestsSlice';

const FormDialog = ({ open, setOpen }) => {
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
  const dispatch = useDispatch();

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    dispatch();

    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Select Date</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          id="date"
          label="Date"
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          sx={{ width: 220 }}
          InputLabelProps={{
            shrink: true
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit}>OK</Button>
      </DialogActions>
    </Dialog>
  );
};

const AdminHome = () => {
  const [open, setOpen] = useState(false);

  const { snackRequest, fetching, loading } = useSelector(
    state => state.orderRequests
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOrderRequests());
  }, []);

  return (
    !fetching && (
      <>
        <AppBackdrop open={fetching} />
        {false ? (
          <Navigate to="orders" />
        ) : (
          <>
            <Box
              sx={{
                display: 'flex',
                height: '70vh',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpen(true)}
              >
                Start taking orders
              </Button>
            </Box>
            <FormDialog open={open} setOpen={setOpen} />
          </>
        )}
      </>
    )
  );
};

export default AdminHome;
