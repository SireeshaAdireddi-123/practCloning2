var log4js = require('log4js');
var moment = require('moment');

var attributes = require('common/lang/attributes');

var MutateResultProcessor = require('./MutateResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/FormatDateResultProcessor');

	class FormatDateResultProcessor extends MutateResultProcessor {
		constructor(configuration) {
			super(configuration);
		}

		_processItem(resultItemToProcess, configurationToUse) {
			const propertyName = configurationToUse.propertyName;
			const propertyValue = attributes.read(resultItemToProcess, propertyName);

			const m = moment(propertyValue);

			if (m.isValid()) {
				attributes.write(resultItemToProcess, propertyName, m.format(configurationToUse.format));
			}
		}

		toString() {
			return '[FormatDateResultProcessor]';
		}
	}

	return FormatDateResultProcessor;
})();