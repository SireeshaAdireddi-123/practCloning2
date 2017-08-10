const assert = require('common/lang/assert');

const Attribute = require('./../../schema/definitions/Attribute'),
	Component = require('./../../schema/definitions/Component'),
	ComponentType = require('./../../schema/definitions/ComponentType'),
	DataType = require('./../../schema/definitions/DataType');

const DaySerializer = require('./attributes/DaySerializer'),
	DecimalSerializer = require('./attributes/DecimalSerializer'),
	JsonSerializer = require('./attributes/JsonSerializer'),
	NumberSerializer = require('./attributes/NumberSerializer'),
	StringSerializer = require('./attributes/StringSerializer'),
	TimestampSerializer = require('./attributes/TimestampSerializer');

const MoneySerializer = require('./components/MoneySerializer');

module.exports = (() => {
	'use strict';

	/**
	 * Utility for looking up {@link AttributeSerializer} and {@link ComponentSerializer}
	 * instances. (no instance-level functionality exists -- static functions only).
	 *
	 * @public
	 */
	class Serializers {
		constructor() {

		}

		/**
		 * Returns the appropriate {@link AttributeSerializer} given an {@link Attribute}.
		 *
		 * @param {Attribute} attribute
		 * @returns {AtrributeSerializer|null}
		 */
		static forAttribute(attribute) {
			assert.argumentIsRequired(attribute, 'attribute', Attribute, 'Attribute');

			return Serializers.forDataType(attribute.dataType);
		}

		/**
		 * Returns the appropriate {@link AttributeSerializer} given a {@link DataType}.
		 *
		 * @param {DataType} dataType
		 * @returns {AtrributeSerializer|null}
		 */
		static forDataType(dataType) {
			assert.argumentIsRequired(dataType, 'dataType', DataType, 'DataType');

			return serializers.get(dataType) || null;
		}

		/**
		 * Returns the appropriate {@link ComponentSerializer} given a {@link Component}.
		 *
		 * @param {Component} component
		 * @returns {ComponentSerializer|null}
		 */
		static forComponent(component) {
			assert.argumentIsRequired(component, 'component', Component, 'Component');

			return Serializers.forComponentType(component.componentType);
		}

		/**
		 * Returns the appropriate {@link ComponentSerializer} given a {@link ComponentType}.
		 *
		 * @param {ComponentType} componentType
		 * @returns {ComponentSerializer|null}
		 */
		static forComponentType(componentType) {
			assert.argumentIsRequired(componentType, 'componentType', ComponentType, 'ComponentType');

			return components.get(componentType) || null;
		}

		toString() {
			return '[Serializers]';
		}
	}

	const serializers = new Map();

	serializers.set(DataType.DECIMAL, DecimalSerializer.INSTANCE);
	serializers.set(DataType.NUMBER, NumberSerializer.INSTANCE);
	serializers.set(DataType.STRING, StringSerializer.INSTANCE);
	serializers.set(DataType.JSON, JsonSerializer.INSTANCE);
	serializers.set(DataType.DAY, DaySerializer.INSTANCE);
	serializers.set(DataType.TIMESTAMP, TimestampSerializer.INSTANCE);

	const components = new Map();

	components.set(ComponentType.MONEY, MoneySerializer.INSTANCE);

	return Serializers;
})();