// JavaScript Document

/*----------グローバル変数定義----------*/

var div;
var slider;
var innerDiv;
var prev;
var next;
var ul;
var imgIndex = 0;
var salonNameList = [];
//var salonOpenList = [];
var h2;
//var p;
var a;
var salonUrlList = [];



/*----------初期処理----------*/

$(function(){
	//API用のキー
	Recruit.UI.key = 'a450fa593ee3f2a4';
	
	
	//プルダウンリストの初期表示
	Recruit.UI.Base.Pulldown.first_opt_text = "-";
	
	
	//各プルダウンリストの設定
	new Beauty.UI.Places.Pulldown();
	new Beauty.UI.HairImage.Pulldown();
	new Beauty.UI.HairLength.Pulldown();
	new Beauty.UI.HairRyou.Pulldown();
	new Beauty.UI.HairShitsu.Pulldown();
	new Beauty.UI.HairFutosa.Pulldown();
	new Beauty.UI.HairKuse.Pulldown();
	new Beauty.UI.HairKaogata.Pulldown();
	new Beauty.UI.Kodawari.Checkbox();
	new Beauty.UI.KodawariSetsubi.Checkbox();
	new Beauty.UI.KodawariMenu.Pulldown();
	new Beauty.UI.Order.Pulldown();
	
	
	//submit処理
	$("#form-block form").submit(function(){
		
		jsonp_request();
		
		
		//新規作成するdiv要素の基準位置の調整
		var left = (window.innerWidth / 2) - 300;
		var top = (window.innerHeight / 2) - 300;
		
		
		//一番最下層レイヤーのdiv生成
		div = $("<div id='stage'></div>")
		.css({
			"width": 600,
			"height": 600,
			"position": "absolute",
			"top": top,
			"left": left,
			"background-image": "url('bg2.jpg')",
			"border": "solid 1px black",
			"box-shadow": "2px 2px 2px #333"
		})
		.appendTo(document.body);
		
		
		//上記のdivに貼付ける次の階層のレイヤー生成
		slider = $("<div class='slider'></div>")
		.css({
			"width": 510,
			"height": 410,
			"position": "relative",
			"overflow": "hidden",
			"margin": "auto",
			"margin-top": 20
		})
		.appendTo(div);
		
		
		//prevとnextを貼付けるためのレイヤー生成（画像と同じサイズにし、画像の上に持ってくる）
		innerDiv = $("<div></div>")
		.appendTo(slider);
		
		
		//prev要素の生成（innerDivに貼付ける）
		prev = $("<span class='move prev'>&laquo;</span>")
		.appendTo(innerDiv);
		
		
		//next要素の生成（innerDivに貼付ける）
		next = $("<span class='move next'>&raquo;</span>")
		.appendTo(innerDiv);
		
		
		//prevをクリックした時の処理
		slider.find(".prev").click(function(e){
			imgIndex--;
			
			move();
		});
		
		
		//nextをクリックした時の処理
		slider.find(".next").click(function(e){
			imgIndex++;
			
			move();
		});
		
		return false;
	});
});



/*----------jsonp_request関数-----------*/

function jsonp_request(start){
	//startに何も入って無い場合の処理
	if(!start){
		start = 1;
	}
	
	var ruip = $("#rui-page").html("looding......");
	
	//var ruir = $("#rui-result").empty();
	
	$("#rui-page-foot").empty();
	
	
	//jsonp用のurlを動的に生成する
	var url = 'http://webservice.recruit.co.jp/beauty/salon/v1/?' +
				'key=' + Recruit.UI.key + '&format=jsonp&callback=?' +
				'&start=' + start + '&' +
				$("#form-block form").formSerialize();
	
	
	//jsonp処理
	$.getJSON(url, function(json){
		//jsonで送られてきたデータをresに格納する
		var res = json.results;
		
		console.log(res);
		
		
		//データにエラーがある場合の処理
		if(res.error){
			ruip.html(res.error[0].message);
			return false;
		}

		var page = new Recruit.UI.Page.Simple(json);
		
		page.paginate({
			request: jsonp_request,
			sub_uis: [{
				id: "rui-page-foot",
				template: "<span class='rui-page-back'><a href=''>&lt;前へ</a></span>" + 
							"<sapn class='rui-page-next'><a href=''>次へ&gt;</a></span>"
			}]
		});
		
		
		/*
		var i = 0;
		
		var img = $("<img src='" + res.salon[i].main.photo.l + "' />")
		.css({
			"width": 500,
			"height" : 400,
			"border": "solid 5px white",
			"box-shadow": "2px 2px 2px #333"
		});
		
		div.append(img);
		*/
		
		
		//画像を並べる為のulを生成
		ul = $("<ul class='image-list'></ul>").attr("start", start);
		
		
		//それぞれのresのデータに処理をする
		$.each(res.salon, function(){
			//li要素の生成
			var li = $("<li>></li>");
			
			
			//img要素の生成（liに貼付ける）
			var img = $("<img src='" + this.main.photo.l + "' />")
			.css({
				"width": 500,
				"height" : 400,
				"border": "solid 5px white",
				"box-shadow": "2px 2px 2px #333"
			})
			.appendTo(li);
			
			
			//liをulに貼付ける
			ul.append(li);
			
			salonNameList.push(this.name);
			//salonOpenList.push(this.main.open);
			salonUrlList.push(this.urls.pc);
			
			//console.log(salonNameList[0]);
			//console.log(salonOpenList[0]);
		});
		
		//詳細データの初期表示
		h2 = $("<h2>" + salonNameList[0] + "</h2>")
		.css({
			"text-align": "center"
		});
		
		a = $("<a href='" + salonUrlList[0] + "'</a>");
		
		a.append(h2);
		div.append(a);
		
		
		/*	
		p = $("<p>" + salonOpenList[0] + "</p>")
		.css({
			"text-align": "center"
		});
			
		a = $("<a href='#'></a>");
			
		a.append(p);
			
		div.append(a);
		*/
		
		
		//slider要素に貼付ける
		slider.append(ul);
	});
}



/*----------move関数----------*/

function move(){
	if(imgIndex == -1){
		imgIndex = 19;
	}
	
	if(imgIndex == 20){
		imgIndex = 0;
	}
	
	
	//更新したimgIndex値によって画像をスライドさせる
	ul.animate({
		left: -510 * imgIndex
	});
	
	
	//h1要素とp要素の更新
	a.remove();
	//p.remove();
	
	
	h2 = $("<h2>" + salonNameList[imgIndex] + "</h2>")
	.css({
		"text-align": "center"
	})
	.appendTo(div);
	
	a = $("<a href='" + salonUrlList[imgIndex] + "'</a>");
		
	a.append(h2);
	div.append(a);
	
	
	/*	
	p = $("<p>" + salonOpenList[imgIndex] + "</p>")
	.css({
		"text-align": "center"
	});
			
	a = $("<a href='#'></a>");
			
	a.append(p);
			
	div.append(a);
	*/
}
	
	
	
		
		