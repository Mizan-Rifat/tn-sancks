import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const getSumOfOrders = data => {
  return data.reduce((acc, val) => {
    acc[val.item] = (acc[val.item] || 0) + 1;
    return acc;
  }, {});
};

const LunchOrdersTable = ({ self }) => {
  const { lunchOrder } = useSelector(state => state.lunchOrders);
  const { users } = useSelector(state => state.users);
  console.log({ lunchOrder });
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState({});

  useEffect(() => {
    if (lunchOrder) {
      setOrders(
        lunchOrder?.users?.map(user => {
          const [userId, item] = user.split('_');
          return {
            user: users.find(user => user.id === userId)?.name,
            item
          };
        })
      );
    }
  }, [lunchOrder]);

  useEffect(() => {
    if (orders) {
      setTotalOrders(getSumOfOrders(orders));
    }
  }, [orders]);

  return (
    <TableContainer component={Paper} sx={{ mb: 2 }}>
      <Table size="small" aria-label="spanning table">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Item</TableCell>
            <TableCell align="center">Price</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {orders?.map((row, index) => (
            <TableRow key={row.user}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{row.user}</TableCell>
              <TableCell>{row.item}</TableCell>
              <TableCell align="center">100/-</TableCell>
            </TableRow>
          ))}

          {!self && (
            <>
              <TableRow>
                <TableCell
                  align="center"
                  colSpan={5}
                  sx={{ borderBottom: 'none', pt: 3, fontWeight: 700 }}
                >
                  Total Orders
                </TableCell>
              </TableRow>

              {Object.keys(totalOrders)?.map(row => (
                <TableRow key={row.name}>
                  <TableCell sx={{ borderBottom: 'none' }}></TableCell>
                  <TableCell>{row}</TableCell>
                  <TableCell align="center">{totalOrders[row]}</TableCell>
                  <TableCell align="center">
                    {Number(totalOrders[row]) * 100} /-
                  </TableCell>
                </TableRow>
              ))}

              <TableRow>
                <TableCell sx={{ borderBottom: 'none' }}></TableCell>
                <TableCell sx={{ borderBottom: 'none', fontWeight: 600 }}>
                  Total :
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ borderBottom: 'none', fontWeight: 600 }}
                >
                  {orders?.length}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ borderBottom: 'none', fontWeight: 600 }}
                >
                  {Number(orders?.length || 0) * 100} /-
                </TableCell>
              </TableRow>
            </>
          )}
          <TableRow>
            <TableCell colSpan={5} sx={{ borderBottom: 'none', pt: 2 }} />
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LunchOrdersTable;
