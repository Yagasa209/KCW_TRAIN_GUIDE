const g_Version = "0.30.0-rc1";

const RESULT_GROUP = 10;
const ROOT_LIMIT_RANGE = 15000;
const WALK_CMD = 16384; //　総路線数より十分に大きい。
const STATIONS_BUFF = 255; // 総駅数より十分に大きい。
const RESULT_BUFFER = 100000;

const main_div = AddElement(document.getElementById("guide_main"), "div", null, "background-color: #DDEEFF;");

// options
var check_dont_use_walk = null;
var check_dont_use_limit = null;
var selector_preprocess = null;
var selector_fast_mode = null;

// elements
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
var result_wait = null;

// Objects
var urlopti = null;
// 駅毎の、隣接駅の情報のMAP。
var station_edge_infos = null;
var walk_edge_infos = null;
var walk_ruby = null;
var station_id_to_name = null;
var station_name_to_id = null;
var stations_shared_train = null;
// 最終結果
var final_data = [];

var WarshallFloyd = null;
var flg_WarshallFloyded = false;

const PREPROCESS_DU = "DYNAMIC";
const PREPROCESS_WF = "WARSHALL";

const FAST_MODE_NONE = "NONE";
const FAST_MODE_LIT = "LITTLE";
const FAST_MODE_MID = "MIDDLE";
const FAST_MODE_BIG = "BIG";
var _Intl_Min_Range = 10;

function CreateMainForm() {
    main_div.textContent = null;
    AddElement(main_div, "p", "[乗り換え案内]", "font-weight: bold;");
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
    check_dont_use_limit = AddExCheckBox(main_div, " [解析数制限を解除(非推奨)]");
    AddElement(main_div, "br");
    AddElement(main_div, "b", "高速化方式: ");
    selector_preprocess = AddElement(main_div, "select");
    SetSelectorOption(selector_preprocess, "動的更新（非推奨）", PREPROCESS_DU);
    SetSelectorOption(selector_preprocess, "事前解析 (推奨)", PREPROCESS_WF);
    selector_preprocess.value = PREPROCESS_WF;
    AddElement(main_div, "br");
    AddElement(main_div, "b", "高速化形態: ");
    selector_fast_mode = AddElement(main_div, "select");
    SetSelectorOption(selector_fast_mode, "超高速-低精度", FAST_MODE_LIT);
    SetSelectorOption(selector_fast_mode, "高速(推奨)", FAST_MODE_MID);
    SetSelectorOption(selector_fast_mode, "高精度", FAST_MODE_BIG);
    SetSelectorOption(selector_fast_mode, "ロスレス(非推奨)", FAST_MODE_NONE);
    selector_fast_mode.value = FAST_MODE_MID;
    AddElement(main_div, "br");
    AddElement(main_div, "br");
    AddElement(main_div, "button", "検索する").onclick = PreGuideCore;
    AddElement(main_div, "button", "FromとToを入替", "margin-left: 25px;").onclick = function () {
        const l_from_s = selector_from.options.selectedIndex;
        selector_from.options.selectedIndex = selector_to.options.selectedIndex;
        selector_to.options.selectedIndex = l_from_s;
        const l_from_f = selector_from_filter.value;
        selector_from_filter.value = selector_to_filter.value;
        selector_to_filter.value = l_from_f;
        selector_from_filter.oninput(true);
        selector_to_filter.oninput(true);
    }
    AddElement(main_div, "br");
    result_wait = AddElement(main_div, "div");
    url_cr_res = AddElement(main_div, "a", "", "font-size: 11px; display: inline-block; margin-top: 13px;");
    result_area = AddElement(main_div, "div");
    AddElement(main_div, "br");

    if (typeof DataPatcher == 'function') { DataPatcher(); }
    AddElement(main_div, "span", "路線総数 : " + trains.length);
    AddElement(main_div, "br");
    all_station_count = AddElement(main_div, "span");
    AddElement(main_div, "br");
    AddElement(main_div, "br");
    AddElement(main_div, "span", "version : " + g_Version);
    AddElement(main_div, "br");
    AddElement(main_div, "b", "powered by theta");
}

//set up
function InitGuide() { // Call From LastLine
    CreateMainForm();
    urlopti = new Map();
    const pair = location.search.substring(1).split('&');
    for (let i = 0; pair[i]; i++) {
        const kv = pair[i].split('=');
        if (kv[0] == "nwalk") { check_dont_use_walk.checked = kv[1] == "1"; continue; }
        urlopti.set(kv[0], decodeURIComponent(kv[1]));
    }

    let station_selector_data = [];
    station_edge_infos = [];
    station_id_to_name = [];
    station_name_to_id = new Map();
    stations_shared_train = new Array(STATIONS_BUFF);
    WarshallFloyd = new Array(STATIONS_BUFF);
    for (let i = 0; i < STATIONS_BUFF; i++) {
        stations_shared_train[i] = new Array(STATIONS_BUFF);
        WarshallFloyd[i] = new Array(STATIONS_BUFF);
        for (let j = 0; j < STATIONS_BUFF; j++) {
            stations_shared_train[i][j] = new Set();
            WarshallFloyd[i][j] = STATIONS_BUFF; // fast
        }
    }
    let station_id = 0;
    // 路線データから駅を調べる。
    for (let i = 0; i < trains.length; i++) {
        trains[i].station_index = new Array(STATIONS_BUFF);
        for (let g = 0; g < trains[i].stations.length; g++) {
            let now = 0;
            if (!station_name_to_id.has(trains[i].stations[g][0])) {
                station_id++;
                now = station_id;
                station_selector_data.push([trains[i].stations[g][0], trains[i].stations[g][1]]);
                station_edge_infos[now] = new Set();
                station_id_to_name[now] = trains[i].stations[g][0];
                station_name_to_id.set(trains[i].stations[g][0], now);
            } else {
                now = station_name_to_id.get(trains[i].stations[g][0]);
            }
            if (g - 1 >= 0) {
                let l_targ = station_name_to_id.get(trains[i].stations[g - 1][0]);
                station_edge_infos[now].add(l_targ); // g - 1　は保証済み
                station_edge_infos[l_targ].add(now);
                stations_shared_train[now][l_targ].add(i);
                stations_shared_train[l_targ][now].add(i);
                WarshallFloyd[now][l_targ] = 1;
                WarshallFloyd[l_targ][now] = 1;
            }
            trains[i].station_index[now] = g;
        }
        if (trains[i].direct) {
            let l_dirkey = Object.keys(trains[i].direct);
            trains[i].direct_station = new Set();
            for (let d = 0; d < l_dirkey.length; d++) {
                trains[i].direct_station.add(station_name_to_id.get(trains[i].direct[l_dirkey[d]]));
            }
        }
        if (trains[i].loop) { // id振り分け終了後
            let l_targ_1 = station_name_to_id.get(trains[i].stations[0][0]);
            let l_targ_2 = station_name_to_id.get(trains[i].stations[trains[i].stations.length - 1][0]);
            station_edge_infos[l_targ_1].add(l_targ_2);
            station_edge_infos[l_targ_2].add(l_targ_1);
            stations_shared_train[l_targ_1][l_targ_2].add(i);
            stations_shared_train[l_targ_2][l_targ_1].add(i);
            WarshallFloyd[l_targ_1][l_targ_2] = 1;
            WarshallFloyd[l_targ_2][l_targ_1] = 1;
        }
    }
    walk_edge_infos = [];
    walk_ruby = new Map();
    for (let i = 0; i < walk_data.length; i++) {
        const walkAr = walk_data[i][0]
        for (let k = 0; k < walkAr.length; k++) {
            const l_name = walkAr[k];
            let now = 0;
            if (!station_name_to_id.has(l_name)) {
                station_id++;
                now = station_id;
                station_selector_data.push([l_name, walk_data[i][1][k]]);
                station_name_to_id.set(l_name, now);
            } else {
                now = station_name_to_id.get(l_name);
            }
            if (!walk_edge_infos[now]) {
                walk_edge_infos[now] = new Set();
                walk_ruby.set(l_name, walk_data[i][1][k]);
            }
        }
        for (let k = 0; k < walkAr.length; k++) {
            for (let j = 0; j < walkAr.length; j++) {
                if (k != j) {
                    let l_targ_1 = station_name_to_id.get(walkAr[k]);
                    let l_targ_2 = station_name_to_id.get(walkAr[j]);
                    walk_edge_infos[l_targ_1].add(l_targ_2);
                    WarshallFloyd[l_targ_1][l_targ_2] = 1;
                    WarshallFloyd[l_targ_2][l_targ_1] = 1;
                }
            }
        }
    }

    station_selector_data.sort(function (a, b) { return (a[1] <= b[1]) ? -1 : 1; });

    all_station_count.textContent = "駅総数 : " + station_selector_data.length;

    // セレクター作成。
    // Todo :  via, "指定しない"をfilter時に消さない
    // SetSelectorOption(selector_via, "*指定しない", "NONE", "していしない");
    for (let i = 0; i < station_selector_data.length; i++) {
        const sel_data = station_selector_data[i];
        SetSelectorOption(selector_from, sel_data[0], i, sel_data[1]);
        SetSelectorOption(selector_to, sel_data[0], i, sel_data[1]);
        // SetSelectorOption(selector_via, sel_data[0], i, sel_data[1]);
    }
    const handle_selector_filter = function (selector, filter, keepInx = false) {
        let first = -1;
        for (let i = 0; i < selector.options.length; i++) {
            var opt = selector.options[i];
            if (opt.getAttribute("data").startsWith(filter) || opt.textContent.startsWith(filter)) { // ok
                opt.style.display = "";
                opt.disabled = false;
                if (first == -1) { first = i; }
            } else { // bad
                opt.style.display = "none";
                opt.disabled = true;
            }
        }
        selector.disabled = first == -1;
        if (!keepInx) { selector.selectedIndex = first; }
    }
    selector_from_filter.oninput = function (kp) { handle_selector_filter(selector_from, selector_from_filter.value, kp == true); };
    selector_to_filter.oninput = function (kp) { handle_selector_filter(selector_to, selector_to_filter.value, kp == true); };
    // selector_via_filter.oninput = function () { handle_selector_filter(selector_via, selector_via_filter.value); };

    if (urlopti.has("from") || urlopti.has("to")) {
        const from_val = urlopti.get("from");
        const l_sta_inx_from = station_selector_data.findIndex(function (x) {
            return x[0] == from_val;
        });
        if (l_sta_inx_from >= 0) {
            selector_from.options.selectedIndex = l_sta_inx_from;
        }
        const to_val = urlopti.get("to");
        const l_sta_inx_to = station_selector_data.findIndex(function (x) {
            return x[0] == to_val;
        });
        if (l_sta_inx_to >= 0) {
            selector_to.options.selectedIndex = l_sta_inx_to;
        }
        if (l_sta_inx_from >= 0 && l_sta_inx_to >= 0) { PreGuideCore(); }
    }
}

// core
var flg_guide_gurd = false;
async function PreGuideCore() {
    if (flg_guide_gurd) { return; }
    flg_guide_gurd = true;
    result_wait.textContent = null;
    result_area.textContent = null;
    url_cr_res.textContent = null;
    AddElement(result_wait, "b", "検索中です...");
    try {
        await new Promise(function (res, rej) {
            setTimeout(function () {
                GuideCore();
                res();
            }, 1); // hack;
        });
    } catch (exp) {
        alert("Error: \n" + exp);
    }
    result_wait.textContent = null;;
    flg_guide_gurd = false;
}
function GuideCore() {
    // init
    final_data = null; // mem free
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
    const keys = Array.from(urlopti.keys());
    for (let i = 0; i < keys.length; i++) {
        if (keys[i] != "from" && keys[i] != "to") {
            l_url += keys[i] + "=" + urlopti.get(keys[i]) + "&";
        }
    }
    l_url += "from=" + from_st + "&" + "to=" + to_st;
    from_st = station_name_to_id.get(from_st);
    to_st = station_name_to_id.get(to_st);
    if (check_dont_use_walk.checked) { l_url += "&nwalk=1"; }
    url_cr_res.href = l_url;
    url_cr_res.textContent = "検索結果のリンク";
    switch(selector_fast_mode.value){
        case FAST_MODE_NONE: _Intl_Min_Range = STATIONS_BUFF; break;
        case FAST_MODE_LIT: _Intl_Min_Range = 5; break;
        case FAST_MODE_MID: _Intl_Min_Range = 10; break;
        case FAST_MODE_BIG: _Intl_Min_Range = 20; break;
    }
    console.log("============================================");
    console.time("PRE-PROCESS");
    switch (selector_preprocess.value) {
        case PREPROCESS_DU: _Check_nodes_min = STATIONS_BUFF; break;
        case PREPROCESS_WF:
            {
                if (!flg_WarshallFloyded) {
                    for (let l_wk = 0; l_wk < STATIONS_BUFF; l_wk++)
                        for (let l_wi = 0; l_wi < STATIONS_BUFF; l_wi++)
                            for (let l_wj = 0; l_wj < STATIONS_BUFF; l_wj++)
                                WarshallFloyd[l_wi][l_wj] = Math.min(WarshallFloyd[l_wi][l_wj], WarshallFloyd[l_wi][l_wk] + WarshallFloyd[l_wk][l_wj]);
                    flg_WarshallFloyded = true;
                }
                _Check_nodes_min = WarshallFloyd[from_st][to_st]
            }
            break;
    }
    console.timeEnd("PRE-PROCESS")
    console.time("CHECK-NODES");
    let result = new Array(RESULT_BUFFER);
    // 経路解析。
    CheckNodes(to_st, from_st, new Array(station_id_to_name.length), new BitFlg(station_id_to_name.length + 2), result);
    console.timeEnd("CHECK-NODES");
    // if (selector_via.value != "NONE") {
    //     result = result.filter(function (x) { return x.includes(l_via_sta); });
    // }
    if (_Check_nodes_pos == 0) {
        AddElement(result_area, "b", "Info : 経路が見つかりませんでした。");
        return;
    }
    console.log("SHORTEST PATH:", _Check_nodes_min);
    console.log("RAW ROOT RESULT:", _Check_nodes_pos);
    if (!check_dont_use_limit.checked && _Check_nodes_pos > ROOT_LIMIT_RANGE * 2) {
        result.sort(function (a, b) {
            return a.length - b.length;
        })
        let l_spl_1 = result.slice(0, ROOT_LIMIT_RANGE);
        let l_spl_2 = result.slice(_Check_nodes_pos - ROOT_LIMIT_RANGE);
        result = l_spl_1.concat(l_spl_2);
        _Check_nodes_pos = ROOT_LIMIT_RANGE * 2;
    }
    console.time("ROOT-PARSE")
    final_data = new Array(_Check_nodes_pos);
    // 結果毎に路線解析
    for (let i = 0; i < _Check_nodes_pos; i++) {
        let l_trains_data = [];
        RootParser(result[i], l_trains_data);
        final_data[i] = [result[i], l_trains_data[0], i];
    }
    console.timeEnd("ROOT-PARSE");
    const l_all_result_groups = final_data.length / RESULT_GROUP;
    console.log("TOTAL DFS CALL:", __DBG_Check_nodes_call);
    AddElement(result_area, "b", "Result Group : ");
    result_selector = AddElement(result_area, "select");
    AddElement(result_area, "br");
    for (let i = 0; i < l_all_result_groups; i++) {
        const l_first_s_num = i * RESULT_GROUP + 1;
        let l_last_s_num = (i + 1) * RESULT_GROUP;
        if (l_last_s_num > final_data.length) { l_last_s_num = final_data.length; }
        SetSelectorOption(result_selector, "経路 " + l_first_s_num + " ~ 経路 " + l_last_s_num);
    }
    AddElement(result_area, "b", "Sort Type :", "margin-right: 35px; margin-top: 15px;");
    const l_result_sort_selector = AddElement(result_area, "select", null, "margin-top: 15px;");
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
            return (a[0].length > b[0].length) ? 1 : -1;
        });
    } else if (type == "STA") {
        final_data.sort(function (a, b) {
            if (a[0].length > b[0].length) {
                return 1;
            } else if (a[0].length < b[0].length) {
                return -1;
            }
            return (a[1][0] > b[1][0]) ? 1 : -1;
        });
    } else {
        final_data.sort(function (a, b) { return a[2] - b[2]; });
    }
    result_selector.onchange();
}

function ShowRootResults(start) {
    root_result_area.textContent = null;
    for (let i = start * RESULT_GROUP; i < (start + 1) * RESULT_GROUP && i < final_data.length; i++) {
        const l_root_stations = final_data[i][0];
        const l_root_trains = final_data[i][1][1];
        const l_r_div = AddElement(root_result_area, "div", null, "background-color: #F2F2F2; margin: 8px 2px 0; outline: solid black 2px;");
        let l_return_btn = AddElement(root_result_area, "b", "[TOP]", "cursor: pointer; color: red; font-size: 12px;");
        l_return_btn.onclick = function () { main_div.scrollIntoView(true); }
        AddElement(l_r_div, "b", "[経路 " + (i + 1) + "]\t駅数 " + l_root_stations.length + " | 乗換数 " + final_data[i][1][0], "display: inline-block;");
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
                        CreateResult(l_r_div, l_pretrain_o, l_root_stations[r], "降車", WALK_CMD);
                    } else {
                        if (!l_pretrain_o.direct || !l_pretrain_o.direct[l_train_o.name] || l_pretrain_o.direct[l_train_o.name] != station_id_to_name[l_root_stations[r]]) {
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
    }
}

// 路線データを解析。(再帰関数)
function RootParser(root, data, cache = null, index = 0, pretrain = null, _inited = false, change_c = 0) {
    cache = cache || new Array(root.length - 1);
    if (data[0] != undefined && data[0][0] < change_c) {
        return;
    }
    if (index >= root.length - 1) {
        if (data[0] == undefined || (data[0][0] > change_c)) {
            data[0] = [change_c, cache.slice()];
        }
        return;
    }
    // 駅間共通路線&徒歩検証
    let l_trains_walks;
    while (true) { //　行けるところまで同一路線で行く
        l_trains_walks = stations_shared_train[root[index]][root[index + 1]]; // 共通
        if (pretrain != WALK_CMD && pretrain != null && trains[pretrain].direct_station != undefined && trains[pretrain].direct_station.has(root[index])) { break; } // directが厄介
        if (
            (pretrain == WALK_CMD && !check_dont_use_walk.checked && walk_edge_infos[root[index]] && walk_edge_infos[root[index]].has(root[index + 1])) ||
            (pretrain != null && l_trains_walks.has(pretrain))
        ) {
            cache[index] = pretrain;
            if (index + 1 < root.length - 1) {
                index++;
            } else {
                RootParser(root, data, cache, index + 1, pretrain, _inited, change_c);
                return;
            }
        } else {
            break;
        }
    }

    if (!check_dont_use_walk.checked && walk_edge_infos[root[index]] && walk_edge_infos[root[index]].has(root[index + 1])) { l_trains_walks.add(WALK_CMD); }
    for (l_train_inx of l_trains_walks) {
        const l_train = trains[l_train_inx];
        if (l_train_inx != WALK_CMD) {
            // この電車にとって隣接駅であるか
            if (!stations_shared_train[root[index]][root[index + 1]].has(l_train_inx)) { return; }
        }

        let l_change_vec = 0;
        // 路線変更カウント
        if (pretrain != null && pretrain != l_train_inx) {
            if (pretrain != WALK_CMD && l_train_inx != WALK_CMD) {
                const l_train_pre = trains[pretrain];
                if (!l_train_pre.direct || !l_train_pre.direct[l_train.name] || l_train_pre.direct[l_train.name] != station_id_to_name[root[index]]) {
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
        cache[index] = l_train_inx;
        RootParser(root, data, cache, index + 1, l_train_inx, _inited, change_c + l_change_vec);
    }
}

function CreateResult(div, train, station_id, opt = null, subtrain = null) {
    let station = station_id_to_name[station_id];
    const l_par = AddElement(div, "div");
    if (train != WALK_CMD) {
        const sta_info = train.stations[train.station_index[station_id]];
        // Idや■を追加
        if (train.id == "") { // no tr id
            AddElement(l_par, "span", "■" + sta_info[2] + "\t", "color: " + train.color);
        } else if (sta_info[2] == "") { // has tr id, no sta id
            AddElement(l_par, "span", "■" + train.id + "\t", "color: " + train.color);
        } else {
            AddElement(l_par, "span", "■" + train.id + "-" + sta_info[2] + "\t", "color: " + train.color);
        }
        // 駅名を追加
        AddElement(l_par, "span", station).title = sta_info[1];
    } else {
        AddElement(l_par, "span", "●徒歩\t");
        AddElement(l_par, "span", station).title = walk_ruby.get(station);
    }
    // 情報を追加
    if (opt != null) {
        const opt_span = AddElement(l_par, "span", null, "display: inline-block;");
        AddElement(opt_span, "span", "[" + opt + "]", "font-weight: bold; margin: 0 5px;");
        // 他の路線の情報を追加
        if (subtrain == WALK_CMD) {
            AddElement(opt_span, "span", "●徒歩\t");
        }
        else if (subtrain != null) {
            if (subtrain.id != "") {
                AddElement(opt_span, "span", "■" + subtrain.id + ":" + (subtrain.display_name || subtrain.name), "color:" + subtrain.color);
            }
            else {
                AddElement(opt_span, "span", "■" + (subtrain.display_name || subtrain.name), "color:" + subtrain.color);
            }
        }
    }
}

var _Check_nodes_min = STATIONS_BUFF;
var _Check_nodes_pos = 0;
var __DBG_Check_nodes_call = 0;
//経路解析
function CheckNodes(tar, now, checked, flg, ok, sinx = 0) {
    if (sinx == 0) {
        __DBG_Check_nodes_call = 0;
        _Check_nodes_pos = 0;
    }
    __DBG_Check_nodes_call++;
    checked[sinx] = now;
    flg.set(now);
    if (tar == now) {
        if (_Check_nodes_pos >= RESULT_BUFFER) {
            ok.push(checked.slice(0, sinx + 1));
        } else {
            ok[_Check_nodes_pos] = checked.slice(0, sinx + 1);
        }
        _Check_nodes_pos++;
        _Check_nodes_min = Math.min(_Check_nodes_min, sinx);
        return;
    }
    if (sinx >= _Check_nodes_min + _Intl_Min_Range) { return; }
    if (sinx > STATIONS_BUFF) {
        console.warn("stacked : ", tar, now);
        return;
    }
    if (station_edge_infos[now]) {
        for (let e of station_edge_infos[now]) {
            if (!flg.get(e)) { CheckNodes(tar, e, checked, flg.copy(), ok, sinx + 1); }
        }
    }
    if (!check_dont_use_walk.checked && walk_edge_infos[now]) {
        for (let e of walk_edge_infos[now]) {
            if (!flg.get(e)) { CheckNodes(tar, e, checked, flg.copy(), ok, sinx + 1); }
        };
    }
}

function InxIncrLoop(arr, inx, incr = true) {
    incr ? inx++ : inx--;
    if (inx >= arr.length) { return 0; }
    else if (inx < 0) { return arr.length - 1; }
    else { return inx; }
}

class BitFlg {
    constructor(cap) {
        this.LIMIT = 30;
        if (typeof cap == "number") {
            const len = Math.ceil(cap / this.LIMIT) + 1;
            this.bits = new Array(len);
            for (let i = 0; i < len; i++) this.bits[i] = 0;
        }
        else this.bits = cap.slice();
    }
    set(dig) {
        const section = Math.floor(dig / this.LIMIT);
        const bit = dig % this.LIMIT;
        this.bits[section] |= 1 << bit;
    }
    get(dig) {
        const section = Math.floor(dig / this.LIMIT);
        const bit = dig % this.LIMIT;
        return (this.bits[section] & 1 << bit) == 1 << bit;
    }
    copy() {
        return new BitFlg(this.bits);
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
    let span_d = AddElement(parent, "b", text, style);
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