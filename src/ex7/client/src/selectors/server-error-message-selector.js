const serverError = state => state.serverError;

export const getServerErrorMessage = state => serverError(state).message;
