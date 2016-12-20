<?php
$host        = "host=127.0.0.1";
$port        = "port=5435";
$dbname      = "dbname=postgres";
$credentials = "user=postgres password=postgres";

$connect= pg_connect( "$host $port $dbname $credentials"  ) or die ("Could not connect: " . pg_last_error());
if(!$connect){
  echo "Error : Unable to open database\n";
}
?>