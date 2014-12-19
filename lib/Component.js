'use strict';

var ClassList = require('./ClassList');
var domv;
var jsdom = require('jsdom');
var ownProp = ({}).hasOwnProperty;
var join = Array.prototype.join;
var undefined = void 123;

/** This is the super class for your components.
 * <p>It contains a handful of methods that simplify using the DOM.</p>
 * @module domv/lib/Component
 * @author Joris van der Wel <joris@jorisvanderwel.com>
 */

/** Each Component has two constructors, one is used to wrap existing DOM nodes, the other is used to create new
 * elements. Both constructors should result in the same DOM structure.
 *
 * Which constructor is used depends on the type of the node argument,
 * {@link module:domv/lib/Component#isCreationConstructor} is used to test for this. A DOCUMENT_NODE will result in the
 * creation constructor, any other node will result in the wrapping constructor.
 *
 * Any subclass should accept a Node as their first argument in their constructors. This library does not care about
 * any other argument in your constructors.
 *
 * @constructor
 * @alias module:domv/lib/Component
 * @param {!(external:Node|module:domv/lib/Component)} node Any kind of node or a component with an outerNode,this
 *        parameter determines which constructor is used using {@link module:domv/lib/Component#isCreationConstructor}.
 * @param {string} [defaultNodeName='div'] If the creation constructor is used, this will be the tag that gets used to create
 *        the default element. This is a convenience for subclasses.
 * @param {boolean} [wrapDocument=false] <p>Used by {@link module:domv.wrap}</p>
 * <p>If false, passing a DOCUMENT_NODE as
 * "node" will result in an empty tag being created instead of wrapping the DOCUMENT_NODE. This behaviour is more
 * convenient when subclassing Component because it lets you treat subclasses and subsubclasses in the same way.
 * <em>(e.g. the subclass Menu adds the class 'Menu' and common menu items. The subsubclass EventMenu adds the class
 * 'EventMenu' and further event menu items.)</em>
 * </p>
 * <p>If true, a document will always wrap.</p>
 * @throws {module:domv/lib/Exception} If an invalid or unsupported node is passed.
 * @example new Component(document.createElement('p')); // wraps a "p" element
 * @example new Component(document); // Creates an empty "div" element as a default
 * @example new Component(document, true); // Wraps the Document Node instead of creating
 *          an empty "div"
 */
function Component(node, defaultNodeName, wrapDocument)
{
        this.__boundListenFunctions__ = [];
        this.__document__ = null;
        this.__outerNode__ = null;
        this.__innerNode__ = null;

        if (node.isDOMVComponent)
        {
                node = node.outerNode;
        }

        if (node.nodeType === undefined ||
            node.nodeType === domv.NodeType.DOCUMENT_TYPE)
        {
                throw new domv.Exception(Error('The node parameter passed to the domv.Component constructor is not really a node, or it is an unsupported node type'));
        }

        if (node.nodeType === domv.NodeType.DOCUMENT)
        {
                this.document = node;
        }
        else
        {
                this.document = node.ownerDocument;
        }

        if (this.isCreationConstructor(node, wrapDocument))
        {
                node = domv.create(this.document, defaultNodeName || 'div');
        }

        this.innerNode = node;
        this.outerNode = node;
}
module.exports = Component;

/**
 * @param {!(external:Node|module:domv/lib/Component)} node A DOCUMENT_NODE will result in the
 * creation constructor, any other node will result in the wrapping constructor. A falsy value will also result in the
 * creation constructor and it used in Component subclasses that know how to create their own DOCUMENT_NODE
 * (e.g. {@link module:domv/lib/HtmlDocument}.
 * @param {boolean} [wrapDocument=false] <p>If false, passing a DOCUMENT_NODE as "node" will result in an empty tag
 * being created instead of wrapping the DOCUMENT_NODE. This behaviour is more convenient when subclassing Component
 * because it lets you treat subclasses and subsubclasses in the same way. <em>(e.g. the subclass Menu adds the
 * class 'Menu' and common menu items. The subsubclass EventMenu adds the class 'EventMenu' and further event menu
 * items.)</em></p>
 * <p>If true, a document will always wrap.</p>
 *
 * @returns {boolean} If thee creation constructor should be used instead of the wrapping constructor.
 */
Component.prototype.isCreationConstructor = function(node, wrapDocument)
{
        if (!node)
        {
                return true;
        }

        if (wrapDocument)
        {
                return false;
        }

        // DOCUMENT_NODE?
        if (node.isDOMVComponent)
        {
                return node.outerNodeType === domv.NodeType.DOCUMENT;
        }

        return node.nodeType === domv.NodeType.DOCUMENT;
};

Component.prototype.__boundListenFunctions__ = null;

/** Always true for instances of this class.
 * <p>Use this attribute to determine if an object is a Component.
 * This would let you create an object compatible with this API,
 * without having to use Component as a super type.</p>
 * @member {!boolean} isDOMVComponent
 * @memberOf module:domv/lib/Component
 * @constant
 * @instance
 */
Object.defineProperty(Component.prototype, 'isDOMVComponent', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: true
});

function ListenerData(listener, thisObject)
{
        this.originalListener = listener;
        this.thisObject = thisObject;
        this.boundListener = listener.bind(thisObject);
        this.bubbleUsage = Object.create(null);
        this.captureUsage = Object.create(null);
        this.index = -1;
}

ListenerData.prototype.matches = function(listener, thisObject)
{
        return this.originalListener === listener &&
               this.thisObject === thisObject;
};

ListenerData.prototype.addedDOM = function(event, useCapture)
{
        var usage = useCapture ? this.captureUsage : this.bubbleUsage;
        usage[event] = (usage[event] || 0) + 1;
};

ListenerData.prototype.removedDOM = function(event, useCapture)
{
        var usage = useCapture ? this.captureUsage : this.bubbleUsage;
        usage[event] = (usage[event] || 1) - 1;
};

function getListenerData(self, listener, thisObject)
{
        var list = self.__boundListenFunctions__;
        var data;
        var i;

        for (i = 0; i < list.length; ++i)
        {
                data = list[i];
                if (data && data.matches(listener, thisObject))
                {
                        return data;
                }
        }

        data = new ListenerData(listener, thisObject);

        for (i = 0; i < list.length; ++i)
        {
                if (!list[i])
                {
                        list[i] = data;
                        data.index = i;
                        return data;
                }
        }

        list[i] = data;
        data.index = i;
        return data;
}

function doneWithListenerData(self, data)
{
        var list = self.__boundListenFunctions__;

        function hasUsage(obj)
        {
                var key;

                for (key in obj)
                {
                        /* istanbul ignore else */
                        if (obj[key] > 0)
                        {
                                return true;
                        }
                }

                return false;
        }

        if (hasUsage(data.bubbleUsage) ||
            hasUsage(data.captureUsage))
        {
                return;
        }

        // This ListenData instance is no longer in use,
        // (do not resize the array, the slot will be reused)
        list[data.index] = null;
        data.index = -1;
}

/** Adds a listener to the DOM.
 * @param {!string} event
 * @param {!function} listener
 * @param {boolean} [useCapture=false] Use the capture phase (for dom events)
 * @param {*} [thisObject=this] The this object of "listener".
 *        By default the "this" object of this method is used
 * @returns {!module:domv/lib/Component} this
 * @throws {module:domv/lib/Exception} For invalid arguments
 */
Component.prototype.on = function(event, listener, useCapture, thisObject)
{
        if (!event ||
            typeof listener !== 'function')
        {
                throw new domv.Exception(Error('Component.prototype.on() : Missing or invalid argument'));
        }

        if (thisObject === undefined)
        {
                thisObject = this;
        }

        var listenerData = getListenerData(this, listener, thisObject);

        try
        {
                useCapture = !!useCapture;
                // force useCapture to a boolean so that undefined becomes false
                // this is needed because older browsers do not consider the 3rd argument
                // to be optional.
                this.outerNode.addEventListener(event, listenerData.boundListener, useCapture);
                listenerData.addedDOM(event, useCapture);
                return this;
        }
        finally
        {
                doneWithListenerData(this, listenerData);
        }
};

/** Adds a listener to the DOM or to the internal EventEmmiter, depending on the
 * type of the event (see {@link module:domv.isDOMEvent})
 * @method addListener
 * @memberOf module:domv/lib/Component
 * @instance
 * @param {!string} event
 * @param {!function} listener
 * @param {boolean} [useCapture=false] Use the capture phase (for dom events)
 * @param {*} [thisObject=this] The this object of "listener".
 *        By default the "this" object of this method is used
 * @returns {!module:domv/lib/Component} this
 */
Component.prototype.addListener = Component.prototype.on;



/** Removes a listener from the DOM.
 * All of the parameters must equal the parameters that were used in addListener.
 * @param {!string} event
 * @param {!function} listener
 * @param {boolean} [useCapture=false]
 * @param {*} [thisObject=this]
 * @returns {!module:domv/lib/Component} this
 */
Component.prototype.removeListener = function(event, listener, useCapture, thisObject)
{
        if (!event ||
            typeof listener !== 'function')
        {
                throw new domv.Exception(Error('Component.prototype.removeListener() : Missing or invalid argument'));
        }

        if (thisObject === undefined)
        {
                thisObject = this;
        }

        var listenerData = getListenerData(this, listener, thisObject);
        try
        {
                useCapture = !!useCapture;
                // force useCapture to a boolean so that undefined becomes false
                // this is needed because older browsers do not consider the 3rd argument
                // to be optional.
                this.outerNode.removeEventListener(event, listenerData.boundListener, useCapture);
                listenerData.removedDOM(event, useCapture);
                return this;
        }
        finally
        {
                doneWithListenerData(this, listenerData);
        }

};

/**
 * Mark that this Component should perform any cleanup it wants to.
 * Normally a Component do not need any cleanup, however this might be needed in special circumstances.
 * This implementation clears all dom listeners set through this Component instance and it emits (local) the
 * 'domv-cleanup' event.
 */
Component.prototype.cleanup = function()
{
        this.emit('domv-cleanup', {}, false, false);
        this.clearListeners();
};

/** Removes all (DOM) listeners from the outerNode. */
Component.prototype.clearListeners = function()
{
        var list = this.__boundListenFunctions__;
        var listenerData;
        var i;

        function removeAll(obj, useCapture)
        {
                var event;
                var count;

                for (event in obj)
                {
                        count = obj[event];
                        while ( (--count) >= 0)
                        {
                                /*jshint -W040 */
                                this.outerNode.removeEventListener(event, listenerData.boundListener, useCapture);
                                /*jshint +W040 */
                                listenerData.removedDOM(event, useCapture);
                        }
                }

                return false;
        }

        for (i = 0; i < list.length; ++i)
        {
                listenerData = list[i];
                if (!listenerData)
                {
                        continue;
                }

                removeAll.call(this, listenerData.bubbleUsage, false);
                removeAll.call(this, listenerData.captureUsage, true);

                doneWithListenerData(this, listenerData);
        }
};

/**
 * Emits a DOM custom Event on the outerNode with optional data. The listeners are passed an Event
 * object as their first argument which has this data set
 * @param {String} name The event name, a prefix should be added to prevent name clashes with any new event names in
 *        web browsers. (e.g. "domv-somethinghappened"
 * @param {Object} [data={}] Key value pairs to set on the Event object
 * @param {boolean} [bubbles=true]
 * @param {boolean} [cancelable=true]
 * @returns {!boolean} False if any of the event listeners has called preventDefault(), otherwise true
 * @throws {module:domv/lib/Exception} For invalid arguments
 */
Component.prototype.emit = function(name, data, bubbles, cancelable)
{
        var eventObject, o;

        if (!name)
        {
                throw new domv.Exception(Error('Component.prototype.emit() : Missing argument'));
        }

        eventObject = this.document.createEvent('Event');
        eventObject.initEvent(
                name,
                bubbles === undefined    ? true : !!bubbles,
                cancelable === undefined ? true : !!cancelable
        );

        if (!data)
        {
                data = {};
        }

        for (o in data)
        {
                /* istanbul ignore else */
                if (ownProp.call(data, o))
                {
                        eventObject[o] = data[o];
                }
        }

        return this.outerNode.dispatchEvent(eventObject);
};

/** The Document Node that the nodes of this Component are associated with.
 * @member {external:Document} document
 * @memberOf module:domv/lib/Component
 * @instance
 * @throws {module:domv/lib/Exception} If an invalid value is set
 */
Object.defineProperty(Component.prototype, 'document', {
        get: function()
        {
                return this.__document__;
        },
        set: function(document)
        {
                if (document !== null)
                {
                        if (document.isDOMVComponent)
                        {
                                document = document.outerNode;
                        }

                        if (document.nodeType !== domv.NodeType.DOCUMENT)
                        {
                                throw new domv.Exception(Error('Invalid value for domv.Component.document : Given document is not really a DOM Document Node.'));
                        }
                }

                this.__document__ = document;
        }
});

Component.prototype.__document__ = null;

/** The "outer" DOM Node for this component.
 * <p>This node is used to apply attributes or when adding this
 *    component as the child of another.</p>
 * <p>This property is usually set by the Component constructor</p>
 * @member {?external:Node} outerNode
 * @memberOf module:domv/lib/Component
 * @instance
 * @throws {module:domv/lib/Exception} If an invalid value is set
 */
Object.defineProperty(Component.prototype, 'outerNode', {
        get: function()
        {
                return this.__outerNode__;
        },
        set: function(node)
        {
                if (node !== null)
                {
                        if (node.isDOMVComponent)
                        {
                                node = node.outerNode;
                        }

                        if (typeof node.nodeType !== 'number')
                        {
                                throw new domv.Exception(Error('Invalid value for domv.Component.outerNode : Given node is not really a DOM Node.'));
                        }
                }

                if (this.__outerNode__ && this.__outerNode__ !== node)
                {
                        // These events are no longer valid for this component
                        this.clearListeners();
                }

                this.__outerNode__ = node;

                if (this.updateConsoleHack)
                {
                        this.updateConsoleHack();
                }
        }
});

Component.prototype.__outerNode__ = null;

/** The outer DOM node wrapped as a new component.
 * @member {!module:domv/lib/Component} outerNodeWrapped
 * @memberOf module:domv/lib/Component
 * @instance
 */

Object.defineProperty(Component.prototype, 'outerNodeWrapped', {
        get: function()
        {
                return domv.wrap(this.__outerNode__);
        },
        set: function(node)
        {
                this.outerNode = node;
        }
});

/** The "inner" DOM Node for this component.
 * <p>This is used when adding nodes or other components as the child of
 *    this Component. E.g. when using methods such as appendChild() and prependChild()
 *    or properties such as childNodes or firstChild</p>
 * <p>This property is usually set by the Component constructor,
 *    or by your subclass constructor</p>
 * <p>If this property is set to null, children are not allowed
 *    for this component. Note that innerNode may also reference
 *    nodes that do not allow children because of their type
 *    (such as a TextNode)</p>
 * @member {?external:Node} innerNode
 * @memberOf module:domv/lib/Component
 * @instance
 * @throws {module:domv/lib/Exception} If an invalid value is set
 */
Object.defineProperty(Component.prototype, 'innerNode', {
        get: function()
        {
                return this.__innerNode__;
        },
        set: function(node)
        {
                if (node !== null)
                {
                        if (node.isDOMVComponent)
                        {
                                node = node.outerNode;
                        }

                        if (typeof node.nodeType !== 'number')
                        {
                                throw new domv.Exception(Error('Invalid value for domv.Component.innerNode : Given node is not really a DOM Node.'));
                        }
                }

                this.__innerNode__ = node;

                if (this.updateConsoleHack)
                {
                        this.updateConsoleHack();
                }
        }
});

Component.prototype.__innerNode__ = null;

/** The inner DOM node wrapped as a new component.
 * @member {!module:domv/lib/Component} innerNodeWrapped
 * @memberOf module:domv/lib/Component
 * @instance
 */
Object.defineProperty(Component.prototype, 'innerNodeWrapped', {
        get: function()
        {
                return domv.wrap(this.__innerNode__);
        },
        set: function(node)
        {
                this.innerNode = node;
        }
});

/** Is the outer DOM node equal to the given node?.
 * If a Component is given the outer nodes of both components must match.
 * @param {?external:Node|module:domv/lib/Component} node
 * @returns {!boolean}
 */
Component.prototype.isOuterNodeEqual = function(node)
{
        if (node && node.isDOMVComponent)
        {
                node = node.outerNode;
        }

        return this.outerNode === node;
};

/** Is the inner DOM node equal to the given node?.
 * If a Component is given the inner nodes of both components must match.
 * @param {?external:Node|module:domv/lib/Component} node
 * @returns {!boolean}
 */
Component.prototype.isInnerNodeEqual = function(node)
{
        if (node && node.isDOMVComponent)
        {
                node = node.innerNode;
        }

        return this.innerNode === node;
};

/** Are the outer and inner node equal to the given node?
 * If a Component is given the outer and inner nodes of both components must match.
 * @param {?external:Node|module:domv/lib/Component} node
 * @returns {!boolean}
 */
Component.prototype.isNodeEqual = function(node)
{
        if (node && node.isDOMVComponent)
        {
                return this.outerNode === node.outerNode &&
                       this.innerNode === node.innerNode;
        }

        if (this.innerNode === null)
        {
                // this component does not allow children, only match with the outer node
                return this.outerNode === node;
        }

        return this.outerNode === node &&
               this.innerNode === node;
};

/** Convenient function to create a wrapped Node including its attributes (for elements).
 * @param {!string} nodeName
 * @param {?string} className
 * @param {...(string|external:Node|module:domv/lib/Component|Object.<string, string>)} [content]
 *        <p>If a string is passed, a text node is appended.</p>
 *        <p>If a node or component is passed, it is simply appended.</p>
 *        <p>If an object of key value pairs is passed, it sets those as attributes.</p>
 *
 * @returns {!module:domv/lib/Component}
 * @throws {module:domv/lib/Exception} For invalid arguments
 */
Component.prototype.create = function(nodeName, className, content, a4, a5, a6, a7, a8, a9)
{
        var args;

        switch (arguments.length)
        {
                case  0: return domv.create(this.document);
                case  1: return domv.create(this.document, nodeName);
                case  2: return domv.create(this.document, nodeName, className);
                case  3: return domv.create(this.document, nodeName, className, content);
                case  4: return domv.create(this.document, nodeName, className, content, a4);
                case  5: return domv.create(this.document, nodeName, className, content, a4, a5);
                case  6: return domv.create(this.document, nodeName, className, content, a4, a5, a6);
                case  7: return domv.create(this.document, nodeName, className, content, a4, a5, a6, a7);
                case  8: return domv.create(this.document, nodeName, className, content, a4, a5, a6, a7, a8);
                case  9: return domv.create(this.document, nodeName, className, content, a4, a5, a6, a7, a8, a9);
        }

        args = [this.document];
        for (var i = 0; i < arguments.length; ++i)
        {
                args.push(arguments[i]);
        }

        return domv.create.apply(domv, args);
};

/** Creates a new wrapped TextNode.
 * @param {...string} text_ Extra arguments will be joined using a space
 * @returns {!module:domv/lib/Component}
 * @example var wrappedDiv = require('domv').create(document, 'div');
 * var wrappedText = require('domv').text(document, 'Hi!');
 * wrappedDiv.appendChild(wrappedText);
 * console.log(wrappedDiv.outerNode.outerHTML);
 * // <div>Hi!</div>
 */
Component.prototype.text = function(text_, t2, t3, t4, t5)
{
        var text = text_; // do not reassign a parameter when using "arguments"
        switch (arguments.length)
        {
                case 0:
                        text = '';
                        break;
                case 1:
                        text = text.toString();
                        break;
                case 2:
                        text = text +' '+ t2;
                        break;
                case 3:
                        text = text +' '+ t2 +' '+ t3;
                        break;
                case 4:
                        text = text +' '+ t2 +' '+ t3 +' '+ t4;
                        break;
                case 5:
                        text = text +' '+ t2 +' '+ t3 +' '+ t4 +' '+ t5;
                        break;
                default:
                        var args = new Array(arguments.length); // avoid leaking "arguments"
                        for(var ai = 0; ai < arguments.length; ++ai) { args[ai] = arguments[ai]; }
                        text = args.join(' ');
        }

        return domv.wrap(this.document.createTextNode(text));
};

/** Generate a short hand function wich lets you quickly create
 * new elements (wrapped) including attributes.
 * @example var a = this.shorthand('a');
 * var link = a('readmore', {'href': something()}, 'Click here to readmore!');
 * // <a class="readmore" href="#example">Click here to readmore!</a>
 * @param {string} [tagName='div']
 * @param {...(string|Object.<string, string>)} initialAttributes 
 *        <p>If a string is passed, a text node is appended.</p>
 *        <p>If an object of key value pairs is passed, it sets those as attributes 
 *           (see {@link module:domv/lib/Component#attr}).</p>
 * @returns {!domv/lib/CreateShortHand}
 * @throws {module:domv/lib/Exception} For invalid arguments
 */
Component.prototype.shorthand = function(tagName, initialAttributes, a2, a3, a4, a5, a6, a7, a8, a9)
{
        var args;

        switch (arguments.length)
        {
                case  0: return domv.shorthand(this.document);
                case  1: return domv.shorthand(this.document, tagName);
                case  2: return domv.shorthand(this.document, tagName, initialAttributes);
                case  3: return domv.shorthand(this.document, tagName, initialAttributes, a2);
                case  4: return domv.shorthand(this.document, tagName, initialAttributes, a2, a3);
                case  5: return domv.shorthand(this.document, tagName, initialAttributes, a2, a3, a4);
                case  6: return domv.shorthand(this.document, tagName, initialAttributes, a2, a3, a4, a5);
                case  7: return domv.shorthand(this.document, tagName, initialAttributes, a2, a3, a4, a5, a6);
                case  8: return domv.shorthand(this.document, tagName, initialAttributes, a2, a3, a4, a5, a6, a7);
                case  9: return domv.shorthand(this.document, tagName, initialAttributes, a2, a3, a4, a5, a6, a7, a8);
                case 10: return domv.shorthand(this.document, tagName, initialAttributes, a2, a3, a4, a5, a6, a7, a8, a9);
        }
        
        args = [this.document];
        var i;
        
        for (i = 0; i < arguments.length; ++i)
        {
                args.push(arguments[i]);
        }
        
        return domv.shorthand.apply(domv, args);
};

/** Generate a short hand function which lets you quickly create
 * new text nodes (wrapped).
 * @example var text = this.textShorthand();
 * var wraped = text('bla');
 * wrapped = text('foo', 'bar'); // 'foo bar'
 * @returns {!function}
 */
Component.prototype.textShorthand = function()
{
        var document = this.document;

        if (ownProp.call(document, '__domv__textShorthandCache__'))
        {
                return document.__domv__textShorthandCache__;
        }

        return document.__domv__textShorthandCache__ = function(text)
        {
                if (arguments.length === 0)
                {
                        return domv.wrap(document.createTextNode(''));
                }

                if (arguments.length === 1)
                {
                        return domv.wrap(document.createTextNode(text + ''));
                }

                var args = new Array(arguments.length); // avoid leaking "arguments"
                for(var ai = 0; ai < arguments.length; ++ai) { args[ai] = arguments[ai]; }

                return domv.wrap(document.createTextNode(args.join(' ')));
        };
};

/** Add a child node at the end of the inner node.
 * @param {...(module:domv/lib/Component|external:Node)} node_ A plain Node or if a Component is passed, the outerNode.
 * @returns {!module:domv/lib/Component} this
 * @throws {module:domv/lib/Exception} If this Component does not support child nodes.
 */
Component.prototype.appendChild = function(node_)
{
        var inner = this.innerNode;
        var i;
        var node = node_;
        domv.mayContainChildren(inner, true);

        for (i = 0; i < arguments.length; ++i)
        {
                node = arguments[i];

                if (typeof node === 'string' || node instanceof String)
                {
                        node = this.document.createTextNode(node);
                }

                if (!node)
                {
                        continue;
                }

                if (node.isDOMVComponent)
                {
                        node = node.outerNode;
                }

                inner.appendChild(node);
        }

        return this;
};

/** Add a child node at the beginning of the inner node.
 * @param {...(module:domv/lib/Component|external:Node)} node_ A plain Node or if a Component is passed, the outerNode.
 * @returns {!module:domv/lib/Component} this
 * @throws {module:domv/lib/Exception} Will throw if this Component does not support child nodes.
 */
Component.prototype.prependChild = function(node_)
{
        var inner = this.innerNode;
        var firstChild;
        var i;
        var node = node_;

        domv.mayContainChildren(inner, true);
        firstChild = inner.firstChild;

        // <div><h3/></div>
        // div.prependChild(h1(), h2()) // acts as if a DocumentFragment was used
        // <div><h1/><h2/><h3/></div>

        // <div><h3/></div>
        // div.prependChild(h2());
        // div.prependChild(h1());
        // <div><h1/><h2/><h3/></div>

        for (i = 0; i < arguments.length; ++i)
        {
                node = arguments[i];

                if (typeof node === 'string' || node instanceof String)
                {
                        node = this.document.createTextNode(node);
                }

                if (!node)
                {
                        continue;
                }

                if (node.isDOMVComponent)
                {
                        node = node.outerNode;
                }

                inner.insertBefore(node, firstChild);
        }

        return this;
};

/** Add a sibling node before the outer node. (which will become the outer node's previousSibling)
 * @param {...(module:domv/lib/Component|external:Node)} node_ A plain Node or if a Component is passed, the outerNode.
 * @returns {!module:domv/lib/Component} this
 * @throws {module:domv/lib/Exception} Will throw if this Component does not support child nodes.
 */
Component.prototype.siblingBefore = function(node_)
{
        var outer = this.outerNode;
        var i;
        var node = node_;

        if (!outer.parentNode)
        {
                throw new domv.Exception(Error('The outerNode for this Component has no parentNode'));
        }

        for (i = 0; i < arguments.length; ++i)
        {
                node = arguments[i];

                if (typeof node === 'string' || node instanceof String)
                {
                        node = this.document.createTextNode(node);
                }

                if (!node)
                {
                        continue;
                }

                if (node.isDOMVComponent)
                {
                        node = node.outerNode;
                }

                outer.parentNode.insertBefore(node, outer);
        }

        return this;
};

/** Add a sibling node after the outer node. (which will become the outer node's nextSibling)
 * @param {...(module:domv/lib/Component|external:Node)} node_ A plain Node or if a Component is passed, the outerNode.
 * @returns {!module:domv/lib/Component} this
 * @throws {module:domv/lib/Exception} Will throw if this Component does not support child nodes.
 */
Component.prototype.siblingAfter = function(node_)
{
        var outer = this.outerNode;
        var nextSibling = outer.nextSibling;
        var i;
        var node = node_;

        if (!outer.parentNode)
        {
                throw new domv.Exception(Error('The outerNode for this Component has no parentNode'));
        }

        for (i = 0; i < arguments.length; ++i)
        {
                node = arguments[i];

                if (typeof node === 'string' || node instanceof String)
                {
                        node = this.document.createTextNode(node);
                }

                if (!node)
                {
                        continue;
                }

                if (node.isDOMVComponent)
                {
                        node = node.outerNode;
                }

                outer.parentNode.insertBefore(node, nextSibling);
        }

        return this;
};


/** Removes the outer node from its parentNode.
 * @returns {!module:domv/lib/Component} this
 */
Component.prototype.removeNode = function()
{
        var outer = this.outerNode;
        if (outer.parentNode)
        {
                outer.parentNode.removeChild(outer);
        }
        return this;
};

/** Removes the all the children of the inner node
 * @returns {!module:domv/lib/Component} this
 */
Component.prototype.removeChildren = function()
{
        var inner = this.innerNode;
        if (!inner)
        {
                return this;
        }

        // lastChild is a bit faster than firstChild in some implementations
        // this is because removing the last child first prevents array index reordering
        while (inner.lastChild)
        {
                inner.removeChild(inner.lastChild);
        }
        return this;
};

/** Add a className on the outer node.
 * @param {...string} cls The className to add
 * @returns {!module:domv/lib/Component} this
 * @throws {module:domv/lib/Exception} If the outer node of this Component does not support attributes;
 */
Component.prototype.cls = function(cls)
{
        return this.addClass.apply(this, arguments);
};


/** Add classNames on the outer node.
 * @param {...string} cls The classNames to add
 * @returns {!module:domv/lib/Component} this
 * @throws {module:domv/lib/Exception} If the outer node of this Component does not support attributes;
 */
Component.prototype.addClass = function(cls)
{
        var outer = this.outerNode;
        if (outer.nodeType !== domv.NodeType.ELEMENT)
        {
                throw new domv.Exception(Error('Component.prototype.addClass() : The outer node is not an element'));
        }

        // classList is not implemented by jsdom
        var classList = outer.classList ? /* istanbul ignore next */ outer.classList : new ClassList(outer);
        classList.add.apply(classList, arguments);

        return this;
};

/** Remove classNames from the outer node.
 * @param {...string} cls The classNames to remove
 * @returns {!module:domv/lib/Component} this
 * @throws {module:domv/lib/Exception} If the outer node of this Component does not support attributes;
 */
Component.prototype.removeClass = function(cls)
{
        var outer = this.outerNode;
        if (outer.nodeType !== domv.NodeType.ELEMENT)
        {
                throw new domv.Exception(Error('Component.prototype.removeClass() : The outer node is not an element'));
        }

        var classList = outer.classList ? /* istanbul ignore next */ outer.classList : new ClassList(outer);
        classList.remove.apply(classList, arguments);
        return this;
};

/** Does the outer node contain all of the given classNames?
 * @param {...string} cls The classNames to check.
 * @returns {!boolean}
 */
Component.prototype.hasClass = function(cls)
{
        var outer = this.outerNode;
        var classList;
        var i;

        if (outer.nodeType !== domv.NodeType.ELEMENT)
        {
                return false;
        }

        classList = outer.classList ? /* istanbul ignore next */ outer.classList : new ClassList(outer);

        for (i = 0; i < arguments.length; ++i)
        {
                if (!classList.contains.call(classList, arguments[i]))
                {
                        return false;
                }
        }

        return true;
};

/** Does the outer node contain all of the given classNames?
 * @param {...string} cls The classNames to check.
 * @throws {module:domv/lib/Exception} If the outer node of this Component does not contain all of the given classNames
 */
Component.prototype.assertHasClass = function(cls)
{
        if (!this.hasClass.apply(this, arguments))
        {
                if (arguments.length === 1)
                {
                        throw new domv.Exception(Error('Component should contain the class "' + cls + '"'));
                }
                else
                {
                        // avoid leaking "arguments"
                        var args = new Array(arguments.length);
                        for(var ai = 0; ai < arguments.length; ++ai) { args[ai] = arguments[ai]; }
                        throw new domv.Exception(Error('Component should contain all of the classes: "' + args.join('", "') + '"'));
                }
        }
};

/** Toggle a className on the outer node.
 * @param {!string} cls The className to toggle
 * @param {?boolean} force If set, force the class name to be added (true) or removed (false).
 * @returns {!boolean}
 * @throws {module:domv/lib/Exception} If the outer node of this Component does not support attributes
 */

Component.prototype.toggleClass = function(cls, force)
{
        var outer = this.outerNode;
        if (outer.nodeType !== domv.NodeType.ELEMENT)
        {
                throw new domv.Exception(Error('Component.prototype.toggleClass() : The outer node is not an element'));
        }

        if (force !== undefined)
        {
                // Some browsers do not support the second argument
                if (force)
                {
                        this.addClass(cls);
                }
                else
                {
                        this.removeClass(cls);
                }
                return !!force;
        }

        var classList = outer.classList ? /* istanbul ignore next */ outer.classList : new ClassList(outer);
        return classList.toggle.apply(classList, arguments);
};


/** Set/unset an attribute on the outer node.
 * @param {!(string|Object.<string, string>)} name The attribute name to unset/set.
 *        Or an object of key value pairs which sets multiple attributes at the same time,
 *        in this case "value" should not be set.

 * @param {?(string|boolean)} value The value to set.
 *        Use boolean false or null to unset the attribute. Use boolean true to set a boolean attribute (e.g. checked="checked").
 *        If an object or array is passed, it is stringified using JSON.
 * @returns {!(module:domv/lib/Component)} this
 * @throws {module:domv/lib/Exception} If the outer node of this Component does not support attributes;
 */
Component.prototype.attr = function(name, value)
{
        function single(node, name, value)
        {
                if (value === false || value === null || value === undefined)
                {
                        node.removeAttribute(name);
                }
                else if (value === true)
                {
                        node.setAttribute(name, name);
                }
                else if (typeof value === 'string' ||
                         typeof value === 'number' ||
                         value instanceof String ||
                         value instanceof Number
                         )
                {
                        node.setAttribute(name, value.toString());
                }
                else
                {
                        node.setAttribute(name, global.JSON.stringify(value));
                }
        }

        var outer = this.outerNode;

        if (outer.nodeType !== domv.NodeType.ELEMENT)
        {
                throw new domv.Exception(Error('Component.prototype.attr() : The outer node is not an element'));
        }

        if (typeof name === 'object' && !(name instanceof String))
        {
                for (var key in name)
                {
                        /* istanbul ignore else */
                        if (ownProp.call(name, key))
                        {
                                single(outer, key, name[key]);
                        }
                }

                return this;
        }

        single(outer, name, value);

        return this;
};

/** Get the value of a single attribute of the outer node.
 * @param {!string} name The attribute name to get.
 * @param {boolean} [json=false] If true, the attribute value is parsed as json
 * @returns {?string} The attribute value
 */
Component.prototype.getAttr = function(name, json)
{
        var outer = this.outerNode;
        var value;

        if (outer.nodeType !== domv.NodeType.ELEMENT)
        {
                return null;
        }

        value = outer.getAttribute(name);

        if (json)
        {
                value = global.JSON.parse(value);
        }

        return value;
};

var queryTemporaryID = 'domvcomponentgenid' + Math.floor(Math.random() * 10000000);

var doQuerySelector = function(node, selector, method, wrapArgs)
{
        var document = node.ownerDocument;
        var fragment;
        var ret = null;
        var a;

        if (!selector ||
            (node.nodeType !== domv.NodeType.ELEMENT && (node.nodeType !== domv.NodeType.DOCUMENT)))
        {
                return method === 'querySelectorAll' ? [] : null;
        }

        // Lets you use something like .querySelector('> .title');

        if (node.nodeType === domv.NodeType.DOCUMENT)
        {
                // caveat: '> html' is not possible
                ret = node[method](selector);
        }
        else // ELEMENT
        {
                try
                {
                        if (!node.parentNode)
                        {
                                /* buggy in nwmatcher:
                                 fragment = document.createDocumentFragment();
                                 fragment.appendChild(node);
                                 */
                                fragment = document.createElement('_fragment_');
                                fragment.appendChild(node);
                        }

                        var id = node.getAttribute('id');
                        if (id)
                        {
                                // stringify should take care of any escaping
                                selector = '[id=' + JSON.stringify(id) + '] ' + selector;
                                ret = node.parentNode[method](selector);
                        }
                        else
                        {
                                id = queryTemporaryID;

                                try
                                {
                                        node.setAttribute('id', id);
                                        selector = '[id=' + JSON.stringify(id) + '] ' + selector;
                                        ret = node.parentNode[method](selector);
                                }
                                finally
                                {
                                        node.removeAttribute('id');
                                }
                        }
                }
                finally
                {
                        if (fragment)
                        {
                                fragment.removeChild(node);
                        }
                }
        }

        a = wrapArgs;
        switch (a.length)
        {
                case  0: return domv.wrap(ret);
                case  1: return domv.wrap(ret, a[0]);
                case  2: return domv.wrap(ret, a[0], a[1]);
                case  3: return domv.wrap(ret, a[0], a[1], a[2]);
                case  4: return domv.wrap(ret, a[0], a[1], a[2], a[3]);
                case  5: return domv.wrap(ret, a[0], a[1], a[2], a[3], a[4]);
                case  6: return domv.wrap(ret, a[0], a[1], a[2], a[3], a[4], a[5]);
                case  7: return domv.wrap(ret, a[0], a[1], a[2], a[3], a[4], a[5], a[6]);
                case  8: return domv.wrap(ret, a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7]);
                case  9: return domv.wrap(ret, a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8]);
                case 10: return domv.wrap(ret, a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9]);
                case 11: return domv.wrap(ret, a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10]);
                default: throw domv.Exception(Error('selector : Constructor argument length of ' + a.length + ' has not been implemented'));
        }
};


/** Returns the first element, or null, that matches the specified single selector.
 * (applied on the inner node)
 * @param {!string} selector
 * @param {?function} [componentConstructor=module:domv/lib/Component] The constructor to
 *         use to wrap the result Node, by default the Node is wrapped in a plain Component,
 *         but it is also possible to specify your own constructor.
 * @returns {?module:domv/lib/Component}
 */
Component.prototype.selector = function(selector, ComponentConstructor)
{
        // avoid leaking "arguments"
        var args = new Array(arguments.length-1);
        for(var ai = 1; ai < arguments.length; ++ai) { args[ai-1] = arguments[ai]; }

        return doQuerySelector(this.innerNode, selector, 'querySelector', args);
};


/** Returns the first element that matches the specified single selector.
 * (applied on the inner node)
 * @param {!string} selector
 * @param {?function} [componentConstructor=module:domv/lib/Component] The constructor to
 *         use to wrap the result Node, by default the Node is wrapped in a plain Component,
 *         but it is also possible to specify your own constructor.
 * @returns {!module:domv/lib/Component}
 * @throws {module:domv/lib/Exception} If no element was found
 */
Component.prototype.assertSelector = function(selector, ComponentConstructor)
{
        // avoid leaking "arguments"
        var args = new Array(arguments.length-1);
        for(var ai = 1; ai < arguments.length; ++ai) { args[ai-1] = arguments[ai]; }
        var ret = doQuerySelector(this.innerNode, selector, 'querySelector', args);

        if (!ret)
        {
                throw new domv.Exception(Error('Component must contain an element that matches the selector "' + selector + '"'));
        }

        return ret;
};


/** Returns a list of all elements that matches the specified single selector.
 * (applied on the inner node)
 * @param {!string} selector
 * @param {?function} [componentConstructor=module:domv/lib/Component] The constructor to
 *         use to wrap the resulting Nodes, by default the Nodes are wrapped in a plain Component,
 *         but it is also possible to specify your own constructor.
 * @returns {!module:domv/lib/Component[]}
 */
Component.prototype.selectorAll = function(selector, ComponentConstructor)
{
        // avoid leaking "arguments"
        var args = new Array(arguments.length-1);
        for(var ai = 1; ai < arguments.length; ++ai) { args[ai-1] = arguments[ai]; }
        return doQuerySelector(this.innerNode, selector, 'querySelectorAll', args);
};

/** Copy all attributes from the given element to our outer node.
 * @param {!module:domv/lib/Component|external:Element} from A DOM Element or if a Component is passed, the outerNode.
 * @throws {module:domv/lib/Exception} If the outer node or the given element is not an element
 */
Component.prototype.adoptAllAttributes = function(from)
{
        var outer = this.outerNode;
        if (from.isDOMVComponent)
        {
                from = from.outerNode;
        }

        if (outer.nodeType !== domv.NodeType.ELEMENT)
        {
                throw new domv.Exception(Error('Component.prototype.adoptAllAttributes() : The outer node is not an element'));
        }

        if (from.nodeType !== domv.NodeType.ELEMENT)
        {
                throw new domv.Exception(Error('Component.prototype.adoptAllAttributes() : The outer node is not an element'));
        }

        var length = from.attributes.length;
        for (var i = 0; i < length; ++i)
        {
                var attr = from.attributes.item(i);
                outer.setAttribute(attr.name, attr.value);
        }
};

/** Move over all child nodes of the inner node to the given "node" and replace
 * the outer node with the given "node".
 * @example var container = document.createElement('div');
 * container.innerHTML = '<section>abc<p>def<strong>ghj</strong>klm</p>nop</section>';
 * domv.wrap(container).selector('p').swap(document.createElement('h1'));
 * console.log(container.innerHTML);
 * //  '<section>abc<h1>def<strong>ghj</strong>klm</h1>nop</section>'
 * @param {?(Element|module:domv/lib/Component)} node The node to replace our outer node with.
 * If not set, the children of our inner node are added to the parent of the outer node.
 * @throws {module:domv/lib/Exception} If the outer node or the given element is not an element
 */
Component.prototype.swapNode = function(node)
{
        var outer = this.outerNode;
        var inner = this.innerNode;

        if (node === null || node === undefined)
        {
                node = this.document.createDocumentFragment();
        }

        var nodeOuter = node;
        var nodeInner = node;

        if (node.isDOMVComponent)
        {
                nodeOuter = node.outerNode;
                nodeInner = node.innerNode;
        }

        if (nodeInner === inner)
        {
                return;
        }

        if (inner && inner.firstChild)
        {
                domv.mayContainChildren(nodeInner, true);

                while (inner.firstChild)
                {
                        nodeInner.appendChild(inner.firstChild);
                }
        }

        if (outer.parentNode)
        {
                outer.parentNode.replaceChild(nodeOuter, outer);
        }
};

/** Does the innerNode (and its (grand)children) of this component only consist of whitespace?
 * Text nodes that only consist of spaces, newlines and horizontal tabs are whitespace.
 * Comment nodes are whitespace.
 * Empty text, comment, element nodes are whitespace.
 * Certain content elements such as for example img, video, input, etc are not whitespace.
 *
 * @param {boolean} [checkChildElements=false] If false any element node (e.g. an empty div) that is
 *        encountered will fail the whitespace check. If true those elements are checked recursively
 *        for whitepspace
 * @returns {!boolean}
 */
Component.prototype.isAllWhiteSpace = function(checkChildElements)
{
        function isWhiteSpace(node, first)
        {
                var i;
                var chr;
                var length;

                if (node.nodeType === domv.NodeType.ELEMENT)
                {
                        switch(node.nodeName.toLowerCase())
                        {
                                case 'audio':
                                case 'button':
                                case 'canvas':
                                case 'embed':
                                case 'figure':
                                case 'hr':
                                case 'iframe':
                                case 'img':
                                case 'input':
                                case 'object':
                                case 'video':
                                        return false;
                        }

                        if (checkChildElements || first)
                        {
                                length = node.childNodes.length;
                                for (i = 0; i < length; ++i)
                                {
                                        if (!isWhiteSpace(node.childNodes[i], false))
                                        {
                                                return false;
                                        }
                                }

                                return true;
                        }
                        else
                        {
                                return false;
                        }
                }
                else if (node.nodeType === domv.NodeType.COMMENT)
                {
                        return true;
                }

                // CharacterData node

                if (node.length === 0)
                {
                        return true;
                }

                for (i = 0; i < node.data.length; ++i)
                {
                        chr = node.data[i];

                        if (chr !== ' ' && chr !== '\t' && chr !== '\n' && chr !== '\r')
                        {
                                return false;
                        }
                }

                return true;
        }

        return isWhiteSpace(this.outerNode, true);
};

/** The inline style for the outer node.
 * @member {external:CSSStyleDeclaration} style
 * @memberOf module:domv/lib/Component
 * @instance
 */
Object.defineProperty(Component.prototype, 'style', {
        get: function()
        {
                return this.outerNode.style;
        }
});

/** The (wrapped) child elements of the inner node.
 * The returned list is not live.
 * @member {!module:domv/lib/Component[]} children
 * @memberOf module:domv/lib/Component
 * @instance
 */
Object.defineProperty(Component.prototype, 'children', {
        get: function()
        {
                var inner = this.innerNode;
                if (!inner) { return []; }

                if (inner.nodeType !== domv.NodeType.ELEMENT &&
                    inner.nodeType !== domv.NodeType.DOCUMENT &&
                    inner.nodeType !== domv.NodeType.DOCUMENT_FRAGMENT)
                {
                        return []; // jsdom workaround
                }

                return domv.wrap(inner.children);
        }
});

/** The index of the outerNode in the "children" attribute of the parentNode.
 * @example myParent.children[3].childrenIndex === 3
 * @member {int} childrenIndex
 * @memberOf module:domv/lib/Component
 * @instance
 */
Object.defineProperty(Component.prototype, 'childrenIndex', {
        get: function()
        {
                var outer = this.outerNode;

                if (!outer ||
                    !outer.parentNode)
                {
                        return -1;
                }

                var index = 0;
                var node = outer.previousSibling;
                while (node)
                {
                        if (node.nodeType === domv.NodeType.ELEMENT)
                        {
                                ++index;
                        }
                        node = node.previousSibling;
                }

                return index;
        }
});

/** The (wrapped) child nodes of the inner node.
 * The returned list is not live.
 * @member {!module:domv/lib/Component[]} childNodes
 * @memberOf module:domv/lib/Component
 * @instance
 */
Object.defineProperty(Component.prototype, 'childNodes', {
        get: function()
        {
                if (!this.innerNode) { return []; }
                return domv.wrap(this.innerNode.childNodes);
        }
});

/** The index of the outerNode in the "childNodes" attribute of the parentNode.
 * @example myParent.childNodes[3].childNodesIndex === 3
 * @member {int} childNodesIndex
 * @memberOf module:domv/lib/Component
 * @instance
 */
Object.defineProperty(Component.prototype, 'childNodesIndex', {
        get: function()
        {
                var outer = this.outerNode;

                if (!outer ||
                    !outer.parentNode)
                {
                        return -1;
                }

                var index = 0;
                var node = outer.previousSibling;
                while (node)
                {
                        ++index;
                        node = node.previousSibling;
                }

                return index;
        }
});

/** Is the inner node empty?
 * For Element nodes this means that there are 0 child nodes.
 * For CharacterData nodes, the text content must be of 0 length.
 * Other nodes are never considered empty
 * @member {!boolean} isEmpty
 * @memberOf module:domv/lib/Component
 * @instance
 */
Object.defineProperty(Component.prototype, 'isEmpty', {
        get: function()
        {
                if (!this.innerNode)
                {
                        return true;
                }

                switch (this.innerNode.nodeType)
                {
                        case domv.NodeType.ELEMENT:
                        case domv.NodeType.DOCUMENT:
                        case domv.NodeType.DOCUMENT_FRAGMENT:
                                return this.innerNode.childNodes.length === 0;
                        case domv.NodeType.TEXT:
                        case domv.NodeType.PROCESSING_INSTRUCTION:
                        case domv.NodeType.COMMENT:
                                return this.innerNode.length === 0;
                        /* istanbul ignore next */
                        default:
                                return false;
                }
        }
});

/** The first (wrapped) child node of the inner node.
 * @member {?module:domv/lib/Component} firstChild
 * @memberOf module:domv/lib/Component
 * @instance
 */
Object.defineProperty(Component.prototype, 'firstChild', {
        get: function()
        {
                if (!this.innerNode) { return null; }
                return domv.wrap(this.innerNode.firstChild);
        }
});

/** The first (wrapped) child node of the inner node.
 * @member {?module:domv/lib/Component} lastChild
 * @memberOf module:domv/lib/Component
 * @instance
 */
Object.defineProperty(Component.prototype, 'lastChild', {
        get: function()
        {
                if (!this.innerNode) { return null; }
                return domv.wrap(this.innerNode.lastChild);
        }
});


/** The first (wrapped) child node of the inner node that is an element.
 * @member {?module:domv/lib/Component} firstElementChild
 * @memberOf module:domv/lib/Component
 * @instance
 */
Object.defineProperty(Component.prototype, 'firstElementChild', {
        get: function()
        {
                if (!this.innerNode) { return undefined; }

                var inner = this.innerNode;
                /* istanbul ignore else : firstElementChild is not implemented in jsdom */
                if (inner.firstElementChild === undefined)
                {
                        var node = inner.firstChild || undefined;
                        while (node && node.nodeType !== domv.NodeType.ELEMENT)
                        {
                                node = node.nextSibling;
                        }
                        return domv.wrap(node);
                }

                /* istanbul ignore next */
                return domv.wrap(inner.firstElementChild);
        }
});

/** The last (wrapped) child node of the inner node that is an element.
 * @member {?module:domv/lib/Component} lastElementChild
 * @memberOf module:domv/lib/Component
 * @instance
 */
Object.defineProperty(Component.prototype, 'lastElementChild', {
        get: function()
        {
                var inner = this.innerNode;
                if (!this.innerNode) { return undefined; }

                /* istanbul ignore else : lastElementChild is not implemented in jsdom */
                if (inner.lastElementChild === undefined)
                {
                        var node = inner.lastChild || undefined;
                        while (node && node.nodeType !== domv.NodeType.ELEMENT)
                        {
                                node = node.previousSibling;
                        }
                        return domv.wrap(node);
                }

                /* istanbul ignore next */
                return domv.wrap(inner.lastElementChild);
        }
});

/** The next (wrapped) sibling of the outer node.
 * @member {?module:domv/lib/Component} nextSibling
 * @memberOf module:domv/lib/Component
 * @instance
 */
Object.defineProperty(Component.prototype, 'nextSibling', {
        get: function()
        {
                return domv.wrap(this.outerNode.nextSibling);
        }
});

/** The previous (wrapped) sibling of the outer node.
 * @member {?module:domv/lib/Component} previousSibling
 * @memberOf module:domv/lib/Component
 * @instance
 */
Object.defineProperty(Component.prototype, 'previousSibling', {
        get: function()
        {
                return domv.wrap(this.outerNode.previousSibling);
        }
});

/** The next (wrapped) sibling of the outer node that is an element.
 * @member {?module:domv/lib/Component} nextElementSibling
 * @memberOf module:domv/lib/Component
 * @instance
 */
Object.defineProperty(Component.prototype, 'nextElementSibling', {
        get: function()
        {
                var outer = this.outerNode;

                /* istanbul ignore else : nextElementSibling is not implemented in jsdom */
                if (outer.nextElementSibling === undefined)
                {
                        var node = outer.nextSibling;
                        while (node && node.nodeType !== domv.NodeType.ELEMENT)
                        {
                                node = node.nextSibling;
                        }
                        return domv.wrap(node);
                }

                /* istanbul ignore next */
                return domv.wrap(outer.nextElementSibling);
        }
});

/** The previous (wrapped) sibling of the outer node that is an element.
 * @member {?module:domv/lib/Component} previousElementSibling
 * @memberOf module:domv/lib/Component
 * @instance
 */
Object.defineProperty(Component.prototype, 'previousElementSibling', {
        get: function()
        {
                var outer = this.outerNode;

                /* istanbul ignore else : previousElementSibling is not implemented in jsdom */
                if (outer.previousElementSibling === undefined)
                {
                        var node = outer.previousSibling;
                        while (node && node.nodeType !== domv.NodeType.ELEMENT)
                        {
                                node = node.previousSibling;
                        }
                        return domv.wrap(node);
                }

                /* istanbul ignore next */
                return domv.wrap(outer.previousElementSibling);
        }
});

/** The (wrapped) parent node of the outer node.
 * @member {?module:domv/lib/Component} parentNode
 * @memberOf module:domv/lib/Component
 * @instance
 */
Object.defineProperty(Component.prototype, 'parentNode', {
        get: function()
        {
                return domv.wrap(this.outerNode.parentNode);
        }
});

/** The textual content of an element and all its descendants.
 * Or for Text, Comment, etc nodes it represents the nodeValue.
 * Setting this property on an element removes all of its children
 * and replaces them with a single text node with the given value.
 * @member {!string} textContent
 * @memberOf module:domv/lib/Component
 * @instance
 */
Object.defineProperty(Component.prototype, 'textContent', {
        get: function()
        {
                return this.innerNode.textContent;
        },
        set: function(value)
        {
                this.innerNode.textContent = value;
        }
});

/** The value of this node. For most nodes this property is undefined, for input fields this
 * contains the current value. (The attribute "value" does not change by user input).
 * @member {!string} value
 * @memberOf module:domv/lib/Component
 * @instance
 */
Object.defineProperty(Component.prototype, 'value', {
        get: function()
        {
                return this.innerNode.value;
        },
        set: function(value)
        {
                this.innerNode.value = value;
        }
});


/** The checked state of this node. For most nodes this property is undefined, for input elements this
 * contains the checked state. (The attribute "checked" does not change by user input).
 * @member {!boolean} checked
 * @memberOf module:domv/lib/Component
 * @instance
 */
Object.defineProperty(Component.prototype, 'checked', {
        get: function()
        {
                return this.innerNode.checked;
        },
        set: function(value)
        {
                this.innerNode.checked = !!value;
        }
});


/** The selected state of this node. For most nodes this property is undefined, for option elements this
 * contains the current selected state. (The attribute "selected" does not change by user input).
 * @member {!boolean} selected
 * @memberOf module:domv/lib/Component
 * @instance
 */
Object.defineProperty(Component.prototype, 'selected', {
        get: function()
        {
                return this.innerNode.selected;
        },
        set: function(value)
        {
                this.innerNode.selected = !!value;
        }
});



/** The node type of the outer node.
 * @member {!module:domv.NodeType} outerNodeType
 * @memberOf module:domv/lib/Component
 * @instance
 */
Object.defineProperty(Component.prototype, 'outerNodeType', {
        get: function()
        {
                return this.outerNode.nodeType;
        }
});


/** The node type of the inner node.
 * @member {?module:domv.NodeType} innerNodeType
 * @memberOf module:domv/lib/Component
 * @instance
 */
Object.defineProperty(Component.prototype, 'innerNodeType', {
        get: function()
        {
                if (!this.innerNode) { return undefined; }
                return this.innerNode.nodeType;
        }
});

/** The node name of the outer node.
 * (element tag names always in lowercase)
 * @member {!string} outerNodeName
 * @memberOf module:domv/lib/Component
 * @instance
 */
Object.defineProperty(Component.prototype, 'outerNodeName', {
        get: function()
        {
                if (this.outerNode.nodeType === domv.NodeType.ELEMENT)
                {
                        return this.outerNode.nodeName.toLowerCase();
                }

                return this.outerNode.nodeName;
        }
});


/** The node name of the inner node.
 * @member {?string} innerNodeName
 * @memberOf module:domv/lib/Component
 * @instance
 */
Object.defineProperty(Component.prototype, 'innerNodeName', {
        get: function()
        {
                if (!this.innerNode) { return undefined; }

                if (this.innerNode.nodeType === domv.NodeType.ELEMENT)
                {
                        return this.innerNode.nodeName.toLowerCase();
                }

                return this.innerNode.nodeName;
        }
});

/**
 * Stringify the outerNode and all its children as html markup.
 * @return {?string}
 */
Component.prototype.stringifyAsHtml = function()
{
        return this.outerNode.outerHTML;
};

function utf8ByteSize(str)
{
        // Could have called Buffer.byteLength() instead, but this might pull in a lot of code we do not need
        // in browserify bundles.

        var bytes, charCode, i;

        bytes = 0;
        for (i = 0; i < str.length; ++i)
        {
                charCode = str.charCodeAt(i);

                if (0xD800 <= charCode && charCode <= 0xDBFF) // High surrogate
                {
                        charCode = ((charCode - 0xD800) * 0x400) + (str.charCodeAt(i+1) - 0xDC00) + 0x10000;
                        ++i; // skip the next one
                }

                if (charCode < 128) //2^7
                {
                        bytes += 1;
                }
                else if (charCode < 2048) // 2^11
                {
                        bytes += 2;
                }
                else if (charCode < 65536) // 2^16
                {
                        bytes += 3;
                }
                else
                {
                        bytes += 4;
                }
        }

        return bytes;
}

/**
 * Stringify the outerNode and all its children as html markup, and send it
 * as a http response in node.js with the proper Content-Type and Content-Length.
 * Other headers can be set by calling setHeader() on the response before calling
 * this method. The status code can be set by setting response.statusCode in the same
 * fashion (the default is 200).
 * This method uses this.stringifyAsHtml() to generate the markup (which can be
 * overridden).
 * @param {!external:ServerResponse} response
 */
Component.prototype.sendResponseAsHtml = function(response)
{
        var markup = this.stringifyAsHtml();

        if (!response.headersSent)
        {
                // (response.statusCode is 200 by default in nodejs)
                response.setHeader('Content-Length', utf8ByteSize(markup));
                response.setHeader('Content-Type', 'text/html; charset=UTF-8');

        }
        // implicit flush of headers so that callers of this method may add their own
        // headers and status before making the call.
        response.end(markup, 'utf8');
};


/** This method does nothing, it is used so that firebug and chrome displays Component objects as an array.
 * This method is not used by this library, feel free to override this method.
 */
/* istanbul ignore next : disabled when running as server */
Component.prototype.splice = function(){};

/** <p>Called by whenever an inner/outer node changes.
 * This enables pretty formatting of Component instances in the firebug and chrome console.</p>
 *
 * <p>Firebug will display instances as:</p>
 * <code>"Object["BaseDocument", html.BaseDocument, div.content]"</code>
 * <!-- "Object" is the value of [[Class]] -->
 *
 *
 * <p>Chrome will display instances as:</p>
 * <code>["BaseDocument", &lt;html class=​"BaseDocument"&gt;​...​&lt;/html&gt;​, &lt;div class=​"content"&gt;​…&lt;/div&gt;​...​&lt;/div&gt;​]</code>
 *
 * <p>This hack works by setting the attributes "length", "0", "1" and "2" ("splice" is set on the prototype also).
 *    Override this method to do nothing in your subclass to disable this hack.</p>
 */
Component.prototype.updateConsoleHack = function()
{
        if (!this.__outerNode__ && !this.__innerNode__)
        {
                this.length = 0;
        }
        else if (this.__outerNode__ === this.__innerNode__)
        {
                this.length = 2;
        }
        else
        {
                this.length = 3;
        }

        this[0] = this.constructor && this.constructor.name ? this.constructor.name : /* istanbul ignore next */ 'Component';
        this[1] = this.__outerNode__;
        this[2] = this.__innerNode__;
};

domv = require('./domv');