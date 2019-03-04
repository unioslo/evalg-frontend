import jwtDecode from 'jwt-decode';
import { userLogin } from '../actions/auth';

export const getToken = (store) =>
  (nextState, replace) => {
    const token = nextState.location.search.split('token=')[1];
    if (!token) {
      replace('/login');
    }
    try {
      const decodedToken = jwtDecode(token);
      const userData = Object.assign({}, decodedToken, { token });
      store.dispatch(userLogin(userData, replace));
    }
    catch (SyntaxError) {
      replace('/login');
    }
  };
