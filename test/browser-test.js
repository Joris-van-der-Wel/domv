'use strict';

module.exports = function()
{
        global.nodeunit = require('nodeunit');
        global.domv = require('../lib/domv');

        return function()
        {
                require('nodeunit/lib/reporters/browser').run({
                        'domv': require('./domv.js'),
                        'Component': require('./Component.js'),
                        'HtmlDocument': require('./HtmlDocument.js')
                });
        };
};