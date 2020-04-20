const URL = "https://cfw-takehome.developers.workers.dev/api/variants",
  DEFAULT_EXPIRY_DAYS = 1;

addEventListener("fetch", async (event) => {
  event.respondWith(handleRequest(event.request));
});

/** 
 * reset the current cookie to be expired after a certain expiry Days
 * @param {Number} expiryDays
*/
const getNewExpiryDate = (expiryDays) => {
  let date = new Date();
  date.setTime(date.getTime() + expiryDays * 24 * 60 * 60 * 1000);
  return date.toGMTString();
};

/** 
 * parse and return the URL from a cookie
 * @param {Cookie} cookie
*/
const parseURL = (cookie) => {
  const urlRegex = /(?<=variant=)\S+/;
  let url = cookie.match(urlRegex)[0];

  return url;
};

/** 
 * fetch a response from an url in a cookie, and return that response.
 * @param {Cookie} cookie
*/
const getResponseFromCookie = async (cookie) => {
  const urlRegex = /(?<=variant=)\S+(?=;)/;
  let url = cookie.match(urlRegex)[0];

  let response = await fetch(url);
  return response;
};

/** 
 * reset the current cookie to be expired after 1 day.
 * @param {Cookie} cookie
*/
const resetCookie = (cookie) => {
  cookie = `variant=${parseURL(cookie)}; Expires=${getNewExpiryDate(
    DEFAULT_EXPIRY_DAYS
  )}; Path=/`;
  return cookie;
};


/**
 * generate and return a response from the request cookie header if the cookie exist
 * if the cookie does not exist, create a cookie header and generate the response from that.
 * @param {Request} request
 */
const responseCreator = async (request) => {
  let cookie = request.headers.get("cookie");
  let response;
  // check if the cookie exists. If it does, parse the cookie and call the variant from that
  // if a cookie exist, we parse it, then reset it to a new expiry date.
  if (cookie !== null && cookie.includes(`variant=`)) {
    console.log(`cookie includes variant`);
    cookie = resetCookie(cookie);
    response = await getResponseFromCookie(cookie);
  } else {
    // else if the cookie does not exist, we create a new cookie.
    let randomId = Math.round(Math.random()) < 0.5 ? 0 : 1;
    let {variants} = await fetch(URL).then(res => res.json());
    response = await fetch(variants[randomId]);
    cookie = `variant=${variants[randomId]}; Expires=${getNewExpiryDate(DEFAULT_EXPIRY_DAYS)}; Path=/`;
  }

  return new Response(await response.body, {
    headers: { "Set-Cookie": cookie },
  });
};

class ElementHandler {
  element(element) {
    switch (element.tagName) {
      case "title":
        element.setInnerContent(
          "Peter Nguyen's Cloudflare Fullstack Challenge"
        );
        break;
      case "h1":
        element.prepend(`This is `);
        break;
      case "p":
        element.setInnerContent(
          " Cookie will automatically expire after one day from now. To reset the cookie, delete it manually in storage."
        );
        element.prepend("The cookie is saved, you will get the same variant if you re-open this website in this browser.");
        element.after("<p>Hi, my name is <span style='color: blue; font-weight: 600; font-style: italic;'>Peter Nguyen</span>. Thank you for this fun challenge. Wanna have a coffee chat with me? Click the link below!</p>", {html: true});
        break;
      case "a":
        element.setInnerContent("Meet Peter!");
        element.setAttribute(
          "href",
          "https://petercrackthecode.github.io/portfolioPeter"
        );
        break;
      case "body":
        let footer =
          `<div id='cookie-message' style='position: fixed; bottom: 0px; right: 0px; padding-bottom: 5px; display: grid; color: white; width: 100vw; height: 30px; background-color: green; justify-items: center;'>This website uses cookie to enhance users\' experience</div>`;
        element.after(footer, { html: true });
        break;
      default:
        break;
    }
  }
}

/**
 * fetch a HTML resource as a response from an URL, then manipulate that response and return it.
 * @param {Request} request
 */
async function handleRequest(request) {
  return new HTMLRewriter()
    .on("*", new ElementHandler())
    .transform(await responseCreator(request));
}
