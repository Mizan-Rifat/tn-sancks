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
import Items from './Items';

export default function SnackItems() {
  const itemsRef = collection(db, 'snackItems');
  const { snackItems, fetching } = useSelector(state => state.snackItems);
  const dispatch = useDispatch();
  const handleDelete = async id => {
    dispatch(deleteSnacksItem(id));
  };

  useEffect(() => {
    if (!snackItems.length) {
      dispatch(setFetchingTrue());
      onSnapshot(itemsRef, snapshot => {
        const items = snapshot.docs.map(doc => getFsData(doc));
        dispatch(itemsfetched(items));
      });
    }
  }, []);

  return (
    <Items items={snackItems} loading={fetching} handleDelete={handleDelete} />
  );
}
