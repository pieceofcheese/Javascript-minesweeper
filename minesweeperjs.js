var globalHeight = 0;
var globalWidth = 0;
var fail = false;
var numbersReal = 0;
var numbersFound = 0;


function reinit(width,height,mines) {
	fail = false;
	numbersReal = 0;
	numbersFound = 0;
	var height = Number(getById("height").value);
	var width = Number(getById("width").value);
	var countMine = Number(getById("mineCount").value);
	
	
	if(countMine>= width*height) {
		return alert("TooManyMines");
	}
	
	init(width, height, countMine);
	
	var background = getById("body");
	background.className = "background";
	
}

function init(width, height, mines) {
	globalHeight = height;
	globalWidth = width;
	var cntr = getById('game');
	cntr.innerHTML = '';
	var tbl	 = domObj(cntr,'TABLE',{name: 'mineField'});
	tbl.align = "center";
	for (var y = 0; y<height; y++) {
		var row = tbl.insertRow(y);
		for(var x = 0; x<width; x++) {
			var cell = row.insertCell(x);
			cell.className='cell';
			cell.hasMine = false;
			cell.countMine= 0;
			cell.position = Math.pow(10,log10(width))*y + x;
			numbersReal++;
		};
	};
	
	
	
	for(var i = 0; i<mines; i++) {
		var go = true;
		do{
		var row = tbl.getElementsByTagName("tr");
		var y = Math.floor(Math.random()*height);
		var cell = row[y].getElementsByTagName("td");
		var x = Math.floor(Math.random() *width);
		//cell[x].className = "mine";
		
		if(cell[x].hasMine) {
			
		} else {
		numbersReal--;
		go = false;
		cell[x].countMine=0;
		cell[x].hasMine = true;
		
		for(var row = y-1; row<=y+1; row++) {
			
			if(row<0||row>=height) {
				continue;
			
				
			}
			
			for(var column = x-1; column<=x+1; column++) {
					
				if(column<0||column>=width) {
						
					continue;	
						
				}
				
				if (!tbl.rows[row].cells[column].hasMine) {
					
					tbl.rows[row].cells[column].countMine++;
					
					//tbl.rows[row].cells[column].className = 'close' + tbl.rows[row].cells[column].countMine;
					
				}
				
					
			}
			
			
		}
		}
		}while(go);
	}
	
	
	
	atchEvtListener(tbl, 'mousedown', click);
};

function log10(num) {
	
	if(num/10<=1) {
		return 1;
	}
	return 1+log10(num/10);
}


function mineFieldMouseDown(evt) {
	var trgt = evt.target;
	if(trgt.tagName!='TD')
		return;
	else
		trgt.className = 'mine';
	return stopBubble(evt);
};

function click (evt) {
	
	
	
	if(fail) {
		return;
	}
	
	console.log("click");
	var trgt = evt.target;
	if(trgt.tagName!='TD') {
		return;
	} else {
		if(trgt.hasMine) {
			trgt.className = "mine";
			window.alert('You have lost');
			fail = true;
			
		} else {
			
			if(trgt.className == 'empty') {
				
			} else {
					sweep(trgt);
			}
			
		}
		
		
	}
	
	if(numbersFound>=numbersReal) {
		
		window.alert("You win!");
	}
	console.log(numbersFound)
	return stopBubble(evt);
}

function sweep(trgt) {
	
	var row = trgt;
	var numberCell = false;
	console.log(trgt.countMine)
	if(trgt.countMine==0) {
		console.log("empty");
		
	} else {
		if(trgt.className=='cell') {numbersFound++;}
		
		trgt.className = "close" + trgt.countMine;
		numberCell = true;
		
	}
	while(row.tagName!="TR") {
		row = row.parentNode;
	}
	var tbl = row;
	while(tbl.tagName!="TABLE") {
		
		tbl = tbl.parentNode;
	}
	
	var cellx = trgt.position%(Math.pow(10,log10(globalWidth)));
	var celly = Math.floor(trgt.position/(Math.pow(10,log10(globalWidth))));
	console.log("y:" + celly);
	console.log("x:" + cellx);
	debugger;
	
	sweepr(cellx,celly, tbl);
	
	return;
}

function sweepr(x, y, tbl) {
	
	var cell = tbl.rows[y].cells[x];
	if (cell.hasMine) {
		console.log("mine");
		return;
	}
	if(cell.countMine!=0) {
		
		if(cell.className=="cell") {
			numbersFound++;
		}
		
		console.log("number");
		cell.className = 'close' + cell.countMine;
		return;
	}
	
	if(cell.className=="empty") {
		
		return;
	}
	
	cell.className="empty";
	numbersFound++;
	for(var row = y-1; row<=y+1; row++) {
		
		if(row<0||row>=globalHeight) {
			
			continue;
			
				
		}
				
		for(var column = x-1; column<=x+1; column++) {
			
			if(column<0||column>=globalWidth) {
				
				continue;	
						
			}
			
			
			console.log(column + "," + row);
			sweepr(column,row, tbl);
					
		}
			
			
	}
	return;
	
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