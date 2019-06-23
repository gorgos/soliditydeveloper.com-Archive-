---
title: Randomness and the blockchain
date: 2019-06-23T23:17:50.099Z
description: How to achieve secure randomness for Solidity smart contracts?
featuredImage: ../../static/img/random.png
---
When we talk about randomness and blockchain, these are really two problems:

1. How to generate randomness in smart contracts?
2. How to produce randomness for proof-of-stake (POS) systems? Or more generally, how to produce trusted randomness in public distributed systems?

There is some overlap of course and some approaches for the first problem may also be used for the second one and vice versa. But I can already tell you that the best possible solutions for both questions most likely hasn’t been found yet. The fact of the matter is that these are really important problems, to say it in the words of famous Donald:

> “Random numbers should not be generated with a method chosen at random.” (Donald Knuth)

Why is it so hard? Well, that’s due to the nature of random numbers. One can easily create a seemingly random stream of numbers which follows a certain logic known to an attacker which enables him to predict the numbers.

![random-number-generator](/img/ur4wuq0.gif "Seemingly random numbers again")

Naively, one might propose that each node computes a random number locally. It further broadcasts this random number. Since each node will do the same, one can compute the final random number using a function that takes the previously locally generated numbers as inputs and produces a single output, e.g., v₁ ⊕ v₂ · · · ⊕ vₙ. However, the last node to broadcast his local random number can wait with the generation until he received local numbers from every other node. Subsequently, he can produce any final random number R for the distributed system by picking a local number vₓ = R ⊕ v₁ ⊕ v₂ · · · ⊕ vₙ. Clearly, such a system to produce random numbers is flawed.

We need something better. Stay tuned for detailed descriptions how to tackle these issues. Meanwhile, have a look at [Predicting Random Numbers in Ethereum Smart Contracts](https://blog.positive.com/predicting-random-numbers-in-ethereum-smart-contracts-e5358c6b8620?gi=55eb50efe444). It’s a great start for the first question. And for the second one, there are some interesting ideas out there and some seemingly crazy ones, e.g., the new idea by the Ethereum Foundation to build thousands of ASIC’s to verify VDF’s.

# Random Number Generation for Solidity Smart Contracts #1

By now, most people are aware of the problem that one faces when trying to generate random numbers in a smart contract. There is unfortunately no one-size-fits-all solution for this, so let me go through the existing solutions.

## 

Short Recap of Fails

![not-secure](/img/0secure.jpg)

Let’s briefly look at the common first ideas and why they are bad. I won’t go into much detail here, because others have done a great job of doing so.

## 1. Using block variables

* _`block.number`_: The number of the block.
* _`block.timestamp`_: The timestamp of the block.
* _`block.difficulty`_: The difficulty of the block, i.e., how many trailing zeros are sufficient for a successful new hash.
* _`block.gaslimit`_: The gas limit of the block, i.e., the maximum allowed amount of gas per transaction.
* _`block.coinbase`_: The block miner’s address.

Those are obvious bad choices, because they can be predicted by anyone or at least the miner. Some more easy (`block.number`) than others (`block.difficulty`).

What if we add a private seed to the contract? The resulting random number can be computed with a passed variable and the privately stored seed as inputs. However, this approach does not consider the impossibility to store private data inside a public network. Despite Ethereum having a concept of private memory in smart contracts, this storage can still be read by anyone running an Ethereum node. Reading private or internal state can be achieved by `web3.eth.getStorageAt`. Therefore, it merely increases the effort for someone trying to predict the randomness.

## 2. Using the block hash

Technically also a block variable, but it deserves its own section. A block hash in Ethereum is computed as the Keccak256, an early implementation of SHA-3. It is a one way function, and by requiring a certain amount of trailing zeros as well as the miner’s address as salt, the resulting hash cannot be predicted by anyone. Well, that’s at least the idea.

First, you have to use it right. That means, use a **future block hash**! If you use an old one, people can see it obviously. If you use the current block’s hash, it will be empty, because it hasn’t been mined yet.

**How to use a future block hash?**

```javascript
mapping (address => uint256) gameWeiValues;
mapping (address => uint256) blockHashesToBeUsed;

function playGame() public {
    if (!blockHashesToBeUsed[msg.sender]) {
        // first run, determine block hash to be used                          
        blockHashesToBeUsed[msg.sender] = block.number + 2; // use 2 or more
        gameWeiValues[msg.sender] = msg.value;
        return;
    }

    uint256 randomNumber = uint256(blockhash(blockHashesToBeUsed[msg.sender]));

    blockHashesToBeUsed[msg.sender] = 0;
    gameWeiValues[msg.sender] = 0;

    if (randomNumber != 0 || randomNumber % 2 == 0) {
        uint256 winningAmount = gameWeiValues[msg.sender] * 2;
        msg.sender.transfer(winningAmount);    
    }
}
```

The check for `randomNumber != 0` is essential, because Solidity can only look back at 256 blocks. So if a player waits for more than 256 blocks, he could enforce it to be 0. This has been used to [hack SmartBillions](https://www.reddit.com/r/ethereum/comments/74d3dc/smartbillions_lottery_contract_just_got_hacked/) for example.

**So all good with using the future block hash?**

It depends! Are you allowing gambles with winning amounts higher than the block reward? Then be aware of miner manipulation. If we assume a block reward of 3 ETH, any gamble for more than 6 ETH actually gives miners an incentive to cheat on the gamble. While a miner cannot freely choose the hash for a block, he may choose not to publish a newly found block hash → influence on the randomness.

## 3. Commitment scheme

First versions of the commitment scheme exist since 1981. Have a look a Michael Blum’s [coin flipping over the telephone](https://www.cs.cmu.edu/~mblum/research/pdf/coin/). It’s an interesting read. We can simply use hashes in Solidity. So what’s the idea?

We use the naive idea I described at the beginning:

> 
Each node computes a random number locally. It further broadcasts this random number. Since each node will do the same, one can compute the final random number using a function that takes the previously locally generated numbers as inputs and produces a single output, e.g., v₁⊕ v₂ · · · ⊕ vₙ.

But instead of broadcasting the random number, a node will compute the hash of that number first. This hash will be the _commitment_. It then broadcasts the commitment hash. How does that help?


As the name suggests, a node is then _committed_ to its original secret number, because it’s impossible to find a collision (another number that produces the same hash). Therefore, in the subsequent reveal phase a node cannot change its secret number anymore. Naturally, each node starts with the reveal phase only after having received all other node’s commitments. The procedure will look like this:

1. 
All participants, `P1` … `Pn`, each generate a secret value, `Vi`.
2. `Pi` computes the commitment hash for their secret value: `Ci = H(Vi)`.
3. Each `Pi` sends `Ci` first (instead of `Vi`) .
4. After all `Ci` are received, each Pisends Vi. All participants can verify the receiving secret values by checking if `Ci == H(Vi)`.
5. Once all `Vi` have been revealed and verified, the result of the random number generation will be `R = V1 ⊕ V2 ⊕ … ⊕ Vn`. (XOR)
6. Should one participant fail to reveal his Vi, he automatically looses.

![not-right](/img/not-right.jpeg)

Sounds too good to be true? You’re right. This only works for two nodes, e.g., in a casino with a bank and single player. I have implemented a proof of concept prototype for this in Solidity and AWS Lambda: <https://github.com/gorgos/Highstakes-SmartRoulette>.

Let’s see why this only works for two nodes:

The issue we are facing is the situation where the last node `Pi` has to reveal its value, since it can calculate `R` with its last secret value before anybody else, the **last-revealer-problem**. Thus, it might not be able to influence `R` any more as it is committed to its value `Vi`. However, it may choose not to reveal the value, leaving all other parties no other option than to abort the random number generation. As in the two-user scenario, the not revealing node may loose the gamble. Nevertheless, that is not sufficient this time. Since there may be multiple users behind an entity and only the not-revealing-party looses, an attacker may do the following:

1. Create as many entities as wanted and participate in the gamble with all of them.
2. In the reveal phase, hold back the secret value of his last entity.
3. Wait for every other entity to reveal their value and then compute the final result. If it yields a positive outcome in the sum for all participating entities, choose to reveal the value of the last entity. Otherwise, never reveal the last value. The gamble must be aborted and players will be refunded. The attacker only lost the gamble with a single entity.

**Multi-party commitment scheme
s**

The modification for the multi-party environment is fairly simple, but comes with some major drawbacks.


**Modification:** In addition to their commitments, each participant sends along a pledge. After the reveal phase, the pledge will be refunded to every revealing entity. In case of participants not revealing their value, they not only just loose the gamble, but also their pledge. In such a scenario, the pledges of all not revealing entities are split between all revealing entities or alternatively burned.

**Implication:** Unfortunately, the required pledge sizes can get absurdly high. Given a lottery for 10,000 participants, a ticket fee of 4 USD and a single winner, every participant would be required to pledge almost 400 million USD when refunding the pledges to the participants (feel free to do the math).

Alternatively, the pledges can be burned (Refunding them to the bank, the random number service, charity or some other third party poses the risk of cheating from the receiving party). Burning pledges reduces the necessary pledge size down to 39,992 USD for our lottery example which is still too high for most practical use cases.

A [similar implementation](https://github.com/randao/randao) exists, but has not been used in practice as of this date. Randao will also be used in ETH2.0 as base random beacon topped with VDF’s (verifiable delay functions). We can discuss the usage in ETH2.0 in more detail in a later post.

## Conclusion

We have looked at two methods for multi-party randomness in Solidity. While the blockhash if used correctly, works nicely in many scenarios, it does not perform well when there is much at stake which would allow miners to cheat. Secondly, the commitment approach is very useful for two-player scenarios. Unfortunately for multi-player situations for most real-world use cases, it will not suffice. What can we do then? One option might be using an oracle which we can discuss in the next related blog post.





- - -
