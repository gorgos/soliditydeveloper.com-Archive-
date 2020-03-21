---
title: How to setup Solidity Developer Environment on Windows
date: 2020-03-21T01:28:51.844Z
description: How to setup Solidity Developer Environment on Windows
featuredImage: ../../static/img/windows.jpg
---
Using Windows for development, especially for Solidity development, can be a pain sometimes, but it does not have to be. Once you have configured your environment properly, it can actually be extremely efficient and Windows is a very, very stable OS, so your overall experience can be amazing. The biggest frustration comes from the initial setup, but with this help, I hope you will manage to do so with ease. Let us get started!

## Installing Truffle and Web3 on Windows

First you want to make sure to install truffle along with its [Web3](https://github.com/ethereum/web3.js/) dependency. This will be an extremely helpful tool to get you started.

* Install [Git Bash](https://gitforwindows.org/)
* Install [Node](https://nodejs.org/en/download/)
* Install [Python 2.7.17](https://www.python.org/downloads/release/python-2717/)
* Install [Microsoft Visual Studio 2015 Community](https://go.microsoft.com/fwlink/?LinkId=532606&clcid=0x409)
* Open the command prompt as Administrator:
  * `setx PYTHON C:\Python27\python.exe /m`
* Open a new command prompt:
  * `npm install -g node-gyp`
  * `npm install -g windows-build-tools`
  * `npm install -g truffle`

In case the last command fails, you can try `npm rebuild node-gyp` to fix it. This will also install Web3 on your machine. Congratulations if you had success, this was one of the most difficult things for me when switching to Windows.

## Installing Netcat for test script

This tip will be helpful later on, once you are up and actively developing with Truffle. Running unit tests on Truffle's ganache can be an unpleasant experience. Using a [test script](https://github.com/OpenZeppelin/openzeppelin-test-helpers/blob/abf4d815e6a54f95599284f7df0f17592d0441b2/scripts/test.sh) can simply things immensely. However, the `nc` command will not work on your Windows machine. Luckily, there is a [netcat for Windows](https://eternallybored.org/misc/netcat/) version available. Download and extract to a local folder and make sure to [add that folder to your system PATH](https://www.architectryan.com/2018/03/17/add-to-the-path-on-windows-10/).

## Install Conemu

You can use Git Bash if you want. However, my personal favorite terminal on Windows is [Conemu](https://conemu.github.io/). It has a ton of extra features, yet is still easy to use. You will have to [configure it for Git Bash](https://superuser.com/a/454381) initially, but this can easily be done.

## Install VS code + Solidity extension

Hands down the best IDE for Solidity and web development for me is [VS Code](https://code.visualstudio.com/), so many features, themes, extensions while having the best overall user experience. You can choose whatever editor you want, but this one works really well for me. There is an actively maintained [Solidity extension](https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity) available which will make your life much easier.

## Further useful tools

Not only for Windows, but useful tools in general are

* [Ethlint](https://github.com/duaraghav8/Ethlint) (formely solium) or [Solhint](https://github.com/protofire/solhint) as Solidity code linters
* [solidity-coverage](https://github.com/sc-forks/solidity-coverage)
* [buidler](https://github.com/nomiclabs/buidler)
* [eth-gas-reporter](https://github.com/cgewecke/eth-gas-reporter)

Have a look and play around with them. I definitely recommend to use a linter.



There you have it, Solidity development on Windows can be a surprisingly pleasant experience. You do not have to follow every step in this list, but pick and choose what you want. And happy buidling!
