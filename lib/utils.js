'use strict';
const chalk = require('chalk');
const format = require('date-fns/format');
const indentString = require('indent-string');

function indentStringWithLevel (level, output) {
	return indentString(`${output}`, level, '  ')
}

exports.log = (options, level, output) => {
	const finalOutput = options.indentString ?
		indentStringWithLevel(level, output) : output;
	console.log(`${finalOutput}`);
};

exports.indentString = indentStringWithLevel
