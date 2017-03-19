'use strict';

const BaseHandler = require('./BaseHandler');
const ERRORS = require('../constants').ERRORS;
const {
    EVENT_ENDPOINT_CREATED,
    EVENT_FILE_CREATED,
} = require('../constants');

class PostHandler extends BaseHandler {
    /**
     * Create a file in the DataStore.
     *
     * @param  {object} req http.incomingMessage
     * @param  {object} res http.ServerResponse
     * @return {function}
     */
    send(req, res) {
        return this.store.create(req)
            .then((file) => {
                const url = `//${req.headers.host}${req.baseUrl || ''}${this.store.path}/${file.id}`;
                this.emit(EVENT_FILE_CREATED, { file });
                this.emit(EVENT_ENDPOINT_CREATED, { url });
                return super.send(res, 201, { Location: url });
            })
            .catch((error) => {
                console.warn('[PostHandler]', error);
                const status_code = error.status_code || ERRORS.UNKNOWN_ERROR.status_code;
                const body = error.body || `${ERRORS.UNKNOWN_ERROR.body}${error.message || ''}\n`;
                return super.send(res, status_code, {}, body);
            });
    }
}

module.exports = PostHandler;
