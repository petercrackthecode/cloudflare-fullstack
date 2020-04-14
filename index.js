addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  const response = await fetch(request.url)
    .then((response) => {
      if (response === 200) {
        return response.json();
      } else {
        throw new Error(`An error occured`);
      }
    })
    .catch((error) => {
      throw new Error(`Hi I am an error: ${error}`);
    });

  console.log(`response= ${response}`);

  return new Request("abuchikao", {
    headers: { "content-typel": "text/plain" },
  });
}
