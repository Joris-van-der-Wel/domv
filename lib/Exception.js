'use strict';

/** The base class for any exception that originates from this library
 *
 * @module domv/lib/Exception
 * @author Joris van der Wel <joris@jorisvanderwel.com>
 */

/** Construct a simple domv.Exception
 * @constructor
 * @augments Error
 * @alias module:domv/lib/Exception
 * @param {!Error} wrapped
 * @example new domv.Exception(new Error('Hrm'));
 */
function Exception(wrapped)
{
        if (!(this instanceof Exception))
        {
                return new Exception(wrapped);
        }

        /* istanbul ignore if */
        if (typeof wrapped !== 'object')
        {
                throw Error('Exception should always wrap an Error!');
        }

        // Wrap the Error so that the stack, lineNumber, fileName, etc is correct
        this.wrapped = wrapped;
        this.wrapped.name = 'domv.Exception';
}

function wrap(attr)
{
        Object.defineProperty(Exception.prototype, attr, {
                get: function()
                {
                        return this.wrapped ? this.wrapped[attr] : /* istanbul ignore next */ undefined;
                }
        });
}

Exception.prototype = Object.create(global.Error.prototype);
Exception.prototype.constructor = Exception;

/** Always true for instances of this class.
 * <p>Use this attribute to determine if an object is a Component.
 * This would let you create an object compatible with this API,
 * without having to use Component as a super type.</p>
 * @member {!boolean} isDOMVException
 * @memberOf module:domv/lib/Exception
 * @constant
 * @instance
 */
Object.defineProperty(Exception.prototype, 'isDOMVException', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: true
});

wrap('name');
wrap('message');
wrap('stack');
wrap('fileName');
wrap('lineNumber');
wrap('columnNumber');

Exception.prototype.toString = function()
{
        return this.wrapped.toString();
};

module.exports = Exception;