//(function () {
var main_div = document.getElementById("guide_main");
main_div.style = "margin-left: 10px; background-color: azure;";
main_div.innerHTML =
    '<p>乗り換え案内</p><b>From : </b><select id="station_from"></select><br>' +
    '<br><b>To : </b><select id="station_to"></select><br><br><button id="start_search">検索する</button><br><br>' +
    '<div id="result_div"></div><br><span>ver 0.01</span><br><span>powerd by thenyutheta</span>';
var selector_from = document.getElementById("station_from");
var selector_to = document.getElementById("station_to");
var start_btn = document.getElementById("start_search");
var result_area = document.getElementById("result_div");

var trains = [];
//路線データ登録エリア
/* template

trains.push({
    name : "name",
    id : "id",
    stations : [
        ["station1", "sort name", "num1"],
        ["station2", "sort name", "num2"],
    ]
});

*/

trains.push({
    name: "一村線",
    id: "IC",
    color: "#0099FF",
    stations: [
        ["初原", "はつはら", "01"],
        ["一村", "いちむら", "02"],
        ["高台", "たかだい", "03"],
        ["金泉", "かないずみ", "04"],
        ["珊瑚口", "さんごぐち", "05"],
    ]
});

trains.push({
    name: "岸川線",
    id: "KW",
    color: "#339900",
    stations: [
        ["金泉", "かないずみ", "01"],
        ["沼井", "ぬまい", "02"],
        ["心愛", "ここあ", "03"],
        ["岸川", "きしかわ", "04"],
        ["遠北", "あちきた", "05"],
        ["高台", "たかだい", "06"],
        ["神隠", "こがくれ", "07"],
    ]
});

trains.push({
    name: "高野線",
    id: "TN",
    color: "#00FF00",
    stations: [
        ["廃村", "はいそん", "00"],
        ["砂口", "すなぐち", "01"],
        ["北一村", "きたいちむら", "02"],
        ["一村", "いちむら", "03"],
        ["ファミリーマート", "ふぁみりーまーと", "04"],
        ["商店街前", "しょうてんがいまえ", "05"],
        ["高台", "たかだい", "06"],
        ["本高台", "ほんたかだい", "07"],
        ["矢野", "やの", "08"],
    ],
    Direct: {
        "金剛線": "矢野",
    }
});

trains.push({
    name: "ネザーエクスプレス線",
    id: "NT",
    color: "#FF00FF",
    stations: [
        ["地終", "ちのはて", "00"],
        ["高台", "たかだい", "01"],
        ["珊瑚口", "さんごぐち", "02"],
        ["海底神殿", "かいていしんでん", "03"],
        ["メサランド", "めさらんど", "04"],
    ]
});

trains.push({
    name: "水谷線",
    id: "MT",
    color: "#FF6600",
    stations: [
        ["高台", "たかだい", "10"],
        ["浮島", "うきしま", "11"],
        ["水谷", "みずたに", "12"],
        ["沼井", "ぬまい", "13"],
        ["金泉", "かないずみ", "14"],
        ["碑文田", "ひもんだ", "15"],
        ["新碑文田", "しんひもんだ", "16"],
    ],
    Direct: {
        "桜庭線": "高台",
        "雉鉄本線": "新碑文田",
    }
});

trains.push({
    name: "桜庭線",
    id: "SK",
    color: "#FF66FF",
    stations: [
        ["明神市", "みょうじんし", "01"],
        ["花園城址公園", "はなぞのじょうしこうえん", "02"],
        ["蓮苔溝無", "ばすごけみぞなし", "03"],
        ["山入", "やまいり", "04"],
        ["勿咲", "なさき", "05"],
        ["漆ノ森", "しちのもり", "06"],
        ["草船", "くさぶね", "07"],
        ["湿塚", "しめつか", "08"],
        ["一村", "いちむら", "09"],
        ["高台", "たかだい", "10"],
    ],
});

trains.push({
    name: "矢野線",
    id: "YN",
    color: "#FF0000",
    stations: [
        ["高台", "たかだい", "10"],
        ["矢野", "やの", "11"],
        ["ひまわりの里", "ひまわりのさと", "12"],
        ["因町", "ちなみまち", "13"],
        ["燧灘", "ひうちなだ", "14"],
        ["地終", "ちのはて", "15"],
    ],
    Direct: {
        "桜庭線": "高台",
    }
});


trains.push({
    name: "雉鉄本線",
    id: "KH",
    color: "#006699",
    stations: [
        ["新碑文田", "しんひもんだ", "16"],
        ["新月町", "しんげつちょう", "17"],
        ["サウスサイドフロンティア", "さうすさいどふろんてぃあ", "18"],
    ],
    Direct: {
        "水谷線": "新碑文田",
    }
});

trains.push({
    name: "ピリド線",
    id: "PR",
    color: "#999999",
    stations: [
        ["燧灘", "ひうちなだ", "1"],
        ["燧灘庁舎", "ひうちなだちょうしゃ", "2"],
    ]
});

trains.push({
    name: "金剛線",
    id: "KG",
    color: "#000000",
    stations: [
        ["矢野", "やの", "01"],
        ["採掘場入口", "さいくつじょういりぐち", "02"],
        ["地下拠点", "ちかきょてん", "03"],
        ["第二採掘区画終点", "だいにさいくつくかくしゅうてん", "04"],
        ["第三採掘区画終点", "だいさんさいくつくかくしゅうてん", "05"],
        ["地下大渓谷", "ちかだいけいこく", "06"],
    ],
    Direct: {
        "高野線": "矢野",
    }
});

trains.push({
    name: "ケダマ村電線",
    id: "",
    color: "#C0C040",
    stations: [
        ["農場前", "のうじょうまえ", ""],
        ["ひまわりの里", "ひまわりのさと", ""],
        ["公民館", "こうみんかん", ""],
        ["蔗", "さとうきび", ""],
        ["キャンプ場前", "きゃんぷじょうまえ", ""],
        ["洞窟前", "どうくつまえ", ""],
        ["旅人", "たびびと", ""],
    ],
    loop: true,
});

trains.push({
    name: "市鉄本線",
    id: "IR",
    color: "#6600CC",
    stations: [
        ["高台", "たかだい", "01"],
        ["水谷", "みずたに", "02"],
        ["丸山", "まるやま", "03"],
        ["山吹", "やまぶき", "04"],
        ["草船", "くさぶね", "05"],
        ["花園", "はなぞの", "06"],
        ["明神", "みょうじん", "01"],
    ]
});

trains.push({
    name: "市鉄支線",
    id: "",
    color: "#0000FF",
    stations: [
        ["山吹", "やまぶき", ""],
        ["牛込", "うしごめ", ""],
    ]
});

trains.push({
    name: "海底神殿線",
    id: "",
    color: "#000000",
    stations: [
        ["海底神殿", "かいていしんでん", ""],
        ["海上ポート", "かいじょうぽーと", ""],
    ]
});



//路線データ登録エリア終了

//以下処理
//get and set stations
{
    var station_selector_data = [];
    var station_infos = new Map();
    for (var i = 0; i < trains.length; i++) {
        for (var g = 0; g < trains[i].stations.length; g++) {
            let name = trains[i].stations[g][0];
            if (station_infos[name] == undefined) {
                station_infos[name] = [];
                station_selector_data.push([name, trains[i].stations[g][1]]);
            }
            station_infos[name].push(trains[i].name);
        }
    }

    station_selector_data.sort(function (a, b) {
        if (a[1] <= b[1]) {
            return -1;
        } else {
            return 1;
        }
    });

    for (var i = 0; i < station_selector_data.length; i++) {
        SetSelectorOption(selector_from, i, station_selector_data[i][0]);
        SetSelectorOption(selector_to, i, station_selector_data[i][0]);
    }
}

start_btn.onclick = GuideCore;
//core
function GuideCore() {
    var from_st = jQuery("#station_from option:selected").text();
    var to_st = jQuery("#station_to option:selected").text();
    result_area.innerHTML = "";
    if (to_st == from_st) {
        result_area.textContent = "駅が同じなので乗り換えは必要ありません。";
        return;
    }
    var from = station_infos[from_st];
    var to = station_infos[to_st];
    var result = [];
    CheckNodes(to_st, from_st, new Map(), from_st, result, 0);
    if (result.length == 0) {
        result_area.textContent = "駅が繋がっていないので乗り継ぎ出来ません。";
        return;
    }
    var final_data = [];
    for (var i = 0; i < result.length; i++) {
        let r_ar = result[i].split(",");
        let debug = [];
        let data = CheckChange(r_ar, debug);
        final_data.push([r_ar, data]);
    }
    final_data.sort(function (a, b) {
        if (parseInt(a[1][a[1].length - 1]) > parseInt(b[1][b[1].length - 1])) {
            return 1;
        } else if (parseInt(a[1][a[1].length - 1]) < parseInt(b[1][b[1].length - 1])) {
            return -1;
        }

        if (parseInt(a[0].length) > parseInt(b[0].length)) {
            return 1;
        } else {
            return -1;
        }
    });
    for (var i = 0; i < final_data.length; i++) {
        let r_ar = final_data[i][0];
        let data = final_data[i][1];
        var div = document.createElement("div");
        div.style.backgroundColor = "#F1F1F1";
        div.innerHTML = "経路 <b>" + (i + 1) + "</b> : 駅数 " + r_ar.length + "、 乗り換え数 " + data[data.length - 1] + "<br>"
        result_area.appendChild(div);
        for (var r = 0; r < r_ar.length; r++) {
            var t_data = GetTrainByName(data[r]);
            if (r == 0) {
                CreateResult(div, t_data, r_ar[r], "乗車", t_data);
                continue;
            }
            if (r == r_ar.length - 1) {
                CreateResult(div, t_data, r_ar[r], "降車");
                break;
            } else {
                if (data[r + 1] != data[r]) {
                    if (t_data.Direct == undefined || t_data.Direct[data[r + 1]] != r_ar[r]) {
                        CreateResult(div, t_data, r_ar[r], "乗換", GetTrainByName(data[r + 1]));
                    } else {
                        CreateResult(div, t_data, r_ar[r], "直通", GetTrainByName(data[r + 1]));
                    }
                } else {
                    CreateResult(div, t_data, r_ar[r]);
                }
            }
        }
        result_area.appendChild(document.createElement("br"));
    }
};

function CheckChange(arr, data, cache = "", cline = 0, index = 0, nowline = null) {
    data = data || [];
    if (index >= arr.length) {
        data.push(cache + "," + cline);
        return;
    }
    var sta = station_infos[arr[index]];
    for (var i = 0; i < sta.length; i++) {
        if (index == 0 || station_infos[arr[index - 1]].indexOf(sta[i]) > -1) {
            var c = 0;
            var tr = GetTrainByName(sta[i]);
            if (nowline != null) {
                var tri = IndexOfStation(tr, arr[index]);
                var trip = IndexOfStation(tr, arr[index - 1]);
                if (tr.loop == true) {
                    if (trip == -1 || (tr.stations[LoopNum(tri + 1, 0, tr.stations.length - 1)] != tr.stations[trip] && tr.stations[LoopNum(tri - 1, 0, tr.stations.length - 1)] != tr.stations[trip])) {
                        continue;
                    }
                } else {
                    if (trip == -1 || Math.abs(tri - trip) > 1) {
                        continue;
                    }
                }
            }
            if (nowline != null && sta[i] != nowline) {
                var p_tr = GetTrainByName(nowline);
                if (index == 1 || p_tr.Direct == undefined || p_tr.Direct[sta[i]] != arr[index - 1]) {
                    c = 1;
                }
            }
            CheckChange(arr, data, cache + "," + sta[i], cline + c, index + 1, sta[i]);
        }
    }

    if (index == 0) {
        var min = 999999999;
        var hei = -1;
        for (var i = 0; i < data.length; i++) {
            var s = data[i].split(",");
            var num = parseInt(s[s.length - 1]);
            if (num <= min) {
                min = num;
                hei = i;
            }
        }
        return data[hei].replace(/^,/, "").split(",");
    }

}

function CreateResult(div, train, station, opt = null, subtrain = null) {
    var span = document.createElement("span");
    span.innerHTML = "";
    var sta_info = IndexOfStation(train, station);
    if (train.id == "") {
        span.innerHTML += "<span style=\"color:" + train.color + ";\">■" + train.stations[sta_info][2] + "</span>";
    } else {
        span.innerHTML += "<span style=\"color:" + train.color + ";\">■" + train.id + "-" + train.stations[sta_info][2] + "</span>";
    }
    if (train.stations[sta_info][2] == "") {
        span.innerHTML += "<span>" + station + "</span>";
    } else {
        span.innerHTML += "<span>  " + station + "</span>";
    }
    if (opt != null) {
        span.innerHTML += " <b><u>[" + opt + "]</u></b>";
    }
    if (subtrain != null) {
        span.innerHTML += " <span style=\"color:" + subtrain.color + ";\">■" + subtrain.id + ":" + subtrain.name + "</span>";
    }
    div.appendChild(span);
    div.appendChild(document.createElement("br"));
}

function CheckNodes(tar, now, checked, nowres, ok, ss) {
    checked[now] = true;
    if (tar == now) {
        ok.push(nowres);
        return;
    }
    var edges = GetEdgesByStation(now);
    var used = 0;
    for (var i = 0; i < edges.length; i++) {
        if (checked[edges[i]] == undefined) {
            used++;
            CheckNodes(tar, edges[i], jQuery.extend(true, [], checked), nowres + "," + edges[i], ok, ss + 1);
        }
    }
    if (used == 0) {
        return false;
    }
    if (ss >= 500000) {
        console.log("stacking");
        return false
    }
}

function GetEdgesByStation(name) {
    var res = [];
    for (var i = 0; i < station_infos[name].length; i++) {
        var train = GetTrainByName(station_infos[name][i]);
        var index = IndexOfStation(train, name);
        if (train.loop == true) {
            var i_temp = LoopNum(index - 1, 0, train.stations.length - 1);
            if (res.indexOf(train.stations[i_temp][0]) == -1) {
                res.push(train.stations[i_temp][0]);
            }
            i_temp = LoopNum(index + 1, 0, train.stations.length - 1);
            if (res.indexOf(train.stations[i_temp][0]) == -1) {
                res.push(train.stations[i_temp][0]);
            }
        } else {
            if (index - 1 >= 0) {
                if (res.indexOf(train.stations[index - 1][0]) == -1) {
                    res.push(train.stations[index - 1][0]);
                }
            }
            if (index + 1 < train.stations.length) {
                if (res.indexOf(train.stations[index + 1][0]) == -1) {
                    res.push(train.stations[index + 1][0]);
                }
            }
        }
    }
    return res;
}

function GetTrainByName(name) {
    for (var i = 0; i < trains.length; i++) {
        if (trains[i].name == name) {
            return trains[i];
        }
    }
    return null;
}

function IndexOfStation(train, name) {
    for (var i = 0; train.stations.length; i++) {
        if (train.stations[i][0] == name) {
            return i;
        }
    }
    return -1;
}

function SetSelectorOption(selctor, val, text) {
    var opt = document.createElement("option");
    opt.value = val;
    opt.text = text;
    selctor.appendChild(opt);
}

function LoopNum(val, min, max) {
    if (val > max) {
        return min;
    } else if (val < min) {
        return max;
    } else {
        return val;
    }
}
    //})();