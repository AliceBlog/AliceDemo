$(function(){

	$("#wrapper").mouseover(function() {
							var wheel = function(event) {
								var delta = 0;
								if (!event)
									event = window.event;
								if (event.wheelDelta) {
									delta = event.wheelDelta / 120;
								} else if (event.detail) {// 火狐浏览器
									delta = -event.detail / 3;
								}
								if (delta)
									handle(delta);
								if (event.preventDefault)
									event.preventDefault();
								event.returnValue = false;
							}
							if (window.addEventListener) {
								window.addEventListener('DOMMouseScroll',wheel, false);
							}
							window.onmousewheel = document.onmousewheel = wheel;
							var handle = function(delta) {
								scrollleftchange = document.getElementById("wrapper").scrollLeft;
								if (delta < 0) {
									//delta为-1时，向左滚动20px
									if (navigator.userAgent.indexOf('Firefox') >= 0) {// 火狐浏览器
										scrollleftchange += 20 / 3;
										document.getElementById("wrapper").scrollLeft = scrollleftchange;
									} else {
										scrollleftchange += 20;
										document.getElementById("wrapper").scrollLeft = scrollleftchange;
									}
									return;
								} else {
									//delta为1时，向右滚动20px
									scrollleftchange -= 20;
									document.getElementById("wrapper").scrollLeft = scrollleftchange;
									return;
								}
							}
						}).mouseout(function() {
							var wheel = function(event) {
								var delta = 0;
								if (!event)
									event = window.event;
								if (event.wheelDelta) {
									delta = event.wheelDelta / 120;
								} else if (event.detail) {
									delta = -event.detail / 3;
								}
								if (delta)
									handle(delta);
								if (event.preventDefault)
									event.preventDefault();
								event.returnValue = false;
							}
							if (window.addEventListener) {
								window.removeEventListener('DOMMouseScroll',wheel, false);
							}
							window.onmousewheel = document.onmousewheel = wheel;
							var handle = function(delta) {
								scrollleftchange = document.getElementById("wrapper").scrollLeft;
								if (delta < 0) {
									return false;
								} else {
									return false;
								}
							}

						});

		
		$(function(){
			var change_style=true;
			$("#change_style").click(function(){
				if (change_style) {
					$(".section").css("float","none");
				$("#wrapper").attr("id","wrapper1");
				$("#wrapper-scroll").attr("id","wrapper-scroll1");
				$(".wrapper-scroll").attr("class","wrapper-scroll1");
				$(".header").css("width","100%");
				$(".content").css("left","30%");
				$("#title").css("position","absolute");
				$("#wrapper").mouseover(function() {
							var wheel = function(event) {
								var delta = 0;
								if (!event)
									event = window.event;
								if (event.wheelDelta) {
									delta = event.wheelDelta / 120;
								} else if (event.detail) {// 火狐浏览器
									delta = -event.detail / 3;
								}
								if (delta)
									handle(delta);
								if (event.preventDefault)
									event.preventDefault();
								event.returnValue = false;
							}
							if (window.addEventListener) {
								window.addEventListener('DOMMouseScroll',wheel, false);
							}
							window.onmousewheel = document.onmousewheel = wheel;
							var handle = function(delta) {
								scrollleftchange = document.getElementById("wrapper").scrollTop;
								if (delta < 0) {
									//delta为-1时，向左滚动20px
									if (navigator.userAgent.indexOf('Firefox') >= 0) {// 火狐浏览器
										scrollleftchange += 20 / 3;
										document.getElementById("wrapper").scrollTop = scrollleftchange;
									} else {
										scrollleftchange += 20;
										document.getElementById("wrapper").scrollTop = scrollleftchange;
									}
									return;
								} else {
									//delta为1时，向右滚动20px
									scrollleftchange -= 20;
									document.getElementById("wrapper").scrollTop = scrollleftchange;
									return;
								}
							}
						}).mouseout(function() {
							var wheel = function(event) {
								var delta = 0;
								if (!event)
									event = window.event;
								if (event.wheelDelta) {
									delta = event.wheelDelta / 120;
								} else if (event.detail) {
									delta = -event.detail / 3;
								}
								if (delta)
									handle(delta);
								if (event.preventDefault)
									event.preventDefault();
								event.returnValue = false;
							}
							if (window.addEventListener) {
								window.removeEventListener('DOMMouseScroll',wheel, false);
							}
							window.onmousewheel = document.onmousewheel = wheel;
							var handle = function(delta) {
								scrollleftchange = document.getElementById("wrapper").scrollTop;
								if (delta < 0) {
									return false;
								} else {
									return false;
								}
							}

						});
				change_style=false;
				}else{
					$(".section").css("float","left");
				$("#wrapper1").attr("id","wrapper");
				$("#wrapper-scroll1").attr("id","wrapper-scroll");
				$(".wrapper-scroll1").attr("class","wrapper-scroll");
				$(".header").css("width","3862px");
				$(".content").css("left","60px");
				$("#title").css("position","fixed");
				$("#wrapper").mouseover(function() {
							var wheel = function(event) {
								var delta = 0;
								if (!event)
									event = window.event;
								if (event.wheelDelta) {
									delta = event.wheelDelta / 120;
								} else if (event.detail) {// 火狐浏览器
									delta = -event.detail / 3;
								}
								if (delta)
									handle(delta);
								if (event.preventDefault)
									event.preventDefault();
								event.returnValue = false;
							}
							if (window.addEventListener) {
								window.addEventListener('DOMMouseScroll',wheel, false);
							}
							window.onmousewheel = document.onmousewheel = wheel;
							var handle = function(delta) {
								scrollleftchange = document.getElementById("wrapper").scrollLeft;
								if (delta < 0) {
									//delta为-1时，向左滚动20px
									if (navigator.userAgent.indexOf('Firefox') >= 0) {// 火狐浏览器
										scrollleftchange += 20 / 3;
										document.getElementById("wrapper").scrollLeft = scrollleftchange;
									} else {
										scrollleftchange += 20;
										document.getElementById("wrapper").scrollLeft = scrollleftchange;
									}
									return;
								} else {
									//delta为1时，向右滚动20px
									scrollleftchange -= 20;
									document.getElementById("wrapper").scrollLeft = scrollleftchange;
									return;
								}
							}
						}).mouseout(function() {
							var wheel = function(event) {
								var delta = 0;
								if (!event)
									event = window.event;
								if (event.wheelDelta) {
									delta = event.wheelDelta / 120;
								} else if (event.detail) {
									delta = -event.detail / 3;
								}
								if (delta)
									handle(delta);
								if (event.preventDefault)
									event.preventDefault();
								event.returnValue = false;
							}
							if (window.addEventListener) {
								window.removeEventListener('DOMMouseScroll',wheel, false);
							}
							window.onmousewheel = document.onmousewheel = wheel;
							var handle = function(delta) {
								scrollleftchange = document.getElementById("wrapper").scrollLeft;
								if (delta < 0) {
									return false;
								} else {
									return false;
								}
							}

						});
				change_style=true;
				}
			});
		})
})