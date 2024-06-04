import React, { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import {
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addUserSnackOrder } from 'redux/slices/snackOrdersSlice';
import { getDebit } from 'pages/admin/users/Users';
import useSnackOrdersHistory from 'hooks/useSnackOrderHistory';
import { toast } from 'react-toastify';

const AddItemDialog = ({ open, setOpen }) => {
  const [selectedItem, setSelectedItem] = useState({});
  const [credit, setCredit] = useState(0);
  const [qty, setQty] = useState(0);

  const { items } = useSelector(state => state.snackItems);
  const [seletcAbleItems, setSeletcAbleItems] = useState([]);
  const { currentUserOrders, snackOrder, currentUserCompletedSnackOrders } =
    useSelector(state => state.snackOrders);

  const { currentUser } = useSelector(state => state.users);
  const dispatch = useDispatch();

  useSnackOrdersHistory();

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = ({ target: { value } }) => {
    setSelectedItem(value);
    setQty(1);
  };

  const handleSubmit = () => {
    const spent = currentUserOrders.reduce(
      (pv, cv) => pv + parseInt(cv.price * cv.qty),
      0
    );

    if (
      spent + parseInt(selectedItem.price) * parseInt(qty) >
      parseInt(credit)
    ) {
      toast.error("You don't have enough credit");
    } else {
      dispatch(
        addUserSnackOrder({
          formData: {
            itemId: selectedItem.id,
            qty,
            uid: currentUser.id
          },
          category: selectedItem.category
        })
      );
    }

    setOpen(false);
  };

  useEffect(() => {
    if (snackOrder.categories?.length === 3) {
      setSeletcAbleItems(
        items.filter(item => snackOrder.categories.includes(item.category))
      );
    } else {
      setSeletcAbleItems(items);
    }
  }, [snackOrder, items]);

  useEffect(() => {
    setCredit(
      (currentUser.deposit || 0) -
        getDebit(currentUser.id, currentUserCompletedSnackOrders)
    );
  }, [currentUserCompletedSnackOrders]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Select item</DialogTitle>
      <DialogContent sx={{ minWidth: 300 }}>
        <FormControl margin="dense" fullWidth sx={{ mt: 1, mb: 2 }}>
          <InputLabel id="demo-simple-select-label">Item</InputLabel>
          <Select
            margin="dense"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Item"
            onChange={handleChange}
          >
            {seletcAbleItems
              .filter(item => !item.disable)
              .filter(
                item =>
                  !currentUserOrders.some(order => order.itemId === item.id)
              )
              .map(item => (
                <MenuItem key={item.id} value={item}>
                  {item.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <Box sx={{ textAlign: 'center' }}>
          <ButtonGroup
            size="small"
            variant="outlined"
            aria-label="outlined primary button group"
          >
            <Button onClick={() => qty > 0 && setQty(qty - 1)}>-</Button>
            <Button sx={{ pointerEvents: 'none' }}>{qty}</Button>
            <Button onClick={() => setQty(qty + 1)}>+</Button>
          </ButtonGroup>
          <p style={{ marginBottom: 0 }}>
            Price : {(selectedItem.price || 0) * qty}/-
          </p>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="error" onClick={handleClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>OK</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddItemDialog;
