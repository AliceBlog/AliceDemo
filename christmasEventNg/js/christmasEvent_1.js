
var c = 0
var t
var hasPrize=false;
var canClick=true;
function timedCount() {
	c = parseInt($("#time").text());
	c += 1;
	if (c >= 10) {
		$("#time_").css("display", "none");
	}
	$("#time").text(c);
	t = setTimeout("timedCount()", 1000);
}
var christmasEvent = angular.module('christmasEvent', []);
christmasEvent.controller('christmasEvent', function($scope,$http) {
	$scope.playing = false;
  $scope.audio = document.getElementById('audio');
  $scope.play = function() {
  	$scope.audio.play();
    $scope.playing = true;
    alert()
  };
  $scope.stop = function() {
    $scope.audio.pause();
    $scope.audio.load();
    $scope.playing = false;
  };
$scope.audio.addEventListener('ended', function() {
	
	$scope.$apply(function() {
      $scope.play();
    });
});
	$scope.recording = false;
  $scope.record = document.createElement('audio');
  $scope.record.src = 'err.mp3';
   $scope.recordPlay = function() {
   	
  	 $scope.record.play();
     $scope.recording = true;
  };
  $scope.recordStop = function() {
     $scope.record.pause();
      $scope.record.load();
     $scope.recording = false;
  };
 $scope.record.addEventListener('ended', function() {
 	$scope.$apply(function() {
    clearTimeout(t);
	$("#time_").css("display", "inline");
	$("#time").text("0");
	$(".page3_figtClosed").addClass("shake");
	$(".page2").css("display", "none");
	$(".page3").css("display", "block");
    });
});

$(".page3_figtClosed").bind("touchstart",function(){
	
	if(canClick==true){
		canClick=false;
		$http({
		method: 'get',
		url: "giftTest.json"
	}).success(function(response) {
		if (response.status==false&&hasPrize==false) {
			$("#prizeName").text(response.prizeNmae);
			$(".gift_closed").css("display","none");
			$(".gift_open_bg").css("display","block");
			$("#hasPrize").css("display","none");
			$(".page3_figtClosed").removeClass("shake");
			hasPrize=true;
			canClick=true;
		} else{
			$("#prizeName").text(response.prizeNmae);
			$(".gift_closed").css("display","none");
			$(".gift_open_bg").css("display","block");
			$("#hasPrize").css("display","block");
		}
		
	});
	}else{
		alert("礼物正在努力飞奔过来，请稍等");
	}
	
});
$("#rule").bind("touchstart",function(){
		$("#rulepage").css("display", "block");
	});
	$("#rulepage").bind("touchstart",function(){
		$("#rulepage").css("display", "none");
	});
$("#closed").bind("touchstart",function() {
	$(".gift_closed").css("display","block");
	$(".gift_open_bg").css("display","none");
})
	$("#answer").bind("touchstart",function() {
		$(".page1").css("display", "none");
		$(".page2").css("display", "block");
		$(this).css("background-color","#e04141");
		$scope.stop();
		$scope.recordPlay();
		setTimeout("timedCount()", 1000);
	}).bind("touchstart",function() {$(this).css("background-color","#ff4444");
		});
	$("#choose_look").bind("touchstart",function() {
		$(".choose").css("display", "none");
		$(".page1").css("display", "block");
		$scope.play();
	});
	$("#refuse").bind("touchstart",function(){
		$(".page1").css("display", "none");
		$(".choose").css("display", "block");
		$scope.stop();
	});
	$("#dropped").bind("touchstart",function(){
		clearTimeout(t);
		$("#time_").css("display", "inline");
		$("#time").text("0");
		$scope.recordStop();
		$(".page2").css("display", "none");
		$(".page1").css("display", "block");
		$scope.play();
	});
});
