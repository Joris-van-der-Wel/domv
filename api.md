## Modules
<dl>
<dt><a href="#module_domv">domv</a></dt>
<dd></dd>
<dt><a href="#module_domv/lib/Component">domv/lib/Component</a></dt>
<dd><p>This is the super class for your components.</p>
<p>It contains a handful of methods that simplify using the DOM.</p></dd>
<dt><a href="#module_domv/lib/Exception">domv/lib/Exception</a></dt>
<dd><p>The base class for any exception that originates from this library</p>
</dd>
<dt><a href="#module_domv/lib/HtmlDocument">domv/lib/HtmlDocument</a></dt>
<dd><p>Represents a full document in html, including the root node html.</p>
</dd>
</dl>
<a name="module_domv"></a>
## domv
**Author:** Joris van der Wel <joris@jorisvanderwel.com>  

* [domv](#module_domv)
  * _static_
    * [.NodeType](#module_domv.NodeType) : <code>enum</code>
    * [.Component](#module_domv.Component) : <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.HtmlDocument](#module_domv.HtmlDocument) : <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>
    * [.Exception](#module_domv.Exception) : <code>[Exception](#exp_module_domv/lib/Exception--Exception)</code>
    * [.isSupported(document, [checkAll])](#module_domv.isSupported) ⇒ <code>boolean</code>
    * [.isParseHTMLDocumentSupported()](#module_domv.isParseHTMLDocumentSupported) ⇒ <code>boolean</code>
    * [.mayContainChildren(node, [doThrow])](#module_domv.mayContainChildren) ⇒ <code>boolean</code>
    * [.wrap(node_, [ComponentConstructor], ...constructorArguments)](#module_domv.wrap) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code> &#124; <code>[Array.&lt;Component&gt;](#exp_module_domv/lib/Component--Component)</code>
    * [.unlive(nodeList)](#module_domv.unlive) ⇒ <code>Array</code>
    * [.create(document_, nodeName, className, ...content)](#module_domv.create) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.shorthand(document_, [tagName_], ...initialAttributes)](#module_domv.shorthand) ⇒ <code>domv/lib/CreateShortHand</code>
    * [.text(document_, ...text)](#module_domv.text) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.createHtmlDomDocument([minimal])](#module_domv.createHtmlDomDocument) ⇒ <code>[Document](#external_Document)</code>
    * [.parseHTMLDocument(markup, ownerDocument)](#module_domv.parseHTMLDocument) ⇒ <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>
    * [.parseHTMLSnippit(ownerDocument, markup)](#module_domv.parseHTMLSnippit) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.cssStringEscape([str], [wrapInQuotes])](#module_domv.cssStringEscape) ⇒ <code>String</code>
    * [.isLeftMouseButton(event)](#module_domv.isLeftMouseButton) ⇒ <code>boolean</code>
  * _inner_
    * [~domv/lib/CreateShortHand](#module_domv..domv/lib/CreateShortHand) : <code>function</code>
    * [~Node](#external_Node)
    * [~Element](#external_Element)
    * [~Document](#external_Document)
      * [.createEvent()](#external_Document+createEvent)
    * [~CSSStyleDeclaration](#external_CSSStyleDeclaration)
    * [~Event](#external_Event)
    * [~ServerResponse](#external_ServerResponse)

<a name="module_domv.NodeType"></a>
### domv.NodeType : <code>enum</code>
All of the valid node types in DOM (excluding the ones that are deprecated).

**Kind**: static enum property of <code>[domv](#module_domv)</code>  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| ELEMENT | <code>number</code> | <code>1</code> | 
| TEXT | <code>number</code> | <code>3</code> | 
| PROCESSING_INSTRUCTION | <code>number</code> | <code>7</code> | 
| COMMENT | <code>number</code> | <code>8</code> | 
| DOCUMENT | <code>number</code> | <code>9</code> | 
| DOCUMENT_TYPE | <code>number</code> | <code>10</code> | 
| DOCUMENT_FRAGMENT | <code>number</code> | <code>11</code> | 

<a name="module_domv.Component"></a>
### domv.Component : <code>[Component](#exp_module_domv/lib/Component--Component)</code>
**Kind**: static constant of <code>[domv](#module_domv)</code>  
<a name="module_domv.HtmlDocument"></a>
### domv.HtmlDocument : <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>
**Kind**: static constant of <code>[domv](#module_domv)</code>  
<a name="module_domv.Exception"></a>
### domv.Exception : <code>[Exception](#exp_module_domv/lib/Exception--Exception)</code>
**Kind**: static constant of <code>[domv](#module_domv)</code>  
<a name="module_domv.isSupported"></a>
### domv.isSupported(document, [checkAll]) ⇒ <code>boolean</code>
Test if the current environment / browser / DOM library supports everything that is needed for the domv library.

**Kind**: static method of <code>[domv](#module_domv)</code>  
**Throws**:

- <code>[domv/lib/Exception](#module_domv/lib/Exception)</code> For invalid arguments


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| document | <code>[Document](#external_Document)</code> |  |  |
| [checkAll] | <code>boolean</code> | <code>false</code> | If true, also check [isParseHTMLDocumentSupported()](#module_domv.isParseHTMLDocumentSupported) |

<a name="module_domv.isParseHTMLDocumentSupported"></a>
### domv.isParseHTMLDocumentSupported() ⇒ <code>boolean</code>
Test if the current environment / browser / DOM library supports parsing the markup of an
entire html document (including doctype, html, head, tags etc).

**Kind**: static method of <code>[domv](#module_domv)</code>  
**See**: [parseHTMLDocument()](#module_domv.parseHTMLDocument)  
<a name="module_domv.mayContainChildren"></a>
### domv.mayContainChildren(node, [doThrow]) ⇒ <code>boolean</code>
Is the given node or component able to have children?.

**Kind**: static method of <code>[domv](#module_domv)</code>  
**Throws**:

- <code>[domv/lib/Exception](#module_domv/lib/Exception)</code> If doThrow=true


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| node | <code>[domv/lib/Component](#module_domv/lib/Component)</code> &#124; <code>[Node](#external_Node)</code> |  |  |
| [doThrow] | <code>boolean</code> | <code>false</code> | If true, throw instead of returning false upon failure. |

<a name="module_domv.wrap"></a>
### domv.wrap(node_, [ComponentConstructor], ...constructorArguments) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code> &#124; <code>[Array.&lt;Component&gt;](#exp_module_domv/lib/Component--Component)</code>
Wraps a plain DOM Node so that you can use the same API as you would on a Component.
If you pass a NodeList, an array (that is not live) with Component's will be returned.
Passing a falsy value will also return a falsy value instead of a Component

**Kind**: static method of <code>[domv](#module_domv)</code>  
**Returns**: <code>[Component](#exp_module_domv/lib/Component--Component)</code> &#124; <code>[Array.&lt;Component&gt;](#exp_module_domv/lib/Component--Component)</code> - Only null if "node" was also null  
**Throws**:

- <code>[domv/lib/Exception](#module_domv/lib/Exception)</code> If an unsupported argument is passed, or if more than 10
        constructor arguments have been passed


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| node_ | <code>[Node](#external_Node)</code> &#124; <code>[Array.&lt;Node&gt;](#external_Node)</code> |  |  |
| [ComponentConstructor] | <code>function</code> | <code>module:domv/lib/Component</code> | The constructor to         use to wrap the given Node, by default the Node is wrapped in a plain Component,         but it is also possible to specify your own constructor. The first argument is always         the node being wrapped. |
| ...constructorArguments | <code>\*</code> |  | Further arguments to be passed to the constructor |

**Example**  
```js
domv.wrap(document.body).prependChild(...);
```
**Example**  
```js
domv.wrap(someNode, MyPictureGallery).addPicture(...);
```
<a name="module_domv.unlive"></a>
### domv.unlive(nodeList) ⇒ <code>Array</code>
Returns an array copy of a NodeList so that it is no longer live.
This makes it easier to properly modify the DOM while traversing a node list.
The actual content of the array is identical (the nodes are <strong>not</strong> wrapped)

**Kind**: static method of <code>[domv](#module_domv)</code>  

| Param | Type | Description |
| --- | --- | --- |
| nodeList | <code>\*</code> | Any array like object. |

**Example**  
```js
var list = require('domv').unlive(document.getElementsByTagName('*'));
```
<a name="module_domv.create"></a>
### domv.create(document_, nodeName, className, ...content) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
Convenient function to create a wrapped Node including its attributes (for elements).

**Kind**: static method of <code>[domv](#module_domv)</code>  
**Throws**:

- <code>[domv/lib/Exception](#module_domv/lib/Exception)</code> For invalid arguments


| Param | Type | Description |
| --- | --- | --- |
| document_ | <code>[Document](#external_Document)</code> |  |
| nodeName | <code>string</code> |  |
| className | <code>string</code> &#124; <code>[Node](#external_Node)</code> &#124; <code>[domv/lib/Component](#module_domv/lib/Component)</code> &#124; <code>Object.&lt;string, string&gt;</code> | <p>If a string is passed, and the nodeName represents an element tag, the string is set as the class attribute.         If not an element, the string is appended to the node data.</p>      <p>Otherwise the argument is parsed using [parseShorthandArgument](#module_domv/lib/Component--Component+parseShorthandArgument)</p> |
| ...content | <code>string</code> &#124; <code>[Node](#external_Node)</code> &#124; <code>[domv/lib/Component](#module_domv/lib/Component)</code> &#124; <code>Object.&lt;string, string&gt;</code> | Parsed using [parseShorthandArgument](#module_domv/lib/Component--Component+parseShorthandArgument) |

**Example**  
```js
var wrappedDiv = require('domv').create(document, 'div', 'myDiv', 'This is my div!', {'data-test': 'foo'});
console.log(wrappedDiv.outerNode.outerHTML);
// <div class="myDiv" data-test="foo">This is my div!</div>
```
<a name="module_domv.shorthand"></a>
### domv.shorthand(document_, [tagName_], ...initialAttributes) ⇒ <code>domv/lib/CreateShortHand</code>
Generate a short hand function wich lets you quickly create
a wrapped Element including its attributes.

**Kind**: static method of <code>[domv](#module_domv)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| document_ | <code>[Document](#external_Document)</code> |  |  |
| [tagName_] | <code>string</code> | <code>&quot;&#x27;div&#x27;&quot;</code> |  |
| ...initialAttributes | <code>string</code> &#124; <code>Object.&lt;string, string&gt;</code> |  | <p>If a string is passed, a text node is appended.</p>        <p>If a node or component is passed, it is simply appended.</p>        <p>If an object of key value pairs is passed, it sets those as attributes.           (see [attr](#module_domv/lib/Component--Component+attr))</p> |

**Example**  
```js
var a = require('domv').shorthand(document, 'a');
var link = a('readmore', {'href': something()}, 'Click here to readmore!');
// <a class="readmore" href="#example">Click here to readmore!</a>
```
<a name="module_domv.text"></a>
### domv.text(document_, ...text) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
Creates a new wrapped TextNode.

**Kind**: static method of <code>[domv](#module_domv)</code>  

| Param | Type | Description |
| --- | --- | --- |
| document_ | <code>[Document](#external_Document)</code> |  |
| ...text | <code>string</code> | Extra arguments will be joined using a space |

**Example**  
```js
var wrappedDiv = require('domv').create(document, 'div');
var wrappedText = require('domv').text(document, 'Hi!');
wrappedDiv.appendChild(wrappedText);
console.log(wrappedDiv.outerNode.outerHTML);
// <div>Hi!</div>
```
<a name="module_domv.createHtmlDomDocument"></a>
### domv.createHtmlDomDocument([minimal]) ⇒ <code>[Document](#external_Document)</code>
Create a new Document Node, including html, head, title and body tags.

**Kind**: static method of <code>[domv](#module_domv)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [minimal] | <code>Boolean</code> | <code>false</code> | If true, only a doctype and a <html/> element is created. |

<a name="module_domv.parseHTMLDocument"></a>
### domv.parseHTMLDocument(markup, ownerDocument) ⇒ <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>
Parse the given html markup text as a complete html docuemnt and return the outer "html" node.
Optionally an ownerDocument may be given which will specify what Document the new nodes belong to.

**Kind**: static method of <code>[domv](#module_domv)</code>  
**Throws**:

- <code>[domv/lib/Exception](#module_domv/lib/Exception)</code> If a dom html parser implementation is not available


| Param | Type |
| --- | --- |
| markup | <code>string</code> | 
| ownerDocument | <code>[Document](#external_Document)</code> | 

<a name="module_domv.parseHTMLSnippit"></a>
### domv.parseHTMLSnippit(ownerDocument, markup) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
Parse the given html markup text and return a (wrapped) DocumentFragment containing
the nodes the markup represents. The given markup must not be a full html document, otherwise
the html, head and body nodes will not be present, only their content.
An ownerDocument must be given which will specify what Document the new nodes belong to.

**Kind**: static method of <code>[domv](#module_domv)</code>  
**Throws**:

- <code>[domv/lib/Exception](#module_domv/lib/Exception)</code> If a dom html parser implementation is not available


| Param | Type |
| --- | --- |
| ownerDocument | <code>[Document](#external_Document)</code> | 
| markup | <code>string</code> | 

<a name="module_domv.cssStringEscape"></a>
### domv.cssStringEscape([str], [wrapInQuotes]) ⇒ <code>String</code>
Escape a string so that you can use it as a CSS String, such as a selector.

**Kind**: static method of <code>[domv](#module_domv)</code>  
**See**: [http://www.w3.org/TR/CSS21/syndata.html#strings](http://www.w3.org/TR/CSS21/syndata.html#strings)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [str] | <code>String</code> | <code>&#x27;undefined&#x27;</code> |  |
| [wrapInQuotes] | <code>boolean</code> | <code>true</code> | If true, surround the result with quotes: "something" |

**Example**  
```js
myComponent.selectorAll('a[href=' + domv.cssStringEscape(somevar) + ']');
```
<a name="module_domv.isLeftMouseButton"></a>
### domv.isLeftMouseButton(event) ⇒ <code>boolean</code>
Given that 'event' is a mouse event, is the left mouse button being held down?.

**Kind**: static method of <code>[domv](#module_domv)</code>  
**Returns**: <code>boolean</code> - True if the left mouse button is down  
**Throws**:

- <code>[domv/lib/Exception](#module_domv/lib/Exception)</code> For invalid arguments


| Param | Type |
| --- | --- |
| event | <code>[Event](#external_Event)</code> | 

<a name="module_domv..domv/lib/CreateShortHand"></a>
### domv~domv/lib/CreateShortHand : <code>function</code>
**Kind**: inner typedef of <code>[domv](#module_domv)</code>  

| Param | Type | Description |
| --- | --- | --- |
| className | <code>string</code> |  |
| [...content] | <code>string</code> &#124; <code>[Node](#external_Node)</code> &#124; <code>[domv/lib/Component](#module_domv/lib/Component)</code> &#124; <code>Object.&lt;string, string&gt;</code> | <p>If a string is passed, a text node is appended.</p>        <p>If a node or component is passed, it is simply appended.</p>        <p>If an object of key value pairs is passed, it sets those as attributes.           (see [attr](#module_domv/lib/Component--Component+attr))</p> |

<a name="external_Node"></a>
### domv~Node
<p>The Node interface is the primary datatype for the entire Document Object Model.
It represents a single node in the document tree. While all objects implementing
the Node interface expose methods for dealing with children, not all objects implementing
the Node interface may have children. For example, Text nodes may not have children,
and adding children to such nodes results in a DOMException being raised.</p>
<p>The attributes nodeName, nodeValue and attributes are included as a mechanism
to get at node information without casting down to the specific derived interface.
In cases where there is no obvious mapping of these attributes for a specific nodeType
(e.g., nodeValue for an Element or attributes for a Comment), this returns null.
Note that the specialized interfaces may contain additional and more convenient
mechanisms to get and set the relevant information.</p>

**Kind**: inner external of <code>[domv](#module_domv)</code>  
**See**

- [https://developer.mozilla.org/en-US/docs/Web/API/Node](https://developer.mozilla.org/en-US/docs/Web/API/Node)
- [http://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-1950641247](http://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-1950641247)

<a name="external_Element"></a>
### domv~Element
The Element interface represents an element in an HTML or XML document. Elements may
have attributes associated with them; since the Element interface inherits from Node,
the generic Node interface attribute attributes may be used to retrieve the set of all
attributes for an element. There are methods on the Element interface to retrieve either
an Attr object by name or an attribute value by name. In XML, where an attribute value
may contain entity references, an Attr object should be retrieved to examine the possibly
fairly complex sub-tree representing the attribute value. On the other hand, in HTML,
where all attributes have simple string values, methods to directly access an attribute
value can safely be used as a convenience.

**Kind**: inner external of <code>[domv](#module_domv)</code>  
**See**

- [https://developer.mozilla.org/en-US/docs/Web/API/Element](https://developer.mozilla.org/en-US/docs/Web/API/Element)
- [http://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-745549614](http://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-745549614)

<a name="external_Document"></a>
### domv~Document
<p>The Document interface represents the entire HTML or XML document. Conceptually, it
is the root of the document tree, and provides the primary access to the document's
data.</p>
<p>Since elements, text nodes, comments, processing instructions, etc. cannot exist
outside the context of a Document, the Document interface also contains the factory
methods needed to create these objects. The Node objects created have a ownerDocument
attribute which associates them with the Document within whose context they were
created.</p>

**Kind**: inner external of <code>[domv](#module_domv)</code>  
**See**

- [https://developer.mozilla.org/en-US/docs/Web/API/document](https://developer.mozilla.org/en-US/docs/Web/API/document)
- [http://www.w3.org/TR/DOM-Level-3-Core/core.html#i-Document](http://www.w3.org/TR/DOM-Level-3-Core/core.html#i-Document)

<a name="external_Document+createEvent"></a>
#### document.createEvent()
Creates an event object of the type specified. Returns the newly created object.

**Kind**: instance method of <code>[Document](#external_Document)</code>  
**See**

- [https://developer.mozilla.org/en-US/docs/Web/API/document.createEvent](https://developer.mozilla.org/en-US/docs/Web/API/document.createEvent)
- [http://www.w3.org/TR/DOM-Level-3-Events/#widl-DocumentEvent-createEvent](http://www.w3.org/TR/DOM-Level-3-Events/#widl-DocumentEvent-createEvent)

<a name="external_CSSStyleDeclaration"></a>
### domv~CSSStyleDeclaration
<p>The CSSStyleDeclaration interface represents a CSS declaration block, including
its underlying state, where this underlying state depends upon the source of the
CSSStyleDeclaration instance.</p>

**Kind**: inner external of <code>[domv](#module_domv)</code>  
**See**

- [https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration)
- [http://dev.w3.org/csswg/cssom/#the-cssstyledeclaration-interface](http://dev.w3.org/csswg/cssom/#the-cssstyledeclaration-interface)

<a name="external_Event"></a>
### domv~Event
The Event interface is used to provide contextual information about an event to the handler processing the event.
An object which implements the Event interface is generally passed as the first parameter to an event handler.
More specific context information is passed to event handlers by deriving additional interfaces from Event which
contain information directly relating to the type of event they accompany. These derived interfaces are also implemented
by the object passed to the event listener.

**Kind**: inner external of <code>[domv](#module_domv)</code>  
**See**

- [https://developer.mozilla.org/en-US/docs/Web/API/Event](https://developer.mozilla.org/en-US/docs/Web/API/Event)
- [http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-Event](http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-Event)

<a name="external_ServerResponse"></a>
### domv~ServerResponse
This object is created internally by a HTTP server (node.js), not by the user. It is passed as the second parameter to the 'request' event.
The response implements the Writable Stream interface

**Kind**: inner external of <code>[domv](#module_domv)</code>  
**See**: [http://nodejs.org/api/http.html#http_class_http_serverresponse](http://nodejs.org/api/http.html#http_class_http_serverresponse)  
<a name="module_domv/lib/Component"></a>
## domv/lib/Component
This is the super class for your components.
<p>It contains a handful of methods that simplify using the DOM.</p>

**Author:** Joris van der Wel <joris@jorisvanderwel.com>  

* [domv/lib/Component](#module_domv/lib/Component)
  * [Component](#exp_module_domv/lib/Component--Component) ⏏
    * [new Component(node, [defaultNodeName], [wrapDocument])](#new_module_domv/lib/Component--Component_new)
    * [.document](#module_domv/lib/Component--Component+document) : <code>[Document](#external_Document)</code>
    * [.outerNode](#module_domv/lib/Component--Component+outerNode) : <code>[Node](#external_Node)</code>
    * [.outerNodeWrapped](#module_domv/lib/Component--Component+outerNodeWrapped) : <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.innerNode](#module_domv/lib/Component--Component+innerNode) : <code>[Node](#external_Node)</code>
    * [.innerNodeWrapped](#module_domv/lib/Component--Component+innerNodeWrapped) : <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.style](#module_domv/lib/Component--Component+style) : <code>[CSSStyleDeclaration](#external_CSSStyleDeclaration)</code>
    * [.children](#module_domv/lib/Component--Component+children) : <code>[Array.&lt;Component&gt;](#exp_module_domv/lib/Component--Component)</code>
    * [.childElementCount](#module_domv/lib/Component--Component+childElementCount) : <code>Number</code>
    * [.childrenIndex](#module_domv/lib/Component--Component+childrenIndex) : <code>int</code>
    * [.childNodes](#module_domv/lib/Component--Component+childNodes) : <code>[Array.&lt;Component&gt;](#exp_module_domv/lib/Component--Component)</code>
    * [.childNodeCount](#module_domv/lib/Component--Component+childNodeCount) : <code>Number</code>
    * [.childNodesIndex](#module_domv/lib/Component--Component+childNodesIndex) : <code>int</code>
    * [.isEmpty](#module_domv/lib/Component--Component+isEmpty) : <code>boolean</code>
    * [.firstChild](#module_domv/lib/Component--Component+firstChild) : <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.lastChild](#module_domv/lib/Component--Component+lastChild) : <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.firstElementChild](#module_domv/lib/Component--Component+firstElementChild) : <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.lastElementChild](#module_domv/lib/Component--Component+lastElementChild) : <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.nextSibling](#module_domv/lib/Component--Component+nextSibling) : <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.previousSibling](#module_domv/lib/Component--Component+previousSibling) : <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.nextElementSibling](#module_domv/lib/Component--Component+nextElementSibling) : <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.previousElementSibling](#module_domv/lib/Component--Component+previousElementSibling) : <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.parentNode](#module_domv/lib/Component--Component+parentNode) : <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.textContent](#module_domv/lib/Component--Component+textContent) : <code>string</code>
    * [.value](#module_domv/lib/Component--Component+value) : <code>string</code>
    * [.value](#module_domv/lib/Component--Component+value) : <code>string</code>
    * [.checked](#module_domv/lib/Component--Component+checked) : <code>boolean</code>
    * [.selected](#module_domv/lib/Component--Component+selected) : <code>boolean</code>
    * [.focus](#module_domv/lib/Component--Component+focus) : <code>boolean</code>
    * [.hasFocus](#module_domv/lib/Component--Component+hasFocus) : <code>boolean</code>
    * [.outerNodeType](#module_domv/lib/Component--Component+outerNodeType) : <code>[NodeType](#module_domv.NodeType)</code>
    * [.innerNodeType](#module_domv/lib/Component--Component+innerNodeType) : <code>[NodeType](#module_domv.NodeType)</code>
    * [.outerNodeName](#module_domv/lib/Component--Component+outerNodeName) : <code>string</code>
    * [.innerNodeName](#module_domv/lib/Component--Component+innerNodeName) : <code>string</code>
    * [.isDOMVComponent](#module_domv/lib/Component--Component+isDOMVComponent) : <code>boolean</code>
    * [.isCreationConstructor(node, [wrapDocument])](#module_domv/lib/Component--Component+isCreationConstructor) ⇒ <code>boolean</code>
    * [.parseShorthandArgument(arg)](#module_domv/lib/Component--Component+parseShorthandArgument) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.type(type)](#module_domv/lib/Component--Component+type) ⇒ <code>Component</code>
    * [.on(event, listener, [useCapture], [thisObject])](#module_domv/lib/Component--Component+on) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.addListener(event, listener, [useCapture], [thisObject])](#module_domv/lib/Component--Component+addListener) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.removeListener(event, listener, [useCapture], [thisObject])](#module_domv/lib/Component--Component+removeListener) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.clearListeners()](#module_domv/lib/Component--Component+clearListeners)
    * [.emit(name, [data])](#module_domv/lib/Component--Component+emit) ⇒ <code>boolean</code>
    * [.isOuterNodeEqual(node)](#module_domv/lib/Component--Component+isOuterNodeEqual) ⇒ <code>boolean</code>
    * [.isInnerNodeEqual(node)](#module_domv/lib/Component--Component+isInnerNodeEqual) ⇒ <code>boolean</code>
    * [.isNodeEqual(node)](#module_domv/lib/Component--Component+isNodeEqual) ⇒ <code>boolean</code>
    * [.create(nodeName, className, [...content])](#module_domv/lib/Component--Component+create) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.text(...text_)](#module_domv/lib/Component--Component+text) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.shorthand([tagName], ...initialAttributes)](#module_domv/lib/Component--Component+shorthand) ⇒ <code>domv/lib/CreateShortHand</code>
    * [.textShorthand()](#module_domv/lib/Component--Component+textShorthand) ⇒ <code>function</code>
    * [.appendChild(...node_)](#module_domv/lib/Component--Component+appendChild) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.prependChild(...node_)](#module_domv/lib/Component--Component+prependChild) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.siblingBefore(...node_)](#module_domv/lib/Component--Component+siblingBefore) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.siblingAfter(...node_)](#module_domv/lib/Component--Component+siblingAfter) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.removeNode()](#module_domv/lib/Component--Component+removeNode) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.removeChildren()](#module_domv/lib/Component--Component+removeChildren) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.addClass(...cls)](#module_domv/lib/Component--Component+addClass) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.removeClass(...cls)](#module_domv/lib/Component--Component+removeClass) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.hasClass(...cls)](#module_domv/lib/Component--Component+hasClass) ⇒ <code>boolean</code>
    * [.assertHasClass(...cls)](#module_domv/lib/Component--Component+assertHasClass)
    * [.toggleClass(cls, force)](#module_domv/lib/Component--Component+toggleClass) ⇒ <code>boolean</code>
    * [.attr(name, value)](#module_domv/lib/Component--Component+attr) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.getAttr(name)](#module_domv/lib/Component--Component+getAttr) ⇒ <code>string</code>
    * [.selector(selector, [ComponentConstructor])](#module_domv/lib/Component--Component+selector) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.assertSelector(selector, [ComponentConstructor])](#module_domv/lib/Component--Component+assertSelector) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.selectorAll(selector, [ComponentConstructor])](#module_domv/lib/Component--Component+selectorAll) ⇒ <code>[Array.&lt;Component&gt;](#exp_module_domv/lib/Component--Component)</code>
    * [.adoptAllAttributes(from)](#module_domv/lib/Component--Component+adoptAllAttributes)
    * [.swapNode(node)](#module_domv/lib/Component--Component+swapNode)
    * [.isAllWhiteSpace([checkChildElements])](#module_domv/lib/Component--Component+isAllWhiteSpace) ⇒ <code>boolean</code>
    * [.stringifyAsHtml()](#module_domv/lib/Component--Component+stringifyAsHtml) ⇒ <code>string</code>
    * [.sendResponseAsHtml(response)](#module_domv/lib/Component--Component+sendResponseAsHtml)
    * [.splice()](#module_domv/lib/Component--Component+splice)
    * [.updateConsoleHack()](#module_domv/lib/Component--Component+updateConsoleHack)

<a name="exp_module_domv/lib/Component--Component"></a>
### Component ⏏
**Kind**: Exported class  
<a name="new_module_domv/lib/Component--Component_new"></a>
#### new Component(node, [defaultNodeName], [wrapDocument])
Each Component has two constructors, one is used to wrap existing DOM nodes, the other is used to create new
elements. Both constructors should result in the same DOM structure.

Which constructor is used depends on the type of the node argument,
[isCreationConstructor](#module_domv/lib/Component--Component+isCreationConstructor) is used to test for this. A DOCUMENT_NODE will result in the
creation constructor, any other node will result in the wrapping constructor.

Any subclass should accept a Node as their first argument in their constructors. This library does not care about
any other argument in your constructors.

**Throws**:

- <code>[domv/lib/Exception](#module_domv/lib/Exception)</code> If an invalid or unsupported node is passed.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| node | <code>[Node](#external_Node)</code> &#124; <code>[domv/lib/Component](#module_domv/lib/Component)</code> |  | Any kind of node or a component with an outerNode,this        parameter determines which constructor is used using [isCreationConstructor](#module_domv/lib/Component--Component+isCreationConstructor). |
| [defaultNodeName] | <code>string</code> | <code>&quot;&#x27;div&#x27;&quot;</code> | If the creation constructor is used, this will be the tag that gets used to create        the default element. This is a convenience for subclasses. |
| [wrapDocument] | <code>boolean</code> | <code>false</code> | <p>Used by [wrap](#module_domv.wrap)</p> <p>If false, passing a DOCUMENT_NODE as "node" will result in an empty tag being created instead of wrapping the DOCUMENT_NODE. This behaviour is more convenient when subclassing Component because it lets you treat subclasses and subsubclasses in the same way. <em>(e.g. the subclass Menu adds the class 'Menu' and common menu items. The subsubclass EventMenu adds the class 'EventMenu' and further event menu items.)</em> </p> <p>If true, a document will always wrap.</p> |

**Example**  
```js
new Component(document.createElement('p')); // wraps a "p" element
```
**Example**  
```js
new Component(document); // Creates an empty "div" element as a default
```
**Example**  
```js
new Component(document, true); // Wraps the Document Node instead of creating an empty "div"
```
<a name="module_domv/lib/Component--Component+document"></a>
#### component.document : <code>[Document](#external_Document)</code>
The Document Node that the nodes of this Component are associated with.

**Kind**: instance property of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
**Throws**:

- <code>[domv/lib/Exception](#module_domv/lib/Exception)</code> If an invalid value is set

<a name="module_domv/lib/Component--Component+outerNode"></a>
#### component.outerNode : <code>[Node](#external_Node)</code>
The "outer" DOM Node for this component.
<p>This node is used to apply attributes or when adding this
   component as the child of another.</p>
<p>This property is usually set by the Component constructor</p>

**Kind**: instance property of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
**Throws**:

- <code>[domv/lib/Exception](#module_domv/lib/Exception)</code> If an invalid value is set

<a name="module_domv/lib/Component--Component+outerNodeWrapped"></a>
#### component.outerNodeWrapped : <code>[Component](#exp_module_domv/lib/Component--Component)</code>
The outer DOM node wrapped as a new component.

**Kind**: instance property of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
<a name="module_domv/lib/Component--Component+innerNode"></a>
#### component.innerNode : <code>[Node](#external_Node)</code>
The "inner" DOM Node for this component.
<p>This is used when adding nodes or other components as the child of
   this Component. E.g. when using methods such as appendChild() and prependChild()
   or properties such as childNodes or firstChild</p>
<p>This property is usually set by the Component constructor,
   or by your subclass constructor</p>
<p>If this property is set to null, children are not allowed
   for this component. Note that innerNode may also reference
   nodes that do not allow children because of their type
   (such as a TextNode)</p>

**Kind**: instance property of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
**Throws**:

- <code>[domv/lib/Exception](#module_domv/lib/Exception)</code> If an invalid value is set

<a name="module_domv/lib/Component--Component+innerNodeWrapped"></a>
#### component.innerNodeWrapped : <code>[Component](#exp_module_domv/lib/Component--Component)</code>
The inner DOM node wrapped as a new component.

**Kind**: instance property of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
<a name="module_domv/lib/Component--Component+style"></a>
#### component.style : <code>[CSSStyleDeclaration](#external_CSSStyleDeclaration)</code>
The inline style for the outer node.

**Kind**: instance property of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
<a name="module_domv/lib/Component--Component+children"></a>
#### component.children : <code>[Array.&lt;Component&gt;](#exp_module_domv/lib/Component--Component)</code>
The (wrapped) child elements of the inner node.
The returned list is not live.

**Kind**: instance property of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
<a name="module_domv/lib/Component--Component+childElementCount"></a>
#### component.childElementCount : <code>Number</code>
The number of immediate child elements that belong to the inner node.

**Kind**: instance property of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
<a name="module_domv/lib/Component--Component+childrenIndex"></a>
#### component.childrenIndex : <code>int</code>
The index of the outerNode in the "children" attribute of the parentNode.

**Kind**: instance property of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
**Example**  
```js
myParent.children[3].childrenIndex === 3
```
<a name="module_domv/lib/Component--Component+childNodes"></a>
#### component.childNodes : <code>[Array.&lt;Component&gt;](#exp_module_domv/lib/Component--Component)</code>
The (wrapped) child nodes of the inner node.
The returned list is not live.

**Kind**: instance property of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
<a name="module_domv/lib/Component--Component+childNodeCount"></a>
#### component.childNodeCount : <code>Number</code>
The number of immediate child nodes that belong to the inner node.

**Kind**: instance property of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
<a name="module_domv/lib/Component--Component+childNodesIndex"></a>
#### component.childNodesIndex : <code>int</code>
The index of the outerNode in the "childNodes" attribute of the parentNode.

**Kind**: instance property of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
**Example**  
```js
myParent.childNodes[3].childNodesIndex === 3
```
<a name="module_domv/lib/Component--Component+isEmpty"></a>
#### component.isEmpty : <code>boolean</code>
Is the inner node empty?
For Element nodes this means that there are 0 child nodes.
For CharacterData nodes, the text content must be of 0 length.
Other nodes are never considered empty

**Kind**: instance property of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
<a name="module_domv/lib/Component--Component+firstChild"></a>
#### component.firstChild : <code>[Component](#exp_module_domv/lib/Component--Component)</code>
The first (wrapped) child node of the inner node.

**Kind**: instance property of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
<a name="module_domv/lib/Component--Component+lastChild"></a>
#### component.lastChild : <code>[Component](#exp_module_domv/lib/Component--Component)</code>
The first (wrapped) child node of the inner node.

**Kind**: instance property of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
<a name="module_domv/lib/Component--Component+firstElementChild"></a>
#### component.firstElementChild : <code>[Component](#exp_module_domv/lib/Component--Component)</code>
The first (wrapped) child node of the inner node that is an element.

**Kind**: instance property of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
<a name="module_domv/lib/Component--Component+lastElementChild"></a>
#### component.lastElementChild : <code>[Component](#exp_module_domv/lib/Component--Component)</code>
The last (wrapped) child node of the inner node that is an element.

**Kind**: instance property of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
<a name="module_domv/lib/Component--Component+nextSibling"></a>
#### component.nextSibling : <code>[Component](#exp_module_domv/lib/Component--Component)</code>
The next (wrapped) sibling of the outer node.

**Kind**: instance property of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
<a name="module_domv/lib/Component--Component+previousSibling"></a>
#### component.previousSibling : <code>[Component](#exp_module_domv/lib/Component--Component)</code>
The previous (wrapped) sibling of the outer node.

**Kind**: instance property of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
<a name="module_domv/lib/Component--Component+nextElementSibling"></a>
#### component.nextElementSibling : <code>[Component](#exp_module_domv/lib/Component--Component)</code>
The next (wrapped) sibling of the outer node that is an element.

**Kind**: instance property of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
<a name="module_domv/lib/Component--Component+previousElementSibling"></a>
#### component.previousElementSibling : <code>[Component](#exp_module_domv/lib/Component--Component)</code>
The previous (wrapped) sibling of the outer node that is an element.

**Kind**: instance property of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
<a name="module_domv/lib/Component--Component+parentNode"></a>
#### component.parentNode : <code>[Component](#exp_module_domv/lib/Component--Component)</code>
The (wrapped) parent node of the outer node.

**Kind**: instance property of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
<a name="module_domv/lib/Component--Component+textContent"></a>
#### component.textContent : <code>string</code>
The textual content of an element and all its descendants.
Or for Text, Comment, etc nodes it represents the nodeValue.
Setting this property on an element removes all of its children
and replaces them with a single text node with the given value.

**Kind**: instance property of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
<a name="module_domv/lib/Component--Component+value"></a>
#### component.value : <code>string</code>
The value of this node. For most nodes this property is undefined, for input fields this
contains the current value. (The attribute "value" does not change by user input).

**Kind**: instance property of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
<a name="module_domv/lib/Component--Component+value"></a>
#### component.value : <code>string</code>
The default value of this node. For most nodes this property is undefined, for input fields this
contains the default value. (This is identical to the "value" attribute).

**Kind**: instance property of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
<a name="module_domv/lib/Component--Component+checked"></a>
#### component.checked : <code>boolean</code>
The checked state of this node. For most nodes this property is undefined, for input elements this
contains the checked state. (The attribute "checked" does not change by user input).

**Kind**: instance property of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
<a name="module_domv/lib/Component--Component+selected"></a>
#### component.selected : <code>boolean</code>
The selected state of this node. For most nodes this property is undefined, for option elements this
contains the current selected state. (The attribute "selected" does not change by user input).

**Kind**: instance property of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
<a name="module_domv/lib/Component--Component+focus"></a>
#### component.focus : <code>boolean</code>
Set or get the focus state of the inner node.
Only one Element can have focus, setting the focus to this element might unset it on an other element.

**Kind**: instance property of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
**Throws**:

- <code>[domv/lib/Exception](#module_domv/lib/Exception)</code> When setting this property if the inner node is not an Element node.

<a name="module_domv/lib/Component--Component+hasFocus"></a>
#### component.hasFocus : <code>boolean</code>
Returns true if this node or any of its descendants has the focus state.

**Kind**: instance property of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
<a name="module_domv/lib/Component--Component+outerNodeType"></a>
#### component.outerNodeType : <code>[NodeType](#module_domv.NodeType)</code>
The node type of the outer node.

**Kind**: instance property of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
<a name="module_domv/lib/Component--Component+innerNodeType"></a>
#### component.innerNodeType : <code>[NodeType](#module_domv.NodeType)</code>
The node type of the inner node.

**Kind**: instance property of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
<a name="module_domv/lib/Component--Component+outerNodeName"></a>
#### component.outerNodeName : <code>string</code>
The node name of the outer node.
(element tag names always in lowercase)

**Kind**: instance property of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
<a name="module_domv/lib/Component--Component+innerNodeName"></a>
#### component.innerNodeName : <code>string</code>
The node name of the inner node.

**Kind**: instance property of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
<a name="module_domv/lib/Component--Component+isDOMVComponent"></a>
#### component.isDOMVComponent : <code>boolean</code>
Always true for instances of this class.
<p>Use this attribute to determine if an object is a Component.
This would let you create an object compatible with this API,
without having to use Component as a super type.</p>

**Kind**: instance constant of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
<a name="module_domv/lib/Component--Component+isCreationConstructor"></a>
#### component.isCreationConstructor(node, [wrapDocument]) ⇒ <code>boolean</code>
**Kind**: instance method of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
**Returns**: <code>boolean</code> - If the creation constructor should be used instead of the wrapping constructor.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| node | <code>[Node](#external_Node)</code> &#124; <code>[domv/lib/Component](#module_domv/lib/Component)</code> |  | A DOCUMENT_NODE will result in the creation constructor, any other node will result in the wrapping constructor. A falsy value will also result in the creation constructor and it used in Component subclasses that know how to create their own DOCUMENT_NODE (e.g. [domv/lib/HtmlDocument](#module_domv/lib/HtmlDocument). |
| [wrapDocument] | <code>boolean</code> | <code>false</code> | <p>If false, passing a DOCUMENT_NODE as "node" will result in an empty tag being created instead of wrapping the DOCUMENT_NODE. This behaviour is more convenient when subclassing Component because it lets you treat subclasses and subsubclasses in the same way. <em>(e.g. the subclass Menu adds the class 'Menu' and common menu items. The subsubclass EventMenu adds the class 'EventMenu' and further event menu items.)</em></p> <p>If true, a document will always wrap.</p> |

<a name="module_domv/lib/Component--Component+parseShorthandArgument"></a>
#### component.parseShorthandArgument(arg) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
This method is used by domv.create() and Component.prototype.shorthand() to assign attributes
and children to nodes with a shorthand syntax.
<p>If arg is undefined or null, no action is taken.</p>
<p>If arg is a string, the string is appened as a text node.</p>
<p>If arg is an object, all key value pairs are set as attributes.</p>
<p>Any DOM Node or domv Component is appended as a child.</p>
<p>If arg is an array, parseShorthandArgument is called for each item.</p>

**Kind**: instance method of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
**Returns**: <code>[Component](#exp_module_domv/lib/Component--Component)</code> - this  

| Param | Type |
| --- | --- |
| arg | <code>string</code> &#124; <code>[Node](#external_Node)</code> &#124; <code>[domv/lib/Component](#module_domv/lib/Component)</code> &#124; <code>Object.&lt;string, string&gt;</code> | 

<a name="module_domv/lib/Component--Component+type"></a>
#### component.type(type) ⇒ <code>Component</code>
Used in Component constructors to mark this object to be an instance of the given type.
The "type argument" is used to add a html class and to overwrite the "data-type" attribute.

Effectively, this means that you can use .hasClass('Foo') to check if the Component is a direct
instance or an instance of a super class of a Foo component. And that
`.getAttr('data-type') === 'Bar'` can be used to check if the Component is a direct instance
of Bar (any instances of super or subclasses will fail this check).

**Kind**: instance method of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
**Returns**: <code>Component</code> - this  

| Param | Type |
| --- | --- |
| type | <code>String</code> | 

**Example**  
```js
this.type('TextField');
```
<a name="module_domv/lib/Component--Component+on"></a>
#### component.on(event, listener, [useCapture], [thisObject]) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
Adds a listener to the DOM.

**Kind**: instance method of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
**Returns**: <code>[Component](#exp_module_domv/lib/Component--Component)</code> - this  
**Throws**:

- <code>[domv/lib/Exception](#module_domv/lib/Exception)</code> For invalid arguments


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| event | <code>string</code> |  |  |
| listener | <code>function</code> |  |  |
| [useCapture] | <code>boolean</code> | <code>false</code> | Use the capture phase (for dom events) |
| [thisObject] | <code>\*</code> | <code>this</code> | The this object of "listener".        By default the "this" object of this method is used |

<a name="module_domv/lib/Component--Component+addListener"></a>
#### component.addListener(event, listener, [useCapture], [thisObject]) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
Adds a listener to the DOM or to the internal EventEmmiter, depending on the
type of the event (see [module:domv.isDOMEvent](module:domv.isDOMEvent))

**Kind**: instance method of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
**Returns**: <code>[Component](#exp_module_domv/lib/Component--Component)</code> - this  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| event | <code>string</code> |  |  |
| listener | <code>function</code> |  |  |
| [useCapture] | <code>boolean</code> | <code>false</code> | Use the capture phase (for dom events) |
| [thisObject] | <code>\*</code> | <code>this</code> | The this object of "listener".        By default the "this" object of this method is used |

<a name="module_domv/lib/Component--Component+removeListener"></a>
#### component.removeListener(event, listener, [useCapture], [thisObject]) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
Removes a listener from the DOM.
All of the parameters must equal the parameters that were used in addListener.

**Kind**: instance method of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
**Returns**: <code>[Component](#exp_module_domv/lib/Component--Component)</code> - this  

| Param | Type | Default |
| --- | --- | --- |
| event | <code>string</code> |  | 
| listener | <code>function</code> |  | 
| [useCapture] | <code>boolean</code> | <code>false</code> | 
| [thisObject] | <code>\*</code> | <code>this</code> | 

<a name="module_domv/lib/Component--Component+clearListeners"></a>
#### component.clearListeners()
Removes all (DOM) listeners from the outerNode.

**Kind**: instance method of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
<a name="module_domv/lib/Component--Component+emit"></a>
#### component.emit(name, [data]) ⇒ <code>boolean</code>
Emits a DOM custom Event on the outerNode with optional data. The listeners are passed an Event
object as their first argument which has this data set

**Kind**: instance method of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
**Returns**: <code>boolean</code> - False if any of the event listeners has called preventDefault(), otherwise true  
**Throws**:

- <code>[domv/lib/Exception](#module_domv/lib/Exception)</code> For invalid arguments


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| name | <code>String</code> |  | The event name, a prefix should be added to prevent name clashes with any new event names in        web browsers. (e.g. "domv-somethinghappened" |
| [data] | <code>Object</code> | <code>{}</code> | Key value pairs to set on the Event object |
| [data.bubbles] | <code>boolean</code> | <code>true</code> |  |
| [data.cancelable] | <code>boolean</code> | <code>true</code> |  |

<a name="module_domv/lib/Component--Component+isOuterNodeEqual"></a>
#### component.isOuterNodeEqual(node) ⇒ <code>boolean</code>
Is the outer DOM node equal to the given node?.
If a Component is given the outer nodes of both components must match.

**Kind**: instance method of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  

| Param | Type |
| --- | --- |
| node | <code>[Node](#external_Node)</code> &#124; <code>[domv/lib/Component](#module_domv/lib/Component)</code> | 

<a name="module_domv/lib/Component--Component+isInnerNodeEqual"></a>
#### component.isInnerNodeEqual(node) ⇒ <code>boolean</code>
Is the inner DOM node equal to the given node?.
If a Component is given the inner nodes of both components must match.

**Kind**: instance method of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  

| Param | Type |
| --- | --- |
| node | <code>[Node](#external_Node)</code> &#124; <code>[domv/lib/Component](#module_domv/lib/Component)</code> | 

<a name="module_domv/lib/Component--Component+isNodeEqual"></a>
#### component.isNodeEqual(node) ⇒ <code>boolean</code>
Are the outer and inner node equal to the given node?
If a Component is given the outer and inner nodes of both components must match.

**Kind**: instance method of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  

| Param | Type |
| --- | --- |
| node | <code>[Node](#external_Node)</code> &#124; <code>[domv/lib/Component](#module_domv/lib/Component)</code> | 

<a name="module_domv/lib/Component--Component+create"></a>
#### component.create(nodeName, className, [...content]) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
Convenient function to create a wrapped Node including its attributes (for elements).

**Kind**: instance method of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
**Throws**:

- <code>[domv/lib/Exception](#module_domv/lib/Exception)</code> For invalid arguments


| Param | Type | Description |
| --- | --- | --- |
| nodeName | <code>string</code> |  |
| className | <code>string</code> |  |
| [...content] | <code>string</code> &#124; <code>[Node](#external_Node)</code> &#124; <code>[domv/lib/Component](#module_domv/lib/Component)</code> &#124; <code>Object.&lt;string, string&gt;</code> | <p>If a string is passed, a text node is appended.</p>        <p>If a node or component is passed, it is simply appended.</p>        <p>If an object of key value pairs is passed, it sets those as attributes.</p> |

<a name="module_domv/lib/Component--Component+text"></a>
#### component.text(...text_) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
Creates a new wrapped TextNode.

**Kind**: instance method of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  

| Param | Type | Description |
| --- | --- | --- |
| ...text_ | <code>string</code> | Extra arguments will be joined using a space |

**Example**  
```js
var wrappedDiv = require('domv').create(document, 'div');
var wrappedText = require('domv').text(document, 'Hi!');
wrappedDiv.appendChild(wrappedText);
console.log(wrappedDiv.outerNode.outerHTML);
// <div>Hi!</div>
```
<a name="module_domv/lib/Component--Component+shorthand"></a>
#### component.shorthand([tagName], ...initialAttributes) ⇒ <code>domv/lib/CreateShortHand</code>
Generate a short hand function wich lets you quickly create
new elements (wrapped) including attributes.

**Kind**: instance method of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
**Throws**:

- <code>[domv/lib/Exception](#module_domv/lib/Exception)</code> For invalid arguments


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [tagName] | <code>string</code> | <code>&quot;&#x27;div&#x27;&quot;</code> |  |
| ...initialAttributes | <code>string</code> &#124; <code>Object.&lt;string, string&gt;</code> |  | <p>If a string is passed, a text node is appended.</p>        <p>If an object of key value pairs is passed, it sets those as attributes            (see [attr](#module_domv/lib/Component--Component+attr)).</p> |

**Example**  
```js
var a = this.shorthand('a');
var link = a('readmore', {'href': something()}, 'Click here to readmore!');
// <a class="readmore" href="#example">Click here to readmore!</a>
```
<a name="module_domv/lib/Component--Component+textShorthand"></a>
#### component.textShorthand() ⇒ <code>function</code>
Generate a short hand function which lets you quickly create
new text nodes (wrapped).

**Kind**: instance method of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
**Example**  
```js
var text = this.textShorthand();
var wraped = text('bla');
wrapped = text('foo', 'bar'); // 'foo bar'
```
<a name="module_domv/lib/Component--Component+appendChild"></a>
#### component.appendChild(...node_) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
Add a child node at the end of the inner node.

**Kind**: instance method of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
**Returns**: <code>[Component](#exp_module_domv/lib/Component--Component)</code> - this  
**Throws**:

- <code>[domv/lib/Exception](#module_domv/lib/Exception)</code> If this Component does not support child nodes.


| Param | Type | Description |
| --- | --- | --- |
| ...node_ | <code>[domv/lib/Component](#module_domv/lib/Component)</code> &#124; <code>[Node](#external_Node)</code> | A plain Node or if a Component is passed, the outerNode. |

<a name="module_domv/lib/Component--Component+prependChild"></a>
#### component.prependChild(...node_) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
Add a child node at the beginning of the inner node.

**Kind**: instance method of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
**Returns**: <code>[Component](#exp_module_domv/lib/Component--Component)</code> - this  
**Throws**:

- <code>[domv/lib/Exception](#module_domv/lib/Exception)</code> Will throw if this Component does not support child nodes.


| Param | Type | Description |
| --- | --- | --- |
| ...node_ | <code>[domv/lib/Component](#module_domv/lib/Component)</code> &#124; <code>[Node](#external_Node)</code> | A plain Node or if a Component is passed, the outerNode. |

<a name="module_domv/lib/Component--Component+siblingBefore"></a>
#### component.siblingBefore(...node_) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
Add a sibling node before the outer node. (which will become the outer node's previousSibling)

**Kind**: instance method of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
**Returns**: <code>[Component](#exp_module_domv/lib/Component--Component)</code> - this  
**Throws**:

- <code>[domv/lib/Exception](#module_domv/lib/Exception)</code> Will throw if this Component does not support child nodes.


| Param | Type | Description |
| --- | --- | --- |
| ...node_ | <code>[domv/lib/Component](#module_domv/lib/Component)</code> &#124; <code>[Node](#external_Node)</code> | A plain Node or if a Component is passed, the outerNode. |

<a name="module_domv/lib/Component--Component+siblingAfter"></a>
#### component.siblingAfter(...node_) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
Add a sibling node after the outer node. (which will become the outer node's nextSibling)

**Kind**: instance method of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
**Returns**: <code>[Component](#exp_module_domv/lib/Component--Component)</code> - this  
**Throws**:

- <code>[domv/lib/Exception](#module_domv/lib/Exception)</code> Will throw if this Component does not support child nodes.


| Param | Type | Description |
| --- | --- | --- |
| ...node_ | <code>[domv/lib/Component](#module_domv/lib/Component)</code> &#124; <code>[Node](#external_Node)</code> | A plain Node or if a Component is passed, the outerNode. |

<a name="module_domv/lib/Component--Component+removeNode"></a>
#### component.removeNode() ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
Removes the outer node from its parentNode.

**Kind**: instance method of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
**Returns**: <code>[Component](#exp_module_domv/lib/Component--Component)</code> - this  
<a name="module_domv/lib/Component--Component+removeChildren"></a>
#### component.removeChildren() ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
Removes the all the children of the inner node

**Kind**: instance method of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
**Returns**: <code>[Component](#exp_module_domv/lib/Component--Component)</code> - this  
<a name="module_domv/lib/Component--Component+addClass"></a>
#### component.addClass(...cls) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
Add classNames on the outer node.

**Kind**: instance method of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
**Returns**: <code>[Component](#exp_module_domv/lib/Component--Component)</code> - this  
**Throws**:

- <code>[domv/lib/Exception](#module_domv/lib/Exception)</code> If the outer node of this Component does not support attributes;


| Param | Type | Description |
| --- | --- | --- |
| ...cls | <code>string</code> | The classNames to add |

<a name="module_domv/lib/Component--Component+removeClass"></a>
#### component.removeClass(...cls) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
Remove classNames from the outer node.

**Kind**: instance method of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
**Returns**: <code>[Component](#exp_module_domv/lib/Component--Component)</code> - this  
**Throws**:

- <code>[domv/lib/Exception](#module_domv/lib/Exception)</code> If the outer node of this Component does not support attributes;


| Param | Type | Description |
| --- | --- | --- |
| ...cls | <code>string</code> | The classNames to remove |

<a name="module_domv/lib/Component--Component+hasClass"></a>
#### component.hasClass(...cls) ⇒ <code>boolean</code>
Does the outer node contain all of the given classNames?

**Kind**: instance method of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  

| Param | Type | Description |
| --- | --- | --- |
| ...cls | <code>string</code> | The classNames to check. |

<a name="module_domv/lib/Component--Component+assertHasClass"></a>
#### component.assertHasClass(...cls)
Does the outer node contain all of the given classNames?

**Kind**: instance method of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
**Throws**:

- <code>[domv/lib/Exception](#module_domv/lib/Exception)</code> If the outer node of this Component does not contain all of the given classNames


| Param | Type | Description |
| --- | --- | --- |
| ...cls | <code>string</code> | The classNames to check. |

<a name="module_domv/lib/Component--Component+toggleClass"></a>
#### component.toggleClass(cls, force) ⇒ <code>boolean</code>
Toggle a className on the outer node.

**Kind**: instance method of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
**Throws**:

- <code>[domv/lib/Exception](#module_domv/lib/Exception)</code> If the outer node of this Component does not support attributes


| Param | Type | Description |
| --- | --- | --- |
| cls | <code>string</code> | The className to toggle |
| force | <code>boolean</code> | If set, force the class name to be added (true) or removed (false). |

<a name="module_domv/lib/Component--Component+attr"></a>
#### component.attr(name, value) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
Set/unset an attribute on the outer node.

**Kind**: instance method of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
**Returns**: <code>[Component](#exp_module_domv/lib/Component--Component)</code> - this  
**Throws**:

- <code>[domv/lib/Exception](#module_domv/lib/Exception)</code> If the outer node of this Component does not support attributes;


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> &#124; <code>Object.&lt;string, string&gt;</code> | The attribute name to unset/set.        Or an object of key value pairs which sets multiple attributes at the same time,        in this case "value" should not be set. |
| value | <code>string</code> &#124; <code>boolean</code> | The value to set.        Use boolean false or null to unset the attribute. Use boolean true to set a boolean attribute (e.g. checked="checked"). |

<a name="module_domv/lib/Component--Component+getAttr"></a>
#### component.getAttr(name) ⇒ <code>string</code>
Get the value of a single attribute of the outer node.

**Kind**: instance method of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
**Returns**: <code>string</code> - The attribute value  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The attribute name to get. |

<a name="module_domv/lib/Component--Component+selector"></a>
#### component.selector(selector, [ComponentConstructor]) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
Returns the first element, or null, that matches the specified selector(s).
(applied on the inner node)

**Kind**: instance method of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| selector | <code>string</code> &#124; <code>Array.&lt;string&gt;</code> |  | A single selector (without a group) or an array of selectors for a selector group |
| [ComponentConstructor] | <code>function</code> | <code>module:domv/lib/Component</code> | The constructor to         use to wrap the result Node, by default the Node is wrapped in a plain Component,         but it is also possible to specify your own constructor. |

<a name="module_domv/lib/Component--Component+assertSelector"></a>
#### component.assertSelector(selector, [ComponentConstructor]) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
Returns the first element that matches the specified selector(s).
(applied on the inner node)

**Kind**: instance method of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
**Throws**:

- <code>[domv/lib/Exception](#module_domv/lib/Exception)</code> If no element was found


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| selector | <code>string</code> &#124; <code>Array.&lt;string&gt;</code> |  | A single selector (without a group) or an array of selectors for a selector group |
| [ComponentConstructor] | <code>function</code> | <code>module:domv/lib/Component</code> | The constructor to         use to wrap the result Node, by default the Node is wrapped in a plain Component,         but it is also possible to specify your own constructor. |

<a name="module_domv/lib/Component--Component+selectorAll"></a>
#### component.selectorAll(selector, [ComponentConstructor]) ⇒ <code>[Array.&lt;Component&gt;](#exp_module_domv/lib/Component--Component)</code>
Returns a list of all elements that matches the specified selector(s).
(applied on the inner node)

**Kind**: instance method of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| selector | <code>string</code> &#124; <code>Array.&lt;string&gt;</code> |  | A single selector (without a group) or an array of selectors for a selector group |
| [ComponentConstructor] | <code>function</code> | <code>module:domv/lib/Component</code> | The constructor to         use to wrap the resulting Nodes, by default the Nodes are wrapped in a plain Component,         but it is also possible to specify your own constructor. |

<a name="module_domv/lib/Component--Component+adoptAllAttributes"></a>
#### component.adoptAllAttributes(from)
Copy all attributes from the given element to our outer node.

**Kind**: instance method of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
**Throws**:

- <code>[domv/lib/Exception](#module_domv/lib/Exception)</code> If the outer node or the given element is not an element


| Param | Type | Description |
| --- | --- | --- |
| from | <code>[domv/lib/Component](#module_domv/lib/Component)</code> &#124; <code>[Element](#external_Element)</code> | A DOM Element or if a Component is passed, the outerNode. |

<a name="module_domv/lib/Component--Component+swapNode"></a>
#### component.swapNode(node)
Move over all child nodes of the inner node to the given "node" and replace
the outer node with the given "node".

**Kind**: instance method of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
**Throws**:

- <code>[domv/lib/Exception](#module_domv/lib/Exception)</code> If the outer node or the given element is not an element


| Param | Type | Description |
| --- | --- | --- |
| node | <code>Element</code> &#124; <code>[domv/lib/Component](#module_domv/lib/Component)</code> | The node to replace our outer node with. If not set, the children of our inner node are added to the parent of the outer node. |

**Example**  
```js
var container = document.createElement('div');
container.innerHTML = '<section>abc<p>def<strong>ghj</strong>klm</p>nop</section>';
domv.wrap(container).selector('p').swap(document.createElement('h1'));
console.log(container.innerHTML);
//  '<section>abc<h1>def<strong>ghj</strong>klm</h1>nop</section>'
```
<a name="module_domv/lib/Component--Component+isAllWhiteSpace"></a>
#### component.isAllWhiteSpace([checkChildElements]) ⇒ <code>boolean</code>
Does the innerNode (and its (grand)children) of this component only consist of whitespace?
Text nodes that only consist of spaces, newlines and horizontal tabs are whitespace.
Comment nodes are whitespace.
Empty text, comment, element nodes are whitespace.
Certain content elements such as for example img, video, input, etc are not whitespace.

**Kind**: instance method of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [checkChildElements] | <code>boolean</code> | <code>false</code> | If false any element node (e.g. an empty div) that is        encountered will fail the whitespace check. If true those elements are checked recursively        for whitepspace |

<a name="module_domv/lib/Component--Component+stringifyAsHtml"></a>
#### component.stringifyAsHtml() ⇒ <code>string</code>
Stringify the outerNode and all its children as html markup.

**Kind**: instance method of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
<a name="module_domv/lib/Component--Component+sendResponseAsHtml"></a>
#### component.sendResponseAsHtml(response)
Stringify the outerNode and all its children as html markup, and send it
as a http response in node.js with the proper Content-Type and Content-Length.
Other headers can be set by calling setHeader() on the response before calling
this method. The status code can be set by setting response.statusCode in the same
fashion (the default is 200).
This method uses this.stringifyAsHtml() to generate the markup (which can be
overridden).

**Kind**: instance method of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  

| Param | Type |
| --- | --- |
| response | <code>[ServerResponse](#external_ServerResponse)</code> | 

<a name="module_domv/lib/Component--Component+splice"></a>
#### component.splice()
This method does nothing, it is used so that firebug and chrome displays Component objects as an array.
This method is not used by this library, feel free to override this method.

**Kind**: instance method of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
<a name="module_domv/lib/Component--Component+updateConsoleHack"></a>
#### component.updateConsoleHack()
<p>Called whenever an inner/outer node changes.
This enables pretty formatting of Component instances in the firebug and chrome console.</p>

<p>Firebug will display instances as:</p>
<code>"Object["BaseDocument", html.BaseDocument, div.content]"</code>
<!-- "Object" is the value of [[Class]] -->


<p>Chrome will display instances as:</p>
<code>["BaseDocument", &lt;html class=​"BaseDocument"&gt;​...​&lt;/html&gt;​, &lt;div class=​"content"&gt;​…&lt;/div&gt;​...​&lt;/div&gt;​]</code>

<p>This hack works by setting the attributes "length", "0", "1" and "2" ("splice" is set on the prototype also).
   Override this method to do nothing in your subclass to disable this hack.</p>

**Kind**: instance method of <code>[Component](#exp_module_domv/lib/Component--Component)</code>  
<a name="module_domv/lib/Exception"></a>
## domv/lib/Exception
The base class for any exception that originates from this library

**Author:** Joris van der Wel <joris@jorisvanderwel.com>  

* [domv/lib/Exception](#module_domv/lib/Exception)
  * [Exception](#exp_module_domv/lib/Exception--Exception) ⇐ <code>Error</code> ⏏
    * [new Exception(wrapped)](#new_module_domv/lib/Exception--Exception_new)

<a name="exp_module_domv/lib/Exception--Exception"></a>
### Exception ⇐ <code>Error</code> ⏏
**Kind**: Exported class  
**Extends:** <code>Error</code>  
<a name="new_module_domv/lib/Exception--Exception_new"></a>
#### new Exception(wrapped)
Construct a simple domv.Exception


| Param | Type |
| --- | --- |
| wrapped | <code>Error</code> | 

**Example**  
```js
new domv.Exception(new Error('Hrm'));
```
<a name="module_domv/lib/HtmlDocument"></a>
## domv/lib/HtmlDocument
Represents a full document in html, including the root node html.

**Author:** Joris van der Wel <joris@jorisvanderwel.com>  

* [domv/lib/HtmlDocument](#module_domv/lib/HtmlDocument)
  * [HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument) ⇐ <code>[domv/lib/Component](#module_domv/lib/Component)</code> ⏏
    * [new HtmlDocument(node)](#new_module_domv/lib/HtmlDocument--HtmlDocument_new)
    * [.head](#module_domv/lib/HtmlDocument--HtmlDocument+head) : <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.body](#module_domv/lib/HtmlDocument--HtmlDocument+body) : <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.baseWrapped](#module_domv/lib/HtmlDocument--HtmlDocument+baseWrapped) : <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.titleWrapped](#module_domv/lib/HtmlDocument--HtmlDocument+titleWrapped) : <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.title](#module_domv/lib/HtmlDocument--HtmlDocument+title) : <code>string</code>
    * [.baseURI](#module_domv/lib/HtmlDocument--HtmlDocument+baseURI) : <code>string</code>
    * [.document](#module_domv/lib/Component--Component+document) : <code>[Document](#external_Document)</code>
    * [.outerNode](#module_domv/lib/Component--Component+outerNode) : <code>[Node](#external_Node)</code>
    * [.outerNodeWrapped](#module_domv/lib/Component--Component+outerNodeWrapped) : <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.innerNode](#module_domv/lib/Component--Component+innerNode) : <code>[Node](#external_Node)</code>
    * [.innerNodeWrapped](#module_domv/lib/Component--Component+innerNodeWrapped) : <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.style](#module_domv/lib/Component--Component+style) : <code>[CSSStyleDeclaration](#external_CSSStyleDeclaration)</code>
    * [.children](#module_domv/lib/Component--Component+children) : <code>[Array.&lt;Component&gt;](#exp_module_domv/lib/Component--Component)</code>
    * [.childElementCount](#module_domv/lib/Component--Component+childElementCount) : <code>Number</code>
    * [.childrenIndex](#module_domv/lib/Component--Component+childrenIndex) : <code>int</code>
    * [.childNodes](#module_domv/lib/Component--Component+childNodes) : <code>[Array.&lt;Component&gt;](#exp_module_domv/lib/Component--Component)</code>
    * [.childNodeCount](#module_domv/lib/Component--Component+childNodeCount) : <code>Number</code>
    * [.childNodesIndex](#module_domv/lib/Component--Component+childNodesIndex) : <code>int</code>
    * [.isEmpty](#module_domv/lib/Component--Component+isEmpty) : <code>boolean</code>
    * [.firstChild](#module_domv/lib/Component--Component+firstChild) : <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.lastChild](#module_domv/lib/Component--Component+lastChild) : <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.firstElementChild](#module_domv/lib/Component--Component+firstElementChild) : <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.lastElementChild](#module_domv/lib/Component--Component+lastElementChild) : <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.nextSibling](#module_domv/lib/Component--Component+nextSibling) : <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.previousSibling](#module_domv/lib/Component--Component+previousSibling) : <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.nextElementSibling](#module_domv/lib/Component--Component+nextElementSibling) : <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.previousElementSibling](#module_domv/lib/Component--Component+previousElementSibling) : <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.parentNode](#module_domv/lib/Component--Component+parentNode) : <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.textContent](#module_domv/lib/Component--Component+textContent) : <code>string</code>
    * [.value](#module_domv/lib/Component--Component+value) : <code>string</code>
    * [.checked](#module_domv/lib/Component--Component+checked) : <code>boolean</code>
    * [.selected](#module_domv/lib/Component--Component+selected) : <code>boolean</code>
    * [.focus](#module_domv/lib/Component--Component+focus) : <code>boolean</code>
    * [.hasFocus](#module_domv/lib/Component--Component+hasFocus) : <code>boolean</code>
    * [.outerNodeType](#module_domv/lib/Component--Component+outerNodeType) : <code>[NodeType](#module_domv.NodeType)</code>
    * [.innerNodeType](#module_domv/lib/Component--Component+innerNodeType) : <code>[NodeType](#module_domv.NodeType)</code>
    * [.outerNodeName](#module_domv/lib/Component--Component+outerNodeName) : <code>string</code>
    * [.innerNodeName](#module_domv/lib/Component--Component+innerNodeName) : <code>string</code>
    * [.isDOMVComponent](#module_domv/lib/Component--Component+isDOMVComponent) : <code>boolean</code>
    * [.addCSS(href, media)](#module_domv/lib/HtmlDocument--HtmlDocument+addCSS) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.addJS(href, [async])](#module_domv/lib/HtmlDocument--HtmlDocument+addJS) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.addJSONData(identifier, data)](#module_domv/lib/HtmlDocument--HtmlDocument+addJSONData) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.getJSONData(identifier)](#module_domv/lib/HtmlDocument--HtmlDocument+getJSONData) ⇒ <code>\*</code>
    * [.isCreationConstructor(node, [wrapDocument])](#module_domv/lib/Component--Component+isCreationConstructor) ⇒ <code>boolean</code>
    * [.parseShorthandArgument(arg)](#module_domv/lib/Component--Component+parseShorthandArgument) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.type(type)](#module_domv/lib/Component--Component+type) ⇒ <code>Component</code>
    * [.on(event, listener, [useCapture], [thisObject])](#module_domv/lib/Component--Component+on) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.addListener(event, listener, [useCapture], [thisObject])](#module_domv/lib/Component--Component+addListener) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.removeListener(event, listener, [useCapture], [thisObject])](#module_domv/lib/Component--Component+removeListener) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.clearListeners()](#module_domv/lib/Component--Component+clearListeners)
    * [.emit(name, [data])](#module_domv/lib/Component--Component+emit) ⇒ <code>boolean</code>
    * [.isOuterNodeEqual(node)](#module_domv/lib/Component--Component+isOuterNodeEqual) ⇒ <code>boolean</code>
    * [.isInnerNodeEqual(node)](#module_domv/lib/Component--Component+isInnerNodeEqual) ⇒ <code>boolean</code>
    * [.isNodeEqual(node)](#module_domv/lib/Component--Component+isNodeEqual) ⇒ <code>boolean</code>
    * [.create(nodeName, className, [...content])](#module_domv/lib/Component--Component+create) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.text(...text_)](#module_domv/lib/Component--Component+text) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.shorthand([tagName], ...initialAttributes)](#module_domv/lib/Component--Component+shorthand) ⇒ <code>domv/lib/CreateShortHand</code>
    * [.textShorthand()](#module_domv/lib/Component--Component+textShorthand) ⇒ <code>function</code>
    * [.appendChild(...node_)](#module_domv/lib/Component--Component+appendChild) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.prependChild(...node_)](#module_domv/lib/Component--Component+prependChild) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.siblingBefore(...node_)](#module_domv/lib/Component--Component+siblingBefore) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.siblingAfter(...node_)](#module_domv/lib/Component--Component+siblingAfter) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.removeNode()](#module_domv/lib/Component--Component+removeNode) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.removeChildren()](#module_domv/lib/Component--Component+removeChildren) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.addClass(...cls)](#module_domv/lib/Component--Component+addClass) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.removeClass(...cls)](#module_domv/lib/Component--Component+removeClass) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.hasClass(...cls)](#module_domv/lib/Component--Component+hasClass) ⇒ <code>boolean</code>
    * [.assertHasClass(...cls)](#module_domv/lib/Component--Component+assertHasClass)
    * [.toggleClass(cls, force)](#module_domv/lib/Component--Component+toggleClass) ⇒ <code>boolean</code>
    * [.attr(name, value)](#module_domv/lib/Component--Component+attr) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.getAttr(name)](#module_domv/lib/Component--Component+getAttr) ⇒ <code>string</code>
    * [.selector(selector, [ComponentConstructor])](#module_domv/lib/Component--Component+selector) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.assertSelector(selector, [ComponentConstructor])](#module_domv/lib/Component--Component+assertSelector) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
    * [.selectorAll(selector, [ComponentConstructor])](#module_domv/lib/Component--Component+selectorAll) ⇒ <code>[Array.&lt;Component&gt;](#exp_module_domv/lib/Component--Component)</code>
    * [.adoptAllAttributes(from)](#module_domv/lib/Component--Component+adoptAllAttributes)
    * [.swapNode(node)](#module_domv/lib/Component--Component+swapNode)
    * [.isAllWhiteSpace([checkChildElements])](#module_domv/lib/Component--Component+isAllWhiteSpace) ⇒ <code>boolean</code>
    * [.stringifyAsHtml()](#module_domv/lib/Component--Component+stringifyAsHtml) ⇒ <code>string</code>
    * [.sendResponseAsHtml(response)](#module_domv/lib/Component--Component+sendResponseAsHtml)
    * [.splice()](#module_domv/lib/Component--Component+splice)
    * [.updateConsoleHack()](#module_domv/lib/Component--Component+updateConsoleHack)

<a name="exp_module_domv/lib/HtmlDocument--HtmlDocument"></a>
### HtmlDocument ⇐ <code>[domv/lib/Component](#module_domv/lib/Component)</code> ⏏
**Kind**: Exported class  
**Extends:** <code>[domv/lib/Component](#module_domv/lib/Component)</code>  
<a name="new_module_domv/lib/HtmlDocument--HtmlDocument_new"></a>
#### new HtmlDocument(node)
This constructor can be used to either create a new html document (html, head, body),
or to wrap an existing html document into this class.

**Throws**:

- <code>[domv/lib/Exception](#module_domv/lib/Exception)</code> If an invalid node is passed, or if the existing document is missing the "head" or "body" element.


| Param | Type | Description |
| --- | --- | --- |
| node | <code>[Node](#external_Node)</code> &#124; <code>[domv/lib/Component](#module_domv/lib/Component)</code> | Either null, a document node or an "html" element node |

**Example**  
```js
new HtmlDocument() // create a new Document Node, including html (as its child), head, body.
```
**Example**  
```js
new HtmlDocument(document); // Create html, head and body elements using the given Document Node,
         but do not modify the given Document node (constructors should be side-effect free).
```
**Example**  
```js
new HtmlDocument(document.documentElement); // Associate an existing html document
```
<a name="module_domv/lib/HtmlDocument--HtmlDocument+head"></a>
#### htmlDocument.head : <code>[Component](#exp_module_domv/lib/Component--Component)</code>
The "head" Element of the document.

**Kind**: instance property of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
<a name="module_domv/lib/HtmlDocument--HtmlDocument+body"></a>
#### htmlDocument.body : <code>[Component](#exp_module_domv/lib/Component--Component)</code>
The "body" Element of the document.

**Kind**: instance property of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
<a name="module_domv/lib/HtmlDocument--HtmlDocument+baseWrapped"></a>
#### htmlDocument.baseWrapped : <code>[Component](#exp_module_domv/lib/Component--Component)</code>
The "base" Element of the document.
(within the "head" node)

**Kind**: instance property of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
<a name="module_domv/lib/HtmlDocument--HtmlDocument+titleWrapped"></a>
#### htmlDocument.titleWrapped : <code>[Component](#exp_module_domv/lib/Component--Component)</code>
The "title" Element of the document.
(within the head node)

**Kind**: instance property of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
<a name="module_domv/lib/HtmlDocument--HtmlDocument+title"></a>
#### htmlDocument.title : <code>string</code>
The textContent of the "title" Element of this document.
(within the "head" node)

**Kind**: instance property of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
<a name="module_domv/lib/HtmlDocument--HtmlDocument+baseURI"></a>
#### htmlDocument.baseURI : <code>string</code>
The base URI that is used to resolve all the relative uri's within this document.
(this is get/set using a "base" Element within the "head" element)

**Kind**: instance property of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
<a name="module_domv/lib/Component--Component+document"></a>
#### htmlDocument.document : <code>[Document](#external_Document)</code>
The Document Node that the nodes of this Component are associated with.

**Kind**: instance property of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
**Throws**:

- <code>[domv/lib/Exception](#module_domv/lib/Exception)</code> If an invalid value is set

<a name="module_domv/lib/Component--Component+outerNode"></a>
#### htmlDocument.outerNode : <code>[Node](#external_Node)</code>
The "outer" DOM Node for this component.
<p>This node is used to apply attributes or when adding this
   component as the child of another.</p>
<p>This property is usually set by the Component constructor</p>

**Kind**: instance property of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
**Throws**:

- <code>[domv/lib/Exception](#module_domv/lib/Exception)</code> If an invalid value is set

<a name="module_domv/lib/Component--Component+outerNodeWrapped"></a>
#### htmlDocument.outerNodeWrapped : <code>[Component](#exp_module_domv/lib/Component--Component)</code>
The outer DOM node wrapped as a new component.

**Kind**: instance property of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
<a name="module_domv/lib/Component--Component+innerNode"></a>
#### htmlDocument.innerNode : <code>[Node](#external_Node)</code>
The "inner" DOM Node for this component.
<p>This is used when adding nodes or other components as the child of
   this Component. E.g. when using methods such as appendChild() and prependChild()
   or properties such as childNodes or firstChild</p>
<p>This property is usually set by the Component constructor,
   or by your subclass constructor</p>
<p>If this property is set to null, children are not allowed
   for this component. Note that innerNode may also reference
   nodes that do not allow children because of their type
   (such as a TextNode)</p>

**Kind**: instance property of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
**Overrides:** <code>[innerNode](#module_domv/lib/Component--Component+innerNode)</code>  
**Throws**:

- <code>[domv/lib/Exception](#module_domv/lib/Exception)</code> If an invalid value is set

<a name="module_domv/lib/Component--Component+innerNodeWrapped"></a>
#### htmlDocument.innerNodeWrapped : <code>[Component](#exp_module_domv/lib/Component--Component)</code>
The inner DOM node wrapped as a new component.

**Kind**: instance property of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
<a name="module_domv/lib/Component--Component+style"></a>
#### htmlDocument.style : <code>[CSSStyleDeclaration](#external_CSSStyleDeclaration)</code>
The inline style for the outer node.

**Kind**: instance property of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
<a name="module_domv/lib/Component--Component+children"></a>
#### htmlDocument.children : <code>[Array.&lt;Component&gt;](#exp_module_domv/lib/Component--Component)</code>
The (wrapped) child elements of the inner node.
The returned list is not live.

**Kind**: instance property of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
<a name="module_domv/lib/Component--Component+childElementCount"></a>
#### htmlDocument.childElementCount : <code>Number</code>
The number of immediate child elements that belong to the inner node.

**Kind**: instance property of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
<a name="module_domv/lib/Component--Component+childrenIndex"></a>
#### htmlDocument.childrenIndex : <code>int</code>
The index of the outerNode in the "children" attribute of the parentNode.

**Kind**: instance property of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
**Example**  
```js
myParent.children[3].childrenIndex === 3
```
<a name="module_domv/lib/Component--Component+childNodes"></a>
#### htmlDocument.childNodes : <code>[Array.&lt;Component&gt;](#exp_module_domv/lib/Component--Component)</code>
The (wrapped) child nodes of the inner node.
The returned list is not live.

**Kind**: instance property of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
<a name="module_domv/lib/Component--Component+childNodeCount"></a>
#### htmlDocument.childNodeCount : <code>Number</code>
The number of immediate child nodes that belong to the inner node.

**Kind**: instance property of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
<a name="module_domv/lib/Component--Component+childNodesIndex"></a>
#### htmlDocument.childNodesIndex : <code>int</code>
The index of the outerNode in the "childNodes" attribute of the parentNode.

**Kind**: instance property of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
**Example**  
```js
myParent.childNodes[3].childNodesIndex === 3
```
<a name="module_domv/lib/Component--Component+isEmpty"></a>
#### htmlDocument.isEmpty : <code>boolean</code>
Is the inner node empty?
For Element nodes this means that there are 0 child nodes.
For CharacterData nodes, the text content must be of 0 length.
Other nodes are never considered empty

**Kind**: instance property of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
<a name="module_domv/lib/Component--Component+firstChild"></a>
#### htmlDocument.firstChild : <code>[Component](#exp_module_domv/lib/Component--Component)</code>
The first (wrapped) child node of the inner node.

**Kind**: instance property of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
<a name="module_domv/lib/Component--Component+lastChild"></a>
#### htmlDocument.lastChild : <code>[Component](#exp_module_domv/lib/Component--Component)</code>
The first (wrapped) child node of the inner node.

**Kind**: instance property of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
<a name="module_domv/lib/Component--Component+firstElementChild"></a>
#### htmlDocument.firstElementChild : <code>[Component](#exp_module_domv/lib/Component--Component)</code>
The first (wrapped) child node of the inner node that is an element.

**Kind**: instance property of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
<a name="module_domv/lib/Component--Component+lastElementChild"></a>
#### htmlDocument.lastElementChild : <code>[Component](#exp_module_domv/lib/Component--Component)</code>
The last (wrapped) child node of the inner node that is an element.

**Kind**: instance property of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
<a name="module_domv/lib/Component--Component+nextSibling"></a>
#### htmlDocument.nextSibling : <code>[Component](#exp_module_domv/lib/Component--Component)</code>
The next (wrapped) sibling of the outer node.

**Kind**: instance property of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
<a name="module_domv/lib/Component--Component+previousSibling"></a>
#### htmlDocument.previousSibling : <code>[Component](#exp_module_domv/lib/Component--Component)</code>
The previous (wrapped) sibling of the outer node.

**Kind**: instance property of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
<a name="module_domv/lib/Component--Component+nextElementSibling"></a>
#### htmlDocument.nextElementSibling : <code>[Component](#exp_module_domv/lib/Component--Component)</code>
The next (wrapped) sibling of the outer node that is an element.

**Kind**: instance property of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
<a name="module_domv/lib/Component--Component+previousElementSibling"></a>
#### htmlDocument.previousElementSibling : <code>[Component](#exp_module_domv/lib/Component--Component)</code>
The previous (wrapped) sibling of the outer node that is an element.

**Kind**: instance property of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
<a name="module_domv/lib/Component--Component+parentNode"></a>
#### htmlDocument.parentNode : <code>[Component](#exp_module_domv/lib/Component--Component)</code>
The (wrapped) parent node of the outer node.

**Kind**: instance property of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
<a name="module_domv/lib/Component--Component+textContent"></a>
#### htmlDocument.textContent : <code>string</code>
The textual content of an element and all its descendants.
Or for Text, Comment, etc nodes it represents the nodeValue.
Setting this property on an element removes all of its children
and replaces them with a single text node with the given value.

**Kind**: instance property of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
<a name="module_domv/lib/Component--Component+value"></a>
#### htmlDocument.value : <code>string</code>
The value of this node. For most nodes this property is undefined, for input fields this
contains the current value. (The attribute "value" does not change by user input).

**Kind**: instance property of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
**Overrides:** <code>[value](#module_domv/lib/Component--Component+value)</code>  
<a name="module_domv/lib/Component--Component+checked"></a>
#### htmlDocument.checked : <code>boolean</code>
The checked state of this node. For most nodes this property is undefined, for input elements this
contains the checked state. (The attribute "checked" does not change by user input).

**Kind**: instance property of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
<a name="module_domv/lib/Component--Component+selected"></a>
#### htmlDocument.selected : <code>boolean</code>
The selected state of this node. For most nodes this property is undefined, for option elements this
contains the current selected state. (The attribute "selected" does not change by user input).

**Kind**: instance property of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
<a name="module_domv/lib/Component--Component+focus"></a>
#### htmlDocument.focus : <code>boolean</code>
Set or get the focus state of the inner node.
Only one Element can have focus, setting the focus to this element might unset it on an other element.

**Kind**: instance property of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
**Throws**:

- <code>[domv/lib/Exception](#module_domv/lib/Exception)</code> When setting this property if the inner node is not an Element node.

<a name="module_domv/lib/Component--Component+hasFocus"></a>
#### htmlDocument.hasFocus : <code>boolean</code>
Returns true if this node or any of its descendants has the focus state.

**Kind**: instance property of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
<a name="module_domv/lib/Component--Component+outerNodeType"></a>
#### htmlDocument.outerNodeType : <code>[NodeType](#module_domv.NodeType)</code>
The node type of the outer node.

**Kind**: instance property of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
<a name="module_domv/lib/Component--Component+innerNodeType"></a>
#### htmlDocument.innerNodeType : <code>[NodeType](#module_domv.NodeType)</code>
The node type of the inner node.

**Kind**: instance property of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
<a name="module_domv/lib/Component--Component+outerNodeName"></a>
#### htmlDocument.outerNodeName : <code>string</code>
The node name of the outer node.
(element tag names always in lowercase)

**Kind**: instance property of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
<a name="module_domv/lib/Component--Component+innerNodeName"></a>
#### htmlDocument.innerNodeName : <code>string</code>
The node name of the inner node.

**Kind**: instance property of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
<a name="module_domv/lib/Component--Component+isDOMVComponent"></a>
#### htmlDocument.isDOMVComponent : <code>boolean</code>
Always true for instances of this class.
<p>Use this attribute to determine if an object is a Component.
This would let you create an object compatible with this API,
without having to use Component as a super type.</p>

**Kind**: instance constant of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
<a name="module_domv/lib/HtmlDocument--HtmlDocument+addCSS"></a>
#### htmlDocument.addCSS(href, media) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
Link a css file to this document.

**Kind**: instance method of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
**Returns**: <code>[Component](#exp_module_domv/lib/Component--Component)</code> - The newly created "link" node  

| Param | Type | Description |
| --- | --- | --- |
| href | <code>string</code> | An absolute or relative URL |
| media | <code>string</code> | The media query to associate with this css file |

<a name="module_domv/lib/HtmlDocument--HtmlDocument+addJS"></a>
#### htmlDocument.addJS(href, [async]) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
Link a javascript file to this document.

**Kind**: instance method of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
**Returns**: <code>[Component](#exp_module_domv/lib/Component--Component)</code> - The newly created "script" node  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| href | <code>string</code> |  | An absolute or relative URL |
| [async] | <code>boolean</code> | <code>true</code> | If true, a webbrowser will continue parsing        the document even if the script file has not been fully loaded yet.        Use this whenever possible to decrease load times. |

<a name="module_domv/lib/HtmlDocument--HtmlDocument+addJSONData"></a>
#### htmlDocument.addJSONData(identifier, data) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
Expose JSON data to an interpreter of the HTML document using a script type="application/json" element.
The data can be retrieved using getJSONData with the same identifier;

**Kind**: instance method of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
**Returns**: <code>[Component](#exp_module_domv/lib/Component--Component)</code> - The newly created "script" node  

| Param | Type | Description |
| --- | --- | --- |
| identifier | <code>string</code> | Must be unique to properly get your JSON data back |
| data | <code>\*</code> | Any array, object, boolean, integer, et cetera that is able to be serialized into JSON. |

**Example**  
```js
myDoc.addJSONData('foo', {'abc': 'def'});
// <script type="application/json" data-identifier="foo">{"abc":"def"};</script>
```
<a name="module_domv/lib/HtmlDocument--HtmlDocument+getJSONData"></a>
#### htmlDocument.getJSONData(identifier) ⇒ <code>\*</code>
Retrieve JSON data previously exposed by addJSONData

**Kind**: instance method of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
**Returns**: <code>\*</code> - parsed json data  

| Param | Type | Description |
| --- | --- | --- |
| identifier | <code>string</code> | Same identifier as was used in addJSONData |

<a name="module_domv/lib/Component--Component+isCreationConstructor"></a>
#### htmlDocument.isCreationConstructor(node, [wrapDocument]) ⇒ <code>boolean</code>
**Kind**: instance method of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
**Returns**: <code>boolean</code> - If the creation constructor should be used instead of the wrapping constructor.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| node | <code>[Node](#external_Node)</code> &#124; <code>[domv/lib/Component](#module_domv/lib/Component)</code> |  | A DOCUMENT_NODE will result in the creation constructor, any other node will result in the wrapping constructor. A falsy value will also result in the creation constructor and it used in Component subclasses that know how to create their own DOCUMENT_NODE (e.g. [domv/lib/HtmlDocument](#module_domv/lib/HtmlDocument). |
| [wrapDocument] | <code>boolean</code> | <code>false</code> | <p>If false, passing a DOCUMENT_NODE as "node" will result in an empty tag being created instead of wrapping the DOCUMENT_NODE. This behaviour is more convenient when subclassing Component because it lets you treat subclasses and subsubclasses in the same way. <em>(e.g. the subclass Menu adds the class 'Menu' and common menu items. The subsubclass EventMenu adds the class 'EventMenu' and further event menu items.)</em></p> <p>If true, a document will always wrap.</p> |

<a name="module_domv/lib/Component--Component+parseShorthandArgument"></a>
#### htmlDocument.parseShorthandArgument(arg) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
This method is used by domv.create() and Component.prototype.shorthand() to assign attributes
and children to nodes with a shorthand syntax.
<p>If arg is undefined or null, no action is taken.</p>
<p>If arg is a string, the string is appened as a text node.</p>
<p>If arg is an object, all key value pairs are set as attributes.</p>
<p>Any DOM Node or domv Component is appended as a child.</p>
<p>If arg is an array, parseShorthandArgument is called for each item.</p>

**Kind**: instance method of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
**Returns**: <code>[Component](#exp_module_domv/lib/Component--Component)</code> - this  

| Param | Type |
| --- | --- |
| arg | <code>string</code> &#124; <code>[Node](#external_Node)</code> &#124; <code>[domv/lib/Component](#module_domv/lib/Component)</code> &#124; <code>Object.&lt;string, string&gt;</code> | 

<a name="module_domv/lib/Component--Component+type"></a>
#### htmlDocument.type(type) ⇒ <code>Component</code>
Used in Component constructors to mark this object to be an instance of the given type.
The "type argument" is used to add a html class and to overwrite the "data-type" attribute.

Effectively, this means that you can use .hasClass('Foo') to check if the Component is a direct
instance or an instance of a super class of a Foo component. And that
`.getAttr('data-type') === 'Bar'` can be used to check if the Component is a direct instance
of Bar (any instances of super or subclasses will fail this check).

**Kind**: instance method of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
**Returns**: <code>Component</code> - this  

| Param | Type |
| --- | --- |
| type | <code>String</code> | 

**Example**  
```js
this.type('TextField');
```
<a name="module_domv/lib/Component--Component+on"></a>
#### htmlDocument.on(event, listener, [useCapture], [thisObject]) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
Adds a listener to the DOM.

**Kind**: instance method of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
**Returns**: <code>[Component](#exp_module_domv/lib/Component--Component)</code> - this  
**Throws**:

- <code>[domv/lib/Exception](#module_domv/lib/Exception)</code> For invalid arguments


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| event | <code>string</code> |  |  |
| listener | <code>function</code> |  |  |
| [useCapture] | <code>boolean</code> | <code>false</code> | Use the capture phase (for dom events) |
| [thisObject] | <code>\*</code> | <code>this</code> | The this object of "listener".        By default the "this" object of this method is used |

<a name="module_domv/lib/Component--Component+addListener"></a>
#### htmlDocument.addListener(event, listener, [useCapture], [thisObject]) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
Adds a listener to the DOM or to the internal EventEmmiter, depending on the
type of the event (see [module:domv.isDOMEvent](module:domv.isDOMEvent))

**Kind**: instance method of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
**Returns**: <code>[Component](#exp_module_domv/lib/Component--Component)</code> - this  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| event | <code>string</code> |  |  |
| listener | <code>function</code> |  |  |
| [useCapture] | <code>boolean</code> | <code>false</code> | Use the capture phase (for dom events) |
| [thisObject] | <code>\*</code> | <code>this</code> | The this object of "listener".        By default the "this" object of this method is used |

<a name="module_domv/lib/Component--Component+removeListener"></a>
#### htmlDocument.removeListener(event, listener, [useCapture], [thisObject]) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
Removes a listener from the DOM.
All of the parameters must equal the parameters that were used in addListener.

**Kind**: instance method of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
**Returns**: <code>[Component](#exp_module_domv/lib/Component--Component)</code> - this  

| Param | Type | Default |
| --- | --- | --- |
| event | <code>string</code> |  | 
| listener | <code>function</code> |  | 
| [useCapture] | <code>boolean</code> | <code>false</code> | 
| [thisObject] | <code>\*</code> | <code>this</code> | 

<a name="module_domv/lib/Component--Component+clearListeners"></a>
#### htmlDocument.clearListeners()
Removes all (DOM) listeners from the outerNode.

**Kind**: instance method of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
<a name="module_domv/lib/Component--Component+emit"></a>
#### htmlDocument.emit(name, [data]) ⇒ <code>boolean</code>
Emits a DOM custom Event on the outerNode with optional data. The listeners are passed an Event
object as their first argument which has this data set

**Kind**: instance method of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
**Returns**: <code>boolean</code> - False if any of the event listeners has called preventDefault(), otherwise true  
**Throws**:

- <code>[domv/lib/Exception](#module_domv/lib/Exception)</code> For invalid arguments


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| name | <code>String</code> |  | The event name, a prefix should be added to prevent name clashes with any new event names in        web browsers. (e.g. "domv-somethinghappened" |
| [data] | <code>Object</code> | <code>{}</code> | Key value pairs to set on the Event object |
| [data.bubbles] | <code>boolean</code> | <code>true</code> |  |
| [data.cancelable] | <code>boolean</code> | <code>true</code> |  |

<a name="module_domv/lib/Component--Component+isOuterNodeEqual"></a>
#### htmlDocument.isOuterNodeEqual(node) ⇒ <code>boolean</code>
Is the outer DOM node equal to the given node?.
If a Component is given the outer nodes of both components must match.

**Kind**: instance method of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  

| Param | Type |
| --- | --- |
| node | <code>[Node](#external_Node)</code> &#124; <code>[domv/lib/Component](#module_domv/lib/Component)</code> | 

<a name="module_domv/lib/Component--Component+isInnerNodeEqual"></a>
#### htmlDocument.isInnerNodeEqual(node) ⇒ <code>boolean</code>
Is the inner DOM node equal to the given node?.
If a Component is given the inner nodes of both components must match.

**Kind**: instance method of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  

| Param | Type |
| --- | --- |
| node | <code>[Node](#external_Node)</code> &#124; <code>[domv/lib/Component](#module_domv/lib/Component)</code> | 

<a name="module_domv/lib/Component--Component+isNodeEqual"></a>
#### htmlDocument.isNodeEqual(node) ⇒ <code>boolean</code>
Are the outer and inner node equal to the given node?
If a Component is given the outer and inner nodes of both components must match.

**Kind**: instance method of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  

| Param | Type |
| --- | --- |
| node | <code>[Node](#external_Node)</code> &#124; <code>[domv/lib/Component](#module_domv/lib/Component)</code> | 

<a name="module_domv/lib/Component--Component+create"></a>
#### htmlDocument.create(nodeName, className, [...content]) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
Convenient function to create a wrapped Node including its attributes (for elements).

**Kind**: instance method of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
**Throws**:

- <code>[domv/lib/Exception](#module_domv/lib/Exception)</code> For invalid arguments


| Param | Type | Description |
| --- | --- | --- |
| nodeName | <code>string</code> |  |
| className | <code>string</code> |  |
| [...content] | <code>string</code> &#124; <code>[Node](#external_Node)</code> &#124; <code>[domv/lib/Component](#module_domv/lib/Component)</code> &#124; <code>Object.&lt;string, string&gt;</code> | <p>If a string is passed, a text node is appended.</p>        <p>If a node or component is passed, it is simply appended.</p>        <p>If an object of key value pairs is passed, it sets those as attributes.</p> |

<a name="module_domv/lib/Component--Component+text"></a>
#### htmlDocument.text(...text_) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
Creates a new wrapped TextNode.

**Kind**: instance method of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  

| Param | Type | Description |
| --- | --- | --- |
| ...text_ | <code>string</code> | Extra arguments will be joined using a space |

**Example**  
```js
var wrappedDiv = require('domv').create(document, 'div');
var wrappedText = require('domv').text(document, 'Hi!');
wrappedDiv.appendChild(wrappedText);
console.log(wrappedDiv.outerNode.outerHTML);
// <div>Hi!</div>
```
<a name="module_domv/lib/Component--Component+shorthand"></a>
#### htmlDocument.shorthand([tagName], ...initialAttributes) ⇒ <code>domv/lib/CreateShortHand</code>
Generate a short hand function wich lets you quickly create
new elements (wrapped) including attributes.

**Kind**: instance method of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
**Throws**:

- <code>[domv/lib/Exception](#module_domv/lib/Exception)</code> For invalid arguments


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [tagName] | <code>string</code> | <code>&quot;&#x27;div&#x27;&quot;</code> |  |
| ...initialAttributes | <code>string</code> &#124; <code>Object.&lt;string, string&gt;</code> |  | <p>If a string is passed, a text node is appended.</p>        <p>If an object of key value pairs is passed, it sets those as attributes            (see [attr](#module_domv/lib/Component--Component+attr)).</p> |

**Example**  
```js
var a = this.shorthand('a');
var link = a('readmore', {'href': something()}, 'Click here to readmore!');
// <a class="readmore" href="#example">Click here to readmore!</a>
```
<a name="module_domv/lib/Component--Component+textShorthand"></a>
#### htmlDocument.textShorthand() ⇒ <code>function</code>
Generate a short hand function which lets you quickly create
new text nodes (wrapped).

**Kind**: instance method of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
**Example**  
```js
var text = this.textShorthand();
var wraped = text('bla');
wrapped = text('foo', 'bar'); // 'foo bar'
```
<a name="module_domv/lib/Component--Component+appendChild"></a>
#### htmlDocument.appendChild(...node_) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
Add a child node at the end of the inner node.

**Kind**: instance method of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
**Returns**: <code>[Component](#exp_module_domv/lib/Component--Component)</code> - this  
**Throws**:

- <code>[domv/lib/Exception](#module_domv/lib/Exception)</code> If this Component does not support child nodes.


| Param | Type | Description |
| --- | --- | --- |
| ...node_ | <code>[domv/lib/Component](#module_domv/lib/Component)</code> &#124; <code>[Node](#external_Node)</code> | A plain Node or if a Component is passed, the outerNode. |

<a name="module_domv/lib/Component--Component+prependChild"></a>
#### htmlDocument.prependChild(...node_) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
Add a child node at the beginning of the inner node.

**Kind**: instance method of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
**Returns**: <code>[Component](#exp_module_domv/lib/Component--Component)</code> - this  
**Throws**:

- <code>[domv/lib/Exception](#module_domv/lib/Exception)</code> Will throw if this Component does not support child nodes.


| Param | Type | Description |
| --- | --- | --- |
| ...node_ | <code>[domv/lib/Component](#module_domv/lib/Component)</code> &#124; <code>[Node](#external_Node)</code> | A plain Node or if a Component is passed, the outerNode. |

<a name="module_domv/lib/Component--Component+siblingBefore"></a>
#### htmlDocument.siblingBefore(...node_) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
Add a sibling node before the outer node. (which will become the outer node's previousSibling)

**Kind**: instance method of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
**Returns**: <code>[Component](#exp_module_domv/lib/Component--Component)</code> - this  
**Throws**:

- <code>[domv/lib/Exception](#module_domv/lib/Exception)</code> Will throw if this Component does not support child nodes.


| Param | Type | Description |
| --- | --- | --- |
| ...node_ | <code>[domv/lib/Component](#module_domv/lib/Component)</code> &#124; <code>[Node](#external_Node)</code> | A plain Node or if a Component is passed, the outerNode. |

<a name="module_domv/lib/Component--Component+siblingAfter"></a>
#### htmlDocument.siblingAfter(...node_) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
Add a sibling node after the outer node. (which will become the outer node's nextSibling)

**Kind**: instance method of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
**Returns**: <code>[Component](#exp_module_domv/lib/Component--Component)</code> - this  
**Throws**:

- <code>[domv/lib/Exception](#module_domv/lib/Exception)</code> Will throw if this Component does not support child nodes.


| Param | Type | Description |
| --- | --- | --- |
| ...node_ | <code>[domv/lib/Component](#module_domv/lib/Component)</code> &#124; <code>[Node](#external_Node)</code> | A plain Node or if a Component is passed, the outerNode. |

<a name="module_domv/lib/Component--Component+removeNode"></a>
#### htmlDocument.removeNode() ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
Removes the outer node from its parentNode.

**Kind**: instance method of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
**Returns**: <code>[Component](#exp_module_domv/lib/Component--Component)</code> - this  
<a name="module_domv/lib/Component--Component+removeChildren"></a>
#### htmlDocument.removeChildren() ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
Removes the all the children of the inner node

**Kind**: instance method of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
**Returns**: <code>[Component](#exp_module_domv/lib/Component--Component)</code> - this  
<a name="module_domv/lib/Component--Component+addClass"></a>
#### htmlDocument.addClass(...cls) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
Add classNames on the outer node.

**Kind**: instance method of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
**Returns**: <code>[Component](#exp_module_domv/lib/Component--Component)</code> - this  
**Throws**:

- <code>[domv/lib/Exception](#module_domv/lib/Exception)</code> If the outer node of this Component does not support attributes;


| Param | Type | Description |
| --- | --- | --- |
| ...cls | <code>string</code> | The classNames to add |

<a name="module_domv/lib/Component--Component+removeClass"></a>
#### htmlDocument.removeClass(...cls) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
Remove classNames from the outer node.

**Kind**: instance method of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
**Returns**: <code>[Component](#exp_module_domv/lib/Component--Component)</code> - this  
**Throws**:

- <code>[domv/lib/Exception](#module_domv/lib/Exception)</code> If the outer node of this Component does not support attributes;


| Param | Type | Description |
| --- | --- | --- |
| ...cls | <code>string</code> | The classNames to remove |

<a name="module_domv/lib/Component--Component+hasClass"></a>
#### htmlDocument.hasClass(...cls) ⇒ <code>boolean</code>
Does the outer node contain all of the given classNames?

**Kind**: instance method of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  

| Param | Type | Description |
| --- | --- | --- |
| ...cls | <code>string</code> | The classNames to check. |

<a name="module_domv/lib/Component--Component+assertHasClass"></a>
#### htmlDocument.assertHasClass(...cls)
Does the outer node contain all of the given classNames?

**Kind**: instance method of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
**Throws**:

- <code>[domv/lib/Exception](#module_domv/lib/Exception)</code> If the outer node of this Component does not contain all of the given classNames


| Param | Type | Description |
| --- | --- | --- |
| ...cls | <code>string</code> | The classNames to check. |

<a name="module_domv/lib/Component--Component+toggleClass"></a>
#### htmlDocument.toggleClass(cls, force) ⇒ <code>boolean</code>
Toggle a className on the outer node.

**Kind**: instance method of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
**Throws**:

- <code>[domv/lib/Exception](#module_domv/lib/Exception)</code> If the outer node of this Component does not support attributes


| Param | Type | Description |
| --- | --- | --- |
| cls | <code>string</code> | The className to toggle |
| force | <code>boolean</code> | If set, force the class name to be added (true) or removed (false). |

<a name="module_domv/lib/Component--Component+attr"></a>
#### htmlDocument.attr(name, value) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
Set/unset an attribute on the outer node.

**Kind**: instance method of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
**Returns**: <code>[Component](#exp_module_domv/lib/Component--Component)</code> - this  
**Throws**:

- <code>[domv/lib/Exception](#module_domv/lib/Exception)</code> If the outer node of this Component does not support attributes;


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> &#124; <code>Object.&lt;string, string&gt;</code> | The attribute name to unset/set.        Or an object of key value pairs which sets multiple attributes at the same time,        in this case "value" should not be set. |
| value | <code>string</code> &#124; <code>boolean</code> | The value to set.        Use boolean false or null to unset the attribute. Use boolean true to set a boolean attribute (e.g. checked="checked"). |

<a name="module_domv/lib/Component--Component+getAttr"></a>
#### htmlDocument.getAttr(name) ⇒ <code>string</code>
Get the value of a single attribute of the outer node.

**Kind**: instance method of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
**Returns**: <code>string</code> - The attribute value  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The attribute name to get. |

<a name="module_domv/lib/Component--Component+selector"></a>
#### htmlDocument.selector(selector, [ComponentConstructor]) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
Returns the first element, or null, that matches the specified selector(s).
(applied on the inner node)

**Kind**: instance method of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| selector | <code>string</code> &#124; <code>Array.&lt;string&gt;</code> |  | A single selector (without a group) or an array of selectors for a selector group |
| [ComponentConstructor] | <code>function</code> | <code>module:domv/lib/Component</code> | The constructor to         use to wrap the result Node, by default the Node is wrapped in a plain Component,         but it is also possible to specify your own constructor. |

<a name="module_domv/lib/Component--Component+assertSelector"></a>
#### htmlDocument.assertSelector(selector, [ComponentConstructor]) ⇒ <code>[Component](#exp_module_domv/lib/Component--Component)</code>
Returns the first element that matches the specified selector(s).
(applied on the inner node)

**Kind**: instance method of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
**Throws**:

- <code>[domv/lib/Exception](#module_domv/lib/Exception)</code> If no element was found


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| selector | <code>string</code> &#124; <code>Array.&lt;string&gt;</code> |  | A single selector (without a group) or an array of selectors for a selector group |
| [ComponentConstructor] | <code>function</code> | <code>module:domv/lib/Component</code> | The constructor to         use to wrap the result Node, by default the Node is wrapped in a plain Component,         but it is also possible to specify your own constructor. |

<a name="module_domv/lib/Component--Component+selectorAll"></a>
#### htmlDocument.selectorAll(selector, [ComponentConstructor]) ⇒ <code>[Array.&lt;Component&gt;](#exp_module_domv/lib/Component--Component)</code>
Returns a list of all elements that matches the specified selector(s).
(applied on the inner node)

**Kind**: instance method of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| selector | <code>string</code> &#124; <code>Array.&lt;string&gt;</code> |  | A single selector (without a group) or an array of selectors for a selector group |
| [ComponentConstructor] | <code>function</code> | <code>module:domv/lib/Component</code> | The constructor to         use to wrap the resulting Nodes, by default the Nodes are wrapped in a plain Component,         but it is also possible to specify your own constructor. |

<a name="module_domv/lib/Component--Component+adoptAllAttributes"></a>
#### htmlDocument.adoptAllAttributes(from)
Copy all attributes from the given element to our outer node.

**Kind**: instance method of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
**Throws**:

- <code>[domv/lib/Exception](#module_domv/lib/Exception)</code> If the outer node or the given element is not an element


| Param | Type | Description |
| --- | --- | --- |
| from | <code>[domv/lib/Component](#module_domv/lib/Component)</code> &#124; <code>[Element](#external_Element)</code> | A DOM Element or if a Component is passed, the outerNode. |

<a name="module_domv/lib/Component--Component+swapNode"></a>
#### htmlDocument.swapNode(node)
Move over all child nodes of the inner node to the given "node" and replace
the outer node with the given "node".

**Kind**: instance method of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
**Throws**:

- <code>[domv/lib/Exception](#module_domv/lib/Exception)</code> If the outer node or the given element is not an element


| Param | Type | Description |
| --- | --- | --- |
| node | <code>Element</code> &#124; <code>[domv/lib/Component](#module_domv/lib/Component)</code> | The node to replace our outer node with. If not set, the children of our inner node are added to the parent of the outer node. |

**Example**  
```js
var container = document.createElement('div');
container.innerHTML = '<section>abc<p>def<strong>ghj</strong>klm</p>nop</section>';
domv.wrap(container).selector('p').swap(document.createElement('h1'));
console.log(container.innerHTML);
//  '<section>abc<h1>def<strong>ghj</strong>klm</h1>nop</section>'
```
<a name="module_domv/lib/Component--Component+isAllWhiteSpace"></a>
#### htmlDocument.isAllWhiteSpace([checkChildElements]) ⇒ <code>boolean</code>
Does the innerNode (and its (grand)children) of this component only consist of whitespace?
Text nodes that only consist of spaces, newlines and horizontal tabs are whitespace.
Comment nodes are whitespace.
Empty text, comment, element nodes are whitespace.
Certain content elements such as for example img, video, input, etc are not whitespace.

**Kind**: instance method of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [checkChildElements] | <code>boolean</code> | <code>false</code> | If false any element node (e.g. an empty div) that is        encountered will fail the whitespace check. If true those elements are checked recursively        for whitepspace |

<a name="module_domv/lib/Component--Component+stringifyAsHtml"></a>
#### htmlDocument.stringifyAsHtml() ⇒ <code>string</code>
Stringify the outerNode and all its children as html markup.

**Kind**: instance method of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
**Overrides:** <code>[stringifyAsHtml](#module_domv/lib/Component--Component+stringifyAsHtml)</code>  
<a name="module_domv/lib/Component--Component+sendResponseAsHtml"></a>
#### htmlDocument.sendResponseAsHtml(response)
Stringify the outerNode and all its children as html markup, and send it
as a http response in node.js with the proper Content-Type and Content-Length.
Other headers can be set by calling setHeader() on the response before calling
this method. The status code can be set by setting response.statusCode in the same
fashion (the default is 200).
This method uses this.stringifyAsHtml() to generate the markup (which can be
overridden).

**Kind**: instance method of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  

| Param | Type |
| --- | --- |
| response | <code>[ServerResponse](#external_ServerResponse)</code> | 

<a name="module_domv/lib/Component--Component+splice"></a>
#### htmlDocument.splice()
This method does nothing, it is used so that firebug and chrome displays Component objects as an array.
This method is not used by this library, feel free to override this method.

**Kind**: instance method of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
<a name="module_domv/lib/Component--Component+updateConsoleHack"></a>
#### htmlDocument.updateConsoleHack()
<p>Called whenever an inner/outer node changes.
This enables pretty formatting of Component instances in the firebug and chrome console.</p>

<p>Firebug will display instances as:</p>
<code>"Object["BaseDocument", html.BaseDocument, div.content]"</code>
<!-- "Object" is the value of [[Class]] -->


<p>Chrome will display instances as:</p>
<code>["BaseDocument", &lt;html class=​"BaseDocument"&gt;​...​&lt;/html&gt;​, &lt;div class=​"content"&gt;​…&lt;/div&gt;​...​&lt;/div&gt;​]</code>

<p>This hack works by setting the attributes "length", "0", "1" and "2" ("splice" is set on the prototype also).
   Override this method to do nothing in your subclass to disable this hack.</p>

**Kind**: instance method of <code>[HtmlDocument](#exp_module_domv/lib/HtmlDocument--HtmlDocument)</code>  
