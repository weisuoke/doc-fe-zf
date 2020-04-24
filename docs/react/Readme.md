# 珠峰架构 React





```js
function getBrowserNameAndVersion(){
	 var agent = navigator.userAgent.toLowerCase();
	 var regStr_ie = /msie [\d.]+/gi ;
	 var regStr_ff = /firefox\/[\d.]+/gi
	 var regStr_chrome = /chrome\/[\d.]+/gi ;
	 var regStr_saf = /safari\/[\d.]+/gi ;
	 var browserNV = "";
	 //IE
	 if(agent.indexOf("msie") > 0)
	 {
		 browserNV = agent.match(regStr_ie) ;
	 }
	 //firefox
	 if(agent.indexOf("firefox") > 0)
	 {
		 browserNV = agent.match(regStr_ff) ;
	 }
	 //Chrome
	 if(agent.indexOf("chrome") > 0)
	 {
		 browserNV = agent.match(regStr_chrome) ;
	 }
	 //Safari
	 if(agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0)
	 {
		 browserNV = agent.match(regStr_saf) ;
	 }
	 browserNV = browserNV.toString();
	 //other
	 if(""==browserNV){
		 browserNV  = "Is not a standard browser";
	 }
	 //Here does not display "/"
	 if(browserNV.indexOf('firefox')!= -1 || browserNV.indexOf('chrome')!= -1){
		 browserNV = browserNV.replace("/","");
	 }
	 //Here does not display space
	 if(browserNV.indexOf('msie')!= -1){
		//msie replace IE & trim space
		browserNV = browserNV.replace("msie","ie").replace(/\s/g,"");
	 }
	 //return eg:ie9.0 firefox34.0 chrome37.0
	return browserNV;
}
```

