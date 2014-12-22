



/* localStorage에 JSON형태의 데이터를 넣고 뺄수 있게.. */
var localJson = {};
localJson.setItem = function( key, value ){
	console.log( 'setItem:', key, ' is ', value );
	localStorage.setItem( key, JSON.stringify( value ) );
}

localJson.getItem = function( key ){
	return JSON.parse( localStorage.getItem( key ));
}



/* 숫자를 화폐문자열로 변경 */
function commify(n) {
  var reg = /(^[+-]?\d+)(\d{3})/;   // 정규식
  n += '';                          // 숫자를 문자열로 변환

  while (reg.test(n))
    n = n.replace(reg, '$1' + ',' + '$2');

  return n;
}