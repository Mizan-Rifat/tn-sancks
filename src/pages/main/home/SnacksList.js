import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import CancelIcon from '@mui/icons-material/Cancel';
import IconButton from '@mui/material/IconButton';
import { Box, Button } from '@mui/material';
import { useSelector } from 'react-redux';
import AddItemDialog from './AddItemDialog';
import useOrdersHook from 'hooks/useOrdersHooks';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

const getTotalPrice = items =>
  items.reduce((acc, val) => acc + Number(val.qty * val.price), 0);

const SnacksList = () => {
  const [open, setOpen] = useState(false);
  const { snackOrder, currentUserSnackOrders } = useSelector(
    state => state.snackOrders
  );

  const { handleDeleteOrder } = useOrdersHook();

  return snackOrder ? (
    <>
      <TableContainer>
        <Table size="small">
          <TableBody>
            {currentUserSnackOrders.map(row => (
              <TableRow key={row.itemId}>
                <TableCell>
                  {row.name} ({row.qty})
                </TableCell>
                <TableCell>{row.price * row.qty} /-</TableCell>
                <TableCell align="right">
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={() => handleDeleteOrder(row.id)}
                    disabled={!snackOrder.open}
                  >
                    <CancelIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            <TableRow>
              <TableCell>Total</TableCell>
              <TableCell>{getTotalPrice(currentUserSnackOrders)} /-</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ textAlign: 'center', my: 3 }}>
        {!snackOrder.open && <h3>Order request is closed now.</h3>}
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
          disabled={!snackOrder.open}
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

export default SnacksList;
