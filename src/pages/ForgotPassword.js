import { Box, Button, TextField } from '@mui/material';
import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { sendPasswordResetEmail } from 'firebase/auth';
import { toast } from 'react-toastify';
import { auth } from 'firebaseApp/firebase';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';

const ForgotPassword = ({ open, handleClose }) => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = ({ email }) => {
    if (email) {
      setLoading(true);
      sendPasswordResetEmail(auth, email)
        .then(() => {
          toast.success('Password reset email sent');
          setLoading(false);
        })
        .catch(error => {
          toast.error(error.message);
          setLoading(false);
        });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={false}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={[
          loading && {
            pointerEvents: 'none',
            opacity: 0.5
          }
        ]}
      >
        <DialogTitle sx={{ fontSize: 14, textAlign: 'center' }}>
          We will send you a recovery link <br /> to reset your password
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
          <TextField
            margin="dense"
            id="email"
            label="Email"
            type="email"
            sx={{ width: 250 }}
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register('email', {
              required: 'This field is required'
            })}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={handleClose} size="small" color="error">
            Cancel
          </Button>
          <LoadingButton
            variant="contained"
            loading={loading}
            type="submit"
            size="small"
          >
            Send
          </LoadingButton>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default ForgotPassword;
