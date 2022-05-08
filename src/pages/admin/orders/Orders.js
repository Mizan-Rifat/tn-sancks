import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import SnacksOrderList from './SnacksOrdersList';
import LunchOrderList from './LunchOrderList';
import TabLayout from 'layouts/TabLayout';

export default function Orders() {
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <TabLayout
      snackComponent={<SnacksOrderList />}
      lunchComponent={<LunchOrderList />}
    />
  );
}
