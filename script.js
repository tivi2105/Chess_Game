let chessBoard = 
[
['BR1', 'BK1', 'BBL', 'BQ', 'BK', 'BBD', 'BK2', 'BR2'], 
['BP1', 'BP2', 'BP3', 'BP4', 'BP5', 'BP6', 'BP7', 'BP8'], 
['', '', '', '', '', '', '', ''], 
['', '', '', '', '', '', '', ''], 
['', '', '', '', '', '', '', ''], 
['', '', '', '', '', '', '', ''], 
['WP1', 'WP2', 'WP3', 'WP4', 'WP5', 'WP6', 'WP7', 'WP8'], 
['WR1', 'WK1', 'WBD', 'WQ', 'WK', 'WBL', 'WK2', 'WR2']];

let movesList = document.getElementById('movesList');

let  = document.getElementById('board');
let moveMentCount = 0;
let turn = 'w', validChance = true;
loadBody(board);
loadPieces();

function loadBody(board) {
	for(var i = 0;i < 8; i++) {
		for(var j = 0;j < 8; j++) {
			let box = document.createElement("div");
			box.id = String.fromCharCode(97+j)+""+(8-i);
			box.classList.add("cell");
			box.ondrop = function (){drop(event)};
			box.ondragstart = function () {drag(event)};
			box.ondragover = function (){allowDrop(event)};
			box.onclick = function (){clearSuggetions(event)};
			//actionsForEvents(box);
			board.appendChild(box);
		}
	}
	let move = document.createElement("label");
	move.innerHTML = "White to Move";
	move.id = "turnIndicator";
	movesList.appendChild(move);
	movesList.appendChild(document.createElement("br"));
}

function movePiece(box) {
	alert('box.id--'+box.id);
}

function loadPieces() {
	let pieces = ["Rook.png", "Knight.png", "Bishop.png", "Queen.png", "King.png"];
	for(var i = 0;i < 8; i++) {
		let idValue = String.fromCharCode(97+i)+"8";
		let box = document.getElementById(idValue);
		var x = document.createElement("IMG");
		x.draggable="true";
		if(i < 5) {
			x.setAttribute("src", "Pieces\\black"+pieces[i]);
		}
		else {
			x.setAttribute("src", "Pieces\\black"+pieces[7-i]);
		}
		x.id = String.fromCharCode(97+i)+"8"+"img";
		x.onclick = function () {showValidMoves(event)};
		box.appendChild(x);
	}

	for(var i = 0;i < 8; i++) {
		let idValue = String.fromCharCode(97+i)+"1";
		let box = document.getElementById(idValue);
		var x = document.createElement("IMG");
		if(i < 5) {
			x.setAttribute("src", "Pieces\\white"+pieces[i]);
		}
		else {
			x.setAttribute("src", "Pieces\\white"+pieces[7-i]);
		}
		x.id = String.fromCharCode(97+i)+"1"+"img";
		x.onclick = function () {showValidMoves(event)};
		box.appendChild(x);
	}

	for(var i = 0;i < 8; i++) {
		let idValue = String.fromCharCode(97+i)+"7";
		let pawnBox = document.getElementById(idValue);
		x = document.createElement("IMG");
		x.draggable="true";
		x.setAttribute("src", "Pieces\\blackPawn.png");
		x.id = String.fromCharCode(97+i)+"7"+"img";
		x.onclick = function () {showValidMoves(event)};
		pawnBox.appendChild(x);
	}

	for(var i = 0;i < 8; i++) {
		let idValue = String.fromCharCode(97+i)+"2";
		let pawnBox = document.getElementById(idValue);
		x = document.createElement("IMG");
		x.draggable="true";
		x.setAttribute("src", "Pieces\\whitePawn.png");
		x.id = String.fromCharCode(97+i)+"2"+"img";
		x.onclick = function () {showValidMoves(event)};
		pawnBox.appendChild(x);
	}
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
	ev.dataTransfer.setData("text", ev.target.id);
	let existingSuggestions = document. getElementsByTagName("footer");
	for(let i = existingSuggestions.length-1;i >= 0; i--) {
		existingSuggestions[i].remove();
	}
}

function drop(ev) {
	var data = ev.dataTransfer.getData("text");
	if(null == document.getElementById(data).getAttribute('src')) {
		//console.log('Exception test');
		return;
	}
	if(turn == "w"){
		if((document.getElementById(data).getAttribute('src').includes("black"))) {
			validChance = false;
		}
		else {
			validChance = true;
		}
	}
	if(turn == "b") {
		if((document.getElementById(data).getAttribute('src').includes("white"))) {
			validChance = false;
		}
		else {
			validChance = true;
		}
	}
	if(validChance && isValidMove(document.getElementById(data), ev.target, turn) && checkMovement(document.getElementById(data), ev.target)) {
		let t;
		if(ev.target.id.includes('img')) {
			t = document.getElementById(ev.target.id.substring(0, 2));
		}
		else {
			t = document.getElementById(ev.target.id);
		}
		if(turn == 'b') {
			turn = 'w';
		}
		else {
			turn = 'b';
		}
		let x = document.getElementById(data);
		x.id = ev.target.id+'img';
		x.style = "cursor: grab;";
		t.replaceChildren(x);
		updateBoard(data, ev.target.id);
		addMoves(data, ev.target.id);
	}
	if(turn == 'b') {
		document.getElementById('turnIndicator').innerHTML = 'Black to Move';
		document.getElementById('turnIndicator').style = 'color: white;';
		document.body.style.backgroundColor = "black";
	}
	else if(turn == 'w') {
		document.getElementById('turnIndicator').innerHTML = 'White to Move';
		document.getElementById('turnIndicator').style = 'color: black;';
		document.body.style.backgroundColor = "white";
	}
	//ev.target.appendChild(document.getElementById(data));
  	//alert(data);
}

function actionsForEvents(element) {
	element.addEventListener("mousedown", mousedown);
	function mousedown(e) {
		window.addEventListener("mousemove", mousemove);
		window.addEventListener("mouseup", mouseup);
		let prevX = e.clientX;
		let prevY = e.clientY;
		function mousemove(e) {
			let newX = prevX - e.clientX;
			let newY = prevY - e.clientY;
			let rect = element.getBoundingClientRect();
			element.style.left = rect.left - newX + "px";
			element.style.top = rect.top - newY + "px";
			prevX = e.clientX;
			prevY = e.clientY;
		}
		function mouseup() {
			window.removeEventListener("mousemove", mousemove);
			window.removeEventListener("mouseup", mouseup);
		}
	}
}

function isValidMove(source, dest, turn) {
	if(null == dest.getAttribute('src')) {
		return true;
	}
	if((source.getAttribute('src').includes("black") && dest.getAttribute('src').includes("black") && turn == "b") || 
		(source.getAttribute('src').includes("white") && dest.getAttribute('src').includes("white") && turn == "w")) {
		return false;
	}
	return true;
}

function updateBoard(source, dest) {
	if(source.length > 2) {
		source = source.substring(0, 2);
	}
	if(dest.length > 2) {
		dest = dest.substring(0, 2);
	}
	let si = 8-parseInt(source[1]), sj = source.charCodeAt(0)-97;
	let di = 8-parseInt(dest[1]), dj = dest.charCodeAt(0)-97;
	chessBoard[di][dj] = chessBoard[si][sj];
	chessBoard[si][sj] = '';
	//printBoard(chessBoard);
}

function printBoard(chessBoard) {
	for(let i = 0;i < 8; i++) {
		let str = "";
		for(let j = 0;j < 8; j++) {
			if(chessBoard[i][j] == '') {
				str += i+"-"+j+",";
			}
			else
				str += chessBoard[i][j]+",";
		}
		console.log(str);
	}
}

function checkMovement(source, dest) {
	//console.log("in checkPawnMovement "+dest.id);
	let r = true;
	let si = 8-parseInt(source.id[1]), sj = source.id.charCodeAt(0)-97;
	let di = 8-parseInt(dest.id[1]), dj = dest.id.charCodeAt(0)-97;
	/*console.log(si+"--"+sj);
	console.log(di+"--"+dj);*/
	if(source.getAttribute('src').includes("Pawn")) {
		if(source.getAttribute('src').includes("white")) {
			/*console.log(si+"--"+sj);
			console.log(di+"--"+dj);*/
			if(si == 6) {
				if(sj != dj || (si - di != 1 && si - di != 2)) {
					r = false;
				}
			}
			else {
				if(sj != dj || si - di != 1) {
					r = false;
				}
			}
		}
		else if(source.getAttribute('src').includes("black")) {
			/*console.log(si+"--"+sj);
			console.log(di+"--"+dj);*/
			if(si == 1) {
				if(sj != dj || (di - si != 1 && di - si != 2)) {
					r = false;
				}
			}
			else {
				if(sj != dj || di - si != 1) {
					r = false;
				}
			}
		}
		if(Math.abs(si - di) == 1 && (sj - dj == 1 || dj - sj == 1) && dest.id.includes("img")) {
			r = true;
		}
		if((Math.abs(si - di) == 1 || Math.abs(si - di) == 2) && sj == dj && dest.id.includes("img")) {
			r = false;
		}
	}
	else if(source.getAttribute('src').includes("Rook")) {
		/*console.log('Test');
		console.log(si+"--"+sj);
		console.log(di+"--"+dj);*/
		if(si == di) {
			if(sj > dj) {
				sj--;
				while(sj > dj) {
					if(chessBoard[si][sj] != '') {
						r = false;
						break;
					}
					sj--;
				}
			}
			else if(sj < dj) {
				sj++;
				while(sj < dj) {
					if(chessBoard[si][sj] != '') {
						r = false;
						break;
					}
					sj++;
				}
			}
		}
		else if(sj == dj) {
			if(si > di) {
				si--;
				while(si > di) {
					if(chessBoard[si][sj] != '') {
						r = false;
						break;
					}
					si--;
				}
			}
			else if(si < di) {
				si++;
				while(si < di) {
					if(chessBoard[si][sj] != '') {
						r = false;
						break;
					}
					si++;
				}
			}
		}
		else {
			r = false;
		}
	}
	else if(source.getAttribute('src').includes("Knight")) {
		/*console.log(si+"---"+sj);
		console.log(di+"---"+dj);*/
		if(Math.abs(si-di) == 2 && Math.abs(sj-dj) == 1) {
			r = true;
		}
		else if(Math.abs(si-di) == 1 && Math.abs(sj-dj) == 2) {
			r = true;
		}
		else {
			r = false;
		}
	}
	else if(source.getAttribute('src').includes("Bishop")) {
		//console.log(si+"--"+di+"--"+sj+"--"+dj);
		if(Math.abs(si-di) != Math.abs(sj-dj)) {
			return false;
		}
		else if(si > di) {
			if(sj > dj) {
				sj--;
				si--;
				while(si > di && sj > dj) {
					if(chessBoard[si][sj] != '') {
						r = false;
						break;
					}
					sj--;
					si--;
				}
			}
			else {
				sj++;
				si--;
				while(si > di && sj < dj) {
					if(chessBoard[si][sj] != '') {
						r = false;
						break;
					}
					sj++;
					si--;
				}
			}
		}
		else {
			if(sj > dj) {
				sj--;
				si++;
				while(si < di && sj > dj) {
					if(chessBoard[si][sj] != '') {
						r = false;
						break;
					}
					sj--;
					si++;
				}
			}
			else {
				sj++;
				si++;
				while(si < di && sj < dj) {
					if(chessBoard[si][sj] != '') {
						r = false;
						break;
					}
					sj++;
					si++;
				}
			}
		}
	}
	else if(source.getAttribute('src').includes("Queen")) {
		let siTemp = si, diTemp = di, sjTemp = sj, djTemp = dj;
		if(si == di) {
			if(sj > dj) {
				sj--;
				while(sj > dj) {
					if(chessBoard[si][sj] != '') {
						r = false;
						break;
					}
					sj--;
				}
			}
			else if(sj < dj) {
				sj++;
				while(sj < dj) {
					if(chessBoard[si][sj] != '') {
						r = false;
						break;
					}
					sj++;
				}
			}
		}
		else if(sj == dj) {
			if(si > di) {
				si--;
				while(si > di) {
					if(chessBoard[si][sj] != '') {
						r = false;
						break;
					}
					si--;
				}
			}
			else if(si < di) {
				si++;
				while(si < di) {
					if(chessBoard[si][sj] != '') {
						r = false;
						break;
					}
					si++;
				}
			}
		}
		else if(Math.abs(si-di) != Math.abs(sj-dj)) {
			return false;
		}
		else if(si > di) {
			if(sj > dj) {
				sj--;
				si--;
				while(si > di && sj > dj) {
					if(chessBoard[si][sj] != '') {
						r = false;
						break;
					}
					sj--;
					si--;
				}
			}
			else if(sj < dj) {
				sj++;
				si--;
				while(si > di && sj < dj) {
					if(chessBoard[si][sj] != '') {
						r = false;
						break;
					}
					sj++;
					si--;
				}
			}
		}
		else if(si < di) {
			if(sj > dj) {
				sj--;
				si++;
				while(si < di && sj > dj) {
					if(chessBoard[si][sj] != '') {
						r = false;
						break;
					}
					sj--;
					si++;
				}
			}
			else if(sj < dj) {
				sj++;
				si++;
				while(si < di && sj < dj) {
					if(chessBoard[si][sj] != '') {
						r = false;
						break;
					}
					sj++;
					si++;
				}
			}

		}	
		else {
			r = false;
		}
	}
	else {
		/*console.log(si+"---"+sj);
		console.log(di+"---"+dj);
		console.log(di == dj && Math.abs(si - sj) == 1);*/
		if(si == di && Math.abs(sj - dj) == 1) {
			r = true;
		}
		else if(sj == dj && Math.abs(si - di) == 1) {
			r = true;
		}
		else if(Math.abs(si-di) == 1 && Math.abs(sj-dj) == 1) {
			r = true;
		}
		else {
			r = false;
		}
	}
	return r;
}

function clearSuggetions() {
	if(!event.srcElement.id.includes("img")) {
		let existingSuggestions = document. getElementsByTagName("footer");
		for(let i = existingSuggestions.length-1;i >= 0; i--) {
			existingSuggestions[i].remove();
		}
	}
}

function showValidMoves(event) {
	let existingSuggestions = document. getElementsByTagName("footer");
	for(let i = existingSuggestions.length-1;i >= 0; i--) {
		existingSuggestions[i].remove();
	}
	/*for(let i = 0;i < existingSuggestions.length; i++) {
		existingSuggestions[i].remove();
	}*/
	//console.log(event.srcElement);
	let source = event.srcElement.id.substring(0, 2);
	let si = 8-parseInt(source[1]), sj = source.charCodeAt(0)-97;
	let sourceElement = event.srcElement.getAttribute('src');
	//console.log(si+"--"+sj);
	if(sourceElement.includes("Pawn")) {
		if(sourceElement.includes("white") && turn == 'w') {
			if(chessBoard[si-1][sj] == '') {
				var pos = document.getElementById(source[0]+(8-si+1));
				let validPos = document.createElement("footer");
				validPos.id = source+"-ValidPos";
				validPos.style = "background: red;top: 25%; left:25%;width:50%;height:50%;position: relative;border-radius: 50%;";
				pos.appendChild(validPos);
			}
			if(chessBoard[si-2][sj] == '' && si == 6) {
				var pos = document.getElementById(source[0]+(8-si+2));
				let validPos = document.createElement("footer");
				validPos.style = "background: red;top: 25%; left:25%;width:50%;height:50%;position: relative;border-radius: 50%;";
				validPos.id = source+"-ValidPos1";
				pos.appendChild(validPos);
			}
		}
		else if(sourceElement.includes("black") && turn == 'b') {
			if(chessBoard[si+1][sj] == '') {
				var pos = document.getElementById(source[0]+(8-si-1));
				let validPos = document.createElement("footer");
				validPos.id = source+"-ValidPos";
				validPos.style = "background: red;top: 25%; left:25%;width:50%;height:50%;position: relative;border-radius: 50%;";
				pos.appendChild(validPos);
			}
			if(chessBoard[si+2][sj] == '' && si == 1) {
				var pos = document.getElementById(source[0]+(8-si-2));
				let validPos = document.createElement("footer");
				validPos.style = "background: red;top: 25%; left:25%;width:50%;height:50%;position: relative;border-radius: 50%;";
				validPos.id = source+"-ValidPos1";
				pos.appendChild(validPos);
			}
		}
	}
}

function addMoves(source, dest) {
	let moveTurn = '', seperator = '--';
	if(turn == 'w') {
		moveTurn = 'b';
	}
	else {
		moveTurn = 'w';
	}
	let move = document.createElement("label");
	if(dest.length > 3) {
		dest = dest.substring(0, 2);
		seperator = 'X'
	}
	move.innerHTML = moveTurn+source.substring(0, 2) +seperator+ dest;
	//console.log(source.substring(0, 2) +seperator+ dest);
	movesList.appendChild(move);
	movesList.appendChild(document.createElement("br"));
}