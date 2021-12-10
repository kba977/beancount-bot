module.exports = (request, response) => {
  response.json({
    body: request.body,
    query: request.query,
    cookies: request.cookies
  });
};