const crypto = require("crypto");

function pki_verify(test, signature, digest){
    console.log(crypto.getHashes());

    const verify = crypto.createVerify(digest);
    verify.write(test);
    verify.end();
    return verify.verify(
`-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzOXTe426cU9oVoBcR/0N
Mjn0anfSJ6DIikgbVcuIA3Tha4Ke2RiJN6MNnDyR3qDjGpvcmqNSZ9ezdF2bJEux
HBhlSaNEGVewjckppWjMXCIQQ6xo5k7NiZAR3ObEPiBrAERshFaIKYPY2AuK22XW
p4TVe9cqIM7PgOh3qGFEJ2s3zS+lFvw0d8ZKMWrYIiwLV3PyvG+wtCH1haD/g7lJ
c4ET+PRqjndliVbNj2Z0t0rCtUJKvPBPvClPkpUqdYfGhA4U8Hgkzvnlyn1JUYmv
jF0F6ZMLBAr7nhn1sLzAbFeLsFMAWcxzIhNrqO0vIKmgVbwkvtv5/LCE/JGGYjkd
IwIDAQAB
-----END PUBLIC KEY-----`, 
        signature, 'hex');
}

module.exports = {
    pki_verify: pki_verify,
}