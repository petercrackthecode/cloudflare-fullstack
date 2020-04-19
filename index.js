const URL = "https://cfw-takehome.developers.workers.dev/api/variants",
      SUB_URL= "https://cfw-takehome.developers.workers.dev/variants",
      DEFAULT_EXPIRY_DAYS = 1;

addEventListener("fetch", async (event) => {
  event.respondWith(handleRequest(event.request));
});

const getNewExpiryDate = (expiryDays) => {
  let date = new Date();
  date.setTime(date.getTime() + expiryDays * 24 * 60 * 60 * 1000);
  return date.toGMTString();
};

const parseURL= (cookie) => {
  const urlRegex = /(?<=variant=)\S+/;
  let url = cookie.match(urlRegex)[0];

  return url;
}

const getResponseFromCookie = async (cookie) => {
  const urlRegex = /(?<=variant=)\S+(?=;)/;
  let url = cookie.match(urlRegex)[0];

  let response = await fetch(url);
  return response;
};

const resetCookie = (cookie) => {
  cookie = `variant=${parseURL(cookie)}; Expires=${getNewExpiryDate(
    DEFAULT_EXPIRY_DAYS
  )}; Path=/`;
  return cookie;
};

const responseCreator = async (request) => {
  let cookie = request.headers.get("cookie");
  let response;
  // check if the cookie exists. If it does, parse the cookie and call the variant from that
  // if a cookie exist, we parse it, then reset it to a new expiry date.
  if (cookie) {
    cookie = resetCookie(cookie);
    response = await getResponseFromCookie(cookie);
  } else {
  // else if the cookie does not exist, we create a new cookie.
    let randomVariant = Math.round(Math.random()) < 0.5 ? 1 : 2;
    response = await fetch(SUB_URL + `/${randomVariant}`);
    cookie = `variant=${SUB_URL + "/" + randomVariant}; Expires=${getNewExpiryDate(
      DEFAULT_EXPIRY_DAYS
    )}; Path=/`;
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
    .transform(await responseCreator(request));
}
