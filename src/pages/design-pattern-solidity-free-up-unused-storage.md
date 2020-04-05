---
title: 'Design Pattern Solidity: Free up unused storage'
date: 2020-04-05T00:58:46.046Z
description: Free up unused storage
featuredImage: ../../static/img/garbage.jpg
---
You may or may not be used to a [garbage collectors](https://en.wikipedia.org/wiki/Garbage_collection_(computer_science)) in your previous programming language. There is no such thing in Solidity and even if there was a similar concept, you would still be better off managing state data yourself. Only you as a programmer can know exactly which data will not be used in the future anymore.

You may be wondering '**Why should I care?**'. Let us take a look at the reasons for releasing unused data.

### 1. Gas costs

The obvious is answer is that you can receive gas refunds for releasing unused storage. In the [yellow paper](https://ethereum.github.io/yellowpaper/paper.pdf) on page 25 '*Appendix G. Fee Schedule'*, you can read the gas costs for each instruction. As you might know, `SSTORE` will generally create the most costs in your contracts with a significant cost of 20,000 gas per instruction. On the contrary, if you look at `R_sclear`:

> Refund given when the storage value is set to zero from  non-zero.

15,000 gas refund means you can actually get 75% of your storing costs back! That is a large amount, do not forget about this. And the solution is simple, just set a value back to 0 once you are sure it will not be used anymore. 

### 2. Network bloating

If the gas costs did not convince you, I hear you. It seems like a design flaw in Ethereum that you can just store data and leave it there forever without ever paying for it again. But that does not mean should store everything forever. Storing useless data only forces every Ethereum node to store your data for all eternity. What a waste of resources!

In fact, new rental models have been [discussed](https://eips.ethereum.org/EIPS/eip-1418), even sophisticated methods [including revival methods](https://ethresear.ch/t/improving-ux-for-storage-rent/399). I do not see those coming any time soon (within the next 1-2 years), but if your contract should be as future-proof as possible, you better keep your storage usage low!

## How to free up unused data

Now to the practical part. Freeing up data is really easy and there is even a special keyword [delete](https://solidity.readthedocs.io/en/latest/types.html#delete) in Solidity to help you.

#### Deleting simple types

For simple types like integers, it does not really matter if your write `delete myInteger` or `myInteger = 0`. It will have the same effect. Depending on the context, you may choose one way over another. Generally, if it is about some calculations `= 0` is easier to read and if it is only about freeing up storage `delete` will be easier to read.

#### Deleting arrays

But for deleting arrays, you always want to use `delete`. It will automatically create an array of length 0 for dynamic arrays or set each item of the array to 0 for static arrays. If you want to delete just a single item like `delete myArray[index]`, you should be aware that this will create a gap in the array. To avoid the gap and if you do not care about the order of the items, what you can do instead is `myArray[index] = myArray[myArray.length - 1];` followed by `myArray.pop()`. Pop removes the last element and also implicitly calls delete on the removed element.

#### Deleting structs

Instead of having to write `myStructInstance = new MyStruct(0,0,address(0))`, you can just write `delete myStructInstance`. It will automatically clear out each entry of your struct with one exception:

#### Deleting mappings

If you have a mapping in a struct or in your state in general, Solidity cannot delete it, because it does not know the keys for the mapping. Since the keys are arbitrary and not stored along, the only way to delete structs is to know the key for each stored value. A value can then be deleted by `delete myMapping[myKey]`.