import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  updateDoc
} from 'firebase/firestore';
import { db } from 'firebaseApp/firebase';
import { getFsData } from 'utils';
import { toast } from 'react-toastify';

const itemsRef = collection(db, 'snackItems');

export const fetchSnacksItem = createAsyncThunk(
  'sanck_items/fetch_item',
  async id => {
    const docRef = doc(db, 'snackItems', id);
    try {
      const item = await getDoc(docRef);
      return item;
    } catch (error) {
      console.log({ error });
    }
  }
);

export const addSnacksItem = createAsyncThunk(
  'sanck_items/add_item',
  async ({ formData, reset }) => {
    try {
      const item = await addDoc(itemsRef, formData);
      reset();
      toast.success('Successfully created.');
      return item;
    } catch (error) {
      console.log({ error });
    }
  }
);

export const updateSnacksItem = createAsyncThunk(
  'sanck_items/update_item',
  async ({ itemId, formData }) => {
    const docRef = doc(db, 'snackItems', itemId);
    try {
      const item = await updateDoc(docRef, formData);
      toast.success('Successfully updated.');
      return item;
    } catch (error) {
      console.log({ error });
    }
  }
);

export const deleteSnacksItem = createAsyncThunk(
  'sanck_items/delete_item',
  async id => {
    const docRef = doc(db, 'snackItems', id);
    try {
      const item = await deleteDoc(docRef);
      toast.success('Successfully deleted.');
      return item;
    } catch (error) {
      console.log({ error });
    }
  }
);

export const snackItemsSlice = createSlice({
  name: 'snackItems',
  initialState: {
    snackItems: [],
    lunchItems: [],
    item: {},
    fetching: false,
    loading: false
  },
  reducers: {
    resetItem: state => {
      state.item = {};
    },
    setSnacksItemsLoadingTrue: state => {
      state.loading = true;
    },
    setFetchingTrue: state => {
      state.fetching = true;
    },
    setLoadingFalse: state => {
      state.loading = false;
    },
    setFetchingFalse: state => {
      state.fetching = false;
    },
    itemsfetched: (state, { payload }) => {
      const snackItems = payload.filter(item => item.type === 'snack');
      const lunchItems = payload.filter(item => item.type === 'lunch');
      state.snackItems = snackItems;
      state.lunchItems = lunchItems;
      state.fetching = false;
      state.loading = false;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchSnacksItem.pending, state => {
        state.loading = true;
      })
      .addCase(fetchSnacksItem.fulfilled, (state, action) => {
        state.loading = false;
        state.item = getFsData(action.payload);
      })
      .addCase(addSnacksItem.pending, state => {
        state.loading = true;
      })
      .addCase(addSnacksItem.fulfilled, state => {
        state.loading = false;
      })
      .addCase(updateSnacksItem.pending, state => {
        state.loading = true;
      })
      .addCase(updateSnacksItem.fulfilled, state => {
        state.loading = false;
      })
      .addCase(deleteSnacksItem.pending, state => {
        state.loading = true;
      })
      .addCase(deleteSnacksItem.fulfilled, state => {
        state.loading = false;
      });
  }
});

export const {
  setSnacksItemsLoadingTrue,
  setFetchingTrue,
  setLoadingFalse,
  setFetchingFalse,
  itemsfetched,
  resetItem
} = snackItemsSlice.actions;

export default snackItemsSlice.reducer;
