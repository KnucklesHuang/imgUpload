<!DOCTYPE html>
<html>
<head>
<style type="text/css">
.uploadBtn{
	display: inline-block; width:80px; height: 26px; cursor: pointer;
	background-color: red; color: black; font-size: 16px;
	border: 1px solid black; border-color: rgba(0,0,0,0.25);
	-webkit-border-radius: 5px; -moz-border-radius: 5px; border-radius: 5px;
}

#uploadResult{
	width: 500px; height: 100px;
}
body{ background-color: white;}

</style>
</head>
<body>
	
<br>單鍵上傳 jQuery plugin:
<div class="uploadBtn">上傳圖片</div>
<br>

上傳圖片的網址:<br>	
<textarea id="uploadResult"></textarea>
<br>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
<script src="jquery.imgUpload.js"></script>
<script type="text/javascript">
$(function(){
	//用來顯示上傳結果的 textarea
	var uploadResult = document.getElementById('uploadResult');
	//使用單鍵上傳 jQuery plugin
	$('.uploadBtn').imgUpload({
		action: 'imgur_upload_base64.php', //接收上傳圖片的網頁，要回傳JSON檔
		multiple: true, //允許選取多張圖片
		maxWidth: 1000, //寬度限制最大1000px
		maxHeight: 0,   //高度不限制
		//選取圖片後要做的事
		onSubmit: function(id){ 
			//在 textarea 插入一個上傳中的字串，上傳成功後再換成網址
			//若一次上傳多張圖，可用 id 來分別不同的圖
			var anchor_str = "[img "+id+" uploading...]\n";
			uploadResult.value += anchor_str;
		},
		//上傳成功後要做的事
		onComplete: function(responseJSON,id){ 
			// resapnseJSON 為 action 網頁回傳的 JSON 檔
			var data = responseJSON.data;
			if(!responseJSON.success){ alert(data.error); }
			//將 textarea 裡，上傳中的字串改成圖片網址
			//若一次上傳多張圖，可用 id 來分別不同的圖
			var anchor_str = "[img "+id+" uploading...]\n";
			var bbcode = '[img='+data.width+'x'+data.height+']'+data.link+"[/img]\n";
			uploadResult.value = uploadResult.value.replace(anchor_str,bbcode);
		}
	});	
});


</script>	
</body>
</html>