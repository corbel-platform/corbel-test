'use strict';

function retry(retryFunction, maxRetries, retryPeriod, catches) {
    return new Promise(function(resolve, reject){
        catches = catches || [];

        if (maxRetries < 1) {
            reject(catches);
        } else {
            retryFunction().then(function(response) {
                resolve(response);
            }).catch(function(err) {
                catches.push(err);
                setTimeout(function() {
                    retry(retryFunction, maxRetries - 1, retryPeriod, catches);
                }, retryPeriod * 1000);
            });
        }
    });
}

function consultPlugins(url) {
    return corbel.request.send({
        url: url.split('/v1.0')[0] + '/plugins?' + Math.random(),
        // inavalidate cache with random query string
        method: corbel.request.method.GET
    });
}

function joinObjects(obj1, obj2) {
    var completeObject = {};
    var args = Array.slice(arguments);
    args.map(function(obj){
        var key;
        var keys = Object.keys(obj);
        var n = keys.length;
        while (n--) {
          key = keys[n];
          completeObject[key] = obj[key];
        }
    });

    return completeObject;
}


module.exports = {
    retry: retry,
    consultPlugins: consultPlugins,
    joinObjects: joinObjects
};
