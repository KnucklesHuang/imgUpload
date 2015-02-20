<!DOCTYPE html>
<html>
<head>
</head>
<body style="background-color: white;">
<textarea style="width: 500px; height: 200px;" id="pasteTarget">
複製一張圖片(例如按PrintScreen)後，在這邊貼上
</textarea>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
<script src="jquery.pasteUpload.js"></script>
<script type='text/javascript'>
$(function(){
	$('#pasteTarget').pasteUpload({
		action: 'imgur_upload_base64.php', //接收上傳圖片的網頁，要回傳JSON檔
		maxWidth: 1000, //寬度限制最大1000px
		maxHeight: 0,   //高度不限制
		//上傳圖片前在textarea插入的字串，可用id來區別不同次貼上的圖
		insertStr: function(id){ 
			return "[img "+id+" uploading...]\n";
		},
		//圖片上傳成功後，將插入的字串換成含有圖片網址的字串
		replaceStr: function(width,height,link){
			return "[img="+width+"x"+height+"]"+link+"[/img]\n";
		}
	});
});
</script>

</body>
</html>