const Motion = {
	getStyle(DOM,attr){
		return DOM.currentStyle?DOM.currentStyle[attr]:getComputedStyle(DOM,null)[attr];
	},
	rgb(rgbStr){
		let rgbArr = [];
		for(let x of rgbStr.split(',')){
			rgbArr.push(parseInt(x.replace(/\D/g,'')));
		}

		return rgbArr;
	},
	changeColor(obj,attrObj){
		return new Promise((resolve,reject)=>{
			clearTimeout(obj.color_timer);
			let that = this;

			obj.color_timer = setTimeout(function change(){
				let stop = true;

				for(let attr in attrObj){//遍历每个颜色属性。属性名为attr，属性值为attrObj[attr]
					let currentArr = that.rgb(that.getStyle(obj,attr));
					let targetArr = that.rgb(attrObj[attr]);
					let newArr = [];

					for(let i=0;i<currentArr.length;i++){
						let speed = (targetArr[i]-currentArr[i])/10;
						speed = speed>0?Math.ceil(speed):Math.floor(speed);
						newArr.push(currentArr[i]+speed);
						if(speed!=0){
							stop = false;
						}
					}

					obj.style[attr] = `rgb(${newArr[0]},${newArr[1]},${newArr[2]})`;
					console.log("newArr",newArr);
				}

				if(!stop){//继续运动
					obj.color_timer = setTimeout(change,30);
				} else{
					resolve();
				}

			},30);//end timeout
		});
	},
	startMove(obj,attrObj){

		return new Promise((resolve,reject)=>{

			clearTimeout(obj.move_color);//先关闭上一个定时器，防止同时开启多个定时器
			let that = this;
			
			obj.move_color = setTimeout(function move(){//动画这种不重要的定时器，用递归setTimeout来代替setInterval，降低浏览器压力
				let stop = true;//如果所有的属性都到了终点，stop为true，停止当前运动
				
				for(let attr in attrObj){//遍历attrObj对象，实现多个style属性同时变化
					let current;
					switch(attr){//判断属性，这个只能尽可能添加
						case "opacity": current = Math.round(parseFloat(that.getStyle(obj,attr))*100); break;
					
						default: current = parseInt(that.getStyle(obj,attr));
					}

					let target = attrObj[attr];
					let speed = (target-current)/7;

					console.log(attr);

					speed = speed>0?Math.ceil(speed):Math.floor(speed);//speed取整，防止出现绝对值小于1的情况导致提前停止运动，同时定时器无限递归
					if(current!=target){//当前属性未到终点

						switch(attr){
							case "opacity": 
								obj.style.filter = `alpha(opacity:${current+speed})`;//IE
								obj.style.opacity = (current+speed)/100;//webkit
								break;

							default: obj.style[attr] = current+speed+"px"; break;
						}
						stop = false;
					} 

				}//end for

				if(!stop){//至少有一个属性没有到达终点，继续运动
					obj.move_color = setTimeout(move,30);
				} else{//停止当前运动，Promise状态变为resolved
					resolve();
				}

			},30);//end timeout
		});

	}
};

export default Motion;