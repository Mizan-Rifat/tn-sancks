import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import { Edit } from '@mui/icons-material';
import { fetchUsers } from 'redux/slices/usersSlice';
import { useDispatch, useSelector } from 'react-redux';
import AppBackdrop from 'components/backdrop/AppBackdrop';
import EditDepositDialog from './EditDepositDialog';

export const getDebit = (user, orders) =>
  orders
    .filter(order => order.userId === user)
    .reduce((acc, val) => val.totalPrice + acc, 0);

const Users = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [toralCredits, setTotalCredits] = useState(0);

  const { users, fetching, loading } = useSelector(state => state.users);

  // useSnackOrdersHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!users.length) {
      dispatch(fetchUsers());
    }
  }, []);

  useEffect(() => {
    const total = users.reduce(
      (acc, user) => Number(user.credit) + Number(acc),
      0
    );
    setTotalCredits(total);
  }, [users]);

  return (
    <>
      <AppBackdrop open={fetching} />
      <TableContainer component={Paper}>
        <Table size="small" aria-label="spanning table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell align="center">Credit</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell align="center">{row.credit} /-</TableCell>
                <TableCell align="right">
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={() => {
                      setSelectedUser(row);
                      setOpenDialog(true);
                    }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={2} align="center">
                Total :
              </TableCell>
              <TableCell colSpan={1} align="center">
                {toralCredits} /-
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <EditDepositDialog
        open={openDialog}
        setOpen={setOpenDialog}
        user={selectedUser}
      />
    </>
  );
};

export default Users;
