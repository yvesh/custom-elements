(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () {
  function a(a, b) {
    for (var c, d = 0; d < b.length; d++) {
      c = b[d], c.enumerable = c.enumerable || !1, c.configurable = !0, 'value' in c && (c.writable = !0), Object.defineProperty(a, c.key, c);
    }
  }return function (b, c, d) {
    return c && a(b.prototype, c), d && a(b, d), b;
  };
}();function _classCallCheck(a, b) {
  if (!(a instanceof b)) throw new TypeError('Cannot call a class as a function');
}function _possibleConstructorReturn(a, b) {
  if (!a) throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called');return b && ('object' == (typeof b === 'undefined' ? 'undefined' : _typeof(b)) || 'function' == typeof b) ? b : a;
}function _inherits(a, b) {
  if ('function' != typeof b && null !== b) throw new TypeError('Super expression must either be null or a function, not ' + (typeof b === 'undefined' ? 'undefined' : _typeof(b)));a.prototype = Object.create(b && b.prototype, { constructor: { value: a, enumerable: !1, writable: !0, configurable: !0 } }), b && (Object.setPrototypeOf ? Object.setPrototypeOf(a, b) : a.__proto__ = b);
}(function () {
  if (!document.getElementById('joomla-popover-stylesheet')) {
    var a = document.createElement('style');a.id = 'joomla-popover-stylesheet', a.innerHTML = '', document.head.appendChild(a);
  }
})();var PopoverElement = function (a) {
  function b() {
    return _classCallCheck(this, b), _possibleConstructorReturn(this, (b.__proto__ || Object.getPrototypeOf(b)).call(this));
  }return _inherits(b, a), _createClass(b, [{ key: 'label', get: function get() {
      return this.getAttribute('label');
    } }, { key: 'tip', get: function get() {
      return this.getAttribute('tip');
    } }, { key: 'position', get: function get() {
      return this.getAttribute('position');
    }, set: function set(a) {
      this.setAttribute('position', a);
    } }, { key: 'text', get: function get() {
      return this.getAttribute('text');
    } }], [{ key: 'observedAttributes', get: function get() {
      return ['label', 'tip', 'text', 'position'];
    } }]), _createClass(b, [{ key: 'connectedCallback', value: function connectedCallback() {
      (!this.position || this.position && -1 === ['top', 'bottom', 'left', 'right'].indexOf(this.position)) && (this.position = 'top');var a = document.createElement('button'),
          b = document.createElement('span'),
          c = this.tip,
          d = this.position,
          f = this;a.setAttribute('aria-label', this.label ? this.label : 'more info'), a.innerHTML = this.text ? this.text : '', b.setAttribute('role', 'status'), a.addEventListener('click', function showTip() {
        document.addEventListener('click', function (c) {
          a !== c.target && (b.innerHTML = '', f.removeEventListener('keydown', this));
        }), document.addEventListener('keydown', function (a) {
          9 === (a.keyCode || a.which) && (b.innerHTML = '', f.removeEventListener('keydown', this));
        }), b.innerHTML = '', b.innerHTML = '<span class="toggletip-bubble ' + d + '">' + c + '</span>';
      }), this.append(a), this.append(b);
    } }, { key: 'disconnectedCallback', value: function disconnectedCallback() {
      this.querySelector('button').removeEventListener('click', this);
    } }, { key: 'dispatchCustomEvent', value: function dispatchCustomEvent(a) {
      var b = new CustomEvent(a, { bubbles: !0, cancelable: !0 });b.relatedTarget = this, this.dispatchEvent(b), this.removeEventListener(a, this);
    } }]), b;
}(HTMLElement);customElements.define('joomla-popover', PopoverElement);

},{}]},{},[1]);
