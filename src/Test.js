import Parse from 'parse';
import React, { useEffect } from 'react';

const Test = () => {
  useEffect(async () => {
    // const Items = Parse.Object.extend('Items');
    const itemsQuery = new Parse.Query('Items');
    const subscription = await itemsQuery.subscribe();
    subscription.on('open', () => {
      console.log('opend');
    });
    subscription.on('create', obj => {
      console.log({ obj });
    });
    const items = await itemsQuery.find();

    console.log({ items });
  }, []);

  return <div>Test</div>;
};

export default Test;
