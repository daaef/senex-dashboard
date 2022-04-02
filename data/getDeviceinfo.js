export default async function(email)  {
  const client = new window.ClientJS()
  let f = await getFingerPrint(email, client.getDevice(), client.getBrowser(), client.getOS(), client.getCPU())
  return {
    userAgent: client.getUserAgent(),
    browser: client.getBrowser(),
    os: client.getOS(),
    device: client.getDevice(),
    deviceType: client.getDeviceType(),
    deviceVendor: client.getDeviceVendor(),
    cpu: client.getCPU(),
    fingerprint: ''+f,
    timezone: client.getTimeZone(),
    language: client.getLanguage()
  }
    // console.log(f)   
};

async function getFingerPrint(email, device, browser, os, cpu) {
  let message = device + browser + os + cpu
  const secret = email ? email : 'SenexPay'
  const enc = new TextEncoder("utf-8");
  const algorithm = { name: "HMAC", hash: "SHA-256" };
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    algorithm,
    false, ["sign", "verify"]
  );
  return crypto.subtle.sign(
    algorithm.name, 
    key, 
    enc.encode(message)
  ).then(hashBuffer => {
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(
        b => b.toString(16).padStart(2, '0')
    ).join('');
    return hashHex;
  });
  
  // return hashHex;
}