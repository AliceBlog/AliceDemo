/*
 * 修改日期：2015.1.18
 * 修改内容：快捷键：ctrl+c、ctrl+v、ctrl+x、del、新建商铺、楼栋功能
 */

/**
 * 上一步下一步已经实现、编辑起来数据多了有点卡，需优化！！！，存放的函数operateBuffer
 */
var mapcontent = contents;
var previewValue;
var anima;
var sizeNumber=0.5;
var scope;
var spriteType;
var client={"width":0,"height":0};
var communityEditApp = angular.module("communityEdit", ["ang-drag-drop"]);
//过滤器，显示放置的状态
communityEditApp.filter('dropStatus', function() {
	return function(mapcontent,spirit) {
		var dropStatus = "未放置";
		for(i in mapcontent.layers){
			for(j in mapcontent.layers[i].sprites){
				if(mapcontent.layers[i].sprites[j].id==spirit.id){
					dropStatus="已放置";
				}
			}
		}
		return dropStatus;
	}
});
//过滤器，处理字符串显示0-3位
communityEditApp.filter('subStr', function() {
	return function(houseName) {
		var subHouseName;
		if(houseName.length>3 ){
			subHouseName = houseName.substring(0, 3) + "..";
		}else{
			subHouseName = houseName;
		}
		return subHouseName;
	}
});
communityEditApp.directive('ngMouseWheelUp', function() {
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
communityEditApp.directive('ngMouseWheelDown', function() {
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
communityEditApp.filter('otherShow', function() {
	return function(otherSpirit) {
		var otherShow = [];
		for (other in otherSpirit) {
			if (otherSpirit[other].applyTypes!=undefined&&otherSpirit[other].applyTypes =="4") {
				otherShow.push(otherSpirit[other]);
			}
		}
		return otherShow;
	}
});
communityEditApp.filter('sysBuildShow', function() {
	return function(otherSpirit) {
		var otherShow = [];
		for (other in otherSpirit) {
			if (otherSpirit[other].applyTypes!=undefined&&otherSpirit[other].applyTypes =="32") {
				otherShow.push(otherSpirit[other]);
			}
		}
		return otherShow;
	}
});
communityEditApp.filter('clickableShow', function() {
	return function(otherSpirit) {
		var otherShow = [];
		for (other in otherSpirit) {
			if (otherSpirit[other].applyTypes!=undefined&&otherSpirit[other].applyTypes == "64") {
				otherShow.push(otherSpirit[other]);
			}
		}
		return otherShow;
	}
});
communityEditApp.filter('roadShow', function() {
	return function(otherSpirit) {
		var otherShow = [];
		for (other in otherSpirit) {
			if (otherSpirit[other].applyTypes!=undefined&&otherSpirit[other].applyTypes =="8") {
				otherShow.push(otherSpirit[other]);
			}
		}
		return otherShow;
	}
});
communityEditApp.filter('styleShow', function() {
	return function(style,spriteType) {
		var styleShow = [];
		for (i in styles) {
			if (style[i].applyTypes == spriteType) {
				styleShow.push(style[i]);
			}
		}
		return styleShow;
	}
});
communityEditApp.filter('shopsIconShow', function() {
	return function(spriteList,layerType) {
		var returnList = [];
		for (i in spriteList) {
			if (spriteList[i].layerType == layerType) {
				returnList.push(spriteList[i]);
			}
		}
		return returnList;
	}
});
communityEditApp.filter('linkUrl', function() {
	return function(linkUrl) {
		var returnLinkUrl = linkUrl;
		if(returnLinkUrl==""){
			returnLinkUrl="无"
		}
		return returnLinkUrl;
	}
});
communityEditApp.filter('playType', function() {
	return function(playType) {
		var returnPlayType = playType;
		if(returnPlayType==0){
			returnPlayType="选中后播放";
		}
		if(returnPlayType==1){
			returnPlayType="一直播放";
		}
		return returnPlayType;
	}
});
//自定义右键菜单
communityEditApp.directive('ngRightClick', function($parse) {  
    return function(scope, element, attrs) {  
        var fn = $parse(attrs.ngRightClick);  
        element.bind('contextmenu', function(event) {  
            scope.$apply(function() {  
                event.preventDefault();  
                fn(scope, {$event:event});  
            });  
        });  
    };  
});
//元素指令，是否渲染完成
communityEditApp.directive('isOver',function(){
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
//控制器
communityEditApp.controller("editctrl", function($scope, $http,$filter) {
	scope=$scope;
//	样式（两版通用）
	$scope.styles=styles;
//	住宅（第二版选择性可用）
	$scope.buildings = buildings;
//	商铺（第二版选择性可用）
	$scope.layers = layers;
//	马路
	$scope.roads;
	$scope.roadShow=[];
//	第二版整体数据
	var defaultStyle={"id":0,"styleName":"未知","imageUrl":null,"applyTypes":1,"imageWidth":126,"imageHeight":145,"labelImageUrl":null,"labelImageWidth":null,"labelImageHeight":null,"labelPositionY":0,"labelPositionX":63,"textDirection":null,"textColor":"000000","styleTypeId":6,"hotArea":null,"aniColumns":null,"aniMillisecond":null};
	//先格式化mapcontent，删除数据不完整的sprite
	for(var i=0;i<mapcontent.layers.length;i++){
		var newSprites=[];
		for(var j=0;j<mapcontent.layers[i].sprites.length;j++){
			var sprite=mapcontent.layers[i].sprites[j];
			if(sprite.styleList==null||sprite.styleList.length==0||sprite.styleList[0].style==null){
			}
			else{
				newSprites[newSprites.length]=sprite;
			}
		}
		mapcontent.layers[i].sprites=newSprites;
	}
	$scope.mapcontent = angular.copy(mapcontent);
//  未放置的图片
	$scope.nodropImg;
//	修改层数据的临时变量
	$scope.layerTemp={"name":"","minScale":0,"maxScale":0,"layer":"","zindex":0}
//	创建层数据的临时变量
	$scope.creatLayerTemp={"name":"","minScale":"","maxScale":"","zindex":"","maxZ":0,"minZ":0}
//	修改样式的临时变量
	$scope.changeStyleTemp={"urlTextShow":"","name":"","x":"","y":"","z":"","styleList":{},"maxScale":"","minScale":"","id":"","url":"","spriteType":""}
//	添加或者选择样式的临时变量
	$scope.chooseStyleTemp={"minScale":0,"maxScale":0,"style":[],"spirit":[],"type":""}
//	默认缩放比例的临时变量
	$scope.defaultZoom={"maxScale":0,"minScale":0}
//	右键菜单临时变量
	$scope.rightMenu;
	$scope.rightMenuLayerType;
//	热点区域的临时变量
	$scope.hotFouse={"scope":[]}
//	 层右键菜单的临时变量
	 $scope.coverageSelectedRow=$scope.mapcontent.layers.length-1;
	 $scope.coverageLayer=$scope.mapcontent.layers[$scope.coverageSelectedRow];;
	 $scope.spiritLayerSelect;
		var dragRow;
//		键盘对应的精灵临时变量
	$scope.keySpirit;
//	选中精灵时对应的框
	$scope.choosedSpiritId;
//	修改动画的临时变量
	$scope.animation;
//	选择层
	$scope.layerCheck=[];
//	复制黏贴的临时变量
	$scope.copySpirit;
//	前进一步临时变量
	$scope.forwardTemp=[];
//	撤销的临时变量
	$scope.replyTemp=[];
//	暂未放置的临时变量
	$scope.nodropImg=nodropImg;
//	下一步的临时变量
	$scope.forwardTemp=[];
	$scope.copyAni;
	$scope.spriteTypeName;
//	放大缩小
	$scope.changeNumber=1;
	$scope.toggle = {        
            now:false
        };
	if($scope.mapcontent.height<500){
		$scope.mapcontent.height=500;
	}
	if($scope.mapcontent.width<1000){
		$scope.mapcontent.width=1000;
	}
//	console.log($scope.mapcontent);
	for(i in $scope.mapcontent.layers){
		var layer={};
		layer['layerShow'] = true;
		$scope.layerCheck.push(layer);
	}
	var hasbuild=false;
	for(m in $scope.buildings){
		for(var i in $scope.mapcontent.layers){
			for(var j in $scope.mapcontent.layers[i].sprites){
				if($scope.mapcontent.layers[i].sprites[j].id==$scope.buildings[m].id){
					$scope.mapcontent.layers[i].sprites[j].name=$scope.buildings[m].buildingIndex+"栋";
				}
			}
		}
	}
	for(m in $scope.layers){
		for(var i in $scope.mapcontent.layers){
			for(var j in $scope.mapcontent.layers[i].sprites){
				if($scope.mapcontent.layers[i].sprites[j].id==$scope.layers[m].id){
					$scope.mapcontent.layers[i].sprites[j].name=$scope.layers[m].layerName;
					$scope.mapcontent.layers[i].sprites[j].shopUrl=$scope.layers[m].url;
				}
			}
		}
	}
	for(var i in $scope.mapcontent.layers){
		for(var j in $scope.mapcontent.layers[i].sprites){
			if($scope.mapcontent.layers[i].sprites[j].spriteType==1){
				for(m in $scope.buildings){
					if($scope.mapcontent.layers[i].sprites[j].id==$scope.buildings[m].id){
						hasbuild=true;
						break;
					}
					}
					if(hasbuild==false){
						$scope.mapcontent.layers[i].sprites.splice(j,1);
					}else{
						hasbuild=false;
					}
			}
			
		}
	}
	for(var i in $scope.mapcontent.layers){
		for(var j in $scope.mapcontent.layers[i].sprites){
			if($scope.mapcontent.layers[i].sprites[j].spriteType==2){
				for(m in $scope.layers){
				if($scope.mapcontent.layers[i].sprites[j].id==$scope.layers[m].id){
					hasbuild=true;
					break;
				}
				}
				if(hasbuild==false){
					$scope.mapcontent.layers[i].sprites.splice(j,1);
				}else{
					hasbuild=false;
				}
			}
		}
	}
	$(".arena").css("width",$scope.mapcontent.width+"px");
	$(".arena").css("height",$scope.mapcontent.height+"px");
	
//	alert();
//	监听渲染完成后的事件
$scope.$watch('toggle.now',function(){
if($scope.toggle.now){
	for(var i in $scope.mapcontent.layers){
		for(var j in $scope.mapcontent.layers[i].sprites){
			for(m in $scope.mapcontent.layers[i].sprites[j].styleList){
				vartemp={};
				vartemp.id="#spirit"+$scope.mapcontent.layers[i].sprites[j].id;
				vartemp.interval=-1;
				vartemp.type="styles";
				vartemp.num=m;
				allInterval.push(vartemp);
			}
			for(m in $scope.mapcontent.layers[i].sprites[j].animations){
				var vartemp={};
				vartemp.id="#spirit"+$scope.mapcontent.layers[i].sprites[j].id+"_animate"+m;
				vartemp.interval=-1;
				vartemp.type="animation";
				vartemp.num=m;
				allInterval.push(vartemp);
				var vartemp1={};
				vartemp1.id="#spirit"+$scope.mapcontent.layers[i].sprites[j].id+"_animates"+m;
				vartemp1.interval=-1;
				vartemp1.type="animations";
				vartemp1.num=m;
				allInterval.push(vartemp1);
				if($scope.mapcontent.layers[i].sprites[j].animations[m].aniColumns==undefined){
					$scope.mapcontent.layers[i].sprites[j].animations[m].aniColumns=null;
				}
				if($scope.mapcontent.layers[i].sprites[j].animations[m].aniMillisecond==undefined){
					$scope.mapcontent.layers[i].sprites[j].animations[m].aniMillisecond=null;
				}
			}
		}
		}
	
	$('.tab').udraggable({
		handle: '#tabs',
		containment: [0,0,$scope.mapcontent.width,$scope.mapcontent.height],
			 drag: function (e, ui) {
			      var pos = ui.position;
			      if(parseInt($(this).css("width"))+pos.left>=$scope.mapcontent.width){
			    	  pos.left=$scope.mapcontent.width-($(this).css("width"));
			     }
			      if(parseInt($(this).css("height"))+pos.top>=$scope.mapcontent.height){
			    	  pos.top=$scope.mapcontent.height-parseInt($(this).css("height"));
			      }
			      if(pos.left<=0){
			    	  pos.left=0;
			     }
			      if(pos.top<=0){
			    	  pos.top=0;
			      }
			    }
	});
	var canDrag=true;
	$('.animation').udraggable({
		 stop: function (e, ui) {
			 var pos = ui.position;
			  for(var i in $scope.mapcontent.layers){
			  		for(var j in $scope.mapcontent.layers[i].sprites){
			  			if($scope.mapcontent.layers[i].sprites[j].id==$(this).attr("natureId")
			  					&&$scope.mapcontent.layers[i].sprites[j].spriteType==$(this).attr("spriteType")
			  					){
//			  				console.log($scope.mapcontent.layers[i].sprites[j].animations[$(this).attr("animaIndex")]);
			  				$scope.mapcontent.layers[i].sprites[j].animations[$(this).attr("animaIndex")].x=pos.left;
			  				$scope.mapcontent.layers[i].sprites[j].animations[$(this).attr("animaIndex")].y=pos.top;
			  				$scope.mapcontent.layers[i].sprites[j].modified=true;
			  			}
			  		}
			  	}	
		 }
	});
	$scope.spritesDrag();
	
	for(var i in $scope.mapcontent.layers){
		for(var j in $scope.mapcontent.layers[i].sprites){
			if($scope.mapcontent.layers[i].sprites[j].spriteType==8){
				$scope.roadShow.push($scope.mapcontent.layers[i].sprites[j]);
			}
		}
	}
}
});

$scope.editLayerOk=function(){
	
	$('.editLayer').css("display","none");
	$scope.operateBuffer();
}
$scope.editLayerClose=function(){
	$('.editLayer').css("display","none");
}
//上传道路图片（兼容原生js获取到数据）
$scope.rouadUpLoad = function() {
	$scope.roads = raodtemp;
	var layer={};
	var spirit={};
	if($scope.mapcontent.layers[0]==undefined){
		$scope.creatLayer(layer,1,"道路",1000,0,0,spirit);
		$scope.mapcontent.layers.push(layer);
	}
	$scope.mapcontent.layers[0].sprites=[];
	for(var i in $scope.roads){
		$scope.roads[i].minScale=0;
		$scope.roads[i].maxScale=1000000;
		$scope.mapcontent.layers[0].sprites.push($scope.roads[i]);
		$scope.mapcontent.width=$scope.roads[i].x+$scope.roads[i].styleList[0].style.imageWidth;
		$scope.mapcontent.height=$scope.roads[i].y+$scope.roads[i].styleList[0].style.imageHeight;
	}
	$scope.mapcontent.layers[0].id=1;
	$(".arena").css("width",$scope.mapcontent.width+"px");
	$(".arena").css("height",$scope.mapcontent.height+"px");
	$("#roadUpLoad").css("display","none");
	$scope.$apply();
	$scope.operateBuffer();
}
$scope.getEditStyle=function(spirit){
	return {
		position: 'absolute',
		top: spirit.y + 'px',
		left: spirit.x + 'px',
		"z-index": spirit.zindex,
//		"background-image": "url(" + spirit.styleList[0].style.imageUrl + ")",
		"width": spirit.styleList[0].style.imageWidth + "px",
		"height": spirit.styleList[0].style.imageHeight + "px",
		"background-size": "100% 100%",
		"overflow":"hidden"
	};
}
$scope.getStyle=function(spirit){
	if(spirit.styleList[0].style.aniColumns>=1){
		return {
			position: 'absolute',
			"background-image": "url(" + spirit.styleList[0].style.imageUrl + ")",
			"width": spirit.styleList[0].style.imageWidth*spirit.styleList[0].style.aniColumns + "px",
			"height": spirit.styleList[0].style.imageHeight + "px",
			"background-size": "100% 100%"
		};
	}
	return {
		position: 'absolute',
		top: '0px',
		left: '0px',
		"background-image": "url(" + spirit.styleList[0].style.imageUrl + ")",
		"width": spirit.styleList[0].style.imageWidth + "px",
		"height": spirit.styleList[0].style.imageHeight + "px",
		"background-size": "100% 100%"
	};
}
$scope.getLayerStyle=function(layer){
	return {
		position: 'absolute',
		"z-index": layer.zindex
	};
}
$scope.winIconStyle=function(spirit){
	var widthTemp;
	if(spirit.aniColumns>1){
		widthTemp=spirit.aniColumns;
	}else{
		widthTemp=1;
	}
	return {
		"background-image": "url(" + spirit.imageUrl + ")",
		"background-size":  100*widthTemp+"% 100%"
	};
}
$scope.winStyle=function(spirit){
	var widthTemp;
	
	if(spirit!=undefined){
		if(spirit.aniColumns!=undefined&&spirit.aniColumns>1){
			widthTemp=spirit.aniColumns;
		}else{
			widthTemp=1;
		}
		$('.animation').udraggable({
			 stop: function (e, ui) {
				 var pos = ui.position;
				  for(var i in $scope.mapcontent.layers){
				  		for(var j in $scope.mapcontent.layers[i].sprites){
				  			if($scope.mapcontent.layers[i].sprites[j].id==$(this).attr("natureId")
				  				&&$scope.mapcontent.layers[i].sprites[j].spriteType==$(this).attr("spriteType")
				  					){
//				  				console.log($scope.mapcontent.layers[i].sprites[j].animations[$(this).attr("animaIndex")]);
				  				$scope.mapcontent.layers[i].sprites[j].animations[$(this).attr("animaIndex")].x=pos.left;
				  				$scope.mapcontent.layers[i].sprites[j].animations[$(this).attr("animaIndex")].y=pos.top;
				  				$scope.mapcontent.layers[i].sprites[j].modified=true;
				  			}
				  		}
				  	}	
				 
			 }
		});
		$(".animTable").css("top",spirit.imageHeight+50 + "px");
		return {
			position: 'absolute',
			"width": spirit.imageWidth + "px",
			"height":spirit.imageHeight + "px",
			"background-image": "url(" + spirit.imageUrl + ")",
			"background-size": 100*widthTemp+"% 100%"
		};
		
	}
	return{}
}
$scope.aniStyle=function(spirit){

		return {
			'position': 'absolute',
			"top":spirit.y,
			"left":spirit.x,
			"width": spirit.imageWidth + "px",
			"height":spirit.imageHeight + "px",
			"overflow":"hidden"
		};
}
$scope.aniAllStyle=function(spirit){
	if(spirit.aniColumns==""||spirit.aniColumns==null||undefined==spirit.aniColumns){
		spirit.aniColumns=1;
	}
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
$scope.getIconStyle=function(spirit){
	var widthTemp;
	if(spirit.aniColumns>1){
		widthTemp=spirit.aniColumns;
	}else{
		widthTemp=1;
	}
	if(spirit.applyTypes==undefined&&spirit.spriteType==undefined){
		for(var i in $scope.mapcontent.layers){
			for(var j in $scope.mapcontent.layers[i].sprites){
				if($scope.mapcontent.layers[i].sprites[j].id==spirit.id){
					return {
						"background-image": "url(" + $scope.mapcontent.layers[i].sprites[j].styleList[0].style.imageUrl + ")",
						"background-size": 100*widthTemp+"% 100%"
					};
				}
			}
		}
	}else if (spirit.applyTypes==4||spirit.applyTypes==8||spirit.applyTypes>=16) {
			return {
			"background-image": "url(" + spirit.imageUrl + ")",
			"background-size":  100*widthTemp+"% 100%"
		};
	}
	return {
		"background-image": "url(" + $scope.nodropImg + ")",
		"background-size": 100*widthTemp+"% 100%"
	};
}
$scope.changelayer=function(layerProperty){
	if(layerProperty==undefined){
		alert("sorry,您未选中层，无法进行设置");
	}else{
		$scope.layerTemp.name=layerProperty.name;
		$scope.layerTemp.minScale=layerProperty.minScale;
		$scope.layerTemp.maxScale=layerProperty.maxScale;
		$scope.layerTemp.layer=layerProperty;
		$scope.layerTemp.zindex=layerProperty.zindex;
		$(".modifyLayer").css("display","block");
		$('.modifyLayer .windowChange').udraggable(
				{
					handle:      '.winTitle'
				}
		);
		$("#modifyLayer").css("top",(parseInt($("body").css("height"))-parseInt($("#modifyLayer").css("height")))/2);
		$("body").css("overflow","hidden");
	}
}
$scope.layerChangeok=function(layerProperty){
	layerProperty.name=$scope.layerTemp.name;
	layerProperty.minScale=$scope.layerTemp.minScale;
	layerProperty.maxScale=$scope.layerTemp.maxScale;
	layerProperty.zindex=$scope.layerTemp.zindex;
	$(".modifyLayer").css("display","none");
	$("body").css("overflow","auto");
	$scope.operateBuffer();
}
$scope.creatlayerWin=function(){
	var id=0;
	var maxZ=0;
	var minZ=0;
	for(i in $scope.mapcontent.layers){
		if($scope.mapcontent.layers[i].id>id){
			id=$scope.mapcontent.layers[i].id;
		}
		if($scope.mapcontent.layers[i].zindex>maxZ){
			maxZ=$scope.mapcontent.layers[i].zindex;
		}
		if($scope.mapcontent.layers[i].zindex<minZ){
			minZ=$scope.mapcontent.layers[i].zindex;
		}
	}
	if(id<3){id=3;}
	id+=1;
	$scope.creatLayerTemp={"name":"新建层-"+id,"minScale":0,"maxScale":1,"zindex":maxZ+1,"maxZ":maxZ,"minZ":minZ};
	$(".creatLayer").css("display","block");
	$('.creatLayer .windowChange').udraggable(
			{
				handle:      '.winTitle'
			}
	);
	$("#creatLayer").css("top",(parseInt($("body").css("height"))-parseInt($("#modifyLayer").css("height")))/2);
	$("body").css("overflow","hidden");
}
$scope.creatLayerok=function(){
	var id=0;
	for(i in $scope.mapcontent.layers){
		if($scope.mapcontent.layers[i].id>id){
			id=$scope.mapcontent.layers[i].id;
		}
	}
	if(id<3){id=3;}
	id+=1;
	var layer={};
	var spirit={};
	$scope.creatLayer(layer,id,$scope.creatLayerTemp.name,$scope.creatLayerTemp.maxScale,$scope.creatLayerTemp.minScale,$scope.creatLayerTemp.zindex,spirit);
	layer.sprites=[];
	$scope.mapcontent.layers.push(layer);
//	console.log($scope.mapcontent.layers.length-1);
	$scope.coverageSelectedRow=$scope.mapcontent.layers.length-1;
	$scope.coverageLayer=$scope.mapcontent.layers[$scope.mapcontent.layers.length-1];
	$(".creatLayer").css("display","none");
	$("body").css("overflow","auto");
	$scope.operateBuffer();
}
$scope.delLayerTip=function(layerProperty){
	if(layerProperty==undefined){
		alert("sorry，无法删除，请先选中层");
	}else{
		$scope.layerTemp.layer=layerProperty;
		$scope.layerTemp.name=layerProperty.name;
		$(".deleteLayer").css("display","block");
		$('.deleteLayer .windowChange').udraggable(
				{
					handle:      '.winTitle'
				}
		);
		$("#deleteLayer").css("top",(parseInt($("body").css("height"))-parseInt($("#modifyLayer").css("height")))/2);
		$("body").css("overflow","hidden");
	}
}
$scope.deleteLayer=function(layerProperty){
	for(i in $scope.mapcontent.layers){
		if($scope.mapcontent.layers[i].id==layerProperty.id){
			$scope.mapcontent.layers.splice(i,1);
			$scope.layerCheck.splice(i,1);
			$scope.coverageSelectedRow=$scope.mapcontent.layers.length-1;
			$scope.coverageLayer=$scope.mapcontent.layers[$scope.mapcontent.layers.length-1];
		}
	}
	$(".deleteLayer").css("display","none");
	$("body").css("overflow","auto");
	$scope.operateBuffer();
}
$scope.setCoordinate=function(){
	$(".sceneSetting").css("display","none");
	$(".tab").css("opacity","0");
	$(".tab").css("z-index","0");
	$("body").css("overflow","auto");
	$(".setCoordinate").css("width",$scope.mapcontent.width+"px");
	$(".setCoordinate").css("height",$scope.mapcontent.height+"px");
	$(".setCoordinate").css("display","block");
	$("#imgCenterPos").css("visibility","hidden");
	$("#imgCenterAbs").css("visibility","hidden");
}
$scope.setCoordinateOk=function($event){
	$scope.mapcontent.defaultX=$event.offsetX;
	$scope.mapcontent.defaultY=$event.offsetY;
	$("#imgCenterAbs").css("visibility","hidden");
	$("#imgCenterPos").css("visibility","visible");
	$(".setCoordinate").css("display","none");
}

$scope.findCenterPos=function($event){
	$(".sceneSetting").css("display","none");
	$("body").css("overflow","auto");
	
	document.body.scrollLeft=$scope.mapcontent.defaultX-document.body.clientWidth/2;
	document.body.scrollTop=$scope.mapcontent.defaultY-document.body.clientHeight/2;
}

$scope.changeStyle=function(spirit,layer){
	$scope.changeStyleTemp.urlTextShow="";
	$scope.changeStyleTemp.name=spirit.name;
	$scope.changeStyleTemp.id=spirit.id;
	$scope.changeStyleTemp.x=spirit.x;
	$scope.changeStyleTemp.y=spirit.y;
	$scope.changeStyleTemp.url=spirit.shopUrl;
	$scope.spriteTypeName="添加"+layer.name+"样式";
	document.getElementById("jupiterUrl").value="";
	if(spirit.url!=null){
		$scope.changeStyleTemp.urlTextShow=spirit.url.substring(spirit.url.lastIndexOf("#")+1);
		$scope.changeStyleTemp.url=spirit.url;
	}else{
		$scope.changeStyleTemp.urlTextShow="";
	}
	if(spirit.spriteType!=32&&spirit.spriteType!=64){
		$scope.changeStyleTemp.urlTextShow=spirit.shopUrl;
	}
	$scope.changeStyleTemp.spriteType=spirit.spriteType;
	spriteType=spirit.spriteType;
	$scope.changeStyleTemp.z=spirit.zindex;
	var minZ=spirit.zindex-3;
	if(spirit.zindex-3<layer.zindex){
		minZ=layer.zindex;
	}
	$('#form_z').slider({  
		 min:minZ,
		 max:$scope.changeStyleTemp.z+3,
		 value:$scope.changeStyleTemp.z,
		 onChange:function(newvalue,oldvalue){
			 $scope.changeStyleTemp.z=newvalue;
		 }
	}); 
	var temp=0;
	for(i in styles){
		if(styles[i].applyTypes==spirit.spriteType){
			if(styles[i].id==spirit.styleList[0].style.id){
				break;
			}
			temp+=1;
		}
	}
	$scope.selectedRow=temp;
	$scope.changeStyleTemp.styleList=angular.copy(spirit.styleList);
	$scope.changeStyleTemp.maxScale=spirit.maxScale;
	$scope.changeStyleTemp.minScale=spirit.minScale;
	$scope.changeStyleTemp.spirit=spirit;
	$scope.copyAni=$scope.changeStyleTemp.spirit.animations;
	/*$("#styleChange").css("display","block");*/
	$(".maskLayer").css("opacity",1);
	$('.maskLayer .windowChange').udraggable(
			{
				handle:      '.winTitle'
			}
	);
	$(".maskLayer").css("z-index",8999);
	$("#styleChange").css("z-index",8999);
	$("#styleChange").css("top",(parseInt($("body").css("height"))-parseInt($("#styleChange").css("height")))/2);
	$("body").css("overflow","hidden");
}
//选择窗口中样式选择时和input中的数据双向绑定
$scope.selectStyle=function(selectStyle,row){
	$scope.changeStyleTemp.style=selectStyle;
	$scope.chooseStyleTemp.style=selectStyle;
	$scope.borderWhite="#000";
	$scope.selectedRow = row;
};
$scope.chooseStyle=function(styleOld,type){
	var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
	var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
	if(type==2){
		$scope.chooseStyleTemp.minScale=styleOld.minScale;
		$scope.chooseStyleTemp.maxScale=styleOld.maxScale;
		$scope.chooseStyleTemp.style=styleOld.style;
		$scope.chooseStyleTemp.spirit=styleOld;
		$scope.chooseStyleTemp.type=type;
	}
	if(type==1){
		$scope.selectedRow = 0;
		$scope.chooseStyleTemp.type=type;
		for (i in $scope.styles) {
			if ($scope.styles[i].applyTypes == $scope.changeStyleTemp.spirit.spriteType) {
				$scope.chooseStyleTemp.style=$scope.styles[i];
				break;
			}
		}
	}
	$(".changeStyleLayer").css("left",scrollX+200+"px");
	$(".changeStyleLayer").css("top",scrollY+200+"px");
	$(".changeStyleLayer").css("display","block");
	$('.changeStyleLayer').udraggable(
			{
				handle:      '.winTitle'
			}
	);
}
$scope.changeStyleLayerok=function(spirit){
	if($scope.chooseStyleTemp.type==MapLayerType.TYPE_SHOPS){
		spirit.minScale=$scope.chooseStyleTemp.minScale;
		spirit.maxScale=$scope.chooseStyleTemp.maxScale;
		spirit.style=$scope.chooseStyleTemp.style;
	}
	if($scope.chooseStyleTemp.type==MapLayerType.TYPE_BUILDING){
    	var img={};
    	img.minScale=$scope.chooseStyleTemp.minScale;
    	img.maxScale=$scope.chooseStyleTemp.maxScale;
    	img.style=$scope.chooseStyleTemp.style;
    	$scope.changeStyleTemp.styleList.push(img);
    }
	$(".changeStyleLayer").hide();
}
$scope.deleteStyle=function(index){
	$scope.changeStyleTemp.styleList.splice(index,1);
}
$scope.changeStyleLayerClose=function(){
	$(".changeStyleLayer").hide();
}
$scope.windowChangeok=function(spirit){
	spirit.x=$scope.changeStyleTemp.x;
	spirit.y=$scope.changeStyleTemp.y;
	
	if($scope.changeStyleTemp.spriteType==32||$scope.changeStyleTemp.spriteType==MapLayerType.TYPE_BUTTON){
		if(document.getElementById("jupiterUrl").value!=""){
			spirit.url=document.getElementById("jupiterUrl").value;
			if(spirit.url.lastIndexOf("#")!=-1){
				spirit.url=spirit.url.substring(0,spirit.url.lastIndexOf("#"));
			}
			spirit.url+="#"+document.getElementById("jupiterUrlDisp").value;
		}
	else if(spirit.url!=null&&document.getElementById("jupiterUrl").value!=""){
			
		}else{
			 
			 spirit.url=null;
		}
	}else{
		spirit.url=$scope.changeStyleTemp.urlTextShow;
	}
	$scope.changeStyleTemp.urlTextShow=null;
	spirit.name=$scope.changeStyleTemp.name;
	spirit.zindex=$scope.changeStyleTemp.z;
	spirit.styleList=$scope.changeStyleTemp.styleList;
	spirit.maxScale=$scope.changeStyleTemp.maxScale;
	spirit.minScale=$scope.changeStyleTemp.minScale;
    spirit.animations=$scope.copyAni;
    spirit.modified=true;
    $scope.spritesDrag();
    
	$(".maskLayer").css("opacity",0);
	$(".maskLayer").css("z-index",0);
	$(".changeStyleLayer").css("display","none");
	$("#animationModel").css("display","none");
	$('.animation').udraggable({
		 stop: function (e, ui) {
			 var pos = ui.position;
//			 console.log(pos);
//			 console.log($(this).attr("natureId"));
//			 console.log($(this).attr("animaIndex"));
			  for(var i in $scope.mapcontent.layers){
			  		for(var j in $scope.mapcontent.layers[i].sprites){
			  			if($scope.mapcontent.layers[i].sprites[j].id==$(this).attr("natureId")
							&&$scope.mapcontent.layers[i].sprites[j].spriteType==$(this).attr("spriteType")	  					
			  					){
//			  				console.log($scope.mapcontent.layers[i].sprites[j].animations[$(this).attr("animaIndex")]);
			  				$scope.mapcontent.layers[i].sprites[j].animations[$(this).attr("animaIndex")].x=pos.left;
			  				$scope.mapcontent.layers[i].sprites[j].animations[$(this).attr("animaIndex")].y=pos.top;
			  				$scope.mapcontent.layers[i].sprites[j].modified=true;
			  			}
			  		}
			  	}	
		 }
	});
	$("body").css("overflow","auto");
	$scope.operateBuffer();
	
}
//显示右键菜单
$scope.showRightMenu=function(spirit,layerType){
	if(spirit.spriteType!=8||layerType.id!=1){
		$scope.choosedSpiritId=spirit.id;
		$scope.keySpirit=spirit;
		var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
	    var scrollY = document.documentElement.scrollTop || document.body.scrollTop; 
		var e=window.event
		$("#menu").css("left",e.clientX+scrollX+"px");
		$("#menu").css("top",e.clientY+scrollY+"px");
		$("#menu").show();
		$scope.rightMenu=spirit;
		$scope.rightMenuLayerType=layerType;
	}else{
		$scope.choosedSpiritId=undefined;
		$scope.keySpirit=undefined;
		$("#menu").hide();
	}
}
$scope.zadd=function(){
	$scope.rightMenu.zindex+=1;
	$("#menu").slideUp();
	$scope.operateBuffer();
}
$scope.zreduce=function(){
	if($scope.rightMenu.zindex-1<$scope.rightMenuLayerType.zindex){
		alert("sorry 已经是最底层了");
	}else{
		$scope.rightMenu.zindex-=1;
	}
	$("#menu").slideUp();
	$scope.operateBuffer();
}
$scope.delHouse=function(){
	for(i in $scope.rightMenuLayerType.sprites){
		if($scope.rightMenuLayerType.sprites[i].id==$scope.rightMenu.id){
			$scope.rightMenuLayerType.sprites.splice(i,1);
		}
	}
	$("#menu").slideUp();
	$scope.operateBuffer();
}
$scope.showCoverageMenu=function(layer,row){
	$scope.coverageSelectedRow=row;
	 $scope.coverageLayer=layer;
	var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
    var scrollY = document.documentElement.scrollTop || document.body.scrollTop; 
	var e=window.event
	$("#coverageMenu").css("left",e.clientX+scrollX+"px");
	$("#coverageMenu").css("top",e.clientY+scrollY+"px");
	$("#coverageMenu").show();
}
$scope.selectCoverage=function(layer,row){
	$scope.coverageSelectedRow=row;
	$scope.coverageLayer=layer;
	$("#coverageMenu").hide();
}
var AnimationIndex;
$scope.delAnimation=function(index,animation){
	 $scope.copyAni.splice(index,1);
	
}
$scope.addAnimation=function(animation,index){
//	新增的样式
	AnimationIndex=index;
	previewValue=$scope.changeStyleTemp.spirit;
	$("#win_animation").attr("src","../../../html/scene_editor2/animation.html");
	$("#animationModel").css("display","block");
	$("#animationModel").css("position","fixed");
	$("#animationModel").css("left",200+"px");
	$("#animationModel").css("top",200+"px");
	previewValue=$scope.changeStyleTemp.spirit;
	$scope.animation=animation;
	anima=animation;
	$('#animationModel').udraggable(
			{
				handle:      '.winTitle'
			}
	);
}
changeAni=false;
$scope.aniUpLoad=function(){
	window.frames['win_animation'].uploadAniImage();
	window.frames['win_animation'].returnValue();
    $scope.copyAni=angular.copy($scope.changeStyleTemp.spirit.animations);
	if(window.frames['win_animation'].status==true||window.frames['win_animation'].status=="true"){
		if($scope.copyAni==null){
			$scope.copyAni=[];
			$scope.copyAni.push(window.frames['win_animation'].upLoadProperty);
		}else if(AnimationIndex==null){
			$scope.copyAni.push(window.frames['win_animation'].upLoadProperty);
		}else{
			$scope.copyAni[AnimationIndex]=window.frames['win_animation'].upLoadProperty;
		
		}
		$("#animationModel").hide();
		changeAni=true;
		}
//	$scope.aniUpLoad();
}
//放置后的回调函数
	$scope.onDrop = function($event, $data) {
		var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
        var scrollY = document.documentElement.scrollTop || document.body.scrollTop; 
        x=$event.originalEvent.clientX+scrollX;
        y=$event.originalEvent.clientY+scrollY;
        var check=0;
        var id=0;
        var hasLayer=false;
        //$data为拖放的数据，$data.buildingIndex不为空时是楼栋，$data.layerName不为空时是商铺
       if($data.buildingIndex!=undefined||$data.layerName!=undefined){
        	var spiritIsNew=true;
        	var layerIsNew=true;
        	var zindex=0;
        	if($scope.coverageSelectedRow==-1){
        		$scope.coverageSelectedRow=$scope.mapcontent.layers.length-1;
        	}
        	check=$scope.coverageSelectedRow;
        	if($scope.mapcontent.layers[$scope.coverageSelectedRow].id==1||$scope.mapcontent.layers[$scope.coverageSelectedRow].id==3){
    			
    			for(i in $scope.mapcontent.layers){
        			check=i;
        		}
    			for(i in $scope.layerCheck){
    				if($scope.mapcontent.layers[check].id==1||$scope.mapcontent.layers[check].id==3){
    					check--;
//    					console.log(check);
    				}else{
    					break;
    				}
    				}
    		}else{
    			check=$scope.coverageSelectedRow;
    			$scope.coverageLayer=$scope.mapcontent.layers[check];
    		}
    		if(check!=-1){
    			$scope.layerCheck[check].layerShow=true;
    		}
        	for(var i in $scope.mapcontent.layers){
        		for(var j in $scope.mapcontent.layers[i].sprites){
        			if($scope.mapcontent.layers[i].sprites[j].spriteType==MapLayerType.TYPE_BUILDING||$scope.mapcontent.layers[i].sprites[j].spriteType==MapLayerType.TYPE_SHOPS){
        				if($scope.mapcontent.layers[i].sprites[j].zindex>zindex){
            				zindex=$scope.mapcontent.layers[i].sprites[j].zindex;
            			}
        			}
//        			精灵存在并且为原来层时移动到当前位置
        			if($scope.mapcontent.layers[i].sprites[j].id==$data.id&&check!=-1&&i==check){
        				spiritIsNew=false;
        				layerIsNew=false;
//        				console.log($scope.mapcontent.layers[i]);
        				$scope.mapcontent.layers[i].sprites[j].x=x-100;
        				$scope.mapcontent.layers[i].sprites[j].y=y-100;
        				$scope.coverageSelectedRow=i;
        				$scope.coverageLayer=$scope.mapcontent.layers[i];
//        				将存在的对象移动到相对应的位置
        			}
//        			精灵存在但不为原来层时移动到新的层中
        			else if($scope.mapcontent.layers[i].sprites[j].id==$data.id&&check!=-1&&i!=check){
        				spiritIsNew=false;
        				layerIsNew=false;
//        				console.log(check);
        				$scope.mapcontent.layers[i].sprites.splice(j,1);
        				var spirit={};
        				if($data.buildingIndex!=undefined){
            				$scope.addSpirit(spirit,$data.id,$data.appearance,$data.buildingIndex+"栋",1000,6,0,1,$data,MapLayerType.TYPE_BUILDING,null);
            			}
            			if($data.layerName!=undefined){
            				$scope.addSpirit(spirit,$data.id,$data.appearance,$data.layerName,1000,6,0,1,$data,MapLayerType.TYPE_SHOPS,$data.url);
            			}
            			$scope.coverageSelectedRow=check;
            			$scope.coverageLayer=$scope.mapcontent.layers[check];
            			$scope.mapcontent.layers[check].sprites.push(spirit);
            		}else  if($scope.mapcontent.layers[i].sprites[j].id==$data.id&&check==-1){
        				spiritIsNew=false;
        				layerIsNew=false;
        				$scope.mapcontent.layers[i].sprites.splice(j,1);
        				var layer={};
//            			zindex根据最大值+1
            			var spirit={};
            			if($data.buildingIndex!=undefined){
            				$scope.addSpirit(spirit,$data.id,$data.appearance,$data.buildingIndex+"栋",1000,6,0,1,$data,MapLayerType.TYPE_BUILDING,null);
            			}
            			if($data.layerName!=undefined){
            				$scope.addSpirit(spirit,$data.id,$data.appearance,$data.layerName,1000,6,0,1,$data,MapLayerType.TYPE_SHOPS,$data.url);
            			}
            			$scope.creatLayer(layer,2,"房屋",6,0,1000,spirit);
            			$scope.mapcontent.layers.push(layer);
            			for(i in $scope.mapcontent.layers){
            				$scope.coverageSelectedRow=i;
            				$scope.coverageLayer=$scope.mapcontent.layers[i];
            			}
        			}
        		}
        	}
        	zindex=parseInt(zindex)+1;
//        	精灵为新建的
        	if(spiritIsNew==true){
//        		精灵没有新建属于它的层，需要创建房屋层
        		if(check==-1){
        			for(var i in $scope.mapcontent.layers){
            			if($scope.mapcontent.layers[i].id==2){
            				layerIsNew=false;
            				var spirit={};
            				if($data.buildingIndex!=undefined){
                				$scope.addSpirit(spirit,$data.id,$data.appearance,$data.buildingIndex+"栋",1000,6,0,1,$data,MapLayerType.TYPE_BUILDING,null);
                			}
                			if($data.layerName!=undefined){
                				$scope.addSpirit(spirit,$data.id,$data.appearance,$data.layerName,1000,6,0,1,$data,MapLayerType.TYPE_SHOPS,$data.url);
                			}
                			$scope.mapcontent.layers[i].sprites.push(spirit);
                			$scope.coverageSelectedRow=i;
                			$scope.coverageLayer=$scope.mapcontent.layers[i];
           			}
            		}
        		}
//        		精灵有可放置它的层，放置到对应的层上
        		if(check!=-1){
        			var spirit={};
        			if($data.buildingIndex!=undefined){
        				$scope.addSpirit(spirit,$data.id,$data.appearance,$data.buildingIndex+"栋",1000,6,0,1,$data,MapLayerType.TYPE_BUILDING,null);
        			}
        			if($data.layerName!=undefined){
        				$scope.addSpirit(spirit,$data.id,$data.appearance,$data.layerName,1000,6,0,1,$data,MapLayerType.TYPE_SHOPS,$data.url);
        			}
        			$scope.mapcontent.layers[check].sprites.push(spirit);
        			$scope.coverageSelectedRow=check;
        			$scope.coverageLayer=$scope.mapcontent.layers[check];
        			layerIsNew=false;
        		}
//        		需要新建方房屋层
        		if(layerIsNew==true){
        			var layer={};
//        			zindex根据最大值+1
        			var spirit={};
        			if($data.buildingIndex!=undefined){
        				$scope.addSpirit(spirit,$data.id,$data.appearance,$data.buildingIndex+"栋",1000,6,0,1,$data,MapLayerType.TYPE_BUILDING,null);
        				
        			}
        			if($data.layerName!=undefined){
        				
        				$scope.addSpirit(spirit,$data.id,$data.appearance,$data.layerName,1000,6,0,1,$data,MapLayerType.TYPE_SHOPS,$data.url);
        			}
        			$scope.creatLayer(layer,2,"房屋",6,0,1000,spirit);
        			$scope.mapcontent.layers.push(layer);
        			for(i in $scope.mapcontent.layers){
        				$scope.coverageSelectedRow=i;
        				$scope.coverageLayer=$scope.mapcontent.layers[i];
        			}
        		}
        	}
        	
        }else if($data.applyTypes!=MapLayerType.TYPE_BUILDING&&$data.applyTypes!=MapLayerType.TYPE_SHOPS){
        	var zindex=500;
        	var layerIsNew=true;
        	var id=10000;
        	var hasLayer=false;
        	if($scope.coverageSelectedRow==-1){
        		$scope.coverageSelectedRow=$scope.mapcontent.layers.length-1;
        		
				$scope.coverageLayer=$scope.mapcontent.layers[$scope.mapcontent.layers.length-1];
        	}
        	for(i in $scope.mapcontent.layers){
    			check=i;
    		}
    		if($scope.mapcontent.layers[$scope.coverageSelectedRow].id==1||$scope.mapcontent.layers[$scope.coverageSelectedRow].id==2){
    			for(i in $scope.layerCheck){
    				if($scope.mapcontent.layers[check].id==1||$scope.mapcontent.layers[check].id==2){
    					check--;
    				}else{
    					break;
    				}
    				}
    		}else{
    			check=$scope.coverageSelectedRow;
    			$scope.coverageLayer=$scope.mapcontent.layers[check];
    		}
    		if(check!=-1&&$scope.mapcontent.layers[check].id!=3){
    			hasLayer=true;
    		}
        	for(var i in $scope.mapcontent.layers){
        		for(var j in $scope.mapcontent.layers[i].sprites){
        			if($scope.mapcontent.idSeq==null){
	        			if(id<=$scope.mapcontent.layers[i].sprites[j].id){
	        				id=$scope.mapcontent.layers[i].sprites[j].id;
	        			}
        			}
        			if($scope.mapcontent.layers[i].sprites[j].spriteType==4||$scope.mapcontent.layers[i].sprites[j].spriteType>=MapLayerType.TYPE_BULLETIN){
        				if($scope.mapcontent.layers[i].sprites[j].zindex>zindex){
            				zindex=$scope.mapcontent.layers[i].sprites[j].zindex;
            			}
        			}
        		}
        	}
        	zindex=parseInt(zindex)+1;
        	
        	if($scope.mapcontent.idSeq==null){
        		id++;//TODO 据说id++会有BUG，只有吴知道
        		$scope.mapcontent.idSeq=id;
        	}
        	else{
        		$scope.mapcontent.idSeq++;
        		id=$scope.mapcontent.idSeq;
        	}
        	
        	if(hasLayer==false){
        		for(var i in $scope.mapcontent.layers){
        			if($scope.mapcontent.layers[i].id==3){
        				layerIsNew=false;
        				var spirit={};
        				$scope.addSpirit(spirit,id,$data.id,$data.styleName,zindex,6,0,1,$data,$data.applyTypes,null);
            			$scope.mapcontent.layers[i].sprites.push(spirit);
            			$scope.coverageSelectedRow=i;
            			$scope.coverageLayer=$scope.mapcontent.layers[i];
            		}
        		}
        	}else{
        		layerIsNew=false;
				var spirit={};
				if(zindex<$scope.mapcontent.layers[check].zindex){
					zindex=$scope.mapcontent.layers[check].zindex
				}
    			$scope.addSpirit(spirit,id,$data.id,$data.styleName,zindex,6,0,1,$data,$data.applyTypes,null);
    			$scope.mapcontent.layers[check].sprites.push(spirit);
    			$scope.coverageSelectedRow=check;
    			$scope.coverageLayer=$scope.mapcontent.layers[check];
    		}
        	if(layerIsNew==true){
    			var layer={};
    			var spirit={};
    			$scope.addSpirit(spirit,id,$data.id,$data.styleName,zindex,6,0,1,$data,$data.applyTypes,null);
    			$scope.creatLayer(layer,3,"其他饰品",6,0,500,spirit);
    			$scope.mapcontent.layers.push(layer);
    			for(i in $scope.mapcontent.layers){
    				$scope.coverageSelectedRow=i;
    				$scope.coverageLayer=$scope.mapcontent.layers[i];
    			}
    		}
        }
        $scope.spritesDrag();
        $scope.operateBuffer();
	};
	$scope.changeDefault=function(){
		$scope.defaultZoom.maxScale=angular.copy($scope.mapcontent.maxScale);
		$scope.defaultZoom.minScale=angular.copy($scope.mapcontent.minScale);
		$scope.defaultZoom.defaultScale=angular.copy($scope.mapcontent.defaultScale);
		$("#defaultZoom").css("display","block");
		$("#defaultZoom").css("position","fixed");
		$("#defaultZoom").css("left",(document.body.clientWidth/2-200)+"px");
		$("#defaultZoom").css("top","200px");
		$('#defaultZoom').udraggable({
			handle:'.winTitle'
		});
	}
	$scope.changeDefaultOk=function(){
		$scope.mapcontent.maxScale=$scope.defaultZoom.maxScale;
		$scope.mapcontent.minScale=$scope.defaultZoom.minScale;
		$scope.mapcontent.defaultScale=$scope.defaultZoom.defaultScale;
		$("#defaultZoom").css("display","none");
	}
	$scope.creatLayer=function(layer,layerId,layername,maxScale,minScale,zindex,sprites){
		layer.id=layerId;
		layer.name=layername;
		layer.flag=0;
		layer.maxScale=maxScale;
		layer.minScale=minScale;
		layer.zindex=zindex;
		layer.sprites=[];
		layer.sprites.push(sprites);
		var layerCheck={};
		layerCheck['layerShow'] = true;
		$scope.layerCheck.push(layerCheck);
	}
	$scope.addSpirit=function(spirit,id,appearance,name,zindex,maxScale,minScale,sizePercent,$data,applyTypes,url){
		spirit.id=id;
		spirit.spriteType=applyTypes;
		spirit.maxScale=0;
		spirit.minScale=0;
		spirit.x=x-100;
		spirit.y=y-100;
		spirit.url=url;
		spirit.zindex=zindex;
		spirit.sizePercent=sizePercent;
		spirit.name=name;
		spirit.maxScale=10000;
		spirit.minScale=0;
		spirit.animations=null;
		spirit.modified=true;
		spirit.styleList=[];
		var styleTemp={};
		styleTemp.minScale=0;
		styleTemp.maxScale=100;
		if(applyTypes==MapLayerType.TYPE_BUILDING||applyTypes==MapLayerType.TYPE_SHOPS){
			var styleByType=null;
			var styleByName=null;
			for(style in $scope.styles){
				if(appearance==$scope.styles[style].id){
					styleTemp.style=$scope.styles[style];
				}
				if(appearance==0||styleTemp.style==undefined){
					if($scope.styles[style].applyTypes==applyTypes){
						if(styleByType==null){
							styleByType=$scope.styles[style];
							if(!$data.layerName){
								styleByName=styleByType;
							}
						}
					}
					if($scope.styles[style].styleName.indexOf($data.layerName)!=-1){
						styleByName=$scope.styles[style];
					}
					if(styleByType!=null&&styleByName!=null){
						break;
					}
				}
			}
			if(styleTemp.style==null){
				if(styleByName!=null){
					styleTemp.style=styleByName;	
				}
				else{
					styleTemp.style=styleByType;
				}
			}
		}else{
			styleTemp.style=$data;
		}
		spirit.styleList.push(styleTemp);
		
	}
	var layerNum;
	var mapScrollX;
	var mapScrollY;
//	获取坐标
	$scope.bodyClick=function($event){
		var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
        var scrollY = document.documentElement.scrollTop || document.body.scrollTop; 
		mapScrollX=$event.clientX+scrollX-100;
		mapScrollY=$event.clientY+scrollY-100;
	}
//	ctrl+c或者复制键
	$scope.copy=function(){
		$scope.copySpirit=$scope.keySpirit;
		for(var i in $scope.mapcontent.layers){
    		for(var j in $scope.mapcontent.layers[i].sprites){
    			if($scope.mapcontent.layers[i].sprites[j].id==$scope.keySpirit.id){
    				layerNum=i;
    			}
    		}
    	}
	}
	$scope.cut=function(){
		$scope.copySpirit=angular.copy($scope.keySpirit);
		for(var i in $scope.mapcontent.layers){
    		for(var j in $scope.mapcontent.layers[i].sprites){
    			if($scope.mapcontent.layers[i].sprites[j].id==$scope.keySpirit.id){
    				$scope.mapcontent.layers[i].sprites.splice(j,1);
    				layerNum=i;
    				
    			}
    		}
    	}
	}
	$scope.paste=function(){
		var zindex=500;
		var id=10000;
		if($scope.copySpirit!=undefined&&$scope.copySpirit.spriteType==4||$scope.copySpirit!=undefined&&$scope.copySpirit.spriteType>=16){
			for(var i in $scope.mapcontent.layers){
        		for(var j in $scope.mapcontent.layers[i].sprites){
        			if($scope.mapcontent.idSeq==null){
	        			if(id<=$scope.mapcontent.layers[i].sprites[j].id){
	        				id=$scope.mapcontent.layers[i].sprites[j].id;
	        			}
        			}
        			if($scope.mapcontent.layers[i].sprites[j].spriteType==4||$scope.mapcontent.layers[i].sprites[j].spriteType>=MapLayerType.TYPE_BULLETIN){
        				if($scope.mapcontent.layers[i].sprites[j].zindex>zindex){
            				zindex=$scope.mapcontent.layers[i].sprites[j].zindex;
            			}
        			}
        		}
        	}
        	zindex=parseInt(zindex)+1;
        	if($scope.mapcontent.idSeq==null){
        		id++; //TODO 据说有BUG
        		$scope.mapcontent.idSeq=id;
        	}
        	else{
        		id=(++$scope.mapcontent.idSeq);
        	}
        	var newSpirit=angular.copy($scope.copySpirit);
    		newSpirit.id=id;
    		newSpirit.zindex=zindex;
    		newSpirit.x=mapScrollX;
    		newSpirit.y=mapScrollY;
    		newSpirit.modified=true;
//    		console.log(mapScrollY);
    		$scope.mapcontent.layers[layerNum].sprites.push(newSpirit);
		}
		$scope.spritesDrag();
//		console.log(newSpirit);
	}
	var keyVal=null;
	$scope.keyUp=function($event){
		if($event.keyCode==17){
			 keyVal=null;
		}
	}
//	键盘上下左右的微调
	 $scope.keydown = function ($event) {
//  左37  上38 下40 右39
		
		 if($event.keyCode==13){
			 $scope.choosedSpiritId=undefined;
		     $scope.keySpirit=undefined;
		 }
        if($event.keyCode==17){
        	keyVal=17;
        }
//        ctrl+y
        if($event.keyCode==89&&keyVal==17){
        	$scope.forward();
        }
//        ctrl+z
        if($event.keyCode==90&&keyVal==17){
        	$scope.reply();
        }
//        ctrl+s
        if($event.keyCode==83&&keyVal==17){
        	$event.preventDefault();
        	$scope.doSave();
        }
         if($scope.keySpirit==undefined){
        }else{
        	if($event.keyCode==46){
        		for(var i in $scope.mapcontent.layers){
        			for(var j in $scope.mapcontent.layers[i].sprites){
        				if($scope.mapcontent.layers[i].sprites[j].id==$scope.keySpirit.id){
        					$scope.mapcontent.layers[i].sprites.splice(j,1);
        					$scope.forwBuffer();
        				}
        			}
        		}
        	}
        	 if($event.keyCode==37){
        		 $event.preventDefault();
        		 $scope.keySpirit.x-=1;
        		 $scope.forwBuffer();
        		 if( $scope.keySpirit.x<=0){
        			 $scope.keySpirit.x=0;
        		 }
        		 $scope.keySpirit.modified=true;
        	 }
        	 if($event.keyCode==38){
        		 $event.preventDefault();
        		 $scope.keySpirit.y-=1;
        		 $scope.forwBuffer();
        		 if( $scope.keySpirit.y<=0){
        			 $scope.keySpirit.y=0;
        		 }
        		 $scope.keySpirit.modified=true;
        	 }
        	 if($event.keyCode==39){
        		 $event.preventDefault();
        		 $scope.keySpirit.x+=1;
        		 $scope.keySpirit.modified=true;
        		 $scope.forwBuffer();
        	 }
        	 if($event.keyCode==40){
        		 $event.preventDefault();
        		 $scope.keySpirit.y+=1;
        		 $scope.keySpirit.modified=true;
        		 $scope.forwBuffer();
        	 }
         }
	}
	
	 $scope.selectSpirit=function(spirit,layer){
		$("#menu").hide();
		if(spirit.spriteType==8&&layer.id==1){
			$scope.choosedSpiritId=undefined;
			$scope.keySpirit=undefined;
		}else{
			$scope.choosedSpiritId=spirit.id;
			$scope.keySpirit=spirit;
		}
	}
	 
$scope.searchHouse=function(spirit){
    for(var i in $scope.mapcontent.layers){
  		for(var j in $scope.mapcontent.layers[i].sprites){
  		if($scope.mapcontent.layers[i].sprites[j].id==spirit.id){
  			if(parseFloat($scope.mapcontent.layers[i].sprites[j].x)-(parseFloat($("body").css("width"))-parseFloat($scope.mapcontent.layers[i].sprites[j].styleList[0].style.imageWidth))/2>0){
				$("body").scrollLeft(parseFloat($scope.mapcontent.layers[i].sprites[j].x)-(parseFloat($("body").css("width"))-parseFloat($scope.mapcontent.layers[i].sprites[j].styleList[0].style.imageWidth))/2);
			}else{
				$("body").scrollLeft(0);
			}
			if(parseFloat($scope.mapcontent.layers[i].sprites[j].y)-(parseFloat($("body").css("height"))-parseFloat($scope.mapcontent.layers[i].sprites[j].styleList[0].style.imageHeight))/2>0){
				$("body").scrollTop(parseFloat($scope.mapcontent.layers[i].sprites[j].y)-(parseFloat($("body").css("height"))-parseFloat($scope.mapcontent.layers[i].sprites[j].styleList[0].style.imageHeight))/2);
			}else{
				$("body").scrollTop(0);
			}
  		}	
  		}
  		}
if(spirit.spriteType==8){
	$scope.choosedSpiritId=undefined;
	$scope.keySpirit=undefined;
	}else{
		$scope.choosedSpiritId=spirit.id;
		$scope.keySpirit=spirit;
	}
}
//预览
$scope.preview=function(){
	previewValue=$scope.mapcontent;
	$(".previewWindow").attr("src",previev);
	$("#previewWindow").css("display","block");
	$("body").css("overflow","hidden");
	client.width=parseInt($(".previewWindow").css("width"));
	client.height=parseInt($(".previewWindow").css("height"));
}
$scope.upDateBudling=function(){
			$scope.buildings = buildings;
			$scope.layers = layers;
			$scope.styles = styles;
		    $scope.$apply();
}
$scope.operateBuffer=function(){
	if($scope.replyTemp.length>3){
		$scope.replyTemp.splice(0,1);
	}
	var replyTemp={};
	replyTemp.reply=angular.copy($scope.mapcontent);
	$scope.replyTemp.push(replyTemp);
	$scope.forwardTemp=angular.copy($scope.replyTemp);
	$scope.replyTemp[0].reply=angular.copy(contents);
	if(reply==true){
		$scope.replyTemp[$scope.replyTemp.length-2].reply=replyCon;
		reply=false;
	}
}
$scope.operateBuffer();
$scope.forwBuffer=function(){
	var replyTemp={};
	replyTemp.reply=angular.copy($scope.mapcontent);
	$scope.replyTemp.push(replyTemp);
	if(reply==true){
		$scope.replyTemp[$scope.replyTemp.length-2].reply=replyCon;
		reply=false;
	}
}
//上一步
var stepBuffer;
var reply=false;
var replyCon;
$scope.reply=function(){
	if($scope.replyTemp.length>1){
		reply=true;
		$scope.replyTemp.splice($scope.replyTemp.length-1,1);
		$scope.mapcontent=$scope.replyTemp[$scope.replyTemp.length-1].reply;
		stepBuffer=$scope.replyTemp.length-1;
		replyCon=angular.copy($scope.replyTemp[$scope.replyTemp.length-1].reply);
		$scope.spritesDrag();
		
	}else{
		alert("已经是最初一步");
	}
}
//下一步
$scope.forward=function(){
	stepBuffer+=1;
if(stepBuffer<$scope.forwardTemp.length&&$scope.forwardTemp.length>1){
		$scope.mapcontent=$scope.forwardTemp[stepBuffer].reply;
		$scope.forwBuffer();
		$scope.spritesDrag();
	}else{
		alert("已经是最后一步了");
	}
}
$scope.spritesDrag=function(){
	setTimeout(function() {
		for(var i in $scope.mapcontent.layers){
			for(var j in $scope.mapcontent.layers[i].sprites){
				for(m in $scope.mapcontent.layers[i].sprites[j].styleList){
					if($scope.mapcontent.layers[i].sprites[j].styleList[m].style.aniColumns==undefined){
						$scope.mapcontent.layers[i].sprites[j].styleList[m].style.aniColumns=null;
					}
					if($scope.mapcontent.layers[i].sprites[j].styleList[m].style.aniMillisecond==undefined){
						$scope.mapcontent.layers[i].sprites[j].styleList[m].style.aniMillisecond=null;
					}
				}
				if($scope.mapcontent.layers[i].sprites[j].animations!=null&&$scope.mapcontent.layers[i].sprites[j].animations.length>0){
					for(m in $scope.mapcontent.layers[i].sprites[j].animations){
					if($scope.mapcontent.layers[i].sprites[j].animations[m].aniColumns!=null&&$scope.mapcontent.layers[i].sprites[j].animations[m].aniColumns>1){
						$(".spirit"+$scope.mapcontent.layers[i].sprites[j].id+"_animate"+m).attr("id","spirit"+$scope.mapcontent.layers[i].sprites[j].id+"_animate"+m);
						$scope.animal("#spirit"+$scope.mapcontent.layers[i].sprites[j].id+"_animate"+m,$scope.mapcontent.layers[i].sprites[j].animations[m].imageWidth,$scope.mapcontent.layers[i].sprites[j].animations[m].aniColumns,$scope.mapcontent.layers[i].sprites[j].animations[m].aniMillisecond,"animation",false);
						$(".spirit"+$scope.mapcontent.layers[i].sprites[j].id+"_animates"+m).attr("id","spirit"+$scope.mapcontent.layers[i].sprites[j].id+"_animates"+m);
						$scope.animal("#spirit"+$scope.mapcontent.layers[i].sprites[j].id+"_animates"+m,$scope.mapcontent.layers[i].sprites[j].animations[m].imageWidth,$scope.mapcontent.layers[i].sprites[j].animations[m].aniColumns,$scope.mapcontent.layers[i].sprites[j].animations[m].aniMillisecond,"animations",false);
						
						}else{
							$scope.animal("#spirit"+$scope.mapcontent.layers[i].sprites[j].id+"_animate"+m,$scope.mapcontent.layers[i].sprites[j].animations[m].imageWidth,$scope.mapcontent.layers[i].sprites[j].animations[m].aniColumns,$scope.mapcontent.layers[i].sprites[j].animations[m].aniMillisecond,"animation",true);
							$scope.animal("#spirit"+$scope.mapcontent.layers[i].sprites[j].id+"_animates"+m,$scope.mapcontent.layers[i].sprites[j].animations[m].imageWidth,$scope.mapcontent.layers[i].sprites[j].animations[m].aniColumns,$scope.mapcontent.layers[i].sprites[j].animations[m].aniMillisecond,"animations",true);
							
						$(".spirit"+$scope.mapcontent.layers[i].sprites[j].id+"_animate"+m).attr("id","animation"+$scope.mapcontent.layers[i].sprites[j].id);
						$(".spirit"+$scope.mapcontent.layers[i].sprites[j].id+"_animate"+m).css("left","0px");
						$(".spirit"+$scope.mapcontent.layers[i].sprites[j].id+"_animates"+m).attr("id","animations"+$scope.mapcontent.layers[i].sprites[j].id);
						$(".spirit"+$scope.mapcontent.layers[i].sprites[j].id+"_animates"+m).css("left","0px");
					}
					}
				}
				if($scope.mapcontent.layers[i].sprites[j].styleList[0].style.aniColumns!=null&&$scope.mapcontent.layers[i].sprites[j].styleList[0].style.aniColumns>1){
					$(".spirit"+$scope.mapcontent.layers[i].sprites[j].id).attr("id","spirit"+$scope.mapcontent.layers[i].sprites[j].id);
					$scope.animal("#spirit"+$scope.mapcontent.layers[i].sprites[j].id,$scope.mapcontent.layers[i].sprites[j].styleList[0].style.imageWidth,$scope.mapcontent.layers[i].sprites[j].styleList[0].style.aniColumns,$scope.mapcontent.layers[i].sprites[j].styleList[0].style.aniMillisecond,"styles",false);
				}else{
//					console.log(scope.mapcontent.layers[i].sprites[j].styleList[0]);
					$scope.animal("#spirit"+$scope.mapcontent.layers[i].sprites[j].id,$scope.mapcontent.layers[i].sprites[j].styleList[0].style.imageWidth,$scope.mapcontent.layers[i].sprites[j].styleList[0].style.aniColumns,$scope.mapcontent.layers[i].sprites[j].styleList[0].style.aniMillisecond,"styles",true);
					$(".spirit"+$scope.mapcontent.layers[i].sprites[j].id).attr("id","spirit_"+$scope.mapcontent.layers[i].sprites[j].id);
					$(".spirit"+$scope.mapcontent.layers[i].sprites[j].id).css("left","0px");
				}
			}
		}
		$('.spirit').udraggable({
		containment: [0,0,$scope.mapcontent.width,$scope.mapcontent.height],
		start:function(){
			dragRow=$(this).attr("row");
			$scope.coverageSelectedRow=dragRow;
			$scope.coverageLayer=$scope.mapcontent.layers[dragRow];
			if($(this).attr("row")!=$scope.coverageSelectedRow){
				canDrag=false;
				if($(this).attr("row")==0){
				}else{
					dragRow=$(this).attr("row");
//					$('.editLayer').css("display","block");
					$('.editLayer .windowChange').udraggable(
							{
								handle:      '.winTitle'
							}
					);
				}
			}else{
				canDrag=true;	
				if($(this).attr("row")==0){
					canDrag=false;
				}
			}
		},stop:function(e,ui){
			if(canDrag!=false){
			$scope.operateBuffer();
			}
		},
			 drag: function (e, ui) {
				 var pos = ui.position;
				 if(canDrag==false){
					 pos.left=parseFloat($(this).css("left"));
					 pos.top=parseFloat($(this).css("top"));
				 }
				 else{
					 if(parseInt($(this).css("width"))+pos.left>=$scope.mapcontent.width){
				    	  pos.left=$scope.mapcontent.width-parseFloat($(this).css("width"));
				     }
				      if(parseInt($(this).css("height"))+pos.top>=$scope.mapcontent.height){
				    	  pos.top=$scope.mapcontent.height-parseFloat($(this).css("height"));
				      }
				      if(pos.left<=0){
				    	  pos.left=0;
				     }
				      if(pos.top<=0){
				    	  pos.top=0;
				      }
				      for(var i in $scope.mapcontent.layers){
				  		for(var j in $scope.mapcontent.layers[i].sprites){
				  			if($scope.mapcontent.layers[i].sprites[j].id==$(this).attr("natureId")
								&&$scope.mapcontent.layers[i].sprites[j].spriteType==$(this).attr("spriteType")
				  					){
				  				$scope.mapcontent.layers[i].sprites[j].x=pos.left;
				  				$scope.mapcontent.layers[i].sprites[j].y=pos.top;
				  				$scope.mapcontent.layers[i].sprites[j].modified=true;
				  			}
				  		}
				  	}	 
				 }
			    }
	});},50)
}	
var interval;
var allInterval=[];
$scope.animal=function(id,wid,cols,times,type,stop){
//	console.log(id);
	for(var i in allInterval){
		if(allInterval[i].id==id&&allInterval[i].interval!=-1&&allInterval[i].type==type){
			interval=allInterval[i].interval;
		}
	}
	clearInterval(interval);
	if(stop==false){
	var cols=cols;
	var times=times;
	var copiesCol=wid;
	var copiesTime=times/cols;
	var temp=0;
	$scope.ani=function(){
		if(temp<cols){
			$(id).animate({left:0-copiesCol*temp+'px'},0).animate({left:0-copiesCol*temp+'px'},copiesTime);
		  temp++;
		}else{
			temp=0;
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
	}
 
//	保存
	$scope.doSave=function(){
//		有一种东西叫排序@.@！
		for(i in $scope.mapcontent.layers){
			$scope.mapcontent.layers[i].sprites=$filter('orderBy')( $scope.mapcontent.layers[i].sprites, "zindex");
		}
		$scope.mapcontent.layers = $filter('orderBy')($scope.mapcontent.layers, "zindex");
		var layers=$scope.mapcontent.layers;
//      以下被注解的代码为，去掉错误的，多余的小精灵的url属性，节省流量以及json解析时间
	/*	for(var i in layers){
			var layer=layers[i];
			for(var j in layer.sprites){
				var sprite=layer.sprites[j];
				if(sprite.spriteType!=MapLayerType.TYPE_SHOP&&sprite.url!=null&&sprite.url.indexOf("jupiter://")==-1){
					console.log(">>>delete url:"+sprite.name+"|"+sprite.url);
					sprite.url=null;
				}
			}
		}*/
		var styleIds="";
		for(var i in layers){
			var layer=layers[i];
			for(var j in layer.sprites){
				var sprite=layer.sprites[j];
				if(sprite.id==0){
					//ID修复
					sprite.id=(++$scope.mapcontent.idSeq);
				}
				for(var k in sprite.styleList){
					var style=sprite.styleList[k].style;
					if(style.id){
						styleIds+=(styleIds==""?"":",")+style.id;
					}
				}
			}
		}		
		$("#content").text(JSON.stringify($scope.mapcontent));
		frmEdit.styleIds.value=styleIds;
		
		//后台根据modified属性，设置小精灵的最后修改时间
		for(var i in layers){
			var layer=layers[i];
			for(var j in layer.sprites){
				var sprite=layer.sprites[j];
				sprite.modified=false;
			}
		}
				
		doSave();
	}});