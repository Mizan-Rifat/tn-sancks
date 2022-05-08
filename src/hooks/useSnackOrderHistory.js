import { collection, onSnapshot } from 'firebase/firestore';
import { db } from 'firebaseApp/firebase';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setCompletedSnackOrders,
  setCurrentUserCompletedSnackOrders
} from 'redux/slices/snackOrdersSlice';
import { getFsData } from 'utils';

const useSnackOrdersHistory = () => {
  const completedSnackOrdersRef = collection(db, 'completedSnackOrders');
  const { currentUser } = useSelector(state => state.users);

  const dispatch = useDispatch();
  useEffect(async () => {
    onSnapshot(completedSnackOrdersRef, snapshot => {
      const orders = snapshot.docs.map(doc => {
        return {
          ...getFsData(doc)
        };
      });

      const currentUserSnackOrders = orders.filter(
        item => item.userId === currentUser.id
      );
      dispatch(setCurrentUserCompletedSnackOrders(currentUserSnackOrders));
      dispatch(setCompletedSnackOrders(orders));
    });
  }, []);
};

export default useSnackOrdersHistory;
