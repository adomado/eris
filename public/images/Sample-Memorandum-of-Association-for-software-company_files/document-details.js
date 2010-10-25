

var DocumentID = null;
var DocumentUrl = null;
var DocumentOwnerUsername = null;
var DocumentFilename = null;
var DocumentTitle = null;
var DocumentCategoryID = 0;
var DocumentSubCategoryID = 0;
var DocumentSubSubCategoryID = 0;
var PopupRef = null;
var _flagWin = null;
var _alertWin = null;
var _popWin = null;
var _reviewChanged = false;
var _catsChanged = false;

var InsideStartDelay = false;
var OkToDisplay = false;
var StartDelay = 1000;

var pollViewerInt;
var quickview = false;
var _reWin = null;
var isRelatedSet = false;
var isAdsSet = false;
var adsSearchTerm = '';
var _imageAd = '';
var _iFrameAd = '';
var fixedWidth = false;
var related = [];

var _shouldShowFlashAds = true; //viewer ads 

//onload event
window.addEvent('load', function() {

	if ($defined($('flashContainerParent'))) {
		window.onresize = resizeViewer;
		initViewer();
		pollViewerInt = setInterval('pollViewer()', 2);
	}
	$$('.thumb').each(function(el) {
		if (el.title != "") {
			if (el.title.indexOf(',') <= 0) {
				el.innerHTML = "<img src=\"http://img.docstoccdn.com/thumb/100/" + el.title + ".png\"/>";
			}
			else {
				var titleArr = el.title.split(',');
				var html = '';
				html = "<img src=\"http://img.docstoccdn.com/thumb/100/" + titleArr[0] + ".png\"/>";
				if (titleArr[1] == 'True') {
					html += "<span></span>";
				}

				el.innerHTML = html;
			}
		}
	})

});

function initViewer() {
	if (!quickview) {
		if (document.getElementById('viewer-area') != null) document.getElementById('viewer-area').style.width = document.getElementById('doc-info').clientWidth + 'px';
		if (document.getElementById('flashContainerParent')) document.getElementById('flashContainerParent').style.height = 'auto';
	}
}

function pollViewer() {
	if (document.getElementById('flashContainer')!=null && $('flashContainer').ScrollUp && $('flashContainer').EnableBrowserFullscreen) {
		clearInterval(pollViewerInt);

		_ds_onresize = window.onresize;
		resizeViewer();

		setTimeout('resizeViewer()', 100);

	}
}


function InitPopupWin() {
	//instantiate document window
	_popWin = new DocstocWindow();
	//set properties
	_popWin.title = '';
	_popWin.height = '420px';
	_popWin.width = '700px';
	_popWin.draggable = true;
	_popWin.centered = true;
	_popWin.closeOnEsc = true;
	_popWin.type = 1;
	_popWin.instanceName = '_popWin';
	_popWin.clearContentOnHide = false;
	//initialize our window
	_popWin.init('popWin');
}

function InitFlagWin() {
	//instantiate document window
	_flagWin = new DocstocWindow();
	//set properties
	_flagWin.title = '';
	_flagWin.height = '400px';
	_flagWin.width = '600px';
	_flagWin.draggable = false;
	_flagWin.centered = true;
	_flagWin.closeOnEsc = true;
	_flagWin.type = 1;
	_flagWin.instanceName = '_flagWin';
	//initialize our window
	_flagWin.init('flagWin');
}

function InitAlertWin() {
	//instantiate document window
	_alertWin = new DocstocWindow();
	//set properties
	_alertWin.title = '';
	_alertWin.height = '40px';
	_alertWin.width = '300px';
	_alertWin.draggable = false;
	_alertWin.centered = true;
	_alertWin.closeOnEsc = true;
	_alertWin.type = 1;
	_alertWin.formId = 'aspnetForm';
	_alertWin.clearContentOnHide = false;
	_alertWin.instanceName = '_alertWin';
	//initialize our window
	_alertWin.init('alertWin');
}



function FlagDocument(docid, filename) {
	try {
		url = '/Docs/Gotoflage.aspx?doc_id=' + docid + '&filename=' + filename;
		if (_flagWin == null) {
			InitFlagWin();
			_flagWin.onClose = function() {
				$('blackbg').setStyle('display', 'none');
			}
			//create translucent background	
			DisableScreen('blackbg', '#000000', '.7');
		}

		_flagWin.setUrl(url);
		_flagWin.center();
		_flagWin.show();

		InsideStartDelay = false;
		OkToDisplay = true;

		$('blackbg').setStyle('display', 'block');
	}
	catch (e) {
		alert(e.message);
		InsideStartDelay = false;
		OkToDisplay = true;
	}
}

function FlagWinSelfClose() {
	_flagWin.hide();
	$('blackbg').setStyle('display', 'none');
}

function SendMessage(docid, msg) {

	$('btnSendMsg').onclick = null;

	if (msg == "") {
		if (_alertWin == null) InitAlertWin();

		_alertWin.setContent('<div style="font-family:Arial;font-size:12px;">please type in message before hitting submit</div>');
		_alertWin.center();
		_alertWin.show();
		return false;
	}
	//declare object
	var oAjax = new AjaxObject101();

	//set response type
	oAjax.returnXml = false;

	//set method delegates
	//oAjax.funcWait = me.Working;
	oAjax.funcDone = SendMessageComplete;
	oAjax.sndReq('get', '/docs/SendMessage.ashx', 'doc_id=' + docid + '&msg=' + escape(msg));

	return false;
}
function SendMessageComplete(content) {
	$('contactPane').innerHTML = '<div class="message-sent">' + content + '</div>'
}






function AddNewTag(value) {
	obj = $('tags');
	if (obj.innerHTML == '&nbsp;') {
		obj.innerHTML = "";
	} else {
		obj.innerHTML += ", ";
	}
	obj.innerHTML += '<a href="/search/' + value + '/" class="new-tag" title="' + value + '">' + value + '</a>'
}

function ChangeCategories(value) {
	_catsChanged = true;
}

function AddNewReview() {
	_reviewChanged = true;
}

function RateDocument() { ShowPopup('review'); };
function EmailDocument() { ShowPopup('email'); };
function EditCategories() { ShowPopup('tags'); };
function EditTags() { ShowPopup('tags'); };
function EmbedDocument() { ShowPopup('embed'); };
function AddToFolder() { ShowPopup('folder'); };

function ShowPopup(tab) {
	if (_popWin == null) {
		InitPopupWin();
		_popWin.setUrl("/Docs/Document-Popup.aspx?doc_id=" + DocumentID + "&tab=" + tab);
		_popWin.center();
		_popWin.onClose = function() {
			$('blackbg').setStyle('display', 'none');
			if (_reviewChanged || _catsChanged) window.location.reload(true);
		}

		//create translucent background	
		DisableScreen('blackbg', '#000000', '.7');

	}
	$('blackbg').setStyle('display', 'block');
	//tell popup which tab to set active
	if (PopupRef != null) { PopupRef.SetActiveTab(null, tab) }

	_popWin.show();

	return false;
}
function HidePopup() {
	_popWin.hide();
}
function SetPopupRef(obj) {
	//this function get called when the popup is loaded
	PopupRef = obj;
}

function GetEmailBody() {
	var body = "";
	if (CurrentUsername == '') { CurrentUsername = "Docstoc User"; }
	body = CurrentUsername + ' is recommending for you to review the document:\r\n'
	body += DocumentFilename + '\r\n\r\n';

	body += 'Thank you,\r\n';
	body += 'The docstoc team\r\n';
	body += 'docstoc.com';
	return body;
}


function RedirectToLogin() {
	window.location = "http://" + window.location.hostname + '/login/?returnUrl=' + escape(window.location.href);
}

function showDocumentVideo(url, width, height) {
	if (width == undefined) { width = 155; }
	if (height == undefined) { height = 130; }
	ShowSwf(url, width, height, "flash-video");
}

function setPadding() {

	var width = document.documentElement.clientWidth;
	var contentBody = document.getElementById('content-body');

	if (!fixedWidth) {
		var padValue = '50px';
		var navShift = '260px';

		if (width < 1100) {
			padValue = '20px';
			navShift = '230px';
		}


		contentBody.style.paddingLeft = padValue;
		contentBody.style.paddingRight = padValue;
		document.getElementById('logo').style.left = padValue;
		document.getElementById('top-nav').style.paddingLeft = navShift;
		document.getElementById('login-info').style.paddingRight = padValue;
		if (document.getElementById('footer')) {
			var footer = document.getElementById('footer');
			footer.style.marginLeft = padValue;
			footer.style.marginRight = padValue;
		}
	}
}
function SetRelatedDocs() {

	var viewerWidth = $('viewer-area').clientWidth;

	$$('.related-doc-container')[0].setStyle('width', viewerWidth);

	var relatedItems = $$('.related-doc-item');

	var emptyArea = viewerWidth % 210;

	var columns = (viewerWidth - emptyArea) / 210;

	if (columns >= 0)
		columns = Math.floor(columns);
	else  // negative
		columns = Math.ceil(columns);

	var actualWidth = Math.floor((emptyArea / columns) + 210);

	for (var i = 0; i < relatedItems.length; i++) {
		//reducing the padding 
		relatedItems[i].setStyle('width', (actualWidth - 24));
		//Reducing padding and thumbnail widthFaceFBContactSyncFBContactSync
		relatedItems[i].getElement('div').setStyle('width', (actualWidth - 86));
	}
}

function resizeViewer() {
	if (!quickview) {
		var viewerArea = document.getElementById('viewer-area');
		if (viewerArea == null) {setTimeout(resizeViewer, 500);return;}
		var docInfo = document.getElementById('doc-info');
		var height = document.documentElement.clientHeight;

		setPadding();

		viewerArea.style.width = docInfo.clientWidth + 'px';

		if (document.getElementById('flashContainer')) {
			var flashContainer = document.getElementById('flashContainer');
			adHeight = document.getElementById('viewer-area').clientHeight - document.getElementById('flashContainer').clientHeight;

			if (height < 744) height = 744;

			flashContainer.style.height = (height - 200) + 'px';

			flashContainer.style.width = docInfo.clientWidth + 'px';

			docInfo.style.paddingTop = (height - 185) + adHeight + 'px';
		}

		if ($('related-doc')) {
			SetRelatedDocs();
		}
	}
}

function launchSponsoredTab() {
	if ($defined($('flashContainer')) && _adType != null) {
		//alert('launchSponsoredTab:' + _ds_ts_ads);
		//alert($('flashContainer').SetAds);
		//alert($('flashContainer').SetSponsoredAds); 
		if (($('flashContainer').SetAds || $('flashContainer').SetSponsoredAds)) {
			clearInterval(googleFlashAdsInterval);
			googleFlashAdsInterval = 0;
			var c = findPos($('flashContainer'));
			window.scrollTo(c[0], c[1] - 24)
			if (_adType == '2' || _adType == '3' || _adType == '4') {
				//alert('launch:' + _ds_ts_ads.items.length)
				//if (_ds_ts_ads.items.length > 0) {
					setSponsoredAds();
				//}
			} else {
				//alert('launchSponsoredTab else');
				setBottomFlashAd();
			}
		}
	}
}

function launchImageFlashAds() {
	/*
	if (!confirm('launchImageFlashAds flashContainer: ' + $defined($('flashContainer')) + ', adType:' + _adType))
	{
	clearInterval(googleFlashAdsInterval);
	return;
	}
	*/

	if ($defined($('flashContainer')) && _adType != null) {
		if (_adType == '4') {
			if ((_imageAd != null && _imageAd != '') && $('flashContainer').setImageAds) {
				//alert('in');
				clearInterval(imageFlashAdsInterval);

				$('flashContainer').setImageAds(_imageAd);
			}
		}
	}
}

var _adType = '1';
function showDocumentDID(docID, memID, documentType, rev, docError, width, height) {
	showDocumentDID(docID, memID, documentType, rev, docError, width, height, false);
}

function showDocumentDID(docID, memID, documentType, rev, docError, width, height, isStg, isPaid, showrelated, showotherdocs, searchTerm, key, pass, templateID) {
	showDocumentDID(docID, memID, documentType, rev, docError, width, height, isStg, isPaid, showrelated, showotherdocs, searchTerm, key, pass, templateID, '0');
}
function showDocumentDID(docID, memID, documentType, rev, docError, width, height, isStg, isPaid, showrelated, showotherdocs, searchTerm, key, pass, templateID, adType) {
	showDocumentDID(docID, memID, documentType, rev, docError, width, height, isStg, isPaid, showrelated, showotherdocs, searchTerm, key, pass, templateID, adType, "DSViewer.2.2.42.swf", 0);
}
function showDocumentDID(docID, memID, documentType, rev, docError, width, height, isStg, isPaid, showrelated, showotherdocs, searchTerm, key, pass, templateID, adType, viewerLocation, noBuyButton, overideURL,iframesrc) {
	if (width == undefined) { width = 790; }
	if (height == undefined) { height = 550; }
	if (showrelated == undefined) { showrelated = "1"; }
	if (showotherdocs == undefined) { showotherdocs = "1"; }
	if (width == 100) { width = "100%"; };
	if (height == 100) { height = "100%"; };
	if (noBuyButton == undefined) { noBuyButton = "0"; }
	adsSearchTerm = searchTerm;
	if (!quickview) {
		viewportHeight = document.documentElement.clientHeight;

		setPadding();

		if (viewportHeight < 744) viewportHeight = 744;

		width = document.getElementById('doc-info').clientWidth + 'px';

		height = viewportHeight - 200;
	}


	var suffix = '';
	if (isStg) {
		suffix = "&didURL=http://stg.docs.docstoc.com.s3.amazonaws.com/did";
	} else {
		suffix = "&didURL=http://docs.docstoc.com/did";
	}
	if (isPaid) {
		suffix = "&didURL=http://paiddocs.docstoc.com/did";
	}


	if (key != undefined && key != null && key.length > 0) {
		url = "http://viewer.docstoc.com/?key=" + key + "&pass=" + pass;
	} else {
		url = "http://swf.docstoc.com/swf/" + viewerLocation;
	}



	var firstTime = getCookie("first_time");
	var pages_visited = getCookie("pages_visited");
	if (pages_visited == 1 && (searchTerm != undefined && searchTerm.length > 0)) {
		if (adType == '0') {	//only run logic in here if adType doesn't have a setting
			if (templateID == 1 || templateID == 12 || templateID == 14) {
				_adType = '2';
			} else {
				_adType = '3';
			}
		}
		else {
			_adType = adType;
		}

		$('body').addEvent('mouseleave', function() {

			if (!isAdsSet && googleFlashAdsInterval == 0) {
				//alert('mouseleave:' + _adType);
				isAdsSet = true;
				googleFlashAdsInterval = setInterval(launchSponsoredTab, 50);

			}
		});
	}
	else if (templateID == 12 || templateID == 13 || templateID == 14 || templateID == 15) {
		if (adType == '0') {
			_adType = 0;
		}
		else {
			_adType = adType;
		}
	}
	else {
		if (adType != '0') _adType = adType;
	}

	if (_adType == '4') {	//set interval
		//alert('showdocDid _adType: ' + _adType);
		//show the ad
		imageFlashAdsInterval = setInterval(launchImageFlashAds, 50);
	}
	//alert(suffix);
	//alert("_adType:" + _adType);
	var buttonURL = 'https://' + window.location.host;
	if (overideURL != undefined && overideURL != null && overideURL.length > 0) {
		buttonURL = overideURL;
	} else {
		buttonURL += '/cart/AddDocument.ashx?docID=' + docID;
	}
	
	AC_FL_RunContent(
		'width', '100%',
		'height', '500',
		'src', url,
		'pluginspage', 'http://www.macromedia.com/go/getflashplayer',
		'wmode', 'opaque',
		'name', 'flashContainer',
		'id', 'flashContainer',
		'bgcolor', '#ffffff',
		'allowFullScreen', 'true',
		'allowScriptAccess', 'always',
		'movie', url,
		'salign', '',
	//'flashvars', 'iframeurl=' + escape('/docs/viewer-ads.htm') + '&ad_type=' + _adType + '&doc_id=' + docID + '&mem_id=' + memID + '&doc_type=' + documentType + '&embed=0&nobuybutton=' + noBuyButton + '&revision=' + rev + '&showrelated=' + showrelated + '&showotherdocs=' + showotherdocs + '&fullScreenBrowser=1&buttontype=2&buttonlink=' + escape('https://' + window.location.host + '/cart/AddDocument.ashx?docID=' + docID) + suffix
		'flashvars','iframeurl=' + escape(iframesrc) +'&ad_type=' + _adType + '&doc_id=' + docID + '&mem_id=' + memID + '&doc_type=' + documentType + '&embed=0&nobuybutton=' + noBuyButton + '&revision=' + rev + '&showrelated=' + showrelated + '&showotherdocs=' + showotherdocs + '&fullScreenBrowser=1&buttontype=2&buttonlink=' + escape(buttonURL) + suffix
		); //end AC code
	if (document.getElementsByName("flashContainer").length > 0) {
		document.getElementsByName("flashContainer")[0].id = 'flashContainer';
	}
	setTimeout(function() { initViewer(); $("flashContainerParent").addEvent("mousewheel", onMouseWheel) }, 100);
	try {
		if ($defined(_ds_ads) && _adType!=0) {
			setTimeout(BuildPageBreakAds, 1000);
		}
	} catch (e) {
	}
}
var _ds_pb_col_pos = 0;
function BuildPageBreakAds() {
	var containsGA = false;
	for (var i = 0; i < _ds_ads.length; i++) {
		if (_ds_ads[i].type == 2) {
			_ds_pb_col_pos = i;
			containsGA = true;
			buildAdSenseFrame('flashadsPB_iframe', 'pub-4483126213297898', '2418330041', 4, 'parsePBResults',3);
		}
	}
	if (!containsGA) SendPBAdsToFlash();
}
function parsePBResults(ga, fUrl) {
	var list = [];
	var ix = 0;
	for (var i = 0; i < ga.length; i++) {
		var ad = ga[i];
		if (ad) {
			list[ix] = { title: "'" + cleanJsString(ad.line1) + "'", line1: "'" + cleanJsString(ad.line2) + "'", line2: "'" + cleanJsString(ad.line3) + "'", url: "'" + cleanJsString(decodeHTMLUrl(ad.url)) + "'", displayurl: "'" + cleanJsString(ad.visible_url) + "'" };
			ix++;
		}
	}

	_ds_ads[_ds_pb_col_pos].value = { term: adsSearchTerm, sponsored_text: 'Ads by Google', feedback_url: fUrl, items: list, related: related };
	setTimeout(SendPBAdsToFlash, 1000);

}
function SendPBAdsToFlash() {
	if (document.getElementById('flashContainer').SetPageBreakAds) {
		document.getElementById('flashContainer').SetPageBreakAds(_ds_ads);
	} else {
		setTimeout(SendPBAdsToFlash, 1000);
	}
}
function GetAdKeyword() {
	return adsSearchTerm;
}
function onMouseWheel(e) {
	try {
		if (e.wheel < 0) {
			if ($defined($("flashContainer"))) { $("flashContainer").ScrollDown(); }
		} else {
			if ($defined($("flashContainer"))) { $("flashContainer").ScrollUp(); }
		}
	} catch (e) { }
	return false;
}






var googleAdStyle;
var googleAdChannel;
var googlePageSkip = 0;
var requestsDone = 0;
var googleFlashAds = null;
var googleFlashAdsInterval = 0;
var imageFlashAdsInterval = 0;


var mDone = false;
var mDone2 = false;
var funcToExecute = null;
function setBottomFlashAd() {
	if (_ds_display_ads && _shouldShowFlashAds) {
		funcToExecute = setBottomFlashAd;
		if (mDone == false) {
			mDone = true;
			//alert('setBottomFlashAd first call');
			GetFlashHoverAds();
		} else if (_adType != '4' && document.getElementById('flashContainer').SetAds) {
			//alert('setBottomFlashAd send to flash:' + _ds_fa_ads);
			document.getElementById('flashContainer').SetAds(_ds_fa_ads);
		}
	}
}
function setSponsoredAds() {
	//alert('setSponsoredAds');
	if (_ds_display_ads) {
		funcToExecute = setSponsoredAds;
		if (mDone2 == false) {
			mDone2 = true;
			//alert('setSponsoredAds first call');
			//buildF42Frame();
			GetFlashHoverAds();

		} else if (_ds_ts_ads != null) {
			//alert('setSponsoredAds send to flash:' + _ds_ts_ads.items + ':' + _ds_ts_ads.items.length);

			document.getElementById('flashContainer').SetSponsoredAds(_ds_ts_ads);
		}
	}
}
function GetFlashHoverAds() {
	var _ds_num_ads = 4;
	buildAdSenseFrame('flashads_iframe', 'pub-4483126213297898', _ds_fa_channel, _ds_num_ads, 'parseResults',0);
}

function buildAdSenseFrame(name, publisher, channel, numOfAds, func, skip) {
	if (_adType == 1) { numOfAds = 3 }
	window.addEvent('domready', function() {
		if (!$defined($(name))) {
			var f = document.createElement('iframe');
			//alert('buildAdSenseFrame');
			f.setAttribute('id', name);
			f.setAttribute('src', "javascript:false;");
			f.setAttribute('frameborder', '0');
			f.setAttribute('style', '');

			f.style.position = 'absolute';
			f.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=0)';
			f.style.zIndex = '100';
			f.style.width = '1px';
			f.style.height = '1px';
			f.style.top = '0px';
			f.style.left = '0px';
			document.body.appendChild(f);

			var ifrm = document.getElementById(name);
			f = (ifrm.contentWindow) ? ifrm.contentWindow : (ifrm.contentDocument.document) ? ifrm.contentDocument.document : ifrm.contentDocument;
			f.document.open();
			f.document.write("<script type=\"text/javascript\">\r\n")
			f.document.write("google_ad_client = '" + publisher + "';\r\n");
			f.document.write("google_ad_output = 'js';\r\n");
			f.document.write("google_max_num_ads = '" + numOfAds + "';\r\n");
			f.document.write("google_ad_type = 'text_html';\r\n");
			f.document.write("google_ad_channel ='" + channel + "';\r\n");
			f.document.write("google_skip ='" + skip + "';\r\n");
			f.document.write("google_feedback = 'on';\r\n");
			f.document.write("googleAdStyle = 'h';\r\n");
			f.document.write("google_kw_type = 'broad';\r\n");
			f.document.write("google_kw = '" + cleanJsString(_ds_fa_kw) + "';\r\n");
			f.document.write("function google_ad_request_done(ga) {top." + func + "(ga,google_info.feedback_url);}\r\n");
			f.document.write("</script>");
			f.document.write(unescape("%3Cscript src='http://pagead2.googlesyndication.com/pagead/show_ads.js' type='text/javascript'%3E%3C/script%3E"));
			f.document.close()
		}

	});
}
var f42_host = "www.foundry42.com";
var f42_path = "tsavo/docstoc";
var f42_defaultkeywords = 'business plan';


var f42_maxcount = "6";
var f42_startat = "1";
var f42_endat = "6";
var f42_css = "tsavo.css";
var f42_display_lmsg = "yes";
var f42_lmsg = "Loading...";
function buildF42Frame() {

	window.addEvent('domready', function() {
		var f = document.createElement('iframe');

		f.setAttribute('id', '42flashads_iframe');
		f.setAttribute('src', "/docs/viewer-ads.htm?t=" + Math.random());
		//f.setAttribute('src', "javascript:false;");
		f.setAttribute('frameborder', '0');
		f.setAttribute('style', '');

		f.style.position = 'absolute';
		f.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=0)';
		f.style.zIndex = '100';
		f.style.width = '1px';
		f.style.height = '1px';
		f.style.top = '0px';
		f.style.left = '0px';
		document.body.appendChild(f);
	});
}

var _ds_fa_channel = '';
var _ds_fa_kw = '';
var _ds_display_ads = false;
var _ds_fa_ads = null;
var _ds_ts_ads = null;
function setupFlashAds(channel, kw) {
	_ds_display_ads = true;
	_ds_fa_channel = channel;
	_ds_fa_kw = kw;
}
function parseF42Results(data, w) {
	var ga = eval(data).items;
	var list = [];
	var ix = 0;
	var u = w.f42_getUrlAndPath(false);
	//alert(ga);
	for (var i = 0; i < ga.length; i++) {
		var ad = ga[i];
		if (ad) {
			list[ix] = { title: "'" + cleanJsString(ad.ppctitle) + "'", line1: "'" + cleanJsString(ad.ppcdescription) + "'", line2: '', url: "'" + cleanJsString(decodeHTMLUrl(u + ad.clickurl)) + "'", displayurl: "'" + cleanJsString(ad.ppchost) + "'" };
			//alert(list[ix].title);
			ix++;
		}
	}
	_ds_ts_ads = { term: data.ppckeywords, sponsored_text: '[what\'s this?]', feedback_url: 'javascript:affilwtpopup', items: list, related: related };
	setSponsoredAds();

}
function affilwtpopup() {
	wtpopupwin = window.open('http://media.foundry42.com/partner/inc/wt.html', 'wtpopup', 'toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=0,width=400,height=250');
}
function parseResults(ga, fUrl) {
	//alert('parse results' + _adType);
	var list = [];
	var ix = 0;
	for (var i = 0; i < ga.length; i++) {
		var ad = ga[i];
		if (ad) {
			list[ix] = { title: "'" + cleanJsString(ad.line1) + "'", line1: "'" + cleanJsString(ad.line2) + "'", line2: "'" + cleanJsString(ad.line3) + "'", url: "'" + cleanJsString(decodeHTMLUrl(ad.url)) + "'", displayurl: "'" + cleanJsString(ad.visible_url) + "'" };
			ix++;
		}
	}
	_ds_fa_ads = { term: adsSearchTerm, sponsored_text: 'Ads by Google', feedback_url: fUrl, items: list, related: related };
	_ds_ts_ads = _ds_fa_ads;
	//alert(_ds_ts_ads.related.length)

	if (_adType == 3 || _adType == 2) {
		//alert('parseResults');
		setBottomFlashAd();
		setSponsoredAds();
	} else {
		setBottomFlashAd();
	}


}

/*-------------------------------------------------------------------------------------------------Start Google Ad-------------------------------------------------------------------------------------------------------------------------------*/
var len = 0;
function google_ad_request_done(ga) {
	if (ga == null || ga.length == 0) { len = ga.length; return; }
	len = ga.length;
	var i = 0;
	var s = "";
	if (googleAdStyle == null) googleAdStyle = "";
	var orientation = googleAdStyle.substring(0, 1);
	var adbreak = (googleAdStyle.indexOf("line") >= 0) ? "<span style=\"text-decoration:none\">&nbsp; </span>" : "<br>";
	var textbreak = (googleAdStyle.indexOf('_2') >= 0) ? "<br>" : " ";

	if ($defined(ga[0].type) && ga[0].type != undefined && ga[0].type != null) {

		if (ga[0].type == "flash") {

			s += '<tr><td><object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' +
			' codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0" WIDTH="' +
			google_ad.image_width + '" HEIGHT="' +
			google_ad.image_height + '"> <PARAM NAME="movie" VALUE="' +
			google_ad.image_url + '">' +
			'<PARAM NAME="quality" VALUE="high">' +
			'<PARAM NAME="wmode" VALUE="transparent">' +
			'<PARAM NAME="AllowScriptAccess" VALUE="never">' +
			'<EMBED src="' +
			google_ad.image_url + '" WIDTH="' +
			google_ad.image_width + '" HEIGHT="' +
			google_ad.image_height +
			'" TYPE="application/x-shockwave-flash"' +
			' AllowScriptAccess="never" ' +
			' PLUGINSPAGE="http://www.macromedia.com/go/getflashplayer"></EMBED></OBJECT></td>';


		} else if (ga[0].type == "image") {

			s += '<tr><td><a target="_blank" href="' +
			ga[0].url + '" target="_top" title="go to ' +
			ga[0].visible_url + '" onmouseout="window.status=\'\'" onmouseover="window.status=\'go to ' +
			ga[0].visible_url + '\';return true"><img border="0" src="' +
			ga[0].image_url + '"width="' +
			ga[0].image_width + '"height="' +
			ga[0].image_height + '"></a></td>';


		} else if (ga[0].type == "html") {

			s += '<tr><td>' +
			ga[0].snippet + '</td>';

		} else {

			s+= '<tr><td><a target="_blank" class="adsByGoogle2" href="' + google_info.feedback_url + '">Ads by Google</a></td></tr>';

			for (i = 0; i < len; i++) {
				var ad = ga[i];
				if (ad) {
					var onClick = ' onclick="adClick(\'Docstoc Doc ' + googleAdChannel + '\',\'' + DocumentID + '\',\'' + ad.line1 + ' | ' + ad.visible_url + '\'); return ConversionCount();" ';

					var google_title = '<a target="_blank" class="toplink" onmouseover="javascript:window.status=\'' +
						ad.visible_url + '\';return true;" onmouseout="javascript:window.status=\'\';return true;" href="' +
						ad.url + '" ' + onClick + '>' +
						ad.line1 + '</a>';

					var google_text = '<span class="ad_text">' +
						ad.line2 + textbreak + ad.line3 + '</span>';

					var google_url = '<a target="_blank" class="ad_url" onmouseover="javascript:window.status=\'' +
						ad.visible_url + '\';return true;" onmouseout="javascript:window.status=\'\';return true;" href="' +
						ad.url + '" ' + onClick + '>' +
						ad.visible_url + '</a>';

					/* define ad lines above */

					if (orientation == 'v') { s += '<tr>'; } /* if vertical ad */

					s += '<td class="googAd">';

					if (googleAdStyle.indexOf('order') >= 0) {
						s += google_title + adbreak +
							 google_url + adbreak +
							 google_text;

					} else if (googleAdStyle.indexOf('wrap') >= 0) {
						s += google_title + '&nbsp; ' +
							 google_text + '<br>' +
							 google_url;

					} else if (googleAdStyle.indexOf('cells') >= 0) {
						s += '<table class="adcopy"><tr><td class="adtextlinks">' + google_title + '<br>' +
							 google_url + '</td><td class="adtextlines">' +
							 google_text + '</td></tr></table>';

					} else if (googleAdStyle.indexOf('table') >= 0) {
						if ( i % 2 == 0) {

							s += '<tr><td class="adcol1">' + google_title + adbreak +
								google_text + adbreak +
								google_url + '</td>';
							}

						else {

							s += '<td class="adcol2">' + google_title + adbreak +
								google_text + adbreak +
								google_url + '</td></tr>';
						}

					} else {

						s += google_title + adbreak +
							 google_text + adbreak +
							 google_url;
		
					}

					s += '</td>';

					if (orientation == 'v') { s += '</tr>'; } /* if vertical ad */

					if (ad.bidtype == "CPC") { googlePageSkip++; }
				}
			}
		}
	}
	if (s != "") {
		$(google_spot_id).innerHTML = '<table>' + s + '</tr></table>';
		$(google_spot_id).style.display = 'block';
	}
	google_skip = googlePageSkip;

	requestsDone++;
	setTimeout(resizeViewer, 100);
}

/*-------------------------------------------------------------------------------------------------End Google Ad---------------------------------------------------------------------------------------------------------------------------------*/
var loginWin = null;
var isRegistered = false;
var loginPassthruHref = '';
function showLoginWindow(loginPassthru) {
	//alert(loginWin);

	if (loginWin == null) {

		loginPassthruHref = loginPassthru;

		window.scrollTo(0, 0);
		loginWin = new DocstocWindow();

		loginWin.title = '';
		loginWin.draggable = false;
		loginWin.height = '420px';
		loginWin.width = '970px';
		loginWin.instanceName = 'loginWin';
		loginWin.init("loginWin");
		loginWin.closeOnEsc = true;
		loginWin.setUrl("/login/mini.aspx?action=1");
		loginWin.clearContentOnHide = false;
		loginWin.onClose = function() {
			if ($('blackbg')) $('blackbg').setStyle('display', 'none');
		}
	}

	loginWin.show();
	$('loginWin').style.top = "56px";
	DisableScreen('blackbg', '#000000', '.7');
	$('blackbg').setStyle('display', 'block');
}

function loginComplete(email, memID) {
	isRegistered = true;
	currentUserID = 1;
	//loginWin.hide();
	top.location.href = loginPassthruHref + '&email=' + email + '&memID=' + memID;
	loginWin.setContent('<div style="background-color:#fff;height:230px;padding-top:180px;text-align:center"><img src="/i/docs/ajax-loader.gif" /></div>');
}
function ShowReconversion(docId) {
	if (_reWin == null) {
		_reWin = new DocstocWindow();
		//set properties
		_reWin.title = '';
		_reWin.height = '200px';
		_reWin.width = '400px';
		_reWin.draggable = true;
		_reWin.centered = true;
		_reWin.instanceName = '_reWin';
		//initialize our window
		_reWin.init('reWin');
		_reWin.onClose = function() {
			if ($('flashContainerParent') != undefined) {
				$('blackbg').setStyle('display', 'none');
			}
		}

		//create translucent background	
		DisableScreen('blackbg', '#000000', '.7');

	}
	if ($('flashContainerParent') != undefined) {
		$('blackbg').setStyle('display', 'block');
	}

	_reWin.setUrl("/docs/DocumentReconvert.ashx?doc_id=" + docId);
	_reWin.show();
}





var _ds_ogLeft = 0;
var _ds_ogTop = 0;
var _ds_height = 0;
var _ds_onresize = null;


function _ds_sizeUp(obj) {
	var el = _ds_getMovie(obj);
	if (el != null) {

		window.onresize = function() {
			//_ds_sizeUp(window.dsViewerID);
			var el = _ds_getMovie(window.dsViewerID);
			_ds_ogLeft = _ds_scLeft();
			_ds_ogTop = _ds_scTop();
			_ds_height = _ds_Height();

			_ds_style(el.style, "absolute", 9999999, 0, 0, _ds_Width() + "px", _ds_height + "px", 0, 0);

		};

		_ds_ogLeft = _ds_scLeft();
		_ds_ogTop = _ds_scTop();
		_ds_height = _ds_Height();

		_ds_fit(el, true);

		if (!_ds_isFirefox()) {
			document.documentElement.style.overflow = "hidden";
			document.body.style.overflow = "hidden";
			document.body.style.height = '100%';
		}
		document.documentElement.style.height = '100%';

		_ds_none('none', el);
		_ds_style(el.style, "absolute", 9999999, 0, 0, _ds_Width() + "px", _ds_height + "px", 0, 0);


		document.body.scrollTop = 0;

	}
}

function _ds_sizeDown(obj) {
	var el = _ds_getMovie(obj);
	if (el != null) {
		_ds_none('', el);
		if (!_ds_isFirefox()) {
			document.documentElement.style.overflow = "";
			document.body.style.overflow = "";
			document.body.style.height = '';
		}
		document.documentElement.style.height = '';
		_ds_fit(el, false);
		_ds_style(el.style, "", "", "", "", "", "", _ds_ogLeft, _ds_ogTop);
		window.onresize = _ds_onresize;
		setTimeout(window.onresize, 100);

		try {
			if (fixedWidth) {
				fixMargin('content-padding');
			}
		}
		catch (e)
		{ }
	}
}
function _ds_getMovie(obj) { var el; if (document.getElementById && document.getElementById(obj) != null) { el = document.getElementById(obj); }; if (el == null && document.getElementsByName && document.getElementsByName(obj) != null) { el = document.getElementsByName(obj); }; return el; }
function _ds_isFirefox() { if (window.navigator.userAgent.toLowerCase().indexOf("firefox") > -1) { return true; } return false; }
function _ds_style(o, p, z, t, l, w, h, pl, pt) { o.zIndex = z; o.top = t; o.left = l; o.width = w; o.height = h; window.scrollTo(pl, pt); }
function _ds_Width() { return _ds_eval(window.innerWidth ? window.innerWidth : 0, document.documentElement ? document.documentElement.clientWidth : 0, document.body ? document.body.clientWidth : 0); }
function _ds_Height() { return document.documentElement.clientHeight; }
function _ds_scLeft() { return _ds_eval(window.pageXOffset ? window.pageXOffset : 0, document.documentElement ? document.documentElement.scrollLeft : 0, document.body ? document.body.scrollLeft : 0); }
function _ds_scTop() { return _ds_eval(window.pageYOffset ? window.pageYOffset : 0, document.documentElement ? document.documentElement.scrollTop : 0, document.body ? document.body.scrollTop : 0); }
function _ds_eval(w, e, b) { var r = w ? w : 0; if (e && (!r || (r > e))) { r = e; }; return b && (!r || (r > b)) ? b : r; }
function _dn_isChild(parent, child) { while (parent.parentNode != null) { if (parent == child) { return true; } parent = parent.parentNode; } return false; }

function _ds_none(v, obj) {
	try {
		var items = document.body.getElementsByTagName("*");
		for (var i = 0; items.length; i++) {
			var displayMode = v;
			s = items[i].style;

			if (v == 'none') {
				items[i]._ds_none = s.display;
			} else {
				displayMode = items[i]._ds_none;
			}

			if (items[i].nodeName != 'PARAM' && (obj == null || _dn_isChild(obj, items[i]) == false)) {
				s.display = displayMode;
			}

		}

	} catch (e) { }
}
function _ds_fit(obj, n) {
	while (obj.parentNode != null && obj.nodeName != 'BODY') {
		s = obj.style;
		st = "";
		sl = "";
		sh = "";
		sp = "";
		sm = "";
		if (n) {
			st = "0px";
			sl = "0px";
			sh = _ds_height + "px";
			sb = "0px";
			sp = "0px";
			sm = "0px";
			obj._ds_st = _ds_getStyle(obj, "top");
			obj._ds_sl = _ds_getStyle(obj, "left");
			obj._ds_sh = s.height; //_ds_getStyle(obj,"height");
			obj._ds_sp = _ds_getStyle(obj, "padding");
			obj._ds_sm = _ds_getStyle(obj, "margin");
		} else {
			st = obj._ds_st;
			sl = obj._ds_sl;
			sh = obj._ds_sh;
			sp = obj._ds_sp;
			sm = obj._ds_sm;
		}
		s.top = st;
		s.left = sl;
		s.height = sh;
		s.padding = sp;
		s.margin = sm;

		obj = obj.parentNode;
	}
}

function _ds_efs(obj) {
	var el = _ds_getMovie(obj);
	if (el != null && el.EnableBrowserFullscreen) {
		el.EnableBrowserFullscreen();
		_ds_onresize = window.onresize;
	} else {
		setTimeout(function() { _ds_efs(obj); }, 1000);
	}



}

function _ds_getStyle(el, p) {
	var y = null;
	if (el.currentStyle) {//ie
		y = el.currentStyle[p];
	} else if (window.getComputedStyle) { //f
		if (p == "padding" || p == "margin") {
			//top right bot left
			y = document.defaultView.getComputedStyle(el, null).getPropertyValue(p + "-top");
			y += ' ' + document.defaultView.getComputedStyle(el, null).getPropertyValue(p + "-right");
			y += ' ' + document.defaultView.getComputedStyle(el, null).getPropertyValue(p + "-bottom");
			y += ' ' + document.defaultView.getComputedStyle(el, null).getPropertyValue(p + "-left");
		} else {
			y = document.defaultView.getComputedStyle(el, null).getPropertyValue(p);
		}

	}
	return y;
}



function ChangeFeaturedTab(tab) {
	var tabs = $$('#featured_tabs li').set('tween', { duration: 'long' });
	var currentTab = FindCurrentTab(tabs);
	if (tab != currentTab) {
		var f = new Fx.Tween($('featured_tab_' + currentTab));
		f.duration = 'long';
		f.start('opacity', 1, 0);

		var f = new Fx.Tween($('featured_tab_' + tab));
		f.duration = 'long';
		f.start('opacity', 0, 1);





		$('featured_tab_' + currentTab).removeClass('sel');

		$('featured_tab_' + tab).addClass('sel');

		$$('#featured_dots li a').removeClass('sel');
		$$('#featured_dot_' + tab).addClass('sel');
	}
}

function PreviousFeaturedTab() {
	var tabs = $$('#featured_tabs li');
	var currentTab = FindCurrentTab(tabs);

	var newTab = currentTab - 1;

	if (newTab < 0) {
		newTab = tabs.length - 1;

	}
	ChangeFeaturedTab(newTab);

}

function NextFeaturedTab() {
	var tabs = $$('#featured_tabs li');
	var currentTab = FindCurrentTab(tabs);

	var newTab = currentTab + 1;

	if (newTab > tabs.length - 1) {
		newTab = 0;

	}
	ChangeFeaturedTab(newTab);
}

function FindCurrentTab(tabs) {

	var currentTab = 0;
	for (var i = 0; i < tabs.length; i++) {
		if (tabs[i].hasClass('sel')) {
			currentTab = i;
			i = tabs.length;
		}
	}
	return currentTab;
}

function fixMargin(el) {
	$(el).setStyle("margin", "0 auto");
}

function TrackAd() {	//use ajax to call ad track hanlder

}

function SetH1Clickable(url)
{
    var h1element=$$('h1'); 
    if(h1element)
    {
        h1element.addEvent('click', function(){location.href=url;});
        h1element.addClass('h1-clickable');
    }
}


