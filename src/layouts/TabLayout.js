import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

export default function TabLayout({ snackComponent, lunchComponent }) {
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ mb: 2 }}>
          <TabList
            onChange={handleChange}
            aria-label="lab API tabs example"
            centered
          >
            <Tab label="Snacks" value="1" />
            <Tab label="Lunch" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1" sx={{ p: 0 }}>
          {snackComponent}
        </TabPanel>
        <TabPanel value="2" sx={{ p: 0 }}>
          {lunchComponent}
        </TabPanel>
      </TabContext>
    </Box>
  );
}
