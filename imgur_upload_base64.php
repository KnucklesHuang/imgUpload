<?php
header("Content-type: application/json");
header("Cache-Control: no-cache");

$imgur_key = 'imgur_key.conf.php';
if(file_exists($imgur_key)){ 
	include($imgur_key); // load mashape key and client id	
}else{ //or set the mashape key and client id below
	define('MASHAPE_KEY',''); //set your mashape key
	define('CLIENT_ID','');   //set your client id
}

$image_base64 = isset($_POST['base64'])? $_POST['base64'] : '';
if(!$image_base64){ die('base64 error'); }
$imgur_result = imgur_upload($image_base64);
echo $imgur_result;


function imgur_upload($image,$title='') {
	if(MASHAPE_KEY==''){
		$url = 'https://api.imgur.com/';
	}else{
		$url = 'https://imgur-apiv3.p.mashape.com/3/image/';
	}

	$http_header_array = [
			"X-Mashape-Key: ".MASHAPE_KEY,
			"Authorization: Client-ID ".CLIENT_ID,
			"Content-Type: application/x-www-form-urlencoded"
	];

	$curl_post_array = [
			'image' => $image,
			'title' => $title,
	];

	$curl_options = [
			CURLOPT_HTTPHEADER => $http_header_array,
			CURLOPT_POST => true,
			CURLOPT_POSTFIELDS => http_build_query($curl_post_array),
	];

	$curl_info = null;
	$curl_result = use_curl_opt($url, $curl_options, $curl_info);

//	print_r($curl_result);
	//print_r($curl_info);
	return $curl_result;
}

function use_curl_opt($url, $options = [], &$curl_info = null) {
	$ch = curl_init();
	$default_options = [
			CURLOPT_URL => $url,
			CURLOPT_HEADER => 0,
			CURLOPT_VERBOSE => 0,
			CURLOPT_RETURNTRANSFER => true,
			CURLOPT_USERAGENT => "Mozilla/5.0 (Windows NT 5.1; rv:10.0.2) Gecko/20100101 Firefox/10.0.2",
	];
	curl_setopt_array($ch, $default_options);
	curl_setopt_array($ch, $options);
	$curl_result = curl_exec($ch);
	$curl_info = curl_getinfo($ch);
	$curl_error = curl_error($ch);
	curl_close($ch);

	if ($curl_result) {
		return $curl_result;
	} else {
		return $curl_error;
	}
}