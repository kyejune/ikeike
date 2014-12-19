$(document).ready( function(){
	
	var cnt = 0;
	var result    = { 'kr':'', 'jp':'', 'cn':'' }; // 국가별 금액
	var converter = { 'jp':9.3, 'cn':177.4 };      // 국가별 환율


	// Click
	$('#comparebutton').click( function(){
		var no = $('.product-number').val().replace( /[.]/g, '');

		getProductInfo( no||'90160720' );
	});


	// Status
	function initdisplay(){
		cnt = 0;


		$('.kr .progress-bar').css( 'width', '0%' );
		$('.jp .progress-bar').css( 'width', '0%' );
		$('.cn .progress-bar').css( 'width', '0%' );

		$('.price-kr').text( '' );
		$('.price-jp').text( '' );
		$('.price-cn').text( '' );

		$('.result').css( 'display', 'none' );
		$('.loading').css( 'display', 'none' );
	}

	function loading(){
		$('.loading').css( 'display', 'block' );
	}


	// 환율 가져오기
	var getCurrenty = function(){
		var ccnt = 0;

		$.ajax({
	      crossOrigin: true,
	      url: "http://www.webservicex.net/CurrencyConvertor.asmx/ConversionRate?FromCurrency=CNY&ToCurrency=KRW",
	      success: function( xml ) {
	      		var val = $(xml).text();
	      		if( $.isNumeric( val ) ) converter['cn'] = Number(val);
	      }
	  	});

	  	$.ajax({
	      crossOrigin: true,
	      url: "http://www.webservicex.net/CurrencyConvertor.asmx/ConversionRate?FromCurrency=JPY&ToCurrency=KRW",
	      success: function( xml ) {
	      		var val = $(xml).text();
	      		if( $.isNumeric( val ) ) converter['jp'] = Number(val);
	      }
	  	});

	};
	getCurrenty();
	delete getCurrenty();

	// 메인 상품정보 가져오기
	function getProductInfo( pNo ){
		console.log( 'getProductInfo:', pNo );
		initdisplay();
		$('.loading').css( 'display', 'block' );

		$.ajax({
	      crossOrigin: true,
	      url: "http://www.ikea.com/kr/ko/catalog/products/" + pNo,
	      success: function( html ) {
	      	var html = $(html);
	      	var price = html.find('#price1').text();

	      	$('.media-heading').text( html.find('#name.productName').text() );
	      	$('.media-body>span').text( price + '원' );
	      	$('a.media-left img').attr( 'src', "http://www.ikea.com/" + html.find( '#productInfoContainer img').attr('src'));

	      	$('.price-kr').text( price + ' 원' );
	      	$('.kr h5 span').text( price );

	      	$('.result').css( 'display', 'block' );
	      	$('.loading').css( 'display', 'none' );


	      	result['kr'] = price;
	      	cnt++;
	      	loadOtherCountry( pNo );
	      },

	      error: function(){
	      	alert('상품을 찾을 수 없습니다.');
	      }

	    });
	}

	// 국가별 가격 가져오기
	function loadOtherCountry( pNo ){

		$.ajax({
	      crossOrigin: true,
	      url: "http://www.ikea.com/jp/en/catalog/products/" + pNo,
	      success: function( html ) {
	      	var price = $(html).find('#price1').text();
	      	$('.jp h5 span').text( price );

	      	result['jp'] = price;
	      	if( ++cnt == 3 ) displayAll();
	      },

	      error: function(){
	      	alert('일본 상품을 찾을 수 없습니다.');
	      }

	    });

	    $.ajax({
	      crossOrigin: true,
	      url: "http://www.ikea.com/cn/en/catalog/products/" + pNo,
	      success: function( html ) {
	      	var price = $(html).find('#price1').text();
	      	$('.cn h5 span').text( price );

	      	result['cn'] = price;
	      	if( ++cnt == 3 ) displayAll();
	      },

	      error: function(){
	      	alert('중국 상품을 찾을 수 없습니다.');
	      }

	    });


	}

	
	// 가격대별 비교해서 출력
	function displayAll(){
		var jp2kr = Number(result.jp.replace(',', '').match(/\d+/)) * converter.jp;
		var cn2kr = Number(result.cn.replace(',', '').match(/\d+/)) * converter.cn;
		var krprice= Number(result.kr.replace(',', '').match(/\d+/));
		var max = Math.max( jp2kr, cn2kr, krprice );

		displayPg( 'kr', krprice, max );
		displayPg( 'cn', cn2kr,   max );
		displayPg( 'jp', jp2kr,   max );

	}

	function displayPg( country, price, max ){
		if( price > 0 ){
			$( '.' + country + ' .progress-bar').css( 'width', (price/max)*100 + '%' );
			$('.price-' + country ).text( '₩ ' + commify( Math.round(price) + ' 원' ) );
		}else{
			$( '.' + country + ' .progress-bar').css( 'width', '100%' );
			$('.price-' + country ).text( '제품이 없던지 품번이 다른가봉가?' );
		}
	}


	//// Utils...
	// 숫자를 화폐문자열로 변경
	function commify(n) {
	  var reg = /(^[+-]?\d+)(\d{3})/;   // 정규식
	  n += '';                          // 숫자를 문자열로 변환

	  while (reg.test(n))
	    n = n.replace(reg, '$1' + ',' + '$2');

	  return n;
	}


});