function openApp(url) {
	var timeout, t = 1000,
		hasApp = true;

	setTimeout(function() {
		if (hasApp) {
//			$("#loading").css("display", "none");
         $("#sild").html(">>>向右滑动进入APP");
		} else {
			$("#sild").html(">>>向右滑动进入APP");
//			$("#loading").css("display", "none");
			var url_ios_ent = "${ios_ent}";
			var url_android = "${android}";
			var ua = navigator.userAgent.toLowerCase();
			if (ua.match(/MicroMessenger/i) == "micromessenger") {
				$('.body').css('display', 'block');
			} else {

				var ua = navigator.userAgent.toLowerCase();
				
				var url = '';
				var ua = (navigator.userAgent || navigator.vendor || window.opera);
				if (ua != null) {
					var uaName = ua.toLowerCase();
					if (/android/i.test(uaName)) {
						//url = url_ios;
						window.location.href = url_android;
					} else {
						if (/ip(hone|od)/i.test(uaName)) {
							//url = iphoneUrl; 
							window.location.href = url_ios_ent;
						}
					}
				}
			}
		}
		document.body.removeChild(ifr);
	}, 2000)
	var t1 = Date.now();
	var ifr = document.createElement("iframe");
	ifr.setAttribute('src', url);
	ifr.setAttribute('style', 'display:none');
	document.body.appendChild(ifr);
	timeout = setTimeout(function() {
		var t2 = Date.now();
		if (!t1 || t2 - t1 < t + 100) {
			hasApp = false;
		}
	}, t);
}
function cloud(){
 
  $("#two_xiaoqu").animate({right:"130px"},0).animate({right:"-130px"},10000,cloud);
}
function arrow(){
  $(".one_go").animate({bottom:"32%",right:"15%"},0).animate({bottom:"31%",right:"14%"},500).animate({bottom:"32%",right:"15%"},500,arrow);
}
var status=0;
function plane(status){
	
	if(status==1){
		$(".four_plane").animate({opacity:"0"},4000).animate({left:"105%",top:"55%",opacity:"1"},0).animate({left:"-30%",top:"35%",opacity:"0"},2000,plane);
		function plane(){
			$(".four_plane").animate({left:"105%",top:"55%",opacity:"1"},0).animate({left:"-30%",top:"35%",opacity:"0"},2000,plane);
		
		}
	}
	else{
		$(".four_plane").stop();
		$(".four_plane").animate({opacity:"0"},0);
	}
	
}

$(function(){
	arrow();
	cloud();
	$(".weixin_share").click(function(){
		$(".weixin_share").slideUp();
		$(".weixin_share").css("display","none");
	});
	$(".three_cloud").click(function(){
		$(".three_introduce").slideToggle();
	});
	$(".three_introduce").click(function(){
		$(".three_introduce").slideUp();
	});
	var browser={
versions:function(){
var u = navigator.userAgent, app = navigator.appVersion;
return {//移动终端浏览器版本信息
trident: u.indexOf('Trident') > -1, //IE内核
presto: u.indexOf('Presto') > -1, //opera内核
webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
mobile: !!u.match(/AppleWebKit.*Mobile.*/)||!!u.match(/AppleWebKit/), //是否为移动终端
ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
iPad: u.indexOf('iPad') > -1, //是否iPad
webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
};
}(),
language:(navigator.browserLanguage || navigator.language).toLowerCase()
}
	var ua = navigator.userAgent.toLowerCase();
			if(ua.match(/qqbrowser/i)=="qqbrowser") {
    	$("#loading").attr("src","loading1.html");
     }else{
     	$("#loading").attr("src","loading.html");
     }
     if(ua.match(/baidubrowser/i)=="baidubrowser"||ua.match(/bidubrowser/i)=="bidubrowser") {

    		$("#sild").attr("class","sild1");
     }if(ua.match(/sogoumobilebrowser/i)=="sogoumobilebrowser") {

$("#sild").attr("class","sild1");
     }
   	var screenHeight = document.documentElement.clientHeight;
   	$(".publicity_fixed").css("height",screenHeight+"px");
// 	$("#loading").css("height",screenHeight+"px");
$(".publicity_bottom").on("touchstart", function(e) {
    e.preventDefault();
    startX = e.originalEvent.changedTouches[0].pageX,
    startY = e.originalEvent.changedTouches[0].pageY;
});
$(".publicity_bottom").on("touchend", function(e) {
    e.preventDefault();
    moveEndX = e.originalEvent.changedTouches[0].pageX,
    moveEndY = e.originalEvent.changedTouches[0].pageY,
    X = moveEndX - startX,
    Y = moveEndY - startY;
    
    if ( X > 40 ) {
    if(ua.match(/MicroMessenger/i)=="micromessenger") {
    	$("#sild").html("亲，敢不敢用浏览器打开？");
    	$(".weixin_share").css("display","block");
    	
     } else{
     	$("#sild").html("小蛐正在努力来接你...");
       if (browser.versions.android) {
			openApp('jupiter://apk.community.suning.com.cn');
		} else if (browser.versions.iPhone) {
			
            openApp('jupiter://ipa.community.suning.com.cn');
		} else if (browser.versions.iPad) {

//			openApp('tel:025-1111111');
		}
     }
    	
    }
    
});

})
$(window).load(function(){
		$("#loading").css("display","none");
		$(".publicity_bottom").css("display","block");
		var swiper = new Swiper('.swiper-container', {
//				direction : 'vertical',
				onInit: function(swiper) {
					swiperAnimateCache(swiper);
					swiperAnimate(swiper);
				},
				speed:300,
//				nextButton:'.one_click',
				onSlideChangeEnd: function(swiper) {
					swiperAnimate(swiper);
					draw1();
					$("#four_plane").attr("class","four_plane");
					status=1;
					plane(status);
				
					
				},
				onSlideChangeStart: function(swiper){
      $(".four_aixin").css("display","none");
      $(".three_introduce").css("display","none");
      	$(".four_plane").css("opacity","0");
      	$(".four_plane").stop();
      	status=0;
					plane(status);
    }
//  nextButton: '.swiper-button-next',
//	prevButton: '.swiper-button-prev',
			});
			$(".one_click").click(function(){
				$(".one_miumiu").css("z-index","-1");
				$(".one_miumiu").animate({right:'-100px'},500);
				setTimeout(function(){swiper.slideNext();},500);
			});
			$("#two_xiaoqu").click(function(){
				swiper.slideNext();
			});
			$("#three_miumiu").click(function(){
			swiper.slideNext();
			});
			$("#three_pere").click(function(){
			swiper.slideNext();
				
			});
	})