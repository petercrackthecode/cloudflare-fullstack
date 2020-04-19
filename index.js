const url = "https://cfw-takehome.developers.workers.dev/api/variants/";

addEventListener("fetch", async (event) => {
  event.respondWith(handleRequest(event.request));
});
/**
 * Respond with hello worker text
 * @param {Request} request
 */

const randomVariant = (variants) => {
  return variants[Math.round(Math.random())];
};

const setCookie = (cookieName, cookieValue, expiredDays) => {
  let date = new Date();
  date.setTime(date.getTime() + expiredDays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + date.toGMTString();
  document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
};

const resetCookie= (cookieName) => {

};

const getCookie = (cookieName) => {
  let name = cookieName + "=",
    decodedCookie = decodeURIComponent(document.cookie),
    ca = decodedCookie.split(";");

  for (let index = 0; index < ca.length; ++index) {
    let c = ca[index];
    while (c.chatAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }

  return "";
};

const getVariant = async () => {
  let variantCookie = getCookie("variant");
  if (!variantCookie) {
    const { variants } = await fetch(url).then((res) => res.json());
    // cookie will expire after 1 day
    setCookie("variant", randomVariant(variants), 1);
  } else {
    resetCookie('variant');
  }
};

async function handleRequest(request) {
  //parse json in variable
  const { variants } = await fetch(url).then((res) => res.json());
  let htmlContent = await fetch(randomVariant(variants)).then((res) => res);

  //return 1 or 2 50% of the time
  return new Response(randomVariant(variants), {
    headers: { "content-type": "text/plain" },
  });
}
