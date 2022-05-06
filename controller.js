const express = require('express');
const fs = require('fs');

function addMapping(router, mapping) {
  for(let url in mapping) {
    if(url.startsWith('GET ')) {
      //get
      const path = url.substring(4);
      router.get(path, mapping[url]);
    } else if(url.startsWith('POST ')) {
      //post
      const path = url.substring(5);
      router.post(path, mapping[url]);
    } else if(url.startsWith('PUT ')) {
      //put
      const path = url.substring(4);
      router.put(path, mapping[url]);
    } else if(url.startsWith('DELETE ')) {
      //delete
      const path = url.substring(7);
      router.delete(path, mapping[url]);
    }
  }
}

function addControllers(router) {
  fs.readdirSync(__dirname + '/controllers').filter(f => {
    return f.endsWith('.js');
  }).forEach(f => {
    const mapping = require(__dirname + '/controllers/' + f);
    addMapping(router, mapping);
  });
}

module.exports = function() {
  const router = express.Router();
  addControllers(router);
  return router;
}