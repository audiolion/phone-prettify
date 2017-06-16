
/**
 * @module Phone-Prettify
 */

/**
 * Breaks down our phone number string to a 3 piece object
 * @function breakdownFull
 * @param  {string} phone The uglified phone string
 * @return {object}       Returns the broken down object
 */
const breakdownFull = (phone) => {
	return {
		areaCode: phone.substr(0, 3),
		localCode: phone.substr(3, 3),
		lineNumber: phone.substr(6, 4)
	};
};

/**
* Breaks down our phone number string to a 2 piece object
* @function breakdownShort
* @param  {string} phone The uglified phone string
* @return {object}       Returns the broken down object
*/
const breakdownShort = (phone) => {
	return {
		areaCode: null,
		localCode: phone.substr(0, 3),
		lineNumber: phone.substr(3, 4)
	};
};

/**
 * Breaks down our phone number string to a 4 piece object
 * @function breakdownExtension
 * @param  {string} phone The uglified phone string
 * @return {object}       Returns the broken down object
 */
const breakdownExtension = (phone) => {
	return {
		extension: phone.substr(10),
		areaCode: phone.substr(0, 3),
		localCode: phone.substr(3, 3),
		lineNumber: phone.substr(6, 4)
	};
};

/**
 * Breaks down our phone number string to a 4 piece object
 * @function breakdownLongDistance
 * @param  {string} phone The uglified phone string
 * @return {object}       Returns the broken down object
 */
const breakdownLongDistance = (phone) => {
	return {
		countryCode: phone.substr(0, 1),
		areaCode: phone.substr(1, 3),
		localCode: phone.substr(4, 3),
		lineNumber: phone.substr(7, 4)
	};
};

export const uglify = (phone) => {
	return phone.replace(/[a-z]\w+|\W/gi, '');
};

/**
 * Formats the string to a dashed style
 * @function dashed
 * @param  {string} phone Uglified phone string
 * @return {string}       Returns the formatted phone string
 */
export const dashed = (phone) => {
	const uglyPhone = uglify(phone);
	const isFull = (uglyPhone.length >= 10);
	const {areaCode, localCode, lineNumber} = (isFull) ? breakdownFull(uglyPhone) : breakdownShort(uglyPhone);

	if (isFull) {
		return (`${areaCode}-${localCode}-${lineNumber}`);
	}

	return (`${localCode}-${lineNumber}`);
};

/**
 * Formats the string to a normal style
 * @function normalize
 * @param  {string} phone Uglified phone string
 * @return {string}       Returns the formatted phone string
 */
export const normalize = (phone) => {
	const uglyPhone = uglify(phone);
	const isFull = (uglyPhone.length >= 10);
	const {areaCode, localCode, lineNumber} = (isFull) ? breakdownFull(uglyPhone) : breakdownShort(uglyPhone);

	if (isFull) {
		return (`(${areaCode}) ${localCode}-${lineNumber}`);
	}

	return (`${localCode}-${lineNumber}`);
};

/**
	* Formats the string to a dotted style
	* @function dotted
	* @param  {string} phone Uglified phone string
	* @return {string}       Returns the formatted phone string
	*/
export const dotted = (phone) => {
	const uglyPhone = uglify(phone);
	const isFull = (uglyPhone.length >= 10);
	const {areaCode, localCode, lineNumber} = (isFull) ? breakdownFull(uglyPhone) : breakdownShort(uglyPhone);

	if (isFull) {
		return (`${areaCode}.${localCode}.${lineNumber}`);
	}

	return (`${localCode}.${lineNumber}`);
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
export const longDistance = (phone, format) => {
	const uglyPhone = uglify(phone);
	const {countryCode, areaCode, localCode, lineNumber} = breakdownLongDistance(uglyPhone);
	const mainNumber = `${areaCode}${localCode}${lineNumber}`;
	let formattedPhone = dashed(mainNumber);

	if (format && format !== 'longDistance' && format !== 'extension') {
		formattedPhone = methods[format](mainNumber);
	}

	return (`${countryCode}+${formattedPhone}`);
};

	/**
	* Formats the string to an extension with a custom format style
	* @function extension
	* @param  {string} phone Uglified phone string
	* @param {string} format The desired format for the phone number
	* @return {string}       Returns the formatted phone string
	*/
export const extensionNumber = (phone, format) => {
	const uglyPhone = uglify(phone);
	const {extension, areaCode, localCode, lineNumber} = breakdownExtension(uglyPhone);
	const mainNumber = `${areaCode}${localCode}${lineNumber}`;
	let formattedPhone = dashed(mainNumber);

	if (format && format !== 'extension' && format !== 'longDistance') {
		formattedPhone = methods[format](mainNumber);
	}

	return (`${formattedPhone} x ${extension}`);
};
