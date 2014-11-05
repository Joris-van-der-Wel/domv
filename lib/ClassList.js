//taken from http://purl.eligrey.com/github/classList.js/blob/master/classList.js

'use strict';

var domv;

function checkTokenAndGetIndex(classList, token)
{
        if (token === '')
        {
                throw new domv.Exception(Error('An invalid or illegal string was specified'));
        }

        if (/\s/.test(token))
        {
                throw new domv.Exception(Error('String contains an invalid character'));
        }
        return classList.indexOf(token);
}

var ClassList = module.exports = function(elem)
{
        var trimmedClasses = (elem.getAttribute('class') || '').trim();
        var classes = trimmedClasses ? trimmedClasses.split(/\s+/) : [];
        var i = 0;
        var len = classes.length;

        for (; i < len; i++)
        {
                this.push(classes[i]);
        }

        this._updateClassName = function()
        {
                elem.setAttribute('class', this.toString());
        };
};

ClassList.prototype = [];

/*ClassList.prototype.item = function(i)
{
        return this[i] || null;
};*/

ClassList.prototype.contains = function(token)
{
        token += '';
        return checkTokenAndGetIndex(this, token) !== -1;
};

ClassList.prototype.add = function()
{
        var i = 0;
        var l = arguments.length;
        var token;
        var updated = false;

        do
        {
                token = arguments[i] + '';
                if (checkTokenAndGetIndex(this, token) === -1)
                {
                        this.push(token);
                        updated = true;
                }
        }
        while (++i < l);

        if (updated)
        {
                this._updateClassName();
        }
};

ClassList.prototype.remove = function()
{
        var i = 0;
        var l = arguments.length;
        var token;
        var updated = false;

        do
        {
                token = arguments[i] + '';
                var index = checkTokenAndGetIndex(this, token);
                if (index !== -1)
                {
                        this.splice(index, 1);
                        updated = true;
                }
        }
        while (++i < l);

        if (updated)
        {
                this._updateClassName();
        }
};

ClassList.prototype.toggle = function(token, force)
{
        token += '';

        var result = this.contains(token);
        var method = result ? force !== true && 'remove' : force !== false && 'add';
        this[method](token);
        return !result;
};

ClassList.prototype.toString = function()
{
        return this.join(' ');
};

domv = require('./domv');