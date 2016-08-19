var log4js = require('log4js');

var assert = require('common/lang/assert');
var DisposableStack = require('common/collections/specialized/DisposableStack');

var Router = require('./Router');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('common-node/messaging/routers/CompositeRouter');

	class CompositeRouter extends Router {
		constructor(routers, suppressExpressions) {
			super(suppressExpressions);

			assert.argumentIsArray(routers, 'routers', Router, 'Router');

			this._routers = routers;
		}

		_start() {
			return Promise.all(this._routers.map((routers) => {
				return routers.start();
			})).then(() => {
				return true;
			});
		}

		_canRoute(messageType) {
			return this._routers.some((router) => {
				return router.canRoute(messageType);
			});
		}

		_route(messageType, payload) {
			const router = this._routers.find((router) => {
				return router.canRoute(messageType);
			});

			return router.route(messageType, payload);
		}

		_register(messageType, handler) {
			const registerPromises = this._routers.map((router) => {
				return router.register(messageType, handler);
			});

			return Promise.all(registerPromises)
				.then((registrations) => {
					const disposableStack = new DisposableStack();

					registrations.forEach((registration) => {
						disposableStack.push(registration);
					});

					return disposableStack;
				});
		}

		_onDispose() {
			this._routers.forEach((router) => {
				router.dispose();
			});

			this._routers = null;

			logger.debug('Composite router disposed');
		}

		toString() {
			return '[CompositeRouter]';
		}
	}

	return CompositeRouter;
})();
