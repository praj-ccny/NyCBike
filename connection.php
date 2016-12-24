<?php
$host        = "host=134.74.112.18";
$port        = "port=5432";
$dbname      = "dbname=d106";
$credentials = "user=davi16 password=curt";

$connect= pg_connect( "$host $port $dbname $credentials"  );
if(!$connect){
  echo "Error : Unable to open database\n";
}
?>