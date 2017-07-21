//无交互的jquery
window.onload = function() {
	clientWidth=$(window.top).width();
	clientHeight=$(window.top).height();  
	document.body.scrollLeft=-(clientWidth-contents.defaultX*2)/2;
	document.body.scrollTop=-(clientHeight-contents.defaultY*2)/2;
	$(".tab").css("opacity",1);
	
//	alert();
//	$("body").scrollLeft((clientWidth-contents.defaultX*2)/2);
//	$("body").scrollTop((clientHeight-contents.defaultX*2)/2);
	var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
	var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
	$(".tab").css("left", 100+scrollX + "px");
	$(".tab").css("top",70+scrollY + "px");
	$(".coverage").css("left",380+ scrollX + "px");
	$(".coverage").css("top", 70 + scrollY + "px");
	$("#studyEdit").click(function(){
		$(".course").show();
	});
	$(".courseClose").click(function(){
		$(".course").hide();
	});
	$("#imageText").click(function(){
		$(".course").hide();
		window.open(course_imageText);
	});
	$("#courseVideo").click(function(){
		$(".course").hide();
		window.open(course_video);
	});
	
	$(".maskLayer").css("opacity",0);
	$(".selectOption span,.selectMore").click(function(){
		$(".selectMore").slideToggle();
	});
	$(".windowClose,#windowClose").click(function(){
		$("body").css("overflow","auto");
		$(".maskLayer").css("z-index",0);
		$(".maskLayer").css("opacity",0);
		$(".selectMore").slideUp();
	});
	$('#form_z').slider({  
		mode: 'h',   
		step:1,
		showTip:true,
		tipFormatter: function(value){   
		        return value;   
		    }  
	}); 
	$("#tabClose").click(function() {
		$(".tab").css("opacity",0);
		$(".tab").css("z-index",0);
		cog=false;
	});
	var oldscrollX =scrollX;
	var oldscrollY = scrollY;
	var cog=false;
	var laySet=false;
	$("#cog").click(function() {
		if(cog==false){
			var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
			var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
			$(".tab").css("left", parseInt($(".tab").css("left")) - oldscrollX + scrollX + "px");
			$(".tab").css("top", parseInt($(".tab").css("top")) - oldscrollY + scrollY + "px");
			oldscrollX = scrollX;
			oldscrollY = scrollY;
			$(".tab").css("opacity",1);
			$(".tab").css("z-index",8900);
			cog=true;
		}else{
			$(".tab").css("opacity",0);
			$(".tab").css("z-index",0);
			cog=false;
		}
		
	});
$("#laySet").click(function() {
	if(laySet==false){
		var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
		var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
		$(".coverage").css("left", parseInt($(".coverage").css("left")) - oldscrollX + scrollX + "px");
		$(".coverage").css("top", parseInt($(".coverage").css("top")) - oldscrollY + scrollY + "px");
		oldscrollX = scrollX;
		oldscrollY = scrollY;
		$(".coverage").css("opacity",1);
		$(".coverage").css("z-index",9000);
		laySet=true;
	}else{
		$(".coverage").css("opacity",0);
		$(".coverage").css("z-index",-1);
		laySet=false;
	}
		
	});
	$(document).scroll(function() {
		var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
		var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
		
		$(".tab").css("left", parseInt($(".tab").css("left")) - oldscrollX + scrollX + "px");
		$(".tab").css("top", parseInt($(".tab").css("top")) - oldscrollY + scrollY + "px");
		$("#layerChange").css("left", parseInt($("#layerChange").css("left")) - oldscrollX + scrollX + "px");
		$("#layerChange").css("top", parseInt($("#layerChange").css("top")) - oldscrollY + scrollY + "px");
		$(".coverage").css("left", parseInt($(".coverage").css("left")) - oldscrollX + scrollX + "px");
		$(".coverage").css("top", parseInt($(".coverage").css("top")) - oldscrollY + scrollY + "px");
		oldscrollX = scrollX;
		oldscrollY = scrollY;
	});
	$("#upLoadRoadButton").click(function(){
		$(".upLoadRoad").css("display","block");
	});
	$("#upLoadRoadClose").click(function(){
		$(".upLoadRoad").css("display","none");
	});
	$("#sceneSettingButton").click(function(){
		
		$(".sceneSetting").css("display","block");
		$("body").css("overflow","hidden");
		$('#sceneSetting').udraggable();
	});
	$("#sceneSettingClose").click(function(){
		$(".sceneSetting").css("display","none");
		$("body").css("overflow","auto");
	});
   
	$('#defaultZoomClose,.defaultZoomClose').click(function(){
		$("#defaultZoom").css("display","none");
	})
	$('.coverage').udraggable(
			{
				handle:      '.coverage_title'
			}
	);
	var slideDown=true;
	$(".tab_setting").click(function(){
		$(this).next().slideToggle();
		if($(this).children("span").attr("class")=="icon-point-down"){
			$(this).children("span").attr("class","icon-point-right");
		}else if($(this).children("span").attr("class")=="icon-point-right"){
			$(this).children("span").attr("class","icon-point-down");
		}
		
	});
	$('#layerChange').udraggable();
	$('.drag').udraggable({
		containment: [0, 0, 1500, 1500],
		grid: [300, 300]
	});
	$("#previeClose").click(function(){
		$("#previewWindow").hide();
		$("body").css("overflow","auto");
	})
	$("#setopen").click(function(){
		$("#setMore").fadeToggle();
	 })
	 $("#layerClose").click(function(){
		 $("#layerChange").css("display","none");
	 });
	
	
	$(".setCoordinate").mousemove(function(e){
		$("#coordinate").css("left",e.offsetX+10+"px");
		$("#coordinate").css("top",e.offsetY+10+"px");
		$("#coordinate").html("X:"+e.offsetX+"  Y:"+e.offsetY);
	})
	$(".drag").mousedown(function() {
		$(this).css("border", "solid 1px #fff");
		$(this).css("z-index", "10");
		$(this).siblings(".drag").css("border", "solid 0px #fff");
		$(this).siblings(".drag").css("z-index", "1");
	});
	$(".drag").mouseup(function() {
		$(this).css("border", "solid 0px #fff");
	});
	$("#layerChangeClose").click(function(){
		$(".modifyLayer").css("display","none");
		$("body").css("overflow","auto");
	});
	
	$("#creatLayerClose").click(function(){
		$(".creatLayer").css("display","none");
		$("body").css("overflow","auto");
	});
	$("#deleteLayerClose").click(function(){
		$(".deleteLayer").css("display","none");
		$("body").css("overflow","auto");
	});
	$("#changeStyleLayerClose","#styleWinClose").click(function(){
		
		$(".changeStyleLayer").hide();
	});
	$("#windowClose").click(function(){
		$(".maskLayer").css("opacity",0);
		$(".maskLayer").css("z-index",0);
		$(".changeStyleLayer").css("display","none");
		$("#animationModel").css("display","none");
		$("body").css("overflow","auto");
	});
	$(".windowClose").click(function(){
		$(".modifyLayer").css("display","none");
		$(".creatLayer").css("display","none");
		$("#animationModel").css("display","none");
		$(".deleteLayer").css("display","none");
		$(".maskLayer").css("opacity",0);
		$(".changeStyleLayer").css("display","none");
		$(".maskLayer").css("z-index",0);
		$("body").css("overflow","auto");
	});
	$("#upLoadRoadClose,#animationModelClose").click(function(){
		$("#animationModel").hide();
	})
	
}