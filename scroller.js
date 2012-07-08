/**
 * Lion-esque scroller
 * @constructor
 */
function Scroller(el, options) {

  this._el = this._getWrapper(el);
  this._init();

}


/**
 * Get wrapper element for scroller
 * @param  {Object|String} el Element selector or object.
 * @return {Object} Wrapper element.
 * @function
 * @private
 */ 
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


/**
 * Initialise Scroller
 * @function
 * @private
 */
Scroller.prototype._init = function() {
  this._scrollPosition = this._scrollerAt = 0;
  this._build();
  this._bindEvents();
  this._setDimensions();
};


/**
 * Build requires html nodes
 * @function
 * @private
 */
Scroller.prototype._build = function() {
  this._scrollbar = document.createElement('div');
  this._scrollbar.className = 'scrollbar';
  this._scroller = document.createElement('div');
  this._scroller.className = 'scroll-inner';

  this._innerPane = this._el.querySelector('.inner');
  

  this._scrollbar.appendChild(this._scroller);
  this._el.appendChild(this._scrollbar);

};


/**
 * Set required dimensions for scroller
 * @function
 * @private
 */
Scroller.prototype._setDimensions = function() {
  this._elHeight = this._el.offsetHeight;
  this._scrollbarHeight = this._scrollbar.offsetHeight;
  this._contentHeight = this._innerPane.offsetHeight;
  this._scrollMax = this._elHeight - this._contentHeight;

  // find ratio of visible content
  var visibleRatio = this._elHeight / this._contentHeight;
  // Set height of scroller element to indicate visible ratio
  this._scroller.style.height = this._scrollbarHeight * visibleRatio + 'px';
  this._scrollerSpace = this._scrollbarHeight - this._scroller.offsetHeight;
};


/**
 * Handle mousewheel event
 * @param  {Event} e Event object
 * @function
 * @private
 */
Scroller.prototype._onMouseWheel = function(e) {
  e.preventDefault();
  //calculate position from mouse delta
  var deltaY = e.wheelDeltaY / 3; //TODO fix for win/ff/opera etc
  this._scrollPosition += deltaY;

  this._doScroll();
};


/**
 * Main scroll function
 * @function
 * @private
 */
Scroller.prototype._doScroll = function() {
  if (this._scrollPosition >  1) {
    this._scrollPosition = 1;
  }

  if (this._scrollPosition < this._scrollMax) {
    this._scrollPosition = this._scrollMax;
  }

  this._innerPane.style.top = this._scrollPosition + 'px';
  this._setScrollerPosition();
};


/**
 * Set position of scroller element
 * @function
 * @private
 */
Scroller.prototype._setScrollerPosition = function() {
  var percentageScrolled = Math.round(this._scrollPosition / this._scrollMax * 100);
  if (percentageScrolled > 100) { percentageScrolled = 100; }
  this._scrollerAt = this._scrollerSpace / 100 * percentageScrolled;
  this._scroller.style.top = this._scrollerAt + 'px';
};


/**
 * Bind necessary events on dom nodes
 * @function
 * @private
 */
Scroller.prototype._bindEvents = function() {
  var self = this;
  this._el.addEventListener('mousewheel', function(e) {
    self._onMouseWheel(e);
  }, false);
  this._scroller.addEventListener('mousedown', function(e) {
    self._startDragScroller(e);
  }, false);
  this._scrollbar.addEventListener('mousedown', function(e) {
    self._handleBarClick(e);
  }, false);
};


/**
 * Called when scroller drag is started, binds mouve and mousup events
 * @param  {Event} e Mouse event
 * @function
 * @private
 */
Scroller.prototype._startDragScroller = function(e) {
  e.preventDefault();
  // Get initial Y position
  this._startY = this._scroller.offsetTop;
  // get initial mouse position
  this._initialMouseY = e.clientY;
  var self = this;
  this.listener = function() {
    self._doMoveMouse();
  };
  window.addEventListener('mousemove', this.listener, false);
  window.addEventListener('mouseup', self._endMoveMouse.bind(this), false);
};


/**
 * Called on mouse move of scroller
 * @function
 * @private
 */
Scroller.prototype._doMoveMouse = function() {
  var e = window.event;
  // Get moved distance
  var dY = e.clientY - this._initialMouseY;
  // Get scroller position
  this._scrollerAt = dY + this._startY;
  // Percentage of scroller position in relation to total space
  var percentageScrolled = this._scrollerAt / this._scrollerSpace * 100;
  this._setMainScrollPercent(percentageScrolled);
};


/**
 * Called when move move stopped, removes event listeners
 * @param  {Event} e Mouse up event
 * @function
 * @private
 */
Scroller.prototype._endMoveMouse = function(e) {
  window.removeEventListener('mousemove', this.listener, false);
};


/**
 * Handle click on scroller bar
 * @param  {Event} e Click event
 * @function
 * @private
 */
Scroller.prototype._handleBarClick = function(e) {
  e.preventDefault();
  if (e.target !== this._scroller) {
    var clickedPos = e.layerY || e.offsetY;
    // set position to be halfway point of scroller
    clickedPos  -= this._scroller.offsetHeight / 2;
    // Percentage of scroller position in relation to total space
    var percentageScrolled = clickedPos / this._scrollerSpace * 100;
    this._setMainScrollPercent(percentageScrolled);
    this._startDragScroller(e);
  }
};


/**
 * Set scroller to a percentage position
 * @param {Number} percent Percentage to scroll to
 */
Scroller.prototype._setMainScrollPercent = function(percent) {
  // Use this to calculate the new position of the main content
  this._scrollPosition = -1 * (Math.abs(this._scrollMax) / 100 * percent);
  // Run main scroll function
  this._doScroll();
};


/**
 * Resize elements (e.g. when content height changes)
 * @function
 * @public
 */
Scroller.prototype.resize = function() {
  this._setDimensions();
};



