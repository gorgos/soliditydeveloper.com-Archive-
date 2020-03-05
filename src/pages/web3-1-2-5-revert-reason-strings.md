---
title: 'Web3 1.2.5: Revert reason strings'
date: 2020-01-28T19:37:08.911Z
description: New Web3 version
featuredImage: ../../static/img/web3.jpg
---
A new Web3 version was just released and it comes with a new feature that should make your life easier. With the latest [version 1.2.5](https://github.com/ethereum/web3.js/releases/tag/v1.2.5), you can now see the the revert reason if you use the new [handleRevert](https://web3js.readthedocs.io/en/v1.2.5/web3-eth.html#handlerevert) option.

You can activate it easily by using `web3.eth.handleRevert = true`. Now when you use call or send functions, precisely one of the following:

* `web3.eth.call()`
* `web3.eth.sendTransaction()`
* `contract.methods.myMethod(…).send(…)`
* `contract.methods.myMethod(…).call(…)`

you will see a new message like

```
Error: Your request got reverted with the following reason string: This is the revert reason!\
```

If you have to use `sendSignedTransaction`, that is [not yet implemented](https://github.com/ethereum/web3.js/issues/3345). However, you can work around that by catching a reverted transaction and then calling it.

```javascript
try {
    const result = await sendTxWithSendSignedTransaction()
    console.log({ result })
} catch (error) {
    TestContract.methods.myMethod(myParam).call({
        from,
        value,
    }).then(result => { throw Error('unlikely to happen') })
    .catch(revertReason => console.log({ revertReason }))
}
```

This will hopefully make it a lot easier trying to find out why transactions reverted in a live system. Incorporate this into your error logging system to make the most use of it.
