<?php
require "../../ajaxconfig.php";

// Initialize the response array
$cus_map_arr = array();

// Get the loan_id_calc from the POST request
$loan_id_calc = isset($_POST['loan_id_calc']) ? $_POST['loan_id_calc'] : ''; // Ensure the variable is set

// Customer mapping array

// Check if loan_id_calc is not empty or invalid
if ($loan_id_calc != '') {
    // Directly inject the loan_id_calc value into the query (be cautious)
    $qry = $pdo->query("SELECT gcm.id, cc.cus_id, cc.first_name, gcm.customer_mapping, cc.aadhar_number, cc.mobile1, anc.areaname, gcm.designation
                          FROM loan_cus_mapping gcm 
                          JOIN customer_creation cc ON gcm.cus_id = cc.id 
                          LEFT JOIN area_name_creation anc ON cc.area = anc.id  
                          WHERE gcm.loan_id = '$loan_id_calc'");

    // Check if the query returns any rows
    if ($qry->rowCount() > 0) {
        // Fetch the results and process them
        while ($gcm_info = $qry->fetch(PDO::FETCH_ASSOC)) {
            // Map the customer mapping to its corresponding label
          //  $gcm_info['customer_mapping'] = isset($cus_mapping[$gcm_info['customer_mapping']]) ? $cus_mapping[$gcm_info['customer_mapping']] : '';
            
            // Add the delete button action
            $gcm_info['action'] = "<span class='icon-trash-2 cusMapDeleteBtn' value='" . $gcm_info['id'] . "'></span>";

            // Add the processed record to the response array
            $cus_map_arr[] = $gcm_info;
        }
    }
} else {
    // If loan_id_calc is empty or invalid, return an empty array
    $cus_map_arr = [];
}

// Close the database connection
$pdo = null;

// Return the response as JSON
echo json_encode($cus_map_arr);
?>