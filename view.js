let { 
	headers ,
	FloatHeaders,
	SystemHeaders,
	HeaderKeyFilterSwitch,	
		
	pageNum ,
	PageSize ,

	FileNameFilterSearch ,
	FolderFilterSearch,
	PathFilterSearch,
	TagsFilterSearch ,
	KeysFilterSearch ,
	ValuesFilterSearch ,

	ContentSearch , 
	dateFilterBy ,
       
 	DateSearch ,
	 Intervalday,
 	AnkiFrequncey ,

 	ContainerStartDateValue ,
 	ContainerEndDateValue ,
 	ContainerMonthDateValue ,
 	ContainerWeekDateValue ,

	GroupByKeyShowSwitch,
	
	GroupBy,
	GroupOrder ,

	SortBy ,
	SortOrder,
		
	className,
	ExcludeSystemKey,

	 } = input ;
	 


  // 03 - 容器类函数
      // 01 - 创建通用的 Flex 容器函数
		   function createFlexContainer(cls, justifyContent, flexDirection = "row") {
			 let container = document.createElement("div");
			 //let container = document.createElement("div");
			 container.className = cls;
			 container.style.display = "flex";
			 container.style.justifyContent = justifyContent;
			 container.style.flexDirection = flexDirection;
			 return container;
			   }
		 
      // 02 - 文本输入框函数
		   function createInputField(placeholder, defaultValue) { 
		     const input = document.createElement("input", "");     // 创建输入框
		     input.type = "text";                                  // 设置输入框的类型
		     input.className = "input-field";                     // 设置输入框的css类型
		     input.placeholder = placeholder;      // 占位符，，就是"底层的提示语"
		     input.value = defaultValue;        // 设置，就是到时候你创建时，第2个参数就是此框的默认值
		     return input; 
		     }
	 
      // 03 - 创建下拉选项框
		function createSelectField(options, defaultValue) {
		    const select = document.createElement("select");
		    select.className = "select-field";
		    
		    options.forEach(optionText => {
		        const option = document.createElement("option");
		        option.textContent = optionText; // 设置选项文本
		        option.value = optionText;
		        if (optionText === defaultValue) {
		            option.selected = true; // 设置默认选项
		        }
		        select.appendChild(option);
		    });
		    
		    return select;
		     }
  
      // 04 - 创建按钮-函数
		  function createButton(text) {
		    const button = dv.el("button", text);
		    button.className = "button";
		    return button;
		     }
     
  // 04 - 重要的辅助函数

	// 09 -  提取 日期时，必备的辅助函数 -- 把日期拆成年 | 月 |日 - 单独的
	    function formatDate(dateStr) {
			const date = new Date(dateStr);
			const year = date.getFullYear().toString();
			const month = (date.getMonth() + 1).toString().padStart(2, '0');
			const day = date.getDate().toString().padStart(2, '0');
			return { tYear: year, tMonth: month, tDay: day };
			}

	// 10 - 把拆解的日期 ，重新组成   年+月+日，即标准的 yyyy-mm-dd
		function formatFullDate(dateStr) {
		    const { tYear, tMonth, tDay } = formatDate(dateStr);
		    return `${tYear}-${tMonth}-${tDay}`;
			}

	// 12 -  定义处理页面数组的函数 ；拆解ctime mtime；把年月日，都拆出来 ，做匹配用 	
		function processPagesArray(pagesArray) {
		    return pagesArray.map(page => {
		        const fileCtime = formatFullDate(page.ctime);
		        const fileMtime = formatFullDate(page.mtime);
		
		        // 拆分 fileCtime 和 fileMtime
		        const { tYear: fileCyear, tMonth: fileCmonth, tDay: fileCday } = formatDate(fileCtime);
		        const { tYear: fileMyear, tMonth: fileMmonth, tDay: fileMday } = formatDate(fileMtime);
		
		        return { 
		            ...page, 
		            fileCtime, 
		            fileMtime,
		            fileCyear, 
		            fileCmonth, 
		            fileCday,
		            fileMyear, 
		            fileMmonth, 
		            fileMday 
		        };
		    });
			}

    // 01 - 动态日期函数包  -- 返回动态的 30个变量（今年去年明年|本月下月|上月~月初月末） 不用动的
	
	    function DateFilterPackage() {
		    // 01- 定义格式化日期为 yyyy-MM-dd 字符串的函数
		            function formatDate(date) {
		            const year = date.getFullYear();
		            const month = (date.getMonth() + 1).toString().padStart(2, '0');
		            const day = date.getDate().toString().padStart(2, '0');
		            return `${year}-${month}-${day}`;
		            }
		    
		        const currentDate = new Date();                       // 获取当前日期
		        const currentYear = currentDate.getFullYear();        // 获取当前年份和月份
		        const currentMonth = currentDate.getMonth();          // 0-11 代表1月到12月
		 
		    // 02 - 补充的周的计算的函数  3个，是计算周的范围，动态的； 6个时间，一周的起与始，本周，上周，下一周
		       // 01 --  计算本周的开始和结束日期
				 	  function getWeekRange(date) {
				 	      const currentDate = new Date(date);
				 	      const firstDay = currentDate.getDate() - currentDate.getDay(); // 获取本周的第一天（周日）
				 	      const lastDay = firstDay + 6; // 获取本周的最后一天（周六）
				 	  
				 	      const startOfWeek = new Date(currentDate.setDate(firstDay));
				 	      const endOfWeek = new Date(currentDate.setDate(lastDay));
				 	  
				 	      return {
				 	          startOfWeek: formatDate(startOfWeek),
				 	          endOfWeek: formatDate(endOfWeek)
				 	      };
				 	      }
		        
			   // 02  --  计算上一周的开始和结束日期
				function getPreviousWeekRange(date) {
					const currentDate = new Date(date);
					currentDate.setDate(currentDate.getDate() - 7); // 获取上周的同一天
					return getWeekRange(currentDate);
					}
			 
			   // 03  --  计算下一周的开始和结束日期
					  function getNextWeekRange(date) {
						  const currentDate = new Date(date);
						  currentDate.setDate(currentDate.getDate() + 7); // 获取下周的同一天
						  return getWeekRange(currentDate);
						  }
		 
		    // 容错处理  -- 当1月时，判断上一个月有坑； 本质上，上个月的运算是通过  0~11 ±1来的，如果1月，0--1=-1 ，得不到12的哈，得处理 
		        let previousMonthYear = currentYear;
		        let previousMonth = currentMonth - 1;
		        if (currentMonth === 0) {  // 当前月份为 1 月时
		            previousMonthYear = currentYear - 1;
		            previousMonth = 11; // 12 月
		            }
		    
		    // 容错处理 - 12月时，判断下一个月有坑； 本质上是因为这个计算下一个用，用的是   0~11 ±1； 跨年的话没办法再 - 下去了 
		        let nextMonthYear = currentYear;
		        let nextMonth = currentMonth + 1;
		        if (currentMonth === 11) {  // 当前月份为 12 月时
		            nextMonthYear = currentYear + 1;
		            nextMonth = 0; // 1 月
		            }
		    
		    // 先组装-年初-年末  ~ 动态的
		        const startofYear = new Date(new Date().getFullYear(), 0, 1)
		        const endofYear = new Date(new Date().getFullYear(), 11, 31)
		    
		    
		        const LaststartofYear = new Date(new Date().getFullYear()-1, 0, 1)      // 去年  --- 年初  | 年末 
		        const LastendofYear = new Date(new Date().getFullYear()-1, 11, 31)
		        const FuturestartofYear = new Date(new Date().getFullYear()+1, 0, 1)     // 明年  ---  年初 \ 年末 
		        const FutureendofYear = new Date(new Date().getFullYear()+1, 11, 31)
		    
		       // 组装-本月 - 月初-月末  ~ 动态的
		        const startOfMonth = new Date(currentYear, currentMonth, 1);      //  本月  -- 月初 |  月末 
		        const endOfMonth = new Date(currentYear, currentMonth + 1, 0);    
		        const LaststartOfMonth = new Date(previousMonthYear, previousMonth, 1);   // 上个月，月初 | 月末 
		        const LastendOfMonth = new Date(currentYear, currentMonth, 0);        
		        const NextstartOfMonth = new Date(nextMonthYear, nextMonth, 1);         //下个月，月初 \ 月末 
		        const NextendOfMonth = new Date(nextMonthYear, nextMonth + 1, 0);
		 
		    // 转换 - 动态的 - 本年年初 \ 本月年末
		        const FloatYearStart = formatDate(startofYear);   // 格式化日期   --今年
		        const FloatYearEnd = formatDate(endofYear);       // 格式化日期
		        const FloatLastYearStart = formatDate(LaststartofYear);   // 格式化日期   --- 去年
		        const FloatLastYearEnd = formatDate(LastendofYear);       // 格式化日期
		        const FloatFutureYearStart = formatDate(FuturestartofYear);   // 格式化日期   --明年
		        const FloatFutureYearEnd = formatDate(FutureendofYear);       // 格式化日期
		        
		    // 转换 -动态的 - 本月月初 \ 本月月末
		        const FloatMonthStart = formatDate(startOfMonth);   // 格式化日期 -- 本月 
		        const FloatMonthEnd = formatDate(endOfMonth);       // 格式化日期
		        const FloatLastMonthStart = formatDate(LaststartOfMonth);     // 格式化日期 -- 上月 
		        const FloatLastMonthEnd = formatDate(LastendOfMonth);     
		        const FloatNextMonthStart = formatDate(NextstartOfMonth);  
		        const FloatNextMonthEnd = formatDate(NextendOfMonth);    
		    
		    // 拆解 → 得到单独的 数字部分，    去年 | 今年 | 明年 ；   本月 |上月| 下月
		        let   LastYearNumber  = FloatLastYearStart.split('-')[0];
		        let   CurrentYearNumber=  FloatYearStart.split('-')[0];
		        let   FutureYearNumber=  FloatFutureYearStart.split('-')[0];
		        
		        let   LastMonthNumber  =  FloatLastMonthStart.split('-')[1];
		        let   CurrentMonthNumber =  FloatMonthStart.split('-')[1];
		        let   NextMonthNumber =  FloatNextMonthStart.split('-')[1];
		 
		    // 补充  -- 前天 \ 昨天   \  明天  \ 后天        动态的；  
				  	const dayBeforeYesterday = new Date(currentDate);
				  	dayBeforeYesterday.setDate(currentDate.getDate() - 2);
				  	const FloatDayBeforeYesterday = formatDate(dayBeforeYesterday);
				  	
				  	const yesterday = new Date(currentDate);
				  	yesterday.setDate(currentDate.getDate() - 1);
				  	const FloatYesterday = formatDate(yesterday);
				  	
				  	const tomorrow = new Date(currentDate);
				  	tomorrow.setDate(currentDate.getDate() + 1);
				  	const FloatTomorrow = formatDate(tomorrow);
				  	
				  	const dayAfterTomorrow = new Date(currentDate);
				  	dayAfterTomorrow.setDate(currentDate.getDate() + 2);
				  	const FloatDayAfterTomorrow = formatDate(dayAfterTomorrow);
				  	
				  	const CurrentDayNumber = String(currentDate.getDate());    // 今天的日期  的号数，比如  01  25 
				  	
				  	const FloatToday = formatDate(currentDate);    // 动态当天的 yyyy-mm-dd 也常用 ，也取了吧  
		 
		    // 补充 -- 前年  \ 后年   
		 
				  	const yearBeforeLast = currentDate.getFullYear() - 2;
				  	const FloatYearBeforeLast = String(yearBeforeLast);
				  
				  	// 后年
				  	const yearAfterNext = currentDate.getFullYear() + 2;
				  	const FloatYearAfterNext = String(yearAfterNext);
		 
		 	// 补充的 -- 本周 | 上周 | 下一周  （开始 + 结束 ） （共6个时间）
				 		const currentWeek = getWeekRange(currentDate);           // 这个是第一步，只是得到的2个时间  起与始在一起，还要再拆
				 	    const previousWeek = getPreviousWeekRange(currentDate);  
				 	    const nextWeek = getNextWeekRange(currentDate);
				 
				    // 解析上一周的完整日期
				 	    let FloatLastWeekFullyDateStart = previousWeek.startOfWeek;
				 	    let FloatLastWeekFullyDateEnd = previousWeek.endOfWeek;
				 	  
				 	  // 解析本周的完整日期
				 	    let CurrentWeekFullyDateStart = currentWeek.startOfWeek;
				 	    let CurrentWeekFullyDateEnd = currentWeek.endOfWeek;
				 	  
				 	  // 解析下一周的完整日期
				 	     let FloatNextWeekFullyDateStart = nextWeek.startOfWeek;
				 	     let FloatNextWeekFullyDateEnd = nextWeek.endOfWeek;
		  
		 
		    // 上面一顿操作，就是计算出了18个变量   动态的变量      
		            //   FloatYearStart,            FloatYearEnd              动态的；  本年年初、 年末
		            //   FloatLastYearStart,     FloatLastYearEnd,        动态的；  去年年初、 年末
		            //   FloatFutureYearStart,  FloatFutureYearEnd,   动态的；  明年初、 年末
		    
		            //   FloatMonthStart,       FloatMonthEnd,          动态的；  本月月初，月末 
		            //   FloatLastMonthStart, FloatLastMonthEnd,    动态的；  上个月月初，月末  （要解决跨年时的1月问题）
		            //   FloatNextMonthStart, FloatNextMonthEnd,     动态的； 下个月月初，月末（要解决跨年时的12月问题）
		            //   FloatDayBeforeYesterday, FloatYesterday, FloatTomorrow, FloatDayAfterTomorrow,   动态的 - 前天，昨天，明天，后天
		    
		        return {FloatYearStart,FloatYearEnd,
		                FloatLastYearStart, FloatLastYearEnd,
		                FloatFutureYearStart,  FloatFutureYearEnd,
		                FloatMonthStart,       FloatMonthEnd,   
		                FloatLastMonthStart, FloatLastMonthEnd,
		                FloatNextMonthStart, FloatNextMonthEnd,
		                LastYearNumber, CurrentYearNumber, FutureYearNumber,
		                LastMonthNumber, CurrentMonthNumber ,NextMonthNumber ,
		                FloatDayBeforeYesterday, FloatYesterday, FloatTomorrow, FloatDayAfterTomorrow, // 前天 \ 昨天   \  明天  \ 后天   
		                FloatToday,      // 动态的当天 yyyy-mm-dd日期 
		                CurrentDayNumber,    // 今天的number号  
		        		FloatYearBeforeLast,FloatYearAfterNext,  // 前年 ，后年 
		        		FloatLastWeekFullyDateStart,FloatLastWeekFullyDateEnd,   // 上一周周一、周末 
		          		CurrentWeekFullyDateStart,  CurrentWeekFullyDateEnd ,    // 本周周一、周末 
		          		FloatNextWeekFullyDateStart  ,FloatNextWeekFullyDateEnd, // 下一周，周一、周末
		        		
		                
		                };
		        }
	 
    // 02 - 中文日期搜索string处理函数     ChineseSwitch
	   // " 上年 去年，明年， 下一年 上月 上个月 下月 下个月 今年 今天";
	   // " 2022  2021  2023  2024   5月  7月   1号  10~15日  " 
	   // " 2024-05-06  2025-08-09  "
	   // 前天，昨天  | 明天   | 后天 \  今天   \ 当天  | 今日      
			   
		function ChineseSwitch(DateSearch) {
			// 01 - 准备3个空数组 ，存最后处理好的结果
			 // 大白话，就是把日期 ，分拆为 年，月，日，后期，我们去精确匹配哈；  
				let ArrayOneYear = [];
				let ArrayOneMonth = [];
				let ArrayDay = [];
		
			// 02 - 动态日期函数包返回值解析  （动态的，本年，下一年，上一年；本月月初，月末 ，年初，年末....）
				let { FloatYearStart,FloatYearEnd,
				   FloatLastYearStart, FloatLastYearEnd,
				   FloatFutureYearStart,  FloatFutureYearEnd,
				   FloatMonthStart,       FloatMonthEnd,   
				   FloatLastMonthStart, FloatLastMonthEnd,
				   FloatNextMonthStart, FloatNextMonthEnd,
				   LastYearNumber, CurrentYearNumber, FutureYearNumber,
				   LastMonthNumber, CurrentMonthNumber ,NextMonthNumber,    
				   FloatDayBeforeYesterday, FloatYesterday, FloatTomorrow, FloatDayAfterTomorrow,  
				   FloatToday,       // 动态的当天 yyyy-mm-dd日期       
				   CurrentDayNumber,    // 今天的number号				   
				   FloatYearBeforeLast,FloatYearAfterNext,  // 前年 ，后年 
				   FloatLastWeekFullyDateStart,FloatLastWeekFullyDateEnd,   // 上一周周一、周末 
       			   CurrentWeekFullyDateStart,  CurrentWeekFullyDateEnd ,    // 本周周一、周末 
       			   FloatNextWeekFullyDateStart  ,FloatNextWeekFullyDateEnd, // 下一周，周一、周末
					} = DateFilterPackage();      // 解析数据 ，就是之前的那些返回值
		
		    // 02.5 -- 解决动态的，年月日问题 
				//  " 上年 去年，明年， 下一年 上月 上个月 下月 下个月 今年 今天";   这些全解决了；  
			    // 定义替换规则
				    const replaceValues = {
				        '今年年初': FloatYearStart,
				        '今年年末': FloatYearEnd,
				        '前年': FloatYearBeforeLast,
				        '后年': FloatYearAfterNext,
				        '前天': FloatDayBeforeYesterday,
				        '昨天': FloatYesterday,
				        '明天': FloatTomorrow,
				        "今天": FloatToday,
				        "当天": FloatToday,
				        "今日": FloatToday,
				        '后天': FloatDayAfterTomorrow,
				        '年初': FloatYearStart, // 放在更具体的之后
				        '年末': FloatYearEnd,    // 放在更具体的之后				        
				        '年末': FloatYearEnd,    // 放在更具体的之后
				        
				    };
				
				    const replaceAndAddToArray = {
				        '今年|本年': CurrentYearNumber,
				        '上一年': LastYearNumber,
				        '去年': LastYearNumber,
				        '下一年': FutureYearNumber,
				        '明年': FutureYearNumber
				    };
				
				    const replaceAndAddToMonthArray = {
				        '这个月': CurrentMonthNumber,
				        '本月': CurrentMonthNumber,
				        '上个月': LastMonthNumber,
				        '上月': LastMonthNumber,
				        '下个月': NextMonthNumber,
				        '下月': NextMonthNumber
				    };
				
				    const replaceAndAddToDayArray = {
				        '今天|today': CurrentDayNumber
				    };
				
				    // 替换值
				    for (const [key, value] of Object.entries(replaceValues)) {
				        const regex = new RegExp(key, 'g');
				        DateSearch = DateSearch.replace(regex, value);
				    }
				
				    // 替换并加入 ArrayOneYear
				    for (const [key, value] of Object.entries(replaceAndAddToArray)) {
				        const regex = new RegExp(key, 'g');
				        if (regex.test(DateSearch)) {
				            ArrayOneYear.push(value);
				            DateSearch = DateSearch.replace(regex, '');
				        }
				    }
				
				    // 替换并加入 ArrayOneMonth
				    for (const [key, value] of Object.entries(replaceAndAddToMonthArray)) {
				        const regex = new RegExp(key, 'g');
				        if (regex.test(DateSearch)) {
				            ArrayOneMonth.push(value);
				            DateSearch = DateSearch.replace(regex, '');
				        }
				    }
				
				    // 替换并加入 ArrayDay
				    for (const [key, value] of Object.entries(replaceAndAddToDayArray)) {
				        const regex = new RegExp(key, 'g');
				        if (regex.test(DateSearch)) {
				            ArrayDay.push(value);
				            DateSearch = DateSearch.replace(regex, '');
				        }
				    }

			// 02.6 匹配   “每月” 和  “每个月”，
			  // 将 [01, 02, ..., 12] 加入 ArrayOneMonth，并将“每月”替换为空
				const everyMonthRegex = /每月|每个月/g;
				if (everyMonthRegex.test(DateSearch)) {
				    ArrayOneMonth.push(...['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']);
				    DateSearch = DateSearch.replace(everyMonthRegex, '');
					}
	
			// 03 -- 年月日 ~ 标准匹配  yyyy-mm-dd 日期，如2024-05-06 ;  2024.5.6
				DateSearch = DateSearch.replace(/[.]/g, '-0');      // 先把空上点给替换成-0，就变成了标准了的		
					
				let NormalMatches = DateSearch.match(/\b(\d{4})-(\d{2})-(\d{2})\b/g);
				    
				if (NormalMatches) {
				    NormalMatches.forEach(match => {
				       // 将匹配到的年、月、日加入数组
				       let [, year, month, day] = match.match(/^(\d{4})-(\d{2})-(\d{2})$/);
				       ArrayOneYear.push(year);
				       ArrayOneMonth.push(month);
				       ArrayDay.push(day);
				    });
				
				    // 替换匹配到的标准日期格式为空
				    DateSearch = DateSearch.replace(/\b(\d{4})-(\d{2})-(\d{2})\b/g, '');
				    }
		
				//  
				
			// 04 - 年份 -- 匹配  23年 24年  25年变成  2023  2024  2025  2026
		        // 定义正则表达式
		        let regexYear = /(\d{2})年/g;
		        let matchesYear = [];
		
		        // 收集所有匹配项
		        let matchYearValue;
		        while ((matchYearValue = regexYear.exec(DateSearch)) !== null) {
		            matchesYear.push(matchYearValue);
		        }
		
		           // 处理每个匹配项
		
		         matchesYear.forEach(match => {
		
		         let year = match[1];
		         let fullYear = "20" + year;  // 在前面加上 "20"
		        //dv.paragraph(`DateSearch - 年 - 处理之后 : ${fullYear}`);
		  
		  
		        let yearNumber = parseInt(fullYear, 10);
		        //dv.paragraph(`DateSearch - 年 - 处理之后 : ${yearNumber}`);
		
		        let tempArray = [];
		           // 检查是否在 1 到 31 范围内
		        tempArray.push(yearNumber);
		        tempArray = Array.from(new Set(tempArray)).sort((a, b) => a - b);   
		        ArrayOneYear = Array.from(new Set([...ArrayOneYear, ...tempArray]));   
		        DateSearch = DateSearch.replace(match[0], '').trim();
		
		        });
		
			// 05 - 年份 -- 匹配：  2021  2022  2023 ，这种光年份的  
			
				const OnlyNumberYearRegex = /\b\d{4}\b/g;   // 正则表达式匹配4位数字
				
				// 匹配到的年份
				let matchedYears = DateSearch.match(OnlyNumberYearRegex);
				
				if (matchedYears) {
				    // 将匹配到的年份添加到 ArrayOneYear 数组中
				    ArrayOneYear.push(...matchedYears);
				    
				    // 将匹配到的年份从 DateSearch 中移除
				    DateSearch = DateSearch.replace(OnlyNumberYearRegex, '').trim();
				}
		
		    // 06 - 月份处理 -- “一月  三月   1月  02月  ”  → 最终处理成：  01   02    12  ，这样的 mm形式  
		    
			   // 01 -- 定义中文替换成数组 函数  + 直接替换 ；   即   一月 | 二月， 换成数组的 1月  2月  12月    
			    function replaceChineseMonths(DateSearch) {
			       const chineseMonths = {
			       '一月': '1月',
			       '二月': '2月',
			       '三月': '3月',
			       '四月': '4月',
			       '五月': '5月',
			       '六月': '6月',
			       '七月': '7月',
			       '八月': '8月',
			       '九月': '9月',
			       '十月': '10月',
			       '十一月': '11月',
			       '十二月': '12月'
			         };
			
			        return DateSearch.replace(/(一月|二月|三月|四月|五月|六月|七月|八月|九月|十月|十一月|十二月)/g, match => chineseMonths[match]);
			         }
		
			    DateSearch = replaceChineseMonths(DateSearch);   // 直接用定义好的替换函数，把 中文的月替换成英语的月
		
			   // 02 -- 最终一起处理；即  要求你的月的形式是    '1月  7月   9月'   或者  "01月  02月  03月"形式的   
		
					let monthMatches = DateSearch.match(/\d{1,2}月/g);
					if (monthMatches) {
					    ArrayOneMonth = monthMatches.map(month => {
					        let num = month.replace('月', '').trim();
					        if (parseInt(num, 10) <= 12) {
					           return num.padStart(2, '0');
					            } else {
					            return null; // 忽略大于12的月份
					            }
					    }).filter(month => month !== null); // 过滤掉为 null 的项
					
					    DateSearch = DateSearch.replace(/\d{1,2}月/g, ''); // 替换为空
					
					    } else {
					   // 处理其他格式的月份
					    }
						
			// 07 - Day处理  --- 序列日期 ：  比如1~10号，  1-12号；  12-19号 , 批量加间隔 
				 // 如1~5号，那就是 ：  01  02  03  04 05 ； 生成 dd格式 的  
			        let regexinterval = /(\d{1,2})[-~](\d{1,2})[号日]/g;
			        let matchesinterval = [];
			
			        // 收集所有匹配项
			        let  matchvalue ; 
			        while ((matchvalue = regexinterval.exec(DateSearch)) !== null) {
			            matchesinterval.push(matchvalue);
			            }
			
			        // 处理每个匹配项
			        matchesinterval.forEach(match => {
			           let start = parseInt(match[1], 10);
			           let end = parseInt(match[2], 10);
			
			           // 排序从小到大
			           if (start > end) {
			               [start, end] = [end, start];
			           }
			
			           // 生成数字系列并加入到临时数组中
			           let tempArray = [];
			           for (let i = start; i <= end; i++) {
			               tempArray.push(i.toString().padStart(2, '0'));  // 保证是两位数格式
			                    }
			
			           // 将临时数组中的元素加入到 ArrayDay 中，并去重
			           ArrayDay = Array.from(new Set([...ArrayDay, ...tempArray]));
			
			           // 将匹配的部分替换为空字符串
			           DateSearch = DateSearch.replace(match[0], '').trim();
			           });
			
		    // 08 - 日期提取 -- 要求你的形式是  " 1号  9号，   9日  10日  "
		
					let dayMatches = DateSearch.match(/\d{1,2}(?:号|日)/g);
					if (dayMatches) {
					    ArrayDay = dayMatches.map(day => {
					       let num = day.replace('号', '').replace('日', '').trim();
					       let dayNumber = parseInt(num, 10);
					       if (dayNumber >= 1 && dayNumber <= 31) {
					            return dayNumber.toString().padStart(2, '0');
					        } else {
					            return null; // 不符合范围的日期返回 null
					        }
					    }).filter(day => day !== null); // 过滤掉不符合范围的日期
					    } else {
					    // 处理其他格式的日期
					    }


  			// 16 -- 关于周的处理 -- （把一周的day，肯定全加进到数组 day中去）  上周  | 本周 | 下周 
			
				// 解析日期字符串并生成一周的日期数组
					function generateWeekDays(startDate, daysArray, monthsArray, yearsArray) {
					 let start = new Date(startDate);
					 for (let i = 0; i < 7; i++) {
						 let current = new Date(start);
						 current.setDate(start.getDate() + i);
						 const year = current.getFullYear();
						 const month = (current.getMonth() + 1).toString().padStart(2, '0');
						 const day = current.getDate().toString().padStart(2, '0');
						 daysArray.push(day);
						 monthsArray.push(month);
						 yearsArray.push(year);
					 	}
						}
				
			
				// 处理"本周", "这一周", "此周", "这周"
					let regexCurrentWeek = /本周|这一周|此周|这周/g;
					if (regexCurrentWeek.test(DateSearch)) {
					    generateWeekDays(CurrentWeekFullyDateStart, ArrayDay, ArrayOneMonth, ArrayOneYear);
					    DateSearch = DateSearch.replace(regexCurrentWeek, '');
					}
				
				// 处理"上周", "上一周"
					let regexLastWeek = /上周|上一周/g;
					if (regexLastWeek.test(DateSearch)) {
					    generateWeekDays(FloatLastWeekFullyDateStart, ArrayDay, ArrayOneMonth, ArrayOneYear);
					    DateSearch = DateSearch.replace(regexLastWeek, '');
					}
				
				// 处理"下周", "下一周"
					let regexNextWeek = /下周|下一周/g;
					if (regexNextWeek.test(DateSearch)) {
					    generateWeekDays(FloatNextWeekFullyDateStart, ArrayDay, ArrayOneMonth, ArrayOneYear);
					    DateSearch = DateSearch.replace(regexNextWeek, '');
					}


			// 15 -- 00 --  年份 | 月份| 日期 ~ 最终处理 - 01 -- 准备衔准备3个组 
				let firstItems = {
				    year: ArrayOneYear[0],
				    month: ArrayOneMonth[0],
				    day: ArrayDay[0]
				    };
		
			// 15 -- 01  年份处理  --  （取1000~3000年间 | 排序 | 去重 ）
				ArrayOneYear = ArrayOneYear.filter(year => {
				    let yearNumber = parseInt(year, 10);
				    return yearNumber >= 1000 && yearNumber <= 3000;
				});
				
				ArrayOneYear = [...new Set(ArrayOneYear.map(year => parseInt(year, 10)))];    // 去重（有转成number了）
				ArrayOneYear.sort((a, b) => a - b); // 从小到大排序	
				ArrayOneYear = ArrayOneYear.map(year => year.toString());    // 转换回字符串类型
					
			// 15 -- 02  月处理  --  （取1~12月 | 排序 | 去重 ）（避免出现18月这样不标准的）
				ArrayOneMonth = ArrayOneMonth.filter(month => {
				    let monthNumber = parseInt(month, 10);
				    return monthNumber >= 1 && monthNumber <= 12;
				});
				
				ArrayOneMonth = [...new Set(ArrayOneMonth)].map(month => month.padStart(2, '0'));
				ArrayOneMonth.sort(); // 默认从小到大排序
			
			// 15 -- 03  Day处理  --  （取1~31号 | 排序 | 去重 ）（避免出现76号这样不标准的）
				ArrayDay = ArrayDay.filter(day => {
				    let dayNumber = parseInt(day, 10);
				    return dayNumber >= 1 && dayNumber <= 31;
				});
				
				ArrayDay = [...new Set(ArrayDay)].map(day => day.padStart(2, '0'));    // 去重   
				ArrayDay.sort();     // 默认从小到大排序
		


			//checkArrayTypes(ArrayOneYear);
			//checkArrayTypes(ArrayOneMonth);

			return {  ArrayOneYear, ArrayOneMonth, ArrayDay};
			}

	// 03 -- adjustedDate ± 时间块 - 辅助 ~ 时间±调整函数   → 在时间块函数时硕同要用到它  
	   function adjustedDate(days) {
		   let date = new Date();
		   date.setDate(date.getDate() + days);
		   let year = date.getFullYear();
		   let month = (date.getMonth() + 1).toString().padStart(2, '0');
		   let day = date.getDate().toString().padStart(2, '0');
		   return `${year}-${month}-${day}`;
		    }

	// 04 --  processIntervalday(Intervalday) 时间块 - 筛选 - 辅助 - 搜索的 sting 处理的函数
		  function processIntervalday(Intervalday) {		  
			    // 1.    processIntervalday(Intervalday)   这个函数处理的结果 返回 的有几种情况  
				 // 2.  第1种：true  
				 // 3.  第2种 -- 即0 ，当天： type: arrayA    ； values:   2024-07-18        
				 // 4.  第3种-- 即anki模式： type: arrayA   ；  values:  2024-07-08  ，2024-07-23  ， 2024-07-25 ；  
				 // 5.  第4种 -- 即标准的时间块 t1~t2： type: arrayB ；   values:  2024-07-08  ， 2024-07-28
				 // 6.  总结 ，都是类型为 arrayA 时，里面的区别 是值的个数不一样；  
				
				// 00 -- 防御设计 
				   if (!Intervalday || typeof Intervalday !== 'string' || !Intervalday.trim()) {
				       return true; // 防御设计
				       }
				
				// 01 - 简单处理： 去除两边空格并转为字符串，替换所有± ，因为有的时候不识别 ； 
				      Intervalday = Intervalday.trim();   
				      Intervalday = Intervalday.replace(/±/g, '+-');    // 替换所有 `±` 符号为 `+-`
				
				// 02 -  定义正则表达式匹配数字
				      const numberPattern = /[+-]?\d+/g;
				
				// 03 -  arrayA组 ~ = 等号开头的 （标准多个 yyyy-mm-dd日期）
				       // = 1 3 5 7  ，这种是相当于Anki的频率了的  
				       if (Intervalday.startsWith('=')) {
				       let items = Intervalday.slice(1).match(numberPattern);
				       if (!items) return true;
				
				       items = items.map(item => Number(item)).filter(item => !isNaN(item));
				
				       // 使用 adjustedDate 计算日期数组
				       let dates = items.map(adjustedDate);
				
				       // 去重并排序
				       dates = [...new Set(dates)].sort((a, b) => new Date(a) - new Date(b));
				
				       return { type: 'arrayA', values: dates };
				       }
				
				   // 04 -  arrayB组 ~ 双开对称区间；  判断是否是 “±” “+-”  “-+” 开头
				   if (Intervalday.startsWith('+-') || Intervalday.startsWith('-+') || Intervalday.startsWith('+±')) {
				       let items = Intervalday.slice(2).match(numberPattern);
				       if (!items || items.length === 0) return true;
				
				       let number = Math.abs(Number(items[0]));
				       let dateRange = [-number, number].map(adjustedDate);
				
				       // 去重并排序
				       dateRange = [...new Set(dateRange)].sort((a, b) => new Date(a) - new Date(b));
				
				       return { type: 'arrayB', values: dateRange };
				       }
				// 05 -- 01 - 准备 标准情况处理  ~ 处理非=等号 、 “±” “+-”  “-+” 开头的情况
				   let items = Intervalday.match(numberPattern);
				   if (!items) return true;    
				   items = items.map(item => Number(item)).filter(item => !isNaN(item));   
				      let tempArray = items;          // 存为临时数组
				
				// 05 -- 02 - 单边用0 补全；    （是否只有一个元素且不为0）
				    if (tempArray.length === 1 && tempArray[0] !== 0) {
				       tempArray.push(0);
				           
				       let dates = tempArray.map(adjustedDate);         // 使用 adjustedDate 计算日期数组
				
				       // 去重并排序
				       dates = [...new Set(dates)].sort((a, b) => new Date(a) - new Date(b));
				
				       return { type: 'arrayB', values: dates };
				       }
				
				// 05 -- 03 - 就是1个光0 ； 我们手动补一下前1天，仍然组成 t1~t2
				   if (tempArray.length === 1 && tempArray[0] === 0) {
				       tempArray.push(0);
				
				       // 使用 adjustedDate 计算日期数组
				       let dates = tempArray.map(adjustedDate);
				
				       // 去重并排序
				       dates = [...new Set(dates)].sort((a, b) => new Date(a) - new Date(b));
				
				       return { type: 'arrayA', values: dates };
				       }
				
				// 05 -- 04 - 多个间隔 ；  最最大的区间，组成 t1~t2  
				       if (tempArray.length > 1) {
				           // 使用 adjustedDate 计算日期数组
				           let dates = tempArray.map(adjustedDate);
				    
				           // 去重并排序
				           dates = [...new Set(dates)].sort((a, b) => new Date(a) - new Date(b));
				    
				           // 只取第1个元素和最后一个元素，组成新的数组
				           let dateRange = [dates[0], dates[dates.length - 1]];
				    
				           return { type: 'arrayB', values: dateRange };
				       }
				
				   return true; // 默认返回 true  ,即你空值的时候，是 treu 
				}

    // 05 --  Anki复习筛选 --string 频率处理  → 对 Anki的频率进行解析的 
		function AnkiStringHandle(AnkiFrequncey) {
		    
		    // 删除中英字符，去除两边空格，string 化
			    AnkiFrequncey = AnkiFrequncey.replace(/[a-zA-Z\u4e00-\u9fa5]/g, '').trim().toString();
		    
		    // 容错防御设计：如果 AnkiFrequncey 为空或无定义时，返回 true   
		    
			    if (!AnkiFrequncey) {
			        return true;
			    }
			
		
		    // 所有除 +、- 和数字外的字符都当成分割符，切割并存为数组
			    let items = AnkiFrequncey.split(/[^0-9+\-]+/);
		
		    // 定义3个数组存放不同符号的数字
			    let arrayA = [];
			    let arrayB = [];
			    let arrayC = [];
			
		    // 遍历所有 item，分类存放到对应数组
			    items.forEach(item => {
			        let num = Number(item);
			        if (!isNaN(num)) {
			            if (item.startsWith('-')) {
			                arrayB.push(num);
			            } else if (item.startsWith('+')) {
			                arrayC.push(num);
			            } else {
			                arrayA.push(-num); // 没有符号的取反
			            }
			        }
			    });
			
		    // 利用函数 adjustedDate 对3个数组里的每一个 item 运算，得到3个新数组
			    let dateArrayA = arrayA.map(days => adjustedDate(days));
			    let dateArrayB = arrayB.map(days => adjustedDate(days));
			    let dateArrayC = arrayC.map(days => adjustedDate(days));
		
		    // 合并3个新数组，去重并从小到大排序
			    let combinedArray = [...new Set([...dateArrayA, ...dateArrayB, ...dateArrayC])].sort((a, b) => new Date(a) - new Date(b));
		
		    // 返回这个数组
			    return combinedArray;
			}

	// 06 -- 容器日期解析 -- 筛选  ---  把日期容器的参数 → 转换成 yyyy-mm-dd 日期 
		
	     function DateContainerStringCook(ContainerStartDateValue, ContainerEndDateValue, ContainerMonthDateValue, ContainerWeekDateValue) {
			    // type === 'arrayA'  ,   A 类    类似 ：[2024-06-18, 2024-07-14  ]   ;  里面有2个标准的 yyyy-mm-dd 日期 
				// type === 'arrayB' ，B 类   类似 ： [2024 ,  08 ]  ;  里面有2个标准的 yyyy 年份，与一个月份 mm       
				// type === 'arrayC'    ,  C 类，  类似 ： [ 2024-07-14 ]  ; 里面只有1 个标准的 yyyy-mm-dd 日期  【这个是日期只选择了一个起点的】
				
		        // 00 - 格式化日期函数，即处理为 string 格式的  yyyy-MM-dd
			        function formatDate(date) {
			            let year = date.getFullYear();
			            let month = (date.getMonth() + 1).toString().padStart(2, '0');
			            let day = date.getDate().toString().padStart(2, '0');
			            return `${year}-${month}-${day}`;
		                }
			    // 01 - 容错设计
			        if (!ContainerStartDateValue && !ContainerEndDateValue && !ContainerMonthDateValue && !ContainerWeekDateValue) {
			           return { type: 'none', values: [] };
			           }
		  
		        // 02 - 计算当前日期 tNowdate
			       let now = new Date();
			       let tNowYear = now.getFullYear();
			       let tNowMonth = (now.getMonth() + 1).toString().padStart(2, '0');
			       let tNowDay = now.getDate().toString().padStart(2, '0');
			       let tNowdate = `${tNowYear}-${tNowMonth}-${tNowDay}`;
		  
		        // 03 -  分组为 A 组 | C 组 ~    起始 | 结束日期 ，总有一个的；若只有一个用 t0当天日期，自动补全
					if (ContainerStartDateValue || ContainerEndDateValue) {
				       let tLow = ContainerStartDateValue ? ContainerStartDateValue : tNowdate;
				       let tUp = ContainerEndDateValue ? ContainerEndDateValue : tNowdate;
				   
				       if (tLow === tNowdate && tUp === tNowdate) {
				           // 去重并返回 C   ，这种是那种只选择了一个起点；自动补全为当天，这样有2个当天的时间，去重 ，我们存 C
				           let values = [...new Set([tLow, tUp].sort())];
				           return { type: 'arrayC', values: values };
				       } else {
				           // 不去重，返回 A   ； 即标准的    t1~t2时间区间 
				           let values = [tLow, tUp].sort();
				           return { type: 'arrayA', values: values };
				       }
		   			}
		   
		   
		        // 04 月容器  → 如  2025-08 ，拆分成  年，月；    分组为 B 组，并存储了【年，月】
				       if (ContainerMonthDateValue) {
				           let [tYear, tMonth] = ContainerMonthDateValue.split('-');
				           
				           return { type: 'arrayB', values: [tYear, tMonth] };
				       }
		
		
		        //  05 周容器  →    判断 4 个参数的值 - 3  -- 周容器，分组在 A 组； 本质上，仍然是   t1~t2时间区间 
		         // 如果存在值，把 2024-W25 ; 换算出 t1  , t2 周的起点日期 ；因为和 A 一样，我们减少类型，也称为 A 组
				       if (ContainerWeekDateValue) {
				           let [year, week] = ContainerWeekDateValue.split('-W');
				           year = parseInt(year);
				           week = parseInt(week);
				   
				           // 获取这一年的第一个星期一
				           let firstDayOfYear = new Date(year, 0, 1);
				           let dayOfWeek = firstDayOfYear.getDay();
				           let firstMonday = new Date(firstDayOfYear);
				   
				           // 如果第一个星期一不在本周内，调整到下一个星期一
				           if (dayOfWeek !== 1) {
				               firstMonday.setDate(firstDayOfYear.getDate() + (dayOfWeek === 0 ? 1 : 8 - dayOfWeek));
				           }
				   
				           // 计算目标周的第一个星期一
				           let firstDayOfWeek = new Date(firstMonday);
				           firstDayOfWeek.setDate(firstMonday.getDate() + (week - 1) * 7);
				   
				           // 计算目标周的第七天
				           let lastDayOfWeek = new Date(firstDayOfWeek);
				           lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
				   
				
				   
				           let tLow = formatDate(firstDayOfWeek);
				           let tUp = formatDate(lastDayOfWeek);
				           let values = [tLow, tUp].sort();
				           
				               return { type: 'arrayA', values: values };
				            }
				        
		       return { type: 'none', values: [] }; // 默认返回；如果有值就是  3种数组 ， arrayA   arrayB    arrayC   none
		      }

	// 08 -- String 类型的  搜索_Path_fileName_Tags_Heading_处理函数 
		  // 返回：true  ，就是空的，没有搜索
		  // 返回： A B C 3个数组   ；  就是  分类  ；A 类排序掉的  B 类是 or，还要的   C 类是严格要求 and 的；   
		  //  StringSearch  = " 什么鬼哈  +看看情况 哈  -对吗？ 不对吧  -哈哈只一， 呵呵  在  -去死 吧 " ;  
    
		  function StringCook(StringSearch) {
			    // 00 - 容错防御机制
				    if (!StringSearch || typeof StringSearch !== 'string') {
				        return true;
				    }
			
			    // 01 - 容错：转 string，去除两边空格，忽略大小写 \  如果处理后的 ListSearch 长度为 0，返回 true
			        StringSearch = StringSearch.trim().toLowerCase();
			
				    if (StringSearch.length === 0) {
				        return true;
				    }
			
			    // 02 - 分割；   标准，除了中英字符、+号、-号的，其他符号为分割符号
				    const splitRegex = /[^a-zA-Z0-9\u4e00-\u9fa5\+\-]/;
				    let parts = StringSearch.split(splitRegex);
				
				    let arrayA = [];
				    let arrayB = [];
				    let arrayC = [];
				
				    parts.forEach(part => {
				        part = part.trim();
				        if (part.length > 1) {
				            if (part.startsWith('-')) {
				                arrayA.push(part.substring(1).trim());
				            } else if (part.startsWith('+')) {
				                arrayB.push(part.substring(1).trim());
				            } else {
				                arrayC.push(part.trim());
				            }
				        } else if (part.length === 1 && part !== '+' && part !== '-') {
				            arrayC.push(part.trim());
				        }
				        });
			
			        // 删除所有非中英字符的符号
				    const removeNonAlphanumeric = (arr) => {
				        return arr.map(item => item.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '').trim());
				    };
			
				    arrayA = removeNonAlphanumeric(arrayA);
				    arrayB = removeNonAlphanumeric(arrayB);
				    arrayC = removeNonAlphanumeric(arrayC);
			
			    // 03 - 去重
				    arrayA = [...new Set(arrayA)];
				    arrayB = [...new Set(arrayB)];
				    arrayC = [...new Set(arrayC)];
			
			    // 04 - 交叉排除
				    arrayB = arrayB.filter(item => !arrayA.includes(item));
				    arrayC = arrayC.filter(item => !arrayA.includes(item));
				    arrayB = arrayB.filter(item => !arrayC.includes(item));
			
			    // 05 - 过滤掉空数组
				    arrayA = arrayA.length ? arrayA : null;
				    arrayB = arrayB.length ? arrayB : null;
				    arrayC = arrayC.length ? arrayC : null;
			
			    // 06 - 如果三个数组都为空，返回 true
				    if (!arrayA && !arrayB && !arrayC) {
				        return true;
				    }
				
				    return { arrayA, arrayB, arrayC };
				    }

	// 09 -- Page 信息里面的 tags，批量提取出来，连接在一起；好匹配用  
		function ExtractAndJoinTags(PageDataArray) {
		    return PageDataArray.map(page => {
		        // 检查是否有 tags 键并且 tags 是一个数组或对象
		        if (page.tags && typeof page.tags === 'object') {
		            // 提取所有 tags 的值，并忽略大小写和去除两边空格和 # 号
		            let tagsArray = Array.isArray(page.tags)
		                ? page.tags.map(tag => tag.trim().toLowerCase().replace(/^ #/ , ''))
		                : Object.values(page.tags).map(tag => tag.trim().toLowerCase().replace(/^ #/ , ''));
		            // 用逗号连接所有的 tags 值
		            let joinedTags = tagsArray.join(' , ');
		            // 增加一个新键 Tags，并将连接后的值存入其中
		            return { ...page, Tags: joinedTags };
		        } else {
		            // 如果没有 tags 键，直接返回 page 对象
		            return page;
		        }
			    });
				}

    // 10 -- Page 信息里面的 frontmatter；就是键与值，批量取，并且 连接在一起。为匹配使用 
		function ProcessFrontmatter(PageDataArray) {
		    return PageDataArray.map(page => {
		        // 检查是否有 frontmatter 键并且 frontmatter 是一个对象
		        if (page.frontmatter && typeof page.frontmatter === 'object') {
		            // 提取所有 frontmatter 的键和值，忽略大小写并去除两边空格，排除名为 'tags' 的键
		            let keys = Object.keys(page.frontmatter)
		                .filter(key => key.trim().toLowerCase() !== 'tags')
		                .map(key => key.trim().toLowerCase())
		                .join(',');
		            let values = Object.keys(page.frontmatter)
		                .filter(key => key.trim().toLowerCase() !== 'tags')
		                .map(key => String(page.frontmatter[key]).trim().toLowerCase())
		                .join(',');
		
		            // 增加两个新键 fileAllKeys 和 fileAllValues，并将连接后的值存入其中
		            return { ...page, fileAllKeys: keys, fileAllValues: values };
		        } else {
		            // 如果没有 frontmatter 键，直接返回 page 对象
		            return page;
		        }
		    });
		}

	// 11 -- 汇总所有标签 ，去重 ，增加频率，再存一个数组 ，为这个下拉选框增加候选值
		function ProcessTagsFrequency(PageDataArray) {
		    let tagFrequency = {};
		
		    // 遍历 PageDataArray，提取 Tags 键的值并统计频率
		    PageDataArray.forEach(page => {
		        if (page.Tags) {
		            let tags = page.Tags.split(',').map(tag => tag.trim());
		            tags.forEach(tag => {
		                if (tag) {
		                    if (tagFrequency[tag]) {
		                        tagFrequency[tag]++;
		                    } else {
		                        tagFrequency[tag] = 1;
		                    }
		                }
		            });
		        }
		    });
		
		    // 将统计结果转换为数组并排序
		    let allTagsArray = Object.keys(tagFrequency).sort((a, b) => tagFrequency[b] - tagFrequency[a]);
		
		    return allTagsArray;
		}
 
	// 12 -- 汇总所有标签 ，去重 ，按出现时间早晚 ，再存一个数组 ，为这个下拉选框增加候选值
	
			function ProcessTagsRecently(PageDataArray) {
			    let tempArrays = [];
			
			    // 遍历 PageDataArray，提取 Tags 键的值和对应的 fileMtime
			    PageDataArray.forEach(page => {
			        if (page.Tags && page.fileMtime) {
			            let tags = page.Tags.split(',').map(tag => tag.trim());
			            let fileMtime = new Date(page.fileMtime);
			
			            // 将每个 tag 和其对应的 fileMtime 组成一对，存入临时数组
			            tempArrays.push({ tags, fileMtime });
			        }
			    });
			
			    // 按 fileMtime 排序，最近的排前面
			    tempArrays.sort((a, b) => b.fileMtime - a.fileMtime);
			
			    // 处理排序后的临时数组
			    let allTagsArray = [];
			    tempArrays.forEach(item => {
			        let reversedTags = item.tags.reverse(); // 反转标签数组
			        allTagsArray = allTagsArray.concat(reversedTags); // 拼接到总数组中
			    });
			
			    // 去重，保留最前面的项
			    let uniqueTags = [...new Set(allTagsArray)];
			
			    return uniqueTags;
			}

    // 13 -- 提取 frontmatter 中 2 级   key 时的提取函数
		function extractFrontmatterKey(page, frontmatterKey) {
			    if (page.frontmatter && typeof page.frontmatter === 'object') {
			        return page.frontmatter[frontmatterKey];
			    }
			    return null;
			}
		
		//let customDateValues =  PageDataArray.map(page => extractFrontmatterKey(page, '发布日期'));
		//dv.paragraph(customDateValues);         // 比如可以用这个  发布日期 测试的哈；可以的  

    // 15 -- 防抖函数  - 定义  -- 后期打包时用 
	  function debounce(func, wait) {
	    let timeout;
	    return function(...args) {
	        clearTimeout(timeout);
	        timeout = setTimeout(() => {
	            func.apply(this, args);
	        }, wait);
	        };
	     }

    // 16  -- 抓取 Yaml 区，所有 key, 并按频率，高低排序了的 ；
		function calculateFrontmatterFrequency(PageDataArray) {
		    const frequency = {};
		
		    // 统计每个 frontmatter 键的使用频率
		    PageDataArray.forEach(page => {
		        if (page.frontmatter) {
		            for (let key in page.frontmatter) {
		                if (!frequency[key]) {
		                    frequency[key] = 0;
		                }
		                frequency[key]++;
		            }
		        }
		    });
		
		    // 将频率对象转换为数组，并按频率从高到低排序
		    const FloatKey = Object.keys(frequency).sort((a, b) => frequency[b] - frequency[a]);
		
		    return FloatKey;
		}

    // 17 -- getSortOrder  -- 把这个排序下拉选项的 "升序|降序" 转成 asc | desc
		function getSortOrder(param) {
		   // 去除参数两边的空格
		   const trimmedParam = param.trim();
		
		   // 根据条件返回相应的结果
		   if (trimmedParam === "⏫升序") {
			   return "asc";
		   } else if (trimmedParam === "⏬降序") {
			   return "desc";
		   }
		
		   // 不符合任何条件时返回 "asc"
		   return "asc";
		}

    // 18 -- header -- control 控制器 -- 下拉值的转换
	    function getHeaderControlChange(param) {
	        // 去除参数两边的空格
	        const trimmedParam = param.trim();
	    
	        // 根据条件返回相应的结果
	        if (trimmedParam === "👁️‍🗨️不筛-只展示") {
	            return "不筛选-只展示";
	        } else if (trimmedParam === "🚫筛不存在-And") {
	            return "筛-不存在-and";
	        } else if (trimmedParam === "🚫筛不存在-Or") {
         		return "筛-不存在-or";
     		} else if (trimmedParam === "➕筛存在-And") {
          		return "筛-存在性-and";    	
	        } else if (trimmedParam === "➰筛存在-Or") {
	            return "筛-存在性-or ";
	        } else if (trimmedParam === "➕筛有效-And") {
	            return "筛-存在&&有效-and";
	        } else if (trimmedParam === "➰筛有效-Or") {
	            return "筛-存在&&有效-or";
	        } else if (trimmedParam === "❗筛无效-And") {
             return "筛-存在&&但无效-and";
         	} else if (trimmedParam === "❗筛无效-Or") {
             return "筛-存在&&但无效-or";
          	} 



	    
	        // 不符合任何条件时返回 "不筛选-只展示"
	        return "不筛选-只展示";
	        }

    // 19 --  GroupByKeyShow --  控制器 -- 下拉值的转换

	    function getGroupByKeyShow(param) {
	        // 去除参数两边的空格
	        const trimmedParam = param.trim();
	    
	        // 根据条件返回相应的结果
	        if (trimmedParam === "👁️‍🗨️💧显示分组") {
	            return "微观-分组-展示-key";
	        } else if (trimmedParam === "❗💧不显示分组") {
	            return "微观-分组-不展示-key";
	        } else if (trimmedParam === "👁️‍🗨️🌐显示分组") {
	            return "宏观-分组-展示-key";
	        } else if (trimmedParam === "❗🌐不显示分组") {
	            return "宏观-分组-不展示-key";
	        }
	    
	        // 不符合任何条件时返回 "不筛选-只展示"
	        return "微观-分组-展示-key";
	        }

    // 20 --  GroupBy --  分组 -- 下拉值的转换
        function getGroupBy(param) {
            // 去除参数两边的空格
            const trimmedParam = param.trim();
        
            // 根据条件返回相应的结果
            if (trimmedParam === "⛔不分组") {
                return "⛔不分组";
            } else if (trimmedParam === "🔀Progress") {
                return "progress";
            } else if (trimmedParam === "📂folder") {
                return "folder";   
            } else if (trimmedParam === "🚩Tags") {
                    return "tags";                             
            } else if (trimmedParam === "Ctime-月") {
                return "fileCmonth";
            } else if (trimmedParam === "Ctime-Day") {
                return "fileCday";
            } else if (trimmedParam === "Mtime-月") {
                return "fileMmonth";
            } else if (trimmedParam === "Mtime-Day") {
                return "fileMday";
            } else if (trimmedParam === "其他 key") {
                return "其他 key";
            }

        
            // 不符合任何条件时返回
            return "⛔不分组";
            }

    // 21 -- LineSort -- 组内排序 -- 下拉值的转换
		 function getLineSort(param) {
		     // 去除参数两边的空格
		     const trimmedParam = param.trim();
		 
		     // 根据条件返回相应的结果
		     if (trimmedParam === "⛔不排序") {
		         return "⛔不排序";
		     } else if (trimmedParam === "🕙-Ctime") {
		         return "ctime";
		     } else if (trimmedParam === "🕞-Mtime") {
		         return "mtime";
		     } else if (trimmedParam === "发布日期") {
		         return "发布日期";
		     } else if (trimmedParam === "其他日期") {
		         return "其他日期";
		     } else if (trimmedParam === "其他 key") {
		         return "其他 key";
		     }
		 
		     // 不符合任何条件时返回原始参数
		     return trimmedParam;
		     }
		 
  // 05 - 筛选   函数  

	 // 01 --  FileNameFilter  -- 文件名筛选 
		function FileNameFilter(PageDataArray, FileNameFilterSearch) {
		    // 强制转换为字符串并去除两边空格，忽略大小写
		    FileNameFilterSearch = (FileNameFilterSearch || "").trim().toLowerCase();
		
		    // 如果 FileNameFilterSearch 没有定义或为空，返回 PageDataArray
		    if (!FileNameFilterSearch) {
		        return PageDataArray;
		    }
		
		    // 准备匹配的条件
		    let result = StringCook(FileNameFilterSearch);
		
		    // 如果 result 为 true，表示没有搜索条件，返回 PageDataArray
		    if (result === true) {
		        return PageDataArray;
		    }
		
		    // 处理返回的数组情况
		    let arrayA = (result.arrayA || []).map(item => item.toLowerCase());
		    let arrayB = (result.arrayB || []).map(item => item.toLowerCase());
		    let arrayC = (result.arrayC || []).map(item => item.toLowerCase());
		
		    // 遍历筛选 PageDataArray
		    PageDataArray = PageDataArray.filter(page => {
		        let name = (page.name || "").toLowerCase();
		
		        // 处理 arrayA
		        if (arrayA.length > 0) {
		            for (let value of arrayA) {
		                if (name.includes(value.toLowerCase())) {
		                    return false; // 踢除匹配的项
		                }
		            }
		        }
		
		        // 处理 arrayB
		        let matchB = arrayB.length === 0; // 如果 arrayB 为空，默认通过
		        if (arrayB.length > 0) {
		            for (let value of arrayB) {
		                if (name.includes(value.toLowerCase())) {
		                    matchB = true; // 匹配上，保留
		                    break;
		                }
		            }
		        }
		
		        // 处理 arrayC
		        let matchC = arrayC.length === 0; // 如果 arrayC 为空，默认通过
		        if (arrayC.length > 0) {
		            matchC = arrayC.every(value => name.includes(value.toLowerCase()));
		        }
		
		        return matchB && matchC; // 需要同时满足 matchB 和 matchC
		    });
		
		    return PageDataArray;
			}
			
	 // 02 --  FolderFilter  -- 文件夹筛选
		function FolderFilter(PageDataArray, FolderFilterSearch) {
		    // 强制转换为字符串并去除两边空格，忽略大小写
		    FolderFilterSearch = (FolderFilterSearch || "").trim().toLowerCase();
		
		    // 如果 FolderFilterSearch 没有定义或为空，返回 PageDataArray
		    if (!FolderFilterSearch) {
		        return PageDataArray;
		    }
		
		    // 准备匹配的条件
		    let result = StringCook(FolderFilterSearch);
		
		    // 如果 result 为 true，表示没有搜索条件，返回 PageDataArray
		    if (result === true) {
		        return PageDataArray;
		    }
		
		    // 处理返回的数组情况
		    let arrayA = (result.arrayA || []).map(item => item.toLowerCase());
		    let arrayB = (result.arrayB || []).map(item => item.toLowerCase());
		    let arrayC = (result.arrayC || []).map(item => item.toLowerCase());
		
		    // 遍历筛选 PageDataArray
		    PageDataArray = PageDataArray.filter(page => {
		        let folder = (page.folder || "").toLowerCase();
		
		        // 处理 arrayA
		        if (arrayA.length > 0) {
		            for (let value of arrayA) {
		                if (folder.includes(value)) {
		                    return false; // 踢除匹配的项
		                }
		            }
		        }
		
		        // 处理 arrayB
		        let matchB = arrayB.length === 0; // 如果 arrayB 为空，默认通过
		        if (arrayB.length > 0) {
		            for (let value of arrayB) {
		                if (folder.includes(value)) {
		                    matchB = true; // 匹配上，保留
		                    break;
		                }
		            }
		        }
		
		        // 处理 arrayC
		        let matchC = arrayC.length === 0; // 如果 arrayC 为空，默认通过
		        if (arrayC.length > 0) {
		            matchC = arrayC.every(value => folder.includes(value));
		        }
		
		        return matchB && matchC; // 需要同时满足 matchB 和 matchC
		    });
		
		    return PageDataArray;
			}

	 // 03 --  PathFilter  -- 路径筛选
		  function PathFilter(PageDataArray, PathFilterSearch) {
			    // 强制转换为字符串并去除两边空格，忽略大小写
			    PathFilterSearch = (PathFilterSearch || "").trim().toLowerCase();
			
			    // 如果 PathFilterSearch 没有定义或为空，返回 PageDataArray
			    if (!PathFilterSearch) {
			        return PageDataArray;
			    }
			
			    // 准备匹配的条件
			    let result = StringCook(PathFilterSearch);
			
			    // 如果 result 为 true，表示没有搜索条件，返回 PageDataArray
			    if (result === true) {
			        return PageDataArray;
			    }
			
			    // 处理返回的数组情况
			    let arrayA = (result.arrayA || []).map(item => item.toLowerCase());
			    let arrayB = (result.arrayB || []).map(item => item.toLowerCase());
			    let arrayC = (result.arrayC || []).map(item => item.toLowerCase());
			
			    // 遍历筛选 PageDataArray
			    PageDataArray = PageDataArray.filter(page => {
			        let path = (page.path || "").toLowerCase();
			
			        // 处理 arrayA
			        if (arrayA.length > 0) {
			            for (let value of arrayA) {
			                if (path.includes(value)) {
			                    return false; // 踢除匹配的项
			                }
			            }
			        }
			
			        // 处理 arrayB
			        let matchB = arrayB.length === 0; // 如果 arrayB 为空，默认通过
			        if (arrayB.length > 0) {
			            for (let value of arrayB) {
			                if (path.includes(value)) {
			                    matchB = true; // 匹配上，保留
			                    break;
			                }
			            }
			        }
			
			        // 处理 arrayC
			        let matchC = arrayC.length === 0; // 如果 arrayC 为空，默认通过
			        if (arrayC.length > 0) {
			            matchC = arrayC.every(value => path.includes(value));
			        }
			
			        return matchB && matchC; // 需要同时满足 matchB 和 matchC
			    });
			
			    return PageDataArray;
			}

	 // 04 --  TagsFilter   -- 标签筛选				
		function TagsFilter(PageDataArray, TagsFilterSearch) {
		    // 强制转换为字符串并去除两边空格，忽略大小写
		    TagsFilterSearch = (TagsFilterSearch || "").trim().toLowerCase();
		
		    // 如果 TagsFilterSearch 没有定义或为空，返回 PageDataArray
		    if (!TagsFilterSearch) {
		        return PageDataArray;
		    }
		
		    // 准备匹配的条件
		    let result = StringCook(TagsFilterSearch);
		
		    // 如果 result 为 true，表示没有搜索条件，返回 PageDataArray
		    if (result === true) {
		        return PageDataArray;
		    }
		
		    // 处理返回的数组情况
		    let arrayA = (result.arrayA || []).map(item => item.toLowerCase());
		    let arrayB = (result.arrayB || []).map(item => item.toLowerCase());
		    let arrayC = (result.arrayC || []).map(item => item.toLowerCase());
		
		    // 遍历筛选 PageDataArray
		    PageDataArray = PageDataArray.filter(page => {
		        let tags = (page.Tags || "").toLowerCase();
		
		        // 处理 arrayA
		        if (arrayA.length > 0) {
		            for (let value of arrayA) {
		                if (tags.includes(value)) {
		                    return false; // 踢除匹配的项
		                }
		            }
		        }
		
		        // 处理 arrayB
		        let matchB = arrayB.length === 0; // 如果 arrayB 为空，默认通过
		        if (arrayB.length > 0) {
		            for (let value of arrayB) {
		                if (tags.includes(value)) {
		                    matchB = true; // 匹配上，保留
		                    break;
		                }
		            }
		        }
		
		        // 处理 arrayC
		        let matchC = arrayC.length === 0; // 如果 arrayC 为空，默认通过
		        if (arrayC.length > 0) {
		            matchC = arrayC.every(value => tags.includes(value));
		        }
		
		        return matchB && matchC; // 需要同时满足 matchB 和 matchC
		    });
		
		    return PageDataArray;
			}
		
		
		
		
		
		
		
		
		
			 // 05 --   KeysFilter   --  键 筛选 
			 
			 // 06 --   ValuesFilter   --  键 筛选 

	 // 05 --  KeysFilter --  键的筛选  
		 function KeysFilter(PageDataArray, KeysFilterSearch) {
			    // 强制转换为字符串并去除两边空格，忽略大小写
			    KeysFilterSearch = (KeysFilterSearch || "").trim().toLowerCase();
			
			    // 如果 KeysFilterSearch 没有定义或为空，返回 PageDataArray
			    if (!KeysFilterSearch) {
			        return PageDataArray;
			    }
			
			    // 准备匹配的条件
			    let result = StringCook(KeysFilterSearch);
			
			    // 如果 result 为 true，表示没有搜索条件，返回 PageDataArray
			    if (result === true) {
			        return PageDataArray;
			    }
			
			    // 处理返回的数组情况
			    let arrayA = (result.arrayA || []).map(item => item.toLowerCase());
			    let arrayB = (result.arrayB || []).map(item => item.toLowerCase());
			    let arrayC = (result.arrayC || []).map(item => item.toLowerCase());
			
			    // 遍历筛选 PageDataArray
			    PageDataArray = PageDataArray.filter(page => {
			        let keys = (page.fileAllKeys || "").toLowerCase();
			
			        // 处理 arrayA
			        if (arrayA.length > 0) {
			            for (let value of arrayA) {
			                if (keys.includes(value)) {
			                    return false; // 踢除匹配的项
			                }
			            }
			        }
			
			        // 处理 arrayB
			        let matchB = arrayB.length === 0; // 如果 arrayB 为空，默认通过
			        if (arrayB.length > 0) {
			            for (let value of arrayB) {
			                if (keys.includes(value)) {
			                    matchB = true; // 匹配上，保留
			                    break;
			                }
			            }
			        }
			
			        // 处理 arrayC
			        let matchC = arrayC.length === 0; // 如果 arrayC 为空，默认通过
			        if (arrayC.length > 0) {
			            matchC = arrayC.every(value => keys.includes(value));
			        }
			
			        return matchB && matchC; // 需要同时满足 matchB 和 matchC
			    });
			
			    return PageDataArray;
			}

	 // 06 --  ValuesFilterSearch -- 值的筛选  
		function ValuesFilter(PageDataArray, ValuesFilterSearch) {
		    // 强制转换为字符串并去除两边空格，忽略大小写
		    ValuesFilterSearch = (ValuesFilterSearch || "").trim().toLowerCase();
		
		    // 如果 ValuesFilterSearch 没有定义或为空，返回 PageDataArray
		    if (!ValuesFilterSearch) {
		        return PageDataArray;
		    }
		
		    // 准备匹配的条件
		    let result = StringCook(ValuesFilterSearch);
		
		    // 如果 result 为 true，表示没有搜索条件，返回 PageDataArray
		    if (result === true) {
		        return PageDataArray;
		    }
		
		    // 处理返回的数组情况
		    let arrayA = (result.arrayA || []).map(item => item.toLowerCase());
		    let arrayB = (result.arrayB || []).map(item => item.toLowerCase());
		    let arrayC = (result.arrayC || []).map(item => item.toLowerCase());
		
		    // 遍历筛选 PageDataArray
		    PageDataArray = PageDataArray.filter(page => {
		        let values = (page.fileAllValues || "").toLowerCase();
		
		        // 处理 arrayA
		        if (arrayA.length > 0) {
		            for (let value of arrayA) {
		                if (values.includes(value)) {
		                    return false; // 踢除匹配的项
		                }
		            }
		        }
		
		        // 处理 arrayB
		        let matchB = arrayB.length === 0; // 如果 arrayB 为空，默认通过
		        if (arrayB.length > 0) {
		            for (let value of arrayB) {
		                if (values.includes(value)) {
		                    matchB = true; // 匹配上，保留
		                    break;
		                }
		            }
		        }
		
		        // 处理 arrayC
		        let matchC = arrayC.length === 0; // 如果 arrayC 为空，默认通过
		        if (arrayC.length > 0) {
		            matchC = arrayC.every(value => values.includes(value));
		        }
		
		        return matchB && matchC; // 需要同时满足 matchB 和 matchC
		    });
		
		    return PageDataArray;
			}

	 // 07 --   ChineseDateFilter  --  中文日期搜索筛选  
		function ChineseDateFilter(PageDataArray, dateFilterBy, DateSearch) {
			    // 容错处理
				    DateSearch = (DateSearch || "").trim().toLowerCase();
				    dateFilterBy = (dateFilterBy || "").trim();  // 容错哈 （是下拉的时候当然不会错）验证的时候会有空格儿
				    if (!DateSearch) {
				        return PageDataArray;
				    }
			
			    // 接收匹配参数 , 就是你中文搜索的那个东西，那个 string ，我们得处理； 
				    let { ArrayOneYear, ArrayOneMonth, ArrayDay } = ChineseSwitch(DateSearch);
			
			    // 判断是否有需要匹配的数组
				    if (ArrayOneYear.length + ArrayOneMonth.length + ArrayDay.length > 0) {
				        return PageDataArray.filter(page => {
				            let tFullyDate, tYear, tMonth, tDay;
							// 优化了逻辑了的；  我不管你是按什么时间筛选；，我们的目的，就一个取到完整的 4 个时间
							// 【 tFullyDate,   tYearyear, tMonth, tDay】
						    // 我们的一切筛选匹配，都是以这 4 个时间为基准；  
				            // 处理创建时间
				            if (dateFilterBy.includes("创建")) {
				                tFullyDate = page.fileCtime;
				                tYear = page.fileCyear;
				                tMonth = page.fileCmonth;
				                tDay = page.fileCday;
				            }
				
				            // 处理修改时间
				            if (dateFilterBy.includes("修改")) {
				                tFullyDate = page.fileMtime;
				                tYear = page.fileMyear;
				                tMonth = page.fileMmonth;
				                tDay = page.fileMday;
				            }
				
				            // 处理前端数据
				            if (!dateFilterBy.includes("创建") && !dateFilterBy.includes("修改")) {
					            //dv.paragraph(`dateFilterBy: ${dateFilterBy}`);
					            //dv.paragraph(`frontmatter: ${JSON.stringify(page.frontmatter)}`);
				                const frontmatterValue = extractFrontmatterKey(page, dateFilterBy);
				                // dv.paragraph(frontmatterValue);
				                if (frontmatterValue) {
				                    try {
				                        tFullyDate = formatFullDate(frontmatterValue);
				                        ({ tYear, tMonth, tDay } = formatDate(tFullyDate));
				                    } catch {
				                        // 如果转换失败，默认使用创建时间
				                        tFullyDate = page.fileCtime;
				                        tYear = page.fileCyear;
				                        tMonth = page.fileCmonth;
				                        tDay = page.fileCday;
				                    }
				                }
				            }
				
				            // 匹配条件
				            const conditionYear = ArrayOneYear.length === 0 || ArrayOneYear.includes(tYear);
				            const conditionMonth = ArrayOneMonth.length === 0 || ArrayOneMonth.includes(tMonth);
				            const conditionDay = ArrayDay.length === 0 || ArrayDay.includes(tDay);
				
				            return conditionYear && conditionMonth && conditionDay;
				        });
				    }
			
			    return PageDataArray;
			  }

	 // 08 --   BlockDateFilter  --  时间块 | 区间筛选  
		function BlockDateFilter(PageDataArray, dateFilterBy, Intervalday) {
		    // 容错处理
			    Intervalday = (Intervalday || "").trim().toLowerCase();
			    if (!Intervalday) {
			        return PageDataArray;
			    }
			
			    dateFilterBy = (dateFilterBy || "").trim();
		
		    // 接收匹配参数
			    let result = processIntervalday(Intervalday);
		
		    // 判断是否有需要匹配的数组
			    if (result !== true) {
			        return PageDataArray.filter(page => {
			            let tFullyDate, tYear, tMonth, tDay;
			
			            // 处理创建时间
			            if (dateFilterBy.includes("创建时间")) {
			                tFullyDate = page.fileCtime;
			                tYear = page.fileCyear;
			                tMonth = page.fileCmonth;
			                tDay = page.fileCday;
			            }
			
			            // 处理修改时间
			            if (dateFilterBy.includes("修改时间")) {
			                tFullyDate = page.fileMtime;
			                tYear = page.fileMyear;
			                tMonth = page.fileMmonth;
			                tDay = page.fileMday;
			            }
			
			            // 处理其他情况
			            if (!dateFilterBy.includes("创建时间") && !dateFilterBy.includes("修改时间")) {
			                const frontmatterValue = extractFrontmatterKey(page, dateFilterBy);
			                if (frontmatterValue) {
			                    try {
			                        tFullyDate = formatFullDate(frontmatterValue);
			                        ({ tYear, tMonth, tDay } = formatDate(tFullyDate));
			                    } catch {
			                        // 如果转换失败，默认使用创建时间
			                        tFullyDate = page.fileCtime;
			                        tYear = page.fileCyear;
			                        tMonth = page.fileCmonth;
			                        tDay = page.fileCday;
			                    }
			                } else {
			                    // 如果找不到值，默认使用创建时间
			                    tFullyDate = page.fileCtime;
			                    tYear = page.fileCyear;
			                    tMonth = page.fileCmonth;
			                    tDay = page.fileCday;
			                }
			            }
			
			            // 筛选逻辑
			            if (result.type === 'arrayA') {
			                const arrayA = result.values;
			                return arrayA.includes(tFullyDate);
			            }
			
			            if (result.type === 'arrayB') {
			                const [tLow, tUp] = result.values.sort();
			                return tFullyDate >= tLow && tFullyDate <= tUp;
			            }
			
			            return false;
			        });
			    }
			
			    return PageDataArray;
				}
			
	 // 09 --  AnkiFilter  筛选的函数  
			function AnkiFilter(PageDataArray, dateFilterBy, AnkiFrequncey) {
			    // 容错处理
			    AnkiFrequncey = (AnkiFrequncey || "").trim().toLowerCase();
			    if (!AnkiFrequncey) {
			        return PageDataArray;
			    }
			
			    dateFilterBy = (dateFilterBy || "").trim();
			
			    // 利用 AnkiStringHandle 函数获取结果
			    let ankiDates = AnkiStringHandle(AnkiFrequncey);
			
			    // 判断是否有需要匹配的日期
			    if (ankiDates.length > 0) {
			        return PageDataArray.filter(page => {
			            let tFullyDate, tYear, tMonth, tDay;
			
			            // 处理创建时间
			            if (dateFilterBy.includes("创建时间")) {
			                tFullyDate = page.fileCtime;
			                tYear = page.fileCyear;
			                tMonth = page.fileCmonth;
			                tDay = page.fileCday;
			            }
			
			            // 处理修改时间
			            if (dateFilterBy.includes("修改时间")) {
			                tFullyDate = page.fileMtime;
			                tYear = page.fileMyear;
			                tMonth = page.fileMmonth;
			                tDay = page.fileMday;
			            }
			
			            // 处理其他情况
			            if (!dateFilterBy.includes("创建时间") && !dateFilterBy.includes("修改时间")) {
			                const frontmatterValue = extractFrontmatterKey(page, dateFilterBy);
			                if (frontmatterValue) {
			                    try {
			                        tFullyDate = formatFullDate(frontmatterValue);
			                        ({ tYear, tMonth, tDay } = formatDate(tFullyDate));
			                    } catch {
			                        // 如果转换失败，默认使用创建时间
			                        tFullyDate = page.fileCtime;
			                        tYear = page.fileCyear;
			                        tMonth = page.fileCmonth;
			                        tDay = page.fileCday;
			                    }
			                } else {
			                    // 如果找不到值，默认使用创建时间
			                    tFullyDate = page.fileCtime;
			                    tYear = page.fileCyear;
			                    tMonth = page.fileCmonth;
			                    tDay = page.fileCday;
			                }
			            }
			
			            // 筛选逻辑
			            for (let item of ankiDates) {
			                if (item === tFullyDate) {
			                    return true;
			                }
			            }
			
			            return false;
			        });
			    }
			
			    return PageDataArray;
				}

     // 10 --  ContainerDateFilter  日期容器筛选的函数 
     
			function ContainerDateFilter(PageDataArray, dateFilterBy, ContainerStartDateValue, ContainerEndDateValue, ContainerMonthDateValue, ContainerWeekDateValue) {
				    // 防御设计
					    if (![ContainerStartDateValue, ContainerEndDateValue, ContainerMonthDateValue, ContainerWeekDateValue].some(value => value)) {
					        return PageDataArray;
					    }
					
					    dateFilterBy = (dateFilterBy || "").trim();
				
				    // 利用 DateContainerStringCook 函数获取结果
					    let { type, values } = DateContainerStringCook(ContainerStartDateValue, ContainerEndDateValue, ContainerMonthDateValue, ContainerWeekDateValue);
				
				    // 容错保险设计
				    if (type === 'none') {
				        return PageDataArray;
				    }
				
				    return PageDataArray.filter(page => {
				        let tFullyDate, tYear, tMonth, tDay;
				
				        // 处理创建时间
				        if (dateFilterBy.includes("创建时间")) {
				            tFullyDate = page.fileCtime;
				            tYear = page.fileCyear;
				            tMonth = page.fileCmonth;
				            tDay = page.fileCday;
				        }
				
				        // 处理修改时间
				        if (dateFilterBy.includes("修改时间")) {
				            tFullyDate = page.fileMtime;
				            tYear = page.fileMyear;
				            tMonth = page.fileMmonth;
				            tDay = page.fileMday;
				        }
				
				        // 处理其他情况
				        if (!dateFilterBy.includes("创建时间") && !dateFilterBy.includes("修改时间")) {
				            const frontmatterValue = extractFrontmatterKey(page, dateFilterBy);
				            if (frontmatterValue) {
				                try {
				                    tFullyDate = formatFullDate(frontmatterValue);
				                    ({ tYear, tMonth, tDay } = formatDate(tFullyDate));
				                } catch {
				                    // 如果转换失败，默认使用创建时间
				                    tFullyDate = page.fileCtime;
				                    tYear = page.fileCyear;
				                    tMonth = page.fileCmonth;
				                    tDay = page.fileCday;
				                }
				            } else {
				                // 如果找不到值，默认使用创建时间
				                tFullyDate = page.fileCtime;
				                tYear = page.fileCyear;
				                tMonth = page.fileCmonth;
				                tDay = page.fileCday;
				            }
				        }
				
				        // 筛选逻辑
				        if (type === 'arrayA') {
				            let [tLow, tUp] = values.sort();
				            return tFullyDate >= tLow && tFullyDate <= tUp;
				        }
				
				        if (type === 'arrayB') {
				            let [tContainerYear, tContainerMonth] = values;
				            let yearMatch = (tYear === tContainerYear);
				            let monthMatch = (tMonth === tContainerMonth);
				            return yearMatch && monthMatch;
				        }
				
				        if (type === 'arrayC') {
				            let tOnlyDate = values[0];
				            return tFullyDate === tOnlyDate;
				        }
				
				        return false;
				    });
				}

	 // 11 --   Float-下拉 header 的这个 key → 筛选 （存在|有效→ 多种选择）
		     
		 // 01 - 获取层级对象 object 所有唯一 key 集合 → 存数组         
		    function getUniqueKeysFromObjects(dataArray) {
		        let uniqueKeys = new Set();
		    
		        // 递归函数：提取嵌套对象中的所有唯一键
		        function extractKeys(obj) {
		            for (const key in obj) {
		                if (obj.hasOwnProperty(key)) {
		                    uniqueKeys.add(key);
		                    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
		                        extractKeys(obj[key]);
		                    }
		                }
		            }
		        }
		     
		        dataArray.forEach(item => {
		            extractKeys(item);
		        });
		    
		        return Array.from(uniqueKeys);
		    }
		      
	     // 02 - 获取有效 key 的函数→也是把 key 存数组 ，有效是：不能是空值，value 得有东西 
		       function getValidKeysFromObjects(dataArray) {
		           let validKeys = new Set();
		       
		           // 递归函数：提取嵌套对象中的所有有效键
		           function extractKeys(obj) {
		               for (const key in obj) {
		                   if (obj.hasOwnProperty(key)) {
		                       const value = obj[key];
		                       if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
		                           // 如果值是对象，继续递归
		                           extractKeys(value);
		                       } else if (value !== null && value !== undefined && value !== '' && 
		                                  !(Array.isArray(value) && value.length === 0)) {
		                           // 如果值不是空值，添加键到集合中
		                           validKeys.add(key);
		                       }
		                   }
		               }
		           }
		       
		           // 遍历数据数组中的每个对象
		           dataArray.forEach(item => {
		               extractKeys(item);
		           });
		       
		           // 返回有效键的数组
		           return Array.from(validKeys);
		       }

		 // 03 - 获取有效 key 的函数→也是把 key 存数组 ，有效是： 是空值，value 是空值的
			function getValidKeysEmptyValues(dataArray) {
		      let emptyKeys = new Set();
		  
		      // 递归函数：提取嵌套对象中的所有空键
		      function extractKeys(obj) {
		          for (const key in obj) {
		              if (obj.hasOwnProperty(key)) {
		                  const value = obj[key];
		                  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
		                      // 如果值是对象，继续递归
		                      extractKeys(value);
		                  } else if (value === null || value === undefined || value === '' || 
		                             (Array.isArray(value) && value.length === 0)) {
		                      // 如果值是空值，添加键到集合中
		                      emptyKeys.add(key);
		                  }
		              }
		          }
		      }
		  
		      // 遍历数据数组中的每个对象
		      dataArray.forEach(item => {
		          extractKeys(item);
		      });
		  
		      // 返回空键的数组
		      return Array.from(emptyKeys);
		  	}
		  

		 // 04 - header 勾选筛选函数；（这个 header，你是否用于 key 的筛选？  得有哈）  
			
			function HeaderKeyFilter(PageDataArray, FloatHeaders, HeaderKeyFilterSwitch) {
			    // 处理 HeaderKeyFilterSwitch 参数
			    	HeaderKeyFilterSwitch = HeaderKeyFilterSwitch ? HeaderKeyFilterSwitch.trim().toLowerCase() : "";
			
			    // 处理 FloatHeaders，去除每个 item 左右空格，踢除空的 item 项
			    	FloatHeaders = FloatHeaders.map(item => item.trim()).filter(item => item);
			
			    // 容错 -1：如果 FloatHeaders 的长度 = 0，返回 PageDataArray
				    if (FloatHeaders.length === 0) {
				        return PageDataArray;
				    }
			
			    // 容错 -2：如果 HeaderKeyFilterSwitch 为空值或未定义，返回 PageDataArray
				    if (!HeaderKeyFilterSwitch) {
				        return PageDataArray;
				    }
				
			    // 得到临时表头 tempFilterKeys ，就是那个你勾选的下拉的 那个值
			    	let tempFilterKeys = FloatHeaders.filter(key => !SystemHeaders.includes(key));
			
			    // 检查 tempFilterKeys 的长度，如果为 0，则返回 PageDataArray
				    if (tempFilterKeys.length === 0) {
				        return PageDataArray;
				    }
			
			    // 判断分类处理 -1  - "不筛选-只展示"
				    if (tempFilterKeys.length > 0 && HeaderKeyFilterSwitch.includes("不筛选-只展示")) {
				        return PageDataArray;
				    }
				
			    // 判断分类处理 -2：筛-不存在-and
				    if (tempFilterKeys.length > 0 && HeaderKeyFilterSwitch.includes("筛-不存在-and")) {
				        return PageDataArray.filter(item => {
				            let tempPageUniqueAllkeys = getUniqueKeysFromObjects([item]);
				            return tempFilterKeys.every(key => !tempPageUniqueAllkeys.includes(key));
				        });
				    }
			
			    // 判断分类处理 -3：筛-不存在-or
				    if (tempFilterKeys.length > 0 && HeaderKeyFilterSwitch.includes("筛-不存在-or")) {
				        return PageDataArray.filter(item => {
				            let tempPageUniqueAllkeys = getUniqueKeysFromObjects([item]);
				            return tempFilterKeys.some(key => !tempPageUniqueAllkeys.includes(key));
				        });
				    }
				
			    // 判断分类处理 -4：筛-存在性-and
				    if (tempFilterKeys.length > 0 && HeaderKeyFilterSwitch.includes("筛-存在性-and")) {
				        return PageDataArray.filter(item => {
				            let tempPageUniqueAllkeys = getUniqueKeysFromObjects([item]);
				            return tempFilterKeys.every(key => tempPageUniqueAllkeys.includes(key));
				        });
				    }
			
			    // 判断分类处理 -5：筛-存在性-or
				    if (tempFilterKeys.length > 0 && HeaderKeyFilterSwitch.includes("筛-存在性-or")) {
				        return PageDataArray.filter(item => {
				            let tempPageUniqueAllkeys = getUniqueKeysFromObjects([item]);
				            return tempFilterKeys.some(key => tempPageUniqueAllkeys.includes(key));
				        });
				    }
			
			    // 判断分类处理 -6：筛-存在&&有效-and
				    if (tempFilterKeys.length > 0 && HeaderKeyFilterSwitch.includes("筛-存在&&有效-and")) {
				        return PageDataArray.filter(item => {
				            let tempPageValidAllkeys = getValidKeysFromObjects([item]);
				            return tempFilterKeys.every(key => tempPageValidAllkeys.includes(key));
				        });
				    }
			
			    // 判断分类处理 -7：筛-存在&&有效-or
				    if (tempFilterKeys.length > 0 && HeaderKeyFilterSwitch.includes("筛-存在&&有效-or")) {
				        return PageDataArray.filter(item => {
				            let tempPageValidAllkeys = getValidKeysFromObjects([item]);
				            return tempFilterKeys.some(key => tempPageValidAllkeys.includes(key));
				        });
				    }
			
			    // 判断分类处理 -8：筛-存在&&但无效-and
				    if (tempFilterKeys.length > 0 && HeaderKeyFilterSwitch.includes("筛-存在&&但无效-and")) {
				        return PageDataArray.filter(item => {
				            let tempValidKeysEmptyValuesAllkeys = getValidKeysEmptyValues([item]);
				            return tempFilterKeys.every(key => tempValidKeysEmptyValuesAllkeys.includes(key));
				        });
				    }
			
			    // 判断分类处理 -9：筛-存在&&但无效-or
				    if (tempFilterKeys.length > 0 && HeaderKeyFilterSwitch.includes("筛-存在&&但无效-or")) {
				        return PageDataArray.filter(item => {
				            let tempValidKeysEmptyValuesAllkeys = getValidKeysEmptyValues([item]);
				            return tempFilterKeys.some(key => tempValidKeysEmptyValuesAllkeys.includes(key));
				        });
				    }
			
			    // 如果没有匹配的筛选条件，返回原始数组
			    return PageDataArray;
			}


	 // 12 --  GroupKeyHaveFilter  对分组 key 的"仅存在性"  筛选  --
			//  分组的 key, 我们为什么要筛选？  
			//  如果不筛，比如你按 ”进度管理“ 自定义的字段分组，那么 ，有与没有，分成2组  
			//  如果你只有3条笔记 ，有此字段，那么其他的 n-3条，就会一组，这 n-3条的出现就没有任何意义 ；
			//  即：系统自带字段 \ 肯定有效\肯定存在，我们不过滤
			//  即：自定义字段 \  ”不一定存在“  ；   存在→有效|无效
			//  即：自定义字段 → 只考虑 ”存在性“  ，如果有效性也过滤掉，那如果有字段，没写值的，就不会出现，范围限定小了 
		   function GroupKeyHaveFilter(PageDataArray, GroupBy) {
	        // 处理 GroupBy 参数
	        GroupBy = String(GroupBy || '').trim().replace("⛔不分组", '').trim();
	    
	        // 判断 GroupBy 是否存在于数组 SystemHeaders 里面，如果是的话，令 GroupBy = ""
	        if (SystemHeaders.includes(GroupBy)) {
	            GroupBy = "";
	        }
	    
	        // 如果处理完的 GroupBy 长度 = 0 或者为空，或者无定义，直接返回 PageDataArray
	        if (!GroupBy) {
	            return PageDataArray;
	        }
	    
	        // 如果处理完的 GroupBy 长度 > 0，进行以下处理
	        return PageDataArray.filter(item => {
	            let tempPageUniqueAllkeys = getUniqueKeysFromObjects([item]);
	            return tempPageUniqueAllkeys.includes(GroupBy);
	        });
	    }

	 // 13 --  SortKeyHaveFilter  对分组 key 的"仅存在性"    筛选   
		  // 如果你排序的 key，使用的自有字段，比如  "类型" "进度管理 " "数值类型 value"， 
		  // 我们检查 有效性；既然你按这个排序，我就视为你是有针对性的，都没有这个 key，还展示在我的表格里做什么？
		  // 你有这个 key , 但是可能没值，但是没关系 ，至少你得有存在性；这个是最基础的  
					
		function SortKeyHaveFilter(PageDataArray, SortBy) {
	     // 容错和前置处理
	     SortBy = String(SortBy || '').trim().replace("⛔不排序", '').trim();
	 
	     // 判断 SortBy 是否存在于数组 SystemHeaders 里面，如果是的话，令 SortBy = ""
	     if (SystemHeaders.includes(SortBy)) {
	         SortBy = "";
	     }
	 
	     // 如果处理完的 SortBy 长度 = 0 或者为空，或者无定义，直接返回 PageDataArray
	     if (!SortBy) {
	         return PageDataArray;
	     }
	 
	     // 过滤
	     return PageDataArray.filter(item => {
	         let tempPageUniqueAllkeys = getUniqueKeysFromObjects([item]);
	         return tempPageUniqueAllkeys.includes(SortBy);
	     });
	     }

	 // 14 --  时间筛选时的地个 dateBy 过滤
	     // 为什么要过滤：因为是涉及到用了自有字段的时间，去筛选，去排序 
	     // 如果你的 page,压根儿没有这个时间，那么还排什么？ 筛什么？ 
	     // 比如 "发布时间"，我可能只有部分才有，那我们就只考虑  存在性，不存在的，都扔掉；  
		 function dateByKeyFilter(PageDataArray, dateFilterBy) {
		       // 一、前置处理
			       dateFilterBy = dateFilterBy.trim();
			   
			       const mapping = {
			           "修改日期": "mtime",
			           "修改时间": "mtime",
			           "修改": "mtime",
			           "创建日期": "ctime",
			           "创建时间": "ctime",
			           "创建": "ctime"
			       };
			   
			       // 进行映射替换
			       if (mapping.hasOwnProperty(dateFilterBy)) {
			           dateFilterBy = mapping[dateFilterBy];
			       } else if (dateFilterBy.toLowerCase() === "ctime") {
			           dateFilterBy = "ctime";
			       } else if (dateFilterBy.toLowerCase() === "mtime") {
			           dateFilterBy = "mtime";
			       }
		   
		       // 二、判断容错处理
			       // 判断1：如果处理后的 dateFilterBy 为空
			       if (!dateFilterBy) {
			           return PageDataArray;
			       }
			   
			       // 判断2：如果处理后的 dateFilterBy 存在于 SystemHeaders 中
			       if (SystemHeaders.includes(dateFilterBy)) {
			           return PageDataArray;
			       }
		   
		       // 判断3：如果处理后的 dateFilterBy 存在于 FloatKey 中 ,即我们只针对自定义的 key  
			       if (FloatKey.includes(dateFilterBy)) {
			           // 三、过滤 PageDataArray
			           PageDataArray = PageDataArray.filter(item => {
			               let tempPageUniqueAllkeys = getUniqueKeysFromObjects([item]);
			               return tempPageUniqueAllkeys.includes(dateFilterBy);
			           });
			       }
		   
		       // 返回过滤后的 PageDataArray，方便后续其他过滤
		       return PageDataArray;
		       }

	 // 15 --   补充的强大 的内容搜索
		async function ContentFilter(PageDataArray, ContentSearch, app) {
		    // 一、前期处理
		    ContentSearch = (ContentSearch || '').toString().trim().toLowerCase();
		    if (!ContentSearch) return PageDataArray;
		
		    // 二、准备匹配的条件
		    let result = StringCook(ContentSearch);
		    if (result === true) return PageDataArray;
		
		    let arrayA = (result.arrayA || []).map(item => item.toLowerCase());
		    let arrayB = (result.arrayB || []).map(item => item.toLowerCase());
		    let arrayC = (result.arrayC || []).map(item => item.toLowerCase());
		    // dv.paragraph(`arrayA: ${arrayA}, arrayB: ${arrayB}, arrayC: ${arrayC}`);  // 能检测到  锤子，说明分词，输入框的时时变量能抓取到  
		    // 四、遍历筛选 PageDataArray
		    PageDataArray = await Promise.all(PageDataArray.map(async (item) => {
		    	
		        // 获取文件的全文内容
		        		        
		        const file = app.vault.getAbstractFileByPath(item.path);
		        // 检测点：A
		        //dv.paragraph(`检查 file: ${file ? 'file found' : 'file not found'}, path: ${item.path}`); 
		        // 检查 路径，输出是：   检查 file: file found, path: 2-笔记/02Python/01/0.08基础_变量赋值.md
		        // 说明这一步没问题  
		        
		        // 检测点：B
		        //dv.paragraph(`Does file.vault.read exist? ${file.vault ? 'Yes' : 'No'}`);
			 // 检测 结果 ：Does file.vault.read exist? Yes   ； 说明 “ file.vault”  作为一个整体，是有read方法的； 
			 
			 // 检测点：C    ；是能预览到 Markdown的正文的，就是没有问题的； 
			 //try {
			 //    let content = await file.vault.read(file);
			 //    dv.paragraph(`File content: ${content}`);
			 //} catch (err) {
			     //dv.paragraph(`Error reading file: ${err}`);
			 //}

		       
		        // 读取全文内容
		        
		       let FullyBodyContent = await file.vault.read(file).then(content => content.toLowerCase());
		       
			// 修改点，以前是：let FullyBodyContent = await app.vault.read(file).then(content => content.toLowerCase()); 这个是错的
			// 因为对象错了，得用  “file.vault”    这个才是一个整体；，并不是app
			
			
		        // 正则表达式去除 YAML 区块
		        const yamlRegex = /^---\n[\s\S]*?\n---/;
		        FullyBodyContent = FullyBodyContent.replace(yamlRegex, '').trim();
		
		        // 五、分类处理 A (排除)
		        if (arrayA.length > 0) {
		            for (let value of arrayA) {
		                if (FullyBodyContent.includes(value)) {
		                    return null; // 排除当前记录
		                }
		            }
		        }
		
		        // 六、处理 arrayB (匹配至少一个)
		        let matchB = arrayB.length === 0;
		        if (arrayB.length > 0) {
		            for (let value of arrayB) {
		                if (FullyBodyContent.includes(value)) {
		                    matchB = true; // 至少匹配一个
		                    break;
		                }
		            }
		        }
		
		        // 七、处理 arrayC (必须全部匹配)
		        let matchC = arrayC.length === 0;
		        if (arrayC.length > 0) {
		            matchC = arrayC.every(value => FullyBodyContent.includes(value));
		        }
		
		        // 八、筛选条件
		        return matchB && matchC ? item : null;
		
		    }));
		
		    // 去除为 null 的记录
		    return PageDataArray.filter(item => item !== null);
		}
		
	


  // 06 -- 分组 + 组内排序 ~ 函数 + tableRows 行数据 获取 （得套一起）

	  // 00 - 辅助-目前是用检查 哈（获取 Yaml 区所有 key，去重了的）
	   // 获取 frontmatter 中所有唯一键的函数
	   function GetFrontmatterAllUniqueKeys(PageDataArray) {
	       let uniqueKeys = new Set();
	   
	       PageDataArray.forEach(item => {
	           if (item.frontmatter && typeof item.frontmatter === 'object') {
	               let keys = getUniqueKeysFromObjects([item.frontmatter]);
	               keys.forEach(key => uniqueKeys.add(key));
	           }
	       });
	   
	       return Array.from(uniqueKeys);
	   }

	  // 01 获取多层级属性的函数 -- 通用的
	      // 适用性：适用于需要从嵌套对象中获取值的场景，其他比较函数都依赖此函数。
	   function getNestedValue(obj, key) {
	       const lowerKey = key.toLowerCase(); // 将搜索的键名转换为小写
	       for (const k in obj) {
	           if (k.toLowerCase() === lowerKey) return obj[k]; // 比较时忽略键名大小写
	           if (typeof obj[k] === 'object') {
	               const result = getNestedValue(obj[k], key);
	               if (result !== undefined) return result;
	           }
	       }
	       return undefined;
	       }

	  // 02 - 辅助函数：检测是否为"能转换成日期的" 日期格式
	    // （即yyyy-mm-dd 或者 2024-12-12T00:00:00.000Z） 都是可以转成日期的，判断为 true
	     function isDate(value) {
	        return !isNaN(Date.parse(value));
	        }

	  // 03 - 辅助函数: isNumber(value): 检查一个值是否为数字格式。
	    
	    function isNumber(value) {
	    return !isNaN(value) && !isNaN(parseFloat(value));
	    }

	  // 04 - 辅助函数：compareStrings   比较两个字符串。
	    // 字符串比较器  （里面套装用取 回调取值的函数的 → 避免没有取到值的情况 ）
	    function compareStrings(a, b, key, order) {
	        let valA = getNestedValue(a, key) ? String(getNestedValue(a, key)).trim().toLowerCase() : '';
	        let valB = getNestedValue(b, key) ? String(getNestedValue(b, key)).trim().toLowerCase() : '';
	        
	        let comparison = 0;
	        if (valA > valB) {
	                comparison = 1;
	            } else if (valA < valB) {
	                comparison = -1;
	            }
	        return (order === 'desc') ? (comparison * -1) : comparison;
	        
	        }

	  // 05 - 辅助函数：compareDate   比较两个日期。
	    //日期比较器（里面套装用取 回调取值的函数的 → 避免没有取到值的情况
	    function compareDates(a, b, key, order) {
	        let valA = getNestedValue(a, key) ? new Date(getNestedValue(a, key)) : new Date('1970-01-01');
	        let valB = getNestedValue(b, key) ? new Date(getNestedValue(b, key)) : new Date('1970-01-01');
	    
	        let comparison = valA - valB;
	        return (order === 'desc') ? (comparison * -1) : comparison;
	        }

	  // 06 - 辅助函数： compareNumbers(a, b, key, order): 比较两个数字。
	    function compareNumbers(a, b, key, order) {
	        let valA = getNestedValue(a, key) ? parseFloat(getNestedValue(a, key)) : 0;
	        let valB = getNestedValue(b, key) ? parseFloat(getNestedValue(b, key)) : 0;
	    
	        let comparison = valA - valB;
	        return (order === 'desc') ? (comparison * -1) : comparison;
	        }
	
	  // 07 - 辅助函数：通用比较器  （就是会判断 类型，看是用哪种比较器 ）
		function compare(a, b, key, order) {
		    let valA = getNestedValue(a, key);
		    let valB = getNestedValue(b, key);
		    
		    if (isDate(valA) && isDate(valB)) {
		        return compareDates(a, b, key, order);
		    } else if (isNumber(valA) && isNumber(valB)) {
		        return compareNumbers(a, b, key, order);
		    } else {
		        return compareStrings(a, b, key, order);
		    }
		    }

	  // 08 - 单一 排序函数：通用的 （1级按分组的 key 可以排 ；2级按专门的排序 key 也行）
	   function SortData(data, key, order, comparator) {
	       return data.sort(function(a, b) {
	           return comparator(a, b, key, order);
	       });
	       }
	
	  // 09 - 优化后的分组函数
	   function GroupForArray(array, key, GroupByKeyShowSwitch) {
	       GroupByKeyShowSwitch = String(GroupByKeyShowSwitch || '').trim().toLowerCase();
	   
	       if (GroupByKeyShowSwitch.length === 0) {
	           GroupByKeyShowSwitch = "宏观-分组";
	       }
	   
	       return array.reduce((result, item) => {
	           let groupKeys = getNestedValue(item, key);
	   
	           if (!Array.isArray(groupKeys)) {
	               groupKeys = [groupKeys];
	           }
	   
	           if (GroupByKeyShowSwitch.includes("微观-分组")) {
	               groupKeys.forEach(groupKey => {
	                   if (!result[groupKey]) {
	                       result[groupKey] = [];
	                   }
	                   result[groupKey].push(item);
	               });
	           } else if (GroupByKeyShowSwitch.includes("宏观-分组")) {
	               let sortedKeys = groupKeys.sort().join(","); // 排序并合并为字符串
	               if (!result[sortedKeys]) {
	                   result[sortedKeys] = [];
	               }
	               result[sortedKeys].push(item);
	           } else {
	               let defaultKey = groupKeys.join(",");
	               if (!result[defaultKey]) {
	                   result[defaultKey] = [];
	               }
	               result[defaultKey].push(item);
	           }
	   
	           return result;
	       }, {});
	   }

	  // 10 -  2级，先分组排序； + 再单独 组内排序
	   function multiLevelSort(PageDataArray, GroupBy, GroupOrder, SortBy, SortOrder) {
	       // 分类处理-0: 不分组+不排序
		       GroupBy = String(GroupBy || '').trim().replace("⛔不分组", '');
		       SortBy = String(SortBy || '').trim().replace("⛔不排序", '');
		       GroupOrder = String(GroupOrder || '').trim().toLowerCase();
		       SortOrder = String(SortOrder || '').trim().toLowerCase();
	   
	       // 分类处理-1: 不分组+不排序
	           if (GroupBy.length === 0 && SortBy.length === 0) {
	               return PageDataArray;
	           }
	   
	       // 分类处理-2: 不分组+排序
	           if (GroupBy.length === 0 && SortBy.length > 0) {
	               return SortData(PageDataArray, SortBy, SortOrder, compare);
	           }
	   
	       // 分类处理-3: 分组+不"单独"排序
	           if (GroupBy.length > 0 && SortBy.length === 0) {
	               let groupedData = Object.entries(GroupForArray(PageDataArray, GroupBy, GroupByKeyShowSwitch))
	                   .sort(([groupA], [groupB]) => compare({ [GroupBy]: groupA }, { [GroupBy]: groupB }, GroupBy, GroupOrder));
	       
	               let flattenedData = [];
	               groupedData.forEach(([group, items]) => {
		               const groupCount = items.length; // 获取这一组的总计数量
	                   items.forEach((item, index) => {
	                       flattenedData.push({
	                           //GroupKey: index === 0 ? group : "",   //  这个是不带计数，下面的是带计数
	                           GroupKey: index === 0 ? `${group} (总计: ${groupCount})` : "",
	                           ...item
	                       });
	                   });
	               });
	               return flattenedData;
	           }
	       
	       // 分类处理-4: 分组+"单独"排序
	           if (GroupBy.length > 0 && SortBy.length > 0) {
	               let groupedData = Object.entries(GroupForArray(PageDataArray, GroupBy,GroupByKeyShowSwitch))
	                   .sort(([groupA], [groupB]) => compare({ [GroupBy]: groupA }, { [GroupBy]: groupB }, GroupBy, GroupOrder));
	       
	               let flattenedData = [];
	               groupedData.forEach(([group, items]) => {
		               const groupCount = items.length; // 获取这一组的总计数量
	                   let sortedItems = SortData(items, SortBy, SortOrder, compare);
	                   sortedItems.forEach((item, index) => {
	                       flattenedData.push({
	                            //GroupKey: index === 0 ? group : "",        //  这个是不带计数，下面的是带计数
	                            GroupKey: index === 0 ? `${group} (总计: ${groupCount})` : "",
	                           ...item
	                       });
	                   });
	               });
	               return flattenedData;
	           }
	   
	       return PageDataArray;
	   }


  // 11 - TableRowsCook 行数据 获取  分组 | 不分组 →  如果分？ → 那个分组的列 ，展示？不展示 
	   // headers： 全局变量表头；
	   // GroupBy： 全局变量 ，按什么分组；用于判断分不分组
	   // GroupByKeyShowSwitch： 全局变量，开关 ；true | false ；用于控制 “分组 key” 是否展示
	   // 使用的话，是： let { ShowHeaders, tableRows } = TableRowsCook(sortedData, headers, GroupBy, GroupByKeyShowSwitch);
	   
    function TableRowsCook(PageDataArray, FloatHeaders, GroupBy, GroupByKeyShowSwitch) {
        // 一、数据初步处理
        GroupBy = GroupBy.trim().replace("⛔不分组", '');
        GroupByKeyShowSwitch = GroupByKeyShowSwitch.trim();
        FloatHeaders = Array.from(new Set(FloatHeaders.map(item => item.trim()))); // 去除空格并去重
    
        // 二、计算 HeadersNotShowGroupKey
        let HeadersNotShowGroupKey = headers.concat(FloatHeaders);
    
        // 三、计算 HeadersShowGroupKey
        let HeadersShowGroupKey = ["GroupKey"].concat(headers, FloatHeaders);
    
        // 四、分类处理-1：不分组的时候
        let LastShowHeaders;
        if (GroupBy.length === 0 || GroupBy.includes("⛔不分组")) {
            LastShowHeaders = HeadersNotShowGroupKey;
        }
    
        // 五、分类处理-2：分组 + 展示分组 key
        else if (GroupBy.length > 0 && GroupByKeyShowSwitch.includes("分组-展示-key")) {
            LastShowHeaders = HeadersShowGroupKey;
        }
    
        // 六、分类处理-3：分组 + 不展示分组 key
        else if (GroupBy.length > 0 && GroupByKeyShowSwitch.includes("分组-不展示-key")) {
            LastShowHeaders = HeadersNotShowGroupKey;
        }
    
        // 保险措施：处理 LastShowHeaders，trim，去除长度为0的项并去重
        LastShowHeaders = Array.from(new Set(LastShowHeaders.map(item => item.trim()).filter(item => item.length > 0)));
    
        // 最终计算行数据 tableRows
        let tableRows = PageDataArray.map(item => {
            return LastShowHeaders.map(property => {
                if (property === "GroupKey" && item.hasOwnProperty("GroupKey")) {
                    return item["GroupKey"];
                }
                let value = getNestedValue(item, property);
                return Array.isArray(value) ? value.join(", ") : value || "";
            });
        });
    
        return { LastShowHeaders, tableRows };
    }
    

  // 06 - 筛选函数 ~ 单独调用 ~ 提取专用数据的 
	// 01 - 这个是单独的，用来统计一些重要的变量的； 
	   // 如：按频率统计 key； 这样给 header 下拉，提供 数据源的  
		let PageDataArrayPrepare = dv.pages().file.array(); 
		PageDataArrayPrepare = PageDataArrayPrepare.map(page => {
				const fileCtime = formatFullDate(page.ctime);
				const fileMtime = formatFullDate(page.mtime);
				return { ...page, fileCtime, fileMtime };
			});
			
		PageDataArrayPrepare= processPagesArray(PageDataArrayPrepare);  // 处理 ctime  ; mtime，处理成标准的
		PageDataArrayPrepare = ExtractAndJoinTags(PageDataArrayPrepare); // 处理 tags ，汇总了
		PageDataArrayPrepare = ProcessFrontmatter(PageDataArrayPrepare); // 处理这个 Yaml 区的 key 与 value 汇总了
		let FloatKey = calculateFrontmatterFrequency(PageDataArrayPrepare);  // 汇总所有 Yaml 区的 key；并按频率排序了的；  
		//dv.paragraph(FloatKey);

		let AllTagsArrayFrequency = ProcessTagsFrequency(PageDataArrayPrepare);	  // 按频率统计的标签
		let AllTagsArrayRecently = ProcessTagsRecently(PageDataArrayPrepare);     // 按最近出现顺序出现的标签

  // 07 - Rows，各行的容器哈 
	  const mainContainer = createFlexContainer("flex-container", "center", "column");
	
	// row01 - 搜索 --  文件名 |  文件夹 |  路径  | ~  清空 
		// row1 - 00 - 创建第 1 排 容器布局 
			const row1 = createFlexContainer("flex-row", "space-between");
			
		// row1 - 01 - 文件名 FileName -搜索 （lable + 文本输入框架）
			const labelFileName = document.createElement("label");
			labelFileName.innerText = "文件名";
			labelFileName.className = `${className}-label-field`; // 单独设置类名
		
			const inputFieldFileName = createInputField("多个关键字 用逗号空格等隔开", "");
			inputFieldFileName.className = `${className}-inputFilter-field-string`; // 单独设置类名
			inputFieldFileName.addEventListener("input", (event) => {    
				event.preventDefault() // 这个就是防误触（很复杂 ，你加就对了）	
			    debouncedUpdateInputFileName(event.target.value);
		    
				});

		// row1 - 02 - 文件夹 folder -搜索（lable + 文本输入框架）
			const labelFileFolder = document.createElement("label");
			labelFileFolder.innerText = "Folder";
			labelFileFolder.className = `${className}-label-field`; // 单独设置类名
		
			const inputFieldFileFolder = createInputField("多个关键字 用逗号空格等隔开", "");
			inputFieldFileFolder.className = `${className}-inputFilter-field-string`; // 单独设置类名
			inputFieldFileFolder.addEventListener("input", (event) => {    
				event.preventDefault() // 这个就是防误触（很复杂 ，你加就对了）	
			    debouncedUpdateInputFolder(event.target.value);
			    
				});
	
		// row1 - 03 - 路径 path 搜索（lable + 文本输入框架）
			const labelFilePath = document.createElement("label");
			labelFilePath.innerText = "Path";
			labelFilePath.className = `${className}-label-field`; // 单独设置类名
		
			const inputFieldFilePath = createInputField("多个关键字 用逗号空格等隔开", "");
			inputFieldFilePath.className = `${className}-inputFilter-field-string`; // 单独设置类名
			inputFieldFilePath.addEventListener("input", (event) => {    
				event.preventDefault() // 这个就是防误触（很复杂 ，你加就对了）				    
			    debouncedUpdateInputPath(event.target.value);
				});
			
		// row1 - 04 - 清空按钮
		   const buttonClearRowOne = document.createElement("button");
		   buttonClearRowOne.innerText = "清空条件";
		   
		   buttonClearRowOne.className = `${className}-button--clear-StringSearch`; // 单独设置类名
		   buttonClearRowOne.addEventListener("click", () => {
			event.preventDefault() // 这个就是防误触（很复杂 ，你加就对了）
			   //inputFieldRowOne.value = "";     // 这是 2 个原本的，清空 ，还有变量清空 
			   //filterRowOne = "";
			   //debouncedUpdateClearRowOne();     // 用防抖函数打包了的
			debouncedUpdateClearRowOne();
			});

		// row1 - 05 - 全部加载到行容器上 
			row1.appendChild(labelFileName);
			row1.appendChild(inputFieldFileName);
			row1.appendChild(labelFileFolder);
			row1.appendChild(inputFieldFileFolder);
			row1.appendChild(labelFilePath);
			row1.appendChild(inputFieldFilePath);
			row1.appendChild(buttonClearRowOne);	
			mainContainer.appendChild(row1);    // 将第一排添加到主容器
		

	// row02 - 搜索 --  标签 |  key |  value  | ~  清空 
	
		// row2 - 00 - 创建第 2 排 容器布局 
			const row2 = createFlexContainer("flex-row", "space-between");

		// row2 - 01 - Tags 标签搜索 （lable + 文本输入框架）
			const labelTagsName = document.createElement("label");
			labelTagsName.innerText = "Tags";
			labelTagsName.className = `${className}-label-field`; // 单独设置类名
		
			const inputFieldTagsName = createInputField("多个 tag 用逗号空格等隔开", "");
			inputFieldTagsName.className = `${className}-inputFilter-field-string`; // 单独设置类名
			inputFieldTagsName.addEventListener("input", (event) => {
				event.preventDefault() // 这个就是防误触（很复杂 ，你加就对了）
			    //filterTags = event.target.value;
				debouncedUpdateInputFilterTags(event.target.value);
				
				});
	
		// row2 - 02 - Key -搜索（lable + 文本输入框架）
			const labelKeyName = document.createElement("label");
			labelKeyName.innerText = "Key";
			labelKeyName.className = `${className}-label-field` ; // 单独设置类名
		
			const inputFieldKeyName = createInputField("关键字 用逗号空格等隔开", "");
			inputFieldKeyName.className =  `${className}-inputFilter-field-string`  ; 
			inputFieldKeyName.addEventListener("input", (event) => {
				event.preventDefault(); // 阻止表单提交的默认行为；走这个监听下面的其他的流程；
				//WhichKey = event.target.value;   
				debouncedUpdateWhichKey(event.target.value); 
				
				});

		// row2 - 03 - Value  搜索（lable + 文本输入框架）
			const labelValueName = document.createElement("label");
			labelValueName.innerText = "Value";
			labelValueName.className = `${className}-label-field` ; // 单独设置类名
		
			const inputFieldKeyValue = createInputField("关键字 用逗号空格等隔开", "");
			inputFieldKeyValue.className =  `${className}-inputFilter-field-string`    ; // 单独设置类名
			inputFieldKeyValue.addEventListener("input", (event) => {
				event.preventDefault(); // 阻止表单提交的默认行为；走这个监听下面的其他的流程；
			    //KeyValueFilter = event.target.value;    
				//debouncedUpdateKeyValueFilter(event.target.value);
				debouncedUpdateValueFilter(event.target.value);
		    
				});

		// row2 - 04 - 清空按钮 
			const buttonClearRowTwo = document.createElement("button");
			buttonClearRowTwo.innerText = "清空条件";
		
			buttonClearRowTwo.className = `${className}-button--clear-StringSearch`; // 单独设置类名
			buttonClearRowTwo.addEventListener("click", () => {
				event.preventDefault() // 这个就是防误触（很复杂 ，你加就对了）
			    //inputFieldRowTwo.value = "";     // 这是 2 个原本的，清空 ，还有变量清空 
			    //filterRowTwo = "";
			    //debouncedUpdateClearRowTwo();     // 用防抖函数打包了的
				debouncedUpdateClearStringSearch();
				});

		// row2 - 05 - 全部加载到行容器上 
			row2.appendChild(labelTagsName);
			row2.appendChild(inputFieldTagsName);
			row2.appendChild(labelKeyName);
			row2.appendChild(inputFieldKeyName);
			row2.appendChild(labelValueName);
			row2.appendChild(inputFieldKeyValue);
			row2.appendChild(buttonClearRowTwo);	
			mainContainer.appendChild(row2);    // 将第一排添加到主容器

	
	// row03 - 时间 --  TimeBy-下拉 | 月 \ 周 \ strart \ end |  	

		// row3 - 00 - 创建第 3 排 容器布局 
			const row3 = createFlexContainer("flex-row", "space-between");

		// row3 - 01 - 按？排序 -- （下拉选框）
			const labelWhichDate = document.createElement("label");
			labelWhichDate.innerText = "按 ? 时间";
			labelWhichDate.className =`${className}-label-row3-WhatTime`; 
			
			const selectDateSortBy = createSelectField(["创建时间", "修改时间","created_time","modify_time","XX-可增改","Issued"], "创建时间");
			selectDateSortBy.className =  `${className}-select-Row3-WhatTime`  ; // 单独设置类名
			selectDateSortBy.addEventListener("change", (event) => {
		       event.preventDefault() // 这个就是防误触（很复杂 ，你加就对了）			   
			   debouncedUpdateDateFilterBy(event.target.value);
				});

		// row3 - 02 - 月 Month 容器
			const labelContainerMonth = document.createElement("label");
			labelContainerMonth.innerText = "Month";
			labelContainerMonth.className = `${className}-label-row3-Month` ;          
		
			let monthDateInput = document.createElement("input");
			monthDateInput.type = "month";
			monthDateInput.className =  `${className}-contianer-row3-Month`   ;      
			monthDateInput.addEventListener("change", function() {    // 添加事件监听器，
				 event.preventDefault() // 这个就是防误触（很复杂 ，你加就对了）	 
			     debouncedUpdateMonth(event.target.value);
			    //dv.paragraph(`监控的月份容器 值  : ${ContainerMonthDateValue}`);
				});
		
		// row3 - 03 - 周 Week 容器
			const labelContainerWeek = document.createElement("label");
			labelContainerWeek.innerText = "Week";
			labelContainerWeek.className = `${className}-label-row3-Week`  ;     
			  
			let weekDateInput = document.createElement("input");
			weekDateInput.type = "week";
			weekDateInput.className = `${className}-contianer-row3-Week`   ;  
			weekDateInput.addEventListener("change", function() {    // 添加事件监听器，
			    event.preventDefault() // 这个就是防误触（很复杂 ，你加就对了）	
		        debouncedUpdateWeek(event.target.value);
		        
			    //dv.paragraph(`监控的 week 周的值  : ${ContainerWeekDateValue}`);
				});
				
			//weekDateInput.value = today;

		// row3 - 04 - 日 Start 容器
			 const labelContainerDayStart = document.createElement("label");
			 labelContainerDayStart.innerText = "Start";
			 labelContainerDayStart.className = `${className}-label-row3-Start` ;              // 单独设置类名
		 
			let startdateInput = document.createElement("input");
			startdateInput.type = "date";
			startdateInput.className =`${className}-contianer-row3-Start` ;    // 添加 CSS 类
			startdateInput.addEventListener("change", function() {    // 添加事件监听器，    
			    event.preventDefault() // 这个就是防误触（很复杂 ，你加就对了）	    
			    //dv.paragraph(`监控的开始日期值 : ${ ContainerStartDateValue}`);
			    debouncedUpdateStart(event.target.value);
				});

		// row3 - 05 - 日 End 容器
			const labelContainerDayEnd = document.createElement("label");
			labelContainerDayEnd.innerText = "End";
			labelContainerDayEnd.className = `${className}-label-row3-End`;   
		 
			let enddateInput = document.createElement("input");
			enddateInput.type = "date";
			enddateInput.className =`${className}-contianer-row3-End` ;    // 添加 CSS 类
			enddateInput.addEventListener("change", function() {    // 添加事件监听器，
				event.preventDefault() // 这个就是防误触（很复杂 ，你加就对了）	  
				debouncedUpdateEnd(event.target.value);
				
			    //dv.paragraph(`监控的结束日期值 : ${ContainerEndDateValue }`);
				});
			//enddateInput.value = formattedToday;

		// row3 - 06 - 全部加载到行容器上 
		    row3.appendChild(labelWhichDate);
			row3.appendChild(selectDateSortBy);
		
		
			row3.appendChild(labelContainerMonth)
			row3.appendChild(monthDateInput)
		
			row3.appendChild(labelContainerWeek)
			row3.appendChild(weekDateInput)
		
		
			row3.appendChild(labelContainerDayStart);
			row3.appendChild(startdateInput); // 将容器添加到文档中
		
			row3.appendChild(labelContainerDayEnd)
			row3.appendChild(enddateInput);
		
		
		
			mainContainer.appendChild(row3);


	// row04 - 时间--  中间时间搜索 |  时间块 |  anki  |    清空  | css 样式-下拉选择

		// row4 - 00 - 创建第 4 排 容器布局 
			const row4 = createFlexContainer("flex-row", "space-between");
			
		// row4 - 01 -  中文日期搜  -- （lable + 文本输入框架）
			const labelChineseSearch = document.createElement("label");
			labelChineseSearch.innerText = "日期搜";
			labelChineseSearch.className = `${className}-label-field` ;       
			
			const inputChineseSearch= createInputField("多关键字 用逗号空格等隔开", "");
			inputChineseSearch.className = `${className}-inputFilter-field-string`  ;    
			inputChineseSearch.addEventListener("input", (event) => {    
			     event.preventDefault() // 这个就是防误触（很复杂 ，你加就对了）
			     debouncedUpdateChineseSearch(event.target.value); 
			     //pageNum = 1;
			     //filterPages();
			     ///fy();
			     ;
		    
				});
	
		// row4 - 02 -  时间块搜(日期) -- （lable + 文本输入框架）
			const labelDateBlockFilter = document.createElement("label");
			labelDateBlockFilter.innerText = "时间块";
			labelDateBlockFilter.className =  `${className}-label-field` ;     
		
			const inputDateBlockFilter= createInputField("-1 昨天，0 今天，+1 明天", "");
			inputDateBlockFilter.className = `${className}-inputFilter-field-string` ;    
			inputDateBlockFilter.addEventListener("input", (event) => {    
				 event.preventDefault() // 这个就是防误触（很复杂 ，你加就对了）
				 debouncedUpdateBlockFilter(event.target.value);
				 ;
			
				});
	
		// row4 - 03 -  Anki 频率搜(日期) -- （lable + 文本输入框架）
			const labelDateAnkiFilter = document.createElement("label");
			labelDateAnkiFilter.innerText = "间隔";
			labelDateAnkiFilter.className =  `${className}-label-field` ;       
		
			const inputDateAnkiFilter= createInputField("多关键字 用逗号空格等隔开", "");
			inputDateAnkiFilter.className =  `${className}-inputFilter-field-string`  ;   
			inputDateAnkiFilter.addEventListener("input", (event) => {    
			     event.preventDefault() // 这个就是防误触（很复杂 ，你加就对了）
			     debouncedUpdateAnkiFilter(event.target.value);
			     ;
		    
				});
		
		// row4 - 04 -  清空按钮（所有日期筛选）
			const buttonClearRowFour = document.createElement("button");
			buttonClearRowFour.innerText = "清空 Date";
		
			buttonClearRowFour.className = `${className}-button--clear-Date`; // 单独设置类名
			buttonClearRowFour.addEventListener("click", () => {
				event.preventDefault() // 这个就是防误触（很复杂 ，你加就对了）
			    //inputFieldRowFour.value = "";     // 这是 2 个原本的，清空 ，还有变量清空 
			    //filterRowFour = "";
			    debouncedUpdateClearRowFour();     // 用防抖函数打包了的
		
				});

		// row4 - 05 - 全部加载到行容器上 
		    row4.appendChild(labelChineseSearch);
			row4.appendChild(inputChineseSearch);		
		
			row4.appendChild(labelDateBlockFilter)
			row4.appendChild(inputDateBlockFilter)
			row4.appendChild(labelDateAnkiFilter)
			row4.appendChild(inputDateAnkiFilter)		
			row4.appendChild(buttonClearRowFour)			
			mainContainer.appendChild(row4);
	
	// row05 - 搜索 --  表头-下拉选 |  string 排序+asc |  Date 排序+asc  | 页码数  
			
		// row5 - 00 - 创建第 5 排 容器布局 
			const row5 = createFlexContainer("flex-row", "space-between");
			
		// row5 - 01 -  表头 header | 自由选择 -- （下拉复选框）
				

			// 0.01 -  表头处理；	

				
				//const combinedOptions = [...new Set([...SystemHeaders, ...FloatKey])];

	            let combinedSet = new Set([...SystemHeaders, ...FloatKey]); // 系统默认+Yaml 去重 
	            headers.forEach(header => combinedSet.delete(header));   // 系统默认+Yaml  - headers 个性
	            let combinedOptions = Array.from(combinedSet);    
	            // 得到最终下拉表值（不能包含 headers ，因为你都强制了的哈）

	        
			
			// 创建下拉筛选框容器
			const HeaderContainer = document.createElement('div');
			HeaderContainer.className = `${className}-HeaderContainer-container`;
			
			// 创建触发器按钮
			const trigger = document.createElement('button');
			trigger.textContent = "Header";
			trigger.className = `${className}-HeaderContainer-button`;
			HeaderContainer.appendChild(trigger);
			
			// 创建下拉菜单容器
				const dropdown = document.createElement('div');
				dropdown.className = `${className}-HeaderContainer-dropdown`;
				dropdown.style.display = "none"; // 初始隐藏
				HeaderContainer.appendChild(dropdown);
			
					
		    // 创建选项列表
			   combinedOptions.forEach(option => {
			       const optionContainer = document.createElement('div');
			       optionContainer.className = `${className}-HeaderContainer-option-container`;
			       
			       const checkbox = document.createElement('input');
			       checkbox.type = 'checkbox';
			       checkbox.id = `filter-${option}`;
			       checkbox.className = `${className}-Header-Option-checkbox`; // 添加类名
			       checkbox.value = option;
			       optionContainer.appendChild(checkbox);
			       
			       const label = document.createElement('label');
			       label.htmlFor = `filter-${option}`;
			       label.className = `${className}-Header-Option-label`;
			       label.textContent = option;
			       optionContainer.appendChild(label);
			       
			       // 添加复选框的事件监听
			       checkbox.addEventListener('change', function() {
			           if (this.checked) {
			               if (!FloatHeaders.includes(option)) {
			                   FloatHeaders.push(option);
			               }
			           } else {
			               const index = FloatHeaders.indexOf(option);
			               if (index > -1 && !["link"].includes(option)) {
			                   FloatHeaders.splice(index, 1);
			               }
			           }
			           PreparePageDataArray();
			           fy();
			           pageNum = 1;
			       });
			   
			       dropdown.appendChild(optionContainer);
			   });
	
			// 添加触发器的点击事件监听
				trigger.addEventListener('click', () => {
				    if (dropdown.style.display === "none") {
				        dropdown.style.display = "block";
				    } else {
				        dropdown.style.display = "none";
				    }
				    
			});

		// row5 - 02 -   HeaderCtrol  表头控制   -- （下拉选框）
			const selectHeaderCtrol = createSelectField(["👁️‍🗨️不筛-只展示",
			"🚫筛不存在-And", "🚫筛不存在-Or",
			"➕筛存在-And","➰筛存在-Or",
			"➕筛有效-And","➰筛有效-Or",
			"❗筛无效-And","❗筛无效-Or",
			]);
			selectHeaderCtrol.className =  `${className}-select-row5-HeaderCtrol`  ; // 单独设置类名
			selectHeaderCtrol.addEventListener("change", (event) => {
			      event.preventDefault() // 这个就是防误触（很复杂 ，你加就对了）
			   debouncedUpdateHeaderCtrol(event.target.value);
			   
			    });

		// row5 - 03 -   GroupCtrol  分组控制   -- （下拉选框）
		    const selectGroupCtrol = createSelectField([
		        "👁️‍🗨️💧显示分组","❗💧不显示分组",
		        "👁️‍🗨️🌐显示分组", "❗🌐不显示分组",
		        ]);
		    selectGroupCtrol.className =  `${className}-select-row5-GroupCtrol`  ; // 单独设置类名
		    selectGroupCtrol.addEventListener("change", (event) => {
		          event.preventDefault() // 这个就是防误触（很复杂 ，你加就对了）
		       debouncedUpdateGroupCtrol(event.target.value);
		       
		        });

		// row5 - 04 -  GroupBy 按什么分组   -- （下拉选框）
			const selectGroupBy = createSelectField([
			"⛔不分组","🔀Progress","📂folder","🚩Tags",
			"Ctime-月","Ctime-Day",
			"Mtime-月","Mtime-Day",
			"其他 key",
			
			]);
			
			selectGroupBy.className =  `${className}-select-row5-GroupBy`  ; // 单独设置类名
			selectGroupBy.addEventListener("change", (event) => {
			      event.preventDefault() // 这个就是防误触（很复杂 ，你加就对了）
			   debouncedUpdateGroupBy(event.target.value);
			   
			    });
		
		// row5 - 05 -  GroupOrder  →   asc | desc  -- 排序方向（下拉选框）
			const selectGroupOrder = createSelectField(["⏫升序", "⏬降序"], "⏫升序");
			selectGroupOrder.className =`${className}-select-row5-GroupOrder`; 
			selectGroupOrder.addEventListener("change", (event) => {
			    event.preventDefault() // 这个就是防误触（很复杂 ，你加就对了）        
			    debouncedUpdateGroupOrder(event.target.value);
			    
			    });

		// row5 - 06 -  Line 分组的组内 →   排序区域  -- （下拉选框）
		
			const selectLineSortBy = createSelectField([			
			"🕞-Mtime","🕙-Ctime","⛔不排序","created_time","modify_time",
			"发布日期","其他日期","其他 key",
			], "🕞-Mtime");
			selectLineSortBy.className = `${className}-select-row5-LineSortBy`  ; // 单独设置类名
			selectLineSortBy.addEventListener("change", (event) => {
			   event.preventDefault() // 这个就是防误触（很复杂 ，你加就对了）
			   debouncedUpdateLineSortBy(event.target.value);
			    });
	
		// row5 - 07 -  Line 分组的组内 →   排序方向 →    asc | desc  -- （下拉选框）
			const selectLineSortOrder = createSelectField(["⏫升序", "⏬降序"], "⏬降序");
			selectLineSortOrder.className =`${className}-select-row5-LineSortOrder`  ; // 单独设置类名
			selectLineSortOrder.addEventListener("change", (event) => {
			    event.preventDefault() // 这个就是防误触（很复杂 ，你加就对了）
			    //LineSortOrder = getLineSortOrder(event.target.value) ;
			    debouncedUpdateLineSortOrder(event.target.value);
			
			    });


		// row5 - 08 -  清空排序 
			const buttonClearSort = document.createElement("button");
			buttonClearSort.innerText = "清空 Sort";
		
			buttonClearSort.className = `${className}-button--clear-Sort`; // 单独设置类名
			buttonClearSort.addEventListener("click", () => {
				event.preventDefault() // 这个就是防误触（很复杂 ，你加就对了）
			    //inputFieldSort.value = "";     // 这是 2 个原本的，清空 ，还有变量清空 
			    //filterSort = "";
			    debouncedUpdateClearSort();     // 用防抖函数打包了的
		
				});

		// row5 - 09 -  单页最大结果数量，max
			const labelPageSize = document.createElement("label"); 
			labelPageSize.innerText = "单页 Max"; 
			labelPageSize.className = `${className}-label-pagesize`   ; // 单独设置类名
		
			const PageSizeInput = document.createElement("input");
			PageSizeInput.type = "number"; // 设置类型为数值
			PageSizeInput.placeholder = "值要>0"; // 设置占位符
			PageSizeInput.value = "10"; // 设置默认值
			PageSizeInput.className = `${className}-inputPageMax-field`  ; // 单独设置类名
			
			PageSizeInput.addEventListener("input", (event) => {
				event.preventDefault(); // 阻止表单提交的默认行为
				//PageSize = event.target.value; // 确保值为整数，默认值为 10	    
				//pageNum = 1; 
				//filterPages();
				//fy();
				const value = parseInt(event.target.value);
				debouncedUpdatePageSize(isNaN(value) ? 10 : value); // 确保传递给防抖函数的值不为 NaN
				
				});


		// row1 - 06 - 全部加载到行容器上 
			row5.appendChild(HeaderContainer);
			
			row5.appendChild(selectHeaderCtrol);
			row5.appendChild(selectGroupCtrol);
			
			row5.appendChild(selectGroupBy);
			row5.appendChild(selectGroupOrder);

		    row5.appendChild(selectLineSortBy);	
		    row5.appendChild(selectLineSortOrder);	


			row5.appendChild(buttonClearSort);
			


			mainContainer.appendChild(row5);


let filteredPageDataArray = dv.pages().file.array(); 

// filteredPageDataArray = await ContentFilter(filteredPageDataArray, ContentSearch);

(async () => {
    filteredPageDataArray = await ContentFilter(filteredPageDataArray, ContentSearch, app);
})();


  // 08 - 筛选函数 (各种函数  + 时间筛选叠加)    
   function PreparePageDataArray() {
	 // 01 - 获取数组 
		 let PageDataArray = filteredPageDataArray;
	
	 // 02 - 处理数组中的 ctime 和 mtime 、 tags  、 Yaml 区的值 
		// 因为那个时间不是标准的时间，得处理成标准的 yyyy-mm-dd 时间才行的  
			PageDataArray = PageDataArray.map(page => {
				const fileCtime = formatFullDate(page.ctime);
				const fileMtime = formatFullDate(page.mtime);
				return { ...page, fileCtime, fileMtime };
			});
			
			PageDataArray = processPagesArray(PageDataArray);  // 处理 ctime  ; mtime，处理成标准的
			PageDataArray = ExtractAndJoinTags(PageDataArray); // 处理 tags ，汇总了
			PageDataArray = ProcessFrontmatter(PageDataArray); // 处理这个 Yaml 区的 key 与 value 汇总了

	 // 03 - string 过滤类哈 
		 PageDataArray = FileNameFilter(PageDataArray, FileNameFilterSearch) ;  // 文件名过滤 
		 PageDataArray = FolderFilter(PageDataArray, FolderFilterSearch);   // 文件夹过滤 
		 PageDataArray = PathFilter(PageDataArray, PathFilterSearch);       // 路径过滤  
		 PageDataArray = TagsFilter(PageDataArray, TagsFilterSearch);       // 标签过滤哈  
		 PageDataArray = KeysFilter(PageDataArray, KeysFilterSearch);     // key 过滤  
		 PageDataArray  =  ValuesFilter(PageDataArray, ValuesFilterSearch);   // value 值的过滤 
		 //  PageDataArray = await ContentFilter(PageDataArray, ContentSearch);


	 // 04 - Date 日期类过滤  
		 PageDataArray =  ChineseDateFilter(PageDataArray, dateFilterBy, DateSearch);   // 中文日期搜索 
		 PageDataArray =  BlockDateFilter(PageDataArray, dateFilterBy, Intervalday)    // 时间块筛选  
		 PageDataArray =  AnkiFilter(PageDataArray, dateFilterBy, AnkiFrequncey) 	  //anki 频率筛选
		 PageDataArray = ContainerDateFilter(PageDataArray, dateFilterBy, ContainerStartDateValue,  // 日期容器筛选函数
						 ContainerEndDateValue, ContainerMonthDateValue, ContainerWeekDateValue)


	    // dv.paragraph(PageDataArray.length);
	    
     // 05 -- 字段筛选补充 -- （header → 检查 的多一些；   |  分组 +  排序只检查"存在性"   ）
     
        //01- 对于那个浮动的 Header，我们提控制 它的展示，筛选；，参数多
            PageDataArray  = HeaderKeyFilter(PageDataArray, FloatHeaders, HeaderKeyFilterSwitch);
            
        //02- 分组的 key，→ 存在性筛选 （针对自定义 key ）
        
            PageDataArray  = GroupKeyHaveFilter(PageDataArray, GroupBy);
            
        //03- 排序的 key ，→ 存在性筛选 （针对自定义 key ） 
			
			PageDataArray = SortKeyHaveFilter(PageDataArray, SortBy);		
		
		//04- 按？时间筛的 key 过滤 →筛选存在性  （针对自定义 key ） 
		    PageDataArray = dateByKeyFilter(PageDataArray, dateFilterBy);  
	   

	 // 06 - 计算翻页用的数据哈    totalData 就是总的数据；  maxmun，就是最大页码数  
		 let totalData = PageDataArray.length;    
		 let maxnum = Math.max(Math.ceil(totalData / PageSize), 1);
	
	    return { PageDataArray, totalData, maxnum };
	    }

  // 09 - 翻页容器的部分； 
	 let  {PageDataArray, totalData, maxnum }  =  PreparePageDataArray(); // 解析筛选数据

	 

     //dv.paragraph(PageDataArray[1]);
	 //dv.paragraph(`DateSearch - 年 - 处理之后 : ${JSON.stringify(PageDataArray[0])}`);
	 
     let paragraph = document.createElement("div");
     paragraph.innerText =` 共检索出 ${totalData} 条数据`;
	 paragraph.className = `${className}-paragraph`; // 单独设置类名
    
     const row7 = createFlexContainer("flex-row", "space-between");


     let pageSpan1 = dv.el("span", `${pageNum}`); 
     let pageSpan2 = dv.el("span", "  / ");    
     let pageSpan3 = dv.el("span", maxnum);  
     //let pageSpan3 = dv.el("span",`${maxnum}`);  

	// 补充的内容搜索框架 
		const labelContent = document.createElement("label");
		labelContent.innerText = "Content 搜";
		labelContent.className =   `${className}-label-content`; // 单独设置类名
				
		const inputFieldContent = createInputField("多个关键字 用逗号空格等隔开", "");
		inputFieldContent.className =   `${className}-inputFilter-content`; // 单独设置类名
		inputFieldContent.addEventListener("input", (event) => {    
			event.preventDefault() // 这个就是防误触（很复杂 ，你加就对了）	
			debouncedUpdateInputContent(event.target.value, app);
				    
					});



	// 补充的清空按钮，清空内容搜索的； 
		const buttonClearContent = document.createElement("button");
		  buttonClearContent.innerText = "清空条件";
		  
		  buttonClearContent.className =  `${className}-button--clear-content`; // 单独设置类名
		  buttonClearContent.addEventListener("click", () => {
		event.preventDefault() // 这个就是防误触（很复杂 ，你加就对了）
		   //inputFieldContent.value = "";     // 这是 2 个原本的，清空 ，还有变量清空 
		   //filterContent = "";
		   //debouncedUpdateClearContent();     // 用防抖函数打包了的
		debouncedUpdateClearContent();
		});




    
     const buttonUp = createButton("上一页"); 
     buttonUp.className = `${className}-Fybutton-Up`;               
     buttonUp.addEventListener("click", () => {
        event.preventDefault(); // 阻止表单提交的默认行为；走这个监听下面的其他的流程；
        let { maxnum } =  PreparePageDataArray() ; //获取最新的 maxnum
        //dv.paragraph(`搜索的值 : ${filterFileName}`); 
        pageNum = pageNum > 1 ? pageNum - 1 : maxnum;     
        if (pageNum < 1) pageNum = 1; // 确保 pageNum 不小于 1      
        debouncedfy();  
        });


     const buttonDown = createButton("下一页");    
     buttonDown.className =  `${className}-Fybutton-Down`; 
     buttonDown.addEventListener("click", () => {
        event.preventDefault(); // 阻止表单提交的默认行为；走这个监听下面的其他的流程；
        let { maxnum } = PreparePageDataArray(); // 获取最新的 maxnum
        pageNum = pageNum < maxnum ? pageNum + 1 : 1;   
        if (pageNum < 1) pageNum = 1;   // 确保 pageNum 不小于       
        debouncedfy();  
    
        });


     // 将第 1 排添加到 row1 组件 
		row7.appendChild(paragraph);

		row7.appendChild( labelContent);
		row7.appendChild( inputFieldContent );

		row7.appendChild( buttonClearContent );
		
		row7.appendChild(labelPageSize);
		row7.appendChild(PageSizeInput);
		
		row7.appendChild(buttonUp);
		row7.appendChild(pageSpan1);
		row7.appendChild(pageSpan2);
		row7.appendChild(pageSpan3);
		row7.appendChild(buttonDown);
    
     // 将第一排添加到主容器
     mainContainer.appendChild(row7);
	 dv.container.appendChild(mainContainer);  // 搜索框 → 加载主容器




  // 优化 fy 翻页的
    // 全局变量，用于懒加载 
	    let isFetching = false; 
	    let hasMoreData = true;
	    
    // 懒加载处理函数
	    function handleScroll() {
	        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !isFetching && hasMoreData) {
	            isFetching = true;
	            pageNum++;
	            fy();
	        }
	    }

  // 10 -翻页函数 fy() 就是翻页，展示的函数，也不用动啥哈
	  function fy() {
		   // 01 -  清除现有的表格和错误框
		    const elementsToRemove = document.querySelectorAll(".dataview.table-view-table, .dataview.dataview-error-box");    
		    elementsToRemove.forEach(element => element.remove());    
		    
		   // 02 - 解析筛选数据
		    let  {PageDataArray, totalData, maxnum }  = PreparePageDataArray();  
		    
	// 03 - 异步展现表格 
	  (async () => {

	    // 更新页面显示信息
	        pageSpan1.innerText = pageNum; 
	        pageSpan3.innerText = maxnum;
	        paragraph.innerText = `共检索出 ${totalData} 条数据`;
	        

		// 多级排序  +  产生我们想要的行数据  ；		
			PageDataArray =  multiLevelSort(PageDataArray, GroupBy, GroupOrder, SortBy, SortOrder)   // 分组+排序
			
			let { LastShowHeaders, tableRows } = TableRowsCook(PageDataArray, FloatHeaders, GroupBy, GroupByKeyShowSwitch);
			//dv.paragraph(headers);
			//dv.paragraph(ShowHeaders);
			
			//产生 header+ 行数据   
			let ShowTableRows = tableRows.slice((pageNum - 1) * PageSize, pageNum * PageSize);
			// 翻页了的，行数据要切片    

	
	    // 渲染表格
	        dv.table(LastShowHeaders, ShowTableRows, ".dataview.table-view-table");
	   
	
	    // 优化的 - 不管 -  更新懒加载状态
	        isFetching = false;
	        hasMoreData = (pageNum * PageSize < totalData);
	    
	    // 优化的 - 不管 -  监听滚动事件，实现懒加载
	        if (hasMoreData) {
	            window.addEventListener('scroll', handleScroll);
	        } else {
	            window.removeEventListener('scroll', handleScroll);
	        }
	
	  })();
	
	  }



fy();


  // 00 -   对翻页防抖包装； 
	  const debouncedfy  = debounce ((value) => {    
	    fy();
	    }, 100);


  // 对行的打包
  
   // Row 01 排 -  文件名 |  文件夹 | 路径  | 清空按钮
  
	// row-1-01   文件名 - 防抖打包
		const debouncedUpdateInputFileName = debounce((value) => {
		    FileNameFilterSearch = value;
		    pageNum = 1; 
		    PreparePageDataArray();
		    fy();
			}, 100);


	// row-1-02  文件夹 - 防抖打包
		const debouncedUpdateInputFolder = debounce((value) => {
		    FolderFilterSearch  = value;
		    pageNum = 1; 
		    PreparePageDataArray();
		    fy();
			}, 100);


	// row-1-03  路径 path - 防抖打包
			const debouncedUpdateInputPath = debounce((value) => {
		    PathFilterSearch  = value;
		    pageNum = 1; 
		    PreparePageDataArray();
		    fy();
			}, 100);



	// row-1-04  清空按钮
			const debouncedUpdateClearRowOne = debounce (() => {
			   FileNameFilterSearch = "  ";  
			   FolderFilterSearch = "  "; 
			   PathFilterSearch = "  "; 
			
			   inputFieldFileName. value = "";
			   inputFieldFileFolder. value = "";
			   inputFieldFilePath. value = "";
			
			   pageNum = 1; 
			   PreparePageDataArray();
			   fy ();
			}, 100);
		
   // Row 02 排 -  Tags |   Key  | Value  |  清空 
  
	// row-2-01  Tags 标签 - 防抖打包
		const debouncedUpdateInputFilterTags = debounce((value) => {
		    TagsFilterSearch = value;
		    pageNum = 1; 
		    PreparePageDataArray();
		    fy();
			}, 100);

	// row-2-02   Key 搜索 - 防抖打包
		const debouncedUpdateWhichKey  = debounce ((value) => {
		    KeysFilterSearch   = value;
		    pageNum = 1; 
		    PreparePageDataArray();
		    fy ();
			}, 100);

	// row-2-03  value 搜索  - 防抖打包
		const debouncedUpdateValueFilter  = debounce ((value) => {
		    ValuesFilterSearch = value;
		    pageNum = 1; 
		    PreparePageDataArray();
		    fy ();
			}, 300);

	// row-2-04  清空条件按钮 - 防抖打包
	    const debouncedUpdateClearStringSearch = debounce (() => {

	    TagsFilterSearch= "  "; 
	    KeysFilterSearch = "  "; 
	    ValuesFilterSearch  = "  "; 


	    inputFieldTagsName. value = "";
	    inputFieldKeyName. value = "";
	    inputFieldKeyValue. value = "";

	    pageNum = 1; 
	    PreparePageDataArray();
	    fy ();
		}, 100);

   // Row 03 排 -  时间 By   |  Month  | Week  | Day-Start | Day-End |  

  	// row-3-01  按什么时间筛选？  --- 下拉选框打包
	    const  debouncedUpdateDateFilterBy = debounce((value) => {


	    dateFilterBy = value ;
	    pageNum = 1; 
	    PreparePageDataArray();
	    fy();
		}, 100);
		
	// row-3-02  Month 容器打包
	    const debouncedUpdateMonth  = debounce ((value) => {    
	    ContainerMonthDateValue = value;

	    startdateInput.value = "";
	    enddateInput.value = "";	   
	    weekDateInput.value=  "";

	    ContainerStartDateValue = "";
	    ContainerEndDateValue  =  "";                    
	    ContainerWeekDateValue =  "";

	    DateSearch  = "" ;
	    Intervalday =  "" ;
	    AnkiFrequncey = "" ;

	    inputChineseSearch.value = "" ;
	    inputDateBlockFilter.value  = "" ;
	    inputDateAnkiFilter.value   = "" ;

	    pageNum = 1; 
	    PreparePageDataArray();
	    fy ();
		}, 100);

	// row-3-03  Week 容器打包
    	 const debouncedUpdateWeek  = debounce ((value) => {    

	     ContainerWeekDateValue= value;

	     startdateInput.value = "";
	     enddateInput.value = "";
	     monthDateInput.value= "";
	   

	     ContainerStartDateValue = "";
	     ContainerEndDateValue  =  "";
	     ContainerMonthDateValue  =  "";
                    

	     DateSearch  = "" ;
	     Intervalday = "" ;
	     AnkiFrequncey = "" ;
	     inputChineseSearch.value = "" ;
	     inputDateBlockFilter.value  = "" ;
	     inputDateAnkiFilter.value   = "" ;


	     pageNum = 1; 
	     PreparePageDataArray();
	     fy ();
		}, 100);
	
	// row-3-04  Day-Start - 起点打包
		const debouncedUpdateStart  = debounce ((value) => {    
		ContainerStartDateValue  = value;   
		
		ContainerMonthDateValue  =  "";
		ContainerWeekDateValue =  "";   
	
		monthDateInput.value = "";
		weekDateInput.value=  "";
	
		DateSearch  = "" ;             // row4 的值全部清空，包含全局变量
		Intervalday =  "" ;
		AnkiFrequncey = "" ;
		inputChineseSearch.value = "" ;
		inputDateBlockFilter.value  = "" ;
		inputDateAnkiFilter.value   = "" ;
	
		pageNum = 1; 
		PreparePageDataArray();
		fy ();
			}, 100);

	// row-3-05  Day-End- 起点打包
 	     const debouncedUpdateEnd = debounce ((value) => {    
	     ContainerEndDateValue = value;

	     ContainerMonthDateValue  =  "";
	     ContainerWeekDateValue =  "";

	     monthDateInput.value= "";
	     weekDateInput.value=  "";


	     DateSearch  = "" ;
	     Intervalday =   "" ;
	     AnkiFrequncey = "" ;
	     inputChineseSearch.value = "" ;
	     inputDateBlockFilter.value  = "" ;
	     inputDateAnkiFilter.value   = "" ;


	     pageNum = 1; 
	     PreparePageDataArray();
	     fy ();
		}, 100);
	
   // Row 04 排 -  日期中文搜  | 时间块 | Anki | 清空  
  
    // row-4-01  日期-中文搜索
		const debouncedUpdateChineseSearch= debounce ((value) => {    
	    DateSearch  = value;           // 自己值更新到全局变量
	    Intervalday   = "" ;           // 其他全局变量，都要清空，因为是相斥关系 
	    AnkiFrequncey   = "" ;

	    inputDateBlockFilter.value  = "" ;   // 另外 2 个要清空，因为是相斥关系 
	    inputDateAnkiFilter.value   = "" ;

	    startdateInput.value = "";
	    enddateInput.value = "";
	    monthDateInput.value= "";
	    weekDateInput.value=  "";

	    ContainerStartDateValue = "";
	    ContainerEndDateValue  =  "";
	    ContainerMonthDateValue  =  "";
	    ContainerWeekDateValue =  "";

	    pageNum = 1; 
	    PreparePageDataArray();
	    fy ();
		}, 100);

	// row-4-02  时间块搜索
	 	const debouncedUpdateBlockFilter  = debounce ((value) => {    
	    Intervalday = value;
	    DateSearch  = "" ;
 	    AnkiFrequncey   = "" ;        
 	    inputChineseSearch.value = "" ;
 	    inputDateAnkiFilter.value   = "" ;

	    startdateInput.value = "";
	    enddateInput.value = "";
	    monthDateInput.value= "";
	    weekDateInput.value=  "";

 	    ContainerStartDateValue = "";
 	    ContainerEndDateValue  =  "";
  	    ContainerMonthDateValue  =  "";
 	    ContainerWeekDateValue =  "";

	    pageNum = 1; 
	    PreparePageDataArray();
	    fy ();
		}, 100);

	// row-4-03  Anki 频率
		const debouncedUpdateAnkiFilter  = debounce ((value) => {    	    
	    AnkiFrequncey = value;

	    DateSearch  = "" ;
	    Intervalday = "" ;
	    inputChineseSearch.value = "" ;
	    inputDateBlockFilter.value  = "" ;

	    startdateInput.value = "";
	    enddateInput.value = "";
	    monthDateInput.value= "";
	    weekDateInput.value=  "";

	    ContainerStartDateValue = "";
	    ContainerEndDateValue  =  "";
	    ContainerMonthDateValue  =  "";
	    ContainerWeekDateValue =  "";
	    pageNum = 1; 
	    PreparePageDataArray();
	    fy ();
		}, 100);
	
	// row-4-04  清空按钮
 	   const debouncedUpdateClearRowFour = debounce ((value) => {   
 	    
	   dateFilterBy = " 修改时间 "; 	   
	   DateSearch =  "";
	   Intervalday   = "" ;
	   AnkiFrequncey   = "" ;

	   selectDateSortBy.value = "创建时间" ;
	    
	   inputChineseSearch.value = "" ;
	   inputDateBlockFilter.value  = "" ;
	   inputDateAnkiFilter.value   = "" ;

	   startdateInput.value = "";
	   enddateInput.value = "";
	   monthDateInput.value= "";
	   weekDateInput.value=  "";

	   ContainerStartDateValue = "";
	   ContainerEndDateValue  =  "";
	   ContainerMonthDateValue  =  "";
	   ContainerWeekDateValue =  "";

	    pageNum = 1; 
	    PreparePageDataArray();
	    fy ();
		}, 100);

   // Row 05 排 -  Heder | SortString+Asc\desc | SortDate | PageSize | 
  
    // row-5-01  Header 表头   --- 没加防抖哈，就是勾选表头，没必要   


	// row-5-02 - HeaderCtrol  表头控制  
	   const   debouncedUpdateHeaderCtrol   = debounce((value) => {
		HeaderKeyFilterSwitch = getHeaderControlChange(value);
		pageNum = 1; 
		PreparePageDataArray();
		fy();
		}, 100);

	// row-5-03 - GroupCtrol  分组控制       
		const    debouncedUpdateGroupCtrol  = debounce((value) => {
		GroupByKeyShowSwitch   = getGroupByKeyShow(value);
		pageNum = 1; 
		PreparePageDataArray();
		fy();
	    }, 100);

	// row-5-04 - GroupBy 按什么分组  
		const    debouncedUpdateGroupBy  = debounce((value) => {
		GroupBy    =  getGroupBy(value);
		pageNum = 1; 
		PreparePageDataArray();
		fy();
	    }, 100);

	// row-5-05 -  GroupOrder  →  组的排序方向 asc | desc   	
		const       debouncedUpdateGroupOrder    = debounce((value) => {
		GroupOrder   = getSortOrder(value);
		pageNum = 1; 
		PreparePageDataArray();
		fy ();
	    }, 100);

    // row-5- 06 -  组内 按什么排序 ？  →    
	    const  debouncedUpdateLineSortBy    = debounce((value) => {
		SortBy   = getLineSort(value);
		pageNum = 1; 
		PreparePageDataArray();
		fy ();
	    }, 100);

    // row-5-  07 -  Line 分组的组内 →   排序方向 →    asc | desc  
        const   debouncedUpdateLineSortOrder    = debounce((value) => {
		SortOrder  = getSortOrder(value);
		pageNum = 1; 
		PreparePageDataArray();
		fy ();
		}, 100);

	// row-5-06  清空排序
		const debouncedUpdateClearSort= debounce ((value) => {    

			const checkboxes = document.querySelectorAll(`.${className}-Header-Option-checkbox`);
			checkboxes.forEach(checkbox => {
			    checkbox.checked = false;
			    const header = checkbox.value;
			    const index = FloatHeaders.indexOf(header);
			    if (index > -1 && !["link"].includes(header)) {
			        FloatHeaders.splice(index, 1);
			    }
			});

			


			HeaderKeyFilterSwitch = "不筛选-只展示"; 
			GroupByKeyShowSwitch = "微观-分组-展示-key"; 
			GroupBy = "⛔不分组"; 
			SortBy =  "⛔不排序";
			
			selectHeaderCtrol.value  = "👁️‍🗨️不筛-只展示";
			selectGroupCtrol.value  =  "👁️‍🗨️💧显示分组";
			selectGroupBy.value  =     "⛔不分组" ;
			selectLineSortBy.value  =    "⛔不排序"  ;
	
		    pageNum = 1; 
		    PreparePageDataArray();
		    fy ();
			}, 100);



	// row-5-07  页面 pageSize
		const debouncedUpdatePageSize = debounce ((value) => {
   		 // 确保值不等于 0
	    PageSize = value !== 0 ? value : 10;
	    pageNum = 1; 
	    PreparePageDataArray();
	    fy ();
		}, 100);

   // Row 06 排  -- 补充的  - 那个内容搜索的  

	   // 文本搜索框的防抖函数
		   const debouncedUpdateInputContent = debounce(async (value, app) => {
		       ContentSearch = value;
		       //dv.paragraph(` ${ContentSearch}`);
		       filteredPageDataArray = dv.pages().file.array();
		       //dv.paragraph(`更新前，filteredPageDataArray 的长度: ${filteredPageDataArray.length}`);
		       filteredPageDataArray = await ContentFilter(filteredPageDataArray, ContentSearch, app);
		       //dv.paragraph(`更新前后的，filteredPageDataArray 的长度: ${filteredPageDataArray.length}`);
		       pageNum = 1; 
		       PreparePageDataArray();
		       fy();
		   }, 100);
		   
	   // 清空按钮的 防抖函数，清空内容搜索的
	   const debouncedUpdateClearContent = debounce (async () => {
	       ContentSearch = "  ";  			
	       inputFieldContent. value = "";
	    
	       filteredPageDataArray = dv.pages().file.array();
	       filteredPageDataArray = await ContentFilter(filteredPageDataArray, ContentSearch);
	    
	       pageNum = 1; 
	       PreparePageDataArray();
	       fy ();
    	}, 100);


