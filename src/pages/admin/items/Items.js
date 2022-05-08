import React, { useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import { useConfirmation } from 'providers/ConfirmationProvider';
import { Box } from '@mui/system';
import { Button } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from 'firebaseApp/firebase';
import { getFsData } from 'utils';
import {
  deleteSnacksItem,
  itemsfetched,
  setFetchingTrue
} from 'redux/slices/snackItemsSlice';
import { useDispatch, useSelector } from 'react-redux';
import AppBackdrop from 'components/backdrop/AppBackdrop';
import { Link } from 'react-router-dom';

export default function Items({ items, handleDelete, loading, lunch }) {
  const confirm = useConfirmation();
  const onDeleteClick = async id => {
    try {
      await confirm({
        variant: 'error',
        description: 'Are you sure you want to cancel this order?'
      });
      handleDelete(id);
    } catch (error) {
      console.log('no');
    }
  };

  return (
    <>
      <AppBackdrop open={loading} />
      <TableContainer component={Paper}>
        <Table size="small" aria-label="spanning table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Item</TableCell>
              <TableCell align="center">Price</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {items.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell align="center">{row.price} /-</TableCell>
                <TableCell align="right">
                  <IconButton
                    aria-label="delete"
                    size="small"
                    component={Link}
                    to={`/admin/${lunch ? 'lunch-items' : 'snack-items'}/edit/${
                      row.id
                    }`}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={() => onDeleteClick(row.id)}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ textAlign: 'center', my: 3 }}>
        <Button
          component={Link}
          to={`/admin/${lunch ? 'lunch-items' : 'snack-items'}/add`}
          variant="contained"
          color="primary"
        >
          Add item
        </Button>
      </Box>
    </>
  );
}
