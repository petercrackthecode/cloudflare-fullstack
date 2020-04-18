const url = "https://cfw-takehome.developers.workers.dev/api/variants";

addEventListener("fetch", async (event) => {
  event.respondWith(handleRequest(event.request));
});
/**
 * Respond with hello worker text
 * @param {Request} request
 */

const randomVariant= (variants) => {
  return variants[Math.round(Math.random())];
}

async function handleRequest(request) {
  //parse json in variable
  const { variants } = await fetch(url).then((res) => res.json());
  let htmlContent= await fetch(randomVariant(variants)).then(res => res);

  //return 1 or 2 50% of the time
  return new Response(randomVariant(variants), {
    headers: { "content-type": "text/plain" },
  });
}
