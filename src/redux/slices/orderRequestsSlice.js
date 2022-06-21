import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getParseObject, getParseObjects, onSubscribe } from 'utils';
import defaultExtraReducers from './defaultExtraReducers';
import { toast } from 'react-toastify';
import Parse from 'parse';

const setSnackRequest = createAction('orderRequests/snackRequest/set');

export const fetchOrderRequests = createAsyncThunk(
  'orderRequests/requests/fetch',
  async (_, { rejectWithValue, dispatch }) => {
    const snackRequestsQuery = new Parse.Query('OrderRequests');
    snackRequestsQuery.equalTo('type', 'snack');
    snackRequestsQuery.equalTo('status', true);

    const subscription = await snackRequestsQuery.subscribe();
    const subscribeAction = payload => {
      dispatch(setSnackRequest(getParseObject(payload)));
    };
    onSubscribe(subscription, {
      create: subscribeAction,
      enter: subscribeAction,
      leave: () => dispatch(setSnackRequest(getParseObject(null))),
      update: subscribeAction
    });

    try {
      const res = await snackRequestsQuery.first();
      console.log({ req: res });
      const items = res.relation('items');
      console.log({ items });
      const dasa = await items.query().find();
      console.log({ dasa });
      if (res) {
        const request = getParseObject(res);
        dispatch(setSnackRequest(getParseObject(res)));
        return { snackRequest: request };
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const orderRequestsSlice = createSlice({
  name: 'orderRequests',
  initialState: {
    snackRequest: null,
    fetching: false,
    loading: false
  },
  reducers: {
    resetItem: state => {
      state.item = {};
    },
    requestAdded: (state, { payload }) => {
      state.items.push(payload);
    }
  },

  extraReducers: builder => {
    builder.addCase(setSnackRequest, (state, { payload }) => {
      console.log('sdfsd');
      state.snackRequest = payload;
    });

    defaultExtraReducers(builder);
  }
});

// export const { resetItem } = orderRequestsSlice.actions;

export default orderRequestsSlice.reducer;
