;
(function($){
	var Calendar=function(box,value){
		var self=this;
		this.box=box;
		this.status=value;
		this.newDay=[];
		this.now=new Date();
		this.currentYear = this.now.getFullYear(); //获取当前年
		this.currentMonth = this.now.getMonth() + 1; //获取当前月
		this.currentDay = this.now.getDate();				//获取当前天
		this.prevBtn=this.box.find(".prev-btn"); //左按钮
		this.nextBtn=this.box.find(".next-btn"); //右按钮
		this.title=this.box.find(".p-title");		 //年月标题
		this.tHead=this.box.find(".t-head");		 //表格头部
		this.tBody=this.box.find(".t-body");		 //表格主要部分显示日期

		this.currentDate=this.dCompareFormat(this.currentYear,this.currentMonth,this.currentDay) //当前日期
		this.newDay.push(this.currentDate);
		this.setTtitle(this.currentYear,this.currentMonth); //设置年月标题
		this.setThead();												 //设置日历显示格式var now = new Date();
		this.setTbody(this.currentYear,this.currentMonth,this.currentDay);	//设置表格身体部分
		this.setTdClick();	//设置td点击事件
		this.setSelectedTdClss();	//设置被选中的日期的颜色

		this.prevBtn.tap(function(){  //切换到上一个月
			self.changeDate(-1);
		});
		this.nextBtn.tap(function(){	//切换到下一个月
			self.changeDate(1);
		});
	};
	Calendar.prototype={
		//设置日历显示格式
		setThead:function(){
			var week = ["日", "一", "二", "三", "四", "五", "六"];
			var tds = "";
			for (var i = 0; i < week.length; i++) {
				tds += "<th>" + week[i] + "</th>";
			}
			this.tHead.append(tds);
		},
		//设置年月标题
		setTtitle:function(y,m){
			var str = y + "年" + m + "月";
			this.title.html(str);
		},
		//设置表格身体部分
		setTbody:function(y,m,d){
			var dayArr=this.getMonthArr(y,m);
			this.tBody.empty();
			if(parseInt(this.dCompareFormat(y,m,d)/100)==parseInt(this.currentDate/100)){
				d=this.currentDay;
			};
			if(this.dCompareFormat(y,m,d)<this.currentDate){
				for (var i = 0; i < dayArr.length; i++) {
					var trs="<tr>";
					for(var j=0;j<dayArr[i].length;j++){
						trs += this.setPrevTd(dayArr[i][j]);
					}
					trs+="</tr>";
					this.tBody.append(trs);
				}
			}else if(this.dCompareFormat(y,m,d)==this.currentDate){
				for (var i = 0; i < dayArr.length; i++) {
					var trs="<tr>";
					for(var j=0;j<dayArr[i].length;j++){
						if(dayArr[i][j]<d){
							trs += this.setPrevTd(dayArr[i][j]);
						}else{
							trs += this.setNextTd(dayArr[i][j]);
						}
					}
					trs+="</tr>";
					this.tBody.append(trs);
				}
			}else{
				for (var i = 0; i < dayArr.length; i++) {
					var trs="<tr>";
					for(var j=0;j<dayArr[i].length;j++){
						trs += this.setNextTd(dayArr[i][j]);
					}
					trs+="</tr>";
					this.tBody.append(trs);
				}
			}
		},
		//绑定点击事件
		setTdClick:function(){
			var _this=this;
			this.tBody.find("td").unbind("tap");
			this.tBody.find("td").bind("tap",function(){
				if(_this.status==2){
					if(_this.newDay.length<2){
						if($(this).find("span").hasClass('currentYear')){
							$(this).find("span").removeClass('currentYear');
							var date=_this.getCurrentTime($(this).find("span").html());
							_this.newDay.splice(_this.newDay.indexOf(date),1);
						}else if($("span.currentYear").length<2&&$(this).find("span").html()){
							$(this).find("span").addClass('currentYear');
							var date=_this.getCurrentTime($(this).find("span").html());
							_this.newDay.push(date);
						};
						if($("span.currentYear").length==2){
							_this.tBody.find("td").unbind("tap");
						};
					}
					_this.setSelectedTd();
					
				}else{
					if($(this).find("span").html()){
						$("span.currentYear").removeClass('currentYear');
						$(this).find("span").addClass('currentYear');
					}
				}
			})
			this.setTdUnClick();
		},
		//取消绑定按钮
		setTdUnClick:function(){
			$("span.color-gray").parent().unbind('tap');
		},
		//绑定已选择的
		setSelectedTd:function(){
			var _this=this;
			$("span.currentYear").parent().unbind("tap");
			$("span.currentYear").parent().bind("tap",function(){
				$(this).find("span").removeClass('currentYear');
				var date=_this.getCurrentTime($(this).find("span").html());
				_this.newDay.splice(_this.newDay.indexOf(date),1);
				_this.setTdClick();
			});
		},
		//设置被选中的日期
		setSelectedTdClss:function(){
			var _this=this;
			this.newDay.forEach(function(item){
				var date=_this.getCurrentTime(1);
				if(parseInt(item/100)==parseInt(date/100)){
					_this.tBody.find("td").each(function(){
						if($(this).find("span").html()==item%100){
							$(this).find("span").addClass('currentYear');
						}
					})
				}
			})
		},
		//获取当前日期
		getCurrentTime:function(d){
			console.log(this.title)
			var str = this.title.html();
			var y = Number(str.slice(0, 4));
			var m = Number(str.slice(5, str.length - 1));
			return this.dCompareFormat(y,m,d);
		},
		//设置当日日期之前
		setPrevTd:function(val){
			return "<td ><span class='color-gray'>" + val + "</span></td>";
		},
		//设置当前日期样式
		setCurrentTd:function(val){
			return "<td ><span class='currentYear'>" + val + "</span></td>";
		},
		//设置当前日期之后
		setNextTd:function(val){
			return "<td ><span>" + val + "</span></td>";
		},
		//获取当前月总天数
		getDays:function(y,m){
			var isy = false;
			if (y % 400 == 0 || (y % 4 == 0 && y % 100 != 0)) isy = true;
			switch (m) {
				case 1:
				case 3:
				case 5:
				case 7:
				case 8:
				case 10:
				case 12:
					return 31;
				case 4:
				case 6:
				case 9:
				case 11:
					return 30;
				case 2:
					return isy ? 29 : 28;
			}
		},
		//获取当月第一天的星期
		getFirstDay:function(y,m){
			return new Date(y, m, 1).getDay();
		},
		//获取日历显示格式
		getMonthArr:function(y,m){
			var days = this.getDays(y, m);
			var firstday = this.getFirstDay(y, m - 1);
			firstday = firstday < 1 ? 2 : firstday + 1;
			var arr = [];
			var m = 1;
			var ws = Math.ceil((days + firstday - 1) / 7);
			for (var k = 0; k < ws; k++) {
				arr[k] = [];
			}
			for (var i = 0; i < firstday - 1; i++) {
				arr[0][i] = '';
			}
			for (var i = firstday - 1; i < 7; i++) {
				arr[0][i] = m;
				m++;
			}
			for (var j = 1; j < ws; j++) {
				for (var n = 0; n < 7; n++) {
					arr[j][n] = m;
					m++;
					if (m > days || m == "1") {
						m = "";
					}
				}
			}
			return arr;
		},
		//设置数字格式
		formatNum:function(i) {
			return i >= 10 ? ""+i : "0" + i;
		},
		//日期比较格式
		dCompareFormat:function(y,m,d){
			return Number(Number(y)+this.formatNum(m)+this.formatNum(d));
		},
		//更换日历
		changeDate:function(index){
			var y=this.title.html().slice(0,4);
			var m=this.title.html().slice(5,this.title.html().length-1);
			m =Number(m)+index;
			if(m>12){
				m=m%12;
				y=Number(y) + 1;
			}
			if(m<1){
				m=12;
				y=Number(y) - 1;
			}
			this.setTtitle(y,m);
			this.setTbody(y,m,1);
			this.setTdClick();
			this.setSelectedTdClss();
			this.setSelectedTd();
		},
		getTimeArr:function(){
			return this.newDay;
		}
	}
	window["Calendar"]=Calendar;
})(Zepto)