const g_Version = "0.10b";

const RESULT_TOPS = 8;
const RESULT_WORSTS = 4;

const WALK_CMD = "%%WALK_DATA%%";

const main_div = document.getElementById("guide_main");

//options
var check_show_full_data = null;
var check_dont_use_walk = null;
var check_chaos_mode = null;

//elements
var selector_from = null;
var selector_to = null;
var result_area = null;
var url_cr_res = null;

//Objects
var urlopti = null;
//駅毎の、その駅に止まる列車の情報の配列。
var station_infos = null;

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
        check_show_full_data = AddExCheckBox(main_div, "全ての結果を表示");
        AddElement(main_div, "br");
        check_dont_use_walk = AddExCheckBox(main_div, "歩くルートを含まない");
        AddElement(main_div, "br");
        check_chaos_mode = AddExCheckBox(main_div, "強引に乗換数を増やす");
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
        AddElement(main_div, "br");
        url_cr_res = AddElement(main_div, "a", "", null, "font-size : 11px");
        result_area = AddElement(main_div, "div");
        if (typeof DataPatcher != 'undefined') {
            DataPatcher();
        }
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


    for (var i = 0; i < walk_data.length; i++) {
        for (var k = 0; k < walk_data[i][0].length; k++) {
            if (!station_infos[walk_data[i][0][k]]) {
                station_selector_data.push([walk_data[i][0][k], walk_data[i][1][k]]);
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

    //セレクター作成。
    for (var i = 0; i < station_selector_data.length; i++) {
        SetSelectorOption(selector_from, i, station_selector_data[i][0]);
        SetSelectorOption(selector_to, i, station_selector_data[i][0]);
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
        result_area.textContent = "駅が同じなので乗り換えは必要ありません。";
        return;
    }
    let result = [];
    //経路解析。
    CheckNodes(to_st, from_st, new Array(), from_st, result, 0);
    if (result.length == 0) {
        result_area.textContent = "駅が繋がっていないので乗り継ぎ出来ません。";
        return;
    }
    let final_data = [];
    //結果毎に路線解析
    for (var i = 0; i < result.length; i++) {
        let r_ar = result[i].split(",");
        let debug = [];
        let data = RootParser(r_ar, debug);
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

    let is_overlength = final_data.length > RESULT_TOPS + RESULT_WORSTS;
    //全ての結果を表示しない。
    if (!check_show_full_data.checked && is_overlength) {
        let baselen = final_data.length;
        let top = final_data.slice(0, RESULT_TOPS);
        let worst = final_data.slice(baselen - RESULT_WORSTS, baselen);
        final_data = top;
        final_data = final_data.concat(worst);
        AddElement(result_area, "span", baselen + "件中" + final_data.length + "件を表示中", null, "font-size: 12px; color: red;");
        AddElement(result_area, "br");
    } else {
        AddElement(result_area, "span", final_data.length + "件の結果", null, "font-size: 12px; color: red;");
        AddElement(result_area, "br");
    }
    //結果の表示と、乗り換えなどの検出。
    for (var i = 0; i < final_data.length; i++) {
        if (!check_show_full_data.checked && is_overlength) {
            if (i == 0) {
                AddElement(result_area, "span", "####有用な経路####", null, "font-size: 15px; color: blue;");
                AddElement(result_area, "br");
            } else if (i == RESULT_TOPS) {
                AddElement(result_area, "span", "####回り道経路####", null, "font-size: 15px; color: red;");
                AddElement(result_area, "br");
            }
        }
        let r_ar = final_data[i][0];
        let data = final_data[i][1];
        let div = document.createElement("div");
        div.style.backgroundColor = "#F1F1F1";
        div.innerHTML = "経路 <b>" + (i + 1) + "</b> : 駅数 " + r_ar.length + " / 乗り換え数 " + data[data.length - 1] + "<br>"
        result_area.appendChild(div);
        for (var r = 0; r < data.length - 1; r++) {
            let l_train_o = null;
            if (data[r] != WALK_CMD) {
                l_train_o = GetTrainByName(data[r]);
            }

            //first
            if (r == 0) {
                if (data[r] != WALK_CMD) {
                    CreateResult(div, l_train_o, r_ar[r], "乗車", l_train_o);
                } else {
                    CreateResult(div, WALK_CMD, r_ar[r]);
                }
            }

            //normal
            if (r > 0) {
                let l_pretrain_o = null;
                if (data[r - 1] != WALK_CMD) {
                    l_pretrain_o = GetTrainByName(data[r - 1]);
                }
                if (data[r - 1] == data[r]) {
                    CreateResult(div, l_pretrain_o, r_ar[r]);
                } else {
                    if (data[r - 1] == WALK_CMD) {
                        CreateResult(div, WALK_CMD, r_ar[r], "乗車", l_train_o);
                    } else if (data[r] == WALK_CMD) {
                        CreateResult(div, l_pretrain_o, r_ar[r], "降車");
                    } else {
                        if (!l_pretrain_o.Direct || !l_pretrain_o.Direct[data[r]] || l_pretrain_o.Direct[data[r]] != r_ar[r]) {
                            CreateResult(div, l_pretrain_o, r_ar[r], "乗換", l_train_o);
                        } else {
                            CreateResult(div, l_pretrain_o, r_ar[r], "直通", l_train_o);
                        }
                    }
                }
            }
            //最終要素は乗換カウントである。
            //last
            if (r == data.length - 2) {
                if (data[r] != WALK_CMD) {
                    CreateResult(div, l_train_o, r_ar[r + 1], "降車");
                } else {
                    CreateResult(div, WALK_CMD, r_ar[r + 1]);
                }
            }

        }//for root

        result_area.appendChild(document.createElement("br"));
    }
};

//路線データを解析。(再帰関数)
function RootParser(root, data, cache = "", index = 0, pretrain = null, _inited = false, change_c = 0) {
    data = data || [];
    if (index >= root.length - 1) {
        data.push(cache + "," + change_c);
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
    if (l_walk_data != null) {
        l_trains_walks.push(WALK_CMD);
    }
    for (var i = 0; i < l_trains_walks.length; i++) {
        let l_train_str = l_trains_walks[i];
        if (l_train_str != WALK_CMD) {
            //この電車にとって隣接駅であるか
            let l_train = GetTrainByName(l_train_str);
            let l_st_index_a = IndexOfStation(l_train, root[index]);
            let l_st_index_b = IndexOfStation(l_train, root[index + 1]);
            if (l_train.loop) {
                let l_loop_n = LoopNum(l_st_index_a + 1, 0, l_train.stations.length - 1);
                let l_loop_p = LoopNum(l_st_index_a - 1, 0, l_train.stations.length - 1);
                if (l_st_index_b != l_loop_n && l_st_index_b != l_loop_p) {
                    continue;
                }
            } else {
                if (Math.abs(l_st_index_a - l_st_index_b) != 1) {
                    continue;
                }
            }
        }

        let l_change_vec = 0;
        //路線変更カウント
        if (pretrain != null && pretrain != l_train_str) {
            if (pretrain != WALK_CMD && l_train_str != WALK_CMD) {
                let l_train_pre = GetTrainByName(pretrain);
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
        RootParser(root, data, cache + "," + l_train_str, index + 1, l_train_str, _inited, change_c + l_change_vec);
    }
    if (index == 0) {
        let l_base = 999999999;
        if (check_chaos_mode.checked) {
            l_base = -1;
        }
        let l_ind = 0;
        for (var i = 0; i < data.length; i++) {
            let l_data_split = data[i].split(",");
            let l_num = parseInt(l_data_split[l_data_split.length - 1]);
            if (check_chaos_mode.checked) {
                if (l_num > l_base) {
                    l_base = l_num
                    l_ind = i;
                }
            } else {
                if (l_num < l_base) {
                    l_base = l_num
                    l_ind = i;
                }
            }
        }
        return data[l_ind].replace(/^,/, "").split(",");
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
    if (opt != null) {
        span.innerHTML += " <b><u>[" + opt + "]</u></b>";
    }
    //他の路線の情報を追加
    if (subtrain != null) {
        span.innerHTML += " <span style=\"color:" + subtrain.color + ";\">■" + subtrain.id + ":" + subtrain.name + "</span>";
    }
    div.appendChild(span);
    div.appendChild(document.createElement("br"));
}

//経路解析
//TODO: bit列を用いたメモリ抑制。
function CheckNodes(tar, now, checked, nowres, ok, ss) {
    checked.push(now);
    if (tar == now) {
        ok.push(nowres);
        return;
    }
    if (ss >= 10000001) {
        console.log("stacking");
        return;
    }
    let edges = GetEdgesByStation(now);
    for (var i = 0; i < edges.length; i++) {
        if (checked.indexOf(edges[i]) == -1) {
            CheckNodes(tar, edges[i], checked.slice(), nowres + "," + edges[i], ok, ss + 1);
        }
    }
}

//路線を無視した隣接駅検索。
function GetEdgesByStation(name) {
    let res = [];
    if (!check_dont_use_walk.checked) {
        let walks = GetWalkInfo(name);
        if (walks != null) {
            res = res.concat(walks);
        }
    }
    for (var i = 0; i < station_infos[name].length; i++) {
        let train = GetTrainByName(station_infos[name][i]);
        let index = IndexOfStation(train, name);
        if (train.loop == true) {
            let i_temp = LoopNum(index - 1, 0, train.stations.length - 1);
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

function GetWalkInfo(station) {
    let res = [];
    for (var i = 0; i < walk_data.length; i++) {
        let tar = walk_data[i][0].indexOf(station);
        if (tar >= 0) {
            for (var k = 0; k < walk_data[i][0].length; k++) {
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

function SetSelectorOption(selctor, val, text) {
    let opt = document.createElement("option");
    opt.value = val;
    opt.text = text;
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

function AddExCheckBox(parent, text) {
    let chb = AddElement(parent, "input");
    chb.type = "checkbox";
    let span_d = AddElement(main_div, "span", text);
    span_d.onclick = function () { chb.checked = !chb.checked; }
    return chb;
}