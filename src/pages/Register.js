import { Box, Button, Stack, TextField } from '@mui/material';
import AppBackdrop from 'components/backdrop/AppBackdrop';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { auth, db } from 'firebaseApp/firebase';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signUp } from 'redux/slices/usersSlice';
import Parse from 'parse';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const usersRef = collection(db, 'users');
  const { currentUser } = useSelector(state => state.users);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const onSubmit = async data => {
    setLoading(true);
    await dispatch(signUp(data)).unwrap();
    navigate('/login');
  };

  useEffect(() => {
    console.log(Parse.User.current());
    if (currentUser) {
      if (currentUser.role == 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [currentUser]);

  return (
    <>
      <AppBackdrop open={loading} />
      {!loading && (
        <Box sx={{ mt: 2 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Name"
                error={!!errors.name}
                helperText={errors.name?.message}
                {...register('name', {
                  required: 'This field is required'
                })}
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register('email', { required: 'This field is required' })}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register('password', {
                  required: 'This field is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters long'
                  }
                })}
              />
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                error={!!errors.confirm_password}
                helperText={errors.confirm_password?.message}
                {...register('confirm_password', {
                  required: true,
                  validate: val => {
                    if (watch('password') != val) {
                      return 'Your passwords do no match';
                    }
                  }
                })}
              />
              <Button type="submit">Register</Button>
            </Stack>
          </form>
          <Button
            variant="outlined"
            fullWidth
            sx={{ mt: 1 }}
            onClick={() => navigate('/login')}
          >
            go back to login
          </Button>
        </Box>
      )}
    </>
  );
};

export default Register;
