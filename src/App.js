import React, { useEffect, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from './assets/theme/theme';
import { CssBaseline } from '@mui/material';
import Layout from 'layouts/Layout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from 'pages/main/home/Home';
import AdminHome from 'pages/admin/home/AdminHome';
import Orders from 'pages/admin/orders/OrdersList';
import ConfirmationProvider from 'providers/ConfirmationProvider';

import Items from 'pages/admin/items/Items';
import PutItem from 'pages/admin/items/PutItem';
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Users from 'pages/admin/users/Users';
import { auth } from 'firebaseApp/firebase';
import { setCurrentUser } from 'redux/slices/usersSlice';
import { useDispatch } from 'react-redux';
import Login from 'pages/Login';
import SnackOrdersHistory from 'pages/admin/history/SnackOrdersHistory';
import AuthProtectedRoute from 'components/auth/AuthProtectedRoute';
import AdminProtectedRoute from 'components/auth/AdminProtectedRoute';
import Register from 'pages/Register';
import Test from 'Test';
import Parse from 'parse';
import { getParseObject } from 'utils';
import { fetchOrderRequests } from 'redux/slices/orderRequestsSlice';

const App = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentUser = Parse.User.current();
    dispatch(setCurrentUser(getParseObject(currentUser)));
    console.log({ currentUser });

    console.log('fetching orderReq');
    dispatch(fetchOrderRequests());
  }, []);

  return (
    <>
      <ThemeProvider theme={theme}>
        <ConfirmationProvider>
          <CssBaseline />
          {!loading && (
            <BrowserRouter basename="/tn-sancks">
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route path="login" element={<Login />} />
                  <Route path="test" element={<Test />} />
                  <Route path="register" element={<Register />} />
                  <Route element={<AuthProtectedRoute />}>
                    <Route index element={<Home />} />
                    <Route path="myorder" element={<AdminHome />} />
                    <Route
                      path="orders/history"
                      element={<SnackOrdersHistory />}
                    />
                    <Route
                      path="orders/history/self"
                      element={<SnackOrdersHistory self={true} />}
                    />
                    <Route element={<AdminProtectedRoute />}>
                      <Route path="admin" element={<AdminHome />} />
                      <Route path="admin/users" element={<Users />} />
                      <Route path="admin/orders" element={<Orders />} />

                      <Route path="admin/items" element={<Items />} />
                      <Route path="admin/items/add" element={<PutItem />} />
                      <Route
                        path="admin/items/edit/:item"
                        element={<PutItem />}
                      />
                    </Route>
                  </Route>
                </Route>
              </Routes>
            </BrowserRouter>
          )}
          <ToastContainer
            transition={Slide}
            position="top-right"
            autoClose={4000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            draggable
            pauseOnHover
          />
        </ConfirmationProvider>
      </ThemeProvider>
    </>
  );
};

export default App;
