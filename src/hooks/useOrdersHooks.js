import { useEffect } from 'react';
import { useConfirmation } from 'providers/ConfirmationProvider';
import { db } from 'firebaseApp/firebase';
import { useDispatch, useSelector } from 'react-redux';
import {
  itemsfetched,
  setSnacksItemsLoadingTrue
} from 'redux/slices/snackItemsSlice';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { getFsData } from 'utils';
import {
  ordersFetched,
  setUserOrders,
  deleteUserSnackOrder,
  setCurrentUserOrders,
  setOrders
} from 'redux/slices/snackOrdersSlice';
import { usersfetched } from 'redux/slices/usersSlice';

const getTotalPrice = items =>
  items.reduce((acc, val) => acc + Number(val.qty * val.price), 0);

const useOrdersHook = () => {
  const itemsRef = collection(db, 'snackItems');
  const snackOrdersRef = collection(db, 'snackOrders');
  const usersRef = collection(db, 'users');

  const confirm = useConfirmation();

  const { snackItems, lunchItems } = useSelector(state => state.snackItems);
  const { users, currentUser } = useSelector(state => state.users);

  const dispatch = useDispatch();

  const handleDeleteOrder = async id => {
    try {
      await confirm({
        variant: 'error',
        description: 'Are you sure you want to cancel this order?'
      });
      dispatch(deleteUserSnackOrder(id));
    } catch (error) {
      console.log('no');
    }
  };

  useEffect(async () => {
    const snackOrderQ = query(snackOrdersRef, where('status', '==', true));

    onSnapshot(snackOrderQ, snapshot => {
      const orders = snapshot.docs.map(doc => getFsData(doc));

      // console.log({ orders });

      const orderItems = orders.map(order => {
        if (order.type === 'lunch') {
          return {
            ...order,
            items: order.items.map(item =>
              lunchItems.find(lunchItem => lunchItem.id === item)
            )
          };
        }
        return order;
      });

      console.log({ orders, orderItems });

      // dispatch(ordersFetched({ snackOrder, lunchOrder }));
      dispatch(ordersFetched(orderItems));

      if (orders.length > 0) {
        orders.map(order => {
          const userOrdersRef = collection(
            db,
            `/snackOrders/${order.id}/userOrders`
          );
          onSnapshot(userOrdersRef, snapshot => {
            const uOrders = snapshot.docs.map(doc => getFsData(doc));
            // console.log({ uOrders });

            const orderItems = uOrders.map(uOrder => ({
              user: users.find(user => user.id === uOrder.uid)?.name,
              ...(order.type === 'lunch' ? lunchItems : snackItems).find(
                item => item.id === uOrder.itemId
              ),
              ...uOrder
            }));
            // console.log({ type: order.type, orderItems });

            const currentUserSnackOrders = orderItems.filter(
              item => item.uid === currentUser.id
            );
            dispatch(
              setOrders({
                orderItems,
                currentUserSnackOrders,
                type: order.type === 'snack' ? 'snack' : 'lunch'
              })
            );
          });
        });
      }
    });

    if (!snackItems.length) {
      dispatch(setSnacksItemsLoadingTrue());
      onSnapshot(itemsRef, snapshot => {
        const items = snapshot.docs.map(doc => getFsData(doc));
        dispatch(itemsfetched(items));
      });
    }

    if (!users.length) {
      onSnapshot(usersRef, snapshot => {
        const users = snapshot.docs.map(doc => getFsData(doc));
        dispatch(usersfetched(users));
      });
    }
  }, [snackItems, users]);

  return {
    getTotalPrice,
    handleDeleteOrder
  };
};

export default useOrdersHook;
