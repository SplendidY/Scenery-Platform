git下载与一些配置：https://blog.csdn.net/m0_46278037/article/details/118815158  
vue3学习：https://cn.vuejs.org/guide/introduction.html  
vue目录文件解释：https://blog.csdn.net/Jo_liver/article/details/135392995 很多应该用不到  
github分支使用：（大家在写代码前 先git pull origin master 这样可以获取最新的master从而减少冲突）
经过一堆尝试终于试出来了 大家可以自己复制粘贴试一下   
首先在项目code页面中增加一个分支名为test，然后打开vscode，git clone...  
git init  再cd project1  
git checkout -b test  
git checkout test  
git fetch获取所有分支  
git branch --set-upstream-to=origin/test(这步建立了连接）  
然后可以开始修改了  随便改一下代码 #（改）····· 
git add .  
git commit -m "xxx"  
git push  
到这步你已经将修改上传到你的分支里了 下面是上传到master分支的步骤  
git checkout master  
git pull origin master（这步是为了防止你在修改代码的时候别人也修改并提交了，获取最新的master）  
git merge test  (合并) (i)  
git push  
就好了 
冲突的原因就是 你pull过来的master跟远程现在的master不一样（被别人改了）  
注意git checkout master这步以及以后的几步 要确认你的代码基本无误之后 再进行  
下载方式：  
先用vscode打开一个空文件夹  
终端输入git clone https://github.com/SplendidY/project1.git  

打开方式：
cd backend   
   
conda activate xxx   
   
python user.py   
   
cd frontend

npm install  
  
npm run dev 
  
(i)  
经过好多好多次尝试  
在冲突的时候会出现一个让你修改的界面（vscode）  
然后就根据显示的修改冲突就好  
然后再次git add/commit/push就好啦！！！  
