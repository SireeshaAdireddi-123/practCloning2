const assert = require('@barchart/common-js/lang/assert');

const Attribute = require('./../../schema/definitions/Attribute'),
	Component = require('./../../schema/definitions/Component'),
	ComponentType = require('./../../schema/definitions/ComponentType'),
	DataType = require('./../../schema/definitions/DataType');

const AttributeSerializer = require('./attributes/AttributeSerializer'),
	BinarySerializer = require('./attributes/BinarySerializer'),
	BooleanSerializer = require('./attributes/BooleanSerializer'),
	DaySerializer = require('./attributes/DaySerializer'),
	DecimalSerializer = require('./attributes/DecimalSerializer'),
	EnumSerializer = require('./attributes/EnumSerializer'),
	JsonSerializer = require('./attributes/JsonSerializer'),
	NumberSerializer = require('./attributes/NumberSerializer'),
	StringSerializer = require('./attributes/StringSerializer'),
	TimestampSerializer = require('./attributes/TimestampSerializer');

const CompressedBinarySerializer = require('./attributes/CompressedBinarySerializer'),
	CompressedJsonSerializer = require('./attributes/CompressedJsonSerializer'),
	CompressedStringSerializer = require('./attributes/CompressedStringSerializer');

const EncryptedJsonSerializer = require('./attributes/EncryptedJsonSerializer'),
	EncryptedStringSerializer = require('./attributes/EncryptedStringSerializer');

const ComponentSerializer = require('./components/ComponentSerializer'),
	MoneySerializer = require('./components/MoneySerializer');

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
		 * Binds a {@link DataType} to an {@link AttributeSerializer}, allowing the underlying framework
		 * to automatically handle the a custom attribute type.
		 *
		 * @param {DataType} dataType
		 * @param {AttributeSerializer} serializer
		 */
		static registerAttributeSerializer(dataType, serializer) {
			assert.argumentIsRequired(dataType, 'dataType', DataType, 'DataType');
			assert.argumentIsRequired(serializer, 'serializer', AttributeSerializer, 'AttributeSerializer');
			
			if (attributeSerializers.has(dataType)) {
				throw new Error('An attribute serializer has already been registered for the data type (' + dataType.toString() + ')');
			}

			attributeSerializers.set(dataType, serializer);
		}

		/**
		 * Binds a {@link DataType} to an {@link AttributeSerializer} generated by a custom factory.
		 *
		 * @param {DataType} dataType
		 * @param {Function} serializerFactory - A function which returns an {@link AttributeSerializer}
		 */
		static registerAttributeSerializerFactory(dataType, serializerFactory) {
			assert.argumentIsRequired(dataType, 'dataType', DataType, 'DataType');
			assert.argumentIsRequired(serializerFactory, 'serializerFactory', Function);

			if (attributeSerializerFactories.has(dataType)) {
				throw new Error('An attribute serializer factory has already been registered for the data type (' + dataType.toString() + ')');
			}

			attributeSerializerFactories.set(dataType, serializerFactory);
		}
		
		/**
		 * Returns the appropriate {@link AttributeSerializer} given an {@link Attribute}.
		 *
		 * @param {Attribute} attribute
		 * @returns {AttributeSerializer|null}
		 */
		static forAttribute(attribute) {
			assert.argumentIsRequired(attribute, 'attribute', Attribute, 'Attribute');

			const dataType = attribute.dataType;

			let serializer = Serializers.forDataType(dataType);

			if (serializer === null && attributeSerializerFactories.has(dataType)) {
				const factory = attributeSerializerFactories.get(dataType);

				serializer = factory(attribute);
			}

			return serializer || null;
		}

		/**
		 * Returns the appropriate {@link AttributeSerializer} given a {@link DataType}.
		 *
		 * @param {DataType} dataType
		 * @returns {AttributeSerializer|null}
		 */
		static forDataType(dataType) {
			assert.argumentIsRequired(dataType, 'dataType', DataType, 'DataType');

			const enumerationType = dataType.enumerationType;

			let returnRef;

			if (enumerationType) {
				if (!enumSerializers.has(enumerationType)) {
					enumSerializers.set(enumerationType, new EnumSerializer(enumerationType));
				}

				returnRef = enumSerializers.get(enumerationType);
			} else if (attributeSerializers.has(dataType)) {
				returnRef = attributeSerializers.get(dataType);
			} else {
				returnRef = null;
			}

			return returnRef || null;
		}

		/**
		 * Binds a {@link DataType} to a {@link ComponentSerializer}, allowing the underlying framework
		 * to automatically handle the a custom attribute type.
		 *
		 * @param {ComponentType} componentType
		 * @param {ComponentSerializer} serializer
		 */
		static registerComponentSerializer(componentType, serializer) {
			assert.argumentIsRequired(componentType, 'componentType', ComponentType, 'ComponentType');
			assert.argumentIsRequired(serializer, 'serializer', ComponentSerializer, 'ComponentSerializer');

			if (componentSerializers.has(componentType)) {
				throw new Error('A component serializer has already been registered for the component type (' + componentType.toString() + ')');
			}

			componentSerializers.set(componentType, serializer);
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

			return componentSerializers.get(componentType) || null;
		}

		toString() {
			return '[Serializers]';
		}
	}

	const enumSerializers = new Map();
	const attributeSerializers = new Map();
	const componentSerializers = new Map();

	Serializers.registerAttributeSerializer(DataType.BINARY, BinarySerializer.INSTANCE);
	Serializers.registerAttributeSerializer(DataType.BOOLEAN, BooleanSerializer.INSTANCE);
	Serializers.registerAttributeSerializer(DataType.NUMBER, NumberSerializer.INSTANCE);
	Serializers.registerAttributeSerializer(DataType.STRING, StringSerializer.INSTANCE);
	Serializers.registerAttributeSerializer(DataType.JSON, JsonSerializer.INSTANCE);
	Serializers.registerAttributeSerializer(DataType.DAY, DaySerializer.INSTANCE);
	Serializers.registerAttributeSerializer(DataType.DECIMAL, DecimalSerializer.INSTANCE);
	Serializers.registerAttributeSerializer(DataType.TIMESTAMP, TimestampSerializer.INSTANCE);

	Serializers.registerComponentSerializer(ComponentType.MONEY, MoneySerializer.INSTANCE);

	const attributeSerializerFactories = new Map();

	Serializers.registerAttributeSerializerFactory(DataType.BINARY_COMPRESSED, (a) => new CompressedBinarySerializer(a));
	Serializers.registerAttributeSerializerFactory(DataType.STRING_COMPRESSED, (a) => new CompressedStringSerializer(a));
	Serializers.registerAttributeSerializerFactory(DataType.JSON_COMPRESSED, (a) => new CompressedJsonSerializer(a));

	Serializers.registerAttributeSerializerFactory(DataType.STRING_ENCRYPTED, (a) => new EncryptedStringSerializer(a));
	Serializers.registerAttributeSerializerFactory(DataType.JSON_ENCRYPTED, (a) => new EncryptedJsonSerializer(a));

	return Serializers;
})();