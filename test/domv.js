'use strict';

var domv = require('../lib/domv');

function testParseHTMLDocumentResult(test, doc)
{
        var p;

        test.ok(doc.outerNode);
        test.ok(doc.innerNode);
        test.ok(doc.head);
        test.ok(doc.body);
        test.ok(doc.titleWrapped);
        test.ok(doc.titleWrapped.textContent); // a title element may not be empty
        p = doc.selectorAll('p');
        test.strictEqual(p.length, 1);

        test.strictEqual(doc.outerNodeName, 'html');
        test.strictEqual(doc.innerNodeName, 'body');
        test.strictEqual(doc.head.outerNodeName, 'head');
        test.strictEqual(doc.titleWrapped.outerNodeName, 'title');
        test.strictEqual(p[0].outerNodeName, 'p');

        test.ok(doc.isInnerNodeEqual(doc.body), 'body should be the inner node');
        test.ok(doc.isOuterNodeEqual(doc.innerNode.parentNode), 'body should be the child of html');
        test.ok(doc.isOuterNodeEqual(doc.head.parentNode), 'head should be the child of html');
        test.ok(doc.head.isNodeEqual(doc.titleWrapped.parentNode), 'title should be the child of head');
        test.ok(doc.body.isNodeEqual(p[0].parentNode), 'body should be the child of p');
}


function TestComponent(node, firstArg, secondArg)
{
        domv.Component.call(this, node);
        this.testAbc = node;
        this.firstArg = firstArg;
        this.secondArg = secondArg;
}
require('inherits')(TestComponent, domv.Component);

module.exports = {
        setUp: function (callback)
        {
                // nwmatcher which is used in jsdom for querySelector,
                // requires a documentElement to be present!

                // https://github.com/substack/node-browserify/issues/702
                this.document = global.document || require('jsdom').jsdom('<html/>');
                callback();
        },
        tearDown: function (callback)
        {
                callback();
        },
        'isSupported()': function(test)
        {
                test.throws(function(){ domv.isSupported(); }, domv.Exception);
                test.ok(domv.isSupported(this.document, false));
                test.ok(domv.isParseHTMLDocumentSupported());
                test.ok(domv.isSupported(this.document, true));
                test.done();
        },
        'mayContainChildren()': function(test)
        {
                var divNode = this.document.createElement('div');
                var textNode = this.document.createTextNode('foo');
                test.ok(!domv.mayContainChildren(null));
                test.ok(domv.mayContainChildren(divNode));
                test.ok(domv.mayContainChildren(domv.wrap(divNode)));
                test.ok(domv.mayContainChildren(this.document));
                test.ok(domv.mayContainChildren(this.document.createDocumentFragment()));
                test.ok(!domv.mayContainChildren(textNode));
                test.ok(!domv.mayContainChildren(this.document.createComment('comment')));

                test.throws(function(){ domv.mayContainChildren(null, true); }, domv.Exception);
                test.throws(function(){ domv.mayContainChildren(textNode, true); }, domv.Exception);

                test.done();
        },
        'wrap()': function(test)
        {
                var divNode = this.document.createElement('div');
                var div2Node = this.document.createElement('div');
                var wrapped;

                wrapped = domv.wrap(divNode);
                test.ok(wrapped instanceof domv.Component);
                test.ok(wrapped.outerNode === divNode);

                wrapped = domv.wrap(wrapped);
                test.ok(wrapped.outerNode === divNode);

                wrapped = domv.wrap([divNode, div2Node]);
                test.ok(wrapped[0].outerNode === divNode);
                test.ok(wrapped[1].outerNode === div2Node);

                test.throws(function(){ domv.wrap({}); }, domv.Exception);

                wrapped = domv.wrap(divNode, TestComponent);
                test.ok(wrapped instanceof domv.Component);
                test.ok(wrapped instanceof TestComponent);
                test.ok(wrapped.testAbc === divNode);

                wrapped = domv.wrap(divNode, TestComponent, 'bla', 5);
                test.ok(wrapped instanceof domv.Component);
                test.ok(wrapped instanceof TestComponent);
                test.ok(wrapped.testAbc === divNode);
                test.ok(wrapped.firstArg === 'bla');
                test.ok(wrapped.secondArg === 5);

                test.done();
        },
        'wrap() constructor args': function(test)
        {
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

                var divNode = this.document.createElement('div');


                test.strictEqual(domv.wrap(divNode, Foo).sum                           , bla(0));
                test.strictEqual(domv.wrap(divNode, Foo, 1).sum                        , bla(1));
                test.strictEqual(domv.wrap(divNode, Foo, 1, 2).sum                     , bla(2));
                test.strictEqual(domv.wrap(divNode, Foo, 1, 2, 3).sum                  , bla(3));
                test.strictEqual(domv.wrap(divNode, Foo, 1, 2, 3, 4).sum               , bla(4));
                test.strictEqual(domv.wrap(divNode, Foo, 1, 2, 3, 4, 5).sum            , bla(5));
                test.strictEqual(domv.wrap(divNode, Foo, 1, 2, 3, 4, 5, 6).sum         , bla(6));
                test.strictEqual(domv.wrap(divNode, Foo, 1, 2, 3, 4, 5, 6, 7).sum      , bla(7));
                test.strictEqual(domv.wrap(divNode, Foo, 1, 2, 3, 4, 5, 6, 7, 8).sum   , bla(8));
                test.strictEqual(domv.wrap(divNode, Foo, 1, 2, 3, 4, 5, 6, 7, 8, 9).sum, bla(9));
                test.strictEqual(domv.wrap(divNode, Foo, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10).sum, bla(10));
                test.throws(function(){ domv.wrap(divNode, Foo, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11); }, domv.Exception);


                test.done();
        },
        'wrap([]) constructor args': function(test)
        {
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

                var divNode = this.document.createElement('div');


                test.strictEqual(domv.wrap([divNode], Foo)[0].sum                           , bla(0));
                test.strictEqual(domv.wrap([divNode], Foo, 1)[0].sum                        , bla(1));
                test.strictEqual(domv.wrap([divNode], Foo, 1, 2)[0].sum                     , bla(2));
                test.strictEqual(domv.wrap([divNode], Foo, 1, 2, 3)[0].sum                  , bla(3));
                test.strictEqual(domv.wrap([divNode], Foo, 1, 2, 3, 4)[0].sum               , bla(4));
                test.strictEqual(domv.wrap([divNode], Foo, 1, 2, 3, 4, 5)[0].sum            , bla(5));
                test.strictEqual(domv.wrap([divNode], Foo, 1, 2, 3, 4, 5, 6)[0].sum         , bla(6));
                test.strictEqual(domv.wrap([divNode], Foo, 1, 2, 3, 4, 5, 6, 7)[0].sum      , bla(7));
                test.strictEqual(domv.wrap([divNode], Foo, 1, 2, 3, 4, 5, 6, 7, 8)[0].sum   , bla(8));
                test.strictEqual(domv.wrap([divNode], Foo, 1, 2, 3, 4, 5, 6, 7, 8, 9)[0].sum, bla(9));
                test.strictEqual(domv.wrap([divNode], Foo, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10)[0].sum, bla(10));
                test.throws(function(){ domv.wrap([divNode], Foo, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11); }, domv.Exception);


                test.done();
        },
        'unlive()': function(test)
        {
                var parent = this.document.createElement('div');
                var child = this.document.createElement('p');
                var result, resultUnlive;
                parent.appendChild(child);

                result = parent.getElementsByTagName('p');
                resultUnlive = domv.unlive(result);

                test.strictEqual(result.length, 1);
                test.strictEqual(resultUnlive.length, 1);
                test.ok(result[0] === child);
                test.ok(resultUnlive[0] === child);

                parent.removeChild(child);
                test.strictEqual(result.length, 0);
                test.strictEqual(resultUnlive.length, 1);
                test.ok(resultUnlive[0] === child);

                test.done();
        },
        'create()': function(test)
        {
                var wrapped;

                test.throws(function(){ domv.create(); }, domv.Exception);
                test.throws(function(){ domv.create(this.document);}.bind(this), domv.Exception);

                wrapped = domv.create(this.document, 'div');
                test.ok(wrapped.isDOMVComponent);
                test.strictEqual(wrapped.outerNode.nodeName.toLowerCase(), 'div');
                test.strictEqual(null, wrapped.outerNode.getAttribute('class'));

                wrapped = domv.create(domv.wrap(this.document), 'div', 'Test');
                test.ok(wrapped.isDOMVComponent);
                test.strictEqual(wrapped.outerNode.nodeName.toLowerCase(), 'div');
                test.strictEqual('Test', wrapped.outerNode.getAttribute('class'));

                wrapped = domv.create(this.document, 'div', 'Test', {'data-test': 5}, 'Hi!');
                test.ok(wrapped.isDOMVComponent);
                test.strictEqual(wrapped.outerNode.nodeName.toLowerCase(), 'div');
                test.strictEqual('Test', wrapped.outerNode.getAttribute('class'));
                test.strictEqual('5', wrapped.outerNode.getAttribute('data-test'));
                test.strictEqual('Hi!', wrapped.outerNode.textContent);
                test.strictEqual(1, wrapped.outerNode.childNodes.length);


                wrapped = domv.create(this.document, 'div', 'Test', [{'data-test': 5}, 'Hi!']);
                test.ok(wrapped.isDOMVComponent);
                test.strictEqual(wrapped.outerNode.nodeName.toLowerCase(), 'div');
                test.strictEqual('Test', wrapped.outerNode.getAttribute('class'));
                test.strictEqual('5', wrapped.outerNode.getAttribute('data-test'));
                test.strictEqual('Hi!', wrapped.outerNode.textContent);
                test.strictEqual(1, wrapped.outerNode.childNodes.length);

                wrapped = domv.create(this.document, 'div', 'Test', [[[{'data-test': 5}]], ['Hi!']]);
                test.ok(wrapped.isDOMVComponent);
                test.strictEqual(wrapped.outerNode.nodeName.toLowerCase(), 'div');
                test.strictEqual('Test', wrapped.outerNode.getAttribute('class'));
                test.strictEqual('5', wrapped.outerNode.getAttribute('data-test'));
                test.strictEqual('Hi!', wrapped.outerNode.textContent);
                test.strictEqual(1, wrapped.outerNode.childNodes.length);
                
                wrapped = domv.create(this.document, '#text');
                test.ok(wrapped.isDOMVComponent);
                test.strictEqual(wrapped.outerNode.nodeName, '#text');
                test.strictEqual(wrapped.outerNode.nodeType, domv.NodeType.TEXT);

                wrapped = domv.create(this.document, '#text', 'abc def', 'ghj');
                test.ok(wrapped.isDOMVComponent);
                test.strictEqual(wrapped.outerNode.nodeName, '#text');
                test.strictEqual(wrapped.outerNode.nodeType, domv.NodeType.TEXT);
                test.strictEqual(wrapped.outerNode.data, 'abc defghj');

                wrapped = domv.create(this.document, '#comment', 'abc def', 'ghj');
                test.ok(wrapped.isDOMVComponent);
                test.strictEqual(wrapped.outerNode.nodeName, '#comment');
                test.strictEqual(wrapped.outerNode.nodeType, domv.NodeType.COMMENT);
                test.strictEqual(wrapped.outerNode.data, 'abc defghj');

                wrapped = domv.create(this.document, '#document-fragment', 'abc def', domv.create(this.document, 'div'));
                test.ok(wrapped.isDOMVComponent);
                test.strictEqual(wrapped.outerNode.nodeName, '#document-fragment');
                test.strictEqual(wrapped.outerNode.nodeType, domv.NodeType.DOCUMENT_FRAGMENT);
                test.strictEqual(wrapped.outerNode.firstChild.nodeType, domv.NodeType.TEXT);
                test.strictEqual(wrapped.outerNode.firstChild.data, 'abc def');
                test.strictEqual(wrapped.outerNode.lastChild.nodeName.toLowerCase(), 'div');

                test.throws(function(){ domv.create(this.document, '#document'); }.bind(this), domv.Exception);
                test.throws(function(){ domv.create(this.document, '#cdata-section'); }.bind(this), domv.Exception);
                test.throws(function(){ domv.create(this.document, '#someunknownthing'); }.bind(this), domv.Exception);

                test.done();
        },
        'text()':function(test)
        {
                var wrapped;

                test.throws(function(){ domv.text(); });

                wrapped = domv.text(this.document);
                test.strictEqual(wrapped.outerNodeType, domv.NodeType.TEXT);
                test.strictEqual(wrapped.outerNode.data, '');

                wrapped = domv.text(this.document, 'foo');
                test.strictEqual(wrapped.outerNodeType, domv.NodeType.TEXT);
                test.strictEqual(wrapped.outerNode.data, 'foo');

                wrapped = domv.text(domv.wrap(this.document), 'foo');
                test.strictEqual(wrapped.outerNodeType, domv.NodeType.TEXT);
                test.strictEqual(wrapped.outerNode.data, 'foo');

                wrapped = domv.text(this.document, 'foo', 'bar');
                test.strictEqual(wrapped.outerNodeType, domv.NodeType.TEXT);
                test.strictEqual(wrapped.outerNode.data, 'foo bar');

                test.strictEqual(domv.text(this.document, 'foo', 'bar', 'baz').outerNode.data, 'foo bar baz');
                test.strictEqual(domv.text(this.document, 'foo', 'bar', 'baz', 'qux').outerNode.data, 'foo bar baz qux');
                test.strictEqual(domv.text(this.document, 'foo', 'bar', 'baz', 'qux', 'norf').outerNode.data, 'foo bar baz qux norf');
                test.strictEqual(domv.text(this.document, 'foo', 'bar', 'baz', 'qux', 'norf', ' alice').outerNode.data, 'foo bar baz qux norf  alice');
                test.strictEqual(domv.text(this.document, 'foo', 'bar', 'baz', 'qux', 'norf', ' alice', 'bob').outerNode.data, 'foo bar baz qux norf  alice bob');

                test.done();
        },
        'createHtmlDomDocument()': function(test)
        {
                var doc = domv.createHtmlDomDocument();
                test.strictEqual(doc.nodeType, domv.NodeType.DOCUMENT);
                test.strictEqual(doc.lastChild.nodeName.toLowerCase(), 'html');
                test.strictEqual(doc.lastChild.firstChild.nodeName.toLowerCase(), 'head');
                test.strictEqual(doc.lastChild.lastChild.nodeName.toLowerCase(), 'body');
                test.done();
        },
        'createHtmlDomDocument(minimal=true)': function(test)
        {
                var doc = domv.createHtmlDomDocument(true);
                test.strictEqual(doc.nodeType, domv.NodeType.DOCUMENT);
                test.strictEqual(doc.lastChild.nodeName.toLowerCase(), 'html');
                test.strictEqual(doc.lastChild.childNodes.length, 0);
                test.done();
        },
        'parseHTMLDocument()': function(test)
        {
                var doc = domv.parseHTMLDocument(
                          '<!DOCTYPE html>'
                        + '<html>'
                                + '<head>'
                                        + '<title>domv Unit Tests</title>'
                                        + '<style>bla</style>'
                                        + '<script>while(1);</script>'
                                + '</head>'
                                + '<body>'
                                        + '<p>something</p>'
                                + '</body>'
                        + '</html>'
                );

                test.ok(doc.document !== this.document);
                testParseHTMLDocumentResult(test, doc);
                test.done();
        },
        'parseHTMLDocument() with given Document': function(test)
        {
                var doc = domv.parseHTMLDocument(
                          '<!DOCTYPE html>'
                        + '<html>'
                                + '<head>'
                                        + '<title>domv Unit Tests</title>'
                                        + '<style>bla</style>'
                                        + '<script>while(1);</script>'
                                + '</head>'
                                + '<body>'
                                        + '<p>something</p>'
                                + '</body>'
                        + '</html>',
                        this.document
                );

                test.ok(doc.document === this.document);
                testParseHTMLDocumentResult(test, doc);

                doc = domv.parseHTMLDocument(
                          '<!DOCTYPE html>'
                        + '<html>'
                                + '<head>'
                                        + '<title>domv Unit Tests</title>'
                                        + '<style>bla</style>'
                                        + '<script>while(1);</script>'
                                + '</head>'
                                + '<body>'
                                        + '<p>something</p>'
                                + '</body>'
                        + '</html>',
                        domv.wrap(this.document)
                );

                test.ok(doc.document === this.document);
                testParseHTMLDocumentResult(test, doc);

                test.throws(function()
                {
                        doc = domv.parseHTMLDocument(
                                  '<!DOCTYPE html>'
                                + '<html>'
                                        + '<head>'
                                                + '<title>domv Unit Tests</title>'
                                                + '<style>bla</style>'
                                                + '<script>while(1);</script>'
                                        + '</head>'
                                        + '<body>'
                                                + '<p>something</p>'
                                        + '</body>'
                                + '</html>',
                                'invalid param'
                        );
                }, domv.Exception);

                test.done();
        },
        'parseHTMLSnippit()': function(test)
        {
                var fragment = domv.parseHTMLSnippit(this.document, '<div class="abc">def</div><p>ghj</p>');
                test.strictEqual(fragment.outerNodeType, domv.NodeType.DOCUMENT_FRAGMENT);
                test.strictEqual(fragment.firstChild.outerNodeName, 'div');
                test.strictEqual(fragment.firstChild.getAttr('class'), 'abc');
                test.strictEqual(fragment.firstChild.textContent, 'def');
                test.strictEqual(fragment.lastChild.outerNodeName, 'p');
                test.strictEqual(fragment.lastChild.textContent, 'ghj');
                test.strictEqual(fragment.childNodes.length, 2);

                fragment = domv.parseHTMLSnippit(domv.wrap(this.document), '<div class="abc">def</div><p>ghj</p>');
                test.strictEqual(fragment.outerNodeType, domv.NodeType.DOCUMENT_FRAGMENT);
                test.strictEqual(fragment.firstChild.outerNodeName, 'div');
                test.strictEqual(fragment.firstChild.getAttr('class'), 'abc');
                test.strictEqual(fragment.firstChild.textContent, 'def');
                test.strictEqual(fragment.lastChild.outerNodeName, 'p');
                test.strictEqual(fragment.lastChild.textContent, 'ghj');
                test.strictEqual(fragment.childNodes.length, 2);

                test.throws(function(){ domv.parseHTMLSnippit(null, '<div class="abc">def</div><p>ghj</p>'); }, domv.Exception);
                test.throws(function(){ domv.parseHTMLSnippit('invalid param', '<div class="abc">def</div><p>ghj</p>'); }, domv.Exception);

                test.done();
        },
        'throw new domv.Exception()': function(test)
        {
                var exception;

                exception = new domv.Exception(Error('Fooooo bla'));
                test.strictEqual(exception.message, 'Fooooo bla');
                test.strictEqual(exception.name, 'domv.Exception');
                test.ok(exception.toString());

                test.done();
        },
        'cssStringEscape()': function(test)
        {
                test.strictEqual(domv.cssStringEscape('hello'), '"hello"');
                test.strictEqual(domv.cssStringEscape('hello', true), '"hello"');
                test.strictEqual(domv.cssStringEscape('hello', false), 'hello');
                test.strictEqual(domv.cssStringEscape('foo"bar', true), '"foo\\"bar"');
                test.strictEqual(domv.cssStringEscape('foo\\bar', true), '"foo\\\\bar"');
                test.strictEqual(domv.cssStringEscape('foo"bar\nhmm\rbla', true), '"foo\\"bar\\a hmm\\d bla"');
                test.done();
        },
        'shorthand()': function(test)
        {
                test.throws(function(){ domv.shorthand(); }, domv.Exception);
                // the rest is tested in Component.js
                test.done();
        },
        'isLeftMouseButton()': function(test)
        {
                test.throws(function(){ domv.isLeftMouseButton(); }, domv.Exception);

                test.ok(domv.isLeftMouseButton({
                        button: 0 // left
                }));

                test.ok(! domv.isLeftMouseButton({
                        button: 2 // right
                }));

                test.ok(domv.isLeftMouseButton({
                        buttons: 1 | 2 // left and right
                }));

                test.ok(! domv.isLeftMouseButton({
                        buttons: 2 // right only
                }));

                test.done();
        }
};