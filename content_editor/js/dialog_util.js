var DialogUtil={
	curDialogId:null,
	showDialog:function(params){
		if(!params.dlgId){
			if(params.dialogId){
				params.dlgId=params.dialogId;
			}
			else{
				params.dlgId="dlg_"+Math.round(65536*Math.random());
			}
		}
		var dlgId=params.dlgId;
		var oDlgDiv=document.getElementById(dlgId+"_dialog");
		if(!oDlgDiv){
			oDlgDiv=document.createElement("DIV");
			oDlgDiv.id=dlgId+"_dialog";
			document.body.appendChild(oDlgDiv);
		}
		oDlgDiv.style.display="none";
		var oFormDiv=document.getElementById(dlgId+"_dialog_frame");
		if(!oFormDiv){
			oFormDiv=document.createElement("DIV");
			oFormDiv.id=dlgId+"_dialog_frame";
			oFormDiv.style.height="100%";
			oDlgDiv.appendChild(oFormDiv);
		}
		if(params.url){
			$("#"+dlgId+"_dialog_frame").css("display","none");
		}
		else if(params.html){
			$("#"+dlgId+"_dialog_frame").html(params.html);
		}
		if(typeof(params.width)=="string"&&params.width.indexOf("%")!=-1){
			var s=params.width;
			s=s.substring(0,s.length-1);
			params.width=Math.round(document.body.clientWidth*parseFloat(s)/100);
		}
		if(typeof(params.height)=="string"&&params.height.indexOf("%")!=-1){
			var s=params.height;
			s=s.substring(0,s.length-1);
			params.height=Math.round(document.body.clientHeight*parseFloat(s)/100);
		}
   		$("#"+dlgId+"_dialog").show();
   		if(typeof(params.top)=="undefined"){
   			params.top=document.body.clientHeight/2+document.body.scrollTop-params.height/2;
    	}
  		$("#"+dlgId+"_dialog").attr("dialogHeight",params.height);
		$("#"+dlgId+"_dialog").dialog({ 
   			modal:true,
   			left:params.left,
   			top:params.top,
   			title:params.title,
   			width:params.width,
   			height:params.height,
   			buttons:params.buttons,
   			onOpen:function(){
   				var urlParamsData=eval(params.data);
   				var winName=params.dlgId+"_win";
   				if(params.url){
   					if( typeof(urlParamsData)=='undefined'){
   	   					$("#"+dlgId+"_dialog_frame").html("<iframe src=\""+params.url+(params.url.indexOf("?")==-1?"?":"&")+Math.random()+"\" id="+winName+" name="+winName+" style=\"width:100%;height:100%\" frameborder=\"0\"></iframe>");
   	   				}
   	   				else
   	   					{
   	   					var urlParams="";
   	   					for(var paramsName in urlParamsData){
   							urlParams=urlParams+paramsName+"="+encodeURI(encodeURI(urlParamsData[paramsName]))+"&";
   						//  urlParams=urlParams+paramsName+"="+window.+"&";
   	   					}
   	   					$("#"+dlgId+"_dialog_frame").html("<iframe src=\""+params.url+(params.url.indexOf("?")==-1?"?":"&")+urlParams+"r="+Math.random()+"\"  id="+winName+" name="+winName+" style=\"width:100%;height:100%\" frameborder=\"0\"></iframe>");
   	   					}
   	   				$("#"+dlgId+"_dialog_frame").css("display","");
   				}
   				if(typeof(params.onDialogOpen)=="function"){
   					params.onDialogOpen(params)
   				}
   			},
   			onClose:function(){
   				if(typeof(params.onClose)=="function"){
   					params.onClose();
   				}
   			}
   		});
   		this.curDialogId=dlgId;
		return dlgId;
	},
	closeDialog:function(dlgId){
		if(!dlgId){
			dlgId=this.curDialogId;
		}
		$("#"+dlgId+"_dialog").dialog("close");
		if(dlgId==this.curDialogId){
			this.curDialogId=null;
		}
	},
	getDialog:function(dlgId){
		return $("#"+dlgId+"_dialog");
	},
	getDialogWindow:function(dlgId){
		return window.frames[dlgId+"_win"];
	}
};

function _du_attachEvent(oObject,sEventName,oFunc){
	if(window.navigator.appVersion.indexOf("MSIE")!=-1){
		oObject.attachEvent("on"+sEventName,oFunc);
	}
	else{
		oObject.addEventListener(sEventName,oFunc,true);
	}
}

_du_attachEvent(window,"scroll",function(){
	if(DialogUtil.curDialogId){
		var h=$("#"+DialogUtil.curDialogId+"_dialog").attr("dialogHeight");
		if(h!=null){;
			h=parseInt(h);
			$("#"+DialogUtil.curDialogId+"_dialog").dialog("move",{top:document.body.clientHeight/2+document.body.scrollTop-h/2});	
		}
	}
});