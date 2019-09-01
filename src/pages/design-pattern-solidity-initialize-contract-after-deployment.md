---
title: 'Design Pattern Solidity: Initialize Contract after Deployment'
date: 2019-09-01T04:03:08.341Z
description: Initialize Contract after Deployment
featuredImage: ../../static/img/initialization.png
---
There are a few reasons why you might want to initialize a contract after deployment and not directly by passing constructor arguments. But first let's look at an example:

```javascript
contract MyCrowdsale {
  uint256 rate;

  function initialize(uint256 _rate) public {
    rate = _rate;
  }
}
```

What's the advantage over `constructor(uint256 _rate)`?

* Deployment and configuration does not need to happen at the same time. This can be useful when your workflow requires it.
* Easier [Etherscan verification](https://etherscan.io/verifyContract) as you do not have to deal with messy constructor arguments.
* Can be used to avoid the 'Stack too deep, try removing local variables' error when passing more than 13 variables.

## Avoid multiple initializations

Make sure though that you do not allow multiple initializations. For just a few parameters, simply add a check for each parameter, e.g., `require(rate == 0)`. For many parameters, add an `isInitialized` boolean state variable:

```javascript
contract MyContract {
  bool isInitialized = false;

  function initialize(
    uint256 _param1,
    uint256 _param2,  
    uint256 _param3,
    address _param4,
    address _param5,
    bytes32 _param6,
    bytes32 _param7
  ) public {
    require(!isInitialized, 'Contract is already initialized!');
    isInitialized = true;

    param1 = _param1;
    ...
    param7 = _param7;
  }
}
```
