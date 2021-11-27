var scr_parent = document.getElementById("guide_main");
if (scr_parent == null) {
  alert("[for管理者]\n設置する際に <div id=\"guide_main\"></div>　を置き忘れています。");
  throw "div error";
}
var scr_dataurl = (location.protocol == "file:") ? "./data.js" : "https://Yagasa209.github.io/KCW_TRAIN_GUIDE/data.js";
var scr_coreurl = (location.protocol == "file:") ? "./core.js" : "https://thenyutheta.github.io/KCW_TRAIN_GUIDE/core.js";
var scr_data = document.createElement("script");
scr_data.src = scr_dataurl + '?t=' + Date.now();
scr_data.onload = function () {
  var scr_core = document.createElement("script");
  scr_core.src = scr_coreurl + '?t=' + Date.now();
  scr_core.onload = function () { };
  scr_parent.appendChild(scr_core);
}
scr_parent.appendChild(scr_data);
