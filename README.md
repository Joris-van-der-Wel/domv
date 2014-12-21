domv
====
Create views as components using DOM. Run the same code on the browser and on the server.

1. [Introduction](#introduction)
2. [For servers](#for-servers)
3. [For browsers](#for-browsers)
4. [Tutorial](#tutorial)
  1. [Creating a Component](#creating-a-component)
  2. [Subclassing](#subclassing)
  3. [HtmlDocument](#htmldocument)
5. [Modules](#modules)
6. [API Reference](#api-reference)

Introduction
------------
This is a library that helps you create your _html_ documents using plain javascript, instead of using a template language. No need to learn yet another language with new syntax. Using _domv_ you can easily break up your page design into smaller components and reuse them in other projects.

In most templating languages reusability is hard because once the _html_ is generated, you can no longer modify it easily. In _domv_, each component you create or use is a proper OOP class which can be subclassed or modified by calling methods or using setters. After you have set up all your components you can serialize them to html markup.

It should also help reduce [coupling](https://en.wikipedia.org/wiki/Coupling_%28computer_programming%29) in your application. This is because the Components are more clearly separated from each other, there is less dependency between them.

Security is another benefit, user input is not parsed as HTML unless you explicitly want it to be.

This library has unit tests with 100% branch coverage. You can also run this test suite in the various browsers.

For servers
-----------
If you would like to use _domv_ on your server using [node.js](http://nodejs.org/) or [io.js](http://iojs.org/) you need to install _domv_ for your project first:

```shell
npm install domv inherits --save
```

You will then need to obtain a DOM `Document`, _domv_ has a convenience function to create this for you using _[jsdom](https://www.npmjs.com/package/jsdom)_:

```javascript
var domv = require('domv');
var document = domv.createHtmlDomDocument();
```

For browsers
------------
If you would like to use _domv_ in a web browser, you can use one of two methods.

If you are already using [browserify](https://www.npmjs.com/package/browserify) for your project, you can simply require _domv_:

```javascript
var domv = require('domv');
```

Or you can generate an [UMD bundle](http://dontkry.com/posts/code/browserify-and-the-universal-module-definition.html):

```shell
npm install domv
cd node_modules/domv
npm run bundle
```

This will generate a javascript file for you in `build/domv.js`, here's an example on using it:

```html
<!DOCTYPE html>
<html>
    <head>
        <script src="domv.js"></script>
        <script>
        (function(document, domv)
        {
             var image = domv.create(document, 'img', {src: 'foo.jpg'});
             // ...
        } (window.document, window.domv));
        </script>
    </head>
    <body>
    </body>
</html>
```

Tutorial
--------
### Creating a Component
Now that you have obtained a DOM `Document` and have access to the _domv_ module, you can create new Components. When using the _domv_ API you do not have to worry about which browser or server your code is running in.

The most important part of _domv_ is the `Component` class. This example shows how you can create one:

```javascript
var domv = require('domv');
var image = domv.create(document, 'img', {src: 'foo.jpg', width: 200, height: 100});
console.log(image.stringifyAsHtml());
// <img src="foo.jpg" height="100" width="200">
```

Or you can use a convenient shorthand:

```javascript
var domv = require('domv');
var div = domv.shorthand(document, 'div');
var img = domv.shorthand(document, 'img');
var component = div('columns',
    div('left', 'This is the left column!'),
    div('right',
        'This is the right column...',
        img({src: 'foo.jpg', width: 200, height: 100})
    )
);
console.log(component.stringifyAsHtml());
// <div class="columns"><div class="left">This is the left column!</div>
// <div class="right">This is the right column...
// <img src="foo.jpg" height="100" width="200"></div></div>
```

Each `Component` actually wraps a DOM `Node`. This is useful to overcome differences between browsers and _jsdom_, however the real strength is that it lets you create subclasses of `Component` (more on that [later](#subclassing)). Here is an example on wrapping:

```javascript
var body = domv.wrap(document.body);
console.log(body !== document.body); // true
console.log(body.outerNode === document.body); // true
```

Note that `domv.wrap` will always create a new `Component` (this is by design):

```javascript
var body = domv.wrap(document.body);
var body2 = domv.wrap(document.body);
console.log(body !== body2); // true
console.log(body.outerNode === body2.outerNode); // true
```

### Subclassing
Subclassing `Component` is what makes _domv_ useful. A `Component` wraps a DOM `Node` and by doing so it gives you a stable API to modify the DOM with. When browsers introduce new features, your old Components will still use the same stable API without any clashes in attributes or method names. A lot of DOM methods are proxied with some extra flavoring (such as`appendChild`, `childNodes`, etc).

Here is an example:
```javascript
// AuthorInfo.js
'use strict';
var domv = require('domv');

// the constructor for AuthorInfo
function AuthorInfo(node, author)
{
    // call the constructor of our super class
    domv.Component.call(this, node, 'div');

    if (this.isCreationConstructor(node))
    {
        var img = this.shorthand('img');
        var h2 = this.shorthand('h2');
        var a = this.shorthand('a');
        var p = this.shorthand('p');
        var text = this.textShorthand();

        this.cls('AuthorInfo');

        this.attr('data-id', author.id);

        this.appendChild(
            this.avatar = img('avatar', { src: author.avatarUrl }),
            this.name = h2('name',
                this.nameLink = a(
                    { href: '/author/' + encodeURIComponent(author.id) },
                    text(author.displayName)
                )
            ),
            this.introduction = p('introduction',
                'about me: ',
                text(author.introduction)
            )
        );
    }
    else // wrapping constructor
    {
        // assertHasClass and assertSelector are used to throw an
        // Error in case invalid content is given to this constructor
        this.assertHasClass('AuthorInfo');
        this.avatar = this.assertSelector('> .avatar');
        this.name = this.assertSelector('> .name');
        this.nameLink = this.name.assertSelector('> a');
        this.introduction = this.assertSelector('> .introduction');
    }

    // Add a DOM event listener
    this.on('click', this._onclick);
}

module.exports = AuthorInfo;

// "inherits" module provides prototype chaining
require('inherits')(AuthorInfo, domv.Component);

Object.defineProperty(AuthorInfo.prototype, 'id', {
    get: function()
    {
        return this.getAttr('data-id');
    }
});

Object.defineProperty(AuthorInfo.prototype, 'displayName', {
    get: function()
    {
        return this.nameLink.textContent;
    },
    set: function(val)
    {
        this.nameLink.textContent = val;
    }
});

AuthorInfo.prototype._onclick = function(e)
{
    this.toggleClass('highlighted');
};
```

_(If you are using IntelliJ or WebStorm, there is a [File Template](https://github.com/Joris-van-der-Wel/domv/blob/master/domv-Component.js.vm) you can import)_

The constructor of a `Component` subclass must always accept a `node` argument as its first argument (a DOM `Node`). If this argument is a `Document` the Component must create new DOM elements and attributes.

As a rule of thumb, the outer element of a Component always has a class attribute that contains the name of the Component (beginning with a capital letter). Any other class name begins with a lowercase letter. This is import because it lets you easily debug where generated HTML came from, and it is also important when making sure your CSS rules only match your own Component.

```javascript
var domv = require('domv');
var AuthorInfo = require('./AuthorInfo');
var body = domv.wrap(document.body);

var author = {
    id: 500,
    avatarUrl: 'someone.jpg',
    displayName: 'Someone',
    introduction: 'Hi! I am someone!!!'
};

var authorComponent = new AuthorInfo(document, author);
body.appendChild(authorComponent);
```

This results in the following HTML:

```HTML
<div class="AuthorInfo" data-id="500">
    <img src="someone.jpg" class="avatar">
    <h2 class="name">
        <a href="/author/500">Someone</a>
    </h2>
    <p class="introduction">about me: Hi! I am someone!!!</p>
</div>
```

If the `node` argument is a different kind of `Node`, usually an `Element`, the Component must wrap existing content:

```javascript
var domv = require('domv');
var AuthorInfo = require('./AuthorInfo');
var body = domv.wrap(document.body);

var element = body.selector('> .AuthorInfo');
var authorComponent = new AuthorInfo(element);
authorComponent.displayName = 'I just renamed myself!';
```

The wrapping constructor is especially useful if you would like to modify the DOM in the browser after having received HTML from the server.

### Outer and Inner nodes
Each `Component` has an "outer" node and an "inner" node. You can access these nodes by using the `outerNode` and `innerNode` attributes. For most components `innerNode` and `outerNode` refer to the same `Node`. But you can set them to something different anytime (usually in the constructor).

The `outerNode` is used whenever you make a change to DOM attributes. Also, if a child Component is added to a parent Component, the `outerNode` of the child is used.

The `innerNode` is used to add any children and is also used for getters such as `childNodes`, `firstChild`, etc.

```javascript
var domv = require('domv');
var document = domv.wrap(domv.createHtmlDomDocument());
var foo = document.create('div', 'outer');
var fooInner = document.create('div', 'inner');
foo.appendChild(fooInner);
foo.innerNode = fooInner;
foo.attr('data-example', 'This is set on the outer node!');
var bar = document.create('span', '', 'I am a span');
foo.appendChild(bar);
console.log(foo.stringifyAsHtml());
```

Result:

```html
<div class="outer" data-example="This is set on the outer node!">
    <div class="inner">
        <span>I am a span</span>
    </div>
</div>
```

### HtmlDocument
`HtmlDocument` is a `Component` subclass which lets you create or wrap a html document. This includes the _html_, _head_, _title_ and _body_ elements, but it also provides a number of convenient methods to easily add style, script elements and JSON data.  Unlike normal Components the `node` argument in HtmlDocument is optional, if not given, a new `Document` is constructed for you.

```javascript
var domv = require('domv');
var author = {
    id: 500,
    avatarUrl: 'someone.jpg',
    displayName: 'Someone',
    introduction: 'Hi! I am someone!!!'
};

var html = new domv.HtmlDocument();
html.title = 'This is my page title';
html.baseURI = 'http://example.com/foo';
html.appendChild(html.create('p', 'myParagraph', 'This paragraph is added to the body'));
html.appendChild(new AuthorInfo(html.document, author));
html.addCSS('/my-bundle.css');
html.addJS('/my-bundle.js');
html.addJSONData('user-session', {userId: 1, name: 'root'});
console.log(html.stringifyAsHtml());
```

This gives you:

```html
<!DOCTYPE html>
<html>
    <head>
        <base href="http://example.com/foo">
        <title>This is my page title</title>
        <link href="/my-bundle.css" rel="stylesheet" type="text/css">
        <script async="async" src="/my-bundle.js" type="text/javascript"></script>
        <script data-identifier="user-session" type="application/json">
            {"userId":1,"name":"root"}
        </script>
    </head>
    <body>
        <p class="myParagraph">This paragraph is added to the body</p>
        <div data-id="500" class="AuthorInfo">
            <img src="someone.jpg" class="avatar">
            <h2 class="name"><a href="/author/500">Someone</a></h2>
            <p class="introduction">about me: Hi! I am someone!!!</p>
        </div>
    </body>
</html>
```

And this is an example with wrapping:

```javascript
var domv = require('domv');
var html = new domv.HtmlDocument(document.documentElement);
html.title = 'A new title!';
var session = html.getJSONData('user-session');
console.log('My user id is', session.userId, 'And my name is', session.name);
var authorInfo = html.assertSelector('> .AuthorInfo', AuthorInfo);
console.log('display name of the author you are viewing:', authorInfo.displayName);
```

Modules
-------
Because this is all just plain javascript, it is easy to [publish](https://docs.npmjs.com/getting-started/publishing-npm-packages) your `Component` as a [node module](https://docs.npmjs.com/getting-started/creating-node-modules) on [npm](https://www.npmjs.com/). This works especially well when you use [browserify](https://www.npmjs.com/package/browserify).

Most Components also need some CSS to function properly. For this purpose [stylerefs](https://www.npmjs.com/package/stylerefs) is a good solution. It lets you list the CSS or LESS files your Component needs in the source code using a require call:

```javascript
'use strict';
var domv = require('domv');

require('static-reference')('./AuthorInfo.less', 'optional', 'filter', 'keywords');

// the constructor for AuthorInfo
function AuthorInfo(node, author)
{
        // call the constructor of our super class
        domv.Component.call(this, node, 'div');

        if (this.isCreationConstructor(node))
        {

        ... SNIP ...
```

This works a lot like browserify. You simply point the `stylerefs` command line tool to your code and it will recursively analyze all the `require()` calls in your app in order to find the CSS / LESS files that you need. You can use the output of this tool to generate a single CSS bundle file. (instead of the command line tool you can also use grunt. Look at the [stylerefs](https://www.npmjs.com/package/stylerefs) documentation for more details.


API Reference
=============
Generated by jsdoc:

**Modules**

* [domv/lib/Component](#module_domv/lib/Component)
  * [class: Component ⏏](#exp_module_domv/lib/Component)
    * [new Component(node, [defaultNodeName], [wrapDocument])](#exp_new_module_domv/lib/Component)
    * [domv/lib/Component.document](#module_domv/lib/Component#document)
    * [domv/lib/Component.outerNode](#module_domv/lib/Component#outerNode)
    * [domv/lib/Component.outerNodeWrapped](#module_domv/lib/Component#outerNodeWrapped)
    * [domv/lib/Component.innerNode](#module_domv/lib/Component#innerNode)
    * [domv/lib/Component.innerNodeWrapped](#module_domv/lib/Component#innerNodeWrapped)
    * [domv/lib/Component.style](#module_domv/lib/Component#style)
    * [domv/lib/Component.children](#module_domv/lib/Component#children)
    * [domv/lib/Component.childrenIndex](#module_domv/lib/Component#childrenIndex)
    * [domv/lib/Component.childNodes](#module_domv/lib/Component#childNodes)
    * [domv/lib/Component.childNodesIndex](#module_domv/lib/Component#childNodesIndex)
    * [domv/lib/Component.isEmpty](#module_domv/lib/Component#isEmpty)
    * [domv/lib/Component.firstChild](#module_domv/lib/Component#firstChild)
    * [domv/lib/Component.lastChild](#module_domv/lib/Component#lastChild)
    * [domv/lib/Component.firstElementChild](#module_domv/lib/Component#firstElementChild)
    * [domv/lib/Component.lastElementChild](#module_domv/lib/Component#lastElementChild)
    * [domv/lib/Component.nextSibling](#module_domv/lib/Component#nextSibling)
    * [domv/lib/Component.previousSibling](#module_domv/lib/Component#previousSibling)
    * [domv/lib/Component.nextElementSibling](#module_domv/lib/Component#nextElementSibling)
    * [domv/lib/Component.previousElementSibling](#module_domv/lib/Component#previousElementSibling)
    * [domv/lib/Component.parentNode](#module_domv/lib/Component#parentNode)
    * [domv/lib/Component.textContent](#module_domv/lib/Component#textContent)
    * [domv/lib/Component.value](#module_domv/lib/Component#value)
    * [domv/lib/Component.checked](#module_domv/lib/Component#checked)
    * [domv/lib/Component.selected](#module_domv/lib/Component#selected)
    * [domv/lib/Component.outerNodeType](#module_domv/lib/Component#outerNodeType)
    * [domv/lib/Component.innerNodeType](#module_domv/lib/Component#innerNodeType)
    * [domv/lib/Component.outerNodeName](#module_domv/lib/Component#outerNodeName)
    * [domv/lib/Component.innerNodeName](#module_domv/lib/Component#innerNodeName)
    * [domv/lib/Component.isCreationConstructor(node, [wrapDocument])](#module_domv/lib/Component#isCreationConstructor)
    * [domv/lib/Component.on(event, listener, [useCapture], [thisObject])](#module_domv/lib/Component#on)
    * [domv/lib/Component.addListener(event, listener, [useCapture], [thisObject])](#module_domv/lib/Component#addListener)
    * [domv/lib/Component.removeListener(event, listener, [useCapture], [thisObject])](#module_domv/lib/Component#removeListener)
    * [domv/lib/Component.cleanup()](#module_domv/lib/Component#cleanup)
    * [domv/lib/Component.clearListeners()](#module_domv/lib/Component#clearListeners)
    * [domv/lib/Component.emit(name, [data], [bubbles], [cancelable])](#module_domv/lib/Component#emit)
    * [domv/lib/Component.isOuterNodeEqual(node)](#module_domv/lib/Component#isOuterNodeEqual)
    * [domv/lib/Component.isInnerNodeEqual(node)](#module_domv/lib/Component#isInnerNodeEqual)
    * [domv/lib/Component.isNodeEqual(node)](#module_domv/lib/Component#isNodeEqual)
    * [domv/lib/Component.create(nodeName, className, [...content])](#module_domv/lib/Component#create)
    * [domv/lib/Component.text(...text_)](#module_domv/lib/Component#text)
    * [domv/lib/Component.shorthand([tagName], ...initialAttributes)](#module_domv/lib/Component#shorthand)
    * [domv/lib/Component.textShorthand()](#module_domv/lib/Component#textShorthand)
    * [domv/lib/Component.appendChild(...node_)](#module_domv/lib/Component#appendChild)
    * [domv/lib/Component.prependChild(...node_)](#module_domv/lib/Component#prependChild)
    * [domv/lib/Component.siblingBefore(...node_)](#module_domv/lib/Component#siblingBefore)
    * [domv/lib/Component.siblingAfter(...node_)](#module_domv/lib/Component#siblingAfter)
    * [domv/lib/Component.removeNode()](#module_domv/lib/Component#removeNode)
    * [domv/lib/Component.removeChildren()](#module_domv/lib/Component#removeChildren)
    * [domv/lib/Component.cls(...cls)](#module_domv/lib/Component#cls)
    * [domv/lib/Component.addClass(...cls)](#module_domv/lib/Component#addClass)
    * [domv/lib/Component.removeClass(...cls)](#module_domv/lib/Component#removeClass)
    * [domv/lib/Component.hasClass(...cls)](#module_domv/lib/Component#hasClass)
    * [domv/lib/Component.assertHasClass(...cls)](#module_domv/lib/Component#assertHasClass)
    * [domv/lib/Component.toggleClass(cls, force)](#module_domv/lib/Component#toggleClass)
    * [domv/lib/Component.attr(name, value)](#module_domv/lib/Component#attr)
    * [domv/lib/Component.getAttr(name, [json])](#module_domv/lib/Component#getAttr)
    * [domv/lib/Component.selector(selector, [componentConstructor])](#module_domv/lib/Component#selector)
    * [domv/lib/Component.assertSelector(selector, [componentConstructor])](#module_domv/lib/Component#assertSelector)
    * [domv/lib/Component.selectorAll(selector, [componentConstructor])](#module_domv/lib/Component#selectorAll)
    * [domv/lib/Component.adoptAllAttributes(from)](#module_domv/lib/Component#adoptAllAttributes)
    * [domv/lib/Component.swapNode(node)](#module_domv/lib/Component#swapNode)
    * [domv/lib/Component.isAllWhiteSpace([checkChildElements])](#module_domv/lib/Component#isAllWhiteSpace)
    * [domv/lib/Component.stringifyAsHtml()](#module_domv/lib/Component#stringifyAsHtml)
    * [domv/lib/Component.sendResponseAsHtml(response)](#module_domv/lib/Component#sendResponseAsHtml)
    * [domv/lib/Component.splice()](#module_domv/lib/Component#splice)
    * [domv/lib/Component.updateConsoleHack()](#module_domv/lib/Component#updateConsoleHack)
    * [const: domv/lib/Component.isDOMVComponent](#module_domv/lib/Component#isDOMVComponent)
* [domv/lib/Exception](#module_domv/lib/Exception)
  * [class: Exception ⏏](#exp_module_domv/lib/Exception)
    * [new Exception(wrapped)](#exp_new_module_domv/lib/Exception)
    * [const: domv/lib/Exception.isDOMVException](#module_domv/lib/Exception#isDOMVException)
* [domv/lib/HtmlDocument](#module_domv/lib/HtmlDocument)
  * [class: HtmlDocument ⏏](#exp_module_domv/lib/HtmlDocument)
    * [new HtmlDocument(node)](#exp_new_module_domv/lib/HtmlDocument)
    * [domv/lib/HtmlDocument.head](#module_domv/lib/HtmlDocument#head)
    * [domv/lib/HtmlDocument.body](#module_domv/lib/HtmlDocument#body)
    * [domv/lib/HtmlDocument.baseWrapped](#module_domv/lib/HtmlDocument#baseWrapped)
    * [domv/lib/HtmlDocument.titleWrapped](#module_domv/lib/HtmlDocument#titleWrapped)
    * [domv/lib/HtmlDocument.title](#module_domv/lib/HtmlDocument#title)
    * [domv/lib/HtmlDocument.baseURI](#module_domv/lib/HtmlDocument#baseURI)
    * [domv/lib/HtmlDocument.document](#module_domv/lib/HtmlDocument#document)
    * [domv/lib/HtmlDocument.outerNode](#module_domv/lib/HtmlDocument#outerNode)
    * [domv/lib/HtmlDocument.outerNodeWrapped](#module_domv/lib/HtmlDocument#outerNodeWrapped)
    * [domv/lib/HtmlDocument.innerNode](#module_domv/lib/HtmlDocument#innerNode)
    * [domv/lib/HtmlDocument.innerNodeWrapped](#module_domv/lib/HtmlDocument#innerNodeWrapped)
    * [domv/lib/HtmlDocument.style](#module_domv/lib/HtmlDocument#style)
    * [domv/lib/HtmlDocument.children](#module_domv/lib/HtmlDocument#children)
    * [domv/lib/HtmlDocument.childrenIndex](#module_domv/lib/HtmlDocument#childrenIndex)
    * [domv/lib/HtmlDocument.childNodes](#module_domv/lib/HtmlDocument#childNodes)
    * [domv/lib/HtmlDocument.childNodesIndex](#module_domv/lib/HtmlDocument#childNodesIndex)
    * [domv/lib/HtmlDocument.isEmpty](#module_domv/lib/HtmlDocument#isEmpty)
    * [domv/lib/HtmlDocument.firstChild](#module_domv/lib/HtmlDocument#firstChild)
    * [domv/lib/HtmlDocument.lastChild](#module_domv/lib/HtmlDocument#lastChild)
    * [domv/lib/HtmlDocument.firstElementChild](#module_domv/lib/HtmlDocument#firstElementChild)
    * [domv/lib/HtmlDocument.lastElementChild](#module_domv/lib/HtmlDocument#lastElementChild)
    * [domv/lib/HtmlDocument.nextSibling](#module_domv/lib/HtmlDocument#nextSibling)
    * [domv/lib/HtmlDocument.previousSibling](#module_domv/lib/HtmlDocument#previousSibling)
    * [domv/lib/HtmlDocument.nextElementSibling](#module_domv/lib/HtmlDocument#nextElementSibling)
    * [domv/lib/HtmlDocument.previousElementSibling](#module_domv/lib/HtmlDocument#previousElementSibling)
    * [domv/lib/HtmlDocument.parentNode](#module_domv/lib/HtmlDocument#parentNode)
    * [domv/lib/HtmlDocument.textContent](#module_domv/lib/HtmlDocument#textContent)
    * [domv/lib/HtmlDocument.value](#module_domv/lib/HtmlDocument#value)
    * [domv/lib/HtmlDocument.checked](#module_domv/lib/HtmlDocument#checked)
    * [domv/lib/HtmlDocument.selected](#module_domv/lib/HtmlDocument#selected)
    * [domv/lib/HtmlDocument.outerNodeType](#module_domv/lib/HtmlDocument#outerNodeType)
    * [domv/lib/HtmlDocument.innerNodeType](#module_domv/lib/HtmlDocument#innerNodeType)
    * [domv/lib/HtmlDocument.outerNodeName](#module_domv/lib/HtmlDocument#outerNodeName)
    * [domv/lib/HtmlDocument.innerNodeName](#module_domv/lib/HtmlDocument#innerNodeName)
    * [domv/lib/HtmlDocument.addCSS(href, media)](#module_domv/lib/HtmlDocument#addCSS)
    * [domv/lib/HtmlDocument.addJS(href, [async])](#module_domv/lib/HtmlDocument#addJS)
    * [domv/lib/HtmlDocument.addJSONData(identifier, data)](#module_domv/lib/HtmlDocument#addJSONData)
    * [domv/lib/HtmlDocument.getJSONData(identifier)](#module_domv/lib/HtmlDocument#getJSONData)
    * [domv/lib/HtmlDocument.isCreationConstructor(node, [wrapDocument])](#module_domv/lib/HtmlDocument#isCreationConstructor)
    * [domv/lib/HtmlDocument.on(event, listener, [useCapture], [thisObject])](#module_domv/lib/HtmlDocument#on)
    * [domv/lib/HtmlDocument.addListener(event, listener, [useCapture], [thisObject])](#module_domv/lib/HtmlDocument#addListener)
    * [domv/lib/HtmlDocument.removeListener(event, listener, [useCapture], [thisObject])](#module_domv/lib/HtmlDocument#removeListener)
    * [domv/lib/HtmlDocument.cleanup()](#module_domv/lib/HtmlDocument#cleanup)
    * [domv/lib/HtmlDocument.clearListeners()](#module_domv/lib/HtmlDocument#clearListeners)
    * [domv/lib/HtmlDocument.emit(name, [data], [bubbles], [cancelable])](#module_domv/lib/HtmlDocument#emit)
    * [domv/lib/HtmlDocument.isOuterNodeEqual(node)](#module_domv/lib/HtmlDocument#isOuterNodeEqual)
    * [domv/lib/HtmlDocument.isInnerNodeEqual(node)](#module_domv/lib/HtmlDocument#isInnerNodeEqual)
    * [domv/lib/HtmlDocument.isNodeEqual(node)](#module_domv/lib/HtmlDocument#isNodeEqual)
    * [domv/lib/HtmlDocument.create(nodeName, className, [...content])](#module_domv/lib/HtmlDocument#create)
    * [domv/lib/HtmlDocument.text(...text_)](#module_domv/lib/HtmlDocument#text)
    * [domv/lib/HtmlDocument.shorthand([tagName], ...initialAttributes)](#module_domv/lib/HtmlDocument#shorthand)
    * [domv/lib/HtmlDocument.textShorthand()](#module_domv/lib/HtmlDocument#textShorthand)
    * [domv/lib/HtmlDocument.appendChild(...node_)](#module_domv/lib/HtmlDocument#appendChild)
    * [domv/lib/HtmlDocument.prependChild(...node_)](#module_domv/lib/HtmlDocument#prependChild)
    * [domv/lib/HtmlDocument.siblingBefore(...node_)](#module_domv/lib/HtmlDocument#siblingBefore)
    * [domv/lib/HtmlDocument.siblingAfter(...node_)](#module_domv/lib/HtmlDocument#siblingAfter)
    * [domv/lib/HtmlDocument.removeNode()](#module_domv/lib/HtmlDocument#removeNode)
    * [domv/lib/HtmlDocument.removeChildren()](#module_domv/lib/HtmlDocument#removeChildren)
    * [domv/lib/HtmlDocument.cls(...cls)](#module_domv/lib/HtmlDocument#cls)
    * [domv/lib/HtmlDocument.addClass(...cls)](#module_domv/lib/HtmlDocument#addClass)
    * [domv/lib/HtmlDocument.removeClass(...cls)](#module_domv/lib/HtmlDocument#removeClass)
    * [domv/lib/HtmlDocument.hasClass(...cls)](#module_domv/lib/HtmlDocument#hasClass)
    * [domv/lib/HtmlDocument.assertHasClass(...cls)](#module_domv/lib/HtmlDocument#assertHasClass)
    * [domv/lib/HtmlDocument.toggleClass(cls, force)](#module_domv/lib/HtmlDocument#toggleClass)
    * [domv/lib/HtmlDocument.attr(name, value)](#module_domv/lib/HtmlDocument#attr)
    * [domv/lib/HtmlDocument.getAttr(name, [json])](#module_domv/lib/HtmlDocument#getAttr)
    * [domv/lib/HtmlDocument.selector(selector, [componentConstructor])](#module_domv/lib/HtmlDocument#selector)
    * [domv/lib/HtmlDocument.assertSelector(selector, [componentConstructor])](#module_domv/lib/HtmlDocument#assertSelector)
    * [domv/lib/HtmlDocument.selectorAll(selector, [componentConstructor])](#module_domv/lib/HtmlDocument#selectorAll)
    * [domv/lib/HtmlDocument.adoptAllAttributes(from)](#module_domv/lib/HtmlDocument#adoptAllAttributes)
    * [domv/lib/HtmlDocument.swapNode(node)](#module_domv/lib/HtmlDocument#swapNode)
    * [domv/lib/HtmlDocument.isAllWhiteSpace([checkChildElements])](#module_domv/lib/HtmlDocument#isAllWhiteSpace)
    * [domv/lib/HtmlDocument.stringifyAsHtml()](#module_domv/lib/HtmlDocument#stringifyAsHtml)
    * [domv/lib/HtmlDocument.sendResponseAsHtml(response)](#module_domv/lib/HtmlDocument#sendResponseAsHtml)
    * [domv/lib/HtmlDocument.splice()](#module_domv/lib/HtmlDocument#splice)
    * [domv/lib/HtmlDocument.updateConsoleHack()](#module_domv/lib/HtmlDocument#updateConsoleHack)
    * [const: domv/lib/HtmlDocument.isDOMVComponent](#module_domv/lib/HtmlDocument#isDOMVComponent)
* [domv](#module_domv)
  * [enum: domv.NodeType](#module_domv.NodeType)
    * [NodeType.ELEMENT](#module_domv.NodeType.ELEMENT)
    * [NodeType.TEXT](#module_domv.NodeType.TEXT)
    * [NodeType.PROCESSING_INSTRUCTION](#module_domv.NodeType.PROCESSING_INSTRUCTION)
    * [NodeType.COMMENT](#module_domv.NodeType.COMMENT)
    * [NodeType.DOCUMENT](#module_domv.NodeType.DOCUMENT)
    * [NodeType.DOCUMENT_TYPE](#module_domv.NodeType.DOCUMENT_TYPE)
    * [NodeType.DOCUMENT_FRAGMENT](#module_domv.NodeType.DOCUMENT_FRAGMENT)
  * [domv.isSupported(document, [checkAll])](#module_domv.isSupported)
  * [domv.isParseHTMLDocumentSupported()](#module_domv.isParseHTMLDocumentSupported)
  * [domv.mayContainChildren(node, [doThrow])](#module_domv.mayContainChildren)
  * [domv.wrap(node_, [ComponentConstructor], ...constructorArguments)](#module_domv.wrap)
  * [domv.unlive(nodeList)](#module_domv.unlive)
  * [domv.create(document_, nodeName, className, ...content)](#module_domv.create)
  * [domv.shorthand(document_, [tagName_], ...initialAttributes)](#module_domv.shorthand)
  * [domv.text(document_, ...text)](#module_domv.text)
  * [domv.createHtmlDomDocument([minimal])](#module_domv.createHtmlDomDocument)
  * [domv.parseHTMLDocument(markup, ownerDocument)](#module_domv.parseHTMLDocument)
  * [domv.parseHTMLSnippit(ownerDocument, markup)](#module_domv.parseHTMLSnippit)
  * [domv.cssStringEscape([str], [wrapInQuotes])](#module_domv.cssStringEscape)
  * [domv.isLeftMouseButton(event)](#module_domv.isLeftMouseButton)
  * [const: domv.Component](#module_domv.Component)
  * [const: domv.HtmlDocument](#module_domv.HtmlDocument)
  * [const: domv.Exception](#module_domv.Exception)

**Typedefs**

* [callback: domv/lib/CreateShortHand](#domv/lib/CreateShortHand)

<a name="module_domv/lib/Component"></a>
#domv/lib/Component
This is the super class for your components.
<p>It contains a handful of methods that simplify using the DOM.</p>

**Author**: Joris van der Wel <joris@jorisvanderwel.com>
<a name="exp_module_domv/lib/Component"></a>
##class: Component ⏏
**Members**

* [class: Component ⏏](#exp_module_domv/lib/Component)
  * [new Component(node, [defaultNodeName], [wrapDocument])](#exp_new_module_domv/lib/Component)
  * [domv/lib/Component.document](#module_domv/lib/Component#document)
  * [domv/lib/Component.outerNode](#module_domv/lib/Component#outerNode)
  * [domv/lib/Component.outerNodeWrapped](#module_domv/lib/Component#outerNodeWrapped)
  * [domv/lib/Component.innerNode](#module_domv/lib/Component#innerNode)
  * [domv/lib/Component.innerNodeWrapped](#module_domv/lib/Component#innerNodeWrapped)
  * [domv/lib/Component.style](#module_domv/lib/Component#style)
  * [domv/lib/Component.children](#module_domv/lib/Component#children)
  * [domv/lib/Component.childrenIndex](#module_domv/lib/Component#childrenIndex)
  * [domv/lib/Component.childNodes](#module_domv/lib/Component#childNodes)
  * [domv/lib/Component.childNodesIndex](#module_domv/lib/Component#childNodesIndex)
  * [domv/lib/Component.isEmpty](#module_domv/lib/Component#isEmpty)
  * [domv/lib/Component.firstChild](#module_domv/lib/Component#firstChild)
  * [domv/lib/Component.lastChild](#module_domv/lib/Component#lastChild)
  * [domv/lib/Component.firstElementChild](#module_domv/lib/Component#firstElementChild)
  * [domv/lib/Component.lastElementChild](#module_domv/lib/Component#lastElementChild)
  * [domv/lib/Component.nextSibling](#module_domv/lib/Component#nextSibling)
  * [domv/lib/Component.previousSibling](#module_domv/lib/Component#previousSibling)
  * [domv/lib/Component.nextElementSibling](#module_domv/lib/Component#nextElementSibling)
  * [domv/lib/Component.previousElementSibling](#module_domv/lib/Component#previousElementSibling)
  * [domv/lib/Component.parentNode](#module_domv/lib/Component#parentNode)
  * [domv/lib/Component.textContent](#module_domv/lib/Component#textContent)
  * [domv/lib/Component.value](#module_domv/lib/Component#value)
  * [domv/lib/Component.checked](#module_domv/lib/Component#checked)
  * [domv/lib/Component.selected](#module_domv/lib/Component#selected)
  * [domv/lib/Component.outerNodeType](#module_domv/lib/Component#outerNodeType)
  * [domv/lib/Component.innerNodeType](#module_domv/lib/Component#innerNodeType)
  * [domv/lib/Component.outerNodeName](#module_domv/lib/Component#outerNodeName)
  * [domv/lib/Component.innerNodeName](#module_domv/lib/Component#innerNodeName)
  * [domv/lib/Component.isCreationConstructor(node, [wrapDocument])](#module_domv/lib/Component#isCreationConstructor)
  * [domv/lib/Component.on(event, listener, [useCapture], [thisObject])](#module_domv/lib/Component#on)
  * [domv/lib/Component.addListener(event, listener, [useCapture], [thisObject])](#module_domv/lib/Component#addListener)
  * [domv/lib/Component.removeListener(event, listener, [useCapture], [thisObject])](#module_domv/lib/Component#removeListener)
  * [domv/lib/Component.cleanup()](#module_domv/lib/Component#cleanup)
  * [domv/lib/Component.clearListeners()](#module_domv/lib/Component#clearListeners)
  * [domv/lib/Component.emit(name, [data], [bubbles], [cancelable])](#module_domv/lib/Component#emit)
  * [domv/lib/Component.isOuterNodeEqual(node)](#module_domv/lib/Component#isOuterNodeEqual)
  * [domv/lib/Component.isInnerNodeEqual(node)](#module_domv/lib/Component#isInnerNodeEqual)
  * [domv/lib/Component.isNodeEqual(node)](#module_domv/lib/Component#isNodeEqual)
  * [domv/lib/Component.create(nodeName, className, [...content])](#module_domv/lib/Component#create)
  * [domv/lib/Component.text(...text_)](#module_domv/lib/Component#text)
  * [domv/lib/Component.shorthand([tagName], ...initialAttributes)](#module_domv/lib/Component#shorthand)
  * [domv/lib/Component.textShorthand()](#module_domv/lib/Component#textShorthand)
  * [domv/lib/Component.appendChild(...node_)](#module_domv/lib/Component#appendChild)
  * [domv/lib/Component.prependChild(...node_)](#module_domv/lib/Component#prependChild)
  * [domv/lib/Component.siblingBefore(...node_)](#module_domv/lib/Component#siblingBefore)
  * [domv/lib/Component.siblingAfter(...node_)](#module_domv/lib/Component#siblingAfter)
  * [domv/lib/Component.removeNode()](#module_domv/lib/Component#removeNode)
  * [domv/lib/Component.removeChildren()](#module_domv/lib/Component#removeChildren)
  * [domv/lib/Component.cls(...cls)](#module_domv/lib/Component#cls)
  * [domv/lib/Component.addClass(...cls)](#module_domv/lib/Component#addClass)
  * [domv/lib/Component.removeClass(...cls)](#module_domv/lib/Component#removeClass)
  * [domv/lib/Component.hasClass(...cls)](#module_domv/lib/Component#hasClass)
  * [domv/lib/Component.assertHasClass(...cls)](#module_domv/lib/Component#assertHasClass)
  * [domv/lib/Component.toggleClass(cls, force)](#module_domv/lib/Component#toggleClass)
  * [domv/lib/Component.attr(name, value)](#module_domv/lib/Component#attr)
  * [domv/lib/Component.getAttr(name, [json])](#module_domv/lib/Component#getAttr)
  * [domv/lib/Component.selector(selector, [componentConstructor])](#module_domv/lib/Component#selector)
  * [domv/lib/Component.assertSelector(selector, [componentConstructor])](#module_domv/lib/Component#assertSelector)
  * [domv/lib/Component.selectorAll(selector, [componentConstructor])](#module_domv/lib/Component#selectorAll)
  * [domv/lib/Component.adoptAllAttributes(from)](#module_domv/lib/Component#adoptAllAttributes)
  * [domv/lib/Component.swapNode(node)](#module_domv/lib/Component#swapNode)
  * [domv/lib/Component.isAllWhiteSpace([checkChildElements])](#module_domv/lib/Component#isAllWhiteSpace)
  * [domv/lib/Component.stringifyAsHtml()](#module_domv/lib/Component#stringifyAsHtml)
  * [domv/lib/Component.sendResponseAsHtml(response)](#module_domv/lib/Component#sendResponseAsHtml)
  * [domv/lib/Component.splice()](#module_domv/lib/Component#splice)
  * [domv/lib/Component.updateConsoleHack()](#module_domv/lib/Component#updateConsoleHack)
  * [const: domv/lib/Component.isDOMVComponent](#module_domv/lib/Component#isDOMVComponent)

<a name="exp_new_module_domv/lib/Component"></a>
###new Component(node, [defaultNodeName], [wrapDocument])
Each Component has two constructors, one is used to wrap existing DOM nodes, the other is used to create new
elements. Both constructors should result in the same DOM structure.

Which constructor is used depends on the type of the node argument,
[isCreationConstructor](#module_domv/lib/Component#isCreationConstructor) is used to test for this. A DOCUMENT_NODE will result in the
creation constructor, any other node will result in the wrapping constructor.

Any subclass should accept a Node as their first argument in their constructors. This library does not care about
any other argument in your constructors.

**Params**

- node <code>[Node](#external_Node)</code> | <code>[domv/lib/Component](#module_domv/lib/Component)</code> - Any kind of node or a component with an outerNode,this
       parameter determines which constructor is used using [isCreationConstructor](#module_domv/lib/Component#isCreationConstructor).
- \[defaultNodeName='div'\] `string` - If the creation constructor is used, this will be the tag that gets used to create
       the default element. This is a convenience for subclasses.
- \[wrapDocument=false\] `boolean` - <p>Used by [wrap](#module_domv.wrap)</p>
<p>If false, passing a DOCUMENT_NODE as
"node" will result in an empty tag being created instead of wrapping the DOCUMENT_NODE. This behaviour is more
convenient when subclassing Component because it lets you treat subclasses and subsubclasses in the same way.
<em>(e.g. the subclass Menu adds the class 'Menu' and common menu items. The subsubclass EventMenu adds the class
'EventMenu' and further event menu items.)</em>
</p>
<p>If true, a document will always wrap.</p>

**Type**: [domv/lib/Exception](#module_domv/lib/Exception)
**Example**
new Component(document.createElement('p')); // wraps a "p" element

**Example**
new Component(document); // Creates an empty "div" element as a default

**Example**
new Component(document, true); // Wraps the Document Node instead of creating
        an empty "div"

<a name="module_domv/lib/Component#document"></a>
###domv/lib/Component.document
The Document Node that the nodes of this Component are associated with.

**Type**: [Document](#external_Document)
<a name="module_domv/lib/Component#outerNode"></a>
###domv/lib/Component.outerNode
The "outer" DOM Node for this component.
<p>This node is used to apply attributes or when adding this
   component as the child of another.</p>
<p>This property is usually set by the Component constructor</p>

**Type**: [Node](#external_Node)
<a name="module_domv/lib/Component#outerNodeWrapped"></a>
###domv/lib/Component.outerNodeWrapped
The outer DOM node wrapped as a new component.

**Type**: [domv/lib/Component](#module_domv/lib/Component)
<a name="module_domv/lib/Component#innerNode"></a>
###domv/lib/Component.innerNode
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

**Type**: [Node](#external_Node)
<a name="module_domv/lib/Component#innerNodeWrapped"></a>
###domv/lib/Component.innerNodeWrapped
The inner DOM node wrapped as a new component.

**Type**: [domv/lib/Component](#module_domv/lib/Component)
<a name="module_domv/lib/Component#style"></a>
###domv/lib/Component.style
The inline style for the outer node.

**Type**: [CSSStyleDeclaration](#external_CSSStyleDeclaration)
<a name="module_domv/lib/Component#children"></a>
###domv/lib/Component.children
The (wrapped) child elements of the inner node.
The returned list is not live.

**Type**: [Array.&lt;domv/lib/Component&gt;](#module_domv/lib/Component)
<a name="module_domv/lib/Component#childrenIndex"></a>
###domv/lib/Component.childrenIndex
The index of the outerNode in the "children" attribute of the parentNode.

**Type**: `int`
**Example**
myParent.children[3].childrenIndex === 3

<a name="module_domv/lib/Component#childNodes"></a>
###domv/lib/Component.childNodes
The (wrapped) child nodes of the inner node.
The returned list is not live.

**Type**: [Array.&lt;domv/lib/Component&gt;](#module_domv/lib/Component)
<a name="module_domv/lib/Component#childNodesIndex"></a>
###domv/lib/Component.childNodesIndex
The index of the outerNode in the "childNodes" attribute of the parentNode.

**Type**: `int`
**Example**
myParent.childNodes[3].childNodesIndex === 3

<a name="module_domv/lib/Component#isEmpty"></a>
###domv/lib/Component.isEmpty
Is the inner node empty?
For Element nodes this means that there are 0 child nodes.
For CharacterData nodes, the text content must be of 0 length.
Other nodes are never considered empty

**Type**: `boolean`
<a name="module_domv/lib/Component#firstChild"></a>
###domv/lib/Component.firstChild
The first (wrapped) child node of the inner node.

**Type**: [domv/lib/Component](#module_domv/lib/Component)
<a name="module_domv/lib/Component#lastChild"></a>
###domv/lib/Component.lastChild
The first (wrapped) child node of the inner node.

**Type**: [domv/lib/Component](#module_domv/lib/Component)
<a name="module_domv/lib/Component#firstElementChild"></a>
###domv/lib/Component.firstElementChild
The first (wrapped) child node of the inner node that is an element.

**Type**: [domv/lib/Component](#module_domv/lib/Component)
<a name="module_domv/lib/Component#lastElementChild"></a>
###domv/lib/Component.lastElementChild
The last (wrapped) child node of the inner node that is an element.

**Type**: [domv/lib/Component](#module_domv/lib/Component)
<a name="module_domv/lib/Component#nextSibling"></a>
###domv/lib/Component.nextSibling
The next (wrapped) sibling of the outer node.

**Type**: [domv/lib/Component](#module_domv/lib/Component)
<a name="module_domv/lib/Component#previousSibling"></a>
###domv/lib/Component.previousSibling
The previous (wrapped) sibling of the outer node.

**Type**: [domv/lib/Component](#module_domv/lib/Component)
<a name="module_domv/lib/Component#nextElementSibling"></a>
###domv/lib/Component.nextElementSibling
The next (wrapped) sibling of the outer node that is an element.

**Type**: [domv/lib/Component](#module_domv/lib/Component)
<a name="module_domv/lib/Component#previousElementSibling"></a>
###domv/lib/Component.previousElementSibling
The previous (wrapped) sibling of the outer node that is an element.

**Type**: [domv/lib/Component](#module_domv/lib/Component)
<a name="module_domv/lib/Component#parentNode"></a>
###domv/lib/Component.parentNode
The (wrapped) parent node of the outer node.

**Type**: [domv/lib/Component](#module_domv/lib/Component)
<a name="module_domv/lib/Component#textContent"></a>
###domv/lib/Component.textContent
The textual content of an element and all its descendants.
Or for Text, Comment, etc nodes it represents the nodeValue.
Setting this property on an element removes all of its children
and replaces them with a single text node with the given value.

**Type**: `string`
<a name="module_domv/lib/Component#value"></a>
###domv/lib/Component.value
The value of this node. For most nodes this property is undefined, for input fields this
contains the current value. (The attribute "value" does not change by user input).

**Type**: `string`
<a name="module_domv/lib/Component#checked"></a>
###domv/lib/Component.checked
The checked state of this node. For most nodes this property is undefined, for input elements this
contains the checked state. (The attribute "checked" does not change by user input).

**Type**: `boolean`
<a name="module_domv/lib/Component#selected"></a>
###domv/lib/Component.selected
The selected state of this node. For most nodes this property is undefined, for option elements this
contains the current selected state. (The attribute "selected" does not change by user input).

**Type**: `boolean`
<a name="module_domv/lib/Component#outerNodeType"></a>
###domv/lib/Component.outerNodeType
The node type of the outer node.

**Type**: [NodeType](#module_domv.NodeType)
<a name="module_domv/lib/Component#innerNodeType"></a>
###domv/lib/Component.innerNodeType
The node type of the inner node.

**Type**: [NodeType](#module_domv.NodeType)
<a name="module_domv/lib/Component#outerNodeName"></a>
###domv/lib/Component.outerNodeName
The node name of the outer node.
(element tag names always in lowercase)

**Type**: `string`
<a name="module_domv/lib/Component#innerNodeName"></a>
###domv/lib/Component.innerNodeName
The node name of the inner node.

**Type**: `string`
<a name="module_domv/lib/Component#isCreationConstructor"></a>
###domv/lib/Component.isCreationConstructor(node, [wrapDocument])
**Params**

- node <code>[Node](#external_Node)</code> | <code>[domv/lib/Component](#module_domv/lib/Component)</code> - A DOCUMENT_NODE will result in the
creation constructor, any other node will result in the wrapping constructor. A falsy value will also result in the
creation constructor and it used in Component subclasses that know how to create their own DOCUMENT_NODE
(e.g. [domv/lib/HtmlDocument](#module_domv/lib/HtmlDocument).
- \[wrapDocument=false\] `boolean` - <p>If false, passing a DOCUMENT_NODE as "node" will result in an empty tag
being created instead of wrapping the DOCUMENT_NODE. This behaviour is more convenient when subclassing Component
because it lets you treat subclasses and subsubclasses in the same way. <em>(e.g. the subclass Menu adds the
class 'Menu' and common menu items. The subsubclass EventMenu adds the class 'EventMenu' and further event menu
items.)</em></p>
<p>If true, a document will always wrap.</p>

**Returns**: `boolean` - If thee creation constructor should be used instead of the wrapping constructor.
<a name="module_domv/lib/Component#on"></a>
###domv/lib/Component.on(event, listener, [useCapture], [thisObject])
Adds a listener to the DOM.

**Params**

- event `string`
- listener `function`
- \[useCapture=false\] `boolean` - Use the capture phase (for dom events)
- \[thisObject=this\] `*` - The this object of "listener".
       By default the "this" object of this method is used

**Type**: [domv/lib/Exception](#module_domv/lib/Exception)
**Returns**: [domv/lib/Component](#module_domv/lib/Component) - this
<a name="module_domv/lib/Component#addListener"></a>
###domv/lib/Component.addListener(event, listener, [useCapture], [thisObject])
Adds a listener to the DOM or to the internal EventEmmiter, depending on the
type of the event (see [module:domv.isDOMEvent](module:domv.isDOMEvent))

**Params**

- event `string`
- listener `function`
- \[useCapture=false\] `boolean` - Use the capture phase (for dom events)
- \[thisObject=this\] `*` - The this object of "listener".
       By default the "this" object of this method is used

**Returns**: [domv/lib/Component](#module_domv/lib/Component) - this
<a name="module_domv/lib/Component#removeListener"></a>
###domv/lib/Component.removeListener(event, listener, [useCapture], [thisObject])
Removes a listener from the DOM.
All of the parameters must equal the parameters that were used in addListener.

**Params**

- event `string`
- listener `function`
- \[useCapture=false\] `boolean`
- \[thisObject=this\] `*`

**Returns**: [domv/lib/Component](#module_domv/lib/Component) - this
<a name="module_domv/lib/Component#cleanup"></a>
###domv/lib/Component.cleanup()
Mark that this Component should perform any cleanup it wants to.
Normally a Component do not need any cleanup, however this might be needed in special circumstances.
This implementation clears all dom listeners set through this Component instance and it emits (local) the
'domv-cleanup' event.

<a name="module_domv/lib/Component#clearListeners"></a>
###domv/lib/Component.clearListeners()
Removes all (DOM) listeners from the outerNode.

<a name="module_domv/lib/Component#emit"></a>
###domv/lib/Component.emit(name, [data], [bubbles], [cancelable])
Emits a DOM custom Event on the outerNode with optional data. The listeners are passed an Event
object as their first argument which has this data set

**Params**

- name `String` - The event name, a prefix should be added to prevent name clashes with any new event names in
       web browsers. (e.g. "domv-somethinghappened"
- \[data={}\] `Object` - Key value pairs to set on the Event object
- \[bubbles=true\] `boolean`
- \[cancelable=true\] `boolean`

**Type**: [domv/lib/Exception](#module_domv/lib/Exception)
**Returns**: `boolean` - False if any of the event listeners has called preventDefault(), otherwise true
<a name="module_domv/lib/Component#isOuterNodeEqual"></a>
###domv/lib/Component.isOuterNodeEqual(node)
Is the outer DOM node equal to the given node?.
If a Component is given the outer nodes of both components must match.

**Params**

- node <code>[Node](#external_Node)</code> | <code>[domv/lib/Component](#module_domv/lib/Component)</code>

**Returns**: `boolean`
<a name="module_domv/lib/Component#isInnerNodeEqual"></a>
###domv/lib/Component.isInnerNodeEqual(node)
Is the inner DOM node equal to the given node?.
If a Component is given the inner nodes of both components must match.

**Params**

- node <code>[Node](#external_Node)</code> | <code>[domv/lib/Component](#module_domv/lib/Component)</code>

**Returns**: `boolean`
<a name="module_domv/lib/Component#isNodeEqual"></a>
###domv/lib/Component.isNodeEqual(node)
Are the outer and inner node equal to the given node?
If a Component is given the outer and inner nodes of both components must match.

**Params**

- node <code>[Node](#external_Node)</code> | <code>[domv/lib/Component](#module_domv/lib/Component)</code>

**Returns**: `boolean`
<a name="module_domv/lib/Component#create"></a>
###domv/lib/Component.create(nodeName, className, [...content])
Convenient function to create a wrapped Node including its attributes (for elements).

**Params**

- nodeName `string`
- className `string`
- \[...content\] `string` | <code>[Node](#external_Node)</code> | <code>[domv/lib/Component](#module_domv/lib/Component)</code> | `Object.<string, string>` - <p>If a string is passed, a text node is appended.</p>
       <p>If a node or component is passed, it is simply appended.</p>
       <p>If an object of key value pairs is passed, it sets those as attributes.</p>

**Type**: [domv/lib/Exception](#module_domv/lib/Exception)
**Returns**: [domv/lib/Component](#module_domv/lib/Component)
<a name="module_domv/lib/Component#text"></a>
###domv/lib/Component.text(...text_)
Creates a new wrapped TextNode.

**Params**

- ...text_ `string` - Extra arguments will be joined using a space

**Returns**: [domv/lib/Component](#module_domv/lib/Component)
**Example**
var wrappedDiv = require('domv').create(document, 'div');
var wrappedText = require('domv').text(document, 'Hi!');
wrappedDiv.appendChild(wrappedText);
console.log(wrappedDiv.outerNode.outerHTML);
// <div>Hi!</div>

<a name="module_domv/lib/Component#shorthand"></a>
###domv/lib/Component.shorthand([tagName], ...initialAttributes)
Generate a short hand function wich lets you quickly create
new elements (wrapped) including attributes.

**Params**

- \[tagName='div'\] `string`
- ...initialAttributes `string` | `Object.<string, string>` - <p>If a string is passed, a text node is appended.</p>
       <p>If an object of key value pairs is passed, it sets those as attributes
          (see [attr](#module_domv/lib/Component#attr)).</p>

**Type**: [domv/lib/Exception](#module_domv/lib/Exception)
**Returns**: [domv/lib/CreateShortHand](#domv/lib/CreateShortHand)
**Example**
var a = this.shorthand('a');
var link = a('readmore', {'href': something()}, 'Click here to readmore!');
// <a class="readmore" href="#example">Click here to readmore!</a>

<a name="module_domv/lib/Component#textShorthand"></a>
###domv/lib/Component.textShorthand()
Generate a short hand function which lets you quickly create
new text nodes (wrapped).

**Returns**: `function`
**Example**
var text = this.textShorthand();
var wraped = text('bla');
wrapped = text('foo', 'bar'); // 'foo bar'

<a name="module_domv/lib/Component#appendChild"></a>
###domv/lib/Component.appendChild(...node_)
Add a child node at the end of the inner node.

**Params**

- ...node_ <code>[domv/lib/Component](#module_domv/lib/Component)</code> | <code>[Node](#external_Node)</code> - A plain Node or if a Component is passed, the outerNode.

**Type**: [domv/lib/Exception](#module_domv/lib/Exception)
**Returns**: [domv/lib/Component](#module_domv/lib/Component) - this
<a name="module_domv/lib/Component#prependChild"></a>
###domv/lib/Component.prependChild(...node_)
Add a child node at the beginning of the inner node.

**Params**

- ...node_ <code>[domv/lib/Component](#module_domv/lib/Component)</code> | <code>[Node](#external_Node)</code> - A plain Node or if a Component is passed, the outerNode.

**Type**: [domv/lib/Exception](#module_domv/lib/Exception)
**Returns**: [domv/lib/Component](#module_domv/lib/Component) - this
<a name="module_domv/lib/Component#siblingBefore"></a>
###domv/lib/Component.siblingBefore(...node_)
Add a sibling node before the outer node. (which will become the outer node's previousSibling)

**Params**

- ...node_ <code>[domv/lib/Component](#module_domv/lib/Component)</code> | <code>[Node](#external_Node)</code> - A plain Node or if a Component is passed, the outerNode.

**Type**: [domv/lib/Exception](#module_domv/lib/Exception)
**Returns**: [domv/lib/Component](#module_domv/lib/Component) - this
<a name="module_domv/lib/Component#siblingAfter"></a>
###domv/lib/Component.siblingAfter(...node_)
Add a sibling node after the outer node. (which will become the outer node's nextSibling)

**Params**

- ...node_ <code>[domv/lib/Component](#module_domv/lib/Component)</code> | <code>[Node](#external_Node)</code> - A plain Node or if a Component is passed, the outerNode.

**Type**: [domv/lib/Exception](#module_domv/lib/Exception)
**Returns**: [domv/lib/Component](#module_domv/lib/Component) - this
<a name="module_domv/lib/Component#removeNode"></a>
###domv/lib/Component.removeNode()
Removes the outer node from its parentNode.

**Returns**: [domv/lib/Component](#module_domv/lib/Component) - this
<a name="module_domv/lib/Component#removeChildren"></a>
###domv/lib/Component.removeChildren()
Removes the all the children of the inner node

**Returns**: [domv/lib/Component](#module_domv/lib/Component) - this
<a name="module_domv/lib/Component#cls"></a>
###domv/lib/Component.cls(...cls)
Add a className on the outer node.

**Params**

- ...cls `string` - The className to add

**Type**: [domv/lib/Exception](#module_domv/lib/Exception)
**Returns**: [domv/lib/Component](#module_domv/lib/Component) - this
<a name="module_domv/lib/Component#addClass"></a>
###domv/lib/Component.addClass(...cls)
Add classNames on the outer node.

**Params**

- ...cls `string` - The classNames to add

**Type**: [domv/lib/Exception](#module_domv/lib/Exception)
**Returns**: [domv/lib/Component](#module_domv/lib/Component) - this
<a name="module_domv/lib/Component#removeClass"></a>
###domv/lib/Component.removeClass(...cls)
Remove classNames from the outer node.

**Params**

- ...cls `string` - The classNames to remove

**Type**: [domv/lib/Exception](#module_domv/lib/Exception)
**Returns**: [domv/lib/Component](#module_domv/lib/Component) - this
<a name="module_domv/lib/Component#hasClass"></a>
###domv/lib/Component.hasClass(...cls)
Does the outer node contain all of the given classNames?

**Params**

- ...cls `string` - The classNames to check.

**Returns**: `boolean`
<a name="module_domv/lib/Component#assertHasClass"></a>
###domv/lib/Component.assertHasClass(...cls)
Does the outer node contain all of the given classNames?

**Params**

- ...cls `string` - The classNames to check.

**Type**: [domv/lib/Exception](#module_domv/lib/Exception)
<a name="module_domv/lib/Component#toggleClass"></a>
###domv/lib/Component.toggleClass(cls, force)
Toggle a className on the outer node.

**Params**

- cls `string` - The className to toggle
- force `boolean` - If set, force the class name to be added (true) or removed (false).

**Type**: [domv/lib/Exception](#module_domv/lib/Exception)
**Returns**: `boolean`
<a name="module_domv/lib/Component#attr"></a>
###domv/lib/Component.attr(name, value)
Set/unset an attribute on the outer node.

**Params**

- name `string` | `Object.<string, string>` - The attribute name to unset/set.
       Or an object of key value pairs which sets multiple attributes at the same time,
       in this case "value" should not be set.
- value `string` | `boolean` - The value to set.
       Use boolean false or null to unset the attribute. Use boolean true to set a boolean attribute (e.g. checked="checked").
       If an object or array is passed, it is stringified using JSON.

**Type**: [domv/lib/Exception](#module_domv/lib/Exception)
**Returns**: [domv/lib/Component](#module_domv/lib/Component) - this
<a name="module_domv/lib/Component#getAttr"></a>
###domv/lib/Component.getAttr(name, [json])
Get the value of a single attribute of the outer node.

**Params**

- name `string` - The attribute name to get.
- \[json=false\] `boolean` - If true, the attribute value is parsed as json

**Returns**: `string` - The attribute value
<a name="module_domv/lib/Component#selector"></a>
###domv/lib/Component.selector(selector, [componentConstructor])
Returns the first element, or null, that matches the specified single selector.
(applied on the inner node)

**Params**

- selector `string`
- \[componentConstructor=[domv/lib/Component](#module_domv/lib/Component)\] `function` - The constructor to
        use to wrap the result Node, by default the Node is wrapped in a plain Component,
        but it is also possible to specify your own constructor.

**Returns**: [domv/lib/Component](#module_domv/lib/Component)
<a name="module_domv/lib/Component#assertSelector"></a>
###domv/lib/Component.assertSelector(selector, [componentConstructor])
Returns the first element that matches the specified single selector.
(applied on the inner node)

**Params**

- selector `string`
- \[componentConstructor=[domv/lib/Component](#module_domv/lib/Component)\] `function` - The constructor to
        use to wrap the result Node, by default the Node is wrapped in a plain Component,
        but it is also possible to specify your own constructor.

**Type**: [domv/lib/Exception](#module_domv/lib/Exception)
**Returns**: [domv/lib/Component](#module_domv/lib/Component)
<a name="module_domv/lib/Component#selectorAll"></a>
###domv/lib/Component.selectorAll(selector, [componentConstructor])
Returns a list of all elements that matches the specified single selector.
(applied on the inner node)

**Params**

- selector `string`
- \[componentConstructor=[domv/lib/Component](#module_domv/lib/Component)\] `function` - The constructor to
        use to wrap the resulting Nodes, by default the Nodes are wrapped in a plain Component,
        but it is also possible to specify your own constructor.

**Returns**: [Array.&lt;domv/lib/Component&gt;](#module_domv/lib/Component)
<a name="module_domv/lib/Component#adoptAllAttributes"></a>
###domv/lib/Component.adoptAllAttributes(from)
Copy all attributes from the given element to our outer node.

**Params**

- from <code>[domv/lib/Component](#module_domv/lib/Component)</code> | <code>[Element](#external_Element)</code> - A DOM Element or if a Component is passed, the outerNode.

**Type**: [domv/lib/Exception](#module_domv/lib/Exception)
<a name="module_domv/lib/Component#swapNode"></a>
###domv/lib/Component.swapNode(node)
Move over all child nodes of the inner node to the given "node" and replace
the outer node with the given "node".

**Params**

- node `Element` | <code>[domv/lib/Component](#module_domv/lib/Component)</code> - The node to replace our outer node with.
If not set, the children of our inner node are added to the parent of the outer node.

**Type**: [domv/lib/Exception](#module_domv/lib/Exception)
**Example**
var container = document.createElement('div');
container.innerHTML = '<section>abc<p>def<strong>ghj</strong>klm</p>nop</section>';
domv.wrap(container).selector('p').swap(document.createElement('h1'));
console.log(container.innerHTML);
//  '<section>abc<h1>def<strong>ghj</strong>klm</h1>nop</section>'

<a name="module_domv/lib/Component#isAllWhiteSpace"></a>
###domv/lib/Component.isAllWhiteSpace([checkChildElements])
Does the innerNode (and its (grand)children) of this component only consist of whitespace?
Text nodes that only consist of spaces, newlines and horizontal tabs are whitespace.
Comment nodes are whitespace.
Empty text, comment, element nodes are whitespace.
Certain content elements such as for example img, video, input, etc are not whitespace.

**Params**

- \[checkChildElements=false\] `boolean` - If false any element node (e.g. an empty div) that is
       encountered will fail the whitespace check. If true those elements are checked recursively
       for whitepspace

**Returns**: `boolean`
<a name="module_domv/lib/Component#stringifyAsHtml"></a>
###domv/lib/Component.stringifyAsHtml()
Stringify the outerNode and all its children as html markup.

**Returns**: `string`
<a name="module_domv/lib/Component#sendResponseAsHtml"></a>
###domv/lib/Component.sendResponseAsHtml(response)
Stringify the outerNode and all its children as html markup, and send it
as a http response in node.js with the proper Content-Type and Content-Length.
Other headers can be set by calling setHeader() on the response before calling
this method. The status code can be set by setting response.statusCode in the same
fashion (the default is 200).
This method uses this.stringifyAsHtml() to generate the markup (which can be
overridden).

**Params**

- response <code>[ServerResponse](#external_ServerResponse)</code>

<a name="module_domv/lib/Component#splice"></a>
###domv/lib/Component.splice()
This method does nothing, it is used so that firebug and chrome displays Component objects as an array.
This method is not used by this library, feel free to override this method.

<a name="module_domv/lib/Component#updateConsoleHack"></a>
###domv/lib/Component.updateConsoleHack()
<p>Called by whenever an inner/outer node changes.
This enables pretty formatting of Component instances in the firebug and chrome console.</p>

<p>Firebug will display instances as:</p>
<code>"Object["BaseDocument", html.BaseDocument, div.content]"</code>
<!-- "Object" is the value of [[Class]] -->


<p>Chrome will display instances as:</p>
<code>["BaseDocument", &lt;html class=​"BaseDocument"&gt;​...​&lt;/html&gt;​, &lt;div class=​"content"&gt;​…&lt;/div&gt;​...​&lt;/div&gt;​]</code>

<p>This hack works by setting the attributes "length", "0", "1" and "2" ("splice" is set on the prototype also).
   Override this method to do nothing in your subclass to disable this hack.</p>

<a name="module_domv/lib/Component#isDOMVComponent"></a>
###const: domv/lib/Component.isDOMVComponent
Always true for instances of this class.
<p>Use this attribute to determine if an object is a Component.
This would let you create an object compatible with this API,
without having to use Component as a super type.</p>

**Type**: `boolean`
<a name="module_domv/lib/Exception"></a>
#domv/lib/Exception
The base class for any exception that originates from this library

**Author**: Joris van der Wel <joris@jorisvanderwel.com>
<a name="exp_module_domv/lib/Exception"></a>
##class: Exception ⏏
**Extends**: `Error`
**Members**

* [class: Exception ⏏](#exp_module_domv/lib/Exception)
  * [new Exception(wrapped)](#exp_new_module_domv/lib/Exception)
  * [const: domv/lib/Exception.isDOMVException](#module_domv/lib/Exception#isDOMVException)

<a name="exp_new_module_domv/lib/Exception"></a>
###new Exception(wrapped)
Construct a simple domv.Exception

**Params**

- wrapped `Error`

**Extends**: `Error`
**Example**
new domv.Exception(new Error('Hrm'));

<a name="module_domv/lib/Exception#isDOMVException"></a>
###const: domv/lib/Exception.isDOMVException
Always true for instances of this class.
<p>Use this attribute to determine if an object is a Component.
This would let you create an object compatible with this API,
without having to use Component as a super type.</p>

**Type**: `boolean`
<a name="module_domv/lib/HtmlDocument"></a>
#domv/lib/HtmlDocument
Represents a full document in html, including the root node html.

**Author**: Joris van der Wel <joris@jorisvanderwel.com>
<a name="exp_module_domv/lib/HtmlDocument"></a>
##class: HtmlDocument ⏏
**Extends**: `module:domv/lib/Component`
**Members**

* [class: HtmlDocument ⏏](#exp_module_domv/lib/HtmlDocument)
  * [new HtmlDocument(node)](#exp_new_module_domv/lib/HtmlDocument)
  * [domv/lib/HtmlDocument.head](#module_domv/lib/HtmlDocument#head)
  * [domv/lib/HtmlDocument.body](#module_domv/lib/HtmlDocument#body)
  * [domv/lib/HtmlDocument.baseWrapped](#module_domv/lib/HtmlDocument#baseWrapped)
  * [domv/lib/HtmlDocument.titleWrapped](#module_domv/lib/HtmlDocument#titleWrapped)
  * [domv/lib/HtmlDocument.title](#module_domv/lib/HtmlDocument#title)
  * [domv/lib/HtmlDocument.baseURI](#module_domv/lib/HtmlDocument#baseURI)
  * [domv/lib/HtmlDocument.document](#module_domv/lib/HtmlDocument#document)
  * [domv/lib/HtmlDocument.outerNode](#module_domv/lib/HtmlDocument#outerNode)
  * [domv/lib/HtmlDocument.outerNodeWrapped](#module_domv/lib/HtmlDocument#outerNodeWrapped)
  * [domv/lib/HtmlDocument.innerNode](#module_domv/lib/HtmlDocument#innerNode)
  * [domv/lib/HtmlDocument.innerNodeWrapped](#module_domv/lib/HtmlDocument#innerNodeWrapped)
  * [domv/lib/HtmlDocument.style](#module_domv/lib/HtmlDocument#style)
  * [domv/lib/HtmlDocument.children](#module_domv/lib/HtmlDocument#children)
  * [domv/lib/HtmlDocument.childrenIndex](#module_domv/lib/HtmlDocument#childrenIndex)
  * [domv/lib/HtmlDocument.childNodes](#module_domv/lib/HtmlDocument#childNodes)
  * [domv/lib/HtmlDocument.childNodesIndex](#module_domv/lib/HtmlDocument#childNodesIndex)
  * [domv/lib/HtmlDocument.isEmpty](#module_domv/lib/HtmlDocument#isEmpty)
  * [domv/lib/HtmlDocument.firstChild](#module_domv/lib/HtmlDocument#firstChild)
  * [domv/lib/HtmlDocument.lastChild](#module_domv/lib/HtmlDocument#lastChild)
  * [domv/lib/HtmlDocument.firstElementChild](#module_domv/lib/HtmlDocument#firstElementChild)
  * [domv/lib/HtmlDocument.lastElementChild](#module_domv/lib/HtmlDocument#lastElementChild)
  * [domv/lib/HtmlDocument.nextSibling](#module_domv/lib/HtmlDocument#nextSibling)
  * [domv/lib/HtmlDocument.previousSibling](#module_domv/lib/HtmlDocument#previousSibling)
  * [domv/lib/HtmlDocument.nextElementSibling](#module_domv/lib/HtmlDocument#nextElementSibling)
  * [domv/lib/HtmlDocument.previousElementSibling](#module_domv/lib/HtmlDocument#previousElementSibling)
  * [domv/lib/HtmlDocument.parentNode](#module_domv/lib/HtmlDocument#parentNode)
  * [domv/lib/HtmlDocument.textContent](#module_domv/lib/HtmlDocument#textContent)
  * [domv/lib/HtmlDocument.value](#module_domv/lib/HtmlDocument#value)
  * [domv/lib/HtmlDocument.checked](#module_domv/lib/HtmlDocument#checked)
  * [domv/lib/HtmlDocument.selected](#module_domv/lib/HtmlDocument#selected)
  * [domv/lib/HtmlDocument.outerNodeType](#module_domv/lib/HtmlDocument#outerNodeType)
  * [domv/lib/HtmlDocument.innerNodeType](#module_domv/lib/HtmlDocument#innerNodeType)
  * [domv/lib/HtmlDocument.outerNodeName](#module_domv/lib/HtmlDocument#outerNodeName)
  * [domv/lib/HtmlDocument.innerNodeName](#module_domv/lib/HtmlDocument#innerNodeName)
  * [domv/lib/HtmlDocument.addCSS(href, media)](#module_domv/lib/HtmlDocument#addCSS)
  * [domv/lib/HtmlDocument.addJS(href, [async])](#module_domv/lib/HtmlDocument#addJS)
  * [domv/lib/HtmlDocument.addJSONData(identifier, data)](#module_domv/lib/HtmlDocument#addJSONData)
  * [domv/lib/HtmlDocument.getJSONData(identifier)](#module_domv/lib/HtmlDocument#getJSONData)
  * [domv/lib/HtmlDocument.isCreationConstructor(node, [wrapDocument])](#module_domv/lib/HtmlDocument#isCreationConstructor)
  * [domv/lib/HtmlDocument.on(event, listener, [useCapture], [thisObject])](#module_domv/lib/HtmlDocument#on)
  * [domv/lib/HtmlDocument.addListener(event, listener, [useCapture], [thisObject])](#module_domv/lib/HtmlDocument#addListener)
  * [domv/lib/HtmlDocument.removeListener(event, listener, [useCapture], [thisObject])](#module_domv/lib/HtmlDocument#removeListener)
  * [domv/lib/HtmlDocument.cleanup()](#module_domv/lib/HtmlDocument#cleanup)
  * [domv/lib/HtmlDocument.clearListeners()](#module_domv/lib/HtmlDocument#clearListeners)
  * [domv/lib/HtmlDocument.emit(name, [data], [bubbles], [cancelable])](#module_domv/lib/HtmlDocument#emit)
  * [domv/lib/HtmlDocument.isOuterNodeEqual(node)](#module_domv/lib/HtmlDocument#isOuterNodeEqual)
  * [domv/lib/HtmlDocument.isInnerNodeEqual(node)](#module_domv/lib/HtmlDocument#isInnerNodeEqual)
  * [domv/lib/HtmlDocument.isNodeEqual(node)](#module_domv/lib/HtmlDocument#isNodeEqual)
  * [domv/lib/HtmlDocument.create(nodeName, className, [...content])](#module_domv/lib/HtmlDocument#create)
  * [domv/lib/HtmlDocument.text(...text_)](#module_domv/lib/HtmlDocument#text)
  * [domv/lib/HtmlDocument.shorthand([tagName], ...initialAttributes)](#module_domv/lib/HtmlDocument#shorthand)
  * [domv/lib/HtmlDocument.textShorthand()](#module_domv/lib/HtmlDocument#textShorthand)
  * [domv/lib/HtmlDocument.appendChild(...node_)](#module_domv/lib/HtmlDocument#appendChild)
  * [domv/lib/HtmlDocument.prependChild(...node_)](#module_domv/lib/HtmlDocument#prependChild)
  * [domv/lib/HtmlDocument.siblingBefore(...node_)](#module_domv/lib/HtmlDocument#siblingBefore)
  * [domv/lib/HtmlDocument.siblingAfter(...node_)](#module_domv/lib/HtmlDocument#siblingAfter)
  * [domv/lib/HtmlDocument.removeNode()](#module_domv/lib/HtmlDocument#removeNode)
  * [domv/lib/HtmlDocument.removeChildren()](#module_domv/lib/HtmlDocument#removeChildren)
  * [domv/lib/HtmlDocument.cls(...cls)](#module_domv/lib/HtmlDocument#cls)
  * [domv/lib/HtmlDocument.addClass(...cls)](#module_domv/lib/HtmlDocument#addClass)
  * [domv/lib/HtmlDocument.removeClass(...cls)](#module_domv/lib/HtmlDocument#removeClass)
  * [domv/lib/HtmlDocument.hasClass(...cls)](#module_domv/lib/HtmlDocument#hasClass)
  * [domv/lib/HtmlDocument.assertHasClass(...cls)](#module_domv/lib/HtmlDocument#assertHasClass)
  * [domv/lib/HtmlDocument.toggleClass(cls, force)](#module_domv/lib/HtmlDocument#toggleClass)
  * [domv/lib/HtmlDocument.attr(name, value)](#module_domv/lib/HtmlDocument#attr)
  * [domv/lib/HtmlDocument.getAttr(name, [json])](#module_domv/lib/HtmlDocument#getAttr)
  * [domv/lib/HtmlDocument.selector(selector, [componentConstructor])](#module_domv/lib/HtmlDocument#selector)
  * [domv/lib/HtmlDocument.assertSelector(selector, [componentConstructor])](#module_domv/lib/HtmlDocument#assertSelector)
  * [domv/lib/HtmlDocument.selectorAll(selector, [componentConstructor])](#module_domv/lib/HtmlDocument#selectorAll)
  * [domv/lib/HtmlDocument.adoptAllAttributes(from)](#module_domv/lib/HtmlDocument#adoptAllAttributes)
  * [domv/lib/HtmlDocument.swapNode(node)](#module_domv/lib/HtmlDocument#swapNode)
  * [domv/lib/HtmlDocument.isAllWhiteSpace([checkChildElements])](#module_domv/lib/HtmlDocument#isAllWhiteSpace)
  * [domv/lib/HtmlDocument.stringifyAsHtml()](#module_domv/lib/HtmlDocument#stringifyAsHtml)
  * [domv/lib/HtmlDocument.sendResponseAsHtml(response)](#module_domv/lib/HtmlDocument#sendResponseAsHtml)
  * [domv/lib/HtmlDocument.splice()](#module_domv/lib/HtmlDocument#splice)
  * [domv/lib/HtmlDocument.updateConsoleHack()](#module_domv/lib/HtmlDocument#updateConsoleHack)
  * [const: domv/lib/HtmlDocument.isDOMVComponent](#module_domv/lib/HtmlDocument#isDOMVComponent)

<a name="exp_new_module_domv/lib/HtmlDocument"></a>
###new HtmlDocument(node)
This constructor can be used to either create a new html document (html, head, body),
or to wrap an existing html document into this class.

**Params**

- node <code>[Node](#external_Node)</code> | <code>[domv/lib/Component](#module_domv/lib/Component)</code> - Either null, a document node or an "html" element node

**Extends**: `module:domv/lib/Component`
**Type**: [domv/lib/Exception](#module_domv/lib/Exception)
**Example**
new HtmlDocument() // create a new Document Node, including html (as its child), head, body.

**Example**
new HtmlDocument(document); // Create html, head and body elements using the given Document Node,
        but do not modify the given Document node (constructors should be side-effect free).

**Example**
new HtmlDocument(document.documentElement); // Associate an existing html document

<a name="module_domv/lib/HtmlDocument#head"></a>
###domv/lib/HtmlDocument.head
The "head" Element of the document.

**Type**: [domv/lib/Component](#module_domv/lib/Component)
<a name="module_domv/lib/HtmlDocument#body"></a>
###domv/lib/HtmlDocument.body
The "body" Element of the document.

**Type**: [domv/lib/Component](#module_domv/lib/Component)
<a name="module_domv/lib/HtmlDocument#baseWrapped"></a>
###domv/lib/HtmlDocument.baseWrapped
The "base" Element of the document.
(within the "head" node)

**Type**: [domv/lib/Component](#module_domv/lib/Component)
<a name="module_domv/lib/HtmlDocument#titleWrapped"></a>
###domv/lib/HtmlDocument.titleWrapped
The "title" Element of the document.
(within the head node)

**Type**: [domv/lib/Component](#module_domv/lib/Component)
<a name="module_domv/lib/HtmlDocument#title"></a>
###domv/lib/HtmlDocument.title
The textContent of the "title" Element of this document.
(within the "head" node)

**Type**: `string`
<a name="module_domv/lib/HtmlDocument#baseURI"></a>
###domv/lib/HtmlDocument.baseURI
The base URI that is used to resolve all the relative uri's within this document.
(this is get/set using a "base" Element within the "head" element)

**Type**: `string`
<a name="module_domv/lib/HtmlDocument#document"></a>
###domv/lib/HtmlDocument.document
The Document Node that the nodes of this Component are associated with.

**Type**: [Document](#external_Document)
<a name="module_domv/lib/HtmlDocument#outerNode"></a>
###domv/lib/HtmlDocument.outerNode
The "outer" DOM Node for this component.
<p>This node is used to apply attributes or when adding this
   component as the child of another.</p>
<p>This property is usually set by the Component constructor</p>

**Type**: [Node](#external_Node)
<a name="module_domv/lib/HtmlDocument#outerNodeWrapped"></a>
###domv/lib/HtmlDocument.outerNodeWrapped
The outer DOM node wrapped as a new component.

**Type**: [domv/lib/Component](#module_domv/lib/Component)
<a name="module_domv/lib/HtmlDocument#innerNode"></a>
###domv/lib/HtmlDocument.innerNode
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

**Type**: [Node](#external_Node)
<a name="module_domv/lib/HtmlDocument#innerNodeWrapped"></a>
###domv/lib/HtmlDocument.innerNodeWrapped
The inner DOM node wrapped as a new component.

**Type**: [domv/lib/Component](#module_domv/lib/Component)
<a name="module_domv/lib/HtmlDocument#style"></a>
###domv/lib/HtmlDocument.style
The inline style for the outer node.

**Type**: [CSSStyleDeclaration](#external_CSSStyleDeclaration)
<a name="module_domv/lib/HtmlDocument#children"></a>
###domv/lib/HtmlDocument.children
The (wrapped) child elements of the inner node.
The returned list is not live.

**Type**: [Array.&lt;domv/lib/Component&gt;](#module_domv/lib/Component)
<a name="module_domv/lib/HtmlDocument#childrenIndex"></a>
###domv/lib/HtmlDocument.childrenIndex
The index of the outerNode in the "children" attribute of the parentNode.

**Type**: `int`
**Example**
myParent.children[3].childrenIndex === 3

<a name="module_domv/lib/HtmlDocument#childNodes"></a>
###domv/lib/HtmlDocument.childNodes
The (wrapped) child nodes of the inner node.
The returned list is not live.

**Type**: [Array.&lt;domv/lib/Component&gt;](#module_domv/lib/Component)
<a name="module_domv/lib/HtmlDocument#childNodesIndex"></a>
###domv/lib/HtmlDocument.childNodesIndex
The index of the outerNode in the "childNodes" attribute of the parentNode.

**Type**: `int`
**Example**
myParent.childNodes[3].childNodesIndex === 3

<a name="module_domv/lib/HtmlDocument#isEmpty"></a>
###domv/lib/HtmlDocument.isEmpty
Is the inner node empty?
For Element nodes this means that there are 0 child nodes.
For CharacterData nodes, the text content must be of 0 length.
Other nodes are never considered empty

**Type**: `boolean`
<a name="module_domv/lib/HtmlDocument#firstChild"></a>
###domv/lib/HtmlDocument.firstChild
The first (wrapped) child node of the inner node.

**Type**: [domv/lib/Component](#module_domv/lib/Component)
<a name="module_domv/lib/HtmlDocument#lastChild"></a>
###domv/lib/HtmlDocument.lastChild
The first (wrapped) child node of the inner node.

**Type**: [domv/lib/Component](#module_domv/lib/Component)
<a name="module_domv/lib/HtmlDocument#firstElementChild"></a>
###domv/lib/HtmlDocument.firstElementChild
The first (wrapped) child node of the inner node that is an element.

**Type**: [domv/lib/Component](#module_domv/lib/Component)
<a name="module_domv/lib/HtmlDocument#lastElementChild"></a>
###domv/lib/HtmlDocument.lastElementChild
The last (wrapped) child node of the inner node that is an element.

**Type**: [domv/lib/Component](#module_domv/lib/Component)
<a name="module_domv/lib/HtmlDocument#nextSibling"></a>
###domv/lib/HtmlDocument.nextSibling
The next (wrapped) sibling of the outer node.

**Type**: [domv/lib/Component](#module_domv/lib/Component)
<a name="module_domv/lib/HtmlDocument#previousSibling"></a>
###domv/lib/HtmlDocument.previousSibling
The previous (wrapped) sibling of the outer node.

**Type**: [domv/lib/Component](#module_domv/lib/Component)
<a name="module_domv/lib/HtmlDocument#nextElementSibling"></a>
###domv/lib/HtmlDocument.nextElementSibling
The next (wrapped) sibling of the outer node that is an element.

**Type**: [domv/lib/Component](#module_domv/lib/Component)
<a name="module_domv/lib/HtmlDocument#previousElementSibling"></a>
###domv/lib/HtmlDocument.previousElementSibling
The previous (wrapped) sibling of the outer node that is an element.

**Type**: [domv/lib/Component](#module_domv/lib/Component)
<a name="module_domv/lib/HtmlDocument#parentNode"></a>
###domv/lib/HtmlDocument.parentNode
The (wrapped) parent node of the outer node.

**Type**: [domv/lib/Component](#module_domv/lib/Component)
<a name="module_domv/lib/HtmlDocument#textContent"></a>
###domv/lib/HtmlDocument.textContent
The textual content of an element and all its descendants.
Or for Text, Comment, etc nodes it represents the nodeValue.
Setting this property on an element removes all of its children
and replaces them with a single text node with the given value.

**Type**: `string`
<a name="module_domv/lib/HtmlDocument#value"></a>
###domv/lib/HtmlDocument.value
The value of this node. For most nodes this property is undefined, for input fields this
contains the current value. (The attribute "value" does not change by user input).

**Type**: `string`
<a name="module_domv/lib/HtmlDocument#checked"></a>
###domv/lib/HtmlDocument.checked
The checked state of this node. For most nodes this property is undefined, for input elements this
contains the checked state. (The attribute "checked" does not change by user input).

**Type**: `boolean`
<a name="module_domv/lib/HtmlDocument#selected"></a>
###domv/lib/HtmlDocument.selected
The selected state of this node. For most nodes this property is undefined, for option elements this
contains the current selected state. (The attribute "selected" does not change by user input).

**Type**: `boolean`
<a name="module_domv/lib/HtmlDocument#outerNodeType"></a>
###domv/lib/HtmlDocument.outerNodeType
The node type of the outer node.

**Type**: [NodeType](#module_domv.NodeType)
<a name="module_domv/lib/HtmlDocument#innerNodeType"></a>
###domv/lib/HtmlDocument.innerNodeType
The node type of the inner node.

**Type**: [NodeType](#module_domv.NodeType)
<a name="module_domv/lib/HtmlDocument#outerNodeName"></a>
###domv/lib/HtmlDocument.outerNodeName
The node name of the outer node.
(element tag names always in lowercase)

**Type**: `string`
<a name="module_domv/lib/HtmlDocument#innerNodeName"></a>
###domv/lib/HtmlDocument.innerNodeName
The node name of the inner node.

**Type**: `string`
<a name="module_domv/lib/HtmlDocument#addCSS"></a>
###domv/lib/HtmlDocument.addCSS(href, media)
Link a css file to this document.

**Params**

- href `string` - An absolute or relative URL
- media `string` - The media query to associate with this css file

**Returns**: [domv/lib/Component](#module_domv/lib/Component) - The newly created "link" node
<a name="module_domv/lib/HtmlDocument#addJS"></a>
###domv/lib/HtmlDocument.addJS(href, [async])
Link a javascript file to this document.

**Params**

- href `string` - An absolute or relative URL
- \[async=true\] `boolean` - If true, a webbrowser will continue parsing
       the document even if the script file has not been fully loaded yet.
       Use this whenever possible to decrease load times.

**Returns**: [domv/lib/Component](#module_domv/lib/Component) - The newly created "script" node
<a name="module_domv/lib/HtmlDocument#addJSONData"></a>
###domv/lib/HtmlDocument.addJSONData(identifier, data)
Expose JSON data to an interpreter of the HTML document using a script type="application/json" element.
The data can be retrieved using getJSONData with the same identifier;

**Params**

- identifier `string` - Must be unique to properly get your JSON data back
- data `*` - Any array, object, boolean, integer, et cetera that is able to be serialized into JSON.

**Returns**: [domv/lib/Component](#module_domv/lib/Component) - The newly created "script" node
**Example**
myDoc.addJSONData('foo', {'abc': 'def'});
// <script type="application/json" data-identifier="foo">{"abc":"def"};</script>

<a name="module_domv/lib/HtmlDocument#getJSONData"></a>
###domv/lib/HtmlDocument.getJSONData(identifier)
Retrieve JSON data previously exposed by addJSONData

**Params**

- identifier `string` - Same identifier as was used in addJSONData

**Returns**: `*` - parsed json data
<a name="module_domv/lib/HtmlDocument#isCreationConstructor"></a>
###domv/lib/HtmlDocument.isCreationConstructor(node, [wrapDocument])
**Params**

- node <code>[Node](#external_Node)</code> | <code>[domv/lib/Component](#module_domv/lib/Component)</code> - A DOCUMENT_NODE will result in the
creation constructor, any other node will result in the wrapping constructor. A falsy value will also result in the
creation constructor and it used in Component subclasses that know how to create their own DOCUMENT_NODE
(e.g. [domv/lib/HtmlDocument](#module_domv/lib/HtmlDocument).
- \[wrapDocument=false\] `boolean` - <p>If false, passing a DOCUMENT_NODE as "node" will result in an empty tag
being created instead of wrapping the DOCUMENT_NODE. This behaviour is more convenient when subclassing Component
because it lets you treat subclasses and subsubclasses in the same way. <em>(e.g. the subclass Menu adds the
class 'Menu' and common menu items. The subsubclass EventMenu adds the class 'EventMenu' and further event menu
items.)</em></p>
<p>If true, a document will always wrap.</p>

**Returns**: `boolean` - If thee creation constructor should be used instead of the wrapping constructor.
<a name="module_domv/lib/HtmlDocument#on"></a>
###domv/lib/HtmlDocument.on(event, listener, [useCapture], [thisObject])
Adds a listener to the DOM.

**Params**

- event `string`
- listener `function`
- \[useCapture=false\] `boolean` - Use the capture phase (for dom events)
- \[thisObject=this\] `*` - The this object of "listener".
       By default the "this" object of this method is used

**Type**: [domv/lib/Exception](#module_domv/lib/Exception)
**Returns**: [domv/lib/Component](#module_domv/lib/Component) - this
<a name="module_domv/lib/HtmlDocument#addListener"></a>
###domv/lib/HtmlDocument.addListener(event, listener, [useCapture], [thisObject])
Adds a listener to the DOM or to the internal EventEmmiter, depending on the
type of the event (see [module:domv.isDOMEvent](module:domv.isDOMEvent))

**Params**

- event `string`
- listener `function`
- \[useCapture=false\] `boolean` - Use the capture phase (for dom events)
- \[thisObject=this\] `*` - The this object of "listener".
       By default the "this" object of this method is used

**Returns**: [domv/lib/Component](#module_domv/lib/Component) - this
<a name="module_domv/lib/HtmlDocument#removeListener"></a>
###domv/lib/HtmlDocument.removeListener(event, listener, [useCapture], [thisObject])
Removes a listener from the DOM.
All of the parameters must equal the parameters that were used in addListener.

**Params**

- event `string`
- listener `function`
- \[useCapture=false\] `boolean`
- \[thisObject=this\] `*`

**Returns**: [domv/lib/Component](#module_domv/lib/Component) - this
<a name="module_domv/lib/HtmlDocument#cleanup"></a>
###domv/lib/HtmlDocument.cleanup()
Mark that this Component should perform any cleanup it wants to.
Normally a Component do not need any cleanup, however this might be needed in special circumstances.
This implementation clears all dom listeners set through this Component instance and it emits (local) the
'domv-cleanup' event.

<a name="module_domv/lib/HtmlDocument#clearListeners"></a>
###domv/lib/HtmlDocument.clearListeners()
Removes all (DOM) listeners from the outerNode.

<a name="module_domv/lib/HtmlDocument#emit"></a>
###domv/lib/HtmlDocument.emit(name, [data], [bubbles], [cancelable])
Emits a DOM custom Event on the outerNode with optional data. The listeners are passed an Event
object as their first argument which has this data set

**Params**

- name `String` - The event name, a prefix should be added to prevent name clashes with any new event names in
       web browsers. (e.g. "domv-somethinghappened"
- \[data={}\] `Object` - Key value pairs to set on the Event object
- \[bubbles=true\] `boolean`
- \[cancelable=true\] `boolean`

**Type**: [domv/lib/Exception](#module_domv/lib/Exception)
**Returns**: `boolean` - False if any of the event listeners has called preventDefault(), otherwise true
<a name="module_domv/lib/HtmlDocument#isOuterNodeEqual"></a>
###domv/lib/HtmlDocument.isOuterNodeEqual(node)
Is the outer DOM node equal to the given node?.
If a Component is given the outer nodes of both components must match.

**Params**

- node <code>[Node](#external_Node)</code> | <code>[domv/lib/Component](#module_domv/lib/Component)</code>

**Returns**: `boolean`
<a name="module_domv/lib/HtmlDocument#isInnerNodeEqual"></a>
###domv/lib/HtmlDocument.isInnerNodeEqual(node)
Is the inner DOM node equal to the given node?.
If a Component is given the inner nodes of both components must match.

**Params**

- node <code>[Node](#external_Node)</code> | <code>[domv/lib/Component](#module_domv/lib/Component)</code>

**Returns**: `boolean`
<a name="module_domv/lib/HtmlDocument#isNodeEqual"></a>
###domv/lib/HtmlDocument.isNodeEqual(node)
Are the outer and inner node equal to the given node?
If a Component is given the outer and inner nodes of both components must match.

**Params**

- node <code>[Node](#external_Node)</code> | <code>[domv/lib/Component](#module_domv/lib/Component)</code>

**Returns**: `boolean`
<a name="module_domv/lib/HtmlDocument#create"></a>
###domv/lib/HtmlDocument.create(nodeName, className, [...content])
Convenient function to create a wrapped Node including its attributes (for elements).

**Params**

- nodeName `string`
- className `string`
- \[...content\] `string` | <code>[Node](#external_Node)</code> | <code>[domv/lib/Component](#module_domv/lib/Component)</code> | `Object.<string, string>` - <p>If a string is passed, a text node is appended.</p>
       <p>If a node or component is passed, it is simply appended.</p>
       <p>If an object of key value pairs is passed, it sets those as attributes.</p>

**Type**: [domv/lib/Exception](#module_domv/lib/Exception)
**Returns**: [domv/lib/Component](#module_domv/lib/Component)
<a name="module_domv/lib/HtmlDocument#text"></a>
###domv/lib/HtmlDocument.text(...text_)
Creates a new wrapped TextNode.

**Params**

- ...text_ `string` - Extra arguments will be joined using a space

**Returns**: [domv/lib/Component](#module_domv/lib/Component)
**Example**
var wrappedDiv = require('domv').create(document, 'div');
var wrappedText = require('domv').text(document, 'Hi!');
wrappedDiv.appendChild(wrappedText);
console.log(wrappedDiv.outerNode.outerHTML);
// <div>Hi!</div>

<a name="module_domv/lib/HtmlDocument#shorthand"></a>
###domv/lib/HtmlDocument.shorthand([tagName], ...initialAttributes)
Generate a short hand function wich lets you quickly create
new elements (wrapped) including attributes.

**Params**

- \[tagName='div'\] `string`
- ...initialAttributes `string` | `Object.<string, string>` - <p>If a string is passed, a text node is appended.</p>
       <p>If an object of key value pairs is passed, it sets those as attributes
          (see [attr](#module_domv/lib/Component#attr)).</p>

**Type**: [domv/lib/Exception](#module_domv/lib/Exception)
**Returns**: [domv/lib/CreateShortHand](#domv/lib/CreateShortHand)
**Example**
var a = this.shorthand('a');
var link = a('readmore', {'href': something()}, 'Click here to readmore!');
// <a class="readmore" href="#example">Click here to readmore!</a>

<a name="module_domv/lib/HtmlDocument#textShorthand"></a>
###domv/lib/HtmlDocument.textShorthand()
Generate a short hand function which lets you quickly create
new text nodes (wrapped).

**Returns**: `function`
**Example**
var text = this.textShorthand();
var wraped = text('bla');
wrapped = text('foo', 'bar'); // 'foo bar'

<a name="module_domv/lib/HtmlDocument#appendChild"></a>
###domv/lib/HtmlDocument.appendChild(...node_)
Add a child node at the end of the inner node.

**Params**

- ...node_ <code>[domv/lib/Component](#module_domv/lib/Component)</code> | <code>[Node](#external_Node)</code> - A plain Node or if a Component is passed, the outerNode.

**Type**: [domv/lib/Exception](#module_domv/lib/Exception)
**Returns**: [domv/lib/Component](#module_domv/lib/Component) - this
<a name="module_domv/lib/HtmlDocument#prependChild"></a>
###domv/lib/HtmlDocument.prependChild(...node_)
Add a child node at the beginning of the inner node.

**Params**

- ...node_ <code>[domv/lib/Component](#module_domv/lib/Component)</code> | <code>[Node](#external_Node)</code> - A plain Node or if a Component is passed, the outerNode.

**Type**: [domv/lib/Exception](#module_domv/lib/Exception)
**Returns**: [domv/lib/Component](#module_domv/lib/Component) - this
<a name="module_domv/lib/HtmlDocument#siblingBefore"></a>
###domv/lib/HtmlDocument.siblingBefore(...node_)
Add a sibling node before the outer node. (which will become the outer node's previousSibling)

**Params**

- ...node_ <code>[domv/lib/Component](#module_domv/lib/Component)</code> | <code>[Node](#external_Node)</code> - A plain Node or if a Component is passed, the outerNode.

**Type**: [domv/lib/Exception](#module_domv/lib/Exception)
**Returns**: [domv/lib/Component](#module_domv/lib/Component) - this
<a name="module_domv/lib/HtmlDocument#siblingAfter"></a>
###domv/lib/HtmlDocument.siblingAfter(...node_)
Add a sibling node after the outer node. (which will become the outer node's nextSibling)

**Params**

- ...node_ <code>[domv/lib/Component](#module_domv/lib/Component)</code> | <code>[Node](#external_Node)</code> - A plain Node or if a Component is passed, the outerNode.

**Type**: [domv/lib/Exception](#module_domv/lib/Exception)
**Returns**: [domv/lib/Component](#module_domv/lib/Component) - this
<a name="module_domv/lib/HtmlDocument#removeNode"></a>
###domv/lib/HtmlDocument.removeNode()
Removes the outer node from its parentNode.

**Returns**: [domv/lib/Component](#module_domv/lib/Component) - this
<a name="module_domv/lib/HtmlDocument#removeChildren"></a>
###domv/lib/HtmlDocument.removeChildren()
Removes the all the children of the inner node

**Returns**: [domv/lib/Component](#module_domv/lib/Component) - this
<a name="module_domv/lib/HtmlDocument#cls"></a>
###domv/lib/HtmlDocument.cls(...cls)
Add a className on the outer node.

**Params**

- ...cls `string` - The className to add

**Type**: [domv/lib/Exception](#module_domv/lib/Exception)
**Returns**: [domv/lib/Component](#module_domv/lib/Component) - this
<a name="module_domv/lib/HtmlDocument#addClass"></a>
###domv/lib/HtmlDocument.addClass(...cls)
Add classNames on the outer node.

**Params**

- ...cls `string` - The classNames to add

**Type**: [domv/lib/Exception](#module_domv/lib/Exception)
**Returns**: [domv/lib/Component](#module_domv/lib/Component) - this
<a name="module_domv/lib/HtmlDocument#removeClass"></a>
###domv/lib/HtmlDocument.removeClass(...cls)
Remove classNames from the outer node.

**Params**

- ...cls `string` - The classNames to remove

**Type**: [domv/lib/Exception](#module_domv/lib/Exception)
**Returns**: [domv/lib/Component](#module_domv/lib/Component) - this
<a name="module_domv/lib/HtmlDocument#hasClass"></a>
###domv/lib/HtmlDocument.hasClass(...cls)
Does the outer node contain all of the given classNames?

**Params**

- ...cls `string` - The classNames to check.

**Returns**: `boolean`
<a name="module_domv/lib/HtmlDocument#assertHasClass"></a>
###domv/lib/HtmlDocument.assertHasClass(...cls)
Does the outer node contain all of the given classNames?

**Params**

- ...cls `string` - The classNames to check.

**Type**: [domv/lib/Exception](#module_domv/lib/Exception)
<a name="module_domv/lib/HtmlDocument#toggleClass"></a>
###domv/lib/HtmlDocument.toggleClass(cls, force)
Toggle a className on the outer node.

**Params**

- cls `string` - The className to toggle
- force `boolean` - If set, force the class name to be added (true) or removed (false).

**Type**: [domv/lib/Exception](#module_domv/lib/Exception)
**Returns**: `boolean`
<a name="module_domv/lib/HtmlDocument#attr"></a>
###domv/lib/HtmlDocument.attr(name, value)
Set/unset an attribute on the outer node.

**Params**

- name `string` | `Object.<string, string>` - The attribute name to unset/set.
       Or an object of key value pairs which sets multiple attributes at the same time,
       in this case "value" should not be set.
- value `string` | `boolean` - The value to set.
       Use boolean false or null to unset the attribute. Use boolean true to set a boolean attribute (e.g. checked="checked").
       If an object or array is passed, it is stringified using JSON.

**Type**: [domv/lib/Exception](#module_domv/lib/Exception)
**Returns**: [domv/lib/Component](#module_domv/lib/Component) - this
<a name="module_domv/lib/HtmlDocument#getAttr"></a>
###domv/lib/HtmlDocument.getAttr(name, [json])
Get the value of a single attribute of the outer node.

**Params**

- name `string` - The attribute name to get.
- \[json=false\] `boolean` - If true, the attribute value is parsed as json

**Returns**: `string` - The attribute value
<a name="module_domv/lib/HtmlDocument#selector"></a>
###domv/lib/HtmlDocument.selector(selector, [componentConstructor])
Returns the first element, or null, that matches the specified single selector.
(applied on the inner node)

**Params**

- selector `string`
- \[componentConstructor=[domv/lib/Component](#module_domv/lib/Component)\] `function` - The constructor to
        use to wrap the result Node, by default the Node is wrapped in a plain Component,
        but it is also possible to specify your own constructor.

**Returns**: [domv/lib/Component](#module_domv/lib/Component)
<a name="module_domv/lib/HtmlDocument#assertSelector"></a>
###domv/lib/HtmlDocument.assertSelector(selector, [componentConstructor])
Returns the first element that matches the specified single selector.
(applied on the inner node)

**Params**

- selector `string`
- \[componentConstructor=[domv/lib/Component](#module_domv/lib/Component)\] `function` - The constructor to
        use to wrap the result Node, by default the Node is wrapped in a plain Component,
        but it is also possible to specify your own constructor.

**Type**: [domv/lib/Exception](#module_domv/lib/Exception)
**Returns**: [domv/lib/Component](#module_domv/lib/Component)
<a name="module_domv/lib/HtmlDocument#selectorAll"></a>
###domv/lib/HtmlDocument.selectorAll(selector, [componentConstructor])
Returns a list of all elements that matches the specified single selector.
(applied on the inner node)

**Params**

- selector `string`
- \[componentConstructor=[domv/lib/Component](#module_domv/lib/Component)\] `function` - The constructor to
        use to wrap the resulting Nodes, by default the Nodes are wrapped in a plain Component,
        but it is also possible to specify your own constructor.

**Returns**: [Array.&lt;domv/lib/Component&gt;](#module_domv/lib/Component)
<a name="module_domv/lib/HtmlDocument#adoptAllAttributes"></a>
###domv/lib/HtmlDocument.adoptAllAttributes(from)
Copy all attributes from the given element to our outer node.

**Params**

- from <code>[domv/lib/Component](#module_domv/lib/Component)</code> | <code>[Element](#external_Element)</code> - A DOM Element or if a Component is passed, the outerNode.

**Type**: [domv/lib/Exception](#module_domv/lib/Exception)
<a name="module_domv/lib/HtmlDocument#swapNode"></a>
###domv/lib/HtmlDocument.swapNode(node)
Move over all child nodes of the inner node to the given "node" and replace
the outer node with the given "node".

**Params**

- node `Element` | <code>[domv/lib/Component](#module_domv/lib/Component)</code> - The node to replace our outer node with.
If not set, the children of our inner node are added to the parent of the outer node.

**Type**: [domv/lib/Exception](#module_domv/lib/Exception)
**Example**
var container = document.createElement('div');
container.innerHTML = '<section>abc<p>def<strong>ghj</strong>klm</p>nop</section>';
domv.wrap(container).selector('p').swap(document.createElement('h1'));
console.log(container.innerHTML);
//  '<section>abc<h1>def<strong>ghj</strong>klm</h1>nop</section>'

<a name="module_domv/lib/HtmlDocument#isAllWhiteSpace"></a>
###domv/lib/HtmlDocument.isAllWhiteSpace([checkChildElements])
Does the innerNode (and its (grand)children) of this component only consist of whitespace?
Text nodes that only consist of spaces, newlines and horizontal tabs are whitespace.
Comment nodes are whitespace.
Empty text, comment, element nodes are whitespace.
Certain content elements such as for example img, video, input, etc are not whitespace.

**Params**

- \[checkChildElements=false\] `boolean` - If false any element node (e.g. an empty div) that is
       encountered will fail the whitespace check. If true those elements are checked recursively
       for whitepspace

**Returns**: `boolean`
<a name="module_domv/lib/HtmlDocument#stringifyAsHtml"></a>
###domv/lib/HtmlDocument.stringifyAsHtml()
Stringify the outerNode and all its children as html markup.

**Returns**: `string`
<a name="module_domv/lib/HtmlDocument#sendResponseAsHtml"></a>
###domv/lib/HtmlDocument.sendResponseAsHtml(response)
Stringify the outerNode and all its children as html markup, and send it
as a http response in node.js with the proper Content-Type and Content-Length.
Other headers can be set by calling setHeader() on the response before calling
this method. The status code can be set by setting response.statusCode in the same
fashion (the default is 200).
This method uses this.stringifyAsHtml() to generate the markup (which can be
overridden).

**Params**

- response <code>[ServerResponse](#external_ServerResponse)</code>

<a name="module_domv/lib/HtmlDocument#splice"></a>
###domv/lib/HtmlDocument.splice()
This method does nothing, it is used so that firebug and chrome displays Component objects as an array.
This method is not used by this library, feel free to override this method.

<a name="module_domv/lib/HtmlDocument#updateConsoleHack"></a>
###domv/lib/HtmlDocument.updateConsoleHack()
<p>Called by whenever an inner/outer node changes.
This enables pretty formatting of Component instances in the firebug and chrome console.</p>

<p>Firebug will display instances as:</p>
<code>"Object["BaseDocument", html.BaseDocument, div.content]"</code>
<!-- "Object" is the value of [[Class]] -->


<p>Chrome will display instances as:</p>
<code>["BaseDocument", &lt;html class=​"BaseDocument"&gt;​...​&lt;/html&gt;​, &lt;div class=​"content"&gt;​…&lt;/div&gt;​...​&lt;/div&gt;​]</code>

<p>This hack works by setting the attributes "length", "0", "1" and "2" ("splice" is set on the prototype also).
   Override this method to do nothing in your subclass to disable this hack.</p>

<a name="module_domv/lib/HtmlDocument#isDOMVComponent"></a>
###const: domv/lib/HtmlDocument.isDOMVComponent
Always true for instances of this class.
<p>Use this attribute to determine if an object is a Component.
This would let you create an object compatible with this API,
without having to use Component as a super type.</p>

**Type**: `boolean`
<a name="module_domv"></a>
#domv
**Author**: Joris van der Wel <joris@jorisvanderwel.com>
**Members**

* [domv](#module_domv)
  * [enum: domv.NodeType](#module_domv.NodeType)
    * [NodeType.ELEMENT](#module_domv.NodeType.ELEMENT)
    * [NodeType.TEXT](#module_domv.NodeType.TEXT)
    * [NodeType.PROCESSING_INSTRUCTION](#module_domv.NodeType.PROCESSING_INSTRUCTION)
    * [NodeType.COMMENT](#module_domv.NodeType.COMMENT)
    * [NodeType.DOCUMENT](#module_domv.NodeType.DOCUMENT)
    * [NodeType.DOCUMENT_TYPE](#module_domv.NodeType.DOCUMENT_TYPE)
    * [NodeType.DOCUMENT_FRAGMENT](#module_domv.NodeType.DOCUMENT_FRAGMENT)
  * [domv.isSupported(document, [checkAll])](#module_domv.isSupported)
  * [domv.isParseHTMLDocumentSupported()](#module_domv.isParseHTMLDocumentSupported)
  * [domv.mayContainChildren(node, [doThrow])](#module_domv.mayContainChildren)
  * [domv.wrap(node_, [ComponentConstructor], ...constructorArguments)](#module_domv.wrap)
  * [domv.unlive(nodeList)](#module_domv.unlive)
  * [domv.create(document_, nodeName, className, ...content)](#module_domv.create)
  * [domv.shorthand(document_, [tagName_], ...initialAttributes)](#module_domv.shorthand)
  * [domv.text(document_, ...text)](#module_domv.text)
  * [domv.createHtmlDomDocument([minimal])](#module_domv.createHtmlDomDocument)
  * [domv.parseHTMLDocument(markup, ownerDocument)](#module_domv.parseHTMLDocument)
  * [domv.parseHTMLSnippit(ownerDocument, markup)](#module_domv.parseHTMLSnippit)
  * [domv.cssStringEscape([str], [wrapInQuotes])](#module_domv.cssStringEscape)
  * [domv.isLeftMouseButton(event)](#module_domv.isLeftMouseButton)
  * [const: domv.Component](#module_domv.Component)
  * [const: domv.HtmlDocument](#module_domv.HtmlDocument)
  * [const: domv.Exception](#module_domv.Exception)

<a name="module_domv.NodeType"></a>
##enum: domv.NodeType
All of the valid node types in DOM (excluding the ones that are deprecated).

**Type**: `number`
**Properties**: `ELEMENT`, `TEXT`, `PROCESSING_INSTRUCTION`, `COMMENT`, `DOCUMENT`, `DOCUMENT_TYPE`, `DOCUMENT_FRAGMENT`
<a name="module_domv.isSupported"></a>
##domv.isSupported(document, [checkAll])
Test if the current environment / browser / DOM library supports everything that is needed for the domv library.

**Params**

- document <code>[Document](#external_Document)</code>
- \[checkAll=false\] `boolean` - If true, also check [isParseHTMLDocumentSupported](#module_domv.isParseHTMLDocumentSupported)

**Type**: [domv/lib/Exception](#module_domv/lib/Exception)
**Returns**: `boolean`
<a name="module_domv.isParseHTMLDocumentSupported"></a>
##domv.isParseHTMLDocumentSupported()
Test if the current environment / browser / DOM library supports parsing the markup of an
entire html document (including doctype, html, head, tags etc).

**Returns**: `boolean`
<a name="module_domv.mayContainChildren"></a>
##domv.mayContainChildren(node, [doThrow])
Is the given node or component able to have children?.

**Params**

- node <code>[domv/lib/Component](#module_domv/lib/Component)</code> | <code>[Node](#external_Node)</code>
- \[doThrow=false\] `boolean` - If true, throw instead of returning false upon failure.

**Type**: [domv/lib/Exception](#module_domv/lib/Exception)
**Returns**: `boolean`
<a name="module_domv.wrap"></a>
##domv.wrap(node_, [ComponentConstructor], ...constructorArguments)
Wraps a plain DOM Node so that you can use the same API as you would on a Component.
If you pass a NodeList, an array (that is not live) with Component's will be returned.
Passing a falsy value will also return a falsy value instead of a Component

**Params**

- node_ <code>[Node](#external_Node)</code> | <code>[Array.&lt;Node&gt;](#external_Node)</code>
- \[ComponentConstructor=[domv/lib/Component](#module_domv/lib/Component)\] `function` - The constructor to
        use to wrap the given Node, by default the Node is wrapped in a plain Component,
        but it is also possible to specify your own constructor. The first argument is always
        the node being wrapped.
- ...constructorArguments `*` - Further arguments to be passed to the constructor

**Type**: [domv/lib/Exception](#module_domv/lib/Exception)
**Returns**: [domv/lib/Component](#module_domv/lib/Component) | [Array.&lt;domv/lib/Component&gt;](#module_domv/lib/Component) - Only null if "node" was also null
**Example**
domv.wrap(document.body).prependChild(...);

**Example**
domv.wrap(someNode, MyPictureGallery).addPicture(...);

<a name="module_domv.unlive"></a>
##domv.unlive(nodeList)
Returns an array copy of a NodeList so that it is no longer live.
This makes it easier to properly modify the DOM while traversing a node list.
The actual content of the array is identical (the nodes are <strong>not</strong> wrapped)

**Params**

- nodeList `*` - Any array like object.

**Returns**: `Array`
**Example**
var list = require('domv').unlive(document.getElementsByTagName('*'));

<a name="module_domv.create"></a>
##domv.create(document_, nodeName, className, ...content)
Convenient function to create a wrapped Node including its attributes (for elements).

**Params**

- document_ <code>[Document](#external_Document)</code>
- nodeName `string`
- className `string` | <code>[Node](#external_Node)</code> | <code>[domv/lib/Component](#module_domv/lib/Component)</code> | `Object.<string, string>` - <p>If a string is passed, and the nodeName represents an element tag, the string is set as the class attribute.
        If not an element, the string is appended to the node data.</p>
     <p>If a node or component is passed, it is simply appended.</p>
     <p>If an object of key value pairs is passed, it sets those as attributes (see [attr](#module_domv/lib/Component#attr)).</p>
- ...content `string` | <code>[Node](#external_Node)</code> | <code>[domv/lib/Component](#module_domv/lib/Component)</code> | `Object.<string, string>` - <p>If a string is passed, and the nodeName represents an element tag, the string is appended as a text node.
        If not an element, the string is appended to the node data.</p>
     <p>If a node or component is passed, it is simply appended.</p>
     <p>If an object of key value pairs is passed, it sets those as attributes (see [attr](#module_domv/lib/Component#attr)).</p>

**Type**: [domv/lib/Exception](#module_domv/lib/Exception)
**Returns**: [domv/lib/Component](#module_domv/lib/Component)
**Example**
var wrappedDiv = require('domv').create(document, 'div', 'myDiv', 'This is my div!', {'data-test': 'foo'});
console.log(wrappedDiv.outerNode.outerHTML);
// <div class="myDiv" data-test="foo">This is my div!</div>

<a name="module_domv.shorthand"></a>
##domv.shorthand(document_, [tagName_], ...initialAttributes)
Generate a short hand function wich lets you quickly create
a wrapped Element including its attributes.

**Params**

- document_ <code>[Document](#external_Document)</code>
- \[tagName_='div'\] `string`
- ...initialAttributes `string` | `Object.<string, string>` - <p>If a string is passed, a text node is appended.</p>
       <p>If a node or component is passed, it is simply appended.</p>
       <p>If an object of key value pairs is passed, it sets those as attributes.
          (see [attr](#module_domv/lib/Component#attr))</p>

**Returns**: [domv/lib/CreateShortHand](#domv/lib/CreateShortHand)
**Example**
var a = require('domv').shorthand(document, 'a');
var link = a('readmore', {'href': something()}, 'Click here to readmore!');
// <a class="readmore" href="#example">Click here to readmore!</a>

<a name="module_domv.text"></a>
##domv.text(document_, ...text)
Creates a new wrapped TextNode.

**Params**

- document_ <code>[Document](#external_Document)</code>
- ...text `string` - Extra arguments will be joined using a space

**Returns**: [domv/lib/Component](#module_domv/lib/Component)
**Example**
var wrappedDiv = require('domv').create(document, 'div');
var wrappedText = require('domv').text(document, 'Hi!');
wrappedDiv.appendChild(wrappedText);
console.log(wrappedDiv.outerNode.outerHTML);
// <div>Hi!</div>

<a name="module_domv.createHtmlDomDocument"></a>
##domv.createHtmlDomDocument([minimal])
Create a new Document Node, including html, head, title and body tags.

**Params**

- \[minimal=false\] `Boolean` - If true, only a doctype and a <html/> element is created.

**Returns**: [Document](#external_Document)
<a name="module_domv.parseHTMLDocument"></a>
##domv.parseHTMLDocument(markup, ownerDocument)
Parse the given html markup text as a complete html docuemnt and return the outer "html" node.
Optionally an ownerDocument may be given which will specify what Document the new nodes belong to.

**Params**

- markup `string`
- ownerDocument <code>[Document](#external_Document)</code>

**Type**: [domv/lib/Exception](#module_domv/lib/Exception)
**Returns**: [domv/lib/HtmlDocument](#module_domv/lib/HtmlDocument)
<a name="module_domv.parseHTMLSnippit"></a>
##domv.parseHTMLSnippit(ownerDocument, markup)
Parse the given html markup text and return a (wrapped) DocumentFragment containing
the nodes the markup represents. The given markup must not be a full html document, otherwise
the html, head and body nodes will not be present, only their content.
An ownerDocument must be given which will specify what Document the new nodes belong to.

**Params**

- ownerDocument <code>[Document](#external_Document)</code>
- markup `string`

**Type**: [domv/lib/Exception](#module_domv/lib/Exception)
**Returns**: [domv/lib/Component](#module_domv/lib/Component)
<a name="module_domv.cssStringEscape"></a>
##domv.cssStringEscape([str], [wrapInQuotes])
Escape a string so that you can use it as a CSS String, such as a selector.

**Params**

- \[str='undefined'\] `String`
- \[wrapInQuotes=true\] `boolean` - If true, surround the result with quotes: "something"

**Returns**: `String`
**Example**
myComponent.selectorAll('a[href=' + domv.cssStringEscape(somevar) + ']');

<a name="module_domv.isLeftMouseButton"></a>
##domv.isLeftMouseButton(event)
Given that 'event' is a mouse event, is the left mouse button being held down?.

**Params**

- event <code>[Event](#external_Event)</code>

**Type**: [domv/lib/Exception](#module_domv/lib/Exception)
**Returns**: `boolean` - True if the left mouse button is down
<a name="module_domv.Component"></a>
##const: domv.Component
**Type**: [domv/lib/Component](#module_domv/lib/Component)
<a name="module_domv.HtmlDocument"></a>
##const: domv.HtmlDocument
**Type**: [domv/lib/HtmlDocument](#module_domv/lib/HtmlDocument)
<a name="module_domv.Exception"></a>
##const: domv.Exception
**Type**: [domv/lib/Exception](#module_domv/lib/Exception)
<a name="domv/lib/CreateShortHand"></a>
#callback: domv/lib/CreateShortHand
**Params**

- className `string`
- \[...content\] `string` | <code>[Node](#external_Node)</code> | <code>[domv/lib/Component](#module_domv/lib/Component)</code> | `Object.<string, string>` - <p>If a string is passed, a text node is appended.</p>
       <p>If a node or component is passed, it is simply appended.</p>
       <p>If an object of key value pairs is passed, it sets those as attributes.
          (see [attr](#module_domv/lib/Component#attr))</p>

**Type**: `function`
