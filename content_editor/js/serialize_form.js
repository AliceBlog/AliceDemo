$.fn.serializeObject = function()
{
	var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] != undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return JSON.stringify(o);
};

$.fn.fillControlValues=function(obj){
	var formId=this["selector"].substring(1);
	var oForm=document.getElementById(formId);
	for(var i=0;i<oForm.elements.length;i++){
		var oCtrl=oForm.elements[i];
		var propName=oCtrl.name;
		if(oCtrl.getAttribute("comboname")&&(!propName)){
			propName=oCtrl.getAttribute("comboname");
		}
		if(!propName){
			continue;
		}
		if(!oCtrl.id){
			oCtrl.id=propName;
		}
		
		var value=obj[propName];
		if(value==null||value=="undefined"){
			value="";
		}
		if(oCtrl.getAttribute("type")=="checkbox"||oCtrl.getAttribute("type")=="radio"){
			oCtrl.checked=(oCtrl.value==value);
		}
		else if(oCtrl.getAttribute("type")=="select"){
			oCtrl.value=value;
			if(oCtrl.selectedIndex==-1){
				oCtrl.selectedIndex=0;
			}
		}
		else{
			oCtrl.value=value;
		}
		if(oCtrl.className.indexOf("easyui-datebox")==0){
			if(value){
				var d=new Date(value);
				$("#"+oCtrl.getAttribute("comboname")).datebox('setValue',d.toString(false));
			}
			else{
				$("#"+oCtrl.getAttribute("comboname")).datebox('setValue','');
			}
		}
	}
}

Date.prototype.toString=function(showTime){
	return (this.getYear()<1900?1900:0)+this.getYear()+"-"+_sf_formatNum(1+this.getMonth())+"-"+_sf_formatNum(this.getDate())+(showTime?" "+_sf_formatNum(this.getHours())+":"+_sf_formatNum(this.getMinutes())+":"+_sf_formatNum(this.getSeconds()):"");
}

function _sf_formatNum(n){
	return (n<10?"0"+n:""+n);
}
