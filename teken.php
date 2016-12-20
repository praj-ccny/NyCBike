<?php
require_once('connection.php');
header('Content-Type: application/json');

$result = pg_query($connect,"SELECT  distinct a.geom
FROM bikecrashnyc a, cd b
WHERE ST_Within(a.thegeom, b.geom)
  AND (
    b.borocd BETWEEN 101 AND 108
    OR b.borocd BETWEEN 301 AND 303
    OR b.borocd = 306
    OR b.borocd = 402
  )
;");
if (!$result){
    echo '{"error":"no results"}';
}

$points= array();    
while($row = pg_fetch_array($result)){ 
    $coordinate = json_decode($row['geom'])->coordinates;
    $p = new stdClass;
    $p->lat = $coordinate[0];
    $p->long = $coordinate[1]; 
    array_push($points, $p);
}
$output = new stdClass;
$output->points = $points;
echo json_encode($output);
pg_close($connect);
?>

