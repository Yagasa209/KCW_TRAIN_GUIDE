
var trains = [];
//路線データ登録エリア
/* syntax :

trains.push({
    name : "name",
    display_name : "display_name",
    id : "id",
    color: "#00FF00",
    stations : [
        ["station1", "sort name", "num1"],
        ["station2", "sort name", "num2"],
    ],
    //opt
    Direct : { 
      "train" : "station",
    },
    loop : bool
});

*/

trains.push({
  name: "一村線",
  id: "IC",
  color: "#0099FF",
  stations: [
    ["戌月", "いぬづき", "04"],
    ["初原", "はつはら", "05"],
    ["一村", "いちむら", "06"],
    ["高台", "たかだい", "07"],
    ["金泉", "かないずみ", "08"],
    ["綺華", "きら", "09"],
    ["霜鯨", "しもくじら", "10"],
  ]
});

trains.push({
  name: "岸川線",
  id: "KW",
  color: "#339900",
  stations: [
    ["高台", "たかだい", "01"],
    ["岸川", "きしかわ", "02"],
    ["心愛", "ここあ", "03"],
    ["沼井", "ぬまい", "04"],
    ["金泉", "かないずみ", "05"],
    ["碑文田", "ひもんだ", "06"],
    ["新碑文田", "しんひもんだ", "07"],
    ["綺華", "きら", "08"],
    ["広川", "ひろかわ", "09"],
    ["霜鯨", "しもくじら", "10"],
  ],
  Direct: {
    "木津池線": "高台",
  }
});

trains.push({
  name: "木津池線",
  id: "ZC",
  color: "#FF5500",
  stations: [
    ["高台", "たかだい", "01"],
    ["北高台", "きたたかだい", "02"],
    ["鹿島", "かしま", "03"],
    ["赤沢", "あかざわ", "04"],
    ["雨取", "あまとり", "05"],
  ],
  Direct: {
    "岸川線": "高台",
  }
});

trains.push({
  name: "NetherExpA線",
  id: "A",
  color: "#FF00FF",
  stations: [
    ["茸之島", "たけのしま", "01"],
    ["中熱川", "なかあたがわ", "02"],
    ["メサランド", "めさらんど", "03"],
    ["海底神殿", "かいていしんでん", "04"],
    ["珊瑚口", "さんごぐち", "05"],
    ["高台", "たかだい", "06"],
    ["地終", "ちのばて", "07"],
    ["赤崎", "あかさき", "08"],
    ["アカシア山脈", "あかしあさんみゃく", "09"],
    ["要沼", "かなめぬま", "10"],
    ["森野城", "もりのじょう", "11"],
    ["黒丘公園", "くろおかこうえん", "12"],
    ["氷礁浜", "ひょうしょうはま", "13"],
    ["ESF基崎", "いーえすえふもとさき", "14"],
    ["冥ヶ原", "めいがはら", "15"],
    ["宇月", "うづき", "16"]
  ]
});

trains.push({
  name: "NetherExpB線",
  id: "B",
  color: "#0000FF",
  stations: [
    ["高台", "たかだい", "01"],
    ["深樹林", "しんじゅりん", "02"],
    ["元丘", "もとおか", "03"],
    ["海底神殿", "かいていしんでん", "04"],
    ["海中要塞", "かいちゅうようさい", "05"],
    ["第二海底神殿", "だいにかいていしんでん", "06"],
    ["シャーベットランド", "しゃーべっとらんど", "07"],
  ]
});

trains.push({
  name: "NetherExpC1線",
  display_name : "NetherExpC線",
  id: "C",
  color: "#00FF40",
  stations: [
    ["打羽", "うちばね", "03"],
    ["初春採石場", "ういはるさいせきじょう", "02"],
    ["高台", "たかだい", "01"],
  ]
});

trains.push({
  name: "NetherExpC2線",
  display_name : "NetherExpC線",
  id: "C",
  color: "#00FF40",
  stations: [
    ["海底神殿", "かいていしんでん", "51"],
    ["三ヶ槍", "さんがやり", "52"],
    ["海鉄村", "かいてつむら", "53"],
  ]
});

trains.push({
  name: "すいひん線",
  id: "SU",
  color: "#0060FF",
  stations: [
    ["高台", "たかだい", "10"],
    ["浮島", "うきしま", "11"],
    ["水谷", "みずたに", "12"],
    ["潤平", "うるひら", "13"],
    ["芦珂水郷", "ろかすいごう", "14"],
    ["幼潮", "さなしお", "15"],
    ["幼潮浦里", "さなしおうらさと", "16"],
    ["周央町", "すおうちょう", "17"],
    ["船見", "ふなみ", "18"],
    ["甘姫", "あまひめ", "19"],
    ["藍染", "あいぞめ", "20"],
    ["霜鯨", "しもくじら", "21"],
  ],
  Direct: {
    "桜庭線": "高台",
  }
});

trains.push({
  name: "桜庭線",
  id: "SK",
  color: "#FF66FF",
  stations: [
    ["明神市", "みょうじんし", "01"],
    ["花園城址公園", "はなぞのじょうしこうえん", "02"],
    ["福池", "ふくいけ", "03"],
    ["山入", "やまいり", "04"],
    ["勿咲", "なさき", "05"],
    ["漆ノ森", "しちのもり", "06"],
    ["草船", "くさぶね", "07"],
    ["初春", "ういはる", "08"],
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
    ["地終", "ちのばて", "15"],
    ["有明池田", "ありあけいけだ", "16"],
    ["有明沼影", "ありあけぬまかげ", "17"],
    ["有明秋山", "ありあけあきやま", "18"],
    ["有明白坂", "ありあけしらさか", "19"],
    ["紅葉谷", "もみじだに", "20"],
    ["有明村上", "ありあけむらかみ", "21"],
    ["赤崎", "あかさき", "22"],
  ],
  Direct: {
    "桜庭線": "高台",
  }
});

trains.push({
  name: "北海岸線",
  id: "KK",
  color: "#006699",
  stations: [
    ["鵺恋中央", "ぬえこいちゅうおう", "13"],
    ["本鵺恋", "ほんぬえこい", "14"],
    ["暁闇渓", "ぎょうあんだに", "15"],
    ["新碑文田", "しんひもんだ", "16"],
    ["新月町", "しんげつちょう", "17"],
    ["サウスサイドフロンティア", "さうすさいどふろんてぃあ", "18"],
  ],
  Direct: {
    "伊吹線": "鵺恋中央",
  }
});

trains.push({
  name: "雉鉄本線",
  id: "KH",
  color: "#006699",
  stations: [
    ["雉鉄高台", "きじてつたかだい", "01"],
    ["下ノ辻", "しものつじ", "02"],
    ["岸川", "きしかわ", "03"],
    ["坤果橋", "こうがばし", "04"],
    ["枯茶平", "かれちゃだいら", "05"],
    ["高嶺口", "たかねぐち", "06"],
    ["東御水池", "ひがしおみずいけ", "07"],
    ["鵺恋中央", "ぬえこいちゅうおう", "08"],
    ["守台", "もりだい", "09"],
  ],
});

trains.push({
  name: "ピリド線",
  id: "PR",
  color: "#999999",
  stations: [
    ["燧灘", "ひうちなだ", "1"],
    ["燧灘庁舎", "ひうちなだちょうしゃ", "2"],
    ["豆鳩公園", "まめはとこうえん", "3"],
    ["打羽", "うちばね", "4"],
    ["谷間村", "たにかんむら", "5"],
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
});

trains.push({
  name: "ケダマ村電線",
  id: "",
  color: "#C0C040",
  stations: [
    ["農場前", "のうじょうまえ", ""],
    ["ひまわりの里", "ひまわりのさと", ""],
    ["公民館", "こうみんかん", ""],
    ["旧蔗", "きゅうさとうきび", ""],
    ["キャンプ場前", "きゃんぷじょうまえ", ""],
    ["旅人", "たびびと", ""],
    ["農場裏", "のうじょううら", ""],
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
    ["明神", "みょうじん", "07"],
    ["東明神", "ひがしみょうじん", "08"],
  ]
});

trains.push({
  name: "琳廻線",
  id: "RK",
  color: "#515151",
  stations: [
    ["明神", "みょうじん", "01"],
    ["新明神", "しんみょうじん", "02"],
    ["南明神", "みなみみょうじん", "03"],
    ["守南花", "もりなか", "04"],
    ["白雪", "しらゆき", "05"],
    ["東明神", "ひがしみょうじん", "06"],
    ["森央", "しんおう", "07"],
    ["大空", "おおぞら", "08"],
  ],
  loop : true
});

trains.push({
  name: "彩麗線",
  id: "XI",
  color: "#0000FF",
  stations: [
    ["山吹", "やまぶき", "01"],
    ["牛込", "うしごめ", "02"],
    ["みかんの山", "みかんのやま", "03"],
    ["咲院", "さいん", "04"],
    ["静瀬津", "せいせつ", "05"],
    ["桃園", "ももぞの", "06"],
    ["来彩", "こさい", "07"],
    ["河間", "かわま", "08"],
    ["海音", "うみね", "09"],
    ["一条", "いちじょう", "10"],
    ["桜町", "さくらまち", "11"],
    ["天草", "あまくさ", "12"],
    ["千夜舞村", "ちやまむら", "13"],
    ["守南花", "もりなか", "14"],
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

trains.push({
  name: "藤和線",
  id: "TW",
  color: "#C0C040",
  stations: [
    ["戌月", "いぬづき", "10"],
    ["藤和", "とうわ", "11"],
    ["藤和湖", "とうわこ", "12"],
    ["赤沢", "あかざわ", "13"],
    ["鹿島", "かしま", "14"],
    ["漣", "さざなみ", "15"],
    ["燧灘", "ひうちなだ", "16"],
  ]
});

trains.push({
  name: "石鉄石花線",
  id: "IB",
  color: "#909090",
  stations: [
    ["ひまわりの里", "ひまわりのさと", "01"],
    ["菊舍", "きくやど", "02"],
    ["蓮水面台", "はすみなもだいえき", "03"],
    ["原雛", "はらびな", "04"],
    ["牡丹谷", "ぼたんだに", "05"],
    ["金香", "こんこう", "06"],
    ["ライラック公園", "らいらっくこうえん", "07"],
    ["矢車森林", "やぐるましんりん", "08"],
    ["寥鈴", "りょうりん", "09"],
    ["翡翠", "ひすい", "10"],
    ["薔薇高山", "ばらこうざん", "11"],
    ["白氷常磐", "はくひょうときわ", "12"],
  ]
});

trains.push({
  name: "雨虹線",
  id: "AN",
  color: "#995511",
  stations: [
    ["明神", "みょうじん", "01"],
    ["九条", "くじょう", "02"],
  ]
});


trains.push({
  name: "すばる高良電鉄1線",
  display_name : "すばる高良電鉄線",
  id: "",
  color: "#FFCC00",
  stations: [
    ["高嶺", "たかね", ""],
    ["何富何", "なんとか", ""],
  ]
});


trains.push({
  name: "すばる高良電鉄2線",
  display_name : "すばる高良電鉄線",
  id: "",
  color: "#FFCC00",
  stations: [
    ["金泉", "かないずみ", ""],
    ["珊瑚口", "さんごぐち", ""],
  ]
});

trains.push({
  name: "ライラック珊瑚線",
  id: "LS",
  color: "#004FFF",
  stations: [
    ["恋来", "こいらい", "01"],
    ["ライラック公園", "らいらっくこうえん", "02"],
  ]
});

trains.push({
  name: "ティンカーベルライン",
  id: "TB",
  color: "#FF9020",
  stations: [
    ["原雛", "はらびな", "1"],
    ["恋来", "こいらい", "2"],
    ["寥鈴", "りょうりん", "3"],
  ]
});

trains.push({
  name: "金時線",
  id: "KI",
  color: "#339966",
  stations: [
    ["雲鉄高台", "くもてつたかだい", "01"],
    ["霧原", "きりはら", "02"],
    ["皐月", "さつき", "03"],
    ["漣", "さざなみ", "04"],
    ["本栖", "もとす", "05"],
    ["打羽", "うちばね", "06"],
    ["檜原", "ひばら", "07"],
    ["有明秋山", "ありあけあきやま", "08"],
    ["中禅寺", "ちゅうぜんじ", "09"],
    ["知床競馬場", "しれとこけいばじょう", "10"],
  ]
});

trains.push({
  name: "伊吹線",
  id: "KB",
  color: "#339966",
  stations: [
    ["鵺恋中央", "ぬえこいちゅうおう", "01"],
    ["原雛", "はらびな", "02"],
    ["五色", "ごしき", "03"],
    ["芦野", "あしの", "04"],
    ["地終", "ちのばて", "05"],
    ["本栖", "もとす", "06"],
  ],
  Direct: {
    "北海岸線": "鵺恋中央",
  }
});

var walk_data = [];

/*
  徒歩圏内データ登録エリア
  syntax :
  
  walk_data.push([
    [station1, station2],
    [sort_name1, sort_name2],
  ]);
  
*/

walk_data.push([
  ["初原", "初春"],
  ["はつはら", "ういはる"],
]);

walk_data.push([
  ["珊瑚口", "周央町"],
  ["さんごぐち", "すおうちょう"],
]);

walk_data.push([
  ["初春採石場", "初春"],
  ["ういはるさいせきじょう", "ういはる"],
]);


walk_data.push([
  ["岸川", "矢野"],
  ["きしかわ", "やの"],
]);

walk_data.push([
  ["花園城址公園", "明神"],
  ["はのぞのじょうしこうえん", "みょうじん"],
]);

walk_data.push([
  ["高台", "雉鉄高台"],
  ["たかだい", "きじてつたかだい"],
]);

walk_data.push([
  ["高台", "雲鉄高台"],
  ["たかだい", "くもてつたかだい"],
]);

walk_data.push([
  ["雉鉄高台", "雲鉄高台"],
  ["きじてつたかだい", "くもてつたかだい"],
]);

walk_data.push([
  ["何富何", "高嶺口"],
  ["なんとか", "たかねぐち"],
]);