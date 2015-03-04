'use strict';

var Throwable = require('throwable');

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

        Throwable.call(this, wrapped);
        this.name = 'domv.Exception';
}
require('inherits')(Exception, Throwable);

module.exports = Exception;
