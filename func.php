<?php

// 182.162.90.215 root

// echo "시작";

$MYSQL_HOST = "localhost";
$MYSQL_DB   = "ikeike";
$MYSQL_ID   = "root";
$MYSQL_PASSWORD = "bv9734za!!!";

$conn = mysqli_connect($MYSQL_HOST, $MYSQL_ID, $MYSQL_PASSWORD, $MYSQL_DB);


// echo "result:". mysqli_connect_errno();

if( mysqli_connect_errno() ){
	printf("Failed:::", mysqli_connect_error(). '' );
	exit;
}else{
	echo "Connected";
}

?>