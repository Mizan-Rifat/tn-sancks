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
import TabLayout from 'layouts/TabLayout';
import SnacksList from './SnacksList';
import LunchList from './LunchList';

const getTotalPrice = items =>
  items.reduce((acc, val) => acc + Number(val.qty * val.price), 0);

const Home = () => {
  const [open, setOpen] = useState();
  const { currentUserSnackOrders } = useSelector(state => state.snackOrders);

  const { snackOrder } = useSelector(state => state.snackOrders);

  const { handleDeleteOrder } = useOrdersHook();

  return (
    <TabLayout snackComponent={<SnacksList />} lunchComponent={<LunchList />} />
  );
};

export default Home;
