//设计“word对象”的数据结构，并用对象的方法实现初步的代码组织
//en6为全局变量，由大学英语6级词汇形成字符串，组成数组
var MAX = 10;
var myWord = {
   id: 0,
   en: "",
   pn: "",
   cn: "",
   getWord: function (id) {
      if(id>-1 && id<en6.length){   
         this.id = id;
         var word = en6[id].split("/");
         this.en = word[0];
         this.pn = "/" + word[1] + "/";
         var i = 2;
         this.cn = "";
         while(word[i] != undefined)
            this.cn += word[i++];
      }else{
         this.en = "";
         this.pn = "";
         this.cn = "";
      }
      
      return this;
   },//end of getWord Method
   showWord: function () {
      if(this.en != ""){
         document.getElementById("en").value = this.en;
      }
      document.getElementById("pn").textContent = this.pn;
      document.getElementById("cn").textContent = this.cn;
      return this;
   } //end of showWord Method
};//end of myWord Object

//建立一个模型对象，模拟和记录APP的运行状态
var Model = {
   learnWords: [], //学习单词的id组成的数组
   learnId: 0,
   myButton: "",
   myImages: null,
   showHelp: function () {
      var textInfo = document.getElementById("textInfo");
      var tips = "共" + MAX + "个单词,";
      switch(this.myButton){
         case "read":
            if(this.learnId < MAX){
               tips += "当前第" + (this.learnId+1) + "个";
            }else{
               tips += "读一读已完成";
            }
            break;
         case "write":
            if(this.learnId<MAX){
               tips += "当前第" + (this.learnId+1) + "个,完成拼写进入下一个";
            }else{
               tips += "写一写已完成";
            }
            break;
         case "select":
            if(this.learnId<MAX){
               tips += "当前第" + (this.learnId+1) + "个,选对进入下一个";
            }else{
               tips += "选一选已完成";
            }
            break;
         case "search":
            break;
         case "listen":
            TODO:listen提示信息
            break;
      }
      textInfo.textContent = tips;
      
      


      
   },//End of showHelp
}; //End of  Model 

//每次循环产生MAX个随机单词放在 Model 模型中


window.onload = function () {
   //动态控制UI，包括：不同屏幕的字体大小设置，主区域的高度设置
   var fontSize = Math.floor(window.innerWidth / 100);
   switch (fontSize) {
      case 15:
      case 14:
      case 13:
      case 12:
      case 11:
      case 10: fontSize = fontSize * 1.5; break;
      case 9:
      case 8:
      case 7: fontSize = fontSize * 2; break;
      case 6:
      case 5:
      case 4: fontSize = fontSize * 2.8; break;
      default: fontSize = fontSize * 4;
   }
   document.body.style.fontSize = fontSize + "px";

   var sectionHeight = window.innerHeight - 150 - 50 - 50;
   document.querySelector("section").style.height = sectionHeight + "px";

   //为所有自定义的按钮设定特殊风格
   var myButtons = document.querySelectorAll("nav span");
   for (var i = 0; i < myButtons.length; i++) {
      myButtons[i].onclick = function () {
         for (var j = 0; j < myButtons.length; j++) {
            myButtons[j].className = "";
         }
         this.className = "onclickStyle";
      };//end of  myButtons[i].onclick
   }

   //每次打开页面，则随机出现一张图片
   var myImages = [];//图像对象 组成的 数组
   for (var i = 1; i < 8; i++) {
      var img = new Image();
      img.src = "images/" + i + ".jpg";
      //img.style.opacity = "0.5" ;
      myImages.push(img);
   }
   Model.myImages = myImages;//把图片集传给Model对象，提供使用
   var backPicDom = document.querySelector("article#help div#backPic");
   var randInt = Math.floor(Math.random() * 7);
   backPicDom.appendChild(myImages[randInt]);


   //随机选择一个单词
   var randInt = Math.floor(Math.random() * en6.length);
   myWord.getWord(randInt);
   myWord.showWord();

   //今日随机单词练习准备
   randomWord();

   //设置input#en 为 只读
   document.getElementById("en").setAttribute("readOnly","readOnly");
   //为按钮绑定点击事件
   document.getElementById("read").onclick = read;
   document.getElementById("write").onclick = write;
   document.getElementById("select").onclick = select;
   document.getElementById("search").onclick = search;
   document.getElementById("listen").onclick = listen;

};//end of window.onload
//-->

//读一读
function read() {
   //设置input#en 为 只读
   document.getElementById("en").setAttribute("readOnly","readOnly");

   //初始化Model
   Model.myButton = "read";
   Model.learnId = 0;

   //初始化读一读界面
   myWord.getWord(Model.learnWords[Model.learnId]);
   myWord.showWord();
   Model.showHelp();
   setHandlerById("word","onclick",function () {
      console.log("read点击事件");
      console.log("read:单词切换");
      Model.learnId++;
      if(Model.learnId < MAX){
         myWord.getWord(Model.learnWords[Model.learnId]);
         myWord.showWord();
      }
      Model.showHelp();
   });
}


//写一写
function write() {
   //设置input#en 为 可写
   var enObj = document.getElementById("en");
   enObj.removeAttribute("readOnly");
   //初始化Model
   Model.myButton = "write";
   Model.learnId = 0;

   //初始化写一写界面
   myWord.getWord(Model.learnWords[Model.learnId]);
   myWord.showWord();
   tips();
   Model.showHelp();


   setHandlerById("word","onclick",function () {
      console.log("write点击事件");
      var answer = enObj.value;
      if(answer == myWord.en){
         console.log("write:单词切换");
         Model.learnId++;
         if(Model.learnId < MAX){
            myWord.getWord(Model.learnWords[Model.learnId]);
            myWord.showWord();
            tips();
         }
         Model.showHelp();
      }
   });
}

//选一选
function select() {
   //设置input#en 为 只读
   var enObj = document.getElementById("en").setAttribute("readOnly","readOnly");

   //清空article#word标签的点击事件
   setHandlerById("word","onclick",null);

   //初始化Model
   Model.myButton = "select";
   Model.learnId = 0;
   Model.showHelp();
   selectShow();

   //
   
}

//搜一搜
function search() {
   //设置input#en 为 可写
   var enObj = document.getElementById("en");
   enObj.removeAttribute("readOnly");

   //清空article#word标签的点击事件
   setHandlerById("word","onclick",null);

   //初始化搜一搜界面
   enObj.placeholder = "输入单词进行搜索";
   enObj.value = "";
   document.getElementById("pn").textContent = "";
   document.getElementById("cn").textContent = "";
   
   //input#en 输入框内的内容改变时进行单词搜索
   setHandlerById("en","onchange",function (){
      var key = this.value.trim();
      var word = "";
      var flag = -1;
      if (key != word){
         for(let i = 0;i<en6.length;i++){
            word = en6[i].split("/")[0];
            console.log("单词对比: " + key + " " + word);
            if(key === word){
               flag = i;
               break;
            }
         }
      }
      myWord.getWord(flag);
      myWord.showWord();
   });


}

//听一听
function listen() {

}

//随机选择单词下标放入model
function randomWord(){
   for(var i = 0;i<MAX;i++)
      Model.learnWords[i] = Math.floor(Math.random() * en6.length);
   Model.learnId = 0;
}

//tips:在写一写中生成不完整单词
function tips(){
   var tips = "";
   var tempWord = myWord.en.split("");
   var length = myWord.en.length;
   for(var i = 0;i<length - Math.floor(length*1/4);i++){
      let randomInt = Math.floor(Math.random()*length);
      tempWord[randomInt] = "_";
   }
   
   for(var i = 0;i<length;i++){
      tips += tempWord[i] + " ";
   }
   var enObj = document.getElementById("en");
   enObj.placeholder = tips;
   enObj.value = "";
}

//给article#word标签设置点击事件
function setHandlerById(id,attr,fun) { 
   var Obj = document.getElementById(id);
   Obj[attr] = null;
   Obj[attr] = fun;
}

function selectShow() {
   myWord.getWord(Model.learnWords[Model.learnId]);
   myWord.showWord();

   var pnObj = document.getElementById("pn");
   var cnObj = document.getElementById("cn");
   var randomInt = Math.floor(Math.random() * en6.length);
   while(randomInt === myWord.id){
      randomInt = Math.floor(Math.random() * en6.length);
   }

   var i = 2;
   var cn1 = "";
   var word = en6[randomInt].split("/");
   while(word[i] != undefined)
      cn1 += word[i++];
   pnObj.textContent = (randomInt %2 === 0) ? myWord.cn : cn1;
   cnObj.textContent = (randomInt %2 === 0) ? cn1 : myWord.cn;
   var f = function () {
      console.log(this.textContent);
      if (this.textContent === myWord.cn){
         Model.learnId++;
         if(Model.learnId<10){
            selectShow();
         }
         Model.showHelp();
      }
   }
   setHandlerById("pn","onclick",f);
   setHandlerById("cn","onclick",f);
}