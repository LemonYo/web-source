# 如何管理自己的ssh Key

添加 ssh key 可以减除代码提交所带来的账号验证的麻烦

## 1.查看本机的ssh key

ssh key 通常所在的目录在 C:/user/yourName/.ssh

你可以通过命令行来查看

`cd ~/.ssh`

![avatar](https://raw.githubusercontent.com/LemonYo/web-source/master/doc_source/156257934.jpg)

## 2.如何生成一个ssh key

打开命令行 或者 git bash 键入：

`ssh-keygen -t rsa -C "your_email@example.com"`

这个时候会让你输入文件的路径和文件的名字，默认的情况是生成 /users/your_name/.ssh/id_rsa 文件 和  /users/your_name/.ssh/id_rsa.pub  带有.pub是公钥，不带的是私钥。你也可以生成相同路径的 不同文件。例如 /user/your_name/id_rsa_mock


## 3.添加新生成的ssh key 到 ssh agent

因为SSH默认只读取id_rsa,为了让SSH识别新的私钥,需要使用命令将其添加到SSH agent,命令如下：

`ssh-add ~/.ssh/id_rsa`

`ssh-add ~/.ssh/id_rsa_github`

> 若执行ssh-add时提示“Could not open a connection to your authentication agent”,则执行下面的命令： `ssh-agent bash` 然后再运行ssh-add命令(可以通过ssh-add -l查看私钥列表)；

## 4. 同时管理 多个ssh key

在 .ssh 目录下新建config文件

```
  # gitlab
　　Host gitlab.com
  　HostName gitlab.com
    PreferredAuthentications publickey
  　IdentityFile ~/.ssh/id_rsa　　　　　　　　
　# GitHub
　　Host github.com
  　HostName github.com
  　PreferredAuthentications publickey
  　IdentityFile ~/.ssh/id_rsa_github

```

## 5.测试

`ssh -T git@github.com`

输出：Hi user! You've successfully authenticated, but GitHub does not provide shell access. 就表示成功的连上github了

## 6.将公钥 添加到自己的github 或者gitlab 上
