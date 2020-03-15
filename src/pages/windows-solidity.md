---
title: Windows Solidity
date: 2020-03-21T01:28:51.844Z
description: How to setup Solidity Developer Environment on Windows
featuredImage: ../../static/img/windows.jpg
---
## Installing Truffle and Web3 on Windows

* Install [Git Bash](https://gitforwindows.org/)
* Install [Node](https://nodejs.org/en/download/)
* Install [Python 2.7.17](https://www.python.org/downloads/release/python-2717/)
* Install [Microsoft Visual Studio 2015 Community](https://go.microsoft.com/fwlink/?LinkId=532606&clcid=0x409)
* Open the command prompt as Administrator:
  * `setx PYTHON C:\Python27\python.exe /m`
* Open a new command prompt:
  * `npm install -g node-gyp`
  * `npm install -g windows-build-tools`
  * `npm install -g truffle`

In case the last command fails, you can try `npm rebuild node-gyp` to fix it. This will also install web3 on your machine. Congratulations if you had success, this was one of the most difficult things for me when switching to Windows. 

## Installing Netcat for test script

akjdasd

## Install Conemu

asdnjksad

## Install VS code + Solidity extension

asndjkasd

## Further useful tools

* Solium
* Solhint
* solidity-coverage
* buidler
* gastracker
