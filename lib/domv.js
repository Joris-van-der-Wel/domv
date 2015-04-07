'use strict';

/**
 * @module domv
 * @author Joris van der Wel <joris@jorisvanderwel.com>
 */
var domv = module.exports;
var jsdom = {};
var jsdomErr = null;
try
{
        jsdom = require('jsdom');
}
catch(err)
{
        /* istanbul ignore next */
        jsdomErr = err;
}

/** @constant {!module:domv/lib/Component} */
module.exports.Component = require('./Component');
/** @constant {!module:domv/lib/HtmlDocument} */
module.exports.HtmlDocument = require('./HtmlDocument');
/** @constant {!module:domv/lib/Exception} */
module.exports.Exception = require('./Exception');

var Component = domv.Component;
var slice = Array.prototype.slice;
var objToString = Object.prototype.toString;


/** All of the valid node types in DOM (excluding the ones that are deprecated).
 * @enum {number}
 */
module.exports.NodeType = {
      ELEMENT: 1,
      TEXT: 3,
      PROCESSING_INSTRUCTION: 7,
      COMMENT: 8,
      DOCUMENT: 9,
      DOCUMENT_TYPE: 10,
      DOCUMENT_FRAGMENT: 11
};

/* istanbul ignore next */
function maybeJsdomError(error)
{
        if (jsdomErr)
        {
                error.message += '\nJsdom might fail to load because of this error: ' +
                                 jsdomErr.message +
                                 '\n' +
                                 jsdomErr.stack;
        }

        error.jsdomCause = jsdomErr;

        return error;
}


/** Test if the current environment / browser / DOM library supports everything that is needed for the domv library.
 * @param {!external:Document} document
 * @param {boolean} [checkAll=false] If true, also check {@link module:domv.isParseHTMLDocumentSupported isParseHTMLDocumentSupported()}
 * @returns {!boolean}
 * @throws {module:domv/lib/Exception} For invalid arguments
 */
module.exports.isSupported = function(document, checkAll)
{
        var ret;

        if (!document)
        {
                throw new domv.Exception(Error('domv.isSupported() : Missing argument'));
        }

        ret = !!(
                global.JSON &&
                Object.create && // IE9
                Object.defineProperty && // IE9
                document.createDocumentFragment &&
                document.createDocumentFragment().querySelector && // IE8
                ''.trim && // IE9
                [].indexOf && // IE9
                Function.bind && // IE9
                Array.prototype.filter &&
                document.contains // IE9 (partial support)
        );

        if (checkAll)
        {
                ret = ret && domv.isParseHTMLDocumentSupported();
        }

        return ret;
};

/** Test if the current environment / browser / DOM library supports parsing the markup of an
 * entire html document (including doctype, html, head, tags etc).
 * @see {@link module:domv.parseHTMLDocument parseHTMLDocument()}
 * @returns {!boolean}
 */
module.exports.isParseHTMLDocumentSupported = function()
{
        /* istanbul ignore else : Branch only reached within webbrowsers */
        if (jsdom.jsdom)
        {
                return true;
        }

        /* istanbul ignore next : Only called within webbrowsers */
        try
        {
                // WebKit returns null on unsupported types
                if (global.DOMParser &&
                    (new global.DOMParser()).parseFromString('', 'text/html'))
                {
                        return true;
                }
        } catch (ignore) {}

        /* istanbul ignore next */
        return false;
};

/** Is the given node or component able to have children?.
 * @param {?(module:domv/lib/Component|external:Node)} node
 * @param {boolean} [doThrow=false] If true, throw instead of returning false upon failure.
 * @returns {!boolean}
 * @throws {module:domv/lib/Exception} If doThrow=true
 */
module.exports.mayContainChildren = function(node, doThrow)
{
        if (!node)
        {
                if (doThrow)
                {
                        throw domv.Exception(Error('Given node may not contain any children (the "node" is not set)'));
                }

                return false;
        }

        if (node.isDOMVComponent)
        {
                node = node.innerNode;
        }

        if (typeof node.nodeType === 'number' &&
                (node.nodeType === domv.NodeType.ELEMENT ||
                 node.nodeType === domv.NodeType.DOCUMENT ||
                 node.nodeType === domv.NodeType.DOCUMENT_FRAGMENT)
           )
        {
                return true;
        }

        if (doThrow)
        {
                throw domv.Exception(Error('Given node '+node.nodeType+' may not contain children'));
        }

        return false;
};

/** Wraps a plain DOM Node so that you can use the same API as you would on a Component.
 * If you pass a NodeList, an array (that is not live) with Component's will be returned.
 * Passing a falsy value will also return a falsy value instead of a Component
 * @example domv.wrap(document.body).prependChild(...);
 * @example domv.wrap(someNode, MyPictureGallery).addPicture(...);
 * @param {?(external:Node|external:Node[])} node_
 * @param {?function} [ComponentConstructor=module:domv/lib/Component] The constructor to
 *         use to wrap the given Node, by default the Node is wrapped in a plain Component,
 *         but it is also possible to specify your own constructor. The first argument is always
 *         the node being wrapped.
 * @param {...*} constructorArguments Further arguments to be passed to the constructor
 * @returns {?(module:domv/lib/Component|module:domv/lib/Component[])} Only null if "node" was also null
 * @throws {module:domv/lib/Exception} If an unsupported argument is passed, or if more than 10
 *         constructor arguments have been passed
 */
module.exports.wrap = function(node_, ComponentConstructor, a0, a1, a2, a3, a4, a5, a6, a7, a8, a9)
{
        var ret;
        var i;
        var node = node_;
        var length;

        if (node && node.isDOMVComponent)
        {
                node = node.outerNode;
        }

        if (!node)
        {
                return node;
        }

        if (node.nodeType)
        {
                if (ComponentConstructor)
                {
                        switch (arguments.length)
                        {
                                /* istanbul ignore next */
                                case  0: /* falls through */
                                /* istanbul ignore next */
                                case  1: throw domv.Exception(Error('Assertion error'));
                                case  2: return new ComponentConstructor(node);
                                case  3: return new ComponentConstructor(node, a0);
                                case  4: return new ComponentConstructor(node, a0, a1);
                                case  5: return new ComponentConstructor(node, a0, a1, a2);
                                case  6: return new ComponentConstructor(node, a0, a1, a2, a3);
                                case  7: return new ComponentConstructor(node, a0, a1, a2, a3, a4);
                                case  8: return new ComponentConstructor(node, a0, a1, a2, a3, a4, a5);
                                case  9: return new ComponentConstructor(node, a0, a1, a2, a3, a4, a5, a6);
                                case 10: return new ComponentConstructor(node, a0, a1, a2, a3, a4, a5, a6, a7);
                                case 11: return new ComponentConstructor(node, a0, a1, a2, a3, a4, a5, a6, a7, a8);
                                case 12: return new ComponentConstructor(node, a0, a1, a2, a3, a4, a5, a6, a7, a8, a9);
                                default: throw domv.Exception(Error('domv.wrap : Constructor argument length of ' + arguments.length + ' has not been implemented'));
                        }
                }

                // make sure a Document Node is really wrapped
                // and does not trigger the default element creation
                return new Component(node, '', true);
        }

        length = node.length;

        // Array.isArray does not accept things like NodeList
        if (typeof length === 'number')
        {
                ret = new Array(length);

                for (i = 0; i < length; ++i)
                {
                        switch (arguments.length)
                        {
                                /* istanbul ignore next */
                                case  0: throw domv.Exception(Error('Assertion error'));
                                case  1: ret[i] = domv.wrap(node[i]); break;
                                case  2: ret[i] = domv.wrap(node[i], ComponentConstructor); break;
                                case  3: ret[i] = domv.wrap(node[i], ComponentConstructor, a0); break;
                                case  4: ret[i] = domv.wrap(node[i], ComponentConstructor, a0, a1); break;
                                case  5: ret[i] = domv.wrap(node[i], ComponentConstructor, a0, a1, a2); break;
                                case  6: ret[i] = domv.wrap(node[i], ComponentConstructor, a0, a1, a2, a3); break;
                                case  7: ret[i] = domv.wrap(node[i], ComponentConstructor, a0, a1, a2, a3, a4); break;
                                case  8: ret[i] = domv.wrap(node[i], ComponentConstructor, a0, a1, a2, a3, a4, a5); break;
                                case  9: ret[i] = domv.wrap(node[i], ComponentConstructor, a0, a1, a2, a3, a4, a5, a6); break;
                                case 10: ret[i] = domv.wrap(node[i], ComponentConstructor, a0, a1, a2, a3, a4, a5, a6, a7); break;
                                case 11: ret[i] = domv.wrap(node[i], ComponentConstructor, a0, a1, a2, a3, a4, a5, a6, a7, a8); break;
                                case 12: ret[i] = domv.wrap(node[i], ComponentConstructor, a0, a1, a2, a3, a4, a5, a6, a7, a8, a9); break;
                                default: throw domv.Exception(Error('domv.wrap : Constructor argument length of ' + arguments.length + ' has not been implemented'));
                        }
                }

                return ret;
        }

        throw domv.Exception(Error('Invalid node parameter in domv.wrap(), it should be a DOM Node, a domv.Component, or an array(-like) of those.'));
};

/** Returns an array copy of a NodeList so that it is no longer live.
 * This makes it easier to properly modify the DOM while traversing a node list.
 * The actual content of the array is identical (the nodes are <strong>not</strong> wrapped)
 * @param {!*} nodeList Any array like object.
 * @returns {!Array}
 * @example var list = require('domv').unlive(document.getElementsByTagName('*'));
 */
module.exports.unlive = function(nodeList)
{
        return slice.call(nodeList, 0);
};

function createParseArgument(document, wrapped, val)
{
        var j;

        if (val === null || val === void 123)
        {
                return;
        }

        if (Array.isArray(val) || objToString.call(val) === '[object Arguments]')
        {
                for (j = 0; j < val.length; ++j)
                {
                        createParseArgument(document, wrapped, val[j]);
                }
        }
        else if (typeof val === 'object' && !(val instanceof String))
        {
                // caveat: you can not set isDOMVComponent or nodeType in an attribute map
                if (val.isDOMVComponent || val.nodeType)
                {
                        wrapped.appendChild(val);
                }
                else
                {
                        wrapped.attr(val);
                }
        }
        else
        {
                if (domv.mayContainChildren(wrapped))
                {
                        wrapped.appendChild(document.createTextNode(val.toString()));
                }
                else
                {
                        wrapped.innerNode.appendData(val.toString());
                }
        }
}

/** Convenient function to create a wrapped Node including its attributes (for elements).
 * @param {!external:Document} document_
 * @param {!string} nodeName
 * @param {?(string|external:Node|module:domv/lib/Component|Object.<string, string>)} className
 *      <p>If a string is passed, and the nodeName represents an element tag, the string is set as the class attribute.
 *         If not an element, the string is appended to the node data.</p>
 *      <p>If a node or component is passed, it is simply appended.</p>
 *      <p>If an object of key value pairs is passed, it sets those as attributes (see {@link module:domv/lib/Component#attr}).</p>
 * @param {...(string|external:Node|module:domv/lib/Component|Object.<string, string>)} content
 *      <p>If a string is passed, and the nodeName represents an element tag, the string is appended as a text node.
 *         If not an element, the string is appended to the node data.</p>
 *      <p>If a node or component is passed, it is simply appended.</p>
 *      <p>If an object of key value pairs is passed, it sets those as attributes (see {@link module:domv/lib/Component#attr}).</p>
 *
 * @returns {!module:domv/lib/Component}
 * @example var wrappedDiv = require('domv').create(document, 'div', 'myDiv', 'This is my div!', {'data-test': 'foo'});
 * console.log(wrappedDiv.outerNode.outerHTML);
 * // <div class="myDiv" data-test="foo">This is my div!</div>
 * @throws {module:domv/lib/Exception} For invalid arguments
 */
module.exports.create = function(document_, nodeName, className)
{
        var node;
        var wrapped;
        var skipArguments = 2;
        var i;
        var document = document_;

        if (!document ||
            !nodeName)
        {
                throw new domv.Exception(Error('domv.create() : Missing argument'));
        }

        if (document.isDOMVComponent)
        {
                document = document.document;
        }

        if (nodeName[0] === '#')
        {
                if (nodeName === '#text')
                {
                        node = document.createTextNode('');
                }
                else if (nodeName === '#comment')
                {
                        node = document.createComment('');
                }
                else if (nodeName === '#document-fragment')
                {
                        node = document.createDocumentFragment();
                }
                else
                {
                        // #document
                        // #cdata-section (xml only)
                        throw domv.Exception(Error('The given nodeName "'+nodeName+'" is not supported in domv.create()'));
                }

        }
        else
        {
                node = document.createElement(nodeName);
        }

        wrapped = domv.wrap(node);

        if (node.nodeType === domv.NodeType.ELEMENT &&
            (typeof className === 'string' || className instanceof String))
        {
                if (className !== '')
                {
                        wrapped.attr('class', className);
                }
                ++skipArguments;
        }

        for (i = skipArguments; i < arguments.length; ++i)
        {
                createParseArgument(document, wrapped, arguments[i]);
        }


        return wrapped;
};

function cloneNodesOnly(arr)
{
        var length = arr.length;
        var ret = new Array(length);
        var i, val;

        for (i = 0; i < length; ++i)
        {
                val = arr[i];

                if (Array.isArray(val))
                {
                        val = cloneNodesOnly(val);
                }
                else if (typeof val === 'object' && (val.isDOMVComponent || val.nodeType))
                {
                        // caveat: you can not set isDOMVComponent or nodeType as an attribute in an attribute map
                        if (val.isDOMVComponent)
                        {
                                val = val.outerNode;
                        }

                        val = val.cloneNode(true); // deep
                }

                ret[i] = val;
        }

        return ret;
}

/** @typedef {function} domv/lib/CreateShortHand
 * @param {?string} className
 * @param {...(string|external:Node|module:domv/lib/Component|Object.<string, string>)} [content]
 *        <p>If a string is passed, a text node is appended.</p>
 *        <p>If a node or component is passed, it is simply appended.</p>
 *        <p>If an object of key value pairs is passed, it sets those as attributes.
 *           (see {@link module:domv/lib/Component#attr})</p>
 */
/** Generate a short hand function wich lets you quickly create
 * a wrapped Element including its attributes.
 * @example var a = require('domv').shorthand(document, 'a');
 * var link = a('readmore', {'href': something()}, 'Click here to readmore!');
 * // <a class="readmore" href="#example">Click here to readmore!</a>
 * @param {!external:Document} document_
 * @param {string} [tagName_='div']
 * @param {...(string|Object.<string, string>)} initialAttributes
 *        <p>If a string is passed, a text node is appended.</p>
 *        <p>If a node or component is passed, it is simply appended.</p>
 *        <p>If an object of key value pairs is passed, it sets those as attributes.
 *           (see {@link module:domv/lib/Component#attr})</p>
 * @returns {!domv/lib/CreateShortHand}
 */
module.exports.shorthand = function(document_, tagName_)
{
        var fn = domv.create;
        var thisObj = this;
        var shorthandArguments = [];
        var shorthandInstance;
        var document = document_;
        var tagName = tagName_;

        if (!document)
        {
                throw new domv.Exception(Error('domv.shorthand() : Missing argument'));
        }

        if (arguments.length > 2)
        {
                shorthandArguments = new Array(arguments.length - 2); // avoid leaking "arguments"
                for (var ai = 2; ai < arguments.length; ++ai)
                {
                        shorthandArguments[ai - 2] = arguments[ai];
                }
        }

        if (document.isDOMVComponent)
        {
                document = document.document;
        }

        if (document.nodeType !== domv.NodeType.DOCUMENT)
        {
                throw domv.Exception(Error('Invalid document parameter in domv.shorthand(), it is not really a Document Node'));
        }

        if (!tagName)
        {
                tagName = 'div';
        }

        if (arguments.length === 2 &&
            document.__domvShorthandCache__ &&
            document.__domvShorthandCache__[tagName])
        {
                return document.__domvShorthandCache__[tagName];
        }

        shorthandInstance = function(a0_, a1, a2, a3, a4)
        {
                var a0 = a0_;
                if (arguments.length <= 5)
                {
                        // fast case
                        if (typeof a0 === 'string')
                        {
                                a0 = {'class': a0 ? a0 : null};
                        }

                        return fn.call(thisObj, document, tagName, cloneNodesOnly(shorthandArguments), a0, a1, a2, a3, a4);
                }

                var args = new Array(arguments.length); // avoid leaking "arguments"
                for(var ai = 0; ai < arguments.length; ++ai) { args[ai] = arguments[ai]; }
                
                // First argument is always a className if it is a string
                // make sure it does not get interpreted as a text node
                if (typeof args[0] === 'string')
                {
                        args[0] = {'class': args[0] ? args[0] : null};
                }

                return fn.call(thisObj, document, tagName, cloneNodesOnly(shorthandArguments), args);
        };

        if (arguments.length === 2)
        {
                if (!document.__domvShorthandCache__)
                {
                        document.__domvShorthandCache__ = Object.create(null);
                }

                document.__domvShorthandCache__[tagName] = shorthandInstance;
        }

        return shorthandInstance;
};

/** Creates a new wrapped TextNode.
 * @param {!external:Document} document_
 * @param {...string} text Extra arguments will be joined using a space
 * @returns {!module:domv/lib/Component}
 * @example var wrappedDiv = require('domv').create(document, 'div');
 * var wrappedText = require('domv').text(document, 'Hi!');
 * wrappedDiv.appendChild(wrappedText);
 * console.log(wrappedDiv.outerNode.outerHTML);
 * // <div>Hi!</div>
 */
module.exports.text = function(document_, text_, t2, t3, t4, t5)
{
        var document = document_;
        var text = text_;

        if (!document)
        {
                throw new domv.Exception(Error('domv.text() : Missing argument'));
        }

        if (document.isDOMVComponent)
        {
                document = document.document;
        }

        switch (arguments.length)
        {
                case 1:
                        text = '';
                        break;
                case 2:
                        text = text.toString();
                        break;
                case 3:
                        text = text +' '+ t2;
                        break;
                case 4:
                        text = text +' '+ t2 +' '+ t3;
                        break;
                case 5:
                        text = text +' '+ t2 +' '+ t3 +' '+ t4;
                        break;
                case 6:
                        text = text +' '+ t2 +' '+ t3 +' '+ t4 +' '+ t5;
                        break;
                default:
                        var args = new Array(arguments.length-1); // avoid leaking "arguments"
                        for(var ai = 1; ai < arguments.length; ++ai) { args[ai-1] = arguments[ai]; }
                        text = args.join(' ');
        }

        return domv.wrap(document.createTextNode(text));
};

/** Create a new Document Node, including html, head, title and body tags.
 * @param {Boolean} [minimal=false] If true, only a doctype and a <html/> element is created.
 * @returns {!external:Document}
 */
module.exports.createHtmlDomDocument = function(minimal)
{
        var doc;
        var head, title;

        /* istanbul ignore else : Only called within webbrowsers */
        if (jsdom.jsdom)
        {
                // note: nwmatcher which is used in jsdom for querySelector,
                // requires a documentElement to be present!
                // Also, create html, head and body to be compatible with createHTMLDocument (unless minimal)
                doc = jsdom.jsdom(
                        minimal ? '<!DOCTYPE html><html/>'
                                : '<!DOCTYPE html><html><head><title> </title></head><body></body></html>',
                        {
                                features: {
                                        FetchExternalResources: false,
                                        ProcessExternalResources: false,
                                        MutationEvents: false
                                }
                        }
                );

                if (minimal)
                {
                        while (doc.documentElement.firstChild)
                        {
                                doc.documentElement.removeChild(doc.documentElement.firstChild);
                        }
                }

                return doc;
        }
        else if (global.document && global.document.implementation)
        {
                doc = global.document.implementation.createHTMLDocument(' ');

                if (minimal)
                {
                        while (doc.documentElement.firstChild)
                        {
                                doc.documentElement.removeChild(doc.documentElement.firstChild);
                        }
                }
                else
                {
                        // A title node is required in html 5 (and it must not be empty)
                        head = doc.getElementsByTagName('head')[0];
                        title = head.getElementsByTagName('title')[0];
                        if (!title)
                        {
                                title = doc.createElement('title');
                                title.textContent = ' ';
                                head.appendChild(title);
                        }
                }

                return doc;
        }
        else
        {
                throw maybeJsdomError(new domv.Exception(Error(
                        'Unable to find a Document implementation in domv.createHtmlDomDocument(). ' +
                       'The browser is too old, or jsdom is not installed (node.js/io.js).'
                )));
        }
};

/** Parse the given html markup text as a complete html docuemnt and return the outer "html" node.
 * Optionally an ownerDocument may be given which will specify what Document the new nodes belong to.
 * @param {!string} markup
 * @param {?external:Document} ownerDocument
 * @returns {!module:domv/lib/HtmlDocument}
 * @throws {module:domv/lib/Exception} If a dom html parser implementation is not available
 */
module.exports.parseHTMLDocument = function(markup, ownerDocument)
{
        var document;
        var parser;
        var node;

        if (ownerDocument)
        {
                if (ownerDocument.isDOMVComponent)
                {
                        ownerDocument = ownerDocument.document;
                }

                if (ownerDocument.nodeType !== domv.NodeType.DOCUMENT)
                {
                        throw domv.Exception(Error('Invalid ownerDocument parameter in domv.parseHTMLDocument(), it is not really a Document Node'));
                }
        }

        // Note: package.json excludes jsdom from browserify
        /* istanbul ignore else : Only called within web browsers */
        if (jsdom.jsdom)
        {
                document = jsdom.jsdom(markup, {
                        features: {
                                FetchExternalResources: false,
                                ProcessExternalResources: false,
                                MutationEvents: false
                        }
                });
        }
        else if (global.DOMParser)
        {
                // IE 10, excluding safari
                parser = new global.DOMParser();
                document = parser.parseFromString(markup, 'text/html');
        }
        else
        {
                // Safari / jsdom missing
                throw maybeJsdomError(domv.Exception(Error(
                        'Unable to find a DOM parser implementation in domv.parseHTMLDocument(). ' +
                        'The browser is too old, or jsdom is not installed (node.js/io.js)'
                )));
        }

        /* istanbul ignore if : jsdom never fails */
        if (!document)
        {
                throw domv.Exception(Error('Unable to parse the html markup (falsy document) in domv.parseHTMLDocument()'));
        }

        if (ownerDocument)
        {
                /* istanbul ignore if : not implemented in jsdom */
                if (ownerDocument.adoptNode)
                {
                        node = ownerDocument.adoptNode(document.documentElement);
                }
                else
                {
                        // creates a copy
                        node = ownerDocument.importNode(document.documentElement, true);
                }
        }
        else
        {
                node = document.documentElement;
        }

        /* istanbul ignore if : jsdom always creates a documentElement */
        if (!node)
        {
                throw domv.Exception(Error('Unable to parse the html markup (falsy document.documentElement) in domv.parseHTMLDocument()'));
        }

        return new domv.HtmlDocument(node);
};

/** Parse the given html markup text and return a (wrapped) DocumentFragment containing
 * the nodes the markup represents. The given markup must not be a full html document, otherwise
 * the html, head and body nodes will not be present, only their content.
 * An ownerDocument must be given which will specify what Document the new nodes belong to.
 * @param {!external:Document} ownerDocument
 * @param {!string} markup
 * @returns {!module:domv/lib/Component}
 * @throws {module:domv/lib/Exception} If a dom html parser implementation is not available
 */
module.exports.parseHTMLSnippit = function(ownerDocument, markup)
{
        var container;
        var fragment;

        if (!ownerDocument)
        {
                throw domv.Exception(Error('Invalid ownerDocument argument in domv.parseHTMLSnippit(), null'));
        }

        if (ownerDocument.isDOMVComponent)
        {
                ownerDocument = ownerDocument.document;
        }

        if (ownerDocument.nodeType !== domv.NodeType.DOCUMENT)
        {
                throw domv.Exception(Error('Invalid ownerDocument argument in domv.parseHTMLSnippit(), it is not really a Document Node'));
        }

        container = ownerDocument.createElement('div');
        container.innerHTML = markup;

        fragment = ownerDocument.createDocumentFragment();
        while (container.firstChild)
        {
                fragment.appendChild(container.firstChild);
        }

        return domv.wrap(fragment);
};

// No XML or XHTML support for now (jsdom does not support it yet)
// Watch : https://github.com/tmpvar/jsdom/issues/820

/**
 * Escape a string so that you can use it as a CSS String, such as a selector.
 * @example myComponent.selectorAll('a[href=' + domv.cssStringEscape(somevar) + ']');
 * @see {@link http://www.w3.org/TR/CSS21/syndata.html#strings}
 * @param {String} [str='undefined']
 * @param {boolean} [wrapInQuotes=true] If true, surround the result with quotes: "something"
 * @returns {String}
 */
module.exports.cssStringEscape = function(str, wrapInQuotes)
{
        str = str + '';

        str = str.replace(/[\\"']/g, '\\$&')
                .replace(/[\r]/g  , '\\d ') // CR
                .replace(/[\n]/g  , '\\a '); // LF

        if (wrapInQuotes || wrapInQuotes === void 123)
        {
                return '"' + str + '"';
        }

        return str;
};

/**
 * Given that 'event' is a mouse event, is the left mouse button being held down?.
 * @param {!external:Event} event
 * @returns {boolean} True if the left mouse button is down
 * @throws {module:domv/lib/Exception} For invalid arguments
 */
module.exports.isLeftMouseButton = function(event)
{
        if (!event)
        {
                throw domv.Exception(Error('Missing argument'));
        }

        /*jshint -W016*/
        return event.buttons & 1 ||
               event.button === 0;

        /* <= IE8 event.button (not supported by this library):
         * 1  : Left button
         * 2  : Right button
         * 4  : Middle button
         *
         * W3C event.button:
         * 0  : Left button
         * 2  : Right button
         * 1  : Middle button
         *
         * event.buttons:
         * 1  : Left button
         * 2  : Right button
         * 4  : Wheel button or middle button
         * 8  : 4th button (typically the "Browser Back" button)
         * 16 : 5th button (typically the "Browser Forward" button)
         */
};

/**
 * <p>The Node interface is the primary datatype for the entire Document Object Model.
 * It represents a single node in the document tree. While all objects implementing
 * the Node interface expose methods for dealing with children, not all objects implementing
 * the Node interface may have children. For example, Text nodes may not have children,
 * and adding children to such nodes results in a DOMException being raised.</p>
 * <p>The attributes nodeName, nodeValue and attributes are included as a mechanism
 * to get at node information without casting down to the specific derived interface.
 * In cases where there is no obvious mapping of these attributes for a specific nodeType
 * (e.g., nodeValue for an Element or attributes for a Comment), this returns null.
 * Note that the specialized interfaces may contain additional and more convenient
 * mechanisms to get and set the relevant information.</p>
 * @external Node
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Node}
 * @see {@link http://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-1950641247}
 */
/**
 * The Element interface represents an element in an HTML or XML document. Elements may
 * have attributes associated with them; since the Element interface inherits from Node,
 * the generic Node interface attribute attributes may be used to retrieve the set of all
 * attributes for an element. There are methods on the Element interface to retrieve either
 * an Attr object by name or an attribute value by name. In XML, where an attribute value
 * may contain entity references, an Attr object should be retrieved to examine the possibly
 * fairly complex sub-tree representing the attribute value. On the other hand, in HTML,
 * where all attributes have simple string values, methods to directly access an attribute
 * value can safely be used as a convenience.
 * @external Element
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element}
 * @see {@link http://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-745549614}
 */
/**
 * <p>The Document interface represents the entire HTML or XML document. Conceptually, it
 * is the root of the document tree, and provides the primary access to the document's
 * data.</p>
 * <p>Since elements, text nodes, comments, processing instructions, etc. cannot exist
 * outside the context of a Document, the Document interface also contains the factory
 * methods needed to create these objects. The Node objects created have a ownerDocument
 * attribute which associates them with the Document within whose context they were
 * created.</p>
 * @external Document
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/document}
 * @see {@link http://www.w3.org/TR/DOM-Level-3-Core/core.html#i-Document}
 */
/**
 * Creates an event object of the type specified. Returns the newly created object.
 * @function external:Document#createEvent
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/document.createEvent}
 * @see {@link http://www.w3.org/TR/DOM-Level-3-Events/#widl-DocumentEvent-createEvent}
 */
/**
 * <p>The CSSStyleDeclaration interface represents a CSS declaration block, including
 * its underlying state, where this underlying state depends upon the source of the
 * CSSStyleDeclaration instance.</p>
 * @external CSSStyleDeclaration
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration}
 * @see {@link http://dev.w3.org/csswg/cssom/#the-cssstyledeclaration-interface}
 */

/**
 * The Event interface is used to provide contextual information about an event to the handler processing the event.
 * An object which implements the Event interface is generally passed as the first parameter to an event handler.
 * More specific context information is passed to event handlers by deriving additional interfaces from Event which
 * contain information directly relating to the type of event they accompany. These derived interfaces are also implemented
 * by the object passed to the event listener.
 *
 * @external Event
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Event}
 * @see {@link http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-Event}
 */

/**
 * This object is created internally by a HTTP server (node.js), not by the user. It is passed as the second parameter to the 'request' event.
 * The response implements the Writable Stream interface
 * @external ServerResponse
 * @see {@link http://nodejs.org/api/http.html#http_class_http_serverresponse}
 */