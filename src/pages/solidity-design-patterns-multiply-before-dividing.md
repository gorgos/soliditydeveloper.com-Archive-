---
title: 'Solidity Design Patterns: Multiply before Dividing'
date: 2019-07-21T05:38:50.721Z
description: 'Solidity Design Patterns: Multiply before Dividing'
featuredImage: ../../static/img/1_avngzc02zxtmhpdawpuzmg.png
---
There has been a lot of progress since the beginning of Ethereum about best practices in Solidity. Unfortunately, I have the feeling that most of the knowledge is within the circle of experienced people and there aren’t that many online resources about it. That is why I would like to start this tutorial series called _Solidity Design Patterns_.

We are going to start it off by one straight-forward about math. I hope everybody is using [SafeMath](https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/math/SafeMath.sol) or something similar by this point in time. Nonetheless, there are still things to consider.

Do your multiplication before division!

This one is actually even true in JavaScript. To see why this is important, open up your browser console and type

```javascript
console.log((30 * 100 * 13) / 13)
< 3000
```

Now, let’s do the division first. After all, `abc/c == a/c * bc` , right?

```javascript
console.log((30 / 13) \* 100 \* 13)
< 2999.9999999999995
```

Now in the case of JavaScript, this is due to [floating point errors](https://en.wikipedia.org/wiki/Floating_point_error_mitigation). In Solidity we don’t have floating points, but instead we get rounding errors. The second operation in Solidity would actually yield 2999.

By doing all our multiplications first, we mitigate rounding related issues as much as possible. The computations can be much more complex and forming them into a multiplication first formula can be challenging at times.

![watch_out](/img/1_avngzc02zxtmhpdawpuzmg.png)

## Not always sufficient!

Sometimes this is not good enough. If we are computing pay-outs for Ether, then it is most probably fine. After all, who cares about missing out on a single Wei in payment? As long as the computations are consistent and you’re not relying on all payout summing up to exactly the same amount of Wei as expected, you are fine.

This does not mean that it is always fine. Depending on your use case, you might want to favor an implementation using a numerator and denominator.

```javascript
uint256 numerator = 30 \* 100 \* 13;
uint256 denominator = 13;
```

You can always store the number pair and do your computations according to proper math. In most cases, having a number rounded down will be fine though. Just know that this can happen and deal with it when you have to.
