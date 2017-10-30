import { dashed, dotted, extensionNumber, groupFour, groupTwo, longDistance, normalize, uglify } from '../index';
import breakdown from '../_internals/breakdown/index';
import test from 'tape';

test('Test breakdown normal', t => {
	const results = breakdown('555-444-3333');

	t.ok(results, 'results came back');
	t.equal(typeof results, 'object', 'results came back as an object');
	t.equal(results.areaCode, '555', 'The area code in results was 555');
	t.equal(results.localCode, '444', 'The local code in results was 444');
	t.equal(results.lineNumber, '3333', 'The lineNumber in results was 3333');
	t.notOk(results.countryCode.length, 'There was no country code');
	t.notOk(results.extension.length, 'There was no extension');
	t.end();
});

test('Test breakdown extension', t => {
	const results = breakdown('555-444-3333 x 8989');

	t.ok(results, 'results came back');
	t.equal(typeof results, 'object', 'results came back as an object');
	t.equal(results.areaCode, '555', 'The area code in results was 555');
	t.equal(results.localCode, '444', 'The local code in results was 444');
	t.equal(results.lineNumber, '3333', 'The lineNumber in results was 3333');
	t.equal(results.extension, '8989', 'The extension number was 8989');
	t.notOk(results.countryCode.length, 'There was no country code');
	t.end();
});

test('Test breakdown long distance', t => {
	const results = breakdown('17875554441111', 'longDistance');

	t.ok(results, 'results came back');
	t.equal(typeof results, 'object', 'results came back as an object');
	t.equal(results.areaCode, '555', 'The area code in results was 555');
	t.equal(results.localCode, '444', 'The local code in results was 444');
	t.equal(results.lineNumber, '1111', 'The lineNumber in results was 3333');
	t.equal(results.countryCode, '1-787', 'The country code was 1-787');
	t.notOk(results.extension.length, 'The extension number was empty');
	t.end();
});

test('Return a uglified phone number', t => {
	let result = uglify('555-444-1111');

	t.equal(result, '5554441111', `Returned uglify format: ${result}`);

	result = uglify('555444-1111');
	t.equal(result, '5554441111', `Returned uglify format: ${result}`);
	t.end();
});

test('Return a groupedTwo format phone number', t => {
	let result = groupTwo('44332211');

	t.equal(result, '44 33 22 11', `grouped numbers into 4 groups of two: ${result}`);
	result = groupTwo('5544332211');

	t.equal(result, '55 44 33 22 11', `grouped 10 digit number to groups of two: ${result}`);
	t.end();
});

test('Return a groupedFour format phone number', t => {
	let result = groupFour('44332211');

	t.equal(result, '4433 2211', `grouped numbers into 2 groups of four: ${result}`);
	result = groupFour('5544332211');

	t.equal(result, '55 4433 2211', `grouped 10 digit number to group of 2 4 4: ${result}`);
	t.end();
});

test('Return a dashed format phone number', t => {
	let result = dashed('5554441111');

	t.equal(result, '555-444-1111', `Returned dashed format: ${result}`);
	result = dashed('555.444.1111');

	t.equal(result, '555-444-1111', 'Converted dotted formatting to dashed');
	result = dashed('4441111');

	t.equal(result, '444-1111', `Returned short dashed format: ${result}`);
	result = dashed('444.1111');

	t.equal(result, '444-1111', `Returned short dashed format: ${result}`);
	t.end();
});

test('Return a dotted format phone number', t => {
	let result = dotted('5554441111');

	t.equal(result, '555.444.1111', `Returned dotted format: ${result}`);
	result = dotted('555-444-1111');

	t.equal(result, '555.444.1111', 'Converted dashed to dotted format');
	result = dotted('4441111');

	t.equal(result, '444.1111', `Returned dotted format: ${result}`);
	result = dotted('444-1111');

	t.equal(result, '444.1111', `Returned dotted format: ${result}`);
	t.end();
});

test('Return a normal format phone number', t => {
	const result = normalize('5554441111');

	t.equal(result, '(555) 444-1111', `Returned normalize format: ${result}`);
	t.end();
});

test('Return a long distance format', t => {
	let result = longDistance('15554441111', 'dotted');

	t.equal(result, '1+555.444.1111', `Returned longdistance with dotted format: ${result}`);
	result = longDistance('205554441111', 'dotted');

	t.equal(result, '20+555.444.1111', `Returned longdistance with dotted format: ${result}`);
	result = longDistance('2695554441111', 'dotted');

	t.equal(result, '269+555.444.1111', `Returned longdistance with dotted format: ${result}`);
	result = longDistance('17875554441111', 'dotted');

	t.equal(result, '1-787+555.444.1111', `Long Distance formatted with long country code: ${result}`);
	result = longDistance('4414815554441111', 'dotted');

	t.equal(result, '44-1481+555.444.1111', `Long Distance formatted with extra long country code: ${result}`);
	t.end();
});

test('Return an extension format', t => {
	let result = extensionNumber('55544411118989', 'dashed');

	t.equal(result, '555-444-1111 x 8989', `Returned extension with dashed format: ${result}`);
	result = extensionNumber('5554441111899', 'dashed');
	t.equal(result, '555-444-1111 x 899', `Returned extension with dashed format: ${result}`);
	t.end();
});

test('Test bad phone number', t => {
	const result = normalize('85551');

	t.ok(result, 'Results returned okay');
	t.equal(result, '85551', 'Simply returned the bad number back to the user');
	t.end();
});
