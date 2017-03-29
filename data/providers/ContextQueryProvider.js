const log4js = require('log4js');

const attributes = require('common/lang/attributes'),
	is = require('common/lang/is');

const QueryProvider = require('./../QueryProvider');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/providers/ContextQueryProvider');

	class ContextQueryProvider extends QueryProvider {
		constructor(configuration) {
			super(configuration);
		}

		_runQuery(criteria) {
			const configuration = this._getConfiguration();

			let returnRef;

			if (is.array(configuration.properties)) {
				returnRef = configuration.properties.reduce((map, property) => {
					if (attributes.has(criteria, property)) {
						attributes.write(map, property, attributes.read(criteria, property));
					}

					return map;
				}, { });
			} else if (is.string(configuration.property)) {
				returnRef = attributes.read(criteria, configuration.property);
			} else {
				returnRef = criteria;
			}

			return returnRef;
		}

		_getCriteriaIsValid(criteria) {
			const configuration = this._getConfiguration();

			let conditions;

			if (is.object(configuration.condition)) {
				conditions = [ configuration.condition ];
			} else if (is.array(configuration.condition)) {
				conditions = configuration.conditions;
			} else {
				conditions = null;
			}

			return conditions === null || conditions.every((condition) => {
				const propertyName = condition.propertyName;
				const propertyValue = condition.propertyValue;

				const match = attributes.has(criteria, propertyName) && attributes.read(criteria, propertyName) === propertyValue;
				const inverse = is.boolean(condition.inverse) && condition.inverse;

				return match ^ inverse;
			});
		}

		toString() {
			return '[ContextQueryProvider]';
		}
	}

	return ContextQueryProvider;
})();