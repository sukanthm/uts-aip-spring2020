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
    Router.push("/");
  }

  useEffect(() => {
    const cookie = decodeURIComponent(document.cookie).substring(7);
    console.log("check rahe initially", cookie);
    if(cookie.trim() != ""){
      const userMail = JSON.parse(cookie).email;
      setUser(userMail);
    }
  }, [])


  return (
    <UserContext.Provider value={{ user: user, login: login, logout: logout }}>
      <Component {...pageProps} />
    </UserContext.Provider>
  );

}

export default MyApp
