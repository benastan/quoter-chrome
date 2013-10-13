;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
  var Quoter;

  Quoter = require('quoter');

  new Quoter.Clients.Chrome.Background();

}).call(this);

},{"quoter":2}],2:[function(require,module,exports){
(function() {
  var Quoter;

  Quoter = (function() {
    function Quoter() {}

    Quoter.Clients = require('./quoter/clients');

    return Quoter;

  })();

  module.exports = Quoter;

}).call(this);

},{"./quoter/clients":3}],3:[function(require,module,exports){
(function() {
  var Clients;

  Clients = (function() {
    function Clients() {}

    Clients.Chrome = require('./clients/chrome');

    return Clients;

  })();

  module.exports = Clients;

}).call(this);

},{"./clients/chrome":4}],4:[function(require,module,exports){
(function() {
  var Chrome;

  Chrome = (function() {
    function Chrome() {}

    Chrome.Background = require('./chrome/background');

    Chrome.Content = require('./chrome/content');

    return Chrome;

  })();

  module.exports = Chrome;

}).call(this);

},{"./chrome/background":5,"./chrome/content":6}],5:[function(require,module,exports){
(function() {
  var Background;

  Background = (function() {
    function Background() {
      this.createContextMenus();
    }

    Background.prototype.createContextMenus = function() {
      chrome.contextMenus.onClicked.addListener(function(info, tab) {
        var options;
        options = {
          method: 'quoter.quote'
        };
        return chrome.tabs.sendMessage(tab.id, options, function(selectedText) {
          debugger;
        });
      });
      return chrome.runtime.onInstalled.addListener(function() {
        return chrome.contextMenus.create({
          title: 'Quote with Quoter',
          id: 'quoter-quote',
          contexts: ['page', 'selection']
        });
      });
    };

    return Background;

  })();

  module.exports = Background;

}).call(this);

},{}],6:[function(require,module,exports){
(function() {
  var Content, Selection;

  Selection = require('../../selection');

  Content = (function() {
    function Content() {
      this.attachMessageListeners();
    }

    Content.prototype.attachMessageListeners = function() {
      return chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        new Selection;
        if (request.method === 'quoter.quote') {
          return sendResponse('asda');
        }
      });
    };

    return Content;

  })();

  module.exports = Content;

}).call(this);

},{"../../selection":8}],7:[function(require,module,exports){
(function() {
  if (typeof Node !== 'undefined') {
    Node.findSharedAncestor = function(firstNode, secondNode) {
      var ancestor, firstParentNode, secondParentNode;
      if (firstNode === secondNode) {
        return firstNode;
      } else if (secondNode.contains(firstNode) || firstNode.parentNode === secondNode) {
        return secondNode;
      } else if (firstNode.contains(secondNode) || secondNode.parentNode === firstNode) {
        return firstNode;
      } else {
        firstParentNode = firstNode;
        secondParentNode = secondNode;
        ancestor = false;
        while (firstParentNode = firstParentNode.parentNode) {
          while (secondParentNode = secondParentNode.parentNode) {
            if (firstParentNode === secondParentNode) {
              ancestor = firstParentNode;
              break;
            }
          }
          if (firstParentNode === secondParentNode) {
            ancestor = firstParentNode;
            break;
          }
          secondParentNode = secondNode;
        }
        return ancestor;
      }
    };
    Node.prototype.collectTextNodes = function() {
      var child, textNodes, _i, _len, _ref;
      textNodes = [];
      _ref = this.childNodes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        if (child.nodeType === child.TEXT_NODE) {
          textNodes.push(child);
        } else {
          textNodes = textNodes.concat(child.collectTextNodes());
        }
      }
      return textNodes;
    };
  }

}).call(this);

},{}],8:[function(require,module,exports){
(function() {
  var Selection;

  require('./node');

  Selection = (function() {
    function Selection() {
      this.getSelection();
      this.string = this.selection.toString();
      this.length = this.string.length;
      this.openTag = '<span style="background-color: green" class="quoter-selected-text">';
      this.closeTag = '</span>';
      this.ancestorNode = Node.findSharedAncestor(this.anchorNode, this.focusNode);
      this.textNodes = (this.anchorNode === this.focusNode ? [this.anchorNode] : this.ancestorNode.collectTextNodes());
      this.filterTextNodes();
      this.wrapNodes();
    }

    Selection.prototype.getSelection = function() {
      var _ref;
      this.selection = document.getSelection();
      return _ref = this.selection, this.anchorNode = _ref.anchorNode, this.anchorOffset = _ref.anchorOffset, this.baseNode = _ref.baseNode, this.baseOffset = _ref.baseOffset, this.focusNode = _ref.focusNode, this.focusOffset = _ref.focusOffset, this.focusNode = _ref.focusNode, this.focusOffset = _ref.focusOffset, this.isCollapsed = _ref.isCollapsed, this.rangeCount = _ref.rangeCount, this.type = _ref.type, _ref;
    };

    Selection.prototype.filterTextNodes = function() {
      var node, textNodes, _i, _len, _ref;
      textNodes = [];
      _ref = this.textNodes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        if (this.selection.containsNode(node)) {
          textNodes.push(node);
        }
      }
      return this.textNodes = textNodes;
    };

    Selection.prototype.wrapNodes = function() {
      var node, _i, _len, _ref, _results;
      if (this.textNodes.length === 1) {
        return this.wrapSelectedTextWithinNode(this.anchorNode, this.anchorOffset, this.focusOffset);
      } else {
        this.wrapSelectedTextWithinNode(this.anchorNode, this.anchorOffset);
        this.wrapSelectedTextWithinNode(this.focusNode, 0, this.focusOffset);
        _ref = this.textNodes.slice(1, -1);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          node = _ref[_i];
          _results.push(this.wrapSelectedTextWithinNode(node));
        }
        return _results;
      }
    };

    Selection.prototype.wrapSelectedTextWithinNode = function(node, start, end) {
      var chars, child, intermediateNode, parent;
      if (start == null) {
        start = 0;
      }
      if (end == null) {
        end = false;
      }
      parent = node.parentElement;
      if (!node.textContent.match(/^\s+$/) && parent) {
        chars = node.textContent.split('');
        chars.splice(start, 0, this.openTag);
        if (end) {
          chars.splice(end + 1, 0, this.closeTag);
        } else {
          chars.push(this.closeTag);
        }
        intermediateNode = document.createElement('span');
        intermediateNode.innerHTML = chars.join('');
        while (intermediateNode.childNodes.length) {
          child = intermediateNode.childNodes[0];
          parent.insertBefore(child, node);
        }
        return parent.removeChild(node);
      }
    };

    return Selection;

  })();

  module.exports = Selection;

}).call(this);

},{"./node":7}]},{},[1])
;