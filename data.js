
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
    direct : { 
      "train" : "station",
    },
    loop : bool
});

*/

trains.push({
  name: "一村線全線",
  display_name : "一村線",
  id: "IC",
  color: "#0099FF",
  stations: [
    ["仙河", "せんが", "01"],
    ["擶野", "たまの", "02"],
    ["瑠璃野", "るりの", "03"],
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
  name: "一村線直通用",
  display_name : "一村線",
  id: "IC",
  color: "#0099FF",
  stations: [
    ["擶野", "たまの", "02"],
    ["瑠璃野", "るりの", "03"],
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
  name: "快北線",
  id: "IC",
  color: "#FF0000",
  stations: [
    ["錦木", "にしきぎ", "51"],
    ["擶野", "たまの", "02"],
  ],
  direct: {
    "一村線直通用": "擶野",
  }
});

trains.push({
  name: "岸川線全線",
  display_name : "一村線",
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
  direct: {
    "木津池線": "高台",
  }
});

trains.push({
  name: "岸川線直通用",
  display_name : "岸川線",
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
  ],
  direct: {
    "木津池線": "高台",
  }
});

trains.push({
  name: "藤和線",
  id: "TW",
  color: "#C0C040",
  stations: [
    ["仙河", "せんが", "01"],
    ["毛屋", "けや", "02"],
    ["百舌鳥岸", "もずぎし", "03"],
    ["擶野", "たまの", "04"],
    ["十倉", "とくら", "05"],
    ["唐垣", "からがき", "06"],
    ["瑠璃野", "るりの", "07"],
    ["冠風", "かむりかぜ", "08"],
    ["本柚", "もとゆず", "09"],
    ["戌月", "いぬづき", "10"],
    ["藤和", "とうわ", "11"],
    ["赤沢鹿島", "あかざわかしま", "12"],
    ["漣", "さざなみ", "13"],
    ["燧灘", "ひうちなだ", "14"],
  ]
});

trains.push({
  name: "桜庭線",
  id: "SK",
  color: "#FF66FF",
  stations: [
    ["明神市", "みょうじんし", "01"],
    ["花園城址公園", "はなぞのじょうしこうえん", "02"],
    ["桜見丘", "さくらみおか", "03"],
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
  name: "仙高本線",
  id: "SK",
  color: "#0000CC",
  stations: [
    ["明神市", "みょうじんし", "01"],
    ["虎川", "とらかわ", "51"],
    ["楡野", "にれの", "52"],
    ["毛屋", "けや", "53"],
    ["仙河", "せんが", "54"],
  ],
  direct: {
    "桜庭線": "明神市",
  }
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
  direct: {
    "桜庭線": "高台",
  }
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
  direct: {
    "桜庭線": "高台",
  }
});

trains.push({
  name: "木津池線",
  id: "ZC",
  color: "#FF5500",
  stations: [
    ["高台", "たかだい", "01"],
    ["北高台", "きたたかだい", "02"],
    ["赤沢鹿島", "あかざわかしま", "03"],
    ["雨取", "あまとり", "04"],
    ["伊吹", "いぶき", "05"],
    ["北伊吹", "きたいぶき", "06"],
    ["小豆沢", "あずさわ", "07"],
    ["蔵間", "くらま", "08"],
    ["一柳", "ひとつやなぎ", "09"],
    ["みのり木下", "みのりきのした", "10"],
  ],
  direct: {
    "岸川線": "高台",
  }
});

trains.push({
  name: "照井浜線",
  id: "TR",
  color: "#FF8110",
  stations: [
    ["苺氷", "いちごおり", "01"],
    ["碓氷", "うすい", "02"],
    ["北瑠璃野", "きたるりの", "03"],
    ["瑠璃野", "るりの", "04"],
    ["唐垣", "からがき", "05"],
    ["枢池", "くるるいけ", "06"],
    ["宮尾", "みやお", "07"],
    ["照井", "てるい", "08"],
    ["朝井", "あさい", "09"],
    ["紡木町", "つむぎちょう", "10"],
    ["桜見丘", "さくらみおか", "11"],
    ["一軒在家", "いっけんざいけ", "12"],
    ["桜町", "さくらまち", "13"],
    ["後桜町", "ごさくらまち", "14"],
    ["海咲野", "みさきの", "15"],
    ["波稲", "はいね", "16"],
  ]
});

trains.push({
  name: "ローゼンライン",
  id: "RM",
  color: "#990000",
  stations: [
    ["紅摘", "ぐつみ", "05"],
    ["苺野", "いちごの", "06"],
    ["綺華", "きら", "07"],
  ],
  direct: {
    "岸川線直通用": "綺華",
  }
});

trains.push({
  name: "銀木線",
  id: "KG",
  color: "#339966",
  stations: [
    ["銀鏡", "しろみ", "01"],
    ["美甘蓮實", "みかもはすみ", "02"],
    ["樽前", "たるまえ", "03"],
    ["石蕗", "つわぶき", "04"],
    ["うみがめ海岸", "うみがめかいがん", "05"],
    ["錦木", "にしきぎ", "06"],
  ]
});

trains.push({
  name: "鴻江線",
  id: "NE",
  color: "#FF9999",
  stations: [
    ["錦木", "にしきぎ", ""],
    ["三保田", "みほた", ""],
    ["快草玉城", "よぐたまき", ""],
    ["仙河", "せんが", ""],
  ]
});

trains.push({
  name: "柳樽線",
  id: "GT",
  color: "#9999FF",
  stations: [
    ["苺氷", "いちごおり", ""],
    ["西日岡", "にしひおか", ""],
    ["東日岡", "ひがしひおか", ""],
    ["来夏", "こなつ", ""],
    ["円池", "まるいけ", ""],
    ["美甘蓮實", "みかもはすみ", ""],
    ["樽前", "たるまえ", ""],
    ["石蕗", "つわぶき", ""],
    ["うみがめ海岸", "うみがめかいがん", ""],
    ["錦木", "にしきぎ", ""],
    ["三保田", "みほた", ""],
    ["快草玉城", "よぐたまき", ""],
    ["仙河", "せんが", ""],
  ]
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
    ["一柳", "ひとつやなぎ", "09"],
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
  name: "NetherExpC2線",
  display_name : "NetherExpC線",
  id: "C",
  color: "#00FF40",
  stations: [
    ["海底神殿", "かいていしんでん", "01"],
    ["三ヶ槍", "さんがやり", "02"],
    ["海鉄村", "かいてつむら", "03"],
  ]
});

trains.push({
  name: "NetherExpD線",
  id: "D",
  color: "#339966",
  stations: [
    ["船見", "ふなみ", "01"],
    ["緋ヶ丘", "あかがおか", "02"],
    ["地終", "ちのばて", "03"],
    ["伊吹", "いぶき", "04"],
    ["菖蒲", "しょうぶ", "05"],
    ["樽前", "たるまえ", "06"],
    ["霧原", "きりはら", "07"],
  ]
});

trains.push({
  name: "NetherExpE線",
  id: "E",
  color: "#339966",
  stations: [
    ["高台", "たかだい", "01"],
    ["伊吹", "いぶき", "02"],
    ["打羽", "うちばね", "03"],
    ["競馬場前", "けいばじょうまえ", "04"],
    ["遊行", "ゆぎょう", "05"],
    ["四季咲", "しきざき", "06"],
  ]
});

trains.push({
  name: "雉鉄本線",
  id: "KH",
  color: "#006699",
  stations: [
    ["高台", "たかだい", "01"],
    ["下ノ辻", "しものつじ", "02"],
    ["岸川", "きしかわ", "03"],
    ["坤果橋", "こうがばし", "04"],
    ["枯茶平", "かれちゃだいら", "05"],
    ["高嶺口", "たかねぐち", "06"],
    ["東御水池", "ひがしおみずいけ", "07"],
    ["鵺恋中央", "ぬえこいちゅうおう", "08"],
    ["守台", "もりだい", "09"],
    ["蛇番", "へびばん", "10"],
    ["紅摘台", "ぐつみだい", "11"],
  ],
});

trains.push({
  name: "海岸線",
  id: "KK",
  color: "#006699",
  stations: [
    ["鵺恋中央", "ぬえこいちゅうおう", "01"],
    ["暁闇渓【休止中】", "ぎょうあんだに", "--"],
    ["新碑文田", "しんひもんだ", "02"],
    ["新月町", "しんげつちょう", "03"],
    ["船見", "ふなみ", "04"],
  ],
  direct: {
    "伊吹線": "鵺恋中央",
  }
});

trains.push({
  name: "金時線",
  id: "KI",
  color: "#339966",
  stations: [
    ["高台", "たかだい", "01"],
    ["珠洲", "すず", "02"],
    ["皐月", "さつき", "03"],
    ["漣", "さざなみ", "04"],
    ["本栖", "もとす", "05"],
    ["打羽", "うちばね", "06"],
    ["檜原", "ひばら", "07"],
    ["有明秋山", "ありあけあきやま", "08"],
    ["中禅寺", "ちゅうぜんじ", "09"],
    ["競馬場前", "けいばじょうまえ", "10"],
    ["石廊", "いろう", "11"],
    ["三代", "みつしろ", "12"],
    ["汐景", "しおかげ", "13"],
    ["遊行", "ゆぎょう", "14"],
    ["夏泊", "なつどまり", "15"],
    ["都井", "とい", "16"],
    ["四季咲", "しきざき", "17"],
    ["大瀬", "おおぜ", "18"],
  ]
});

trains.push({
  name: "伊吹線",
  id: "KB",
  color: "#339966",
  stations: [
    ["鵺恋中央", "ぬえこいちゅうおう", "01"],
    ["緋ヶ丘", "あかがおか", "02"],
    ["五色", "ごしき", "03"],
    ["久川", "ひさかわ", "04"],
    ["地終", "ちのばて", "05"],
    ["本栖", "もとす", "06"],
    ["苗場", "なえば", "07"],
    ["伊吹", "いぶき", "08"],
    ["黒檜", "くろび", "09"],
    ["風蓮峠", "ふうれんとうげ", "10"],
    ["碓氷", "うすい", "11"],
    ["菖蒲", "しょうぶ", "12"],
    ["白砂", "しらすな", "13"],
    ["中海", "なかうみ", "14"],
    ["能取", "のとろ", "15"],
    ["樽前", "たるまえ", "16"],
    ["成生", "なりゅう", "17"],
    ["大洞", "おおぼら", "18"],
    ["霧原", "きりはら", "19"],
    ["日御", "ひのみ", "20"],
  ],
  direct: {
    "海岸線": "鵺恋中央",
  }
});


trains.push({
  name: "天蒲線",
  id: "KA",
  color: "#339966",
  stations: [
    ["菖蒲", "しょうぶ", "01"],
    ["仏稜", "ふつりょう", "02"],
    ["唐垣", "からがき", "03"],
    ["巌松岳", "がんしょうだけ", "04"],
    ["宮尾", "みやお", "05"],
    ["樫ノ橋", "かしのばし", "06"],
    ["桜見丘", "さくらみおか", "07"],
    ["東平", "とうへい", "08"],
    ["天草", "あまくさ", "09"],
  ]
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
    ["虎川", "とらかわ", "07"],
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
    ["水樹", "みなき", "05"],
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
  name: "桜町市線",
  id: "SC",
  color: "#FF00FF",
  stations: [
    ["桜町", "さくらまち", "01"],
    ["東桜町【休止中】", "ひがしさくらまち", "02"],
    ["公園入口【休止中】", "こうえんいりぐち", "03"],
    ["桜湖紅樹公園【休止中】", "さくらここうじゅこうえん", "04"],
    ["川畑【休止中】", "かわばた", "05"],
    ["蜂見【休止中】", "はちみ", "06"],
  ]
});

trains.push({
  name: "明吹線",
  id: "MS",
  color: "#FF1111",
  stations: [
    ["山吹", "やまぶき", "01"],
    ["新水樹", "しんみなき", "02"],
  ]
});

trains.push({
  name: "石花線",
  id: "IB",
  color: "#909090",
  stations: [
    ["ひまわりの里", "ひまわりのさと", "01"],
    ["菊舍", "きくやど", "02"],
    ["蓮水面台", "はすみなもだい", "03"],
    ["原雛", "はらびな", "04"],
    ["牡丹谷", "ぼたんだに", "05"],
    ["金香", "こんこう", "06"],
    ["ライラック公園", "らいらっくこうえん", "07"],
    ["矢車森林", "やぐるましんりん", "08"],
    ["寥鈴", "りょうりん", "09"],
    ["翡翠", "ひすい", "10"],
    ["薔薇高山", "ばらこうざん", "11"],
    ["白氷常磐", "はくひょうときわ", "12"],
    ["鼓町", "つづみまち", "13"],
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
  name: "朝井鉄道線",
  id: "AS",
  color: "#0F0FFF",
  stations: [
    ["高台", "たかだい", "01"],
    ["一村", "いちむら", "02"],
    ["初原", "はつはら", "03"],
    ["湿塚", "しめつか", "04"],
    ["緒山", "おやま", "05"],
    ["百地", "ももち", "06"],
    ["きつね山", "きつねやま", "07"],
    ["朝井", "あさい", "08"],
    ["明神口", "みょうじんぐち", "09"],
    ["明神", "みょうじん", "10"],
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
  name: "すばる高良電鉄線",
  display_name : "すばる高良電鉄線",
  id: "",
  color: "#FFCC00",
  stations: [
    ["高嶺", "たかね", ""],
    ["何富何", "なんとか", ""],
    ["金泉", "かないずみ", ""],
    ["珊瑚口", "さんごぐち", ""],
  ]
});

trains.push({
  name: "緒山町営軌道線",
  id: "",
  color: "#00B7CE",
  stations: [
    ["緒山", "おやま", "01"],
    ["役場前", "やくばまえ", "02"],
    ["ちさと台", "ちさとだい", "03"],
    ["三乃橋", "さんのはし", "04"],
  ]
});

trains.push({
  name: "市内1号線",
    display_name : "市内線",
  id: "S",
  color: "#00B7CE",
  stations: [
    ["漣公園前", "さざなみこうえんまえ", ""],
    ["漣", "さざなみ", ""],
    ["拠点前", "きょてんまえ", ""],
    ["十字街", "じゅうじがい", ""],
    ["暁橋", "あかつきばし", ""],
    ["橋下", "はしもと", ""],
    ["暁", "あかつき", ""],
    ["烏谷", "からすだに", ""],
    ["電鉄鹿島", "でんてつかしま", ""],
  ]
});

trains.push({
  name: "市内5号線",
    display_name : "市内線",
  id: "S",
  color: "#00B7CE",
  stations: [
    ["電鉄皐月", "でんてつさつき", ""],
    ["皐月入口", "さつきいりぐち", ""],
    ["漣大橋", "さざなみおおはし", ""],
    ["大橋入口", "おおはしいりぐち", ""],
    ["十字街", "じゅうじがい", ""],
  ]
});

trains.push({
  name: "市内1号線",
    display_name : "市内線",
  id: "S",
  color: "#00B7CE",
  stations: [
    ["電鉄鹿島", "でんてつかしま", ""],
    ["邸宅前", "ていたくまえ", ""],
    ["沼端", "ぬまはた", ""],
  ]
});

trains.push({
  name: "星ノ宮線",
  id: "",
  color: "#000066",
  stations: [
    ["伊吹", "いぶき", "01"],
    ["雨取", "あまとり", "02"],
    ["奥村", "おくむら", "03"],
    ["北鹿島", "きたかしま", "04"],
    ["苗場", "なえば", "05"],
    ["宿木", "やどりぎ", "06"],
    ["星ノ宮", "ほしのみや", "07"],
    ["街道端", "かいどうばた", "08"],
  ],
  loop : true
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
  ["珊瑚口", "周央町"],
  ["さんごぐち", "すおうちょう"],
]);

walk_data.push([
  ["岸川", "矢野"],
  ["きしかわ", "やの"],
]);

walk_data.push([
  ["紡木町", "花園"],
  ["つむぎちょう", "はなぞの"],
]);

walk_data.push([
  ["花園城址公園", "明神"],
  ["はのぞのじょうしこうえん", "みょうじん"],
]);

walk_data.push([
  ["何富何", "高嶺口"],
  ["なんとか", "たかねぐち"],
]);

walk_data.push([
  ["緋ヶ丘", "原雛"],
  ["あかがおか", "はらびな"],
]);

walk_data.push([
  ["高台", "本町"],
  ["たかだい", "ほんまち"],
]);

walk_data.push([
  ["紅摘", "紅摘台"],
  ["ぐつみ", "ぐつみだい"],
]);

walk_data.push([
  ["北鹿島", "電鉄鹿島"],
  ["きたかしま", "でんてつかしま"],
]);

