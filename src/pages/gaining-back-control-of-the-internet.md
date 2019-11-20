---
title: Gaining back control of the internet
date: 2019-11-20T04:11:16.352Z
description: Ocelot
featuredImage: ../../static/img/cloud-blockchain.jpg
---
I recently came across a new project that wants to completely redefine the way we are using the internet. Or rather, the way we are using its underlying infrastructure which ultimately is the internet. Along the way, you will also learn how to get anonymous cloud machines and how to avoid the hassle with MetaMask for users.

Sounds interesting? It is!

## The reality of internet today

![cloud_2019](/img/cloud.jpg "The internet marker shares 2019")

You can see that, if you like it or not, more than half of the cloud market today is owned by just three companys: Amazon, Microsoft and Google. This situation is not likely going to change. And with the cloud market itself growing more and more, the internet itself will essentially be in the control of three companys.

## Crypto to the rescue

But wait, don't we have have this amazing decentralized technology? An internet where there is no central control. A space of piece, privacy and fairness. Yes, we do, but what good is that if 33% of all websites are hosted on AWS anyways? And even worse, the architecture of this great new decentralization is still just reliant on AWS, e.g., [Infura](https://infura.io/) which is using AWS currently. Or think into the future of ETH2.0 and the new [VDF ASIC's](https://vdfresearch.org/). Now imagine Amazon having a bunch of ASIC's around and offering those as another VDF service on AWS.

## So no rescue?

The reality is that these cloud services won't go anywhere, but we can still use blockchain technology for the rescue!

[This presentation](https://www.youtube.com/watch?v=DNwIY1FpERs) by Lon Lundgren at San Francisco Blockchain Week explains the core idea of [Ocelot](https://ocelot.net/) and a pretty cool new project they built on top of it. The project is called [Burner Machine](http://burnermachine.com/) and allows you to get an anonymous cloud machine for three hours for just one USD. Thanks to using the Ocelot technology, this all happens

* without any server storing any of your data
* all communication being encrypted
* not even a need for MetaMask

![possible](/img/possible.jpg)

More power to you, the user. It is all thanks to the browser. In fact, the only time you communicate with an Ocelot server is to download the frontend. After that, you just send new requests to the control service smart contract which in turn is being read by a service starting and managing cloud machines. This service is itself hosted on the cloud and constantly self-replicates to new cloud machines, effectively making it decentralized and impossible to shutdown.

When sending your request to the smart contract, your browser generates a public key that is send along with it. This key is used by the controller service to encrypt all communication with you, so that only you are able to get access to the burner machine.

## And no MetaMask?

Another cool trick is that you do not even require MetaMask if you pay in ETH. This is the first time I came across this and thought it is really cool. You get an address presented and you can send the ETH to this address by whatever means you want. But how is the data passed to the smart contract if you only send ETH? 

Once again, the browser is there to help us. The address you sent ETH to was actually an auto-generated one by the browser. The browser constantly checks if you sent any ETH to this address. Once it detects ETH on the address, it can simply automatically send out a new transaction with all required data. No further user interaction is required. We might be seeing more services using this trick in the future. Simple, elegant and secure.

## The future

I hope these burner machines are just the beginning. The underlying technology has a lot of potential. It can eventually integrate all the big cloud services. And yes, the servers will still be owned by Amazon, Microsoft and Google. This is a reality we cannot change, but we can use blockchain to give more control and power to the user. And ultimately, we might even be able to truly decentralize cryptocurrencies itself by running a decentralized Infura service using Ethereum nodes hosted in this manner.
