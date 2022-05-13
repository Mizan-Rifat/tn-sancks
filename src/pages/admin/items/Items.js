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
import { useDispatch, useSelector } from 'react-redux';
import AppBackdrop from 'components/backdrop/AppBackdrop';
import { Link } from 'react-router-dom';
import { deleteItem, fetchItems } from 'redux/slices/itemsSlice';

export default function Items() {
  const { items, fetching, loading } = useSelector(state => state.items);
  const dispatch = useDispatch();
  const confirm = useConfirmation();
  const handleDelete = async id => {
    try {
      await confirm({
        variant: 'error',
        description: 'Are you sure you want to cancel this order?'
      });
      dispatch(deleteItem(id));
    } catch (error) {
      console.log('no');
    }
  };

  useEffect(() => {
    if (!items.length) {
      dispatch(fetchItems());
    }
  }, []);

  return (
    <>
      <AppBackdrop open={fetching || loading} />
      <TableContainer component={Paper}>
        <Table size="small" aria-label="spanning table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Item</TableCell>
              <TableCell align="center">Price</TableCell>
              <TableCell align="center">Category</TableCell>
              <TableCell align="center">Disable</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {items.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell align="center">{row.price} /-</TableCell>
                <TableCell align="center">{row.category}</TableCell>
                <TableCell align="center">
                  {row.disable ? 'Yes' : 'No'}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    aria-label="delete"
                    size="small"
                    component={Link}
                    to={`edit/${row.id}`}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={() => handleDelete(row.id)}
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
        <Button component={Link} to="add" variant="contained" color="primary">
          Add item
        </Button>
      </Box>
    </>
  );
}
