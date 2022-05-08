import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CancelIcon from '@mui/icons-material/Cancel';
import IconButton from '@mui/material/IconButton';
import { Box } from '@mui/system';
import { Button, Divider, Stack } from '@mui/material';
import useOrdersHook from 'hooks/useOrdersHooks';
import { useDispatch, useSelector } from 'react-redux';
import {
  completeSnackOrders,
  updateSnackOrder
} from 'redux/slices/snackOrdersSlice';
import { Navigate } from 'react-router-dom';
import { formatDate, getTotal, groupBy } from 'utils';
import { useConfirmation } from 'providers/ConfirmationProvider';

const getSumOfOrders = data => {
  const groupedData = data.reduce((acc, val) => {
    const qty = (acc[val.name]?.qty || 0) + val.qty;
    acc[val.name] = { qty, price: qty * val.price };
    return acc;
  }, {});

  return Object.keys(groupedData).map(item => ({
    ...groupedData[item],
    name: item
  }));
};
const SnacksOrderList = () => {
  const [groupedUserOrders, setGroupedUserOrders] = useState({});
  const { snackOrder, userOrders } = useSelector(state => state.snackOrders);
  const { handleDeleteOrder } = useOrdersHook();

  const confirm = useConfirmation();

  const dispatch = useDispatch();

  const completeOrder = async () => {
    try {
      await confirm({
        variant: 'error',
        description: 'Are you sure you want to mark this order as complete?'
      });
      const data = userOrders.map(order => ({
        date: snackOrder.date,
        itemId: order.itemId,
        itemName: order.name,
        itemPrice: order.price,
        totalPrice: order.price * order.qty,
        qty: order.qty,
        userName: order.user,
        userId: order.uid
      }));

      await dispatch(completeSnackOrders(data)).unwarp();
    } catch (error) {
      console.log('no');
    }
  };

  const toggleOrderOpen = async () => {
    try {
      await confirm({
        variant: 'error',
        description: `Are you sure you want to ${
          snackOrder.open ? 'stop' : 'start'
        } taking orders?`
      });

      await dispatch(
        updateSnackOrder({
          id: snackOrder.id,
          data: { open: !snackOrder.open }
        })
      );
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    setGroupedUserOrders(groupBy(userOrders, 'uid'));
  }, [userOrders]);

  return snackOrder ? (
    <>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <h3>{formatDate(snackOrder.date, true)}</h3>
        <Divider variant="middle" />
      </Box>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Item</TableCell>
              <TableCell align="center">Qty.</TableCell>
              <TableCell align="center">Cost</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {Object.keys(groupedUserOrders).map(row =>
              groupedUserOrders[row].map((order, index) => (
                <TableRow key={index}>
                  {index === 0 && (
                    <TableCell rowSpan={groupedUserOrders[row].length}>
                      {order.user}
                    </TableCell>
                  )}
                  <TableCell>{order.name}</TableCell>
                  <TableCell align="center">{order.qty}</TableCell>
                  <TableCell align="center">
                    {order.price * order.qty} /-
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      aria-label="delete"
                      size="small"
                      onClick={() => handleDeleteOrder(order.id)}
                    >
                      <CancelIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}

            <TableRow>
              <TableCell
                align="center"
                colSpan={5}
                sx={{ borderBottom: 'none', pt: 3, fontWeight: 700 }}
              >
                Total Orders
              </TableCell>
            </TableRow>

            {getSumOfOrders(userOrders).map(row => (
              <TableRow key={row.name}>
                <TableCell sx={{ borderBottom: 'none' }}></TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell align="center">{row.qty}</TableCell>
                <TableCell align="center">{row.price} /-</TableCell>
              </TableRow>
            ))}

            <TableRow>
              <TableCell colSpan={2} sx={{ borderBottom: 'none' }}></TableCell>
              <TableCell sx={{ borderBottom: 'none' }}>Total :</TableCell>
              <TableCell align="center" sx={{ borderBottom: 'none' }}>
                {getTotal(getSumOfOrders(userOrders), 'price')} /-
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell colSpan={5} sx={{ borderBottom: 'none', pt: 2 }} />
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Stack spacing={1} sx={{ px: 6, py: 4 }}>
        <Button
          variant="outlined"
          color={snackOrder.open ? 'error' : 'primary'}
          onClick={toggleOrderOpen}
        >
          {snackOrder.open ? 'Stop' : 'Start'} taking orders
        </Button>
        <Button variant="contained" color="primary" onClick={completeOrder}>
          Mark order as complete
        </Button>
      </Stack>
    </>
  ) : (
    <Navigate to="/admin" />
  );
};

export default SnacksOrderList;
