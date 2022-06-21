import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where
} from 'firebase/firestore';
import { db } from 'firebaseApp/firebase';
import { getFsData, getParseObject, getParseObjects, onSubscribe } from 'utils';
import { toast } from 'react-toastify';
import Parse from 'parse';
import defaultExtraReducers from './defaultExtraReducers';

const usersRef = collection(db, 'users');

export const signUp = createAsyncThunk('users/signup', async formData => {
  const user = new Parse.User();
  user.set('name', formData.name);
  user.set('username', formData.email);
  user.set('password', formData.password);
  await user.save().catch(err => {
    console.log({ err });
    toast.error(err.message);
  });
  console.log({ user });
  return user;
});

export const signIn = createAsyncThunk('users/signin', async formData => {
  const user = await Parse.User.logIn(formData.email, formData.password).catch(
    err => {
      console.log({ err });
      toast.error(err.message);
    }
  );
  console.log({ user });

  return user;
});

export const signOut = createAsyncThunk('users/signout', async () => {
  const user = await Parse.User.logOut().catch(err => {
    console.log({ err });
    toast.error(err.message);
  });
  return user;
});

export const fetchUsers = createAsyncThunk(
  'users/users/fetch',
  async (_, { dispatch }) => {
    const User = new Parse.User();
    const userQuery = new Parse.Query(User);
    const subscription = await userQuery.subscribe();

    onSubscribe(subscription, {
      open: console.log,
      create: payload =>
        dispatch(usersSlice.actions.userAdded(getParseObject(payload))),
      update: payload => {
        console.log({ payload });
        dispatch(usersSlice.actions.userUpdated(getParseObject(payload)));
      }
    });
    const users = await userQuery.find();

    return getParseObjects(users);
  }
);

export const updateUserDeposit = createAsyncThunk(
  'users/update_user_deposit',
  async ({ userId, deposit }) => {
    const docRef = doc(db, 'users', userId);
    try {
      const item = await updateDoc(docRef, { deposit });
      toast.success('Successfully updated.');
      return item;
    } catch (error) {
      console.log({ error });
    }
  }
);

export const usersSlice = createSlice({
  name: 'snackItems',
  initialState: {
    users: [],
    currentUser: null,
    loading: true
  },
  reducers: {
    setCurrentUser: (state, { payload }) => {
      state.currentUser = payload;
    },
    usersfetched: (state, action) => {
      state.users = action.payload;
      state.fetching = false;
      state.loading = false;
    },
    userAdded: (state, { payload }) => {
      state.users.push(payload);
    },
    userUpdated: (state, { payload }) => {
      state.users = state.users.map(item =>
        item.id === payload.id ? payload : item
      );
    }
  },
  extraReducers: builder => {
    builder
      .addCase(signIn.pending, state => {
        state.loading = true;
      })
      .addCase(signIn.fulfilled, (state, { payload }) => {
        console.log({ payload });
        state.currentUser = getParseObject(payload);
      })
      .addCase(signIn.rejected, state => {
        state.loading = false;
      })
      .addCase(signUp.pending, state => {
        state.loading = true;
      })
      // .addCase(signUp.fulfilled, (state, { payload }) => {
      //   state.currentUser = getParseObject(payload);
      // })
      .addCase(signUp.rejected, state => {
        state.loading = false;
      })

      .addCase(signOut.pending, state => {
        state.loading = true;
      })
      .addCase(signOut.fulfilled, state => {
        state.currentUser = null;
        state.loading = false;
      })
      .addCase(signOut.rejected, state => {
        state.loading = false;
      })
      .addCase(fetchUsers.fulfilled, (state, { payload }) => {
        state.users = payload;
      });

    defaultExtraReducers(builder);
  }
});

export const { setLoadingTrue, usersfetched, setCurrentUser } =
  usersSlice.actions;

export default usersSlice.reducer;
