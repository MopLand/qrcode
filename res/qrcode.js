/*!
*	(C)2018 VeryIDE
*	qrcode.js
*	author: Lay veryide@qq.com
*	desc: 前端图片合成
*	date: 2018/07/09
*/

var QRCode = {

	width : 400,
	height: 550,
	margin: 0,

	canvas : null,
	context : null,

	options : {},
	complete : null,

	create : function( options, fn ){

		//保存选项
		QRCode.options = options;

		//保存选项
		QRCode.complete = fn;

		//创建画布
		QRCode.canvas = document.createElement('canvas');
		QRCode.canvas.width = QRCode.width;
		QRCode.canvas.height = QRCode.height;

		//判断浏览器是否支持
		if( QRCode.context = QRCode.canvas.getContext('2d') ){

			//改变填充的颜色
			QRCode.context.fillStyle="#fff";

			//画一个实体方块---fillrect(x,y,w,h);
			QRCode.context.fillRect( 0, 0, QRCode.width, QRCode.height );

			QRCode.thumb();

		}else{
			alert('Does not support canvas');
		}

	},
	
	//画商品图
	thumb : function(){

		var img = new Image();
			img.setAttribute('crossOrigin', 'anonymous');
			img.src = QRCode.options.thumb;
			img.onload = function(){
	
				var r = QRCode.width / this.width;
				var w = this.width * r;
				var h = this.height * r;

				QRCode.margin = h;
	
				////////////////////////
	
				QRCode.context.drawImage( this, 0, 0, w, h );
	
				QRCode.qrcode();
			};

	},
	
	//画二维码
	qrcode : function(){

		var url = 'http://url.taokebaohe.com/qrcode?text=' + encodeURIComponent( QRCode.options.qrcode );

		//打印头像
		var img = new Image();
			img.setAttribute('crossOrigin', 'anonymous');
			img.src = url;
			img.onload = function(){

				var r = 100 / this.width;
				var w = this.width * r;
				var h = this.height * r;
	
				var x = QRCode.width - w - 5;
				var y = QRCode.height - h - 5;
	
				////////////////////////
	
				QRCode.context.drawImage( this, x, y, w, h );
	
				QRCode.writing();
			};

	},

	//填充文本
	writing : function(){

		//商品名称
		QRCode.context.font		= '18px bold 宋体';
		QRCode.context.fillStyle	= '#000';
		QRCode.wraptext( QRCode.options.title, 10, QRCode.margin + 30, QRCode.width - 20, 25);

		//商品价格
		QRCode.context.font		= '22px bold 宋体';
		QRCode.context.fillStyle	= '#f3773b';
		QRCode.wraptext( '券后价：' + ( QRCode.options.price - QRCode.options.coupon ).toFixed(2), 10, QRCode.height - 50, QRCode.width - 130, 20);

		//商品原价
		QRCode.context.font		= '16px bold 宋体';
		QRCode.context.fillStyle	= '#999';
		QRCode.wraptext( '原      价：' + QRCode.options.price, 10, QRCode.height - 15, QRCode.width - 130, 20);

		//原价画线
		QRCode.context.beginPath();
		QRCode.context.moveTo( 8, QRCode.height - 20 );
		QRCode.context.lineTo( 120, QRCode.height - 20 );
		QRCode.context.strokeStyle = "#999";
		QRCode.context.stroke();

		QRCode.print();

	},

	//自适应文本
	wraptext : function( words, x, y, maxWidth, lineHeight) {

		var context = QRCode.context;
		var line = '';

		for ( var n = 0; n < words.length; n++ ){

			var testLine = line + words[n];
			var metrics = context.measureText(testLine);
			var testWidth = metrics.width;

			if (testWidth > maxWidth) {
				context.fillText(line, x, y);
				line = words[n];
				y += lineHeight;
			} else {
				line = testLine;
			}

		}

		context.fillText(line, x, y);
    },
		
	//打印图片
	print : function( ){

		QRCode.complete && QRCode.complete( QRCode.canvas.toDataURL('image/png') );

	}

};
