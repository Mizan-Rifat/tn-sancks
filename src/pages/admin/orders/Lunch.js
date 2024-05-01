import {
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import React from 'react';

const data = [
  {
    id: 1,
    user: 'Rifat',
    price: 100
  }
];

const Lunch = () => {
  return (
    <div>
      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table size="small" aria-label="spanning table">
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell align="center">Price</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map(row => (
              <TableRow key={row.id}>
                <TableCell>{row.user}</TableCell>
                <TableCell align="center">{row.price}/-</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack spacing={1} sx={{ px: 6, py: 4 }}>
        <Button variant="outlined">Start taking orders</Button>
        <Button variant="contained" color="primary">
          Mark order as complete
        </Button>
      </Stack>
    </div>
  );
};

export default Lunch;
