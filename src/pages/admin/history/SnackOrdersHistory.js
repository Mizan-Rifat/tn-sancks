import {
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import AppBackdrop from 'components/backdrop/AppBackdrop';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { formatDate } from 'utils';
import { getDebit } from '../users/Users';

const sortDataByDate = data =>
  [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

const SnackOrdersHistory = ({ self }) => {
  const [data, setData] = useState([]);
  const { completedSnackOrders, loading, currentUserCompletedSnackOrders } =
    useSelector(state => state.snackOrders);
  const { currentUser } = useSelector(state => state.users);

  useEffect(() => {
    self
      ? setData(sortDataByDate(currentUserCompletedSnackOrders))
      : setData(sortDataByDate(completedSnackOrders));
  }, [completedSnackOrders, currentUserCompletedSnackOrders, self]);

  return (
    <>
      <AppBackdrop open={loading} />
      {self && (
        <>
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <p>
                Deposit :{' '}
                <span style={{ fontWeight: 600 }}>
                  {currentUser.deposit || 0} /-
                </span>
              </p>
            </Grid>
            <Grid item xs={4} sx={{ textAlign: 'center' }}>
              <p>
                Debit :{' '}
                <span style={{ fontWeight: 600 }}>
                  {getDebit(currentUser.id, currentUserCompletedSnackOrders)} /-
                </span>
              </p>
            </Grid>
            <Grid item xs={4} sx={{ textAlign: 'right' }}>
              <p>
                Credit :{' '}
                <span style={{ fontWeight: 600 }}>
                  {(currentUser.deposit || 0) -
                    getDebit(
                      currentUser.id,
                      currentUserCompletedSnackOrders
                    )}{' '}
                  /-
                </span>
              </p>
            </Grid>
          </Grid>
          <Divider sx={{ mb: 2 }} />
        </>
      )}
      <TableContainer component={Paper}>
        <Table size="small" aria-label="spanning table">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Item</TableCell>
              <TableCell align="center">Qty</TableCell>
              <TableCell align="center">Price</TableCell>
              <TableCell align="center">Total Cost</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map(row => (
              <TableRow key={row.id}>
                <TableCell>{formatDate(row.date)}</TableCell>
                <TableCell>{row.userName}</TableCell>
                <TableCell>{row.itemName}</TableCell>
                <TableCell align="center">{row.qty}</TableCell>
                <TableCell align="center">{row.itemPrice} /-</TableCell>
                <TableCell align="center">{row.totalPrice} /-</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default SnackOrdersHistory;
