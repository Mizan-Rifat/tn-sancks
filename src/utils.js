import dayjs from 'dayjs';

export const capitalizeFirstLetter = string =>
  string.charAt(0).toUpperCase() + string.slice(1);

export const getFsData = doc => ({ ...doc.data(), id: doc.id });

export const groupBy = (items, key) =>
  items.reduce(
    (result, item) => ({
      ...result,
      [item[key]]: [...(result[item[key]] || []), item]
    }),
    {}
  );

export const formatDate = (date, showYears) => {
  const format = `DD MMM${showYears ? ', YYYY' : ''}`;
  return dayjs(date).format(format);
};

export const getTotal = (arr, field) =>
  arr.reduce((acc, val) => acc + val[field], 0);

export const getParseObject = object => ({
  id: object.id,
  ...object.attributes
});
export const getParseObjects = objects =>
  objects.map(object => getParseObject(object));

export const onSubscribe = (subscription, actions) => {
  const actionNames = Object.keys(actions);
  actionNames.forEach(actionName => {
    subscription.on(actionName, payload => {
      console.log({ payload });
      console.log(actions);
      actions[actionName](payload);
    });
  });
};
