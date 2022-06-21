import { configureStore } from '@reduxjs/toolkit';
import snackItemsReducer from './slices/snackItemsSlice';
import snackOrdersReducer from './slices/snackOrdersSlice';
import usersReducer from './slices/usersSlice';
import itemsReducer from './slices/itemsSlice';
import requestsReducer from './slices/orderRequestsSlice';

export default configureStore({
  reducer: {
    items: itemsReducer,
    snackItems: snackItemsReducer,
    snackOrders: snackOrdersReducer,
    users: usersReducer,
    orderRequests: requestsReducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});
