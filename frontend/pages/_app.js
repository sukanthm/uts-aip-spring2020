import '../styles/core.scss';
import { useRouter } from 'next/router';
import UserContext from '../functions/context';
import { useState } from 'react';
var assert = require('assert');

function MyApp({ Component, pageProps }) {

  const publicKey = 
`-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzOXTe426cU9oVoBcR/0N
Mjn0anfSJ6DIikgbVcuIA3Tha4Ke2RiJN6MNnDyR3qDjGpvcmqNSZ9ezdF2bJEux
HBhlSaNEGVewjckppWjMXCIQQ6xo5k7NiZAR3ObEPiBrAERshFaIKYPY2AuK22XW
p4TVe9cqIM7PgOh3qGFEJ2s3zS+lFvw0d8ZKMWrYIiwLV3PyvG+wtCH1haD/g7lJ
c4ET+PRqjndliVbNj2Z0t0rCtUJKvPBPvClPkpUqdYfGhA4U8Hgkzvnlyn1JUYmv
jF0F6ZMLBAr7nhn1sLzAbFeLsFMAWcxzIhNrqO0vIKmgVbwkvtv5/LCE/JGGYjkd
IwIDAQAB
-----END PUBLIC KEY-----`
    ;
  function str2ab(str) {
    var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }
  function removeLines(str) {
    return str.replace(/[\r\n]/g, "");
  }
  function base64ToArrayBuffer(b64) {
    var byteString = window.atob(b64);
    var byteArray = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      byteArray[i] = byteString.charCodeAt(i);
    }
    return byteArray;
  }
  function pemToArrayBuffer(pem) {
    var b64Lines = removeLines(pem);
    var b64Prefix = b64Lines.replace('-----BEGIN PUBLIC KEY-----', '');
    var b64Final = b64Prefix.replace('-----END PUBLIC KEY-----', '');
    return base64ToArrayBuffer(b64Final);
  }

  const Router = useRouter();
  const [user, setUser] = useState(null);

  //deletes malformed cookies
  function parse_cookie() {
    try {
      let cookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('aip_fp'))
        .split('=')[1];
      cookie = JSON.parse(decodeURIComponent(cookie));
      assert(Object.keys(cookie).length === 3);
      assert(Object.keys(cookie).includes('email'));
      assert(Object.keys(cookie).includes('loginToken'));
      assert(Object.keys(cookie).includes('signature'));
      return cookie;
    } catch (err) {
      document.cookie = 'aip_fp=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      return false;
    }
  }

  //this function is used to set global variable 'user' (and then populate topNavbar with "signed in as {email}" )
  const login = () => {
    let cookie = parse_cookie();
    if (cookie)
      setUser(cookie.email);
    else
      setUser(null);
    return cookie;
  }

  const logout = () => {
    setUser(null);
    document.cookie = 'aip_fp=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    Router.push('/logOut');
    return;
  }

  //this function is used to distinguish loggedIn and annonymous users
  //manually called in a page to re-route users
  //whoIsAllowed is one of ['annonymous', 'loggedIn'], default = ''
  const sessionCheck = (whoIsAllowed='') => {
    let cookie = login();

      window.crypto.subtle.importKey(
        "spki",
        pemToArrayBuffer(publicKey),
        {
            name: "RSASSA-PKCS1-v1_5",
            hash: {name: "SHA-256"},
        },
        true,
        ["verify"]
    ).then(function(importedKey) {
      window.crypto.subtle.verify(
        "RSASSA-PKCS1-v1_5",
        importedKey,
        str2ab(cookie.signature),
        str2ab(cookie.email+cookie.loginToken),
      ).then((result)=>{
        console.log(result);
      });
    }).catch(function(err) {
        console.log(err);
    });


    if (whoIsAllowed == 'annonymous' && cookie) {
      //visitng annonymous only page with cookie
      Router.push('/');
      return false;
    }
    if (whoIsAllowed == 'loggedIn' && !cookie) {
      //visitng loggedIn only page without cookie
      Router.push('/login');
      return false;
    }
    //visitng [globally allowed page, annonymous only page without cookie, loggedIn only page with cookie]
    return true;
  }

  return (
    <UserContext.Provider value={{ user: user, login: login, logout: logout, sessionCheck: sessionCheck }}>
      <Component {...pageProps} />
    </UserContext.Provider>
  );
}
export default MyApp
