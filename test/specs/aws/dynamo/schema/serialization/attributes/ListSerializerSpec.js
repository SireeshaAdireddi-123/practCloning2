var ListSerializer = require('./../../../../../../../aws/dynamo/schema/serialization/attributes/ListSerializer');

describe('When a ListSerializer is instantiated', function() {
	'use strict';

	var serializer;

	beforeEach(function() {
		serializer = new ListSerializer();
	});

	it('it serializes ["String 1", 2] as { "L": [ { "S": "String 1" }, { "N": "2" } ] }', function() {
		var serialized = serializer.serialize(['String 1', 2]);

		expect(serialized.L).toEqual([ { S: 'String 1' }, { N: '2' } ]);
	});

	it('it deserializes { "L": [ { "S": "String 1" }, { "N": "2" } ] } as ["123", 2]', function() {
		var deserialized = serializer.deserialize({ L: [ { S: 'String 1' }, { N: '2' } ] });

		expect(deserialized).toEqual(['String 1', 2]);
	});

	it('it serializes ["String 1", 2, ["String 2"]] as { "L": [ { "S": "String 1" }, { "N": "2" }, { "L" : [ { "S": "String 2" } ] } ] }', function() {
		var serialized = serializer.serialize(['String 1', 2, ["String 2"]]);

		expect(serialized.L).toEqual([ { S: 'String 1' }, { N: '2' }, { L: [ { S: 'String 2' } ] } ]);
	});

	it('it deserializes { "L": [ { "S": "String 1" }, { "N": "2" }, { "L" : [ { "S": "String 2" } ] } ] } as ["String 1", 2, ["String 2"]]', function() {
		var deserialized = serializer.deserialize({ L: [ { S: 'String 1' }, { N: '2' }, { L : [ { S: 'String 2' } ] } ] });

		expect(deserialized).toEqual(['String 1', 2, ['String 2']]);
	});

	it('it serializes [true, "String 1"] as { "L": [ { "BOOL": true }, { "S": "String 1" } ] }', function() {
		var serialized = serializer.serialize([true, 'String 1']);

		expect(serialized).toEqual({ L: [ { BOOL: true }, { S: 'String 1' } ] });
	});

	it('it deserializes { "L": [ { "BOOL": true }, { "S": "String 1" } ] } as [true, "String 1"]', function() {
		var deserialized = serializer.deserialize({ L: [ { BOOL: true }, { S: 'String 1' } ] });

		expect(deserialized).toEqual([true, 'String 1']);
	});
});