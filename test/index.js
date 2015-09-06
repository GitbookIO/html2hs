var assert = require('assert');
var html2hs = require('../');

it('should return basic hyperscript', function() {
    var hscript = html2hs('<h1>Hello World</h1>');
    assert.equal(hscript, 'h("h1", [ "Hello World" ])');
});

it('should return id', function() {
    var hscript = html2hs('<h1 id="beep">Hello World</h1>');
    assert.equal(hscript, 'h("h1#beep", [ "Hello World" ])');
});

it('should return class', function() {
    var hscript = html2hs('<h1 class="beep">Hello World</h1>');
    assert.equal(hscript, 'h("h1.beep", [ "Hello World" ])');
});

it('should return hyperscript', function() {
    var hscript = html2hs('<div><div><h1 foo="beep">Hello World</h1></div></div>');
    assert.equal(hscript, 'h("div", [ h("div", [ h("h1", {"foo":"beep"}, [ "Hello World" ]) ]) ])');
});

it('should return children', function() {
    var hscript = html2hs('<p>Hello\n<b>World</b></p>');
    assert.equal(hscript, 'h("p", [ "Hello\\n", h("b", [ "World" ]) ])');
});

it.only('should handle correctly pre', function() {
    var hscript = html2hs('<pre>Hello\n<b>World</b></pre>');
    assert.equal(hscript, 'h("pre", [ "Hello\\n", "<b>World</b>" ])');
});

it('should output style attribute as an object', function() {
    var hscript = html2hs('<h1 style="color: red; font-size: 12px">Hello World</h1>');
    assert.equal(hscript, 'h("h1", { "style": {"color":"red","font-size":"12px"} }, [ "Hello World" ])');
});
