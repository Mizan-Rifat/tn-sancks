import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import CancelIcon from '@mui/icons-material/Cancel';
import IconButton from '@mui/material/IconButton';
import { Box, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import AddItemDialog from './AddItemDialog';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { fetchItems } from 'redux/slices/itemsSlice';
import { fetchCurrentSnackOrders } from 'redux/slices/snackOrdersSlice';

const getTotalPrice = items =>
  items.reduce((acc, val) => acc + Number(val.qty * val.price), 0);

const Home = () => {
  const [open, setOpen] = useState();
  const { snackRequest, fetching, loading } = useSelector(
    state => state.orderRequests
  );
  const { items } = useSelector(state => state.items);
  const { currentUser } = useSelector(state => state.users);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!items.length) {
      dispatch(fetchItems());
    }
    dispatch(fetchCurrentSnackOrders());
  }, []);

  return snackRequest?.status ? (
    <>
      <TableContainer>
        <Table size="small">
          {/* <TableBody>
            {currentUserOrders.map(row => (
              <TableRow key={row.itemId}>
                <TableCell>
                  {row.name} ({row.qty})
                </TableCell>
                <TableCell>{row.price * row.qty} /-</TableCell>
                <TableCell align="right">
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={() => handleDeleteOrder(row.id, row.itemId)}
                    disabled={!snackOrder.open}
                  >
                    <CancelIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            <TableRow>
              <TableCell>Total</TableCell>
              <TableCell>{getTotalPrice(currentUserOrders)} /-</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody> */}
        </Table>
      </TableContainer>
      <Box sx={{ textAlign: 'center', my: 3 }}>
        {!snackRequest.status && <h3>Order request is closed now.</h3>}
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
          disabled={!snackRequest.open}
        >
          Add Item
        </Button>
      </Box>
      <AddItemDialog open={open} setOpen={setOpen} />
    </>
  ) : (
    <Box
      sx={{
        minHeight: 300,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
      }}
    >
      <SentimentVeryDissatisfiedIcon />
      <h3>No order request is available right now</h3>
    </Box>
  );
};

export default Home;
