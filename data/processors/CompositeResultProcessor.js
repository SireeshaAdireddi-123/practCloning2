var log4js = require('log4js');
var pipeline = require('when/pipeline');

var ResultProcessor = require('./../ResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/CompositeResultProcessor');

	class CompositeResultProcessor extends ResultProcessor {
		constructor(resultProcessors) {
			super(null);

			this._resultProcessors = resultProcessors;
		}

		_process(results) {
			const functions = this._resultProcessors.map((resultProcessor) => {
				return ResultProcessor.toFunction(resultProcessor);
			});

			return pipeline(functions, results);
		}

		toString() {
			return '[CompositeResultProcessor]';
		}
	}

	return CompositeResultProcessor;
})();