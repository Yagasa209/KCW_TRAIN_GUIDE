const RESULT_TOPS = 8;
const RESULT_WORSTS = 4;

var main_div = document.getElementById("guide_main");
var check_show_full_data = null;
function CreateMainForm() {
    var ok = true;
    main_div.style = "background-color: #DDEEFF;";
    AddElement(main_div, "p", "乗り換え案内");
    if (typeof trains == 'undefined') {
        AddElement(main_div, "p", "古いバージョンです。");
        AddElement(main_div, "span", "管理者は更新してください。");
        AddElement(main_div, "br");
        AddElement(main_div, "span", "利用者はハードリロードをしてみると更新されるかもしれません。");
        ok = false;
    } else {
        AddElement(main_div, "b", "From : ");
        AddElement(main_div, "select", null, "station_from");
        AddElement(main_div, "br");
        AddElement(main_div, "br");
        AddElement(main_div, "b", "To : ");
        AddElement(main_div, "select", null, "station_to");
        AddElement(main_div, "br");
        AddElement(main_div, "br");
        check_show_full_data = AddElement(main_div, "input");
        check_show_full_data.type = "checkbox";
        let span_show_full_data = AddElement(main_div, "span", "全ての結果を表示");
        span_show_full_data.onclick = function () { check_show_full_data.checked = !check_show_full_data.checked; }
        AddElement(main_div, "br");
        AddElement(main_div, "button", "検索する", "start_search");
        AddElement(main_div, "span", "　　");
        AddElement(main_div, "button", "FromとToを入替", "from_to_exchange");
        AddElement(main_div, "br");
        AddElement(main_div, "br");
        AddElement(main_div, "div", null, "result_div");
        if (typeof DataPatcher != 'undefined') {
            DataPatcher();
        }
        ok = true;
    }

    AddElement(main_div, "br");
    AddElement(main_div, "br");
    if (typeof g_Version != 'undefined') {
        AddElement(main_div, "span", "ver " + g_Version);
    } else {
        AddElement(main_div, "span", "Note : 起動システムの軽微な変更があったので、キャッシュの削除を推奨致します。");
    }
    AddElement(main_div, "br");
    AddElement(main_div, "span", "powered by thenyutheta");
    return ok;
}

//set up
if (CreateMainForm()) {
    var selector_from = document.getElementById("station_from");
    var selector_to = document.getElementById("station_to");
    var start_btn = document.getElementById("start_search");
    var result_area = document.getElementById("result_div");
    var from_to_ex = document.getElementById("from_to_exchange");

    var station_selector_data = [];
    //駅毎の、その駅に止まる列車の情報の配列。
    var station_infos = new Map();
    //路線データから駅を調べる。
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

    //セレクター作成。
    for (var i = 0; i < station_selector_data.length; i++) {
        SetSelectorOption(selector_from, i, station_selector_data[i][0]);
        SetSelectorOption(selector_to, i, station_selector_data[i][0]);
    }

    start_btn.onclick = GuideCore;

    from_to_ex.onclick = function () {
        let temp = selector_from.selectedIndex;
        selector_from.selectedIndex = selector_to.selectedIndex;
        selector_to.selectedIndex = temp;
    }
}

//core
function GuideCore() {
    var from_st = jQuery("#station_from option:selected").text();
    var to_st = jQuery("#station_to option:selected").text();
    result_area.innerHTML = "";
    if (to_st == from_st) {
        result_area.textContent = "駅が同じなので乗り換えは必要ありません。";
        return;
    }
    var result = [];
    //経路解析。
    CheckNodes(to_st, from_st, new Map(), from_st, result, 0);
    if (result.length == 0) {
        result_area.textContent = "駅が繋がっていないので乗り継ぎ出来ません。";
        return;
    }
    var final_data = [];
    //結果毎に路線解析
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
    //全ての結果を表示しない。
    if (!check_show_full_data.checked) {
        if (final_data.length > RESULT_TOPS + RESULT_WORSTS) {
            let baselen = final_data.length;
            let top = final_data.slice(0, RESULT_TOPS);
            let worst = final_data.slice(baselen - RESULT_WORSTS, baselen);
            final_data = top;
            final_data = final_data.concat(worst);
            AddElement(result_area, "span", baselen + "件中" + final_data.length + "件を表示中", null, "font-size: 12px; color: red;");
            AddElement(result_area, "br");
        }
    }
    //結果の表示と、乗り換えなどの検出。
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
//路線データを解析。(再帰関数)
function CheckChange(arr, data, cache = "", cline = 0, index = 0, nowline = null) {
    data = data || [];
    if (index >= arr.length) {
        data.push(cache + "," + cline);
        return;
    }
    var sta = station_infos[arr[index]];
    for (var i = 0; i < sta.length; i++) {
        //以前の駅に自分がいること。
        if (index == 0 || station_infos[arr[index - 1]].indexOf(sta[i]) > -1) {
            var c = 0;
            var tr = GetTrainByName(sta[i]);
            if (nowline != null) {
                var tri = IndexOfStation(tr, arr[index]);
                var trip = IndexOfStation(tr, arr[index - 1]);
                //前駅情報が不正か。
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

    //乗り換えが少ない物を選択。
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
    } else if (train.stations[sta_info][2] == "") {
        span.innerHTML += "<span style=\"color:" + train.color + ";\">■" + train.id + " </span>";
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
    if (ss >= 5000000) {
        console.log("stacking");
        return false
    }
}

//路線を無視した隣接駅検索。
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

function AddElement(parent, tag, text = null, id = null, style = null) {
    var t = document.createElement(tag);
    if (text != null) { t.textContent = text; }
    if (id != null) { t.id = id; }
    if (style != null) { t.style = style; }
    parent.appendChild(t);
    return t;
}