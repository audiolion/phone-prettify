(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.phonePrettify = {})));
}(this, (function (exports) { 'use strict';

var uglify$1 = function (phone) { return phone.replace(/[a-z]\w?|\W/gi, ''); };

/**
 * Format a country code for long distance style numbers
 *
 * @param {String} phone The phone number to format
 * @returns Returns an array
 */
var formatCountryCode = function (phone) {
	var len = phone.length;
	var countryCodeLen = len - 10;
	var codeReg = new RegExp(("([0-9]{" + countryCodeLen + "})"));
	var ref = phone.match(codeReg);
	var uglyCountryCode = ref[0];
	var countryCode = uglyCountryCode;

	if (countryCodeLen > 4) {
		countryCode = (uglyCountryCode.substr(0, 2)) + "-" + (uglyCountryCode.substr(2, 4));
	}

	if (countryCodeLen === 4) {
		countryCode = (uglyCountryCode.substr(0, 1)) + "-" + (uglyCountryCode.substr(1, 3));
	}

	return [countryCode, phone.replace(codeReg, '')];
};

/**
 * Format every other piece of the phone number
 *
 * @param {String} phone The phone number to format
 * @returns Returns an array
 */
var formatCode = function (phone, n) {
	if (!phone) {
		return ['', false];
	}

	var codeReg = new RegExp(("([0-9]{" + n + "})"));
	var ref = phone.match(codeReg);
	var currCode = ref[0];

	return [currCode, phone.replace(codeReg, '')];
};

var breakdown = function (phone, type) {
	var uglyPhone = uglify$1(phone);
	var currPhone = uglyPhone;
	var countryCode = '';
	var areaCode = '';
	var localCode = '';

	if (type === 'longDistance') {
		var assign;
		(assign = formatCountryCode(uglyPhone), countryCode = assign[0], currPhone = assign[1]);
	}

	if (uglyPhone.length >= 10) {
		var assign$1;
		(assign$1 = formatCode(currPhone, 3), areaCode = assign$1[0], currPhone = assign$1[1]);
	}

	var assign$2;
	(assign$2 = formatCode(currPhone, 3), localCode = assign$2[0], currPhone = assign$2[1]);

	var ref = formatCode(currPhone, 4);
	var lineNumber = ref[0];
	var extension = ref[1];


	return {
		countryCode: countryCode,
		areaCode: areaCode,
		localCode: localCode,
		lineNumber: lineNumber,
		extension: extension
	};
};

var isValid = function (phone) { return phone && (/^[0-9]{7,}$/).test(uglify$1(phone)); };

/**
 * L = Local Code
 * A = Area Code
 * N = Line Number
 * E = Extension
 * C = Country Code
 * Example:
 *
 * format(phone, '(AAA)-LLL-nnnn');
 */

var format$1 = function (layout, num, type) {
	var letters = {
		areaCode: 'A',
		localCode: 'L',
		lineNumber: 'N',
		extension: 'E',
		countryCode: 'C'
	};
	var results = layout;

	num.split('').forEach(function (n) {
		results = results.replace(letters[type], n);
	});

	return results;
};

var _format = function (phone, layout, type) {
	if (!isValid(phone)) {
		return phone;
	}

	var uglyPhone = uglify$1(phone);
	var phoneObj = breakdown(uglyPhone, type);
	var results = layout;

	for (var prop in phoneObj) {
		if (phoneObj[prop]) {
			results = format$1(results, phoneObj[prop], prop);
		}
	}

	return results;
};

/**
 * @module Phone-Prettify
 */

var uglify = uglify$1;

var format = _format;

var groupTwo = function (phone) {
	if (!isValid(phone)) {
		return phone;
	}
	if (phone.length === 8) {
		return uglify$1(phone).replace(/^([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})$/, '$1 $2 $3 $4');
	}

	return uglify$1(phone).replace(/^([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})$/, '$1 $2 $3 $4 $5');
};

var groupFour = function (phone) {
	if (!isValid(phone)) {
		return phone;
	}
	if (phone.length === 8) {
		return uglify$1(phone).replace(/^([0-9]{4})([0-9]{4})$/, '$1 $2');
	}

	return uglify$1(phone).replace(/^([0-9]{2})([0-9]{4})([0-9]{4})$/, '$1 $2 $3');
};

/**
 * Formats the string to a dashed style
 * @function dashed
 * @param  {string} phone Uglified phone string
 * @return {string}       Returns the formatted phone string
 */
var dashed = function (phone) {
	if (!isValid(phone)) {
		return phone;
	}
	var ref = breakdown(phone);
	var areaCode = ref.areaCode;
	var localCode = ref.localCode;
	var lineNumber = ref.lineNumber;

	if (areaCode) {
		return (areaCode + "-" + localCode + "-" + lineNumber);
	}

	return (localCode + "-" + lineNumber);
};

/**
 * Formats the string to a normal style
 * @function normalize
 * @param  {string} phone Uglified phone string
 * @return {string}       Returns the formatted phone string
 */
var normalize = function (phone) {
	if (!isValid(phone)) {
		return phone;
	}
	var ref = breakdown(phone);
	var areaCode = ref.areaCode;
	var localCode = ref.localCode;
	var lineNumber = ref.lineNumber;

	if (areaCode) {
		return ("(" + areaCode + ") " + localCode + "-" + lineNumber);
	}

	return (localCode + "-" + lineNumber);
};

/**
	* Formats the string to a dotted style
	* @function dotted
	* @param  {string} phone Uglified phone string
	* @return {string}       Returns the formatted phone string
	*/
var dotted = function (phone) {
	if (!isValid(phone)) {
		return phone;
	}
	var ref = breakdown(phone);
	var areaCode = ref.areaCode;
	var localCode = ref.localCode;
	var lineNumber = ref.lineNumber;

	if (areaCode) {
		return (areaCode + "." + localCode + "." + lineNumber);
	}

	return (localCode + "." + lineNumber);
};

var methods = {
	uglify: uglify$1,
	dashed: dashed,
	dotted: dotted,
	normalize: normalize
};

	/**
	* Formats the string to a long distance with a custom format style
	* @function longDistance
	* @param  {string} phone Uglified phone string
	* @param {string} format The desired format for the phone number
	* @return {string}       Returns the formatted phone string
	*/
var longDistance = function (phone, oFormat) {
	if (!isValid(phone)) {
		return phone;
	}
	var ref = breakdown(phone, 'longDistance');
	var countryCode = ref.countryCode;
	var areaCode = ref.areaCode;
	var localCode = ref.localCode;
	var lineNumber = ref.lineNumber;
	var mainNumber = "" + areaCode + localCode + lineNumber;
	var formattedPhone = dashed(mainNumber);

	if (oFormat && oFormat !== 'longDistance' && oFormat !== 'extension') {
		formattedPhone = methods[oFormat](mainNumber);
	}

	return (countryCode + "+" + formattedPhone);
};

	/**
	* Formats the string to an extension with a custom format style
	* @function extension
	* @param  {string} phone Uglified phone string
	* @param {string} format The desired format for the phone number
	* @return {string}       Returns the formatted phone string
	*/
var extensionNumber = function (phone, oFormat) {
	if (!isValid(phone)) {
		return phone;
	}
	var ref = breakdown(phone, 'extension');
	var extension = ref.extension;
	var areaCode = ref.areaCode;
	var localCode = ref.localCode;
	var lineNumber = ref.lineNumber;
	var mainNumber = "" + areaCode + localCode + lineNumber;
	var formattedPhone = dashed(mainNumber);

	if (oFormat && oFormat !== 'extension' && oFormat !== 'longDistance') {
		formattedPhone = methods[oFormat](mainNumber);
	}

	return (formattedPhone + " x " + extension);
};

exports.uglify = uglify;
exports.format = format;
exports.groupTwo = groupTwo;
exports.groupFour = groupFour;
exports.dashed = dashed;
exports.normalize = normalize;
exports.dotted = dotted;
exports.longDistance = longDistance;
exports.extensionNumber = extensionNumber;

Object.defineProperty(exports, '__esModule', { value: true });

})));
