<?php

/**
 *  An example CORS-compliant method.  It will allow any GET, POST, or OPTIONS requests from any
 *  origin.
 *
 *  In a production environment, you probably want to be more restrictive, but this gives you
 *  the general idea of what is involved.  For the nitty-gritty low-down, read:
 *
 *  - https://developer.mozilla.org/en/HTTP_access_control
 *  - http://www.w3.org/TR/cors/
 *
 */
 
//======= CORS SETTINGS ==============
define("ALLOW_FROM_ANY",0); // If 1, DOMAINS will be ignored
define("DOMAINS","localhost"); //List of allowed domains, separated by a comma
//=================================
 
 
function cors($origin) {

    
    if (isset($origin)) {
        // Decide if the origin in $_SERVER['HTTP_ORIGIN'] is one
        // you want to allow, and if so:
        header("Access-Control-Allow-Origin: $origin");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');    // cache for 1 day
    }

    // Access-Control headers are received during OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
            // may also be using PUT, PATCH, HEAD etc
            header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         

        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
            header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

        exit(0);
    }

}



if (isset($_POST['data'])) {
   $data=json_decode($_POST['data'],true);
   $ch = curl_init(); 
   curl_setopt($ch, CURLOPT_URL, $data['url']); 
   curl_setopt($ch, CURLOPT_HEADER, false); 
   //curl_setopt($ch, CURLINFO_HEADER_OUT, true);
   //$headers=curl_getinfo($ch, CURLINFO_HEADER_OUT);
   curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE); 
   $out=curl_exec($ch); 
   //var_dump($headers);
   $origin=$_SERVER['HTTP_ORIGIN'];
   
   if(ALLOW_FROM_ANY) { // Not recommanded
        $safeOrigin=$origin;
   } else {
        $safeOrigin=DOMAINS; 
   }
   
   if(($safeOrigin == $origin)||preg_match("#^https?://($safeOrigin)$#",$origin)) {
        cors($origin);
        echo $out;
   }else {
        echo "Error : 504";//FORBIDDEN DOMAIN";
   }
   curl_close($ch);
}else {
    echo "Error : 404"; //MISSING DATA";
}
?>
