[![Build Status](https://travis-ci.org/dhershman1/phone-prettify.svg?branch=master)](https://travis-ci.org/dhershman1/phone-prettify)

# phone-prettify

A simple and light weight phone formatting utility that can handle most (US) formats, basic extension and long distance style phone numbers.

## How-To

Standard module system

```js
import {uglify, dashed, dotted, normalize, longDistance, extensionNumber} from 'phone-prettify';
// Now you can use each as a function
dashed(phone);
dotted(phone2);
```

Common JS

```js
pPretty = require('phone-prettify');
pPretty.dashed(phone);
```

Through the browser

```js
<script src="path/to/location/dist/phone-prettify.umd.js"></script>
phonePrettify.dashed(phone);
```

## Formats
Each format can convert from each other. for example you can send `dotted` a `dashed` format number and get the `dotted` format back.

- `uglify` - Returns string of entered phone with no formatting
- `groupTwo` - Groups 8 or 10 character numbers to a `XX XX XX XX` or `XX XX XX XX XX` format
- `groupFour` - Groups 8 or 10 character numbers to a `XXXX XXXX` or `XX XXXX XXXX` format
- `normalize` - Returns phone number with `(xxx)xxx-xxxx` format
- `dashed`  - Returns phone number with `xxx-xxx-xxxx` format
- `dotted` - Returns phone number with `xxx.xxx.xxxx` format
- `longDistance` - Returns phone number with `x+xxx-xxx-xxxx` format take an optional param to format with different styles
- `extensionNumber` - Returns phone number with `XXX-XXX-XXXX x XXXX` format takes an optional param to format with different styles

## Custom Formatting
You can now call just `format` from the module which allows you to submit custom formatting options which follow these rules:

- `A` - Area Code Number
- `L` - Local Code Number (Usually the first three digits)
- `N` - Line Number (Usually the last four digits)
- `E` - Extension Number (Usually an additional set of digits at the end)
- `C` - Country Code Number (Usually the set of digits that go ahead of a number)

So a use case would be like so:

```js
import { format } from 'phone-prettify';

// Normal
format('4443332222', '(AAA) LLL-NNNN');
// Output: (444) 333-2222

// Long Distance
format('1124443332222', 'CCC + (AAA)-LLL.NNNN', 'longDistance'); // <-- Notice we have to make sure to tell the module we want a long distance rule ran
// Output: 112 + (444)-333.2222

// Extensions
format('44433322228989', '(AAA).LLL.NNNN x EEEE');
// Output: (444).333.2222 x 8989
```

## Return

Each method returns the formatted version of the string passed in. If an improper phone number or a falsey value are passed in, the method will simply return back that value

```js
import { normalize } from 'phone-prettyify';

console.log(normalize('88551'));
// Output: '88551'
```

## Methods

### uglify(phone)

`uglifies` the phone number down to just the number string

#### Arguments

- `phone` - `String`: the desired phone number to run against

#### Usage

```js
import {uglify} from 'phone-prettify';

console.log(uglify('555-444-1111'));
// Output: 5554441111
```

### format(phone, format, type)

Customized formatting function allowing you to create your own custom formats

#### Arguments

- `phone` - `String`: The desired phone number to run against
- `format` - `String`: The desired format to set the number into, see above
- `type` - `String`: Mainly used for `longDistance` to tell `phone-prettify` to run the number through that check as well

#### Usage

```js
import { format } from 'phone-prettify';

// Normal
format('4443332222', '(AAA) LLL-NNNN');
// Output: (444) 333-2222

// Long Distance
format('1124443332222', 'CCC + (AAA)-LLL.NNNN', 'longDistance'); // <-- Notice we have to make sure to tell the module we want a long distance rule ran
// Output: 112 + (444)-333.2222

// Extensions
format('44433322228989', '(AAA).LLL.NNNN x EEEE');
// Output: (444).333.2222 x 8989
```

### groupTwo(phone)

Groups the number into four or five groups of two

#### Arguments

- `phone` - `String`: the desired phone number to run against

#### Usage

```js
import {groupTwo} from 'phone-prettify';

console.log(groupTwo('44332211'));
// Output: 44 33 22 11
// Also supports 10 character numbers
console.log(groupTwo('5544332211'));
// Output: 55 44 33 22 11
```

### groupFour(phone)

Groups the number into two groups of four, or into one group of two and two groups of four

#### Arguments

- `phone` - `String`: the desired phone number to run against

#### Usage

```js
import {groupFour} from 'phone-prettify';

console.log(groupFour('44332211'));
// Output: 4433 2211
// Also supports 10 character numbers
console.log(groupFour('5544332211'));
// Output: 55 4433 2211
```

### normalize(phone)

`normalizes` the phone number format (see [Formats](#formats))

#### Arguments

- `phone` - `String`: the desired phone number to run against

#### Usage

```js
import {normalize} from 'phone-prettify';

console.log(normalize('5554441111'));
// Output: (555) 444-1111
```

### dashed(phone)

convert the phone number to `dashed` format (see [Formats](#formats))

#### Arguments

- `phone` - `String`: the desired phone number to run against

#### Usage

```js
import {dashed} from 'phone-prettify';

console.log(dashed('5554441111'));
// Output: 555-444-1111
```

### dotted(phone)

convert the phone number to `dotted` format (see [Formats](#formats))

#### Arguments

- `phone` - `String`: the desired phone number to run against

#### Usage

```js
import {dotted} from 'phone-prettify';

console.log(dotted('5554441111'));
// Output: 555.444.1111
```

### longDistance(phone, format)

convert the phone number to `longDistance` format (see [Formats](#formats))

#### Arguments

- `phone` - `String`: the desired phone number to run against
- `format` - `String`: the format you'd like the outcome to be in `Default: dashed`

#### Usage

```js
import {longDistance} from 'phone-prettify';

console.log(longDistance('15554441111', 'dotted'));
// Output: 1+555.444.1111
```

### extensionNumber(phone, format)

convert the phone number to `extensionNumber` format (see [Formats](#formats))

#### Arguments

- `phone` - `String`: the desired phone number to run against
- `format` - `String`: the format you'd like the outcome to be in `Default: dashed`

#### Usage

```js
import {extensionNumber} from 'phone-prettify';

console.log(extensionNumber('55544411118989', 'dotted'));
// Output: 555.444.1111 x 8989
```
