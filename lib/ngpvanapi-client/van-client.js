var request = require('request');

function get(path, apiKey, dbMode, callback) {
  var pass = apiKey + '|' + dbMode;

  var options = {
    method: 'GET',
    url: path,
    headers: {'Content-Type': 'application/json'},
    auth: {user: 'api', pass: pass}
  };

  request(options, callback);
}

function post(path, apiKey, dbMode, data, callback) {
  var pass = apiKey + '|' + dbMode;

  var options = {
    method: 'POST',
    url: path,
    headers: {'Content-Type': 'application/json'},
    auth: {user: 'api', pass: pass},
    json: true,
    body: data
  };
  request(options, callback);  
}

function getVanPaginationParams(pagination) {
  var query;

  if (pagination.page && pagination.perPage) {
    var skip = (pagination.page - 1) * pagination.perPage;
    query = '$top=' + pagination.perPage + '&$skip=' + skip;
  } else if (pagination.perPage) {
    query = '$top=' + pagination.perPage;
  }
  return query;
}

function handleResponse(success, badRequest, unauthorized) {
  return function(err, response, body) {
    if (err) {
      return badRequest(err);
    }

    if (response.statusCode == 200) {
      return success(JSON.parse(body));
    }

    if (response.statusCode == 400) {
      var badRequestAnswer = JSON.parse(body);
      return badRequest(null, badRequestAnswer);
    }

    if (response.statusCode == 404) {
      return success({});
    }

    if ((response.statusCode == 401) ||
      (response.statusCode == 403)) {
      return unauthorized();
    }
  };
}

module.exports = {
  get: get,
  post: post,
  getVanPaginationParams: getVanPaginationParams,
  handleResponse: handleResponse
};