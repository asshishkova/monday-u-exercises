const getSearch = state => state.search;

export const getSearchStatus = state => getSearch(state).searchIsActive;
