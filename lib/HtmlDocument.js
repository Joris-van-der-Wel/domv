'use strict';

/** Represents a full document in html, including the root node html.
 *
 * @module domv/lib/HtmlDocument
 * @author Joris van der Wel <joris@jorisvanderwel.com>
 */

var Component;
var domv;
var undefined = void 123;

/** This constructor can be used to either create a new html document (html, head, body),
 * or to wrap an existing html document into this class.
 * @example new HtmlDocument() // create a new Document Node, including html (as its child), head, body.
 * @example new HtmlDocument(document); // Create html, head and body elements using the given Document Node,
 *          but do not modify the given Document node (constructors should be side-effect free).
 * @example new HtmlDocument(document.documentElement); // Associate an existing html document
 * @constructor
 * @augments module:domv/lib/Component
 * @alias module:domv/lib/HtmlDocument
 * @param {?external:Node|module:domv/lib/Component} node Either null, a document node or an "html" element node
 * @throws {module:domv/lib/Exception} If an invalid node is passed, or if the existing document is missing the "head" or "body" element.
 */
function HtmlDocument(node)
{
        var createdMinimal = false;
        if (!node)
        {
                // Component does not allow null,
                // but it is allowed here as a convenience
                node = domv.createHtmlDomDocument(true);
                createdMinimal = true;
                node = node.documentElement;
        }

        Component.call(this, node, 'html');

        this.json = Object.create(null);

        if (createdMinimal || this.isCreationConstructor(node))
        {
                this.appendChild(
                        this.head = this.create('head',
                                this.titleWrapped = this.create('title', '', ' ')
                        ),
                        this.body = this.create('body')
                );
        }
        else
        {
                if (this.outerNodeName !== 'html')
                {
                        throw new domv.Exception(new Error('Invalid node parameter passed to the domv.HtmlDocument constructor, the nodeName should be "html" not "' + this.outerNodeName + '"'));
                }

                this.head = this.assertSelector('> head');
                this.baseWrapped = this.selector('> head > base');
                this.titleWrapped = this.selector('> head > title');
                this.body = this.assertSelector('> body');
                this.selectorAll('> head > script[type="application/json"]').forEach(function(wrapped)
                {
                        var identifier = wrapped.getAttr('data-identifier');
                        if (identifier)
                        {
                                this.json[identifier] = wrapped;
                        }
                }, this);
        }

        this.innerNode = this.body;
}

module.exports = HtmlDocument;

Component = require('./Component');
require('inherits')(HtmlDocument, Component);


/** The "head" Element of the document.
 * @member {!module:domv/lib/Component} head
 * @memberof module:domv/lib/HtmlDocument
 * @instance
 */

/** The "body" Element of the document.
 * @member {!module:domv/lib/Component} body
 * @memberOf module:domv/lib/HtmlDocument
 * @instance
 */

 /** The "base" Element of the document.
 * (within the "head" node)
 * @member {?module:domv/lib/Component} baseWrapped
 * @memberof module:domv/lib/HtmlDocument
 * @instance
 */

/** The "title" Element of the document.
 * (within the head node)
 * @member {?module:domv/lib/Component} titleWrapped
 * @memberof module:domv/lib/HtmlDocument
 * @instance
 */

/** The textContent of the "title" Element of this document.
 * (within the "head" node)
 * @member {!string} title
 * @memberof module:domv/lib/HtmlDocument
 * @instance
 */
Object.defineProperty(HtmlDocument.prototype, 'title', {
        configurable: true,
        get: function()
        {
                if (!this.titleWrapped)
                {
                        return '';
                }

                return this.titleWrapped.textContent;
        },
        set: function(value)
        {
                if (!this.titleWrapped)
                {
                        this.titleWrapped = this.create('title');
                        this.head.appendChild(this.titleWrapped);
                }

                this.titleWrapped.textContent = value;
        }
});

/** The base URI that is used to resolve all the relative uri's within this document.
 * (this is get/set using a "base" Element within the "head" element)
 * @member {?string} baseURI
 * @memberof module:domv/lib/HtmlDocument
 * @instance
 */
Object.defineProperty(HtmlDocument.prototype, 'baseURI', {
        configurable: true,
        get: function()
        {
                if (!this.baseWrapped)
                {
                        return null;
                }

                return this.baseWrapped.getAttr('href');
        },
        set: function(value)
        {
                if (value === undefined)
                {
                        throw new domv.Exception(new Error('Invalid value for domv.HtmlDocument.baseURI'));
                }

                if (value === null)
                {
                        if (this.baseWrapped)
                        {
                                this.baseWrapped.removeNode();
                                this.baseWrapped = null;
                        }

                        return;
                }

                if (!this.baseWrapped)
                {
                        this.baseWrapped = this.create('base');
                        this.head.prependChild(this.baseWrapped);
                }

                this.baseWrapped.attr('href', value + '');
        }
});

/** Link a css file to this document.
 * @param {!string} href An absolute or relative URL
 * @param {?string} media The media query to associate with this css file
 * @returns {!module:domv/lib/Component} The newly created "link" node
 */
HtmlDocument.prototype.addCSS = function(href, media)
{
        var node;
        this.head.appendChild(node = this.create('link', {
                'type': 'text/css',
                'rel': 'stylesheet',
                'href': href + '',
                'media': media ? media + '' : null
        }));
        return node;
};

/** Link a javascript file to this document.
 * @param {!string} href An absolute or relative URL
 * @param {boolean} [async=true] If true, a webbrowser will continue parsing
 *        the document even if the script file has not been fully loaded yet.
 *        Use this whenever possible to decrease load times.
 * @returns {!module:domv/lib/Component} The newly created "script" node
 */
HtmlDocument.prototype.addJS = function(href, async)
{
        var node;
        this.head.appendChild(node = this.create('script', {
                'type': 'text/javascript',
                'src': href + '',
                'async': async !== false
        }));
        return node;
};

/** Expose JSON data to an interpreter of the HTML document using a script type="application/json" element.
 * The data can be retrieved using getJSONData with the same identifier;
 * @param {!string} identifier Must be unique to properly get your JSON data back
 * @param {!*} data Any array, object, boolean, integer, et cetera that is able to be serialized into JSON.
 * @returns {!module:domv/lib/Component} The newly created "script" node
 * @example myDoc.addJSONData('foo', {'abc': 'def'});
 * // <script type="application/json" data-identifier="foo">{"abc":"def"};</script>
 */
HtmlDocument.prototype.addJSONData = function(identifier, data)
{
        var str = global.JSON.stringify(data);
        var node;

        this.head.appendChild(node = this.create('script', {
                'type': 'application/json',
                'data-identifier': identifier
        }));
        node.textContent = str;
        this.json[identifier] = node;
        return node;
};

/** Retrieve JSON data previously exposed by addJSONData
 * @param {!string} identifier Same identifier as was used in addJSONData
 * @returns {?*} parsed json data
 */
HtmlDocument.prototype.getJSONData = function(identifier)
{
        var node = this.json[identifier];
        if (!node)
        {
                return null;
        }

        return JSON.parse(node.textContent);
};

HtmlDocument.prototype.stringifyAsHtml = function()
{
        return '<!DOCTYPE html>' + HtmlDocument.super_.prototype.stringifyAsHtml.call(this);
};

domv = require('./domv');