---
title: 'Design Pattern Solidity: Stages'
date: 2020-02-22T06:12:30.258Z
description: 'Design Pattern Solidity: Stages'
featuredImage: ../../static/img/stages.jpg
---
Closely related to the concept of finite-state machines, this pattern will help you restrict functions in your contract. You will find a lot of situations where it might be useful. Any time a contract should allow function calls only in certain stages.

Let's look at an example:

```javascript
contract Pool {
  enum Stages {
        Initialize,
        Contribute,
        Collect,
  }
  
  Stages public stage = Stages.Initialize;

  modifier atStage(Stages _stage) {
        require(
            stage == _stage,
            "Wrong pooling stage. Action not allowed."
        );
        _;
   }

  function init(...) external atStage(Stages.Initialize) {
        ...
        currentStage = Stages.Contribute;
  }

  function contribute(...) external atStage(Stages.Contribute) {
        ...
        if (hasContributionThresholdReached) {
            currentStage = Stages.Collect;
        }
  }

  function collect(...) external atStage(Stages.Collect) { }
}
```

The pooling contract has three stages:

1.  The administrator has to set the parameters using `init()`.
2.  Users contribute funds to the pool using `contribute()`.
3.  Once sufficient funds are collected, the pool automatically goes into the last stage which then allows users to receive their share of whatever was purchased by the contract using `collect()`.

The staging system keeps a clear separation and access control of functions. Further, having a public `stage` variable makes it clear for the user as well.
