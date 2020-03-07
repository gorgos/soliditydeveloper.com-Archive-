---
title: Avoiding out of gas for Truffle tests
date: 2020-03-07T03:03:12.039Z
description: avoid-truffle-out-of-gas
featuredImage: ../../static/img/truffle.png
---
You have probably seen this error message a lot of times:

```
Error: VM Exception while processing transaction: out of gas
```

**Disclaimer**_: Unfortunately, this does not always actually mean what it is saying when using_ [_Truffle_](https://www.trufflesuite.com/)_, especially for older versions. It can occur for various reasons and might be difficult to solve. This will not be part of this article._

We will talk about the actual case of running out of gas in Truffle tests. In most cases you will not care about gas when writing unit tests, so I recommend ignoring it. And there is a simple solution for that:

* Set the `gasPrice` for each transaction to `0`!

You can either do that [manually](https://www.trufflesuite.com/docs/truffle/getting-started/interacting-with-your-contracts#making-a-transaction) for each transaction by passing the option `{ gasPrice: 0 }` along. Or you can set the [defaults](https://github.com/trufflesuite/truffle/tree/master/packages/contract#mycontractdefaultsnew_defaults) for a contract to use a gas price of 0:

```javascript
MyContract.defaults({
    gasPrice: 0,
})
```

This will not only be useful for avoiding out of gas errors, but it will also help when verifying ETH balances. Now you will not have to use complicated math to figure out the gas costs with [estimateGas](https://web3js.readthedocs.io/en/v1.2.0/web3-eth-contract.html#methods-mymethod-estimategas), multiplying it with the gas price and subtracting it from the expected ETH balance.

## Some exceptions

Sometimes you may actually want to test the gas logic. I have never needed this myself, but I can imagine scenarios where you want to verify that transactions will not cost above a certain threshold.

Do you have more examples for exceptions? Please leave a comment below.
