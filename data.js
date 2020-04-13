
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

//0
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
    ["珊瑚口", "さんごぐち", "09"],
  ]
});

//1
trains.push({
  name: "岸川線",
  id: "KW",
  color: "#339900",
  stations: [
    ["金泉", "かないずみ", "01"],
    ["沼井", "ぬまい", "02"],
    ["心愛", "ここあ", "03"],
    ["岸川", "きしかわ", "04"],
    ["高台", "たかだい", "06"],
    ["北高台", "きたたかだい", "07"],
    ["牛巻", "うしまき", "08"],
  ]
});

//2
trains.push({
  name: "高野線",
  id: "TN",
  color: "#00FF00",
  stations: [
    ["赤沢", "あかざわ", "01"],
    ["砂口", "すなぐち", "02"],
    ["北一村", "きたいちむら", "03"],
    ["一村", "いちむら", "04"],
    ["ファミリーマート", "ふぁみりーまーと", "05"],
    ["商店街前", "しょうてんがいまえ", "06"],
    ["高台", "たかだい", "07"],
    ["高台拠点前", "たかだいきょてんまえ", "08"],
    ["矢野", "やの", "09"],
  ],
  Direct: {
    "金剛線": "矢野",
  }
});


//3
trains.push({
  name: "ネザーエクスプレスA線",
  id: "A",
  color: "#FF00FF",
  stations: [
    ["メサランド", "めさらんど", "01"],
    ["海底神殿", "かいていしんでん", "02"],
    ["珊瑚口", "さんごぐち", "03"],
    ["高台", "たかだい", "04"],
    ["地終", "ちのばて", "05"],
    ["赤崎", "あかさき", "06"],
    ["アカシア山脈", "あかしあさんみゃく", ""],
    ["要沼", "かなめぬま", "07"],
    ["森野城", "もりのじょう", "08"],
    ["黒丘公園", "くろおかこうえん", "09"],
    ["氷礁浜", "ひょうしょうはま", "10"],
    ["ESF基崎", "いーえすえふもとさき", "11"],
    ["冥ヶ原", "めいがはら", "12"]
  ]
});

//4
trains.push({
  name: "ネザーエクスプレスB線",
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

//5
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
    "雉鉄南線": "新碑文田",
  }
});

//6
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

//7
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
  ],
  Direct: {
    "桜庭線": "高台",
  }
});

//8
trains.push({
  name: "雉鉄南線",
  id: "KH",
  color: "#006699",
  stations: [
    // ["鵺恋", "ぬえこい", "14"],
    // ["暁闇渓", "ぎょうあんだに", "15"],
    ["新碑文田", "しんひもんだ", "16"],
    ["新月町", "しんげつちょう", "17"],
    ["サウスサイドフロンティア", "さうすさいどふろんてぃあ", "18"],
  ],
});

//9
trains.push({
  name: "雉鉄北線",
  id: "KH",
  color: "#006699",
  stations: [
    ["鵺恋", "ぬえこい", "14"],
    ["暁闇渓", "ぎょうあんだに", "15"],
    ["新碑文田", "しんひもんだ", "16"],
    // ["新月町", "しんげつちょう", "17"],
    // ["サウスサイドフロンティア", "さうすさいどふろんてぃあ", "18"],
  ],
});

//10
trains.push({
  name: "雉鉄東線",
  id: "KH",
  color: "#006699",
  stations: [
    ["下ノ辻", "しものつじ", "02"],
    ["岸川", "きしかわ", "03"],
    ["坤果橋", "こうがばし", "04"],
    ["枯茶平", "かれちゃだいら", "05"]
  ],
});

//11
trains.push({
  name: "ピリド線",
  id: "PR",
  color: "#999999",
  stations: [
    ["燧灘", "ひうちなだ", "1"],
    ["燧灘庁舎", "ひうちなだちょうしゃ", "2"],
    ["豆鳩公園", "まめはとこうえん", "3"]
  ]
});

//12
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

//13
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
    ["旅人", "たびびと", ""],
    ["農場裏", "のうじょううら", ""],
  ],
  loop: true,
});

//14
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
    ["新明神", "しんみょうじん", "08"],
    ["南明神", "みなみみょうじん", "09"],
    ["守南花", "もりなか", "10"],
  ]
});

//15
trains.push({
  name: "市鉄西線",
  id: "",
  color: "#0000FF",
  stations: [
    ["山吹", "やまぶき", ""],
    ["牛込", "うしごめ", ""],
  ]
});

//16
trains.push({
  name: "市鉄東線",
  id: "",
  color: "#0000FF",
  stations: [
    ["千夜舞村", "ちやまむら", ""],
    ["守南花", "もりなか", ""],
  ]
});

//17
trains.push({
  name: "海底神殿線",
  id: "",
  color: "#000000",
  stations: [
    ["海底神殿", "かいていしんでん", ""],
    ["海上ポート", "かいじょうぽーと", ""],
  ]
});

//18
trains.push({
  name: "藤和線",
  id: "TW",
  color: "#C0C040",
  stations: [
    ["戌月", "いぬづき", "10"],
    ["藤和", "とうわ", "11"],
    ["藤和湖", "とうわこ", "12"],
    ["赤沢", "あかざわ", "13"],
    ["牛巻", "うしまき", "14"],
    ["漣", "さざなみ", "15"],
    ["燧灘", "ひうちなだ", "16"],
  ]
});

//19
trains.push({
  name: "石花線",
  id: "IB",
  color: "#909090",
  stations: [
    ["ひまわりの里", "ひまわりのさと", "01"],
    ["菊舍", "きくやど", "02"]
  ]
});

//19
trains.push({
  name: "雨虹線",
  id: "AN",
  color: "#995511",
  stations: [
    ["明神", "みょうじん", "01"],
    ["九条", "くじょう", "02"]
  ]
});