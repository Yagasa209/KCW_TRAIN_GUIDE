const g_Version = "0.20.0-beta-9";

const RESULT_GROUP = 10;
const WALK_CMD = 16384;

const main_div = AddElement(document.getElementById("guide_main"), "div", null, "background-color: #DDEEFF;");

//options
var check_dont_use_walk = null;
var check_chaos_mode = null;

//elements
var selector_from = null;
var selector_from_filter = null;
var selector_to = null;
var selector_to_filter = null
// var selector_via = null;
// var selector_via_filter = null;
var result_area = null;
var url_cr_res = null;
var all_station_count = null;
var root_result_area = null;
var result_selector = null;

//Objects
var urlopti = null;
//駅毎の、その駅に止まる列車の情報のMAP。
var station_infos = null;
//駅毎の、隣接駅の情報のMAP。
var station_edge_infos = null;
var walk_edge_infos = null;
var walk_ruby = null;
//最終結果
var final_data = [];

function CreateMainForm() {
    let ok = typeof trains != 'undefined';
    main_div.textContent = null;
    AddElement(main_div, "p", "[乗り換え案内]", "font-weight: bold;");
    if (!ok) {
        AddElement(main_div, "p", "古いバージョンです。");
        AddElement(main_div, "span", "管理者は更新してください。");
        AddElement(main_div, "br");
        AddElement(main_div, "span", "利用者はハードリロードをしてみると更新されるかもしれません。");
    } else {
        AddElement(main_div, "b", "From:");
        AddElement(main_div, "br");
        selector_from = AddElement(main_div, "select");
        AddElement(main_div, "br");
        selector_from_filter = AddTextBox(main_div, "filter")
        AddElement(main_div, "br");
        AddElement(main_div, "b", "To:");
        AddElement(main_div, "br");
        selector_to = AddElement(main_div, "select");
        AddElement(main_div, "br");
        selector_to_filter = AddTextBox(main_div, "filter");
        AddElement(main_div, "br");
        // AddElement(main_div, "b", "経由:");
        // AddElement(main_div, "br");
        // selector_via = AddElement(main_div, "select");
        // AddElement(main_div, "br");
        // selector_via_filter = AddTextBox(main_div, "filter");
        AddElement(main_div, "br");
        check_dont_use_walk = AddExCheckBox(main_div, " [歩く経路を含まない]");
        AddElement(main_div, "br");
        check_chaos_mode = AddExCheckBox(main_div, " [強引に乗換数を増やす]");
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
        url_cr_res = AddElement(main_div, "a", "", "font-size : 11px");
        AddElement(main_div, "br");
        result_area = AddElement(main_div, "div");

        if (typeof DataPatcher == 'function') { DataPatcher(); }
        AddElement(main_div, "span", "路線総数 : " + trains.length);
        AddElement(main_div, "br");
        all_station_count = AddElement(main_div, "span");
    }

    AddElement(main_div, "br");
    AddElement(main_div, "br");
    AddElement(main_div, "span", "version : " + g_Version);
    AddElement(main_div, "br");
    AddElement(main_div, "b", "powered by theta");
    return ok;
}

//set up
function InitGuide() { // Call From LastLine
    if (CreateMainForm()) {
        urlopti = new Map();
        let pair = location.search.substring(1).split('&');
        for (var i = 0; pair[i]; i++) {
            let kv = pair[i].split('=');
            if (kv[0] == "chaos") { check_chaos_mode.checked = kv[1] == "1"; continue; }
            if (kv[0] == "nwalk") { check_dont_use_walk.checked = kv[1] == "1"; continue; }
            urlopti.set(kv[0], decodeURIComponent(kv[1]));
        }

        let station_selector_data = [];
        station_infos = new Map();
        station_edge_infos = new Map();
        //路線データから駅を調べる。
        for (var i = 0; i < trains.length; i++) {
            for (let g = 0; g < trains[i].stations.length; g++) {
                let name = trains[i].stations[g][0];
                if (!station_infos.has(name)) {
                    station_infos.set(name, []);
                    station_selector_data.push([name, trains[i].stations[g][1]]);
                    station_edge_infos.set(name, new Set());
                }
                station_infos.get(name).push(i);
                if (g - 1 >= 0) {
                    station_edge_infos.get(name).add(trains[i].stations[g - 1][0]);
                } else if (trains[i].loop) {
                    station_edge_infos.get(name).add(trains[i].stations[trains[i].stations.length - 1][0]);
                }
                if (g + 1 < trains[i].stations.length) {
                    station_edge_infos.get(name).add(trains[i].stations[g + 1][0]);
                } else if (trains[i].loop) {
                    station_edge_infos.get(name).add(trains[i].stations[0][0]);
                }
            }
        }
        walk_edge_infos = new Map();
        walk_ruby = new Map();
        for (var i = 0; i < walk_data.length; i++) {
            let walkAr = walk_data[i][0]
            for (let k = 0; k < walkAr.length; k++) {
                let l_name = walkAr[k];
                if (!station_infos.has(l_name)) {
                    station_infos.set(l_name, []); // dummy
                    station_selector_data.push([l_name, walk_data[i][1][k]]);
                }
                if (!walk_edge_infos.has(l_name)) {
                    walk_edge_infos.set(l_name, new Set());
                    walk_ruby.set(l_name, walk_data[i][1][k]);
                }
                for (let j = 0; j < walkAr.length; j++) {
                    if (k != j) { walk_edge_infos.get(l_name).add(walkAr[j]); }
                }
            }
        }

        station_selector_data.sort(function (a, b) {
            if (a[1] <= b[1]) { return -1; }
            else { return 1; }
        });

        all_station_count.textContent = "駅総数 : " + station_selector_data.length;

        // セレクター作成。
        // Todo :  via, "指定しない"をfilter時に消さない
        // SetSelectorOption(selector_via, "*指定しない", "NONE", "していしない");
        for (var i = 0; i < station_selector_data.length; i++) {
            var sel_data = station_selector_data[i];
            SetSelectorOption(selector_from, sel_data[0], i, sel_data[1]);
            SetSelectorOption(selector_to, sel_data[0], i, sel_data[1]);
            // SetSelectorOption(selector_via, sel_data[0], i, sel_data[1]);
        }
        var handle_selector_filter = function (selector, filter) {
            var first = -1;
            for (var i = 0; i < selector.options.length; i++) {
                var opt = selector.options[i];
                if (opt.getAttribute("data").startsWith(filter) || opt.textContent.startsWith(filter)) { // ok
                    opt.style.display = "";
                    opt.disabled = false;
                    if (first == -1) { first = i; }
                } else {
                    opt.style.display = "none";
                    opt.disabled = true;
                }
            }
            selector.selectedIndex = first;
        }
        selector_from_filter.oninput = function () { handle_selector_filter(selector_from, selector_from_filter.value); };
        selector_to_filter.oninput = function () { handle_selector_filter(selector_to, selector_to_filter.value); };
        // selector_via_filter.oninput = function () { handle_selector_filter(selector_via, selector_via_filter.value); };

        if (urlopti.has("from") || urlopti.has("to")) {
            let l_sta_inx_from = station_selector_data.findIndex(function (x) {
                return x[0] == urlopti.get("from");
            });
            if (l_sta_inx_from >= 0) {
                selector_from.options.selectedIndex = l_sta_inx_from;
            }
            let l_sta_inx_to = station_selector_data.findIndex(function (x) {
                return x[0] == urlopti.get("to");
            });
            if (l_sta_inx_to >= 0) {
                selector_to.options.selectedIndex = l_sta_inx_to;
            }
            if (l_sta_inx_from >= 0 && l_sta_inx_to >= 0) { GuideCore(); }
        }
    }
}
// core
function GuideCore() {
    // init
    result_area.textContent = null;
    let from_st = null;
    let to_st = null;
    let st_get_faild = false;
    if (selector_from.selectedOptions[0] != undefined) {
        from_st = selector_from.selectedOptions[0].text;
    } else {
        AddElement(result_area, "b", "Error : From を指定してください。");
        AddElement(result_area, "br");
        st_get_faild = true;
    }

    if (selector_to.selectedOptions[0] != undefined) {
        to_st = selector_to.selectedOptions[0].text;
    } else {
        AddElement(result_area, "b", "Error : To を指定してください。");
        AddElement(result_area, "br");
        st_get_faild = true;
    }

    // Todo
    // let l_via_sta = selector_via.selectedOptions[0].text;
    if (st_get_faild) { return; }

    if (to_st == from_st) {
        AddElement(result_area, "b", "Info : 駅が同じなので移動する必要はありません。");
        return;
    }

    // urlcreate
    let l_url = location.href.split('?')[0] + "?";
    let keys = Array.from(urlopti.keys());
    for (var i = 0; i < keys.length; i++) {
        if (keys[i] != "from" && keys[i] != "to") {
            l_url += keys[i] + "=" + urlopti.get(keys[i]) + "&";
        }
    }
    l_url += "from=" + from_st + "&" + "to=" + to_st;
    if (check_chaos_mode.checked) { l_url += "&chaos=1"; }
    if (check_dont_use_walk.checked) { l_url += "&nwalk=1"; }
    url_cr_res.href = l_url;
    url_cr_res.textContent = "検索結果のリンク";

    let result = [];
    // 経路解析。
    CheckNodes(to_st, from_st, new Array(), result, 0);
    // if (selector_via.value != "NONE") {
    //     result = result.filter(function (x) { return x.includes(l_via_sta); });
    // }
    if (result.length == 0) {
        AddElement(result_area, "b", "Info : 経路が見つかりませんでした。");
        return;
    }
    final_data = [];
    // 結果毎に路線解析
    for (var i = 0; i < result.length; i++) {
        let l_trains_data = [];
        RootParser(result[i], l_trains_data);
        final_data.push([result[i], l_trains_data[0], i]);
    }
    let l_all_result_groups = final_data.length / RESULT_GROUP;
    AddElement(result_area, "b", "Result Group : ");
    result_selector = AddElement(result_area, "select");
    AddElement(result_area, "br");
    AddElement(result_area, "br");
    for (let i = 0; i < l_all_result_groups; i++) {
        let l_first_s_num = i * RESULT_GROUP + 1;
        let l_last_s_num = (i + 1) * RESULT_GROUP;
        if (l_last_s_num > final_data.length) { l_last_s_num = final_data.length; }
        SetSelectorOption(result_selector, "経路 " + l_first_s_num + " ~ 経路 " + l_last_s_num);
    }
    AddElement(result_area, "b", "Sort Type\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0: ");
    let l_result_sort_selector = AddElement(result_area, "select");
    AddElement(result_area, "br");
    AddElement(result_area, "br");
    SetSelectorOption(l_result_sort_selector, "乗換数順", "CHA");
    SetSelectorOption(l_result_sort_selector, "駅数順", "STA");
    SetSelectorOption(l_result_sort_selector, "算出順", "RAW");
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

            if (a[0].length > b[0].length) { return 1; }
            else { return -1; }
        });
    } else if (type == "STA") {
        final_data.sort(function (a, b) {
            if (a[0].length > b[0].length) {
                return 1;
            } else if (a[0].length < b[0].length) {
                return -1;
            }

            if (a[1][0] > b[1][0]) { return 1; }
            else { return -1; }
        });
    } else {
        final_data.sort(function (a, b) { return a[2] - b[2]; });
    }
    result_selector.onchange();
}

function ShowRootResults(start) {
    root_result_area.textContent = null;
    for (var i = start * RESULT_GROUP; i < (start + 1) * RESULT_GROUP && i < final_data.length; i++) {
        let l_root_stations = final_data[i][0];
        let l_root_trains = final_data[i][1][1];
        let l_r_div = AddElement(root_result_area, "div", null, "background-color: #F1F1F1");
        AddElement(l_r_div, "b", "[経路 " + (i + 1) + "]\t駅数 " + l_root_stations.length + " | 乗換数 " + final_data[i][1][0]);
        let l_return_btn = AddElement(l_r_div, "b", "\u00a0\u00a0\u00a0\u00a0[TOPへ]", "color: red; font-size : 12px;");
        l_return_btn.onclick = function () { main_div.scrollIntoView(true); }
        AddElement(l_r_div, "br");
        for (var r = 0; r < l_root_trains.length; r++) {
            let l_train_o = null;
            if (l_root_trains[r] != WALK_CMD) {
                l_train_o = trains[l_root_trains[r]];
            }

            // first
            if (r == 0) {
                if (l_root_trains[r] != WALK_CMD) {
                    CreateResult(l_r_div, l_train_o, l_root_stations[r], "乗車", l_train_o);
                } else {
                    CreateResult(l_r_div, WALK_CMD, l_root_stations[r]);
                }
            }

            // normal
            if (r > 0) {
                let l_pretrain_o = null; // error checker
                if (l_root_trains[r - 1] != WALK_CMD) {
                    l_pretrain_o = trains[l_root_trains[r - 1]];
                }
                if (l_root_trains[r - 1] == l_root_trains[r]) {
                    CreateResult(l_r_div, l_pretrain_o || WALK_CMD, l_root_stations[r]);
                } else {
                    if (l_root_trains[r - 1] == WALK_CMD) {
                        CreateResult(l_r_div, WALK_CMD, l_root_stations[r], "乗車", l_train_o);
                    } else if (l_root_trains[r] == WALK_CMD) {
                        CreateResult(l_r_div, l_pretrain_o, l_root_stations[r], "降車");
                    } else {
                        if (!l_pretrain_o.Direct || !l_pretrain_o.Direct[l_train_o.name] || l_pretrain_o.Direct[l_train_o.name] != l_root_stations[r]) {
                            CreateResult(l_r_div, l_pretrain_o, l_root_stations[r], "乗換", l_train_o);
                        } else {
                            CreateResult(l_r_div, l_pretrain_o, l_root_stations[r], "直通", l_train_o);
                        }
                    }
                }
            }
            // last
            if (r == l_root_trains.length - 1) {
                if (l_root_trains[r] != WALK_CMD) {
                    CreateResult(l_r_div, l_train_o, l_root_stations[r + 1], "降車");
                } else {
                    CreateResult(l_r_div, WALK_CMD, l_root_stations[r + 1]);
                }
            }
        } // for root
        AddElement(root_result_area, "br"); // space
    }
}

// 路線データを解析。(再帰関数)
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
    // 駅間共通路線&徒歩検証
    let l_trains_walks = GetArraysSharedElements(station_infos.get(root[index]), station_infos.get(root[index + 1]));
    let l_has_walk = walk_edge_infos.get(root[index]);
    if (l_has_walk != undefined && l_has_walk.has(root[index + 1])) { l_trains_walks.push(WALK_CMD); }
    for (var i = 0; i < l_trains_walks.length; i++) {
        let l_train_inx = l_trains_walks[i];
        let l_train = trains[l_train_inx];
        if (l_train_inx != WALK_CMD) {
            // この電車にとって隣接駅であるか
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
        // 路線変更カウント
        if (pretrain != null && pretrain != l_train_inx) {
            if (pretrain != WALK_CMD && l_train_inx != WALK_CMD) {
                let l_train_pre = trains[pretrain];
                if (!l_train_pre.Direct || !l_train_pre.Direct[l_train.name] || l_train_pre.Direct[l_train.name] != root[index]) {
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
        let l_copy_cache = cache.concat([l_train_inx]);
        RootParser(root, data, l_copy_cache, index + 1, l_train_inx, _inited, change_c + l_change_vec);
    }
}

function CreateResult(div, train, station, opt = null, subtrain = null) {
    let l_par = AddElement(div, "span");
    if (train != WALK_CMD) {
        let sta_info = IndexOfStation(train, station);
        // Idや■を追加
        if (train.id == "") { // no tr id
            AddElement(l_par, "span", "■" + train.stations[sta_info][2] + "\t", "color: " + train.color);
        } else if (train.stations[sta_info][2] == "") { // has tr id, no sta id
            AddElement(l_par, "span", "■" + train.id + "\t", "color: " + train.color);
        } else {
            AddElement(l_par, "span", "■" + train.id + "-" + train.stations[sta_info][2] + "\t", "color: " + train.color);
        }
        // 駅名を追加
        AddElement(l_par, "span", station).title = train.stations[sta_info][1];
    } else {
        AddElement(l_par, "span", "●徒歩\t");
        AddElement(l_par, "span", station).title = walk_ruby.get(station);
    }
    // 情報を追加
    if (opt != null) {
        AddElement(l_par, "span", "\t[" + opt + "]", "font-weight: bold;");
    }
    // 他の路線の情報を追加
    if (subtrain != null) {
        if (subtrain.id != "") {
            AddElement(l_par, "span", "\t■" + subtrain.id + ":" + (subtrain.display_name || subtrain.name), "color:" + subtrain.color);
        }
        else { AddElement(l_par, "span", "\t■" + (subtrain.display_name || subtrain.name), "color:" + subtrain.color); }
    }
    AddElement(div, "br");
}

//経路解析
function CheckNodes(tar, now, checked, ok, ss) {
    checked.push(now);
    if (tar == now) {
        ok.push(checked);
        return;
    }
    if (ss > 6000000) {
        console.warn("stacking");
        return;
    }
    let l_has_it = station_edge_infos.get(now);
    if (l_has_it != undefined) {
        l_has_it.forEach(function (e) {
            if (!checked.includes(e)) { CheckNodes(tar, e, checked.slice(), ok, ss + 1); }
        });
    }
    l_has_it = walk_edge_infos.get(now);
    if (!check_dont_use_walk.checked && l_has_it != undefined) {
        l_has_it.forEach(function (e) {
            if (!checked.includes(e)) { CheckNodes(tar, e, checked.slice(), ok, ss + 1); }
        });
    }
}

function IndexOfStation(train, name) {
    return train.stations.findIndex(function (x) { return x[0] == name; });
}

function GetArraysSharedElements(arr1, arr2) {
    return arr1.filter(function (x) { return arr2.includes(x); });
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

// Element helper functions

function SetSelectorOption(selctor, text, val = null, data = null) {
    let opt = document.createElement("option");
    opt.text = text;
    if (data != null) { opt.setAttribute("data", data) };
    if (val != null) { opt.value = val };
    selctor.appendChild(opt);
}

function AddElement(parent, tag, text = null, style = null) {
    let t = document.createElement(tag);
    if (text != null) { t.textContent = text; }
    if (style != null) { t.style = style; }
    parent.appendChild(t);
    return t;
}

function AddExCheckBox(parent, text, style = null) {
    let chb = AddElement(parent, "input");
    chb.type = "checkbox";
    let span_d = AddElement(parent, "span", text, style);
    span_d.onclick = function () { chb.checked = !chb.checked; }
    return chb;
}

function AddTextBox(parent, placeholder = null, style = null) {
    let tex = AddElement(parent, "input", null, style);
    tex.type = "text";
    tex.placeholder = placeholder;
    return tex;
}

InitGuide();