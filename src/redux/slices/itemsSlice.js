import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getParseObject, getParseObjects, onSubscribe } from 'utils';
import defaultExtraReducers from './defaultExtraReducers';
import { toast } from 'react-toastify';
import Parse from 'parse';

export const fetchItems = createAsyncThunk(
  'items/items/fetch',
  async (_, { rejectWithValue, dispatch }) => {
    const itemsQuery = new Parse.Query('Items');
    const subscription = await itemsQuery.subscribe();

    onSubscribe(subscription, {
      create: payload =>
        dispatch(itemsSlice.actions.itemAdded(getParseObject(payload))),
      update: payload =>
        dispatch(itemsSlice.actions.itemUpdated(getParseObject(payload)))
    });

    try {
      const res = await itemsQuery.find();
      const items = getParseObjects(res);
      return items;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchItem = createAsyncThunk('items/item/fetch', async id => {
  const itemQuery = new Parse.Query('Items');
  const item = await itemQuery.get(id);
  return getParseObject(item);
});

export const addItem = createAsyncThunk(
  'items/item/add',
  async ({ formData }) => {
    try {
      const Item = Parse.Object.extend('Items');
      const item = new Item();
      await item.save(formData);
      itemsSlice.actions.itemUpdated(getParseObject(item));
      toast.success('Successfully created.');
      return item;
    } catch (error) {
      console.log({ error });
    }
  }
);

export const updateItem = createAsyncThunk(
  'items/item/update',
  async ({ itemId, formData }) => {
    try {
      const Item = Parse.Object.extend('Items');
      const item = new Item();
      item.id = itemId;
      item.save(formData);
      toast.success('Successfully updated.');
      return item;
    } catch (error) {
      console.log({ error });
    }
  }
);

export const deleteItem = createAsyncThunk(
  'items/item/delete',
  async itemId => {
    try {
      const itemQuery = new Parse.Query('Items');
      const item = await itemQuery.get(itemId);
      await item.destroy();
      toast.success('Successfully deleted.');
      return itemId;
    } catch (error) {
      console.log({ error });
    }
  }
);

export const itemsSlice = createSlice({
  name: 'items',
  initialState: {
    items: [],
    item: {},
    fetching: false,
    loading: false
  },
  reducers: {
    resetItem: state => {
      state.item = {};
    },
    itemUpdated: (state, { payload }) => {
      state.items = state.items.map(item =>
        item.id === payload.id ? payload : item
      );
    },
    itemAdded: (state, { payload }) => {
      state.items.push(payload);
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchItems.fulfilled, (state, { payload }) => {
        state.items = payload;
      })
      .addCase(fetchItem.fulfilled, (state, { payload }) => {
        state.item = payload;
      })
      .addCase(deleteItem.fulfilled, (state, { payload }) => {
        state.items = state.items.filter(item => item.id !== payload);
        state.loading = false;
      });

    defaultExtraReducers(builder);
  }
});

export const { resetItem } = itemsSlice.actions;

export default itemsSlice.reducer;
