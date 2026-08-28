const worker = {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/" || url.pathname === "") {
      url.pathname = "/index.html";
    }

    let response = await env.ASSETS.fetch(new Request(url, request));

    // Make extensionless static pages work as expected when linked directly.
    if (response.status === 404 && !url.pathname.includes(".")) {
      const pageUrl = new URL(url);
      pageUrl.pathname = `${url.pathname.replace(/\/$/, "")}.html`;
      response = await env.ASSETS.fetch(new Request(pageUrl, request));
    }

    return response;
  },
};

export default worker;
