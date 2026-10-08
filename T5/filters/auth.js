const defaultToken = 'super-secret-token';

export default function auth(request, response) {
  if (request.headers['authorization'] !== `Bearer ${defaultToken}`) {
    response.writeHead(401);
    response.end('The client is not authenticated.');
    return { handled: true }; // server should wrap up the request
  }
  return null;
}
