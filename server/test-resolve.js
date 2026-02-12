const dns = require('dns');
const dnsPromises = dns.promises;
const host = process.env.ATLAS_HOST || 'webodise.qycydsm.mongodb.net';

// Try setting public DNS servers for this test run
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
  console.log('Test: Node DNS servers set to', dns.getServers());
} catch (e) {
  console.warn('Test: could not set DNS servers', e && e.message);
}

(async () => {
  try {
    console.log('Resolving SRV for _mongodb._tcp.' + host);
    const res = await dnsPromises.resolveSrv('_mongodb._tcp.' + host);
    console.log('SRV result:', res);
  } catch (err) {
    console.error('Resolve error:', err);
  }
})();
