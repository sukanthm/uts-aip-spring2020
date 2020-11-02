import '../styles/core.scss';
import { useRouter } from 'next/router';
import UserContext from '../functions/context';
import { useState, useEffect} from 'react';

function MyApp({ Component, pageProps }) {

  const Router = useRouter();
  const [user, setUser] = useState(null);

  const login = (userMail) => {
    setUser(userMail);
    // Router.push('/');
  }

  const logout = () => {
    setUser(null);
    document.cookie = 'aip_fp=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    Router.push("/logOut");
  }

  const sessionCheck = () => {
    const cookie = decodeURIComponent(document.cookie).substring(7);
    if(cookie.trim() == ""){
      setUser(null);
      Router.push("/");
      return false;
    }
    return true;
  }

  useEffect(() => {
    const cookie = decodeURIComponent(document.cookie).substring(7);
    if(cookie.trim() != ""){
      const userMail = JSON.parse(cookie).email;
      setUser(userMail);
    }
  }, [])


  return (
    <UserContext.Provider value={{ user: user, login: login, logout: logout, sessionCheck: sessionCheck }}>
      <Component {...pageProps} />
    </UserContext.Provider>
  );

}

export default MyApp
