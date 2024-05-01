import { Box, Button, Stack, TextField } from '@mui/material';
import AppBackdrop from 'components/backdrop/AppBackdrop';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from 'firebaseApp/firebase';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ForgotPassword from './ForgotPassword';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [openForgotPasswordModal, setOpenForgotPasswordModal] = useState(false);

  const { currentUser } = useSelector(state => state.users);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async ({ email, password }) => {
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        const user = userCredential.user;
        console.log({ user });
      })
      .catch(error => {
        setLoading(false);
        toast.error(error.message);
      });
  };

  useEffect(() => {
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
                label="Email"
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
                  required: 'This field is required'
                })}
              />
              <Button type="submit">Login</Button>
            </Stack>
          </form>
          <Button
            type="submit"
            fullWidth
            variant="outlined"
            sx={{ mt: 1 }}
            onClick={() => navigate('/register')}
          >
            Register
          </Button>
          <Box sx={{ mt: 1, textAlign: 'center' }}>
            <Button
              type="submit"
              variant="text"
              onClick={() => setOpenForgotPasswordModal(true)}
            >
              Forgot Password?
            </Button>
          </Box>
        </Box>
      )}
      <ForgotPassword
        open={openForgotPasswordModal}
        handleClose={() => setOpenForgotPasswordModal(false)}
      />
    </>
  );
};

export default Login;
