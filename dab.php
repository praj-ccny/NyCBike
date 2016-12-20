<?php
require_once('connection.php');
header('Content-Type: application/json');

$result = pg_query($connect,"SELECT distinct startgeom, start_station_name FROM citibikes");
if (!$result){
    echo '{"error":"no results"}';
} 

$points= array();
$streets = array();    
while($row = pg_fetch_array($result)){ 
    $coordinate = json_decode($row['startgeom'])->coordinates;
    $street = $row['start_station_name'];
    $p = new stdClass;
    $p->lat = $coordinate[0];
    $p->long = $coordinate[1]; 
    array_push($points, $p);
	array_push($streets, $street);
}
$output = new stdClass;
$output->points = $points;
$output->streets = $streets;
echo json_encode($output);

pg_close($connect);
?>


