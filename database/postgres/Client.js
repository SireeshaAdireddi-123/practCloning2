var log4js = require('log4js');

var assert = require('common/lang/assert');
var Disposable = require('common/lang/Disposable');
var is = require('common/lang/is');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('common-node/database/postgres/Client');

	let queryCounter = 0;

	class Client extends Disposable {
		constructor(pgClient, preparedStatementMap) {
			super();

			assert.argumentIsRequired(pgClient, 'pgClient');
			assert.argumentIsRequired(preparedStatementMap, 'preparedStatementMap');

			this._pgClient = pgClient;
			this._preparedStatementMap = preparedStatementMap;
		}

		query(query, parameters, name) {
			assert.argumentIsRequired(query, 'query', String);
			assert.argumentIsOptional(name, 'name', String);

			return new Promise((resolveCallback, rejectCallback) => {
				const queryObject = {
					values: parameters || []
				};

				if (is.string(name)) {
					queryObject.name = name;

					if (!this._preparedStatementMap.hasOwnProperty(name)) {
						this._preparedStatementMap[name] = query;

					}

					queryObject.text = this._preparedStatementMap[name];
				} else {
					queryObject.text = query;
				}

				queryCounter = queryCounter + 1;

				const queryCount = queryCounter;

				logger.debug('Executing query', queryCount);
				logger.trace('Executing query', queryCount, 'with:', queryObject);

				this._pgClient.query(queryObject, (err, result) => {
					if (err) {
						logger.debug('Query', queryCount, 'failed');

						rejectCallback(err);
					} else {
						logger.debug('Query', queryCount, 'finished');

						resolveCallback(result);
					}
				});
			});
		}

		toString() {
			return '[Client]';
		}
	}

	return Client;
})();