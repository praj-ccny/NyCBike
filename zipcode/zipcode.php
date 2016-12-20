<?php
require_once('../connection.php');
header('Content-Type: application/json');

$result = pg_query($connect,"select distinct zipcode, count(zipcode)as cnt from bikecrashnyc group by zipcode;");
if (!$result){
    echo '{"error":"no results"}';
}

$zipCodes= array();
$crashCounts= array();
 $data = array();
  


for ($x = 0; $x < pg_num_rows($result); $x++) {
        $data[] = pg_fetch_array($result);
    }


echo json_encode($data);
pg_close($connect);
?>
