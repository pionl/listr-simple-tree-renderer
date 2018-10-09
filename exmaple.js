'use strict';
const delay = require('delay');
const Listr = require('listr');
const renderer = require('./');

const tasks = new Listr([
    {
        title: 'Git',
        task: () => {
            return new Listr([
                {
                    title: 'Checking remote history',
                    task: () => delay(2000)
                },
                {
                    title: 'Checking remote history 2',
                    task: () => delay(1000)
                },
                {
                    title: 'Checking remote history 3',
                    task: (context, task) => task.skip('test skip')
                },
                {
                    title: 'Checking remote history 4',
                    task: (context, task) => task.skip()
                }
            ], {concurrent: false});
        }
    },
    {
        title: 'Install npm dependencies',
        task: (context, task) => {
            task.output = 'test'
        }
    },
    {
        title: 'Error test',
        task: () => {
            throw new Error('An error occurred');
        }
    }
], {
    renderer,
    nonTTYRenderer: renderer
});


tasks.run().catch(err => {
    console.error(err.message);
});
