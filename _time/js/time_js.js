i = 0;
j = 0;
count = 0;
MM = 0;
SS = 60;  // 默认秒 60s
MS = 0;
totle = (MM+1)*600;
d = 180*(MM+1);
MM = "0" + MM;
var gameTime = 11;//(手动修改初始值+1)
//count down
var showTime = function(){
    totle = totle - 1;
    if (totle == 0) {
        clearInterval(s);
//      alert("倒计时结束");
    } else {
        if (totle > 0 && MS > 0) {
            MS = MS - 1;
            if (MS < 10) {
                MS = "0" + MS
            };
        };
        if (MS == 0 && SS > 0) {
            MS = 10;
            SS = SS - 1;
            if (SS < 10) {
                SS = "0" + SS
            };
        };
        if (SS == 0 && MM > 0) {
            SS = 60;
            MM = MM - 1;
            if (MM < 10) {
                MM = "0" + MM
            };
        };
    };
    $(".time").html(SS + "s");
};
var countDown = function() {
    i = 0;
    j = 0;
    count = 0;
    MM = 0;
    SS = gameTime;
    MS = 0;
    totle = (MM + 1) * gameTime * 10;
    d = 180 * (MM + 1);
    MM = "0" + MM;
    showTime();
    s = setInterval("showTime()", 100);
}