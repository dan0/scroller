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
  this._scrollPosition = 0;
  this._build();
  this._bindEvents();
  this._setDimensions();
};


Scroller.prototype._build = function() {
  this._scrollbar = document.createElement('div');
  this._scrollbar.className = 'scrollbar';
  this._scroller = document.createElement('div');
  this._scroller.className = 'scroll-inner';

  this._innerPane = this._el.querySelector('.inner');
  

  this._scrollbar.appendChild(this._scroller);
  this._el.appendChild(this._scrollbar);

};


Scroller.prototype._setDimensions = function() {
  this._elHeight = this._el.offsetHeight;
  this._scrollbarHeight = this._scrollbar.offsetHeight;
  this._contentHeight = this._innerPane.offsetHeight;
  this._scrollMax = this._elHeight - this._contentHeight;

  // find ratio of visible content
  var visibleRatio = this._elHeight / this._contentHeight;
  // Set height of scroller element to indicate visible ratio
  this._scroller.style.height = this._scrollbarHeight * visibleRatio + 'px';
};


Scroller.prototype._onMouseWheel = function(e) {
  e.preventDefault();
  var deltaY = e.wheelDeltaY / 3; //TODO fix for win/ff/opera etc
  this._scrollPosition += deltaY;

  if (this._scrollPosition >  1) {
    this._scrollPosition = 1;
  }

  if (this._scrollPosition < this._scrollMax) {
    this._scrollPosition = this._scrollMax;
  }

  this._innerPane.style.top = this._scrollPosition + 'px';
};


Scroller.prototype._bindEvents = function() {
  var self = this;
  this._el.addEventListener('mousewheel', function(e) {
    self._onMouseWheel(e);
  }, false);
};


Scroller.prototype.resize = function() {
  this._setDimensions();
};



