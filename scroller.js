/**
 * Lion-esque scroller
 */

function Scroller(el, options) {

  this._el = this._getWrapper(el);
  this._init();

}

Scroller.prototype._getWrapper = function(el) {
  if (typeof el === 'string') {
    if (el.charAt(0) === '#') {
      return document.getElementById(el);
    }
    else if (el.charAt(0) === '.') {
      return document.querySelector(el);
    }
    else {
      throw new Error('please use an element, or id/class selector');
    }
  }
  else {
    return el;
  } 
};

Scroller.prototype._init = function() {
  this._build();
  this._bindEvents();
  this._setDimensions();
};

Scroller.prototype._build = function() {
  this._scrollbar = document.createElement('div');
  this._scrollbar.className = 'scrollbar';
  this._scroller = document.createElement('div');
  this._scroller.className = 'scroll-inner';

  this._scrollbar.appendChild(this._scroller);
  this._el.appendChild(this._scrollbar);

};

Scroller.prototype._setDimensions = function() {
  this._totalHeight = this._scrollbar.offsetHeight;
};

Scroller.prototype._onMouseWheel = function(e) {
  e.preventDefault();
  console.log(e);
};

Scroller.prototype._bindEvents = function() {
  var self = this;
  this._el.addEventListener('mousewheel', function(e) {
    self._onMouseWheel(e);
  }, false);
};
