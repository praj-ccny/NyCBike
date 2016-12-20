<?php
require_once('connection.php');
header('Content-Type: application/json');

$result = pg_query($connect,"SELECT DATE_TRUNC('month', date) AS month,  count(date) as total_count 
FROM bikecrashnyc
GROUP BY month 
 
ORDER BY month asc,count(*);");
if (!$result){
    echo '{"error":"no results"}';
}


 $data = array();
  


for ($x = 0; $x < pg_num_rows($result); $x++) {
        $data[] = pg_fetch_array($result);
    }


echo json_encode($data);
pg_close($connect);
?>
