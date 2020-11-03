import '../styles/core.scss';
import { useRouter } from 'next/router';
import UserContext from '../functions/context';
import { useState, useEffect} from 'react';
var assert = require('assert');

function MyApp({ Component, pageProps }) {

  const Router = useRouter();
  const [user, setUser] = useState(null);

  function parse_cookie(){
    try {
      let cookie = decodeURIComponent(document.cookie).substring(7);
      cookie = JSON.parse(cookie);
      assert(Object.keys(cookie).length === 2);
      assert(Object.keys(cookie).includes('email'));
      assert(Object.keys(cookie).includes('loginToken'));
      return cookie;
    } catch (err){
      return false;
    }
  }

  //this function is used to set global variable 'user' (and then populate topNavbar with "signed in as {email}" )
  const login = () => { 
    let cookie = parse_cookie();
    if (cookie)
      setUser(cookie.email);
    else setUser(null);
    return;
  }

  const logout = () => {
    setUser(null);
    document.cookie = 'aip_fp=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    Router.push('/logOut');
    return;
  }

  //this function is used to distinguish loggedIn and annonymous users
  //manually called in a page to re-route as desired
  const sessionCheck = () => {
    let cookie = parse_cookie();
    if (cookie)
      return true;
    return false;
  }

  useEffect(() => {
    login(); //runs on all pages
  }, [])

  return (
    <UserContext.Provider value={{ user: user, login: login, logout: logout, sessionCheck: sessionCheck }}>
      <Component {...pageProps} />
    </UserContext.Provider>
  );
}
export default MyApp
