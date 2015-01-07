'use strict';

var domv = require('../lib/domv');
var HtmlDocument = domv.HtmlDocument;

function validateHtmlDocumentStructure(test, doc)
{
        // The minimum for a well formed html document
        test.ok(doc.outerNode);
        test.ok(doc.innerNode);
        test.ok(doc.head);
        test.ok(doc.body);
        test.ok(doc.titleWrapped);
        test.ok(doc.titleWrapped.textContent); // a title element may not be empty

        test.strictEqual(doc.outerNodeName, 'html');
        test.strictEqual(doc.innerNodeName, 'body');
        test.strictEqual(doc.head.outerNodeName, 'head');
        test.strictEqual(doc.titleWrapped.outerNodeName, 'title');

        test.ok(doc.isInnerNodeEqual(doc.body), 'body should be the inner node');
        test.ok(doc.isOuterNodeEqual(doc.innerNode.parentNode), 'body should be the child of html');
        test.ok(doc.isOuterNodeEqual(doc.head.parentNode), 'head should be the child of html');
        test.ok(doc.head.isNodeEqual(doc.titleWrapped.parentNode), 'title should be the child of head');
}

module.exports = {
        setUp: function (callback)
        {
                if (global.document) // browser
                {
                        this.document = global.document;
                }
                else // jsdom
                {
                        this.document = require('jsdom').jsdom(
                                '<!DOCTYPE html>'
                                + '<html><head><title>domv Unit Tests</title><style>bla</style></head>'
                                + '<body><p>something</p></body></html>'
                        );
                }
                callback();
        },
        tearDown: function (callback)
        {
                callback();
        },
        'Creation constructor, also create DOCUMENT_NODE': function(test)
        {
                var htmldoc;

                htmldoc = new HtmlDocument();
                test.ok(htmldoc.isOuterNodeEqual(htmldoc.document.documentElement),
                        'The newly created html node should be set as the documentElement if a new DOCUMENT_NODE '
                        + 'is also being created implicitly');

                validateHtmlDocumentStructure(test, htmldoc);

                htmldoc.title = 'Foo';
                test.strictEqual(htmldoc.title, 'Foo');
                test.strictEqual(htmldoc.titleWrapped.textContent, 'Foo');

                test.strictEqual(htmldoc.baseURI, null);

                test.done();
        },
        'Creation constructor, existing DOCUMENT_NODE': function(test)
        {
                var htmldoc;

                htmldoc = new HtmlDocument(this.document);
                test.ok(!htmldoc.isOuterNodeEqual(this.document.documentElement),
                        'The newly created html node should not be set (implicitly) as the documentElement'
                        + ', and passing a DOCUMENT_NODE should always create a new html node');

                validateHtmlDocumentStructure(test, htmldoc);

                htmldoc.title = 'Foo';
                test.strictEqual(htmldoc.title, 'Foo');
                test.strictEqual(htmldoc.titleWrapped.textContent, 'Foo');

                test.strictEqual(htmldoc.baseURI, null);

                test.done();
        },
        'Wrapping constructor': function(test)
        {
                var html, head, body, htmldoc;

                html = this.document.documentElement;
                head = this.document.getElementsByTagName('head')[0];
                body = this.document.getElementsByTagName('body')[0];

                htmldoc = new HtmlDocument(html);
                test.ok(htmldoc.isOuterNodeEqual(html),
                        'Passing the documentElement should not result in a new html node');

                test.ok(htmldoc.head.isNodeEqual(head));
                test.ok(htmldoc.body.isNodeEqual(body));
                test.ok(htmldoc.isInnerNodeEqual(body));

                validateHtmlDocumentStructure(test, htmldoc);
                test.strictEqual(htmldoc.titleWrapped.textContent, 'domv Unit Tests');
                test.strictEqual(htmldoc.title, 'domv Unit Tests');

                test.done();
        },
        'Wrapping constructor, invalid structure': function(test)
        {
                var doc = domv.wrap(this.document);
                var div = doc.shorthand('div');
                var htmldoc;

                test.throws(function(){ htmldoc = new HtmlDocument(div()); }, domv.Exception);

                // should fail if the document does not match at least <html><head/><body/></html>
                test.throws(function()
                {
                        htmldoc = new HtmlDocument(doc.create('html'));
                }, domv.Exception);

                test.throws(function()
                {
                        htmldoc = new HtmlDocument(doc.create('html', doc.create('head')));
                }, domv.Exception);

                test.throws(function()
                {
                        htmldoc = new HtmlDocument(doc.create('html', doc.create('body')));
                }, domv.Exception);

                test.ok(new HtmlDocument(doc.create('html', doc.create('head'), doc.create('body'))));

                test.done();
        },
        'title': function(test)
        {
                var doc = domv.wrap(this.document);
                var minimal = doc.create('html', doc.create('head'), doc.create('body'));
                var htmldoc = new HtmlDocument(minimal);
                var title = htmldoc.selector('title');

                test.strictEqual(htmldoc.title,  '');
                test.ok(!title);

                htmldoc.title = 'Foo test bla';
                test.strictEqual(htmldoc.title,  'Foo test bla');
                htmldoc.title = 'Test t3st tesT';
                test.strictEqual(htmldoc.title,  'Test t3st tesT');

                title = htmldoc.outerNodeWrapped.selector('title');
                test.ok(title);
                test.strictEqual(title.textContent,  'Test t3st tesT');

                test.done();
        },
        'baseUri': function(test)
        {
                var htmldoc;

                htmldoc = new HtmlDocument();

                test.strictEqual(htmldoc.baseURI, null);
                htmldoc.baseURI = 'http://localhost/';
                htmldoc.baseURI = 'http://localhost/';
                htmldoc.baseURI = 'http://localhost/';
                test.strictEqual(htmldoc.baseURI, 'http://localhost/');
                test.strictEqual(htmldoc.head.outerNode.getElementsByTagName('base').length, 1);
                test.throws(function(){ htmldoc.baseURI = undefined; }, domv.Exception);
                test.strictEqual(htmldoc.baseURI, 'http://localhost/');
                htmldoc.baseURI = null;
                test.strictEqual(htmldoc.baseURI, null);
                test.strictEqual(htmldoc.head.outerNode.getElementsByTagName('base').length, 0);
                htmldoc.baseURI = null;
                test.strictEqual(htmldoc.baseURI, null);

                test.done();
        },
        'addCSS() and addJS()': function(test)
        {
                var htmldoc, results;
                htmldoc = new HtmlDocument(this.document);

                htmldoc.addCSS('http://localhost/foo.css');
                htmldoc.addCSS('./bar.css', 'screen');
                htmldoc.addJS('http://localhost/foo.js');
                htmldoc.addJS('./bar.js', false);

                results = htmldoc.head.selectorAll('link');
                test.strictEqual(results.length, 2);
                test.strictEqual(results[0].getAttr('href'), 'http://localhost/foo.css');
                test.strictEqual(results[0].getAttr('media'), null);
                test.strictEqual(results[0].getAttr('type'), 'text/css');
                test.strictEqual(results[0].getAttr('rel'), 'stylesheet');
                test.strictEqual(results[1].getAttr('href'), './bar.css');
                test.strictEqual(results[1].getAttr('media'), 'screen');

                results = htmldoc.head.selectorAll('script');
                test.strictEqual(results.length, 2);
                test.strictEqual(results[0].getAttr('src'), 'http://localhost/foo.js');
                test.strictEqual(results[0].getAttr('type'), 'text/javascript');
                test.strictEqual(results[0].getAttr('async'), 'async');
                test.strictEqual(results[1].getAttr('src'), './bar.js');
                test.strictEqual(results[1].getAttr('type'), 'text/javascript');
                test.strictEqual(results[1].getAttr('async'), null);

                test.done();
        },
        'addJSONData() & getJSONData()': function(test)
        {
                var htmldoc, script;
                htmldoc = new HtmlDocument(this.document);
                script = htmldoc.addJSONData('foo', {'abc': 'def'});

                test.ok(script.isNodeEqual(htmldoc.outerNodeWrapped.selector('script')));
                test.strictEqual(script.getAttr('data-identifier'), 'foo');
                test.strictEqual(script.getAttr('type'), 'application/json');
                test.strictEqual(script.textContent, '{"abc":"def"}');
                test.deepEqual(htmldoc.getJSONData('foo'), {abc: 'def'});
                test.strictEqual(htmldoc.getJSONData('bar'), null);
                test.done();
        },
        'addJSONData() & getJSONData() after wrapping': function(test)
        {
                var htmldoc;
                htmldoc = new HtmlDocument(this.document);
                htmldoc.addJSONData('foo', {'abc': 'def'});
                // missing identifier:
                htmldoc.head.appendChild(htmldoc.create('script', {type: 'application/json'}));

                htmldoc = new HtmlDocument(htmldoc.outerNode);
                test.deepEqual(htmldoc.getJSONData('foo'), {abc: 'def'});
                test.strictEqual(htmldoc.getJSONData('bar'), null);
                test.strictEqual(htmldoc.getJSONData(''), null);
                test.done();
        },
        'stringifyAsHtml() (overriden)': function(test)
        {
                var doc = domv.wrap(this.document);
                var div = doc.shorthand('div');
                var htmldoc;
                var markup;

                var wrapped = doc.create('html',
                        doc.create('head',
                                doc.create('title', '', ' ')
                        ),
                        doc.create('body',
                                div('Test', 'hi', div('', 'abc'))
                        )
                );

                htmldoc = new domv.HtmlDocument(wrapped);
                markup = htmldoc.stringifyAsHtml();
                test.ok(markup === '<!DOCTYPE html><html><head><title> </title></head><body><div class="Test">hi<div>abc</div></div></body></html>' ||
                        // we are in a browser running xhtml
                        markup === '<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml"><head><title> </title></head><body><div class="Test">hi<div>abc</div></div></body></html>'
                );

                test.done();
        }
};