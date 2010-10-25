﻿var TimeTracker = function(opt_bucket) {
  if (opt_bucket) {
    this.bucket_ = opt_bucket.sort(this.sortNumber); 
  } else {
    this.bucket_ = TimeTracker.DEFAULT_BUCKET;
  }
};

TimeTracker.prototype.startTime_;
TimeTracker.prototype.stopTime_;
TimeTracker.prototype.bucket_;
TimeTracker.DEFAULT_BUCKET = [100, 500, 1500, 2500, 5000];

/**
 * Calculates time difference between start and stop
 * @return {Number} The time difference between start and stop
 */
TimeTracker.prototype._getTimeDiff = function() {
  return (this.stopTime_ - this.startTime_);
};

/**
 * Helper function to sort an Array of numbers
 * @param {Number} arg1 The first number
 * @param {Number} arg2 The second number
 * @return {Number} The difference used to sort
 */
TimeTracker.prototype.sortNumber = function(a, b) {
  return (a - b);
};

/**
 * Records the start time
 * @param {Number} arg1 Optional start time specified by user
 */
TimeTracker.prototype._recordStartTime = function(opt_time) {
  if (opt_time != undefined) {
    this.startTime_ = opt_time;
  } else {
    this.startTime_ = (new Date()).getTime();
  }
};

/**
 * Records the stop time
 * @param {Number} arg1 Optional stop time specified by user
 */
TimeTracker.prototype._recordEndTime = function(opt_time) {
  if (opt_time != undefined) {
    this.stopTime_ = opt_time;
  } else {
    this.stopTime_ = (new Date()).getTime();
  }
};

/**
 * Tracks the event. Calculates time and sends information to
 * the event tracker passed
 * @param {Object} arg1 GA tracker created by user
 * @param {String} arg2 Optional event object name
 * @param {String} arg3 Optional event label
 */
TimeTracker.prototype._track = function(opt_event_obj_name,
                                        opt_event_label) {
	var category;

	if (opt_event_obj_name != undefined && opt_event_obj_name.length != 0) {
		category = opt_event_obj_name;
	} else {
		category = 'TimeTracker';
	}

	var i;
	var bucketString;
	for (i = 0; i < this.bucket_.length; i++) {
		if ((this._getTimeDiff()) < this.bucket_[i]) {
			if (i == 0) {
				bucketString = "0-" + (this.bucket_[0]);
				break;
			} else {
				bucketString = this.bucket_[i - 1] + "-" + (this.bucket_[i] - 1);
				break;
			}
		}
	}
	if (!bucketString) {
		bucketString = this.bucket_[i - 1] + "+";
	}
	_gaq.push(['_trackEvent', category, bucketString, opt_event_label, this._getTimeDiff()]);
};

/**
 * Sets the bucket for histogram generation in GA
 * @param {Array.<Number>} The bucket array
 */
TimeTracker.prototype._setHistogramBuckets = function(buckets_array) {
  this.bucket_ = buckets_array.sort(this.sortNumber);
};
var timeTracker = new TimeTracker();
timeTracker._recordStartTime();

//declare our window class
function DocstocWindow() 
{
	//create a reference to ourselves to access class variables and objects.  this.[var_name] doesn't work
	var me = this;
	//pointer to our outer window
	var _container = null;
	//pointer to our body div
	var _body = null;
	//pointer to the iframe
	var _iframe = null;
	var _imgPath ='/i/popup/';
	//var _imgPath ='/i/popup/';
	//set up collection of large table settings
	var _largeTableSettings = { imgTop:_imgPath + 'large/T_Main.png',
										imgBottom:_imgPath + 'large/B_Main.png',
										imgRight:_imgPath + 'large/R_Main.png',
										imgLeft:_imgPath + 'large/L_Main.png',
										imgTopLeft:_imgPath + 'large/TL_Main.png',
										imgTopRight:_imgPath + 'large/TR_Main.png',
										imgBottomLeft:_imgPath + 'large/BL_Main.png',
										imgBottomRight:_imgPath + 'large/BR_Main.png',
										imgCloseButton:_imgPath + 'large/btn_close.gif',
										widthTopLeft:'26px',
										widthTopRight:'30px',
										widthLeft:'26px',
										widthRight:'30px',
										widthBottomLeft:'26px',
										widthBottomRight:'30px',
										widthCloseButton:'13px',
										heightTopLeft:'43px',
										heightTop:'43px',
										heightTopRight:'43px',
										heightBottomLeft:'32px',
										heightBottom:'32px',
										heightBottomRight:'32px',
										heightCloseButton:'15px',
										topCloseButton:'10px',
										rightCloseButton:'20px',
										rightToolTip:'34px' };
	//set up collection of small table settings
	var _smallTableSettings = { imgTop:_imgPath + 'small/s_T_main2.png',
										imgBottom:_imgPath + 'small/s_B_main2.png',
										imgRight:_imgPath + 'small/s_R_main2.png',
										imgLeft:_imgPath + 'small/s_L_main2.png',
										imgTopLeft:_imgPath + 'small/s_TL_main2.png',
										imgTopRight:_imgPath + 'small/s_TR_main2.png',
										imgBottomLeft:_imgPath + 'small/s_BL_main2.png',
										imgBottomRight:_imgPath + 'small/s_BR_main2.png',
										imgCloseButton:_imgPath + 'small/btn_close2.gif',
										widthTopLeft:'18px',
										widthTopRight:'19px',
										widthLeft:'18px',
										widthRight:'19px',
										widthBottomLeft:'18px',
										widthBottomRight:'19px',
										widthCloseButton:'20px',
										heightTopLeft:'28px',
										heightTop:'28px',
										heightTopRight:'28px',
										heightBottomLeft:'19px',
										heightBottom:'19px',
										heightBottomRight:'19px',
										heightCloseButton:'20px',
										topCloseButton:'5px',
										rightCloseButton:'5px',
										rightToolTip:'34px' };
	//get browser name and version.  we use the javascript intrinsic navigator object to retrieve this information
	var _browserName = navigator.appName;
	var _browserVer = new String(navigator.appVersion);
	
	// safari, mozilla and ie treat "scrollTop" and "scrollLeft" differently.
	var _bodyScrollLeft = 0;
	var _bodyScrollTop = 0;
	var _bodyScrollWidth = 0;
	var _bodyScrollHeight = 0;
	
	//the true height represents the proper height of this control including the header and footer heights.  
	//the height specified by the user is used to set the height of the body of the window.
	var _trueHeight = '400px';
	//set up click messages
	var _smallClickMessage = 'esc or ';
	var _largeClickMessage = 'press escape or click button to close';
	
	//declare our options
	this.title='New Window'; 
	this.draggable=true; 
	this.width='400px'; 
	this.height='400px'; 
	this.top='20px'; 
	this.left='20px'; 
	this.zindex = '1000';
	this.centered = true;
	this.closeOnEsc = true;
	this.type = 1;	//type defines the, um, type of the popup:  0 - large, 1 - small
	this.formId = null;
	this.clearContentOnHide = true;
	this.preserveContent = false;
	this.scrollBars = false;
	this.instanceName = null;
	this.contentOwnerElement = null;
	this.divId = null;
	this.onClose = function(){}; //gets called when window closes
	this.displayCloseButton = true;
	//initialize our new window.  The divId is the id of the div that should be created as the container
	//of our new window.  Options is a collection of values utilized in the creation of our window
	this.init = function(divId)
	{
		me.divId = divId;

		me.setBodyScrolls();

		//create the div in the current window
		_container = document.createElement('div');
		_container.setAttribute('id', divId);
		_container.setAttribute('style', '');
		
		//set up styles this way cuz of IE. piece of shit doesn't take the setAttribute styles
		_container.style.position = 'absolute';
		_container.style.visibility = 'hidden';
		_container.style.width = me.width;
		_container.style.top = me.top;
		_container.style.left = me.left;
		_container.style.zIndex = me.zindex;
		
		//add the proper table structure with the correct styles to the div
		var table = "";
		
		switch (me.type)
		{
			case 0:
				table = me.getTable(divId, _largeTableSettings);
				break;
			case 1:
				table = me.getTable(divId, _smallTableSettings);
				break;
		}
		
		//set the html of our container
		_container.innerHTML = table;
		
		//if this is IE 6.0, place an iframe behind our div
		if ((_browserName == "Microsoft Internet Explorer") && (_browserVer.indexOf("MSIE 6.0") >= 0))
		{
			//"<iframe src='j avascript:'<html></html>';' style='position:absolute;top:50px;left:50px;width:200px;height:200px;overflow:hidden;border:none' allowtransparency='true'></iframe>";
			//'<iframe id="' + this.element.id + '_iefix" '+ 'style="display:none;position:absolute;filter:progid:DXImageTransform.Microsoft.Alpha(opacity=0);" ' + 'src="javascript:false;" frameborder="0" scrolling="no"></iframe>'
			
			var myIFrame = document.createElement('iframe');
			
			myIFrame.setAttribute('id', divId + '_iframe');
			myIFrame.setAttribute('src', "javascript:false;");
			myIFrame.setAttribute('frameborder', '0');
			myIFrame.setAttribute('style', '');
			
			myIFrame.style.position = 'absolute';
			myIFrame.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=0)';
			myIFrame.style.zIndex = me.zindex - 1;
			myIFrame.style.width = me.width;
			myIFrame.style.height = _trueHeight;
			myIFrame.style.top = me.top;
			myIFrame.style.left = me.left;
			
			//set the body style so the transparency works in ie (fucken hack!)
			//document.body.style.backgroundColor = 'transparent';
			//inject our iframe into the body of the document
			document.body.appendChild(myIFrame);
			
			//get reference to our iframe
			_iframe = document.getElementById(divId + '_iframe');
			_iframe.style.visibility = 'visible';
		}
		
		if (me.formId != null)
		{
			document.getElementById(me.formId).appendChild(_container);
		}
		else
		{	//inject our new div into the body of the document
			document.body.appendChild(_container);
		}
		
		//get our body element
		_body = document.getElementById(divId + '_docWinBody');

		//make our div draggable
		if (me.draggable){ Drag.init(_container, null, 
											_bodyScrollLeft, _bodyScrollLeft + _bodyScrollWidth,
											_bodyScrollTop, _bodyScrollTop + _bodyScrollHeight);
		}
		//center our div
		if (me.centered){ me.center();}
		//register for escape key capture
		if (me.closeOnEsc){ me.registerAsKeyListener();}
	};	//end init

	this.getTable = function(divId, settings) {
		//set true height to be used later
		_trueHeight = (parseInt(me.height, 10) + parseInt(settings.heightTop, 10) + parseInt(settings.heightBottom, 10) + 10) + 'px';

		//get body width
		var bodyWidth = (parseInt(me.width, 10) - parseInt(settings.widthLeft, 10) - parseInt(settings.widthRight, 10)) + 'px';

		//set up the cursor for the header
		var cursorStyle = '';
		if (me.draggable){ cursorStyle = 'cursor:move;';}

		//set up click message
		var clickMessage = '';
		if (parseInt(me.width, 10) > 200) {
			clickMessage = _largeClickMessage;
		}
		else {
			clickMessage = _smallClickMessage;
		}



		//set up close button behavior
		var closeOnMouseOver = "javascript:document.getElementById(\"" + divId + "_docWinToolTip\").style.visibility = \"visible\";";
		var closeOnMouseOut = "javascript:document.getElementById(\"" + divId + "_docWinToolTip\").style.visibility = \"hidden\";";
		var closeOnClick = "document.getElementById(\"" + divId + "\").style.visibility = \"hidden\";";
		if (me.instanceName != null){ closeOnClick = 'javascript:' + me.instanceName + '.hide();';}

		closeTxt = 'Close';

		if (this.displayCloseButton == false) {
			settings.imgCloseButton = "";
			closeOnMouseOver = "";
			closeOnMouseOut = "";
			closeTxt = "";
		}

		var table = "<table border='0' cellpadding='0' cellspacing='0' style='width:" + me.width + ";'>" +
							"<tr>" +
								"<td style='width:" + settings.widthTopLeft + "; height: " + settings.heightTopLeft + "; " +
										"background:transparent " + me.getImageStyleString(settings.imgTopLeft) + "; " + cursorStyle + "'></td>" +
								"<td style='background:transparent " + me.getImageStyleString(settings.imgTop) + "; " +
										"height:" + settings.heightTop + "; " + cursorStyle + "' valign='bottom' align='center'>" +
									me.title +
									"<div id='" + divId + "_docWinToolTip' style='display:none; position:absolute; visibility:hidden; " +
											"top:" + settings.topCloseButton + "; right:" + settings.rightToolTip + "; background:transparent; color:#FFFFFF; '>" +
									clickMessage + "</div>" +
									"<div style='font-size:12px;padding:3px 37px 0 0;-padding-right:23px; font-weight:bold;position:absolute; top:" + settings.topCloseButton + "; right:" + settings.rightCloseButton + "; " +
											"width:" + settings.widthCloseButton + "; height:" + settings.heightCloseButton + "; " +
											"background-image:url(" + settings.imgCloseButton + "); background-position:right top; background-repeat: no-repeat; cursor:default;' " +
											"onclick='" + closeOnClick + "' " +
											"onmouseover='" + closeOnMouseOver + "' " +
											"onmouseout='" + closeOnMouseOut +
											"'>" + closeTxt + "</div>" +
								"</td>" +
								"<td style='width:" + settings.widthTopRight + "; height: " + settings.heightTopRight + "; " +
										"background:transparent " + me.getImageStyleString(settings.imgTopRight) + "; " + cursorStyle + "'></td>" +
							"</tr>" +
							"<tr>" +
								"<td style='width:" + settings.widthLeft + "; " +
										"background: transparent repeat-y " + me.getImageStyleString(settings.imgLeft) + ";'></td>" +
								"<td style='background-color:#FFFFFF;'>" +
									"<div id='" + divId + "_docWinBody' style='height:" + me.height + ";width:" + bodyWidth + "; background:#d5d5d5'></div>" +
								"</td>" +
								"<td style='width:" + settings.widthRight + "; " +
										"background:transparent repeat-y top right " + me.getImageStyleString(settings.imgRight) + ";'></td>" +
							"</tr>" +
							"<tr>" +
								"<td style='width:" + settings.widthBottomLeft + "; height: " + settings.heightBottomLeft + "; " +
										"background:transparent " + me.getImageStyleString(settings.imgBottomLeft) + ";'></td>" +
								"<td style='background:transparent " + me.getImageStyleString(settings.imgBottom) + "; " +
										"height:" + settings.heightBottom + ";' valign='bottom'></td>" +
								"<td style='width:" + settings.widthBottomRight + "; height: " + settings.heightBottomRight + "; " +
										"background:transparent " + me.getImageStyleString(settings.imgBottomRight) + ";'></td>" +
							"</tr>" +
						"</table>";
		return table;
	};
	
	this.getImageStyleString = function(imgSrc)
	{
		//return variable
		var imgStyleString = "";
		
		//ie 6 and 7 both return version 4.0 as the initial version in the variable but then say the full version of the browser later in the string.
		if ((_browserName == "Microsoft Internet Explorer") && (_browserVer.indexOf("MSIE 6.0") >= 0))
		{	//if ie6, return a filter that would load the png correctly
			imgStyleString = '; filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + imgSrc + '", sizingMethod="scale")';
		}
		else
		{	//if else, just return a url string
			imgStyleString = "url(" + imgSrc + ")";
		}
		
		return imgStyleString;
	};
	
	//remove the div from the page
	this.destroy = function()
	{
		document.body.removeChild(_container);
		if (_iframe != null){ document.body.removeChild(_iframe);}
	};
	
	this.registerAsKeyListener = function()
	{
		if (document.attachEvent)
		{
			document.attachEvent('onkeyup', me.onKeyPress);
		}
		else
		{
			document.addEventListener('keyup', me.onKeyPress, true);
		}
	};
	
	this.onKeyPress = function(e)
	{
		var keyPressed;
		
		if (window.event) // IE
		{
			keyPressed = event.keyCode;
		}
		else if(e.which) // Netscape/Firefox/Opera
		{
			keyPressed = e.which;
		}
		
		if (keyPressed == 27)
		{	//escape key was pressed
			me.hide();
		}
	};
	
	//set content
	this.setContent = function(content)
	{
		//fix for object not showing up properly under IE
		if (content.substr(0, 7) == "<OBJECT"){ content = "<div style='height:0px;width:0px;'>&nbsp;</div>" + content;}
		_body.innerHTML = content;
	};
	//set the location where content was grabbed from
	this.setContentOwner = function(el)
	{
	    me.contentOwnerElement = el;
	};	
	
	//return the content
	this.getContent = function()
	{
		return _body.innerHTML;
	};
	
	//set url
	this.setUrl = function(url)
	{
		var scrollText = "scrolling='auto'";
		if (!me.scrollBars) {scrollText = "scrolling='no'";}
		
		var iframe = "<iframe width='100%' height='100%' src='" + url + "' border='0' frameborder='0' " + scrollText + "></iframe>";
		_body.innerHTML = iframe;
	};
	
	//set ajax content
	this.setAjaxContent = function(action, url, data)
	{
		//declare object
		var oAjax = new AjaxObject101();
		
		//set response type
		oAjax.returnXml = false;
		
		//set method delegates
		//oAjax.funcWait = Working;
		oAjax.funcDone = me.OnAjaxReturn;
		
		oAjax.sndReq(action, url, data);
	};
	
	this.OnAjaxReturn = function(data)
	{
		me.setContent(data);
	};
	
	//show our window
	this.show = function()
	{
		me.setBodyScrolls();
		if (me.centered){ me.center();}
		_container.style.visibility = 'visible';
		if (_iframe != null){ _iframe.style.visibility = 'visible';}


	};	//end show
	
	//hide our window
	this.hide = function()
	{
		_container.style.visibility = 'hidden';
		document.getElementById(me.divId + "_docWinToolTip").style.visibility = "hidden";
		if (_iframe != null){ _iframe.style.visibility = 'hidden';}
		if (me.preserveContent && me.contentOwnerElement!=null) {me.contentOwnerElement.innerHTML = me.getContent();}
		if (me.clearContentOnHide){ me.setContent('');}
		me.onClose();
	};	//end hide
	
	this.center = function()
	{
		_container.style.left = "50%";
		_container.style.top = "50%";

		var newLeft = _container.offsetLeft;
		//take into account the scrolling of the browser
		newLeft = (newLeft - _container.offsetWidth / 2) + _bodyScrollLeft;
		//make sure we're not in the negatives
		if (newLeft <= 0){ newLeft = 1;}
		//make sure we're in the scrollable area
		if (newLeft < _bodyScrollLeft) {newLeft = _bodyScrollLeft;}
		//set up the string
		newLeft = parseInt(newLeft, 10);
		newLeft = newLeft.toString() + 'px';

		//set left
		_container.style.left = newLeft;
		if (_iframe != null){ _iframe.style.left = newLeft;}
		
		var newTop = _container.offsetTop;
		//take into account the scrolling of the browser
		newTop = (newTop - _container.offsetHeight / 2) + _bodyScrollTop;
		//check negatives
		if (newTop <= 0){ newTop = 1;}
		//make sure we're in the scrollable area
		if (newTop < _bodyScrollTop){ newTop = _bodyScrollTop;}
		//set up string
		newTop = parseInt(newTop, 10);
		newTop = newTop.toString() + 'px';
		
		//set top
		_container.style.top = newTop;
		if (_iframe != null){ _iframe.style.top = newTop;}
	
	};
	
	this.setLocation = function(top, left)
	{
		_container.style.left = left;
		_container.style.top = top;
	};
	
	//position denotes on which side of the element this div should line up.  accepted values are top, bottom, left, right
	this.setLocationByElement = function(elementId, position)
	{
	
		//get the absolute top and left of the passed in document
		var top = elementId.offsetTop;
		var left = elementId.offsetLeft;
		var offsetParent = elementId.offsetParent;
		
		while (offsetParent !=null && offsetParent.tagName != 'BODY')
		{
			top += offsetParent.offsetTop;
			left += offsetParent.offsetLeft;
			
			offsetParent = offsetParent.offsetParent;
		}
		
		//take into account the user desired position
		switch (position)
		{
			case 'top':
				//left remains the same.  top should be decremented by the height of our control
				top -= parseInt(me.height,10);
				
				break;
			case 'bottom':
				//left remains the same.  top should be incremented by the height of the client control
				top += elementId.offsetHeight;
				
				break;
			case 'left':

				//top remains the same.  left should be decremented by the width of our control
				left -=parseInt(me.width,10);
				break;
			case 'right':
				//top remains the same. left should be incremented by the width of the client control
				left += elementId.offsetWidth;
				
				break;
		}
		
		//set the location
		me.setLocation(top + 'px', left + 'px');
	};
	
			
	this.setBodyScrolls = function()
	{
	    
		// safari, mozilla and ie treat "scrollTop" and "scrollLeft" differently.
		if(_browserVer.indexOf("Safari") != -1)
		{
			_bodyScrollLeft	= document.body.scrollLeft;
			_bodyScrollTop		= document.body.scrollTop;
			_bodyScrollWidth	= document.body.scrollWidth;
			_bodyScrollHeight	= document.body.scrollHeight;
			return;
		}
		_bodyScrollLeft	= document.documentElement.scrollLeft;
		_bodyScrollTop		= document.documentElement.scrollTop;
		_bodyScrollWidth	= document.documentElement.scrollWidth;
		_bodyScrollHeight	= document.documentElement.scrollHeight;

		return;
	};
		
	
	/**************************************************
	* dom-drag.js
	* 09.25.2001
	* www.youngpup.net
	* Script featured on Dynamic Drive (http://www.dynamicdrive.com) 12.08.2005
	**************************************************
	* 10.28.2001 - fixed minor bug where events
	* sometimes fired off the handle, not the root.
	**************************************************/
	var Drag = {
		obj: null,

		init: function(o, oRoot, minX, maxX, minY, maxY, bSwapHorzRef, bSwapVertRef, fXMapper, fYMapper) {
			o.onmousedown = Drag.start;
			o.hmode = bSwapHorzRef ? false : true;
			o.vmode = bSwapVertRef ? false : true;
			o.root = oRoot && oRoot != null ? oRoot : o;

			if (o.hmode && isNaN(parseInt(o.root.style.left, 10))){ o.root.style.left = "0px";}
			if (o.vmode && isNaN(parseInt(o.root.style.top, 10))){ o.root.style.top = "0px";}
			if (!o.hmode && isNaN(parseInt(o.root.style.right, 10))){ o.root.style.right = "0px";}
			if (!o.vmode && isNaN(parseInt(o.root.style.bottom, 10))){ o.root.style.bottom = "0px";}

			o.minX = typeof minX != 'undefined' ? minX : null;
			o.minY = typeof minY != 'undefined' ? minY : null;
			o.maxX = typeof maxX != 'undefined' ? maxX : null;
			o.maxY = typeof maxY != 'undefined' ? maxY : null;
			o.xMapper = fXMapper ? fXMapper : null;
			o.yMapper = fYMapper ? fYMapper : null;
			o.root.onDragStart = new Function();
			o.root.onDragEnd = new Function();
			o.root.onDrag = new Function();
		},

		start: function(e) {
			var o = Drag.obj = this;

			e = Drag.fixE(e);

			var y = parseInt(o.vmode ? o.root.style.top : o.root.style.bottom, 10);
			var x = parseInt(o.hmode ? o.root.style.left : o.root.style.right, 10);

			o.root.onDragStart(x, y);
			o.lastMouseX = e.clientX;
			o.lastMouseY = e.clientY;

			if (o.hmode) {
				if (o.minX != null){ o.minMouseX = e.clientX - x + o.minX;}
				if (o.maxX != null){ o.maxMouseX = o.minMouseX + o.maxX - o.minX;}
			}
			else {
				if (o.minX != null){ o.maxMouseX = -o.minX + e.clientX + x;}
				if (o.maxX != null){ o.minMouseX = -o.maxX + e.clientX + x;}
			}

			if (o.vmode) {
				if (o.minY != null){ o.minMouseY = e.clientY - y + o.minY;}
				if (o.maxY != null){ o.maxMouseY = o.minMouseY + o.maxY - o.minY;}
			}
			else {
				if (o.minY != null){ o.maxMouseY = -o.minY + e.clientY + y;}
				if (o.maxY != null) {o.minMouseY = -o.maxY + e.clientY + y;}
			}

			document.onmousemove = Drag.drag;
			document.onmouseup = Drag.end;

			return false;
		},

		drag: function(e) {
			e = Drag.fixE(e);

			var o = Drag.obj;
			var ey = e.clientY;
			var ex = e.clientX;
			var y = parseInt(o.vmode ? o.root.style.top : o.root.style.bottom, 10);
			var x = parseInt(o.hmode ? o.root.style.left : o.root.style.right, 10);
			var nx, ny;

			if (o.minX != null){ ex = o.hmode ? Math.max(ex, o.minMouseX) : Math.min(ex, o.maxMouseX);}
			if (o.maxX != null){ ex = o.hmode ? Math.min(ex, o.maxMouseX) : Math.max(ex, o.minMouseX);}
			if (o.minY != null){ ey = o.vmode ? Math.max(ey, o.minMouseY) : Math.min(ey, o.maxMouseY);}
			if (o.maxY != null){ ey = o.vmode ? Math.min(ey, o.maxMouseY) : Math.max(ey, o.minMouseY);}

			nx = x + ((ex - o.lastMouseX) * (o.hmode ? 1 : -1));
			ny = y + ((ey - o.lastMouseY) * (o.vmode ? 1 : -1));

			if (o.xMapper) {
				nx = o.xMapper(y);
			} else if (o.yMapper) {
				ny = o.yMapper(x);
			}

			Drag.obj.root.style[o.hmode ? "left" : "right"] = nx + "px";
			Drag.obj.root.style[o.vmode ? "top" : "bottom"] = ny + "px";
			Drag.obj.lastMouseX = ex;
			Drag.obj.lastMouseY = ey;
			Drag.obj.root.onDrag(nx, ny);

			return false;
		},

		end: function() {
			document.onmousemove = null;
			document.onmouseup = null;

			Drag.obj.root.onDragEnd(parseInt(Drag.obj.root.style[Drag.obj.hmode ? "left" : "right"],10),
											 parseInt(Drag.obj.root.style[Drag.obj.vmode ? "top" : "bottom"],10));
			Drag.obj = null;
		},

		fixE: function(e) {
			if (typeof e == 'undefined'){ e = window.event;}
			if (typeof e.layerX == 'undefined'){ e.layerX = e.offsetX;}
			if (typeof e.layerY == 'undefined'){ e.layerY = e.offsetY;}

			return e;
		}
	};	//end drag class
	

}	//end class





/* global declartions */
var formPrefix = 'ctl00_ContentPlaceHolder1_';

window.ie6 = navigator.userAgent.toLowerCase().indexOf('msie 6') != -1;

//set up the onkeyup event
document.onkeyup = handleEsc;

var _docWin = null;
var _folderWin = null;
var _inviteWin = null;
var _genWin = null;
var InsideStartDelay = false;
var OkToDisplay = false;
var StartDelay = 1000;
var currentDocId = 0;
var take=false;
var wndAddToFolder;
var _adminUpdateDocWin = null;
var _adimDelDocWin = null;
var _liveChatWin = null;
var _chatWin = null;

function ShowAdminDelDocWin(docId)
{
	if (_adimDelDocWin == null)
	{
		//instantiate window
		_adimDelDocWin = new DocstocWindow();
		//set properties
		_adimDelDocWin.title = '';
		_adimDelDocWin.height = '260px';
		_adimDelDocWin.width = '400px';
		_adimDelDocWin.draggable = true;
		_adimDelDocWin.centered = true;
		_adimDelDocWin.instanceName = '_adimDelDocWin';
		//initialize our window
		_adimDelDocWin.init('adimDelDocWin');
		_adimDelDocWin.onClose = function()
								{
									if ($('flashContainerParent')!=undefined){
										$('blackbg').setStyle('display','none');
									}
								};
		
		//create translucent background	
		DisableScreen('blackbg','#000000','.7');

	}
	if ($('flashContainerParent')!=undefined){
		$('blackbg').setStyle('display','block');
	}
	
	_adimDelDocWin.setUrl("/Docs/DeleteDoc.aspx?doc_id=" + docId);
	_adimDelDocWin.show();
}

function InitGenWin()
{
	//instantiate document window
	_genWin = new DocstocWindow();
	//set properties
	_genWin.title = '';
	_genWin.height = '50px';
	_genWin.width = '300px';
	_genWin.draggable = false;
	_genWin.centered = true;
	_genWin.instanceName = '_genWin';
	//initialize our window
	_genWin.init('genWin');
}

function ShowGenWin(text)
{
	//initialize the window if it hasn't yet been
	if (_genWin == null){ InitGenWin();}
	
	//set content
	_genWin.setContent("<div style='vertical-align:middle;text-align:center;'>" + text + "</div>");
	_genWin.show();
}

function closePopupWindow()
{
  if (_docWin != null){ _docWin.hide();}
  if (_folderWin != null){ _folderWin.hide();}
  if (_inviteWin != null){ _inviteWin.hide();}
}

function InitDocWin()
{
	//instantiate document window
	_docWin = new DocstocWindow();
	//set properties
	_docWin.title = '';
	_docWin.height = '500px';
	_docWin.width = '900px';
	_docWin.draggable = true;
	_docWin.centered = true;
	_docWin.instanceName = '_docWin';
	//initialize our window
	_docWin.init('docWin');
}

function InitFolderWin()
{
	//instantiate document window
	_folderWin = new DocstocWindow();
	//set properties
	_folderWin.title = '';
	_folderWin.height = '300px';
	_folderWin.width = '416px';
	_folderWin.draggable = false;
	_folderWin.centered = false;
	_folderWin.type = 1;
	_folderWin.instanceName = '_folderWin';
	_folderWin.clearContentOnHide = false;
	//initialize our window
	_folderWin.init('folderWin');
}

function handleEsc(e)
{
    var keyPressed;
    if (window.event) // IE
    {
        keyPressed = event.keyCode;
    }
    else if(e.which) // Netscape/Firefox/Opera
    {
        keyPressed = e.which;
    }
    
    if (keyPressed == 27)
    {
        closePopupWindow(); 
    }
}

function ShowAdminUpdateDocument(docId)
{
	if (_adminUpdateDocWin == null)
	{
		_adminUpdateDocWin = new DocstocWindow();
		//set properties
		_adminUpdateDocWin.title = '';
		_adminUpdateDocWin.height = '225px';
		_adminUpdateDocWin.width = '500px';
		_adminUpdateDocWin.draggable = true;
		_adminUpdateDocWin.centered = true;
		_adminUpdateDocWin.closeOnEsc = true;
		_adminUpdateDocWin.type = 1;
		_adminUpdateDocWin.instanceName = '_adminUpdateDocWin';
		//initialize our window
		_adminUpdateDocWin.init('adminUpdateDocWin');
		_adminUpdateDocWin.onClose = function()
								{
									//if ($('flashContainerParent')!=undefined){
										$('blackbg').setStyle('display','none');
									//}
								};
		
		//create translucent background	
		DisableScreen('blackbg','#000000','.7');
	}
	//if ($('flashContainerParent')!=undefined){
		$('blackbg').setStyle('display','block');
	//}
	_adminUpdateDocWin.setUrl("/Docs/Document-Edit.aspx?doc_id=" + docId);
	_adminUpdateDocWin.show();
}

function showDocWindow(docId,filename)
{
	OkToDisplay = false;
    this.MyTimer = setTimeout("openPopup('"+docId+"','"+escape(filename)+"')", StartDelay);
	InsideStartDelay = true;
}
function previewDoc(docId)
{
	openPopup(docId,null);
}

function cancelDocWindow() 
{
    clearTimeout(this.MyTimer);    
    InsideStartDelay = false;
    OkToDisplay = true;        
}

function openPopup(docId,filename,nobuybutton) 
{
	try 
	{
		clearTimeout(this.MyTimer);
		var extraParams = '';
        if(nobuybutton)
        {
            extraParams = "&nobuybutton=1";
        }
		if(_docWin != null) { _docWin.destroy(); _docWin = null; }
		InitDocWin();

		if (docId == 0)
		{
			_docWin.setUrl(filename);
		}
		else
		{
			_docWin.setUrl('/docs/Document-QuickView.aspx?doc_id=' + docId +extraParams);
		}

		_docWin.show();

		InsideStartDelay = false;
		OkToDisplay = true;
	}
	catch(e)
	{
		alert(e.message);
		InsideStartDelay = false;
		OkToDisplay = true;
	}
}

function findPos(obj) 
{
	var curleft = 0;
	var curtop = 0;
	if (obj.offsetParent) 
	{
		curleft = obj.offsetLeft;
		curtop = obj.offsetTop;
	
		while (obj = obj.offsetParent) 
		{
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
		}
	}
	return [curleft,curtop];
}

function hideFolderTreeWindow()
{
	_folderWin.hide();
	return false;
}

function openFolderTreeWindow(docId, evt) 
{
	var elem = evt.target || event.srcElement;
	currentDocId = docId;    
	var coor = findPos(elem);

	try 
	{
		if (_folderWin == null) {InitFolderWin();}
		
		_folderWin.setUrl("/FolderTreeWindow.aspx?docid=" + docId);
		var posLeft= coor[0]-380;
		if (posLeft<0){posLeft=coor[0];}
		_folderWin.setLocation(coor[1]+15 + "px", posLeft + "px");
		_folderWin.show();
		
		InsideStartDelay = false;
		OkToDisplay = true;
		window.scrollTo(0,coor[1]);
	}
	catch(e)
	{
		alert(e);
		InsideStartDelay = false;
		OkToDisplay = true;
	}
	return false;
}


function defaultbutton(e,objID, isAjax){
	var keyPressed;
	var isFF = false;
    
    if (isAjax=='undefined' || isAjax==null){isAjax=true;}
    
	if (window.event) // IE
	{
		keyPressed = event.keyCode;
	}
	else if(e.which) // Netscape/Firefox/Opera
	{
		keyPressed = e.which;
		isFF = true;
	}
	
	if (keyPressed == 13)
	{
	    var obj = $(objID);
	    if (obj.type=='image' && isFF==true && isAjax==true){
	        //hack for imagebuttons
	        var nameX = obj.name + '.x';
	        var nameY = obj.name + '.y';

            if ($(nameX) ==null || $(nameX) =='undefined'){
                var clickX = document.createElement("input");
                clickX.type = 'hidden';
                clickX.value = '10';
                clickX.name = nameX;
                clickX.id = nameX;
                theForm.appendChild(clickX);
            }
            if ($(nameY) ==null || $(nameY) =='undefined'){
                var clickY = document.createElement("input");
                clickY.type = 'hidden';
                clickY.value = '10';
                clickY.name = nameY;
                clickY.id = nameY;
                theForm.appendChild(clickY);
            }
	    }
        //do the click
        try{obj.click();}catch(e1){}

	    return false;
	}
	return true;
}
function KeyDownHandler(btn)    
{  
    // process only the Enter key
    if (event.keyCode == 13) 
    {
        // cancel the default submit
        event.returnValue=true;
        event.cancel = false;
        // submit the form by programmatically clicking the specified button
        btn.click();  
    }
}
function setCookie(name,value,days){
	var expires;
	if (days)
	{
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		expires = "; expires="+date.toGMTString();
	}
	else {expires = "";}
	document.cookie = name+"="+value+expires+"; path=/";
}
function getCookie(name)
{
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1)
    {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    }
    else
    {
        begin += 2;
    }
    var end = document.cookie.indexOf(";", begin);
    if (end == -1)
    {
        end = dc.length;
    }
    return unescape(dc.substring(begin + prefix.length, end));
}


function handleSearchEnter(e,type)
{
    return handleEnter(e,doSearch,type)
}

function handleRequestEnter(e,type)
{
	 return handleEnter(e,doRequest,type)
}

function handleEnter(e, func,arg1)
{
	
	var keyPressed;

	if (window.event) // IE
	{
		keyPressed = event.keyCode;
	}
	else if(e.which) // Netscape/Firefox/Opera
	{
		keyPressed = e.which;
	}
	if (keyPressed == 13)
	{
        e = e || window.event;	
	    targ = e.target || e.srcElement;   
		func(arg1,targ);
	    return false;
	}
	return true;
}
function doSearchHomepage(type){
	return  doSearch(type,'txtSearchDocuments');
}
function doSearchError(type)
{
	return doSearch(type, 'txtSearchError');
}
function doSearchReadOnly(type)
{
	return doSearch(type, 'txtSearchReadOnly');
}
function doSearchPageNotFound(type)
{
	return doSearch(type, 'txtSearchPageNotFound');
}

function doSearch(type, altCntrl){
	var txtCntrl = $('txtSearch');
	if(altCntrl)
	{
		txtCntrl = $(altCntrl);
	}
	
	if(txtCntrl.value !='' && txtCntrl.value !='search all documents')
	{
	    var q=escape(txtCntrl.value.replace(/-/g,"--").replace(/ /g,"-"));
    	
	    if (type=='blog'){
		    window.location.href = '/blogs/browseblog.aspx?txtsearch=' + q;
	    }else if(type=='store')
	    {
	        window.location.href = '/Store/search/'+q+'/?catID=24&subcatID=' + $('drpStoreCats').value;
    	
	    }else{
		    window.location.href = '/search/' + q + '?catfilter=1';
	    }
	}
    
}

function doRequest(type, control)
{
	txtCntrl = $(control);
	var q=escape(txtCntrl.value);
	window.location.href ='/handlers/StatTracker.ashx?statisticType=Requests&activityType='+type+'&url=/requests/'+q+'/';
}
function doCategorySearch(){
	var q=escape($('txtSearchWithinCat').value.replace(/-/g,"--").replace(/ /g,"-"));
	window.location.href = '/search/' + q + '/?catID=' + CategoryID + '&subcatID=' + SubCategoryID + '&subsubCID=' + SubSubCategoryID;   
}
//clears the value of the search box if the content is 'search all docs'
function clearValue(el)
{
    if (el.valueCleared){return;}
    el.value = "";
    el.valueCleared =true;
}
function clearSearch(el)
{
	if (el.value.indexOf('search all')>-1){el.value = "";}
}		

function SetLanguage(ltype,displayLang)
{
	setCookie("langType",ltype);
	setCookie("displayLang",Base64.encode(displayLang));
	window.location.reload();
	return false;
}
function SetDocType(dtype)
{
	if (dtype=='-1'){dtype="";}
	setCookie("docType",dtype);
	window.location.reload();
	return false;
}
function setItemsPerPage(value){
    setCookie("pageSize",value,3650);
    window.location.reload();
}
function initScrollLayer() {

  // arguments: id of layer containing scrolling layers (clipped layer), id of layer to scroll, 
  // if horizontal scrolling, id of element containing scrolling content (table?)
  var wndo = new dw_scrollObj('wnch', 'lyr1');

  // bSizeDragBar set true by default (explained at www.dyn-web.com/dhtml/scroll/ )
  // wndo.bSizeDragBar = false;
  
  // arguments: dragBar id, track id, axis ("v" or "h"), x offset, y offset
  // (x/y offsets of dragBar in track)
  wndo.setUpScrollbar("dragBarch", "trackch", "v", 1, 1);
  
  // pass id('s) of scroll area(s) if inside table(s)
  // i.e., if you have 3 (with id's wn1, wn2, wn3): dw_scrollObj.GeckoTableBugFix('wn1', 'wn2', 'wn3');
  dw_scrollObj.GeckoTableBugFix('wnch'); 
}

//removes flashing images on the onmouseover command
try{document.execCommand("BackgroundImageCache",false,true);}catch(e){}

function gotoProfile(){ShowGenWin('You need to log in to see your profile!');}

function isValidateEmail(email)
{
	var exp = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/; 
	if (exp.test(email))
	{ 
		return true;
	}
	return false;
}


function AttachScript(url) {
    var head = document.getElementsByTagName('head').item(0);
    var js = document.createElement('script');
    js.setAttribute('language', 'javascript');
    js.setAttribute('type', 'text/javascript');
    js.setAttribute('src', url);
    head.appendChild(js);
    return false;
}

function changeParentUrl(url)
{
	window.location.href = url;
}

function ShowChatPopup() {
	if (_chatWin == null) {
		//instantiate document window
		_chatWin = new DocstocWindow();
		//set properties
		_chatWin.title = '';
		_chatWin.height = '300px';
		_chatWin.width = '245px';
		_chatWin.draggable = true;
		_chatWin.centered = true;
		_chatWin.closeOnEsc = true;
		_chatWin.type = 1;
		_chatWin.instanceName = '_chatWin';
		_chatWin.clearContentOnHide = false;
		//initialize our window
		_chatWin.init('chatWin');
		_chatWin.setUrl("/Purchase/purchase-popup.aspx");
		_chatWin.center();
	}
	_chatWin.show();
	return false;
}

function docstoclogout()
{
    if(FB)
    {
        FB.getLoginStatus(function(response) {
            if(response.session)
            {
                FB.logout(function(response){
                window.location = "/logout.ashx";
                });
                
            }
            else
            {
                window.location = "/logout.ashx";
            }
        });
    }
    else
    {
        window.location = "/logout.ashx";
    }
}
