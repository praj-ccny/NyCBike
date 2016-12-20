<?php
require_once('connection.php');
header('Content-Type: application/json');

$result = pg_query($connect,"select geom,date from bikecrashnyc;");
if (!$result){
    echo '{"error":"no results"}';
}

$points= array();
  
while($row = pg_fetch_array($result)){ 
    $coordinate = json_decode($row['geom'])->coordinates;
	$date_ = $row['date'];
    $p = new stdClass;
    $p->lat = $coordinate[0];
    $p->long = $coordinate[1]; 
	$p->date_ = $date_; 
    array_push($points, $p);
	
}
$output = new stdClass;
$output->points = $points;
echo json_encode($output);
pg_close($connect);
?>

