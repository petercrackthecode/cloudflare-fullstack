addEventListener("fetch", async (event) => {
  const myResponse = await fetch(event.request.url)
    .then((response) => {
      if (response.status === 200) {
        // console.log("Hello world");
        console.log(`response= ${response.json()}`);
      } else {
        throw new Error(`An error occured`);
      }
    })
    .catch((error) => {
      throw new Error(`Hi I am an error: ${error}`);
    });

  event.respondWith(handleRequest(await myResponse));
});
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(response) {
  return new Response(response.json(), {
    headers: { "Content-Type": "application/json" },
    "Accept-Charset": "utf-8",
    "Accept-Encoding": "gzip",
    "CF-Connecting-IP": "24.5.253.129",
  });
}
