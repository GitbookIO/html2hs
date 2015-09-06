var _ = require('lodash');
var ElementType = require('domelementtype');
var parseDOM = require('htmlparser2').parseDOM;
var domSerializer = require('dom-serializer');

var PRE_TAGS = ['pre', 'script', 'style'];
function isElemPre(elem) {
    return (PRE_TAGS.indexOf(elem.name) >= 0);
}

// Serialize a string (handle quotes)
function serialize(o) {
    return JSON.stringify(o);
}

// Transform a class attribute to ".class1.class2"
function normalizeClass(classNames) {
    return (classNames !== undefined ? classNames : '')
        .split(/\s+/g)
        .filter(function (v) {
            return v.length > 0;
        })
        .map(function (cls) {
            return '.' + cls;
        })
        .join('');
}

// Normalize attributes for hscript
// Remove class and id
// Return style as object
function normalizeAttributes(attrs) {
    attrs = _.omit(attrs, ['id', 'class']);

    if (attrs.style) {
        attrs.style = _.chain(attrs.style)
            .split(";")
            .map(function(rule) {
                var split = rule.split(':');
                if (split.length < 2) return null;
                return [split[0].trim(), split.slice(1).join(':').trim()];
            })
            .compact()
            .object()
            .value();
    }

    return attrs;
}

function html2hs(content, options) {
    options = _.defaults(options || {}, {
        pre: false
    });

    var dom = parseDOM(content, {
        decodeEntities: true
    });
    var output = '';
    var preLevels = 0;

    function renderElement(elem) {
        var isPre, inner, name, attributes;

        isPre = isElemPre(elem);

        // Process only tag and text
        if (elem.type != ElementType.Text && !ElementType.isTag(elem)) {
            return '';
        }

        // Is inside a pre elements, return it as HTML
        if (preLevels > 0 && !options.pre) {
            return serialize(domSerializer([elem]));
        }

        if (elem.type === ElementType.Text) {
            return serialize(elem.data);
        }

        if (isPre) preLevels = preLevels + 1;

        inner = _.chain(elem.children || [])
            .map(function(child) {
                return renderElement(child);
            })
            .compact()
            .value();

        if (isPre) preLevels = preLevels - 1;

        // Build hscript name
        name = elem.name;
        if (elem.attribs['class']) name = name+normalizeClass(elem.attribs['class']);
        if (elem.attribs['id']) name = name+'#'+elem.attribs['id'];

        // Normalize attributes
        attributes = normalizeAttributes(elem.attribs);

        return 'h('+serialize(name)
            + (_.size(attributes)? ', ' + serialize(attributes) : '')
            + (inner.length? ', [ ' + (inner.join(', ')) + ' ]' : '')
            + ')';
    }

    return _.reduce(dom, function(output, elem) {
        return output+''+renderElement(elem, options);
    }, '');
}

module.exports = html2hs;
