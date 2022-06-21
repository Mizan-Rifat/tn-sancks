import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  updateDoc
} from 'firebase/firestore';
import { db } from 'firebaseApp/firebase';
import { toast } from 'react-toastify';
import Parse from 'parse';
import { onSubscribe } from 'utils';

const snackOrdersRef = collection(db, 'snackOrders');
const completedSnackOrdersRef = collection(db, 'completedSnackOrders');
const getSnackUsersOrderRef = orderId => `/snackOrders/${orderId}/userOrders`;

export const fetchCurrentSnackOrders = createAsyncThunk(
  'snackOrders/currentSnackOrders/fetch',
  async (_, { rejectWithValue, dispatch, getState }) => {
    const ordersQuery = new Parse.Query('SnackOrders');
    ordersQuery.include('item', 'user');
    const orders = await ordersQuery.find().catch(err => {
      console.log({ err });
    });
    console.log({ orders });
    const subscription = await ordersQuery.subscribe();

    onSubscribe(subscription, {
      update: dd => console.log({ dd })
    });

    // try {
    //   const res = await ordersQuery.find();
    //   console.log({ res });
    //   const items = getParseObjects(res);
    //   console.log({ items });
    //   return items;
    // } catch (error) {
    //   return rejectWithValue(error);
    // }
  }
);

export const addUserSnackOrder = createAsyncThunk(
  'snackOrders/add_user_order',
  async ({ formData, category }, { getState }) => {
    const snackUsersOrderRef = collection(
      db,
      getSnackUsersOrderRef(getState().snackOrders.snackOrder.id)
    );
    const snackOrderRef = doc(
      db,
      'snackOrders',
      getState().snackOrders.snackOrder.id
    );

    try {
      const item = await addDoc(snackUsersOrderRef, formData);

      await updateDoc(snackOrderRef, {
        categories: arrayUnion(category)
      });
      toast.success('Successfully created.');
      return item;
    } catch (error) {
      console.log({ error });
    }
  }
);

export const deleteUserSnackOrder = createAsyncThunk(
  'sanck_orders/delete_user_order',
  async ({ id, itemId }, { getState }) => {
    const snackUsersOrderRef = doc(
      db,
      getSnackUsersOrderRef(getState().snackOrders.snackOrder.id),
      id
    );

    const category = getState().snackItems.items.find(
      item => item.id === itemId
    ).category;

    const snackOrderRef = doc(
      db,
      'snackOrders',
      getState().snackOrders.snackOrder.id
    );

    try {
      const item = await deleteDoc(snackUsersOrderRef);

      const userOrders = getState().snackOrders.userOrders;

      if (!userOrders.some(order => order.category === category)) {
        await updateDoc(snackOrderRef, {
          categories: arrayRemove(category)
        });
      }
      toast.success('Successfully deleted.');
      return item;
    } catch (error) {
      console.log({ error });
    }
  }
);

export const updateSnackOrder = createAsyncThunk(
  'sanck_orders/update_snack_order',
  async ({ id, data }) => {
    const docRef = doc(db, 'snackOrders', id);

    try {
      const item = await updateDoc(docRef, data);
      toast.success('Successfully updated.');
      return item;
    } catch (error) {
      console.log({ error });
    }
  }
);

export const snackOrdersSlice = createSlice({
  name: 'snackOrders',
  initialState: {
    snackOrder: null,
    completedSnackOrders: [],
    currentUserCompletedSnackOrders: [],
    userOrders: [],
    currentUserOrders: [],
    loading: true
  },
  reducers: {
    snackOrdersFetched: (state, action) => {
      state.snackOrder = action.payload;
      state.loading = false;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(deleteUserSnackOrder.pending, state => {
        state.loading = true;
      })
      .addCase(deleteUserSnackOrder.fulfilled, state => {
        state.loading = false;
      });
  }
});

// export const {
//   setLoadingTrue,
//   snackOrdersFetched,
//   setUserOrders,
//   setCurrentUserOrders,
//   setCompletedSnackOrders,
//   setCurrentUserCompletedSnackOrders
// } = snackOrdersSlice.actions;

export default snackOrdersSlice.reducer;
