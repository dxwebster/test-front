import axios from 'axios';

const api = axios.create({
  baseURL: 'http://www.mocky.io/v2/5b15c4923100004a006f3c07'
});

api.registerInterceptWithStore = (store) => {
  api.interceptors.response.use(
    (response) => {
      const { data } = response;
      if (data && !data.success && (data.httpStatusCode === 403 || data.httpStatusCode === 401)) alert('SignOut');
      return response;
    },
    (err) => {
      if (err.response.status === 403 || err.response.status === 401) alert('SignOut');
      return err;
    }
  );
};

export default api;
