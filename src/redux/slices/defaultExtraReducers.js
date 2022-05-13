export default builder => {
  builder
    .addMatcher(
      action => action.type.endsWith('fetch/pending'),
      state => {
        state.fetching = true;
      }
    )
    .addMatcher(
      action =>
        action.type.endsWith('update/pending') ||
        action.type.endsWith('delete/pending'),
      state => {
        state.loading = true;
      }
    )
    .addMatcher(
      action =>
        action.type.endsWith('update/fulfilled') ||
        action.type.endsWith('delete/fulfilled'),
      state => {
        state.loading = false;
      }
    )
    .addMatcher(
      action => action.type.endsWith('fetch/fulfilled'),
      state => {
        state.fetching = false;
      }
    )
    .addMatcher(
      action => action.type.endsWith('/rejected'),
      state => {
        state.loading = false;
        state.fetching = false;
      }
    );
};
