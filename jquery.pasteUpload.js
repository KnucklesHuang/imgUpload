/*
 * pasteUpload - jQuery Plugin
 * Copyright (c) 2015 Knuckles Huang
 */
(function($){
	$.fn.pasteUpload = function(options) {
		options = $.extend({ //options 預設值
			action: 'imgur_upload_base64.php',
			maxWidth: 1024, //寬度預設限制最大1024px
			maxHeight: 0,   //高度預設無限制
			onSubmit: function(){},
			onComplete: function(){}
		}, options);
		
		this.on('paste',function(e){
//			var e = window.event;
			e = e.originalEvent; //change jquery event to original event
			var file = null;
			for(var i=0; i<e.clipboardData.items.length; i++) {
				var item = e.clipboardData.items[i];
				if (item.type.indexOf("image") !== -1) {
					file = item.getAsFile();
					break;
				}
			}
			if(file===null){ return; }
			imgUpload(file,options);
		});
		return this;
	};
	
	function imgUpload(file,options){
		var type = file.type;
		var src = window.URL.createObjectURL(file);
		//隨機產生一個id，用來辨別不同的上傳檔案
		var id = Math.random().toString(36).substring(3,7);
		options.onSubmit(id);

		var img = document.createElement("img");
		img.src = src;
		img.onload = function(){
			var width = this.width,
				height = this.height,
				maxWidth = options.maxWidth,
				maxHeight = options.maxHeight;
	//		console.log('size:'+width+'x'+height);
			//寬或高大於設定的上限時，等比例縮小到符合上限
			if(width > height){
				if(maxWidth>0 && width>maxWidth){
					height *= maxWidth / width;
					width = maxWidth;
				}
			}else{
				if(maxHeight>0 && height>maxHeight){
					width *= maxHeight / height;
					height = maxHeight;
				}
			}
			//使用縮小後的寬高建立一個canvas
			var canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;
			var ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0, width, height);
			//將canvas轉為圖片的base64編碼
			var dataurl = canvas.toDataURL(type); 
			//去掉 dataurl 開頭的 data:image/png;base64,
			var base64 = dataurl.replace(/^data:image\/\w{3,4};base64,/, '');
			//將圖片的base64編碼上傳至網站，將回傳的JSON傳至onComplete
			$.post(options.action, {base64:base64}, function(responseText){
				if(!responseText.match(/^[\{\[]/)){ alert(responseText); return; }
				var responseJSON = JSON.parse(responseText);
				options.onComplete(responseJSON,id);
			},'text');
		};		
	}
	
})(jQuery);