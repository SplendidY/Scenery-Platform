git下载与一些配置：https://blog.csdn.net/m0_46278037/article/details/118815158  
vue3学习：https://cn.vuejs.org/guide/introduction.html  
vue目录文件解释：https://blog.csdn.net/Jo_liver/article/details/135392995 很多应该用不到  
github分支使用：  
经过一堆尝试终于试出来了 大家可以自己复制粘贴试一下   
首先在项目code页面中增加一个分支名为test，然后打开vscode，git clone...  
git init  再cd project1
git checkout -b test  
git checkout test  
git fetch  
git branch --set-upstream-to=origin/test(这步建立了连接）  
然后可以开始修改了  随便改一下代码  
git add .  
git commit -m "xxx"  
git push  
git checkout master  
git pull origin master（这步是为了防止你在修改代码的时候别人也修改并提交了，获取最新的master）  
git merge test  
git push origin master  
就好了  
注意git checkout master这步以及以后的几步 要确认你的代码基本无误之后 再进行  
下载方式：  
先用vscode打开一个空文件夹  
终端输入git clone https://github.com/SplendidY/project1.git  

打开方式：

cd frontend

npm install  
  
npm run dev 
