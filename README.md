# imgUpload
單鍵縮圖上傳的 jQuery Plugin

單鍵上傳圖片，上傳前會將圖縮小為限制的大小

說明可參考: http://disp.cc/b/11-8uGt

DEMO page: http://knuckles.disp.cc/github/imgUpload/imgUpload.php

imgur API 的說明可參考: http://disp.cc/b/11-8qWb

使用方法

先在 HTML 建立一個按鈕，以及用來顯示上傳結果的 textarea
```html
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
</style>

<div class="uploadBtn">上傳圖片</div>
<textarea id="uploadResult"></textarea>
```


載入 jQuery 與 plugin
```js
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
<script src="jquery.imgUpload.js"></script>
```
將上傳圖片按鈕加上 imgUpload
```js
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
```

# pasteUpload
用剪貼簿上傳的 jQuery Plugin

瀏覽器只有 chrome 支援

DEMO page: http://knuckles.disp.cc/github/imgUpload/pasteUpload.php

先建立一個 textarea
```html
<textarea style="width: 500px; height: 200px;" id="pasteTarget">
複製一張圖片(例如按PrintScreen)後，在這邊貼上
</textarea>
```

載入 jQuery 與 plugin
```js
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
<script src="jquery.pasteUpload.js"></script>
```

將 textarea 加上 pasteUpload
```js
<script type='text/javascript'>
$(function(){
	$('#pasteTarget').pasteUpload({
		action: 'imgur_upload_base64.php', //接收上傳圖片的網頁，要回傳JSON檔
		maxWidth: 1000, //寬度限制最大1000px
		maxHeight: 0,   //高度不限制
		//上傳圖片前在textarea插入的字串，可用id來區別不同次貼上的圖
		insertStr: function(id){ 
			return '[img '+id+' uploading...]';
		},
		//圖片上傳成功後，利用回傳的JSON將插入的字串換成含有圖片網址的字串
		replaceStr: function(responseJSON){
			var data = responseJSON.data;
			return "[img="+data.width+"x"+data.height+"]"+data.link+"[/img]\n";
		}
	});
});
</script>
```