
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

var myInstance = null;
var lync=null;
            var itval = null;
            createjs.Sound.on("fileload", init);
            createjs.Sound.registerSound({ src: "err.mp3", id: "say" });
            createjs.Sound.registerSound({ src: "toy_mono.wav", id: "lync" });
            function getSate() {
                if (myInstance.playState == createjs.Sound.PLAY_FINISHED) {
                    clearTimeout(t);
	$("#time_").css("display", "inline");
	$("#time").text("0");
	$(".page3_figtClosed").addClass("shake");
	$(".page2").css("display", "none");
	$(".page3").css("display", "block");
                    clearInterval(itval);
                }
           }
            function init(){
            	
            	lync=createjs.Sound.createInstance("lync");
                myInstance = createjs.Sound.createInstance("say");
//              createjs.Sound.play("lync", {interrupt: createjs.Sound.INTERRUPT_ANY, loop:-1});
                
			}
            function lyncPlay(){
            	createjs.Sound.play("lync", {interrupt: createjs.Sound.INTERRUPT_ANY, loop:-1});
//          	lync.play("lync", {interrupt: createjs.Sound.INTERRUPT_ANY, loop:-1});
            	
            }
            function lyncStop(){
			    createjs.Sound.stop("lync");
			}
			function sayPlay(){
				myInstance.play("err");
			    itval = setInterval("getSate()", 500);
			}
			function sayStop(){
			    myInstance.stop("err");
			    clearTimeout(t);
	$("#time_").css("display", "inline");
	$("#time").text("0");
	$(".page3_figtClosed").addClass("shake");
	$(".page2").css("display", "none");
	$(".page3").css("display", "block");
			    clearInterval(itval);
			}


var christmasEvent = angular.module('christmasEvent', []);
christmasEvent.controller('christmasEvent', function($scope,$http) {
	$scope.playing = false;

$(".gift_click").bind("touchstart",function(){
	
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
			canClick=true;
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
		lyncStop();
		sayPlay();
		setTimeout("timedCount()", 1000);
	}).bind("touchstart",function() {$(this).css("background-color","#ff4444");
		});
	$("#choose_look").bind("touchstart",function() {
		$(".choose").css("display", "none");
		$(".page1").css("display", "block");
		lyncPlay();
	});
	$("#refuse").bind("touchstart",function(){
		$(".page1").css("display", "none");
		$(".page3").css("display", "none");
		$(".choose").css("display", "block");
		lyncStop();
	});
	$("#dropped").bind("touchstart",function(){
		clearTimeout(t);
		$("#time_").css("display", "inline");
		$("#time").text("0");
		sayStop();
		$(".page3").css("display", "none");
		$(".page2").css("display", "none");
		$(".page1").css("display", "block");
		lyncPlay();
	});
	$(".go_next").bind("touchstart",function(){
		 clearTimeout(t);
	$("#time_").css("display", "inline");
	$("#time").text("0");
	$(".page3_figtClosed").addClass("shake");
	$(".page2").css("display", "none");
	$(".page3").css("display", "block");
	sayStop();
	});
});




