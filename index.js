const URL = "https://cfw-takehome.developers.workers.dev/api/variants",
  DEFAULT_EXPIRY_DAYS = 1;

addEventListener("fetch", async (event) => {
  event.respondWith(handleRequest(event.request));
});

const getVariant = async (variantId) => {
  return Math.round(Math.random()) < 0.5
    ? await fetch(URL + `/${variantId}`)
    : await fetch(URL + `/${variantId}`);
};

const getNewExpiryDate = (expiryDays) => {
  let date = new Date();
  date.setTime(date.getTime() + expiryDays * 24 * 60 * 60 * 1000);
  return date.toGMTString();
};

const takeVariant = () => {
  return "hello";
};

const getResponseFromCookie = async (cookie) => {
  const urlRegex = /(?<=variant=)\S+(?=;)/;
  let url = cookie.match(urlRegex)[0];

  let response = await fetch(url);
  return response;
};

const resetCookie = (cookie) => {
  const urlRegex = /(?<=variant=)\S+(?=;)/;
  let url = cookie.match(urlRegex)[0];

  cookie = `variant=${url}; Expires=${getNewExpiryDate(
    DEFAULT_EXPIRY_DAYS
  )}; Path=/`;
  return cookie;
};

const responseCreator = async (request) => {
  let cookie = request.headers.get("cookie");
  let response;
  // check if the cookie exists. If it does, parse the cookie and call the variant from that
  // if cookie exist, we parse it, then reset it to a new expiry date.
  if (cookie) {
    cookie = resetCookie(cookie);
    response = await getResponseFromCookie(cookie);
  } else {
    let randomVariant = Math.round(Math.random()) < 0.5 ? 1 : 2;
    response = fetch(url + `/${randomVariant}`);
    cookie = `variant=${URL + "/" + randomVariant}; Expires=${getNewExpiryDate(
      DEFAULT_EXPIRY_DAYS
    )}; Path=/`;
  }

  return new Response(response.body, {
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
        element.setInnerContent(`My custom variant`);
        break;
      case "p":
        element.setInnerContent(
          "Wanna get a coffee chat with me? Check out my personal website: "
        );
        break;
      case "a":
        element.setAttribute(
          "href",
          "https:://petercrackthecode.github.io/portfolioPeter"
        );
        element.setInnerContent(
          "https:://petercrackthecode.github.io/portfolioPeter"
        );
        break;
    }
  }
}

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  return new HTMLRewriter()
    .on("*", new ElementHandler())
    .transform(responseCreator(request));
}
