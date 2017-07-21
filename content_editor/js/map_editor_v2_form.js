function submitRoadsForm(){
	if(frmRoads.fileRoads.value==""){
		alert("请选择压缩包文件(*.zip)！");
		return;
	}
	if(frmRoads.roadCols.value==""||isNaN(frmRoads.roadCols.value)){
		alert("请输入道路铺设的列数！");
		frmRoads.roadCols.focus();
		return;
	}
	frmRoads.submit();
	$(".upLoadRoad").css("display","none");
	
}

var isDebug=false;
function doSave(_after_save){
	//提交后台保存数据	
	$.ajax({
		url:_contextPath+"/map_content/update?"+Math.random(),
		type : "POST",
		contentType:"application/json",   
		dataType : "json",
		data:$("#frmEdit").serializeObject(),
		success:function(data){
			if(data!=null&&(data["result"]=="true"||data["result"]==true)){
				if(_after_save!=null&&typeof(_after_save)=="function"){
					_after_save();
				}
				else{
					alert("保存成功！");
					afterUpdateLayerData();
					$(".sceneSetting").css("display","none");
					$("body").css("overflow","auto");
				}
			}
			else{
				alert("保存失败！");
			}
		},
		error:function(XmlHttpRequest,textStatus,errorThrown){
			if(isDebug){
				var str = XmlHttpRequest.responseText;
				window.open("").document.write(str);
			}
			else{
				jQuery.messager.alert("提示","操作失败！","error");
			}
		}
	});	
}

function newShopsBuilding(){
	DialogUtil.showDialog({
		url:_contextPath+"/shops_building/new?map_edit_flag=1&resQtrId="+resQtrId,
		title:"添加新商铺",
		width:540,
		height:520
	});
}

function newBuilding(){
	DialogUtil.showDialog({
		url:_contextPath+"/building/"+resQtrId+"/new?map_edit_flag=1",
		title:"添加新楼栋",
		width:540,
		height:520
	});
}

function newStyle(applyType){
	DialogUtil.showDialog({
		url:_contextPath+"/building_style/"+frmEdit.buildingStyleTypeId.value+"/new?map_edit_flag=1&applyType="+(applyType?applyType:""),
		title:"添加样式",
		width:540,
		height:"80%"
	});
}

function afterUpdateBuildingData(){
	$.ajax({
		url:_contextPath+"/map_content/buildings_data/"+resQtrId+"/"+frmEdit.elements.namedItem("id").value,
		success:function(data){
			buildings=data;
			scope.upDateBudling();
		},
		error:function(){
		}
	});
}

function afterUpdateLayerData(){
	$.ajax({
		url:_contextPath+"/map_content/shops_data/"+resQtrId+"/"+frmEdit.elements.namedItem("id").value,
		success:function(data){
			layers=data;
			scope.upDateBudling();
		},
		error:function(){
			
		}
	});
}

function afterUpdateStyleData(){
	$.ajax({
		url:_contextPath+"/map_content/styles_data/"+frmEdit.buildingStyleTypeId.value,
		success:function(data){
			styles=data;
			scope.upDateBudling();
		},
		error:function(){
			
		}
	});
}

function selectTemplate(){
	DialogUtil.showDialog({
		title:"场景显示方案",
		url:_contextPath+"/map_content/list?resQtrId="+resQtrId,
		width:"80%",
		height:"80%"
	});
	$(".sceneSetting").css("display","none");
}

function saveAsTemplate(){
	var _after_save=function(){
		$.ajax({
			url:_contextPath+"/map_content/create_backup?srcId="+frmEdit.elements.namedItem("id").value+"&"+Math.random(),
			type : "GET",
			success:function(data){
				if(data!=null&&(data["result"]=="true"||data["result"]==true)){
					alert("成功了保存副本："+document.getElementById("tdSchemeName").innerHTML);
					afterUpdateLayerData();
					$(".sceneSetting").css("display","none");
				}
				else{
					alert("保存失败！");
				}
			},
			error:function(XmlHttpRequest,textStatus,errorThrown){
				if(isDebug){
					var str = XmlHttpRequest.responseText;
					window.open("").document.write(str);
				}
				else{
					jQuery.messager.alert("提示","操作失败！","error");
				}
			}
		});	
	};
	doSave(_after_save);
}

function selectJupiterLink(id,url){
	var urlTemp=document.getElementById("jupiterUrl").value;
	if(urlTemp){
		url=urlTemp;
	}
	DialogUtil.showDialog({
		url:"../../select_jupiter_url?id="+id+"&resQtrId="+resQtrId+"&url="+encodeURIComponent(url),
		width:500,
		height:280,
		title:"链接"
	});
}

function afterSelectJupiterUrl(url,remark){
	document.getElementById("jupiterUrlDisp").value=remark;
	document.getElementById("jupiterUrl").value=url;
}

function formatBuildingStartPositions(){
	if(contents==null||contents["layers"]==null){
		return;
	}
	for(var i=0;i<contents["layers"].length;i++){
		var layer=contents["layers"][i];
		
		for(var j=0;j<layer["sprites"].length;j++){
			var sprite=layer["sprites"][j];
			for(var k=0;k<sprite["styleList"].length;k++){
				if(sprite["styleList"][k].style["id"]){
					var tempStyle=findStyleById(sprite["styleList"][k].style["id"]);
					sprite["styleList"][k].style=tempStyle;
				}
			}
		}
	}
}

function findStyleById(id){
	for(var i=0;i<styles.length;i++){
		if(styles[i]["id"]==id){
			return styles[i];
		}
	}
}

function sendSceneUpdateXMPP(){
	if(confirm("发送XMPP消息，通知手机端更新场景？")){
		$.ajax({
			url:_contextPath+"/map_content/send_update_xmpp?resQtrId="+resQtrId+"&"+Math.random(),
			type : "GET",
			success:function(data){
				alert("操作成功");
			},
			error:function(XmlHttpRequest,textStatus,errorThrown){
				alert("操作失败");
			}
		});	
	}
			
}