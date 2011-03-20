module.exports = function(headerValue) {
    var value;
    if (value = headerValue.match("^Basic\\s([A-Za-z0-9+/=]+)$")) {
        var auth = (new Buffer(value[1] || "", "base64")).toString("ascii");
        return {
            user_id   : auth.slice(0, auth.indexOf(':')),
            nickname  : auth.slice(auth.indexOf(':') + 1, auth.length)
        };
    } else {
        return null;
    }
};