'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var test = _interopDefault(require('tape'));

/**
 * Format a country code for long distance style numbers
 * 
 * @param {String} phone The phone number to format
 * @returns Returns an array
 */
const formatCountryCode = phone => {
	const len = phone.length;
	const countryCodeLen = len - 10;
	const codeReg = new RegExp(`([0-9]{${countryCodeLen}})`);
	const [uglyCountryCode] = phone.match(codeReg);
	let countryCode = uglyCountryCode;

	if (countryCodeLen > 4) {
		countryCode = `${uglyCountryCode.substr(0, 2)}-${uglyCountryCode.substr(2, 4)}`;
	}

	if (countryCodeLen === 4) {
		countryCode = `${uglyCountryCode.substr(0, 1)}-${uglyCountryCode.substr(1, 3)}`;
	}

	return [countryCode, phone.replace(codeReg, '')];
};

/**
 * Format every other piece of the phone number
 * 
 * @param {String} phone The phone number to format
 * @returns Returns an array
 */
const formatCode = (phone, n) => {
	if (!phone) {
		return ['', false];
	}

	const codeReg = new RegExp(`([0-9]{${n}})`);
	const [currCode] = phone.match(codeReg);

	return [currCode, phone.replace(codeReg, '')];
};

var breakdown = (phone, type) => {
	const uglyPhone = uglify(phone);
	let countryCode = '';
	let currPhone = uglyPhone;
	let areaCode = '';
	let localCode = '';

	if (type === 'longDistance') {
		[countryCode, currPhone] = formatCountryCode(uglyPhone);
	}

	if (uglyPhone.length >= 10) {
		[areaCode, currPhone] = formatCode(currPhone, 3);
	}

	[localCode, currPhone] = formatCode(currPhone, 3);

	const [lineNumber, extension] = formatCode(currPhone, 4);


	return {
		countryCode,
		areaCode,
		localCode,
		lineNumber,
		extension
	};
};

/**
 * @module Phone-Prettify
 */

const uglify = phone => phone.replace(/[a-z]\w+|\W/gi, '');

const validate = phone => phone && (/^[0-9]{7,}$/).test(uglify(phone));

const groupTwo = phone => {
	if (!validate(phone)) {
		return phone;
	}
	if (phone.length === 8) {
		return uglify(phone).replace(/^([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})$/, '$1 $2 $3 $4');
	}

	return uglify(phone).replace(/^([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})$/, '$1 $2 $3 $4 $5');
};

const groupFour = phone => {
	if (!validate(phone)) {
		return phone;
	}
	if (phone.length === 8) {
		return uglify(phone).replace(/^([0-9]{4})([0-9]{4})$/, '$1 $2');
	}

	return uglify(phone).replace(/^([0-9]{2})([0-9]{4})([0-9]{4})$/, '$1 $2 $3');
};

/**
 * Formats the string to a dashed style
 * @function dashed
 * @param  {string} phone Uglified phone string
 * @return {string}       Returns the formatted phone string
 */
const dashed = phone => {
	if (!validate(phone)) {
		return phone;
	}
	const {areaCode, localCode, lineNumber} = breakdown(phone);

	if (areaCode) {
		return `${areaCode}-${localCode}-${lineNumber}`;
	}

	return `${localCode}-${lineNumber}`;
};

/**
 * Formats the string to a normal style
 * @function normalize
 * @param  {string} phone Uglified phone string
 * @return {string}       Returns the formatted phone string
 */
const normalize = phone => {
	if (!validate(phone)) {
		return phone;
	}
	const {areaCode, localCode, lineNumber} = breakdown(phone);

	if (areaCode) {
		return `(${areaCode}) ${localCode}-${lineNumber}`;
	}

	return `${localCode}-${lineNumber}`;
};

/**
	* Formats the string to a dotted style
	* @function dotted
	* @param  {string} phone Uglified phone string
	* @return {string}       Returns the formatted phone string
	*/
const dotted = phone => {
	if (!validate(phone)) {
		return phone;
	}
	const {areaCode, localCode, lineNumber} = breakdown(phone);

	if (areaCode) {
		return `${areaCode}.${localCode}.${lineNumber}`;
	}

	return `${localCode}.${lineNumber}`;
};

const methods = {
	uglify,
	dashed,
	dotted,
	normalize
};

	/**
	* Formats the string to a long distance with a custom format style
	* @function longDistance
	* @param  {string} phone Uglified phone string
	* @param {string} format The desired format for the phone number
	* @return {string}       Returns the formatted phone string
	*/
const longDistance = (phone, format) => {
	if (!validate(phone)) {
		return phone;
	}
	const {countryCode, areaCode, localCode, lineNumber} = breakdown(phone, 'longDistance');
	const mainNumber = `${areaCode}${localCode}${lineNumber}`;
	let formattedPhone = dashed(mainNumber);

	if (format && format !== 'longDistance' && format !== 'extension') {
		formattedPhone = methods[format](mainNumber);
	}

	return `${countryCode}+${formattedPhone}`;
};

	/**
	* Formats the string to an extension with a custom format style
	* @function extension
	* @param  {string} phone Uglified phone string
	* @param {string} format The desired format for the phone number
	* @return {string}       Returns the formatted phone string
	*/
const extensionNumber = (phone, format) => {
	if (!validate(phone)) {
		return phone;
	}
	const {extension, areaCode, localCode, lineNumber} = breakdown(phone, 'extension');
	const mainNumber = `${areaCode}${localCode}${lineNumber}`;
	let formattedPhone = dashed(mainNumber);

	if (format && format !== 'extension' && format !== 'longDistance') {
		formattedPhone = methods[format](mainNumber);
	}

	return `${formattedPhone} x ${extension}`;
};

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