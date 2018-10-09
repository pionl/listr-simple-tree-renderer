'use strict';
const cliCursor = require('cli-cursor');
const figures = require('figures');
const chalk = require('chalk');
const utils = require('./lib/utils');

const renderHelper = (task, event, options, level) => {
	const log = utils.log.bind(undefined, options, level);

	if (event.type === 'STATE' || event.type === 'TITLE') {
		if (task.isCompleted() || task.hasFailed()) {
			return
		}

		const icon = chalk.blue(figures.pointer);
		log(`${icon} ${task.title}`);

		if (task.isSkipped()) {
			const message = task.output ? ` ${task.output}` : ''
			log(utils.indentString(1, chalk.gray(`${figures.arrowLeft} [SKIPPED]${message}`)));
		}
		return
	}

	if (event.type === 'DATA') {
		const icon = task.hasFailed() ? chalk.red(figures.cross) : chalk.gray(figures.arrowRight)
		log(utils.indentString(1, icon + ' ' + chalk.gray(`${event.data}`)))
		return
	}
};

const render = (tasks, options, level = 0) => {
	for (const task of tasks) {
		task.subscribe(
			event => {
				if (event.type === 'SUBTASKS') {
					render(task.subtasks, options, level + 1);
					return;
				}

				renderHelper(task, event, options, level);
			},
			err => {
				console.log(err);
			}
		);
	}
};

class SimpleTreeRenderer {

	constructor (tasks, options) {
		this._tasks = tasks;
		this._options = Object.assign({
			indentString: true,
		}, options);
	}

	static get nonTTY () {
		return true;
	}

	render () {
		cliCursor.hide();
		render(this._tasks, this._options);
	}

	end () {
		cliCursor.show();
	}
}

module.exports = SimpleTreeRenderer;
