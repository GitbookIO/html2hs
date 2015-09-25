# html2hs

[![NPM version](https://badge.fury.io/js/html2hs.svg)](http://badge.fury.io/js/html2hs) [![Build Status](https://travis-ci.org/GitbookIO/html2hs.svg?branch=master)](https://travis-ci.org/GitbookIO/html2hs)

Parse HTML to [hyperscript](https://github.com/Matt-Esch/virtual-dom/tree/master/virtual-hyperscript) (for [virtual-dom](https://github.com/Matt-Esch/virtual-dom)).

``` js
var html2hs = require('html2hs');

var hscript = html2hs('<h1>Hello World</h1>');

// hscript = 'h("h1", [ "Hello World" ])'
```

`html2hs` also accept an option argument:

```js
{
    // true: pre tags will be parsed like other tags
    pre: false
}
```
