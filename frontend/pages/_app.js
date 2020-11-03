import '../styles/core.scss';
import { useRouter } from 'next/router';
import UserContext from '../functions/context';
import { useState, useEffect} from 'react';
var assert = require('assert');

function MyApp({ Component, pageProps }) {

  const Router = useRouter();
  const [user, setUser] = useState(null);

  const login = (userMail) => {
    setUser(userMail);
    return;
  }

  const logout = (route='/logOut') => {
    login(null);
    document.cookie = 'aip_fp=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    Router.push(route);
    return;
  }

  const sessionCheck = (route='/') => {
    let cookie = decodeURIComponent(document.cookie).substring(7);

    try {
      cookie = JSON.parse(cookie);
      assert(Object.keys(cookie).length === 2);
      assert(Object.keys(cookie).includes('email'));
      assert(Object.keys(cookie).includes('loginToken'));
      login(cookie.email);
      return true;
    } catch (err){
      logout(route);
      return false;
    }
  }

  useEffect(() => {
    // sessionCheck(); //this runs on all pages, wrongly forcing /register and /login to /
  }, [])

  return (
    <UserContext.Provider value={{ user: user, login: login, logout: logout, sessionCheck: sessionCheck }}>
      <Component {...pageProps} />
    </UserContext.Provider>
  );
}
export default MyApp
