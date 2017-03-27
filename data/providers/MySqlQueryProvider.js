const attributes = require('common/lang/attributes'),
	log4js = require('log4js'),
	mysql = require('mysql');

const is = require('common/lang/is'),
	promise = require('common/lang/promise');

const QueryProvider = require('./../QueryProvider');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/providers/MySqlQueryProvider');

	class MySqlQueryProvider extends QueryProvider {
		constructor(configuration) {
			super(configuration);
		}

		_runQuery(criteria) {
			const connection = mysql.createConnection({
				host: this._configuration.host,
				user: this._configuration.user,
				password: this._configuration.password,
				database: this._configuration.database
			});

			const configurationParameters = this._configuration.parameters;

			let parameters = [];
			let parametersValid = true;

			if (is.array(configurationParameters)) {
				parameters = configurationParameters.map((param) => {
					const values = attributes.read(criteria, param);

					if (is.undefined(values) || (is.array(values) && values.length === 0)) {
						parametersValid = false;
					}

					return values;
				});
			} else if (is.string(configurationParameters)) {
				const values = attributes.read(criteria, configurationParameters);

				if (is.undefined(values) || (is.array(values) && values.length === 0)) {
					parametersValid = false;
				}

				parameters = values;
			}

			if (!parametersValid) {
				return [];
			}

			connection.on('error', (e) => {
				logger.error('MySql connection error (fatal)', e);
			});

			return promise.build((resolve, reject) => {
				connection.query(this._configuration.query, parameters, (e, rows) => {
					try {
						if (e) {
							logger.error('MySql query error', e);

							reject(e);
						} else {
							resolve(rows);
						}
					} finally {
						connection.end((endError) => {
							if (!is.undefined(endError)) {
								logger.error('MySql connection error (on close)', endError);
							}
						});
					}
				});
			});
		}

		toString() {
			return '[MySqlQueryProvider]';
		}
	}

	return MySqlQueryProvider;
})();
