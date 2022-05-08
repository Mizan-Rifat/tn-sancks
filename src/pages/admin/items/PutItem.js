import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField
} from '@mui/material';
import AppBackdrop from 'components/backdrop/AppBackdrop';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  addSnacksItem,
  fetchSnacksItem,
  resetItem,
  updateSnacksItem
} from 'redux/slices/snackItemsSlice';

const PutItem = ({ isLunch }) => {
  const { item: itemId } = useParams();
  const navigate = useNavigate();

  const { item, loading } = useSelector(state => state.snackItems);

  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const dispatch = useDispatch();
  const onSubmit = async formData => {
    console.log({ formData });
    if (itemId) {
      await dispatch(updateSnacksItem({ itemId, formData })).unwrap();
      navigate(-1);
    } else {
      dispatch(addSnacksItem({ formData, reset }));
      navigate(-1);
    }
  };
  useEffect(() => {
    if (itemId) {
      dispatch(fetchSnacksItem(itemId));
    }

    return () => {
      dispatch(resetItem());
    };
  }, []);
  useEffect(() => {
    setValue('name', item.name);
    setValue('price', item.price);
    setValue('type', isLunch ? 'lunch' : 'snack');
  }, [item]);

  return (
    <>
      <AppBackdrop open={loading} />
      {!loading && (
        <>
          <h2>{itemId ? 'Update' : 'Add'} item</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Item Name"
                error={!!errors.name}
                helperText={errors.name?.message}
                {...register('name', { required: 'This field is required' })}
              />
              <TextField
                fullWidth
                label="Price"
                type="number"
                error={!!errors.price}
                helperText={errors.price?.message}
                {...register('price', { required: 'This field is required' })}
              />

              <Button type="submit">{itemId ? 'Update' : 'Add'}</Button>
              <Button variant="outlined" onClick={() => navigate(-1)}>
                Go to back
              </Button>
            </Stack>
          </form>
        </>
      )}
    </>
  );
};

export default PutItem;
