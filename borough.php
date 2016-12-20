<?php
require_once('../connection.php');
header('Content-Type: application/json');

$result = pg_query($connect,"select borough, count(borough) from bikecrashnyc group by borough;");
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
