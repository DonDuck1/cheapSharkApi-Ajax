<?php
include("./proxy.php");

//setup the Proxy with the right credentials
$mySwapiProxy = new Proxy('https://api.github.com');
//get the data
$result = $mySwapiProxy->getData('users/donduck1');
//print the data to the frontend.
print_r($result);