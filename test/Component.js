'use strict';

require('../lib/ClassList');

var domv = require('../lib/domv');
var Component = domv.Component;

function TestComponent(document)
{
        Component.call(this, document);
        var div = this.shorthand('div');

        this.cls('TestComponent');
        this.appendChild(
                div('titleBar',
                        this.title = div('title', 'Default Title!'),
                        this.closeButton = div('closeButton', 'close')
                ),
                this.content = div('content')
        );

        this.innerNode = this.content;
}

require('inherits')(TestComponent, Component);

TestComponent.prototype.setTitle = function(text)
{
        this.title.textContent = text;
};


function SimpleComponent(node, firstArg, secondArg)
{
        domv.Component.call(this, node);
        this.testAbc = node;
        this.firstArg = firstArg;
        this.secondArg = secondArg;
}
require('inherits')(SimpleComponent, domv.Component);


module.exports = {
        setUp: function (callback)
        {
                // nwmatcher which is used in jsdom for querySelector,
                // requires a documentElement to be present!
                this.document = global.document ? global.document : require('jsdom').jsdom('<!DOCTYPE html><html/>');
                callback();
        },
        tearDown: function (callback)
        {
                callback();
        },
        'undefined is undefined': function(test)
        {
                test.ok(typeof undefined === 'undefined');
                test.done();
        },
        'wrapping constructor': function(test)
        {
                var div = this.document.createElement('div');
                var wrapped = new Component(div);

                test.ok(wrapped.isCreationConstructor(null));
                test.ok(!wrapped.isCreationConstructor(div));
                test.ok(wrapped.isCreationConstructor(this.document));

                test.ok(wrapped.isDOMVComponent);
                test.ok(!div.isDOMVComponent);

                test.ok(wrapped.document === this.document);
                test.ok(wrapped.__outerNode__ === div);
                test.ok(wrapped.__innerNode__ === div);
                test.ok(wrapped.outerNode === div);
                test.ok(wrapped.innerNode === div);
                test.ok(wrapped.outerNodeWrapped.outerNode === div);
                test.ok(wrapped.outerNodeWrapped.innerNode === div);
                test.ok(wrapped.innerNodeWrapped.outerNode === div);
                test.ok(wrapped.innerNodeWrapped.innerNode === div);

                div = this.document.createElement('div');
                wrapped = new Component(div);

                wrapped.innerNode = wrapped;
                wrapped.outerNode = wrapped;
                test.ok(wrapped.__outerNode__ === div);
                test.ok(wrapped.__innerNode__ === div);
                test.ok(wrapped.outerNode === div);
                test.ok(wrapped.innerNode === div);

                div = this.document.createElement('div');
                wrapped = new Component(div);

                wrapped.innerNodeWrapped = wrapped;
                wrapped.outerNodeWrapped = wrapped;
                test.ok(wrapped.__outerNode__ === div);
                test.ok(wrapped.__innerNode__ === div);
                test.ok(wrapped.outerNode === div);
                test.ok(wrapped.innerNode === div);

                test.throws(function() { wrapped.outerNode = 123; }, domv.Exception);
                test.throws(function() { wrapped.innerNode = 123; }, domv.Exception);

                test.throws(function() { wrapped = new Component(123); }, domv.Exception);
                test.ok(this.document.doctype);
                test.throws(function() { wrapped = new Component(this.document.doctype); }.bind(this), domv.Exception);

                test.done();
        },
        'creation constructor': function(test)
        {
                var wrapped = new Component(this.document);
                test.strictEqual(wrapped.document, this.document);
                test.strictEqual(wrapped.outerNode.nodeName.toLowerCase(), 'div');

                wrapped = new Component(this.document, 'form');
                test.strictEqual(wrapped.document, this.document);
                test.strictEqual(wrapped.outerNode.nodeName.toLowerCase(), 'form');

                wrapped = new Component(this.document, '#text');
                test.strictEqual(wrapped.outerNode.nodeName, '#text');
                test.strictEqual(wrapped.outerNode.nodeType, domv.NodeType.TEXT);

                wrapped = new Component(this.document, '#comment');
                test.strictEqual(wrapped.outerNode.nodeName, '#comment');
                test.strictEqual(wrapped.outerNode.nodeType, domv.NodeType.COMMENT);

                wrapped = new Component(this.document, '#document-fragment');
                test.strictEqual(wrapped.outerNode.nodeName, '#document-fragment');
                test.strictEqual(wrapped.outerNode.nodeType, domv.NodeType.DOCUMENT_FRAGMENT);

                test.done();
        },
        'document attribute': function(test)
        {
                var doc = domv.wrap(this.document);
                var wrapped = doc.create('div');

                test.ok(wrapped.document === this.document);

                wrapped.document = null;
                test.ok(wrapped.document === null);

                wrapped.document = doc;
                test.ok(wrapped.document === this.document);

                test.throws(function() { wrapped.document = 123; }, domv.Exception);
                test.throws(function() { wrapped.document = this.document.createElement('div'); }.bind(this), domv.Exception);

                wrapped.document = domv.createHtmlDomDocument();
                test.ok(wrapped.document !== this.document);

                test.done();
        },
        'create()': function(test)
        {
                var doc = domv.wrap(this.document);

                test.throws(function(){ doc.create(); });
                test.strictEqual('',           doc.create('div').textContent);
                test.strictEqual('',           doc.create('div', 'a').textContent);
                test.strictEqual('a',          doc.create('div', 'a').getAttr('class'));
                test.strictEqual('b',          doc.create('div', 'a', 'b').textContent);
                test.strictEqual('bc',         doc.create('div', 'a', 'b', 'c').textContent);
                test.strictEqual('bcd',        doc.create('div', 'a', 'b', 'c', 'd').textContent);
                test.strictEqual('bcde',       doc.create('div', 'a', 'b', 'c', 'd', 'e').textContent);
                test.strictEqual('bcdef',      doc.create('div', 'a', 'b', 'c', 'd', 'e', 'f').textContent);
                test.strictEqual('bcdefg',     doc.create('div', 'a', 'b', 'c', 'd', 'e', 'f', 'g').textContent);
                test.strictEqual('bcdefgh',    doc.create('div', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h').textContent);
                test.strictEqual('bcdefghj',   doc.create('div', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j').textContent);
                test.strictEqual('bcdefghjk',  doc.create('div', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'k').textContent);
                test.strictEqual('bcdefghjkl', doc.create('div', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'k', 'l').textContent);

                test.done();
        },
        'text()':function(test)
        {
                var doc = domv.wrap(this.document);
                var wrapped;

                wrapped = doc.text();
                test.strictEqual(wrapped.outerNodeType, domv.NodeType.TEXT);
                test.strictEqual(wrapped.outerNode.data, '');

                wrapped = doc.text('foo');
                test.strictEqual(wrapped.outerNodeType, domv.NodeType.TEXT);
                test.strictEqual(wrapped.outerNode.data, 'foo');

                wrapped = doc.text('foo', 'bar');
                test.strictEqual(wrapped.outerNodeType, domv.NodeType.TEXT);
                test.strictEqual(wrapped.outerNode.data, 'foo bar');

                test.strictEqual(doc.text('foo', 'bar', 'baz').outerNode.data, 'foo bar baz');
                test.strictEqual(doc.text('foo', 'bar', 'baz', 'qux').outerNode.data, 'foo bar baz qux');
                test.strictEqual(doc.text('foo', 'bar', 'baz', 'qux', 'norf').outerNode.data, 'foo bar baz qux norf');
                test.strictEqual(doc.text('foo', 'bar', 'baz', 'qux', 'norf', ' alice').outerNode.data, 'foo bar baz qux norf  alice');
                test.strictEqual(doc.text('foo', 'bar', 'baz', 'qux', 'norf', ' alice', 'bob').outerNode.data, 'foo bar baz qux norf  alice bob');

                test.done();
        },
        'shorthand()': function(test)
        {
                var doc = domv.wrap(this.document);
                var div = doc.shorthand();
                var submit;
                var funky;
                var wrapped, wrapped2;

                wrapped = div();
                test.ok(wrapped.isDOMVComponent);
                test.strictEqual(wrapped.outerNode.nodeName.toLowerCase(), 'div');
                test.strictEqual(null, wrapped.outerNode.getAttribute('class'));

                div = domv.shorthand(doc, 'div');

                wrapped = div('Test');
                test.ok(wrapped.isDOMVComponent);
                test.strictEqual(wrapped.outerNode.nodeName.toLowerCase(), 'div');
                test.strictEqual('Test', wrapped.outerNode.getAttribute('class'));
                
                wrapped = div('');
                test.ok(wrapped.isDOMVComponent);
                test.strictEqual(wrapped.outerNode.nodeName.toLowerCase(), 'div');
                test.strictEqual(null, wrapped.outerNode.getAttribute('class'));

                wrapped = div('', null, null, null, null, null, null, null, null, null);
                test.ok(wrapped.isDOMVComponent);
                test.strictEqual(wrapped.outerNode.nodeName.toLowerCase(), 'div');
                test.strictEqual(null, wrapped.outerNode.getAttribute('class'));
                test.strictEqual(0, wrapped.outerNode.childNodes.length);

                wrapped = div({'data-test': 5}, null, null, null, null, null, null, null, null, null);
                test.ok(wrapped.isDOMVComponent);
                test.strictEqual(wrapped.outerNode.nodeName.toLowerCase(), 'div');
                test.strictEqual(null, wrapped.outerNode.getAttribute('class'));
                test.strictEqual(0, wrapped.outerNode.childNodes.length);
                test.strictEqual('5', wrapped.outerNode.getAttribute('data-test'));

                wrapped = div('Test', {'data-test': 5}, 'Hi!');
                test.ok(wrapped.isDOMVComponent);
                test.strictEqual(wrapped.outerNode.nodeName.toLowerCase(), 'div');
                test.strictEqual('Test', wrapped.outerNode.getAttribute('class'));
                test.strictEqual('5', wrapped.outerNode.getAttribute('data-test'));
                test.strictEqual('Hi!', wrapped.outerNode.textContent);
                test.strictEqual(1, wrapped.outerNode.childNodes.length);

                test.throws(function(){ domv.shorthand(1234, 'div'); }, domv.Exception);
                
                submit = doc.shorthand('input', {type: 'submit'}, {'data-test': 'bla'});
                wrapped = submit('Test123', {name: 'bla'});
                test.ok(wrapped.isDOMVComponent);
                test.strictEqual(wrapped.outerNode.nodeName.toLowerCase(), 'input');
                test.strictEqual(wrapped.outerNode.getAttribute('type'), 'submit');
                test.strictEqual(wrapped.outerNode.getAttribute('data-test'), 'bla');
                test.strictEqual(wrapped.outerNode.getAttribute('class'), 'Test123');
                test.strictEqual(wrapped.outerNode.getAttribute('name'), 'bla');
                
                wrapped = submit({'data-test': 'abc'});
                test.ok(wrapped.isDOMVComponent);
                test.strictEqual(wrapped.outerNode.nodeName.toLowerCase(), 'input');
                test.strictEqual(wrapped.outerNode.getAttribute('type'), 'submit');
                test.strictEqual(wrapped.outerNode.getAttribute('data-test'), 'abc');

                funky = doc.shorthand('li', this.document.createElement('img'), 'hi!', [doc.create('p', doc.create('span'))]);
                wrapped = funky('myclass', 'some text');
                wrapped2 = funky('myclass', 'some text'); // if cloneNode is not used, a second call will mess things up

                test.ok(wrapped.isDOMVComponent);
                test.strictEqual(wrapped.outerNode.getAttribute('class'), 'myclass');
                test.strictEqual(wrapped.outerNode.childNodes[0].nodeName.toLowerCase(), 'img');
                test.strictEqual(wrapped.outerNode.childNodes[1].nodeName.toLowerCase(), '#text');
                test.strictEqual(wrapped.outerNode.childNodes[2].nodeName.toLowerCase(), 'p');
                test.strictEqual(wrapped.outerNode.childNodes[2].firstChild.nodeName.toLowerCase(), 'span'); // test deep clone
                test.strictEqual(wrapped.outerNode.childNodes[3].nodeName.toLowerCase(), '#text');

                test.ok(wrapped.isDOMVComponent);
                test.strictEqual(wrapped2.outerNode.getAttribute('class'), 'myclass');
                test.strictEqual(wrapped2.outerNode.childNodes[0].nodeName.toLowerCase(), 'img');
                test.strictEqual(wrapped2.outerNode.childNodes[1].nodeName.toLowerCase(), '#text');
                test.strictEqual(wrapped2.outerNode.childNodes[2].nodeName.toLowerCase(), 'p');
                test.strictEqual(wrapped2.outerNode.childNodes[2].firstChild.nodeName.toLowerCase(), 'span'); // test deep clone
                test.strictEqual(wrapped2.outerNode.childNodes[3].nodeName.toLowerCase(), '#text');
                test.ok(wrapped.outerNode.childNodes[0] !== wrapped2.outerNode.childNodes[0]);

                test.strictEqual('',            doc.shorthand()().textContent);
                test.strictEqual('',            doc.shorthand('div')().textContent);
                test.strictEqual('a',           doc.shorthand('div', 'a')().textContent);
                test.strictEqual(null,          doc.shorthand('div', 'a')().getAttr('class'));
                test.strictEqual('ab',          doc.shorthand('div', 'a', 'b')().textContent);
                test.strictEqual('abc',         doc.shorthand('div', 'a', 'b', 'c')().textContent);
                test.strictEqual('abcd',        doc.shorthand('div', 'a', 'b', 'c', 'd')().textContent);
                test.strictEqual('abcde',       doc.shorthand('div', 'a', 'b', 'c', 'd', 'e')().textContent);
                test.strictEqual('abcdef',      doc.shorthand('div', 'a', 'b', 'c', 'd', 'e', 'f')().textContent);
                test.strictEqual('abcdefg',     doc.shorthand('div', 'a', 'b', 'c', 'd', 'e', 'f', 'g')().textContent);
                test.strictEqual('abcdefgh',    doc.shorthand('div', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h')().textContent);
                test.strictEqual('abcdefghj',   doc.shorthand('div', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j')().textContent);
                test.strictEqual('abcdefghjk',  doc.shorthand('div', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'k')().textContent);
                test.strictEqual('abcdefghjkl', doc.shorthand('div', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'k', 'l')().textContent);

                test.done();
        },
        'shorthand() cached': function(test)
        {
                var doc = domv.wrap(this.document);
                var doc2 = domv.wrap(domv.createHtmlDomDocument(true));

                test.ok(doc.shorthand('div') === doc.shorthand('div'));
                test.ok(doc.shorthand('foo') === doc.shorthand('foo'));
                test.ok(doc.shorthand('div') !== doc.shorthand('foo'));

                test.ok(doc.shorthand('div') !== doc2.shorthand('div'));
                test.ok(doc.shorthand('foo') !== doc2.shorthand('foo'));
                test.done();
        },
        'textShorthand()': function(test)
        {
                var doc = domv.wrap(this.document);
                var text = doc.textShorthand();
                var wrapped;

                wrapped = text();
                test.ok(wrapped.isDOMVComponent);
                test.strictEqual('', wrapped.outerNode.data);
                test.strictEqual('', wrapped.outerNode.textContent);

                wrapped = text('Hello!');
                test.ok(wrapped.isDOMVComponent);
                test.strictEqual('Hello!', wrapped.outerNode.data);
                test.strictEqual('Hello!', wrapped.outerNode.textContent);

                wrapped = text(null);
                test.ok(wrapped.isDOMVComponent);
                test.strictEqual('null', wrapped.outerNode.data);
                test.strictEqual('null', wrapped.outerNode.textContent);

                wrapped = text('Foo', 5, 'bar', {toString: function(){ return 'baz'; }});
                test.ok(wrapped.isDOMVComponent);
                test.strictEqual('Foo 5 bar baz', wrapped.outerNode.data);
                test.strictEqual('Foo 5 bar baz', wrapped.outerNode.textContent);

                test.done();
        },
        'textShorthand() cached': function(test)
        {
                var doc = domv.wrap(this.document);
                var doc2 = domv.wrap(domv.createHtmlDomDocument(true));

                test.ok(doc.textShorthand() === doc.textShorthand());
                test.ok(doc.textShorthand() !== doc2.textShorthand());
                test.done();
        },
        'appendChild()': function(test)
        {
                var doc = domv.wrap(this.document);
                var div = doc.shorthand('div');
                var p = doc.shorthand('p');

                var wrapped = div();
                wrapped.appendChild(this.document.createElement('h1'));
                wrapped.appendChild(domv.create(this.document, 'h2'));
                wrapped.appendChild(this.document.createElement('h3'), domv.create(this.document, 'h4'));

                test.strictEqual('h1', wrapped.firstChild.outerNode.nodeName.toLowerCase());
                test.strictEqual('h2', wrapped.firstChild.nextSibling.outerNode.nodeName.toLowerCase());
                test.strictEqual('h3', wrapped.childNodes[2].outerNode.nodeName.toLowerCase());
                test.strictEqual('h4', wrapped.lastChild.outerNode.nodeName.toLowerCase());

                var testComponent = new TestComponent(this.document);
                wrapped.appendChild(testComponent);

                testComponent.appendChild(p('', 'Some text bla bla'));

                test.strictEqual('TestComponent', wrapped.lastChild.getAttr('class'));
                test.strictEqual('p', testComponent.content.firstChild.outerNode.nodeName.toLowerCase());

                wrapped = div();
                wrapped.appendChild('Hello');
                test.strictEqual(wrapped.textContent, 'Hello');
                test.strictEqual(wrapped.firstChild.outerNode.data, 'Hello');

                test.throws(function()
                {
                        domv.wrap(this.document.createTextNode('foo')).appendChild(div());
                }.bind(this), domv.Exception);

                test.throws(function()
                {
                        domv.wrap(this.document.createTextNode('foo')).appendChild(this.document.createElement('div'));
                }.bind(this), domv.Exception);

                test.done();
        },
        'prependChild()': function(test)
        {
                var doc = domv.wrap(this.document);
                var div = doc.shorthand('div');
                var p = doc.shorthand('p');
                var wrapped = div();
                var testComponent;

                wrapped.prependChild(this.document.createElement('h4'));
                wrapped.prependChild(domv.create(this.document, 'h3'));
                wrapped.prependChild(this.document.createElement('h1'), domv.create(this.document, 'h2'));

                test.strictEqual('h1', wrapped.firstChild.outerNode.nodeName.toLowerCase());
                test.strictEqual('h2', wrapped.firstChild.nextSibling.outerNode.nodeName.toLowerCase());
                test.strictEqual('h3', wrapped.childNodes[2].outerNode.nodeName.toLowerCase());
                test.strictEqual('h4', wrapped.lastChild.outerNode.nodeName.toLowerCase());

                testComponent = new TestComponent(this.document);
                wrapped.prependChild(testComponent);

                testComponent.prependChild(p('', 'Some text bla bla'));

                test.strictEqual('TestComponent', wrapped.firstChild.getAttr('class'));
                test.strictEqual('p', testComponent.content.firstChild.outerNode.nodeName.toLowerCase());

                wrapped = div();
                wrapped.prependChild('Hello');
                test.strictEqual(wrapped.textContent, 'Hello');
                test.strictEqual(wrapped.firstChild.outerNode.data, 'Hello');

                test.throws(function()
                {
                        domv.wrap(this.document.createTextNode('foo')).prependChild(div());
                }.bind(this), domv.Exception);

                test.throws(function()
                {
                        domv.wrap(this.document.createTextNode('foo')).prependChild(this.document.createElement('div'));
                }.bind(this), domv.Exception);

                test.done();
        },
        'siblingBefore()': function(test)
        {
                var doc = domv.wrap(this.document);
                var div = doc.shorthand('div');
                var wrapped;
                var container = div(wrapped = div());

                wrapped.siblingBefore(this.document.createElement('h1'));
                wrapped.siblingBefore(domv.create(this.document, 'h2'));
                wrapped.siblingBefore(this.document.createElement('h3'), domv.create(this.document, 'h4'));
                wrapped.siblingBefore('Some text');

                test.strictEqual('h1', container.firstChild.outerNode.nodeName.toLowerCase());
                test.strictEqual('h2', container.firstChild.nextSibling.outerNode.nodeName.toLowerCase());
                test.strictEqual('h3', container.childNodes[2].outerNode.nodeName.toLowerCase());
                test.strictEqual('h4', container.childNodes[3].outerNode.nodeName.toLowerCase());
                test.strictEqual('Some text', container.childNodes[4].outerNode.data);
                test.strictEqual('div', container.lastChild.outerNode.nodeName.toLowerCase());

                test.throws(function()
                {
                        domv.wrap(this.document.createTextNode('foo')).siblingBefore(div());
                }.bind(this), domv.Exception);

                test.throws(function()
                {
                        domv.wrap(this.document.createTextNode('foo')).siblingBefore(this.document.createElement('div'));
                }.bind(this), domv.Exception);

                test.done();
        },
        'siblingAfter()': function(test)
        {
                var doc = domv.wrap(this.document);
                var div = doc.shorthand('div');
                var wrapped;
                var container = div(wrapped = div());

                wrapped.siblingAfter(this.document.createElement('h4'));
                wrapped.siblingAfter('Some text');
                wrapped.siblingAfter(domv.create(this.document, 'h3'));
                wrapped.siblingAfter(this.document.createElement('h1'), domv.create(this.document, 'h2'));

                test.strictEqual('div', container.firstChild.outerNode.nodeName.toLowerCase());
                test.strictEqual('h1', container.firstChild.nextSibling.outerNode.nodeName.toLowerCase());
                test.strictEqual('h2', container.childNodes[2].outerNode.nodeName.toLowerCase());
                test.strictEqual('h3', container.childNodes[3].outerNode.nodeName.toLowerCase());
                test.strictEqual('Some text', container.childNodes[4].outerNode.data);
                test.strictEqual('h4', container.lastChild.outerNode.nodeName.toLowerCase());

                test.throws(function()
                {
                        domv.wrap(this.document.createTextNode('foo')).siblingAfter(div());
                }.bind(this), domv.Exception);

                test.throws(function()
                {
                        domv.wrap(this.document.createTextNode('foo')).siblingAfter(this.document.createElement('div'));
                }.bind(this), domv.Exception);

                test.done();
        },
        'removeNode()': function(test)
        {
                var doc = domv.wrap(this.document);
                var div = doc.shorthand('div');
                var wrapped;
                var container = div(wrapped = div());

                wrapped.removeNode();
                test.strictEqual(null, wrapped.parentNode);
                test.strictEqual(null, container.firstChild);

                test.done();
        },
        'removeChildren()': function(test)
        {
                var doc = domv.wrap(this.document);
                var div = doc.shorthand('div');
                var wrapped;
                var container = div(wrapped = div(), div(), 'bla');

                container.removeChildren();
                test.strictEqual(null, wrapped.parentNode);
                test.strictEqual(null, container.firstChild);

                container.innerNode = null;
                test.doesNotThrow(function() { container.removeChildren(); });

                test.done();
        },
        'className methods': function(test)
        {
                var doc = domv.wrap(this.document);
                var div = doc.shorthand('div');
                var wrapped = div();
                var text = domv.text(this.document, 'some text bla');

                wrapped.cls('abc').addClass('def');
                test.strictEqual('abc def', wrapped.getAttr('class'));

                wrapped.addClass('def');
                test.strictEqual('abc def', wrapped.getAttr('class'));

                wrapped.removeClass('notpresent')
                       .removeClass('abc');

                test.strictEqual('def', wrapped.getAttr('class'));

                test.strictEqual(true, wrapped.hasClass('def'));
                test.strictEqual(false, wrapped.hasClass('abc'));
                test.doesNotThrow(function() { wrapped.assertHasClass('def'); }, domv.Exception);
                test.throws(function() { wrapped.assertHasClass('abc'); }, domv.Exception);


                wrapped.toggleClass('ghj');
                test.strictEqual('def ghj', wrapped.getAttr('class'));

                test.strictEqual(true, wrapped.hasClass('def', 'ghj'));
                test.strictEqual(false, wrapped.hasClass('abc', 'def'));
                test.doesNotThrow(function() { wrapped.assertHasClass('def', 'ghj'); }, domv.Exception);
                test.throws(function() { wrapped.assertHasClass('abc', 'ghj', 'klm'); }, domv.Exception);

                wrapped.toggleClass('def');
                test.strictEqual('ghj', wrapped.getAttr('class'));

                wrapped.toggleClass('ghj', true);
                test.strictEqual('ghj', wrapped.getAttr('class'));

                wrapped.toggleClass('abc', false);
                test.strictEqual('ghj', wrapped.getAttr('class'));

                wrapped.toggleClass('abc', true);
                wrapped.toggleClass('abc', true);
                test.strictEqual('ghj abc', wrapped.getAttr('class'));

                test.throws(function(){ text.addClass('abc'); }, domv.Exception);
                test.throws(function(){ text.removeClass('abc'); }, domv.Exception);
                test.ok(!text.hasClass('abc'));
                test.throws(function(){ text.toggleClass('abc'); }, domv.Exception);

                // empty string & spaces is not allowed
                test.throws(function(){ wrapped.hasClass(''); });
                test.throws(function(){ wrapped.addClass(''); });
                test.throws(function(){ wrapped.removeClass(''); });

                test.throws(function(){ wrapped.hasClass('abc def'); });
                test.throws(function(){ wrapped.addClass('abc def'); });
                test.throws(function(){ wrapped.removeClass('abc def'); });

                test.done();
        },
        'attr()': function(test)
        {
                var doc = domv.wrap(this.document);
                var div = doc.shorthand('div');
                var wrapped = div();
                var obj;
                var text = domv.text(this.document, 'some text bla');

                wrapped.attr('abc', '123');
                test.strictEqual('123', wrapped.getAttr('abc'));
                test.strictEqual('123', wrapped.outerNode.getAttribute('abc'));

                wrapped.attr({
                        'abc': 456,
                        'def': '789'
                });

                test.strictEqual('456', wrapped.getAttr('abc'));
                test.strictEqual('789', wrapped.getAttr('def'));

                wrapped.attr('ghj', true);
                test.strictEqual('ghj', wrapped.getAttr('ghj'));

                wrapped.attr('ghj', false);
                test.strictEqual(null, wrapped.getAttr('ghj'));

                wrapped.attr('ghj', {'a': [1,'2', true],'abcdef': 'qwerty'});
                test.strictEqual('{"a":[1,"2",true],"abcdef":"qwerty"}', wrapped.getAttr('ghj'));
                obj = wrapped.getAttr('ghj', true);
                test.ok(obj &&
                        obj.a &&
                        obj.a[0] === 1 &&
                        obj.a[1] === '2' &&
                        obj.a[2] === true &&
                        obj.abcdef === 'qwerty');

                test.throws(function(){ text.attr('abc', 'def'); }, domv.Exception);
                test.ok(text.getAttr('something') === null);

                test.done();
        },
        'selector methods': function(test)
        {
                var doc = domv.wrap(this.document);
                var div = doc.shorthand('div');
                var text = domv.text(this.document, 'some text bla');

                var def;
                var wrapped = div(
                        div('abc',
                                div('zyx'),
                                div('wvu first')
                        ),
                        def = div('def',
                                div('wvu'),
                                div('tsr')
                        ),
                        div('ghj'),
                        div('klm')
                );
                var wrapped2;

                test.ok(wrapped.selector('.wvu').hasClass('first'));
                wrapped2 = wrapped.selector('.wvu', SimpleComponent, 'bla', 5);
                test.ok(wrapped2 instanceof domv.Component);
                test.ok(wrapped2 instanceof SimpleComponent);
                test.strictEqual(wrapped2.firstArg, 'bla');
                test.strictEqual(wrapped2.secondArg, 5);

                wrapped2 = wrapped.assertSelector('.wvu', SimpleComponent, 'bla', 5);
                test.ok(wrapped2 instanceof domv.Component);
                test.ok(wrapped2 instanceof SimpleComponent);
                test.strictEqual(wrapped2.firstArg, 'bla');
                test.strictEqual(wrapped2.secondArg, 5);

                test.strictEqual(2, wrapped.selectorAll('.wvu').length);
                wrapped2 = wrapped.selectorAll('.wvu', SimpleComponent, 'bla', 5);
                test.ok(wrapped2[0] instanceof domv.Component);
                test.ok(wrapped2[0] instanceof SimpleComponent);
                test.strictEqual(wrapped2[0].firstArg, 'bla');
                test.strictEqual(wrapped2[0].secondArg, 5);
                test.ok(wrapped2[1] instanceof domv.Component);
                test.ok(wrapped2[1] instanceof SimpleComponent);
                test.strictEqual(wrapped2[1].firstArg, 'bla');
                test.strictEqual(wrapped2[1].secondArg, 5);
                test.ok(wrapped2[0] !== wrapped2[1]);

                test.ok(wrapped.selector('> .abc'));
                test.strictEqual(null, wrapped.selector('> .wvu'));
                test.doesNotThrow(function() { test.ok(wrapped.assertSelector('> .abc')); }, domv.Exception);
                test.throws(function() { wrapped.assertSelector('> .wvu'); }, domv.Exception);

                test.strictEqual(0, wrapped.selectorAll('> .wvu').length);
                test.strictEqual(1, wrapped.selectorAll('> .abc').length);


                wrapped.attr('id', 'fixedid');

                test.ok(wrapped.selector('.wvu').hasClass('first'));
                test.strictEqual(2, wrapped.selectorAll('.wvu').length);

                test.strictEqual(null, wrapped.selector('> .wvu'));
                test.ok(wrapped.selector('> .abc'));

                test.strictEqual(0, wrapped.selectorAll('> .wvu').length);
                test.strictEqual(1, wrapped.selectorAll('> .abc').length);

                test.ok(text.selector('something') === null);
                test.strictEqual(0, text.selectorAll('something').length);

                wrapped.innerNode = def;
                test.ok(!wrapped.selector('> .abc'));
                test.ok(wrapped.selector('> .wvu'));

                test.done();
        },
        'selector constructor args': function(test)
        {
                var doc = domv.wrap(this.document);
                function Foo(node)
                {
                        var i;
                        domv.Component.call(this, node);

                        this.sum = 0;

                        for (i = 1; i < arguments.length; ++i)
                        {
                                this.sum += arguments[i]; // + undefined = NaN
                        }
                }
                require('inherits')(Foo, domv.Component);

                function bla(n)
                {
                        return n * (n + 1) / 2;
                }

                var divNode;
                var wrapped = doc.create('div',
                        divNode =  doc.create('div')
                );

                test.ok(wrapped.selector('> div', Foo).outerNode === divNode.outerNode);
                test.strictEqual(wrapped.selector('> div', Foo).sum                           , bla(0));
                test.strictEqual(wrapped.selector('> div', Foo, 1).sum                        , bla(1));
                test.strictEqual(wrapped.selector('> div', Foo, 1, 2).sum                     , bla(2));
                test.strictEqual(wrapped.selector('> div', Foo, 1, 2, 3).sum                  , bla(3));
                test.strictEqual(wrapped.selector('> div', Foo, 1, 2, 3, 4).sum               , bla(4));
                test.strictEqual(wrapped.selector('> div', Foo, 1, 2, 3, 4, 5).sum            , bla(5));
                test.strictEqual(wrapped.selector('> div', Foo, 1, 2, 3, 4, 5, 6).sum         , bla(6));
                test.strictEqual(wrapped.selector('> div', Foo, 1, 2, 3, 4, 5, 6, 7).sum      , bla(7));
                test.strictEqual(wrapped.selector('> div', Foo, 1, 2, 3, 4, 5, 6, 7, 8).sum   , bla(8));
                test.strictEqual(wrapped.selector('> div', Foo, 1, 2, 3, 4, 5, 6, 7, 8, 9).sum, bla(9));
                test.strictEqual(wrapped.selector('> div', Foo, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10).sum, bla(10));
                test.throws(function(){ wrapped.selector('> div', Foo, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11); }, domv.Exception);


                test.done();
        },
        'selector with escaping': function(test)
        {
                var doc = domv.wrap(this.document);
                var div = doc.shorthand('div');
                var wrapped;

                function testSelector(selector, className)
                {
                        var result = wrapped.selectorAll(selector);
                        test.strictEqual(1, result.length);
                        test.strictEqual(className, result[0] && result[0].getAttr('class'));

                        result = wrapped.selector(selector);
                        test.ok(!!result);
                        test.strictEqual(className, result && result.getAttr('class'));
                }

                wrapped = div(
                        div('abc',
                            div('zyx', {'test': 'foo"bar'}),
                            div('wvu', {'test': 'foo\\bar'})
                        ),
                        div('def',
                                  div('pqe', {'test': 'foo\nbar'}),
                                  div('tsr', {'test': 'foo\rbar'})
                        ),
                        div('ghj', {'test': 'foo\ud852\udf62bar'}),
                        div('klm', {'test': 'foo]bar'})
                );

                testSelector('div[test='+domv.cssStringEscape('foo"bar')+']', 'zyx');
                testSelector('div[test='+domv.cssStringEscape('foo\\bar')+']', 'wvu');
                testSelector('div[test='+domv.cssStringEscape('foo\nbar')+']', 'pqe');
                testSelector('div[test='+domv.cssStringEscape('foo\rbar')+']', 'tsr');
                testSelector('div[test='+domv.cssStringEscape('foo\ud852\udf62bar')+']', 'ghj');
                testSelector('div[test='+domv.cssStringEscape('foo]bar')+']', 'klm');

                testSelector('div[test=foo\\"bar]', 'zyx');
                testSelector('div[test=foo\\\\bar]', 'wvu');
                testSelector('div[test=foo\\a bar]', 'pqe');
                testSelector('div[test=foo\\00000d bar]', 'tsr');
                testSelector('div[test=foo\\24B62 bar]', 'ghj');
                testSelector('div[test=f\\o\\o\\24B62 ba\\r]', 'ghj');
                testSelector('div[test=foo\\]bar]', 'klm');
                test.done();
        },
        'adoptAllAttributes()': function(test)
        {
                var doc = domv.wrap(this.document);
                var div = doc.shorthand('div');
                var wrapped = div({
                        'abc': 456,
                        'def': '789'
                });
                var second = div({'def': 'bla'});

                second.adoptAllAttributes(wrapped);

                test.strictEqual('456', second.getAttr('abc'));
                test.strictEqual('789', second.getAttr('def'));

                wrapped.attr('ghj', '123');

                test.strictEqual(null, second.getAttr('ghj'));
                second.adoptAllAttributes(wrapped.outerNode);
                test.strictEqual('123', second.getAttr('ghj'));

                test.throws(function()
                {
                        second.adoptAllAttributes(this.document.createTextNode('foo'));
                }.bind(this), domv.Exception);

                test.throws(function()
                {
                        domv.text(this.document, '').adoptAllAttributes(wrapped);
                }.bind(this), domv.Exception);

                test.done();
        },
        'swapNode()': function(test)
        {
                var doc = domv.wrap(this.document);
                var div = doc.shorthand('div');
                var def;
                var wrapped = div(
                        div('abc',
                                div('zyx'),
                                div('wvu first')
                        ),
                        def = div('def',
                                div('wvu'),
                                div('tsr')
                        ),
                        div('ghj'),
                        div('klm')
                );
                var newNode = div('newnewnew');

                def.swapNode(newNode);

                test.equals(null, def.parentNode);
                test.equals(0, def.childNodes.length);
                test.equals(wrapped.outerNode, newNode.parentNode.outerNode);
                test.equals(2, newNode.childNodes.length);
                test.ok(newNode.childNodes[0].hasClass('wvu'));
                test.ok(newNode.childNodes[1].hasClass('tsr'));
                test.ok(newNode.previousSibling.hasClass('abc'));
                test.ok(newNode.nextSibling.hasClass('ghj'));


                // without a parent
                def = div('def',
                        div('wvu'),
                        div('tsr')
                );

                newNode = div('newnewnew');
                def.swapNode(newNode);

                test.equals(null, def.parentNode);
                test.equals(0, def.childNodes.length);
                test.equals(null, newNode.parentNode);
                test.equals(2, newNode.childNodes.length);
                test.ok(newNode.childNodes[0].hasClass('wvu'));
                test.ok(newNode.childNodes[1].hasClass('tsr'));


                wrapped = div(
                        div('abc',
                                div('zyx'),
                                div('wvu first')
                        ),
                        def = div('def',
                                div('wvu'),
                                div('tsr')
                        ),
                        div('ghj'),
                        div('klm')
                );
                def.swapNode();

                test.equals(null, def.parentNode);
                test.equals(0, def.childNodes.length);
                test.ok(wrapped.childNodes[0].hasClass('abc'));
                test.ok(wrapped.childNodes[1].hasClass('wvu'));
                test.ok(wrapped.childNodes[2].hasClass('tsr'));
                test.ok(wrapped.childNodes[3].hasClass('ghj'));
                test.ok(wrapped.childNodes[4].hasClass('klm'));

                wrapped = div(
                        div('abc',
                                div('zyx'),
                                div('wvu first')
                        ),
                        def = div('def',
                                div('wvu'),
                                div('tsr')
                        ),
                        div('ghj'),
                        div('klm')
                );
                def.swapNode(def);

                test.ok(wrapped.childNodes[0].hasClass('abc'));
                test.ok(wrapped.childNodes[1].hasClass('def'));
                test.ok(wrapped.childNodes[2].hasClass('ghj'));
                test.ok(wrapped.childNodes[3].hasClass('klm'));

                test.equals(2, def.childNodes.length);
                test.ok(def.childNodes[0].hasClass('wvu'));
                test.ok(def.childNodes[1].hasClass('tsr'));

                test.done();
        },
        'isAllWhiteSpace()': function(test)
        {
                var doc = domv.wrap(this.document);
                var div = doc.shorthand('div');
                var img = doc.shorthand('img');
                var wrapped;

                wrapped = div('testDiv', '     \t   \n\r');
                test.ok(wrapped.isAllWhiteSpace());

                wrapped = div('testDiv', '');
                test.ok(wrapped.isAllWhiteSpace());

                wrapped = div('testDiv', ' Hi');
                test.ok(!wrapped.isAllWhiteSpace());

                wrapped = div('testDiv', '   ', div());
                test.ok(!wrapped.isAllWhiteSpace());

                wrapped = div('testDiv', '   ', div());
                test.ok(wrapped.isAllWhiteSpace(true));

                wrapped = div('testDiv', '   ', div(' '));
                test.ok(wrapped.isAllWhiteSpace(true));

                wrapped = div('testDiv', '   ', div('', '   Hi '));
                test.ok(!wrapped.isAllWhiteSpace(true));

                wrapped = div('testDiv', '   ', img(), '');
                test.ok(!wrapped.isAllWhiteSpace(true));

                wrapped = div('testDiv', '   ', this.document.createComment('hmm'));
                test.ok(wrapped.isAllWhiteSpace());

                // these are never whitespace
                test.ok(!doc.create('audio').isAllWhiteSpace());
                test.ok(!doc.create('button').isAllWhiteSpace());
                test.ok(!doc.create('canvas').isAllWhiteSpace());
                test.ok(!doc.create('embed').isAllWhiteSpace());
                test.ok(!doc.create('figure').isAllWhiteSpace());
                test.ok(!doc.create('hr').isAllWhiteSpace());
                test.ok(!doc.create('iframe').isAllWhiteSpace());
                test.ok(!doc.create('img').isAllWhiteSpace());
                test.ok(!doc.create('input').isAllWhiteSpace());
                test.ok(!doc.create('object').isAllWhiteSpace());
                test.ok(!doc.create('video').isAllWhiteSpace());

                test.done();
        },
        'node getters': function(test)
        {
                var doc = domv.wrap(this.document);
                var div = doc.shorthand('div');
                var def;
                var wrapped = div('outer',
                        'texta',
                        div('abc'),
                        'textb',
                        def = div('def',
                                'text1',
                                div('wvu'),
                                'text2',
                                div('tsr'),
                                'text3'
                        ),
                        'textc',
                        div('ghj'),
                        div('klm')
                );

                test.strictEqual(2, def.children.length);

                test.ok(def.children[1].hasClass('tsr'));

                test.strictEqual(5, def.childNodes.length);
                test.strictEqual('text1', def.childNodes[0].textContent);
                test.ok(def.childNodes[3].hasClass('tsr'));

                test.strictEqual('text1', def.firstChild.textContent);
                test.strictEqual('text3', def.lastChild.textContent);

                test.ok(def.firstElementChild.hasClass('wvu'));
                test.ok(def.lastElementChild.hasClass('tsr'));

                test.strictEqual('textb', def.previousSibling.textContent);
                test.strictEqual('textc', def.nextSibling.textContent);

                test.ok(def.previousElementSibling.hasClass('abc'));
                test.ok(def.nextElementSibling.hasClass('ghj'));

                test.ok(def.parentNode.hasClass('outer'));

                test.strictEqual('textatextbtext1text2text3textc', wrapped.textContent);
                wrapped.textContent = 'Hello!';
                test.strictEqual('Hello!', wrapped.textContent);
                test.strictEqual(1, wrapped.childNodes.length);
                test.strictEqual(domv.NodeType.TEXT, wrapped.firstChild.outerNodeType);
                test.strictEqual(domv.NodeType.TEXT, wrapped.firstChild.innerNodeType);
                test.strictEqual('#text', wrapped.firstChild.outerNodeName);
                test.strictEqual('#text', wrapped.firstChild.innerNodeName);
                test.strictEqual(domv.NodeType.ELEMENT, wrapped.outerNodeType);
                test.strictEqual(domv.NodeType.ELEMENT, wrapped.innerNodeType);
                test.strictEqual('div', wrapped.outerNodeName);
                test.strictEqual('div', wrapped.innerNodeName);

                wrapped = div();
                wrapped.innerNode = null;
                test.strictEqual(undefined, wrapped.innerNodeName);

                test.done();
        },
        'child operation on something that is not an Element': function(test)
        {
                var doc = domv.wrap(this.document);
                var div = doc.shorthand('div');
                var text = domv.text(this.document, 'bla');
                var comp = domv.create(this.document, 'div');

                comp.innerNode = null;

                test.ok(text.isDOMVComponent);
                test.ok(comp.isDOMVComponent);

                test.throws(function(){ text.appendChild(div()); }, domv.Exception);
                test.throws(function(){ comp.appendChild(div()); }, domv.Exception);
                test.throws(function(){ text.prependChild(div()); }, domv.Exception);
                test.throws(function(){ comp.prependChild(div()); }, domv.Exception);
                test.throws(function(){ div(div()).swapNode(text); }, domv.Exception);
                test.throws(function(){ div(div()).swapNode(comp); }, domv.Exception);
                test.doesNotThrow(function(){ text.swapNode(div(div())); });
                test.doesNotThrow(function(){ comp.swapNode(div(div())); });
                test.strictEqual(text.children.length, 0);
                test.strictEqual(comp.children.length, 0);
                test.strictEqual(text.childNodes.length, 0);
                test.strictEqual(comp.childNodes.length, 0);
                test.strictEqual(text.firstChild, null);
                test.strictEqual(comp.firstChild, null);
                test.strictEqual(text.lastChild, null);
                test.strictEqual(comp.lastChild, null);
                test.strictEqual(text.firstElementChild, undefined);
                test.strictEqual(comp.firstElementChild, undefined);
                test.strictEqual(text.lastElementChild, undefined);
                test.strictEqual(comp.lastElementChild, undefined);
                test.strictEqual(text.innerNodeType, domv.NodeType.TEXT);
                test.strictEqual(comp.innerNodeType, undefined);

                test.done();
        },
        'isEmpty': function(test)
        {
                var doc = domv.wrap(this.document);
                var div = doc.shorthand('div');
                var node;

                test.strictEqual(true, div().isEmpty);
                test.strictEqual(true, div('myClass').isEmpty);
                test.strictEqual(false, div('myClass', 'Some text content').isEmpty);
                test.strictEqual(false, div('myClass', ' ').isEmpty);

                test.strictEqual(true, domv.text(this.document, '').isEmpty);
                test.strictEqual(false, domv.text(this.document, 'bla').isEmpty);

                test.strictEqual(true, domv.wrap(this.document.createComment('')).isEmpty);
                test.strictEqual(false, domv.wrap(this.document.createComment('bla')).isEmpty);

                node = domv.wrap(this.document.createDocumentFragment());
                test.strictEqual(true, node.isEmpty);
                node.appendChild(div());
                test.strictEqual(false, node.isEmpty);

                node = div('myClass', div());
                node.innerNode = null;
                test.strictEqual(true, node.isEmpty);

                test.done();
        },
        'equality methods': function(test)
        {
                var div = this.document.createElement('div');
                var span = this.document.createElement('span');
                var wrapped = domv.wrap(div);

                test.ok(wrapped.isOuterNodeEqual(div));
                test.ok(wrapped.isInnerNodeEqual(div));
                test.ok(wrapped.isNodeEqual(div));
                test.ok(!wrapped.isOuterNodeEqual(span));
                test.ok(!wrapped.isInnerNodeEqual(span));
                test.ok(!wrapped.isNodeEqual(span));
                test.ok(wrapped.isOuterNodeEqual(wrapped));
                test.ok(wrapped.isInnerNodeEqual(wrapped));
                test.ok(wrapped.isNodeEqual(wrapped));

                wrapped.innerNode = null; // do not allow children
                test.ok(wrapped.isOuterNodeEqual(div));
                test.ok(wrapped.isInnerNodeEqual(null));
                test.ok(wrapped.isNodeEqual(div));
                test.ok(!wrapped.isOuterNodeEqual(span));
                test.ok(!wrapped.isInnerNodeEqual(span));
                test.ok(!wrapped.isNodeEqual(span));
                test.ok(wrapped.isOuterNodeEqual(wrapped));
                test.ok(wrapped.isNodeEqual(wrapped));

                wrapped.innerNode = span;
                test.ok(wrapped.isOuterNodeEqual(div));
                test.ok(wrapped.isInnerNodeEqual(span));
                test.ok(!wrapped.isNodeEqual(div));
                test.ok(!wrapped.isNodeEqual(span));
                test.ok(wrapped.isOuterNodeEqual(wrapped));
                test.ok(wrapped.isInnerNodeEqual(wrapped));
                test.ok(wrapped.isOuterNodeEqual(domv.wrap(div)));
                test.ok(wrapped.isInnerNodeEqual(domv.wrap(span)));

                test.done();
        },
        'local event methods': function(test)
        {
                var doc = domv.wrap(this.document);
                var div = doc.shorthand('div');
                var wrapped = div();
                var shouldFire;

                var listener = function(arg1)
                {
                        test.ok(shouldFire);
                        test.ok(this === wrapped);
                        test.ok(arg1 === 'foo');
                };

                var failListener = function()
                {
                        test.ok(false);
                };

                test.expect(15);
                wrapped.addLocalListener('abc', failListener);
                wrapped.addLocalListener('test', listener);
                wrapped.addListener('test2', listener); // using domv.isDOMEvent() -> false
                wrapped.addLocalListener('def', failListener);
                wrapped.removeLocalListener('somethingelse', listener); // should have no effect
                wrapped.removeLocalListener('abc', failListener);
                wrapped.removeLocalListener('def', failListener);
                wrapped.removeLocalListener('def', failListener);
                wrapped.removeLocalListener('def', failListener);
                wrapped.removeLocalListener('def', failListener);
                wrapped.removeLocalListener('test', function(){}); // should have no effect
                wrapped.removeDomListener('test', listener, false); // should have no effect
                wrapped.removeDomListener('test', listener, true); // should have no effect

                shouldFire = true;
                test.ok(wrapped.emitLocal('test', 'foo'));
                test.ok(wrapped.emitLocal('test2', 'foo'));

                wrapped.removeLocalListener('test', listener);
                wrapped.removeListener('test2', listener);
                shouldFire = false;
                test.ok(!wrapped.emitLocal('test', 'asdf'));
                test.ok(!wrapped.emitLocal('test2', 'asdf'));

                shouldFire = true;
                wrapped.addLocalOnce('testonce', listener);
                test.ok(wrapped.emitLocal('testonce', 'foo'));
                shouldFire = false;
                test.ok(!wrapped.emitLocal('testonce', 'foo'));

                test.done();
        },
        'DOM Event capture phase': function(test)
        {
                var doc = domv.wrap(this.document);
                var div = doc.shorthand('div');
                var wrapped = div();
                var called = false;
                var event;

                wrapped.addDomListener('customtest', function(e)
                {
                        test.ok(this === wrapped);
                        called = true;
                }, true); // capture phase

                test.expect(2);
                event = this.document.createEvent('Event');
                event.initEvent('customtest', true, true);
                wrapped.emitDom(event);
                test.ok(called);
                test.done();
        },
        'DOM Event emitDomCustom()': function(test)
        {
                var doc = domv.wrap(this.document);
                var div = doc.shorthand('div');
                var wrapped = div();
                var called = 0;

                wrapped.addDomListener('customtest', function(e)
                {
                        test.ok(this === wrapped);
                        test.ok(e.cancelable);
                        test.ok(e.bubbles);
                        ++called;
                }, true); // capture phase

                wrapped.addDomListener('customtest2', function(e)
                {
                        test.ok(this === wrapped);
                        test.strictEqual(e.abc, 'zyx');
                        test.ok(!e.cancelable);
                        test.ok(!e.bubbles);
                        ++called;
                }, true); // capture phase

                test.expect(8);

                wrapped.emitDomCustom('customtest');
                wrapped.emitDomCustom('customtest2', {abc: 'zyx'}, false, false);
                test.strictEqual(called, 2);
                test.done();
        },
        'DOM Event bubble phase': function(test)
        {
                var doc = domv.wrap(this.document);
                var div = doc.shorthand('div');
                var wrapped = div();
                var called = false;
                var event;

                var listener = function(e)
                {
                        test.ok(this === wrapped);
                        called = true;
                };

                wrapped.addDomListener('customtest', listener, false); // bubble phase

                test.expect(5);
                event = this.document.createEvent('Event');
                event.initEvent('customtest', true, true);
                wrapped.emitDom(event);
                test.ok(called);

                called = false;

                // (IE does not like click events on disconnected elements,
                //  which does not make any sense anyway ;) )
                domv.wrap(this.document.body).appendChild(wrapped);
                // domv.isDOMEvent() -> true
                wrapped.addListener('click', listener, false); // bubble phase

                event = this.document.createEvent('MouseEvents');
                event.initMouseEvent('click', true, true, global,
                       1, 1000, 200, 300, 400,
                       false, false, false, false,
                       0, null
                );
                wrapped.emitDom(event);
                test.ok(called);

                wrapped.removeListener('click', listener, false);

                called = false;
                event = this.document.createEvent('MouseEvents');
                event.initMouseEvent('click', true, true, global,
                       1, 1000, 200, 300, 400,
                       false, false, false, false,
                       0, null
                );
                wrapped.emitDom(event);
                test.ok(!called);

                wrapped.removeNode();
                test.done();
        },
        'DOM Event phases, connected to Document': function(test)
        {
                var doc = domv.wrap(this.document);
                var div = doc.shorthand('div');
                var grandparent = div();
                var parent = div();
                var child = div();
                var progress;
                var event;

                domv.wrap(this.document.body).appendChild(grandparent);

                grandparent.appendChild(parent);
                parent.appendChild(child);

                progress = -3;

                grandparent.addDomListener('customtest', function(e)
                {
                        //console.log('grandparent capture');
                        test.ok(this === grandparent);
                        test.strictEqual(progress, -3);
                        ++progress;
                }, true); // capture phase

                parent.addDomListener('customtest', function(e)
                {
                        //console.log('parent capture');
                        test.ok(this === parent);
                        test.strictEqual(progress, -2);
                        ++progress;
                }, true); // capture phase

                child.addDomListener('customtest', function(e)
                {
                        //console.log('child capture');
                        test.ok(this === child);
                        test.strictEqual(progress, -1);
                        ++progress;
                }, true); // capture phase

                child.addDomListener('customtest', function(e)
                {
                        //console.log('child bubble');
                        test.ok(this === child);
                        test.strictEqual(progress, 0);
                        ++progress;
                }); // bubble phase

                parent.addDomListener('customtest', function(e)
                {
                        //console.log('parent bubble');
                        test.ok(this === parent);
                        test.strictEqual(progress, 1);
                        ++progress;
                }, false); // bubble phase

                grandparent.addDomListener('customtest', function(e)
                {
                        //console.log('grandparent bubble');
                        test.ok(this === grandparent);
                        test.strictEqual(progress, 2);
                        ++progress;
                }); // bubble phase

                test.expect(13);
                event = this.document.createEvent('Event');
                event.initEvent('customtest', true, true);
                child.emitDom(event);
                test.strictEqual(progress, 3);

                grandparent.removeNode();

                test.done();
        },
        'DOM Event phases, disconnected from Document': function(test)
        {
                var doc = domv.wrap(this.document);
                var div = doc.shorthand('div');
                var grandparent = div();
                var parent = div();
                var child = div();
                var progress;
                var event;

                // disconnected meaning the nodes are not reachable from the Document Node

                grandparent.appendChild(parent);
                parent.appendChild(child);

                progress = -3;

                grandparent.addDomListener('customtest', function(e)
                {
                        //console.log('grandparent capture');
                        test.ok(this === grandparent);
                        test.strictEqual(progress, -3);
                        ++progress;
                }, true); // capture phase

                parent.addDomListener('customtest', function(e)
                {
                        //console.log('parent capture');
                        test.ok(this === parent);
                        test.strictEqual(progress, -2);
                        ++progress;
                }, true); // capture phase

                child.addDomListener('customtest', function(e)
                {
                        //console.log('child capture');
                        test.ok(this === child);
                        test.strictEqual(progress, -1);
                        ++progress;
                }, true); // capture phase

                child.addDomListener('customtest', function(e)
                {
                        //console.log('child bubble');
                        test.ok(this === child);
                        test.strictEqual(progress, 0);
                        ++progress;
                }); // bubble phase

                parent.addDomListener('customtest', function(e)
                {
                        //console.log('parent bubble');
                        test.ok(this === parent);
                        test.strictEqual(progress, 1);
                        ++progress;
                }, false); // bubble phase

                grandparent.addDomListener('customtest', function(e)
                {
                        //console.log('grandparent bubble');
                        test.ok(this === grandparent);
                        test.strictEqual(progress, 2);
                        ++progress;
                }); // bubble phase

                test.expect(13);
                event = this.document.createEvent('Event');
                event.initEvent('customtest', true, true);
                child.emitDom(event);
                test.strictEqual(progress, 3);

                grandparent.removeNode();

                test.done();
        },
        'clearDomListeners()': function(test)
        {
                var doc = domv.wrap(this.document);
                var div = doc.shorthand('div');
                var wrapped = div();

                var emitDom = function(name)
                {
                        var event = this.document.createEvent('Event');
                        event.initEvent(name, true, true);
                        wrapped.emitDom(event);
                }.bind(this);

                var okListener = function()
                {
                        test.ok(true);
                }.bind(this);

                var failListener = function()
                {
                        test.ok(false);
                }.bind(this);

                var uniqueListener = function()
                {
                        test.ok(false);
                };

                test.expect(4);

                wrapped.addLocalListener('test' , okListener);
                wrapped.addLocalListener('test2', failListener);
                wrapped.addLocalListener('test2', failListener);
                wrapped.addLocalListener('test2', failListener);

                wrapped.addDomListener('test' , failListener);
                wrapped.addDomListener('test' , failListener, false);
                wrapped.addDomListener('test' , failListener, true);
                wrapped.addDomListener('test' , failListener, true);
                wrapped.addDomListener('test2', failListener, true);
                wrapped.addDomListener('testUnique' , uniqueListener, true); // so that we might trigger a gap in the array
                wrapped.addDomListener('test3', failListener, true);
                wrapped.addDomListener('test4', failListener, false);
                wrapped.removeLocalListener('testUnique' , uniqueListener, true);
                wrapped.clearDomListeners();

                emitDom('test');
                emitDom('test2');
                emitDom('test3');
                emitDom('test4');
                wrapped.emitLocal('test');

                wrapped.addDomListener('test', failListener);
                // setting the outerNode to something different should clear the DOM listeners too
                wrapped.outerNode = this.document.createElement('span');
                test.strictEqual(wrapped.outerNodeName, 'span');

                emitDom('test');
                emitDom('test2');
                emitDom('test3');
                emitDom('test4');
                wrapped.emitLocal('test');

                test.ok(true);
                test.done();
        },
        'cleanup()': function(test)
        {
                var doc = domv.wrap(this.document);
                var div = doc.shorthand('div');
                var wrapped = div();
                var emittedCleanup = 0;

                var emitDom = function(name)
                {
                        var event = this.document.createEvent('Event');
                        event.initEvent(name, true, true);
                        wrapped.emitDom(event);
                }.bind(this);

                var okListener = function()
                {
                        test.ok(true);
                }.bind(this);

                var failListener = function()
                {
                        test.ok(false);
                }.bind(this);

                var uniqueListener = function()
                {
                        test.ok(false);
                };

                test.expect(5);

                wrapped.addLocalListener('test' , okListener);
                wrapped.addLocalListener('testUnique' , uniqueListener, true); // so that we might trigger a gap in the array
                wrapped.addLocalListener('test2', failListener);
                wrapped.addLocalListener('test2', failListener);
                wrapped.addLocalListener('test2', failListener);

                wrapped.addDomListener('test' , failListener);
                wrapped.addDomListener('test' , failListener, false);
                wrapped.addDomListener('test' , failListener, true);
                wrapped.addDomListener('test' , failListener, true);
                wrapped.addDomListener('test2', failListener, true);
                wrapped.addDomListener('test3', failListener, true);
                wrapped.addDomListener('test4', failListener, false);
                wrapped.removeLocalListener('testUnique' , uniqueListener, true);

                wrapped.on('cleanup', function(){
                        ++emittedCleanup;
                });

                wrapped.on('cleanup', function(){
                        ++emittedCleanup;
                });

                wrapped.cleanup();
                test.strictEqual(emittedCleanup, 2);

                emitDom('test');
                emitDom('test2');
                emitDom('test3');
                emitDom('test4');
                wrapped.emitLocal('test');

                wrapped.addDomListener('test', failListener);
                // setting the outerNode to something different should clear the DOM listeners too
                wrapped.outerNode = this.document.createElement('span');
                test.strictEqual(wrapped.outerNodeName, 'span');

                emitDom('test');
                emitDom('test2');
                emitDom('test3');
                emitDom('test4');
                wrapped.emitLocal('test');

                test.ok(true);
                test.done();
        },
        'local event type detection': function(test)
        {
                var doc = domv.wrap(this.document);
                var div = doc.shorthand('div');
                var wrapped = div();
                var shouldFire;

                var listener = function(arg1)
                {
                        test.ok(shouldFire);
                        test.ok(this === wrapped);
                        test.ok(arg1 === 'foo');
                };

                test.expect(3);
                wrapped.on('test', listener);
                shouldFire = true;
                wrapped.emitLocal('test', 'foo');

                wrapped.removeListener('test', listener);
                shouldFire = false;
                wrapped.emitLocal('test', 'asdf');

                test.done();
        },
        'stringifyAsHtml()': function(test)
        {
                var doc = domv.wrap(this.document);
                var div = doc.shorthand('div');
                var wrapped = div('', 'hi', div('Test', 'abc'));
                var markup = wrapped.stringifyAsHtml();
                
                test.ok(markup === '<div>hi<div class="Test">abc</div></div>' ||
                        // we are in a browser running xhtml
                        markup === '<div xmlns="http://www.w3.org/1999/xhtml">hi<div class="Test">abc</div></div>'
                );

                wrapped = doc.create('html',
                        doc.create('head',
                                doc.create('title', '', ' ')
                        ),
                        doc.create('body',
                                wrapped
                        )
                );

                markup = wrapped.stringifyAsHtml();
                test.ok(markup === '<html><head><title> </title></head><body><div>hi<div class="Test">abc</div></div></body></html>' ||
                        // we are in a browser running xhtml
                        markup === '<html xmlns="http://www.w3.org/1999/xhtml"><head><title> </title></head><body><div>hi<div class="Test">abc</div></div></body></html>'
                );

                test.done();
        },
        'sendResponse()': function(test)
        {
                var doc = domv.wrap(this.document);
                var div = doc.shorthand('div');

                // javascript strings are utf16
                // \u00A2 is 2 bytes in utf8 (0xC2A2)
                // \u20AC is 3 bytes in utf8 (0xE282AC)
                // \uD852\uDF62 is 4 bytes in utf8 (0xF0A4ADA2)

                var wrapped = div('', 'hi\u00A2\u20AC\uD852\uDF62', div('Test', 'abc'));
                var mock = {
                        statusCode: 200,
                        headersSent: false,

                        _headers: {},
                        _content: '',
                        _ended: false,

                        setHeader: function(key, val)
                        {
                                test.ok(!this.headersSent);
                                this._headers[key] = val;
                        },
                        write: function(chunk, encoding)
                        {
                                this.headersSent = true;
                                this._content += chunk;
                                test.strictEqual(encoding, 'utf8');
                                test.ok(!this._ended);
                        },
                        end: function(chunk, encoding)
                        {
                                this.headersSent = true;
                                this._content += chunk;
                                test.strictEqual(encoding, 'utf8');
                                this._ended = true;
                        }
                };

                wrapped.sendResponseAsHtml(mock);
                test.ok(mock._ended);
                test.ok(mock._content === '<div>hi\u00A2\u20AC\uD852\uDF62<div class="Test">abc</div></div>' ||
                        mock._content === '<div xmlns="http://www.w3.org/1999/xhtml">hi\u00A2\u20AC\uD852\uDF62<div class="Test">abc</div></div>'
                );

                test.ok(mock._headers['Content-Length'] === 49 ||
                        mock._headers['Content-Length'] === 86
                );
                test.strictEqual(mock._headers['Content-Type'], 'text/html; charset=UTF-8');
                test.strictEqual(mock.statusCode, 200);

                mock.headersSent = false;
                mock._headers = {};
                mock._content = '';
                mock._ended = false;

                mock.setHeader('Content-Type', 'text/xml');
                mock.headersSent = true;
                wrapped.sendResponseAsHtml(mock);
                test.ok(mock._ended);
                test.ok(mock._content === '<div>hi\u00A2\u20AC\uD852\uDF62<div class="Test">abc</div></div>' ||
                        mock._content === '<div xmlns="http://www.w3.org/1999/xhtml">hi\u00A2\u20AC\uD852\uDF62<div class="Test">abc</div></div>'
                );
                test.strictEqual(mock._headers['Content-Type'], 'text/xml');

                test.done();
        },
        'style': function(test)
        {
                var doc = domv.wrap(this.document);
                var div = doc.shorthand('div');
                var text = doc.textShorthand();
                var wrapped;

                wrapped = div();
                wrapped.style.backgroundColor = 'red';
                test.strictEqual(wrapped.style.backgroundColor, 'red');
                test.strictEqual(wrapped.getAttr('style'), 'background-color: red;');

                wrapped = div();
                wrapped.style.cssFloat = 'left';
                test.strictEqual(wrapped.style.cssFloat, 'left');
                test.strictEqual(wrapped.getAttr('style'), 'float: left;');

                wrapped = text();
                test.ok(wrapped.style === undefined);
                test.ok(doc.style === undefined);

                test.done();
        },
        'Firebug hack': function(test)
        {
                var divNode = this.document.createElement('div');
                var spanNode = this.document.createElement('span');
                var wrapped = domv.wrap(divNode);

                test.ok(wrapped.splice);
                test.strictEqual(typeof wrapped.splice, 'function');
                wrapped.splice(); // should do nothing

                wrapped.outerNode = null;
                wrapped.innerNode = null;
                test.strictEqual(wrapped.length, undefined);

                wrapped.outerNode = divNode;
                wrapped.innerNode = divNode;
                test.strictEqual(wrapped.length, 2);
                test.strictEqual(wrapped[0], 'Component');
                test.ok(wrapped[1] === divNode);

                wrapped.innerNode = spanNode;
                test.strictEqual(wrapped.length, 3);
                test.strictEqual(wrapped[0], 'Component');
                test.ok(wrapped[1] === divNode);
                test.ok(wrapped[2] === spanNode);

                wrapped.splice = 123;
                wrapped.length = -50;
                wrapped[0] = 'abc';
                wrapped[1] = null;
                wrapped[2] = undefined;

                test.strictEqual(wrapped.splice, 123);
                test.strictEqual(wrapped.length, -50);
                test.ok(wrapped[0] === 'abc');
                test.ok(wrapped[1] === null);
                test.ok(wrapped[2] === undefined);
                test.done();
        }
};