import crypto from 'crypto';

const generateKeys = (prefix: string) => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', {
        namedCurve: 'P-256',
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });
    return { prefix, publicKey, privateKey };
};

const keys = [generateKeys('jwt-access'), generateKeys('jwt-refresh')];

keys.forEach(({ prefix, publicKey, privateKey }) => {
    console.log(`${prefix.toUpperCase().replace('-', '_')}_PRIVATE_KEY="${privateKey.trim()}"\n`);
    console.log(`${prefix.toUpperCase().replace('-', '_')}_PUBLIC_KEY="${publicKey.trim()}"\n`);
});
