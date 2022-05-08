import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addUserSnackOrder } from 'redux/slices/snackOrdersSlice';

const LunchList = () => {
  const [selectedItem, setSelectedItem] = useState('');
  const { lunchOrder, currentUserLunchOrders } = useSelector(
    state => state.snackOrders
  );
  const { currentUser } = useSelector(state => state.users);
  console.log({ lunchOrder, currentUserLunchOrders, selectedItem });
  const dispatch = useDispatch();
  useEffect(() => {
    setSelectedItem(currentUserLunchOrders[0]?.itemId);
  }, [currentUserLunchOrders]);

  const handleSubmit = () => {
    dispatch(
      addUserSnackOrder({
        itemId: selectedItem.id,
        uid: currentUser.id
      })
    );
  };

  return (
    <div>
      <FormControl margin="dense" size="small" fullWidth sx={{ mt: 1, mb: 2 }}>
        <InputLabel id="demo-simple-select-label">Item</InputLabel>
        <Select
          margin="dense"
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Item"
          value={selectedItem}
          onChange={e => setSelectedItem(e.target.value)}
        >
          {lunchOrder.items.map(item => (
            <MenuItem key={item.id} value={item.id}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button fullWidth onClick={handleSubmit}>
        {currentUserLunchOrders.length > 0 ? 'update' : 'confirm'} order
      </Button>
      {currentUserLunchOrders.length > 0 && (
        <Button
          variant="outlined"
          color="error"
          fullWidth
          type="submit"
          sx={{ mt: 1 }}
        >
          cancel order
        </Button>
      )}
    </div>
  );
};

export default LunchList;
