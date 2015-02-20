/*
 * pasteUpload - jQuery Plugin
 * Copyright (c) 2015 Knuckles Huang
 */
(function($){
	$.fn.pasteUpload = function(options) {
		options = $.extend({ //options 預設值
			action: 'imgur_upload_base64.php',
			maxWidth: 1000, //寬度預設限制最大1000px
			maxHeight: 0,   //高度預設無限制
			insertStr: function(){},
			replaceStr: function(){}
		}, options);
		
		this.on('paste',function(){
			pasteUpload(this, options);
		});
		return this;
	};
	
	function pasteUpload(element, options){
		var e = window.event;
		var file = null;
		for(var i=0; i<e.clipboardData.items.length; i++) {
			var item = e.clipboardData.items[i];
			if (item.type.indexOf("image") !== -1) {
				file = item.getAsFile();
				break;
			}
		}
		if(file===null){ return; }
		
		var type = file.type;
		var src = window.URL.createObjectURL(file);
		//隨機產生一個id，用來辨別不同的上傳檔案
		var id = Math.random().toString(36).substring(3,7);

		var anchorStr = options.insertStr(id);
		insertText(element, anchorStr);

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
			var regex = new RegExp('^data:'+type+';base64,');
			var base64 = dataurl.replace(regex,'');
			//將圖片的base64編碼上傳至網站，將回傳的JSON傳至onComplete
			$.post(options.action, {base64:base64}, function(responseText){
				if(!responseText.match(/^[\{\[]/)){ alert(responseText); return; }
				var responseJSON = JSON.parse(responseText);
				var replaceStr = options.replaceStr(responseJSON);
				replaceText(element, anchorStr, replaceStr);
			},'text');
		};		
	}
	
	function insertText(element, string){
		element.focus();
		document.execCommand("insertText", false, string);
	}
	
	function replaceText(element, searchStr, replaceStr){
		var selStart = element.selectionStart;
		var selEnd = element.selectionEnd;
		var textValue = element.value;
		var strStart = textValue.indexOf(searchStr);
		if(strStart!==-1){
			var strEnd = strStart+searchStr.length;
			element.selectionStart = strStart;
			element.selectionEnd = strEnd;
			document.execCommand("insertText", false, replaceStr);
			if(selStart>strEnd){
				var offset = replaceStr.length - searchStr.length;
				selStart += offset;
				selEnd += offset;
			}
			element.selectionStart = selStart;
			element.selectionEnd = selEnd;
		}
	}
	
})(jQuery);