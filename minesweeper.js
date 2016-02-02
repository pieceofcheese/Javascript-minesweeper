function init (width, height, mines) {
	
	var cntr = getById("game");
	var tbl = domObj(cntr, 'TABLE', {name: 'mineField'})
	tbl.count = 0;
	for(var y = 0; y<height; y++) {
		
		var row = tbl.insertRow(y);
		
		for(var x = 0; x<width; x++) {
			
			var cell = row.insertCell(x);
			cell.hasMine = false;
			cell.danger = 0;
			cell.className = 'cell';
			cell.position = 10*(log10(width))*y + x;
			tbl.count++;
		}
	}	
	
}

function menuMove() {
	//please q.q
	menu = getById("form");
	
	menu.css({position: 'fixed', left:'0', top:'0'});
	
}

function log10(num) {
	
	if(num/10<=1) {
		return 1;
	}
	return 1+log10(num);
}

function stopBubble(event) {
	if(!ISIE) {
		event.stopPropagation();
		event.preventDefault();
	}
	else {
		event.cancelBubble=true;
		event.returnValue=false;
	}
	return false;
}

function atchEvtListener(dom, event, functn) {
	//if(window.addEventListener)
	{
		dom.addEventListener(event, functn, true);
	}
	//else{
	// dome.attachEvent('on' + event, functn);
	//}
	
};

function getById(id)
{	return document.getElementById(id);
};

function domObj(cntr, type, obj)						//W3C
{	var dom = document.createElement(type);
	obj.name = obj.name || obj.id;
	dom.id = obj.id;
	dom.name = obj.name;
	dom.style.cssText = obj.style ? obj.style : '';
	dom.style.className = obj.class ? obj.class : '';
	cntr.appendChild(dom);
	return dom;
};
if(ISIE && Number(BROWSER_VERSION[0]) < 10)				//Stupid IE, we have to rewrite the function
{	function ieDomObj(cntr, type, obj)
	{	obj.name = obj.name || obj.id;
		var command = '<' + type +
		' name=\"' + obj.name + '\" ' +
		' id=\"' + obj.id + '\" />'
		var dom = document.createElement(command);
		dom.style.cssText = obj.style ? obj.style : '';
		dom.style.className = obj.class ? obj.class : '';
		cntr.appendChild(dom);
		return dom;
	};
	domObj = ieDomObj;
};

var ISIE = navigator.userAgent.indexOf('MSIE') >= 0;
var BROWSER_VERSION;
if(ISIE)
{	BROWSER_VERSION = navigator.userAgent.substr(
	navigator.userAgent.indexOf('MSIE ') + 5).split(';' , 1)[0].split('.');
}
else
{	ISIE = (/Trident\/7\./).test(navigator.userAgent);	//Test for stupid IE 11
	if(ISIE)
		BROWSER_VERSION = [11, 0];
}