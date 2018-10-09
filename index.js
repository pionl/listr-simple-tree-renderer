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

		log(utils.format(task.title, (title) => {
            const icon = chalk.blue(figures.pointer);
            return `${icon} ${title}`
        }));

		if (task.isSkipped()) {
			const message = '[SKIPPED]' + (task.output ? ` ${task.output}` : '')
			log(utils.indentString(1, utils.format(
                message,
                (message) => {
					return chalk.gray(`${figures.arrowLeft} ${message}`)
                }
			)));
		}
		return
	}

	if (event.type === 'DATA') {
        log(utils.indentString(1, utils.format(
            event.data,
            (data) => {
                const icon = task.hasFailed() ? chalk.red(figures.cross) : chalk.gray(figures.arrowRight)
                return icon + ' ' + chalk.gray(`${event.data}`)
            }
        )));
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
