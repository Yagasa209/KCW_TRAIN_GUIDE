const g_Version = "0.2-beta-4";

const RESULT_GROUP = 10;
const WALK_CMD = "%%WALK_DATA%%";

const main_div = document.getElementById("guide_main");

//options
var check_dont_use_walk = null;
var check_chaos_mode = null;

//elements
var selector_from = null;
var selector_to = null;
var result_area = null;
var url_cr_res = null;
var all_station_count = null;
var root_result_area = null;
var result_selector = null;

//Objects
var urlopti = null;
//駅毎の、その駅に止まる列車の情報の配列。
var station_infos = null;
//駅毎の、隣接駅の情報の配列。
var station_edge_infos = null;
//列車名からオブジェクトへ変換
var TrainObjMap = null;
//最終結果
var final_data = [];

function CreateMainForm() {
    let ok = true;
    main_div.style = "background-color: #DDEEFF;";
    AddElement(main_div, "p", "[乗り換え案内]", null, "font-weight: bold;");
    if (typeof trains == 'undefined') {
        AddElement(main_div, "p", "古いバージョンです。");
        AddElement(main_div, "span", "管理者は更新してください。");
        AddElement(main_div, "br");
        AddElement(main_div, "span", "利用者はハードリロードをしてみると更新されるかもしれません。");
        ok = false;
    } else {
        AddElement(main_div, "b", "From\u00a0:\u00a0");
        selector_from = AddElement(main_div, "select");
        AddElement(main_div, "br");
        AddElement(main_div, "br");
        AddElement(main_div, "b", "To\u00a0\u00a0\u00a0\u00a0\u00a0:\u00a0");
        selector_to = AddElement(main_div, "select");
        AddElement(main_div, "br");
        AddElement(main_div, "br");
        check_dont_use_walk = AddExCheckBox(main_div, "[歩く経路を含まない]");
        AddElement(main_div, "br");
        check_chaos_mode = AddExCheckBox(main_div, "[強引に乗換数を増やす]");
        AddElement(main_div, "br");
        AddElement(main_div, "br");
        AddElement(main_div, "button", "検索する").onclick = GuideCore;
        AddElement(main_div, "span", "　　");
        AddElement(main_div, "button", "FromとToを入替").onclick = function () {
            let l_from_s = selector_from.options.selectedIndex;
            selector_from.options.selectedIndex = selector_to.options.selectedIndex;
            selector_to.options.selectedIndex = l_from_s;
        }
        AddElement(main_div, "br");
        url_cr_res = AddElement(main_div, "a", "", null, "font-size : 11px");
        AddElement(main_div, "br");
        result_area = AddElement(main_div, "div");

        AddElement(main_div, "br");
        AddElement(main_div, "span", "路線総数 : " + trains.length);
        AddElement(main_div, "br");
        all_station_count = AddElement(main_div, "span");

        if (typeof DataPatcher == 'function') { DataPatcher(); }
        ok = true;
    }

    AddElement(main_div, "br");
    AddElement(main_div, "br");
    AddElement(main_div, "span", "version : " + g_Version);
    AddElement(main_div, "br");
    AddElement(main_div, "b", "powered by theta");
    return ok;
}

//set up
if (CreateMainForm()) {
    urlopti = new Map();
    let pair = location.search.substring(1).split('&');
    for (var i = 0; pair[i]; i++) {
        let kv = pair[i].split('=');
        urlopti[kv[0]] = decodeURIComponent(kv[1]);
    }

    let station_selector_data = [];
    station_infos = new Map();
    station_edge_infos = new Map();
    TrainObjMap = new Map();
    //路線データから駅を調べる。
    for (var i = 0; i < trains.length; i++) {
        TrainObjMap[trains[i].name] = trains[i];
        for (let g = 0; g < trains[i].stations.length; g++) {
            let name = trains[i].stations[g][0];
            if (station_infos[name] == undefined) {
                station_infos[name] = [];
                station_selector_data.push([name, trains[i].stations[g][1]]);
                station_edge_infos[name] = new Set();
            }
            station_infos[name].push(trains[i].name);
            if (g - 1 >= 0) {
                station_edge_infos[name].add(trains[i].stations[g - 1][0]);
            } else if (trains[i].loop) {
                station_edge_infos[name].add(trains[i].stations[trains[i].stations.length - 1][0]);
            }
            if (g + 1 < trains[i].stations.length) {
                station_edge_infos[name].add(trains[i].stations[g + 1][0]);
            } else if (trains[i].loop) {
                station_edge_infos[name].add(trains[i].stations[0][0]);
            }
        }
    }
    for (var i = 0; i < walk_data.length; i++) {
        let walkAr = walk_data[i][0]
        for (let k = 0; k < walkAr.length; k++) {
            if (station_infos[walkAr[k]] == undefined) {
                station_selector_data.push([walkAr[k], walkAr[k]]);
                station_edge_infos[walkAr[k]] = new Set();
            }
            for (let j = 0; j < walkAr.length; j++) {
                if (k != j) { station_edge_infos[walkAr[k]].add(WALK_CMD + walkAr[j]); }
            }
        }
    }

    station_selector_data.sort(function (a, b) {
        if (a[1] <= b[1]) {
            return -1;
        } else {
            return 1;
        }
    });

    all_station_count.textContent = "駅総数 : " + station_selector_data.length;

    //セレクター作成。
    for (var i = 0; i < station_selector_data.length; i++) {
        SetSelectorOption(selector_from, station_selector_data[i][0], i);
        SetSelectorOption(selector_to, station_selector_data[i][0], i);
    }

    if (urlopti["from"] || urlopti["to"]) {
        let from_ok = false;
        let to_ok = false;
        for (var i = 0; i < station_selector_data.length; i++) {
            if (urlopti["from"] == station_selector_data[i][0]) {
                selector_from.options.selectedIndex = i;
                from_ok = true;
            }
            if (urlopti["to"] == station_selector_data[i][0]) {
                selector_to.options.selectedIndex = i;
                to_ok = true;
            }
            if (from_ok && to_ok) {
                GuideCore();
                break;
            }
        }
    }
}
//core
function GuideCore() {
    let from_st = selector_from.selectedOptions[0].text;
    let to_st = selector_to.selectedOptions[0].text;

    //urlcreate
    let l_url = location.href.split('?')[0] + "?";
    let keys = Array.from(Object.keys(urlopti));
    for (var i = 0; i < keys.length; i++) {
        if (keys[i] != "from" && keys[i] != "to") {
            l_url += keys[i] + "=" + urlopti[keys[i]] + "&";
        }
    }
    l_url += "from=" + from_st + "&";
    l_url += "to=" + to_st;
    url_cr_res.href = l_url;
    url_cr_res.textContent = "検索結果のリンク";

    //init
    result_area.innerHTML = "";
    if (to_st == from_st) {
        result_area.innerHTML = "<b>Info : 駅が同じなので移動する必要はありません。</b>";
        return;
    }
    let result = [];
    //経路解析。
    CheckNodes(to_st, from_st, new Array(), result, 0);
    if (result.length == 0) {
        result_area.innerHTML = "<b>Info : 経路が見つかりませんでした。</b>";
        return;
    }
    final_data = [];
    //結果毎に路線解析
    for (var i = 0; i < result.length; i++) {
        let l_trains_data = [];
        RootParser(result[i], l_trains_data);
        final_data.push([result[i], l_trains_data[0]]);
    }
    let l_all_result_groups = final_data.length / RESULT_GROUP;
    AddElement(result_area, "b", "Result Group\u00a0:\u00a0");
    result_selector = AddElement(result_area, "select");
    AddElement(result_area, "br");
    for (let i = 0; i < l_all_result_groups; i++) {
        let l_first_s_num = i * RESULT_GROUP + 1;
        let l_last_s_num = (i + 1) * RESULT_GROUP;
        if (l_last_s_num > final_data.length) { l_last_s_num = final_data.length; }
        SetSelectorOption(result_selector, "経路 " + l_first_s_num + " ~ 経路 " + l_last_s_num);
    }
    AddElement(result_area, "b", "Sort Type\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0:\u00a0");
    let l_result_sort_selector = AddElement(result_area, "select");
    AddElement(result_area, "br");
    AddElement(result_area, "br");
    SetSelectorOption(l_result_sort_selector, "乗換数順", "CHA");
    SetSelectorOption(l_result_sort_selector, "駅数順", "STA");
    root_result_area = AddElement(result_area, "div");
    l_result_sort_selector.onchange = function () { SortResults(l_result_sort_selector.value); }
    result_selector.onchange = function () { ShowRootResults(result_selector.selectedIndex); }
    SortResults(l_result_sort_selector.value);
};

function SortResults(type) {
    if (type == "CHA") {
        final_data.sort(function (a, b) {
            if (a[1][0] > b[1][0]) {
                return 1;
            } else if (a[1][0] < b[1][0]) {
                return -1;
            }

            if (a[0].length > b[0].length) {
                return 1;
            } else {
                return -1;
            }
        });
    } else {
        final_data.sort(function (a, b) {
            if (a[0].length > b[0].length) {
                return 1;
            } else if (a[0].length < b[0].length) {
                return -1;
            }

            if (a[1][0] > b[1][0]) {
                return 1;
            } else {
                return -1;
            }
        });
    }
    //result_selector.selectedIndex = 0;
    result_selector.onchange();
}

function ShowRootResults(start) {
    root_result_area.innerHTML = "";
    for (var i = start * RESULT_GROUP; i < (start + 1) * RESULT_GROUP && i < final_data.length; i++) {
        let l_root_stations = final_data[i][0];
        let l_root_trains = final_data[i][1][1];
        let l_r_div = document.createElement("div");
        l_r_div.style.backgroundColor = "#F5F5F5";
        l_r_div.innerHTML = "経路 <b>" + (i + 1) + "</b> : 駅数 <b>" + l_root_stations.length + "</b> | 乗換数 <b>" + final_data[i][1][0] + "</b>";
        root_result_area.appendChild(l_r_div);
        let l_return_btn = AddElement(l_r_div, "b", "\u00a0\u00a0\u00a0\u00a0[TOPへ]", null, "color: red; font-size : 12px;");
        l_return_btn.onclick = function () { main_div.scrollIntoView(true); }
        AddElement(l_r_div, "br");
        for (var r = 0; r < l_root_trains.length; r++) {
            let l_train_o = null;
            if (l_root_trains[r] != WALK_CMD) {
                l_train_o = TrainObjMap[l_root_trains[r]];
            }

            //first
            if (r == 0) {
                if (l_root_trains[r] != WALK_CMD) {
                    CreateResult(l_r_div, l_train_o, l_root_stations[r], "乗車", l_train_o);
                } else {
                    CreateResult(l_r_div, WALK_CMD, l_root_stations[r]);
                }
            }

            //normal
            if (r > 0) {
                let l_pretrain_o = null;
                if (l_root_trains[r - 1] != WALK_CMD) {
                    l_pretrain_o = TrainObjMap[l_root_trains[r - 1]];
                }
                if (l_root_trains[r - 1] == l_root_trains[r]) {
                    CreateResult(l_r_div, l_pretrain_o, l_root_stations[r]);
                } else {
                    if (l_root_trains[r - 1] == WALK_CMD) {
                        CreateResult(l_r_div, WALK_CMD, l_root_stations[r], "乗車", l_train_o);
                    } else if (l_root_trains[r] == WALK_CMD) {
                        CreateResult(l_r_div, l_pretrain_o, l_root_stations[r], "降車");
                    } else {
                        if (!l_pretrain_o.Direct || !l_pretrain_o.Direct[l_root_trains[r]] || l_pretrain_o.Direct[l_root_trains[r]] != l_root_stations[r]) {
                            CreateResult(l_r_div, l_pretrain_o, l_root_stations[r], "乗換", l_train_o);
                        } else {
                            CreateResult(l_r_div, l_pretrain_o, l_root_stations[r], "直通", l_train_o);
                        }
                    }
                }
            }
            //last
            if (r == l_root_trains.length - 1) {
                if (l_root_trains[r] != WALK_CMD) {
                    CreateResult(l_r_div, l_train_o, l_root_stations[r + 1], "降車");
                } else {
                    CreateResult(l_r_div, WALK_CMD, l_root_stations[r + 1]);
                }
            }
        }//for root
        AddElement(root_result_area, "br");//space
    }
}

//路線データを解析。(再帰関数)
function RootParser(root, data, cache = null, index = 0, pretrain = null, _inited = false, change_c = 0) {
    cache = cache || [];
    if (index >= root.length - 1) {
        if (data[0]) {
            let vec = (check_chaos_mode.checked) ? -1 : 1;
            if (data[0][0] * vec > change_c * vec) {
                data[0] = [change_c, cache];
            }
        } else {
            data[0] = [change_c, cache];
        }
        return;
    }
    let l_trains_a = station_infos[root[index]];
    let l_trains_b = station_infos[root[index + 1]];
    let l_walks_a = GetWalkInfo(root[index]);
    let l_walk_data = null;
    if (l_walks_a != null) {
        l_walk_data = GetArraysSharedElements(l_walks_a, [root[index + 1]]);
    }
    let l_share_trains = GetArraysSharedElements(l_trains_a, l_trains_b);
    let l_trains_walks = [];
    if (l_share_trains != null) {
        l_trains_walks = l_trains_walks.concat(l_share_trains);
    }
    if (l_walk_data != null) { l_trains_walks.push(WALK_CMD); }
    for (var i = 0; i < l_trains_walks.length; i++) {
        let l_train_str = l_trains_walks[i];
        if (l_train_str != WALK_CMD) {
            //この電車にとって隣接駅であるか
            let l_train = TrainObjMap[l_train_str];
            let l_st_index_a = IndexOfStation(l_train, root[index]);
            let l_st_index_b = IndexOfStation(l_train, root[index + 1]);
            if (l_train.loop) {
                let l_loop_n = LoopNum(l_st_index_a + 1, 0, l_train.stations.length - 1);
                let l_loop_p = LoopNum(l_st_index_a - 1, 0, l_train.stations.length - 1);
                if (l_st_index_b != l_loop_n && l_st_index_b != l_loop_p) { continue; }
            } else {
                if (Math.abs(l_st_index_a - l_st_index_b) != 1) { continue; }
            }
        }

        let l_change_vec = 0;
        //路線変更カウント
        if (pretrain != null && pretrain != l_train_str) {
            if (pretrain != WALK_CMD && l_train_str != WALK_CMD) {
                let l_train_pre = TrainObjMap[pretrain];
                if (!l_train_pre.Direct || !l_train_pre.Direct[l_train_str] || l_train_pre.Direct[l_train_str] != root[index]) {
                    l_change_vec = 1;
                }
            } else {
                if (_inited) {
                    l_change_vec = 1;
                } else {
                    _inited = true;
                }
            }
        }
        let l_copy_cache = cache.slice();
        l_copy_cache.push(l_train_str);
        RootParser(root, data, l_copy_cache, index + 1, l_train_str, _inited, change_c + l_change_vec);
    }
}

function CreateResult(div, train, station, opt = null, subtrain = null) {
    var span = document.createElement("span");
    span.innerHTML = "";
    if (train != WALK_CMD) {
        var sta_info = IndexOfStation(train, station);
        //Idや■を追加
        if (train.id == "") {
            span.innerHTML += "<span style=\"color:" + train.color + ";\">■" + train.stations[sta_info][2] + "</span>";
        } else if (train.stations[sta_info][2] == "") {
            span.innerHTML += "<span style=\"color:" + train.color + ";\">■" + train.id + " </span>";
        } else {
            span.innerHTML += "<span style=\"color:" + train.color + ";\">■" + train.id + "-" + train.stations[sta_info][2] + "</span>";
        }
        //駅名を追加
        if (train.stations[sta_info][2] == "") {
            span.innerHTML += "<span title=\"" + train.stations[sta_info][1] + "\">" + station + "</span>";
        } else {
            span.innerHTML += "<span title=\"" + train.stations[sta_info][1] + "\">\t" + station + "</span>";
        }
    } else {
        span.innerHTML += "<span>●徒歩</span>\t<span title=\"" + GetRubyFromWalkStation(station) + "\">" + station + "</span>";
    }
    //情報を追加
    if (opt != null) { span.innerHTML += " <b><u>[" + opt + "]</u></b>"; }
    //他の路線の情報を追加
    if (subtrain != null) {
        span.innerHTML += " <span style=\"color:" + subtrain.color + ";\">■" + subtrain.id + ":" + subtrain.name + "</span>";
    }
    div.appendChild(span);
    AddElement(div, "br");
}

//経路解析
function CheckNodes(tar, now, checked, ok, ss) {
    checked.push(now);
    if (tar == now) {
        ok.push(checked);
        return;
    }
    if (ss >= 6000001) {
        console.log("stacking");
        return;
    }
    station_edge_infos[now].forEach(function (e) {
        if (checked.indexOf(e.replace(WALK_CMD, "")) == -1) {
            if (e.startsWith(WALK_CMD)) {
                if (!check_dont_use_walk.checked) {
                    CheckNodes(tar, e.replace(WALK_CMD, ""), checked.slice(), ok, ss + 1);
                }
            } else {
                CheckNodes(tar, e, checked.slice(), ok, ss + 1);
            }
        }
    });
}

function IndexOfStation(train, name) {
    for (var i = 0; train.stations.length; i++) {
        if (train.stations[i][0] == name) { return i; }
    }
    return -1;
}

function GetWalkInfo(station) {
    let res = [];
    for (var i = 0; i < walk_data.length; i++) {
        let tar = walk_data[i][0].indexOf(station);
        if (tar >= 0) {
            for (let k = 0; k < walk_data[i][0].length; k++) {
                if (k != tar) {
                    if (res.indexOf(walk_data[i][0][k]) == -1) {
                        res.push(walk_data[i][0][k]);
                    }
                }
            }
        }
    }
    if (res.length == 0) {
        return null;
    } else {
        return res;
    }
}

function GetRubyFromWalkStation(station) {
    let res = null;
    for (var i = 0; i < walk_data.length; i++) {
        let tar = walk_data[i][0].indexOf(station);
        if (tar >= 0) {
            res = walk_data[i][1][tar];
        }
    }
    return res;
}

function GetArraysSharedElements(arr1, arr2) {
    let res = [];
    if (arr1.length < arr2.length) {
        return GetArraysSharedElements(arr2, arr1);
    }
    for (var i = 0; i < arr1.length; i++) {
        if (arr2.indexOf(arr1[i]) >= 0) {
            res.push(arr1[i]);
        }
    }
    if (res.length == 0) {
        return null;
    } else {
        return res;
    }
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

//Element helper functions

function SetSelectorOption(selctor, text, val = null) {
    let opt = document.createElement("option");
    opt.text = text;
    if (val != null) { opt.value = val };
    selctor.appendChild(opt);
}

function AddElement(parent, tag, text = null, id = null, style = null) {
    let t = document.createElement(tag);
    if (text != null) { t.textContent = text; }
    if (id != null) { t.id = id; }
    if (style != null) { t.style = style; }
    parent.appendChild(t);
    return t;
}

function AddExCheckBox(parent, text, style = null) {
    let chb = AddElement(parent, "input");
    chb.type = "checkbox";
    let span_d = AddElement(parent, "span", text, null, style);
    span_d.onclick = function () { chb.checked = !chb.checked; }
    return chb;
}