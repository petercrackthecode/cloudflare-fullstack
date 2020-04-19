const URL = "https://cfw-takehome.developers.workers.dev/api/variants",
      DEFAULT_EXPIRY_DAYS= 1;

addEventListener("fetch", async (event) => {
  event.respondWith(handleRequest(event.request));
});

const getVariant = async (variantId) => {
  return (Math.round(Math.random()) < 0.5) ? (await fetch(URL + `/${variantId}`))
                                           : (await fetch(URL + `/${variantId}`));
};

const getNewExpiryDate= (expiryDays) => {

}

const takeVariant= () => {
  return "hello";
}

const parseVariantIdFromCookie= (cookie) {
  if (!cookie) return "";

  
}

const resetCookie= (cookie) => {
  cookie= `variant=`
}

const responseCreator = async (request) => {
  let cookie= request.headers.get('cookie');
  let randomId= Math.round(Math.random()) < 0.5 ? 1 : 2;
  let response;
  // check if the cookie exists. If it does, parse the cookie and call the variant from that
  // if cookie exist, we parse it, then reset it to a new expiry date.
  if (cookie) {
    cookie= resetCookie(cookie);
  }
  else {
    cookie= `variant=${URL + "/" + randomId}; Expires=${getNewExpiryDate(DEFAULT_EXPIRY_DAYS)}; Path=/`;
  }
};

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  // const { variants } = await fetch(URL).then((res) => res.json());

  const cookie= request.headers.get('cookie');
  console.log(cookie);

  return new Response(takeVariant(), {
    headers: { "content-type": "text/plain" },
  });
}
