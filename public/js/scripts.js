var currentUserID;

var myDataRef = new Firebase('https://glowing-fire-7498.firebaseio.com/');

var userListRef = myDataRef.child("users");

function randomInt() {
  return Math.floor(Math.random() * (255 + 1));
}


function randomColorGen(){
	var r = randomInt();
  var g = randomInt();
  var b = randomInt();

  var rgbString = "rgb(" + r + "," + g + "," + b + ")";

  return rgbString;
};

function boxMover(userID, direction){
	console.log(userID)
	console.log(direction)
	// console.log("move started")
	var $box = $('#' + userID);
	$box.animate(direction, 10, function(){
		console.log("move done")
	});
};


userListRef.on('child_added', function(snapshot){
	var $li = $('<li>' + snapshot.val().name + '</li>');
	$li.data('userID', snapshot.key());
	$('#users').append($li);

	if(snapshot.key() != currentUserID){
		var $div = $('<div class="box" id=' + snapshot.key() + '></div>');
		$div.css("background-color", snapshot.val().boxcolor )
		$('body').append($div);
	};
});

userListRef.on('child_removed', function(snapshot){
	var $listItems = $('#users').find('li');
	$listItems.each(function(i){
		if( $(this).data().userID == snapshot.key()){
			this.remove()
		}
	})

	$("#" + snapshot.key()).remove();
});

userListRef.on('child_changed', function(snapshot){
	console.log("change");
	var keysArr = Object.keys(snapshot.val().moves);
	var keyChange = snapshot.val().moves[ keysArr[keysArr.length - 1] ];
	console.log(keyChange);
	console.log(typeof(keyChange));
	if(keyChange == 37){
		console.log("in 37 cond")
		boxMover(snapshot.key(), {left: "-=5px"})
	} else if(keyChange == 38) {
			boxMover(snapshot.key(), {top: "-=5px"})
	} else if(keyChange == 39) {
			boxMover(snapshot.key(), {left: "+=5px"})
	} else if(keyChange == 40) {
			boxMover(snapshot.key(), {top: "+=5px"})
	}

});

$(function(){

	$('button').on('click', function(){
		if(currentUserID){
			alert("You have already registered!");
		} else {
				var username = $('input').val();
				var push = userListRef.push({name: username, boxcolor: randomColorGen()});
				currentUserID = push.key();
		}
	});

	$('body').keydown(function(e){
		console.log(e.keyCode);
		var keyArr = [37, 38, 39, 40]
		if(keyArr.indexOf(e.keyCode) > -1){
			console.log("in if for press")
			userListRef.child(currentUserID).child("moves").push(e.keyCode);
		}
	});

});

$(window).unload(function(){
	if(currentUserID){
		userListRef.child(currentUserID).remove()
	};
	
});

