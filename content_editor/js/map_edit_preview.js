var dragTop=0;
var dragLeft=0;
var posLeft=0;
var posTop=0;
var stopPos=0;
var keyVal;
var communityPreview = angular.module("communityPreview", []);
communityPreview.filter('typeShow', function() {
	return function(type) {
		var returnType="非房屋";
		if(type==1){
			returnType="住宅";
		}
		if(type==2){
			returnType="商铺";
		}
		return returnType;
	}
});
//元素指令，是否渲染完成
communityPreview.directive('isOver',function(){
     return {
         restrict: 'A',
         scope: {
             over: '=isOver'
         },
         link:function(scope, elm, attr){
             if(scope.$parent.$last){
                 scope.over = true;
             }
         }
     }
 });
communityPreview.directive('ngMouseWheelUp', function() {
    return function(scope, element, attrs) {
        element.bind("DOMMouseScroll mousewheel onmousewheel", function(event) {
// cross-browser wheel delta
var event = window.event || event; // old IE support
var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
if(delta > 0) {
  scope.$apply(function(){
      scope.$eval(attrs.ngMouseWheelUp);
  });
  // for IE
  event.returnValue = false;
  // for Chrome and Firefox
  if(event.preventDefault) {
      event.preventDefault();	
  }
}
        });
    };
});
communityPreview.directive('ngMouseWheelDown', function() {
    return function(scope, element, attrs) {
        element.bind("DOMMouseScroll mousewheel onmousewheel", function(event) {
// cross-browser wheel delta
var event = window.event || event; // old IE support
var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
if(delta < 0) {
  scope.$apply(function(){
      scope.$eval(attrs.ngMouseWheelDown);
  });
  // for IE
  event.returnValue = false;
  // for Chrome and Firefox
  if(event.preventDefault) {
      event.preventDefault();	
  }
}
        });
    };
}); 
communityPreview.controller("previewCtrl", function($scope) {
	$scope.mapcontent=angular.copy(preview);
	console.log($scope.mapcontent)
	var screenWidth=window.screen.availWidth;
	var screenHeight=window.screen.availHeight; 
	$scope.minSize=0;
	$scope.maxSize=0;
	$scope.layerMinSize=0;
	$scope.layerMaxSize=0;
	$scope.spiritShow;
	var mapTop;
	var mapLeft;
	var mapWidth;
	var mapHeight;
	$scope.changeNumber=0.5;
	$scope.mousePos;
	var clientHeight;
	var clientWidth;
	$scope.getEditStyle=function(spirit){
		return {
			position: 'absolute',
			top: spirit.y + 'px',
			left: spirit.x + 'px',
			"z-index": spirit.zindex,
//			"background-image": "url(" + spirit.styleList[0].style.imageUrl + ")",
			"width": parseInt(spirit.styleList[0].style.imageWidth) + "px",
			"height": parseInt(spirit.styleList[0].style.imageHeight) + "px",
			"overflow":"hidden"
//			"background-size": "100% 100%"
		};
	}
	$scope.getImgStyle=function(spirit){
		return {
			position: 'absolute',
			"width": spirit.styleList[0].style.imageWidth + "px",
			"height": spirit.styleList[0].style.imageHeight + "px",
		};
	}
	$scope.aniStyle=function(spirit){
		return {
			'position': 'absolute',
			"top":spirit.y,
			"left":spirit.x,
			"width": spirit.imageWidth + "px",
			"height":spirit.imageHeight + "px",
			"overflow":"hidden"
//			"background-image": "url(" + spirit.imageUrl + ")",
//			"background-size": "100% 100%"
		};
}
	$scope.animateStyle=function(spirit){
		if(spirit.aniColumns!=null&&spirit.aniColumns!=0){
			return {
				'position': 'absolute',
				"top":"0px",
				"left":"0px",
				"width": spirit.imageWidth*spirit.aniColumns + "px",
				"height":spirit.imageHeight + "px",
				"background-image": "url(" + spirit.imageUrl + ")",
				"background-size": "100% 100%"
			};
		}
		return {
			'position': 'absolute',
			"top":"0px",
			"left":"0px",
			"width": spirit.imageWidth + "px",
			"height":spirit.imageHeight + "px",
			"background-image": "url(" + spirit.imageUrl + ")",
			"background-size": "100% 100%"
		};
}
	$scope.hasMouse=function($event){
		$scope.mousePos=$event;
	}
	$scope.getSpiritStyle=function(spiritStyle){
		if(spiritStyle.style.aniColumns!=null&&spiritStyle.style.aniColumns!=0){
			return {
				position: 'absolute',
				top:'0px',
				left:'0px',
				"background-image": "url(" + spiritStyle.style.imageUrl + ")",
				"width": parseFloat(spiritStyle.style.imageWidth)*spiritStyle.style.aniColumns + "px",
				"height": parseFloat(spiritStyle.style.imageHeight) + "px",
				"background-size": "100% 100%"
			};
		}

		return {
			position: 'absolute',
			top:'0px',
			left:'0px',
			"background-image": "url(" + spiritStyle.style.imageUrl + ")",
			"width": parseFloat(spiritStyle.style.imageWidth) + "px",
			"height": parseFloat(spiritStyle.style.imageHeight) + "px",
			"background-size": "100% 100%"
		};
	}
	$scope.getLayerStyle=function(layer){
		return {
			position: 'absolute',
			"z-index": layer.zindex
		};
	}
	$scope.toggle = {        
            now:false
        };
	$(".arena").css("width",$scope.mapcontent.width+"px");
	$(".arena").css("height",$scope.mapcontent.height+"px");
	clientWidth=window.parent.client.width;
	clientHeight=window.parent.client.height;
	$(".arena").css("left",(clientWidth-$scope.mapcontent.width*$scope.changeNumber)/2+"px");
	$(".arena").css("top",(clientHeight-$scope.mapcontent.height*$scope.changeNumber)/2+"px");
	$scope.$watch('toggle.now',function(){
		if($scope.toggle.now){
			$(".choose img").css("width",parseInt($(".choose img").css("width"))*$scope.changeNumber*0.6+"px");
//			$(".choose img").css("height",parseInt($(".choose img").css("height"))*$scope.changeNumber+"px");
			$(".choose").css("width",parseInt($(".choose img").css("width"))/4+"px");
			$(".choose").css("height",parseInt($(".choose img").css("height"))+"px");
			$(".shopchoose img").css("width",parseInt($(".shopchoose img").css("width"))*$scope.changeNumber*0.7+"px");
//			$(".shopchoose img").css("height",parseInt($(".shopchoose img").css("height"))*$scope.changeNumber+"px");
			$(".shopchoose").css("width",parseInt($(".shopchoose img").css("width"))/23+"px");
			$(".shopchoose").css("height",parseInt($(".shopchoose img").css("height"))+"px");
//			$scope.animal=function(id,wid,cols,times,type){
//			$scope.animal("#shop_choose img",parseInt($("#shop_choose img").css("width"))/4,4,500,"choose");
//			$scope.animal("#building_choose img",parseInt($("#building_choose img").css("width"))/4,4,500,"choose");
//			$scope.animal("#paper_choose img",parseInt($("#paper_choose img").css("width"))/23,23,1500,"choose");
			for(var i in $scope.mapcontent.layers){
				for(var j in $scope.mapcontent.layers[i].sprites){
					for(m in $scope.mapcontent.layers[i].sprites[j].styleList){
						vartemp={};
						vartemp.id="#spirit"+$scope.mapcontent.layers[i].sprites[j].id+"_style"+m;
						vartemp.interval=-1;
						vartemp.type="styles";
						vartemp.num=m;
						allInterval.push(vartemp);
						if($scope.mapcontent.layers[i].sprites[j].styleList[m].style.aniColumns==undefined){
							$scope.mapcontent.layers[i].sprites[j].styleList[m].style.aniColumns=null;
						}
						if($scope.mapcontent.layers[i].sprites[j].styleList[m].style.aniMillisecond==undefined){
							$scope.mapcontent.layers[i].sprites[j].styleList[m].style.aniMillisecond=null;
						}
					}
					for(m in $scope.mapcontent.layers[i].sprites[j].animations){
						vartemp={};
						vartemp.id="#spirit"+$scope.mapcontent.layers[i].sprites[j].id+"_animate"+m;
						vartemp.interval=-1;
						vartemp.type="animation";
						vartemp.num=m;
						allInterval.push(vartemp);
						if($scope.mapcontent.layers[i].sprites[j].animations[m].aniColumns==undefined){
							$scope.mapcontent.layers[i].sprites[j].animations[m].aniColumns=null;
						}
						if($scope.mapcontent.layers[i].sprites[j].animations[m].aniMillisecond==undefined){
							$scope.mapcontent.layers[i].sprites[j].animations[m].aniMillisecond=null;
						}
					}
					
				}
				}
//			$scope.animal("#shop_choose img",parseInt($("#shop_choose").css("width")),4,500,"choose");
//			$scope.animal("#building_choose img",parseInt($("#building_choose").css("width")),4,500,"choose");
//			$scope.animal("#paper_choose img",parseInt($("#paper_choose").css("width")),23,1500,"choose");
			var vartemp2={};
			vartemp2.id="#shop_choose img";
			vartemp2.interval=-1;
			vartemp2.type="choose";
			allInterval.push(vartemp2);
			var vartemp3={};
			vartemp3.id="#building_choose img";
			vartemp3.interval=-1;
			vartemp3.type="choose";
			allInterval.push(vartemp3);
			var vartemp4={};
			vartemp4.id="#paper_choose img";
			vartemp4.interval=-1;
			vartemp4.type="choose";
			allInterval.push(vartemp4);
			ani($scope.changeNumber);
			$('.arena').udraggable({
				stop:function(e,ui){
					stopPos= ui.position;
					dragLeft=posLeft-stopPos.left;
					dragTop=posTop-stopPos.top;
				},start:function(e,ui){
					  posLeft = ui.position.left+dragLeft;
					  posTop = ui.position.top+dragTop;
					 
				}
			});
			for(var i in $scope.mapcontent.layers){
				for(var j in $scope.mapcontent.layers[i].sprites){
						$scope.mapcontent.layers[i].sprites[j].x=$scope.mapcontent.layers[i].sprites[j].x*$scope.changeNumber;
						$scope.mapcontent.layers[i].sprites[j].y=$scope.mapcontent.layers[i].sprites[j].y*$scope.changeNumber;
						for(c in $scope.mapcontent.layers[i].sprites[j].styleList){
							$scope.mapcontent.layers[i].sprites[j].styleList[c].style.imageHeight=$scope.mapcontent.layers[i].sprites[j].styleList[c].style.imageHeight*$scope.changeNumber;
							$scope.mapcontent.layers[i].sprites[j].styleList[c].style.imageWidth=$scope.mapcontent.layers[i].sprites[j].styleList[c].style.imageWidth*$scope.changeNumber;
						}
						for(d in $scope.mapcontent.layers[i].sprites[j].animations){
							$scope.mapcontent.layers[i].sprites[j].animations[d].x=$scope.mapcontent.layers[i].sprites[j].animations[d].x*$scope.changeNumber;
							$scope.mapcontent.layers[i].sprites[j].animations[d].y=$scope.mapcontent.layers[i].sprites[j].animations[d].y*$scope.changeNumber;
							$scope.mapcontent.layers[i].sprites[j].animations[d].imageWidth=$scope.mapcontent.layers[i].sprites[j].animations[d].imageWidth*$scope.changeNumber;
							$scope.mapcontent.layers[i].sprites[j].animations[d].imageHeight=$scope.mapcontent.layers[i].sprites[j].animations[d].imageHeight*$scope.changeNumber;
						}
					}
				}
				$scope.mapcontent.width=$scope.mapcontent.layers[0].sprites[$scope.mapcontent.layers[0].sprites.length-1].x+$scope.mapcontent.layers[0].sprites[$scope.mapcontent.layers[0].sprites.length-1].styleList[0].style.imageWidth;
				$scope.mapcontent.height=$scope.mapcontent.layers[0].sprites[$scope.mapcontent.layers[0].sprites.length-1].y+$scope.mapcontent.layers[0].sprites[$scope.mapcontent.layers[0].sprites.length-1].styleList[0].style.imageHeight;
				$(".arena").css("width",$scope.mapcontent.width+"px");
				$(".arena").css("height",$scope.mapcontent.height+"px");
		}
		mapTop=document.getElementById('divMap').getBoundingClientRect().top*$scope.changeNumber;
		mapLeft=document.getElementById('divMap').getBoundingClientRect().left*$scope.changeNumber;
		mapWidth=document.getElementById('divMap').getBoundingClientRect().width;;
		mapHeight=document.getElementById('divMap').getBoundingClientRect().height;;
	});
	$scope.keyUp=function($event){
		if($event.keyCode==17){
			 keyVal=null;
		}
	}
	$scope.keydown = function ($event) {
		$event.preventDefault();	
		 if($event.keyCode==17){
	        	keyVal=17;
	        }
		 if($event.keyCode==38&&keyVal==17||$event.keyCode==187&&keyVal==17){
			 $scope.changeSize("up");
	        }
		 if($event.keyCode==40&&keyVal==17||$event.keyCode==189&&keyVal==17){
			 $scope.changeSize("down");
	        }
		 if($event.keyCode==38&&keyVal==null){
			 $(".arena").css("top",parseInt($(".arena").css("top"))-1+"px");
			 dragTop-=1;
			 }
		 if($event.keyCode==37&&keyVal==null){
			 $(".arena").css("left",parseInt($(".arena").css("left"))-1+"px");
			 dragLeft-=1;
		 }
		 if($event.keyCode==39&&keyVal==null){
			 $(".arena").css("left",parseInt($(".arena").css("left"))+1+"px");
			 dragLeft+=1;
		 }
	}
	function ani(changeNumber){
		$scope.animal("#shop_choose img",parseInt($("#shop_choose img").css("width"))/4,4,500,"choose");
		$scope.animal("#building_choose img",parseInt($("#building_choose img").css("width"))/4,4,500,"choose");
//		$scope.animal("#paper_choose img",parseInt($("#paper_choose img").css("width"))/23,23,1500,"choose");
		
		 for(var i in $scope.mapcontent.layers){
			for(var j in $scope.mapcontent.layers[i].sprites){
				if($scope.mapcontent.layers[i].sprites[j].animations!=null&&$scope.mapcontent.layers[i].sprites[j].animations.length>0){
					for(m in $scope.mapcontent.layers[i].sprites[j].animations){
					if($scope.mapcontent.layers[i].sprites[j].animations[m].aniColumns!=null&&$scope.mapcontent.layers[i].sprites[j].animations[m].aniColumns>1){
						
						$(".spirit"+$scope.mapcontent.layers[i].sprites[j].id+"_animate"+m).attr("id","spirit"+$scope.mapcontent.layers[i].sprites[j].id+"_animate"+m);
						$scope.animal("#spirit"+$scope.mapcontent.layers[i].sprites[j].id+"_animate"+m,$scope.mapcontent.layers[i].sprites[j].animations[m].imageWidth*changeNumber,$scope.mapcontent.layers[i].sprites[j].animations[m].aniColumns,$scope.mapcontent.layers[i].sprites[j].animations[m].aniMillisecond,"animation");
						
						}else{
						$(".animation"+$scope.mapcontent.layers[i].sprites[j].id).attr("id","animation"+$scope.mapcontent.layers[i].sprites[j].id);
						$(".animation"+$scope.mapcontent.layers[i].sprites[j].id).css("left","0px");
					}
					}
				}
				for(m in $scope.mapcontent.layers[i].sprites[j].styleList){
				if($scope.mapcontent.layers[i].sprites[j].styleList[m].style.aniColumns!=null&&$scope.mapcontent.layers[i].sprites[j].styleList[m].style.aniColumns>1){
					$(".spirit"+$scope.mapcontent.layers[i].sprites[j].id+"_style"+m).attr("id","spirit"+$scope.mapcontent.layers[i].sprites[j].id+"_style"+m);
					$scope.animal("#spirit"+$scope.mapcontent.layers[i].sprites[j].id+"_style"+m,$scope.mapcontent.layers[i].sprites[j].styleList[0].style.imageWidth*changeNumber,$scope.mapcontent.layers[i].sprites[j].styleList[m].style.aniColumns,$scope.mapcontent.layers[i].sprites[j].styleList[m].style.aniMillisecond,"styles");
				}else{
					$(".spirit"+$scope.mapcontent.layers[i].sprites[j].id).attr("id","spirit_"+$scope.mapcontent.layers[i].sprites[j].id);
					$(".spirit"+$scope.mapcontent.layers[i].sprites[j].id).css("left","0px");
				}
				}
			}
		}
	}
    var sizeNumber;
	$scope.changeSize=function(mouseWheel){
		$(".arena").css("position","absolute");
		$scope.mapcontent=angular.copy(preview);
		$("#building_choose").css("top",parseInt($("#building_choose").css("top"))/$scope.changeNumber+"px");
		$("#building_choose").css("left",parseInt($("#building_choose").css("left"))/$scope.changeNumber+"px");
		$("#shop_choose").css("top",parseInt($("#shop_choose").css("top"))/$scope.changeNumber+"px");
		$("#shop_choose").css("left",parseInt($("#shop_choose").css("left"))/$scope.changeNumber+"px");
		$("#paper_choose").css("top",parseInt($("#paper_choose").css("top"))/$scope.changeNumber+"px");
		$("#paper_choose").css("left",parseInt($("#paper_choose").css("left"))/$scope.changeNumber+"px");
		
		$("#building_choose").css("width",parseInt($("#building_choose").css("width"))/$scope.changeNumber+"px");
		$("#building_choose").css("height",parseInt($("#building_choose").css("height"))/$scope.changeNumber+"px");
		$("#shop_choose").css("width",parseInt($("#shop_choose").css("width"))/$scope.changeNumber+"px");
		$("#shop_choose").css("height",parseInt($("#shop_choose").css("height"))/$scope.changeNumber+"px");
		$("#paper_choose").css("width",parseInt($("#paper_choose").css("width"))/$scope.changeNumber+"px");
		$("#paper_choose").css("height",parseInt($("#paper_choose").css("height"))/$scope.changeNumber+"px");
		
	
		if(mouseWheel=="up"){
			$scope.changeNumber+=0.05;
			if($scope.changeNumber>$scope.mapcontent.maxScale){
				$scope.changeNumber=$scope.mapcontent.maxScale;
			}	
			}
		if(mouseWheel=="down"){
			$scope.changeNumber-=0.05;
			if($scope.changeNumber<$scope.mapcontent.minScale){
				$scope.changeNumber=$scope.mapcontent.minScale;
			}
			}
		$("#building_choose").css("top",parseInt($("#building_choose").css("top"))*$scope.changeNumber+"px");
		$("#building_choose").css("left",parseInt($("#building_choose").css("left"))*$scope.changeNumber+"px");
		$("#shop_choose").css("top",parseInt($("#shop_choose").css("top"))*$scope.changeNumber+"px");
		$("#shop_choose").css("left",parseInt($("#shop_choose").css("left"))*$scope.changeNumber+"px");
		$("#paper_choose").css("top",parseInt($("#paper_choose").css("top"))*$scope.changeNumber+"px");
		$("#paper_choose").css("left",parseInt($("#paper_choose").css("left"))*$scope.changeNumber+"px");
		 
		$("#building_choose").css("width",parseInt($("#building_choose").css("width"))*$scope.changeNumber+"px");
		$("#building_choose").css("height",parseInt($("#building_choose").css("height"))*$scope.changeNumber+"px");
		$("#shop_choose").css("width",parseInt($("#shop_choose").css("width"))*$scope.changeNumber+"px");
		$("#shop_choose").css("height",parseInt($("#shop_choose").css("height"))*$scope.changeNumber+"px");
		$("#paper_choose").css("width",parseInt($("#paper_choose").css("width"))*$scope.changeNumber+"px");
		$("#paper_choose").css("height",parseInt($("#paper_choose").css("height"))*$scope.changeNumber+"px");
	    
		$("#building_choose img").css("width",parseInt($("#building_choose").css("width"))*4+"px");
		$("#shop_choose img").css("width",parseInt($("#shop_choose").css("width"))*4+"px");
		$("#paper_choose img").css("width",parseInt($("#paper_choose").css("width"))*23+"px");
		
		
		ani($scope.changeNumber);
		for(var i in $scope.mapcontent.layers){
			for(var j in $scope.mapcontent.layers[i].sprites){
					$scope.mapcontent.layers[i].sprites[j].x=$scope.mapcontent.layers[i].sprites[j].x*$scope.changeNumber;
					$scope.mapcontent.layers[i].sprites[j].y=$scope.mapcontent.layers[i].sprites[j].y*$scope.changeNumber;
					for(c in $scope.mapcontent.layers[i].sprites[j].styleList){
						$scope.mapcontent.layers[i].sprites[j].styleList[c].style.imageHeight=$scope.mapcontent.layers[i].sprites[j].styleList[c].style.imageHeight*$scope.changeNumber;
						$scope.mapcontent.layers[i].sprites[j].styleList[c].style.imageWidth=$scope.mapcontent.layers[i].sprites[j].styleList[c].style.imageWidth*$scope.changeNumber;
					}
					for(d in $scope.mapcontent.layers[i].sprites[j].animations){
						$scope.mapcontent.layers[i].sprites[j].animations[d].x=$scope.mapcontent.layers[i].sprites[j].animations[d].x*$scope.changeNumber;
						$scope.mapcontent.layers[i].sprites[j].animations[d].y=$scope.mapcontent.layers[i].sprites[j].animations[d].y*$scope.changeNumber;
						$scope.mapcontent.layers[i].sprites[j].animations[d].imageWidth=$scope.mapcontent.layers[i].sprites[j].animations[d].imageWidth*$scope.changeNumber;
						$scope.mapcontent.layers[i].sprites[j].animations[d].imageHeight=$scope.mapcontent.layers[i].sprites[j].animations[d].imageHeight*$scope.changeNumber;
					}
				}
			}
			$scope.mapcontent.width=$scope.mapcontent.layers[0].sprites[$scope.mapcontent.layers[0].sprites.length-1].x+$scope.mapcontent.layers[0].sprites[$scope.mapcontent.layers[0].sprites.length-1].styleList[0].style.imageWidth;
			$scope.mapcontent.height=$scope.mapcontent.layers[0].sprites[$scope.mapcontent.layers[0].sprites.length-1].y+$scope.mapcontent.layers[0].sprites[$scope.mapcontent.layers[0].sprites.length-1].styleList[0].style.imageHeight;
			$(".arena").css("width",$scope.mapcontent.width+"px");
			$(".arena").css("height",$scope.mapcontent.height+"px");
//			console.log(dragLeft);
			$(".arena").css("left",(clientWidth-$scope.mapcontent.width/*-$scope.mousePos.clientX*/)/2-dragLeft+"px");
			$(".arena").css("top",(clientHeight-$scope.mapcontent.height/*-$scope.mousePos.clientY*/)/2-dragTop+"px");
//			$(".arena").css("top",($scope.mousePos.clientY+mapTop*2)/$scope.changeNumber+"px");
//			mapTop=document.getElementById('divMap').getBoundingClientRect().top;
//			mapLeft=document.getElementById('divMap').getBoundingClientRect().left;
			mapWidth=document.getElementById('divMap').getBoundingClientRect().width;
			mapHeight=document.getElementById('divMap').getBoundingClientRect().height;
			$('.arena').udraggable({
				stop:function(e,ui){
					stopPos= ui.position;
					dragLeft=posLeft-stopPos.left;
					dragTop=posTop-stopPos.top;
				},start:function(e,ui){
					  posLeft = ui.position.left+dragLeft;
					  posTop = ui.position.top+dragTop;
					 
				}
			});
			
			
	}
	
	var interval;
	var allInterval=[];
	$scope.animal=function(id,wid,cols,times,type){
		for(var i in allInterval){
			if(allInterval[i].id==id&&allInterval[i].interval!=-1&&allInterval[i].type==type){
//				console.log(id);
				interval=allInterval[i].interval;
			}
		}
		clearInterval(interval);
		var cols=cols;
		var times=times;
		var copiesCol=wid;
		var copiesTime=times/cols;
		var temp=0;
		$scope.ani=function(){
			if(id=="#paper_choose img"){
				if(temp<=cols){
					$(id).animate({left:0-copiesCol*temp+'px'},0).animate({left:0-copiesCol*temp+'px'},copiesTime);
				  temp++;
				}else{
					clearInterval(interval);
				}
			}else{
				if(temp<cols){
					$(id).animate({left:0-copiesCol*temp+'px'},0).animate({left:0-copiesCol*temp+'px'},copiesTime);
				  temp++;
				}else{
					temp=0;
				}
			}
			
		}
		
		interval=setInterval($scope.ani,copiesTime);
		
		for(var i in allInterval){
			if(allInterval[i].id==id&&allInterval[i].type==type){
				allInterval[i].interval=interval;
			}
		}
			interval=-1;
		}
	$scope.chooseSpirit=function(spirit){
		$scope.spiritShow=spirit;
		if(spirit.spriteType==1){
			$(".spiritShow").css("display","block");
			$("#building_choose").css("opacity","1");
			$("#building_choose").css("z-index","10000");
			var chooseWid=parseInt($("#building_choose").css("width"))/2*$scope.changeNumber;
			var chooseHei=parseInt($("#building_choose").css("height"))+1*$scope.changeNumber;
			$("#building_choose").css("top",spirit.y+spirit.styleList[0].style.labelPositionY*$scope.changeNumber-chooseHei+"px");
			$("#building_choose").css("left",spirit.x+spirit.styleList[0].style.labelPositionX*$scope.changeNumber-chooseWid+"px");
			$("#shop_choose").css("opacity","0");
			$("#shop_choose").css("z-index","0");
			
		}else
		if(spirit.spriteType==2){
			$(".spiritShow").css("display","block");
			$("#shop_choose").css("opacity","1");
			$("#paper_choose").css("opacity","1");
			$("#shop_choose").css("z-index","10000");
			$("#paper_choose").css("z-index","10000");
			var chooseWid=parseInt($("#shop_choose").css("width"))/2*$scope.changeNumber;
			var chooseHei=parseInt($("#shop_choose").css("height"))+1*$scope.changeNumber;
			$("#shop_choose").css("top",spirit.y+spirit.styleList[0].style.labelPositionY*$scope.changeNumber-chooseHei+"px");
			$("#shop_choose").css("left",spirit.x+spirit.styleList[0].style.labelPositionX*$scope.changeNumber-chooseWid+"px");
			$("#paper_choose").css("top",spirit.y+"px");
			$("#paper_choose").css("left",spirit.x+chooseWid+"px");
			$scope.animal("#paper_choose img",parseInt($("#paper_choose img").css("width"))/23,23,1500,"choose");
			$("#building_choose").css("opacity","0");
			$("#building_choose").css("z-index","0");
		}else{
			$(".spiritShow").css("display","none");
			/*$("#building_choose").css("opacity","0");
			$("#shop_choose").css("opacity","0");
			$("#paper_choose").css("opacity","0");
			$("#building_choose").css("z-index","0");
			$("#shop_choose").css("z-index","0");
			$("#paper_choose").css("z-index","0");*/
		}
	}
});
//angular结束
$(function(){
	/*$(".spirit").bind("click",function(){
//		if($(this).attr("type")=="1"||$(this).attr("type")=="2"){
//			var y=parseInt($(this).css("top"));
//			$(this).animate({top:(y-20)+'px'},150).animate({top:y+'px'},150).animate({top:(y-10)+'px'},100).animate({top:y+'px'},50);
//		}
	});*/
	
})


