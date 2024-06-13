# 后端环境管理

使用requirements.txt文件来管理项目的依赖

0.创建并使用自己的环境（注：环境管理方法可以自己定，只要requirement.txt一样就可以了）
这边建议在anaconda cmd里面输入 powershell里面有时候用不了

```bash
cd backend
conda create -n myflaskenv python=3.9
conda activate myflaskenv # 你的环境名
```

1.安装环境依赖项的命令

```bash
pip install -r requirements.txt
```

2.运行flask
   
```bash
flask run
```

3.前后端协同

开两个终端，一个运行前端，一个运行后端，网页只要打开前端的即可

注：如果有新的包加入，可以用以下生成requirement.txt文件的命令更新列表：

```bash
pip install pipreqs
cd ../ #退出到上一级目录，假设你现在正在backend文件夹内
pipreqs backend #扫描backend文件夹中的所有python文件，自动生成requirements.txt
pipreqs backend --force #强行覆盖现有的requirements.txt
pip freeze > requirements.txt
```
