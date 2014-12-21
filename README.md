domv
====
Create views as components using DOM. Run the same code on the browser and on the server.

1. [Introduction](#introduction)
2. [For servers](#for-servers)
3. [For clients](#for-clients)
4. [Tutorial](#tutorial)
  1. [Creating a Component](#creating-a-component)
  2. [Subclassing](#subclassing)
  3. [HtmlDocument](#htmldocument)
5. [Modules](#modules)

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

