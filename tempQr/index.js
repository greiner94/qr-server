const post = require('./handlers/post');
const get = require('./handlers/get');
const getAll = require('./handlers/getAll');
const del = require('./handlers/delete');
const delAll = require('./handlers/deleteAll');

module.exports = {
    post,
    get,
    del,
    getAll,
    delAll,
};
