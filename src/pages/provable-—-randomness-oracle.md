---
title: Provable — Randomness Oracle
date: 2019-07-27T00:08:28.002Z
description: Provable — Randomness Oracle
featuredImage: ../../static/img/provable.jpg
---
One particularly interesting approach by Provable is the usage of a hardware security device, namely the Ledger Nano S. It uses a [trusted execution environment](https://en.wikipedia.org/wiki/Trusted_execution_environment) to generate random numbers and provides a Provable Connector Contract as interface.

## How to use the Provable Randomness Oracle?

Use [the example](https://github.com/oraclize/ethereum-examples/blob/master/solidity/random-datasource/randomExample.sol) provided, the `update()` function will retrieve a new random number from the oracle by calling `oraclize_newRandomDSQuery()` . The calling contract needs to have a `__callback` function defined for Provable to send the reply to. Beware that for maximum security, you really want two modifcations to the example:

1. Actually store the query returned `oraclize_newRandomDSQuery` in the contract and verify it’s matching the query id returned to the callback function.
2. Remove the `require(msg.sender == oraclize_cbAddress())` as it allows Provable to [ransom a winning player](https://github.com/oraclize/ethereum-examples/issues/29).

Please also consider front-running when using the random oracle. This is easily possible by designing the system similarly to the future blockhash I mentioned in the [previous post](https://www.soliditydeveloper.com/2019-06-23-randomness-blockchain/).

## How does the Provable Randomness Oracle work in detail?

Okay, so let us go in the details, if you are curious on how this actually works. We will call the provider of such a service, e.g., Provable, the data carrier. The Connector Contract expects four parameters:

* A commitment nonce which must not be known to the data carrier before submitting the request.
* A time dT in seconds to represent the minimal delay required between submission of the request and response.
* The public key of the device be to used.
* The number of random bytes to return, between 1 and 32.

The Ledger Nano S allows running custom applications on it. However, it has some challenging limitations, e.g., a very small volatile as well as a very small non-volatile memory. The proposed secure application by Provable is designed to cope with the Ledger Nano S’ limitations by minimizing the required memory as well as reducing the number of writes. The secure application needs three features for its security:

* A timer for verifying that the provided time dT has passed.
* A tamper-resistant memory to hold the private keys without being accessible to the data carrier.
* A management component for signing and verifying with the public key and the secret private key.

The API, i.e., the functions that can be accessed from the outside, contains four endpoints:

* Initialization: Run once for the setup.
* Query Insertion: A new query for a random value can be inserted.
* Volatile Memory State Import/Export: Export device memory and later import it.
* Query Execution: The actual generation of the random value.

**Initialization**: Firstly, depending on the current application’s code and device state, an elliptic curve key pair is generated. Doing that, the generated application session key is bound to an exact behavior. Any changes to the behavior, e.g., updating the firmware or re-installing the application, destroy the application’s session key and would therefore require the generation of a new key. Thus, an existing session key can be verified by looking at the device’s firmware and application code.

**Query Insertion**: This function enables the insertion of new queries into the tamper-resistant state. It is essential for the security that only one query per query id exists, since with the addition of multiple queries per query id a malicious random data provider can run multiple queries to predict user queries. Storing a mapping for each query id to query data would be impossible with the limited storage available on a ledger. That is why there is an authenticated data structure. It enables the authentication of increasing amounts of data without an increasing demand for storage. The proving is done by a host application which keeps the whole data structure in storage. Only the verification is done on the device itself. The chosen data structure is similar to the merkle patricia trie used by Ethereum. In specific, the tree is characterized as follows:

* All inner nodes have 16 children.
* All inner nodes contain the hash over all their children’s entries.
* All leaf nodes contain either the hashed query parameters or they are empty.
* The tree has a fixed depth of 64.
* Each query id is represented by a 64 character hash of that id which is the key for traversing the tree.

![merkle-patricia-trie](/img/merkle.png "Merkle Patricia Trie example used by Provable random data source")

The key aspect of such a tree is that only the hash of the root node needs to be stored. The leaf nodes contain the hash over all query parameters, i.e., H(current time, commitment nonce, dT, number of random bytes to return). When inserting new queries, the following steps are required:

1. Create the leaf node for the query by computing the hash over all query parameters.
2. Compute the hash of the query id and reverse it.
3. Traverse the reversed key and at each node: Use the leaf node hash or subsequently computed node hashes. Compute the node hash without the added new query leaf node. If hashes of other nodes are required, they can be retrieved from the host application. Likewise, compute the node hash with the added new query leaf node. Store the newly computed hashes in temporary variables, oldHash and newHash.
4. Once reached the root node, compare oldHash with the stored root hash. If they match, replace the stored root hash with newHash.

**Volatile Memory State Import/Export**: A device might be used to serve multiple host applications. Additionally, it might be restarted intentionally or unintentionally. In consequence, functions for importing and exporting the current device state are necessary. For exporting a state, the device signs its current state with its session’s private key. Additionally, it includes its current storage nonce into the signed data. When importing a state, the signature is verified and the storage nonce must match the internal value for the storage nonce. That implies data carriers may not import older device states but only the last one.

**Query Execution**: Any query can only be executed once: queryInsertionTime + dt < currentTime. The execution itself involves signing the hash of the query parameters with its session’s private key. The number of random bytes requested represent the truncation of the computed signature.

**Usage in Ethereum**: In a smart contract, the procedure may work the following: The smart contract requiring a random number computes a commitment nonce which is unknown to the data carrier prior to the query submission. See below for the exact procedure for computing such a nonce. The nonce is passed to a data carrier smart contract (the Connector Contract) along with dT, the number of random bytes required and the device’s session public key. The data carrier smart contract subsequently does the following:

1. Increments the query id counter for the requesting smart contract’s address.
2. Subtracts a fee from the sender (the requesting smart contract).
3. Computes the hash over the requesting smart contract’s address and the query id counter.
4. Triggers the query insertion into the ledger device by emitting a log event.

After a successful query insertion followed by a successful query execution, the generated random bytes along with the query id and the proof are sent to a predefined callback function inside the requesting smart contract. The sent random bytes are only accepted and used once the proof is verified:

1. The random number must have been generated on a ledger device. The ledger proof can verify this.
2. The commitment nonce inside the proof must match the original commitment nonce.
3. The application code hash must match a whitelisted application code hash.

**Security Analysis**: Three properties must hold for the security of such applications:

1. The session’s private key must be unknown to the data carrier.
2. The commitment nonce must be unknown prior to query insertion to the data carrier.
3. The device application must function in the described way.

We will further examine all three properties. The first property is critical. With possession of the private key, a data carrier could run the query execution at any time without the ledger device. That would imply a data carrier can predict the random value for every query without any effort. All the security guarantees rely on the fact that the private key is unknown. Gaining knowledge of the device key is difficult, but not impossible. It relies on the tamper-state memory which may be possible. Nevertheless, the process of reading the memory is generally extremely difficult and expensive without any guarantee of success. Costs can easily exceed hundreds of thousands or millions of US dollars. For very successful applications, these costs may still be too low. In such a scenario, application developers may rely on multiple different devices for their random value generation, linearly increasing the costs for a successful attack.

The second property is important since otherwise a data carrier may compute the result before a user submits his query. It can be prevented with the proper choice for the query parameters. Since there can only be one query per query id, any attempt to successfully compute random values beforehand, must correctly guess all query parameters. The data carrier has only one chance to guess these parameters correctly. In case he fails to do so, the attempt may be detected by users after not receiving a result for their query.

Choosing a commitment nonce which may not be predicted by the data carrier can be done the following: In the case of Ethereum, a user may choose the hash over all block variables, i.e., the current block’s coinbase, timestamp, gas limit and the last block hash. Additionally, he chooses a dT that is higher than the block time in Ethereum. This yields a very difficult prediction of the commitment nonce for the data carrier. The data carrier cannot predict the block variables unless he colludes with miners. Even in that case, they have only one chance of correctly predicting all variables and a failure would be detectable.

Finally, the application code for the device must be verified manually. That process involves generating the application’s code hash for every given source code and comparing it to the whitelisted hashes. Each application’s source code must bijectively match one of the whitelisted hashes. Furthermore, every given source code must be checked for its logic. We believe this to be a long and error-prone process, especially after trying to read the exemplary implementation’s source code ourselves. Though, increased code readability and high-quality documentation may help in this process.

Of note, a data carrier may choose not to submit the results of successful query executions. He may do so for unknown reasons, but an application can secure itself from giving monetary incentives to the data carrier by not refunding users after a data carrier has stopped submitted the result for a given query. Furthermore, there is no denial-of-service protection given and the data carrier is a single point of failure. Consequently, there should not be any timeout in requesting applications.

In addition, ransoming a winning player may be an issue depending on the implementation of using applications. If the callback for submitting queries is restricted only to be used by the data carrier, he could go to a winning player. By providing the proof for the given query, he could prove to him that he is in fact a winner. Due to the callback being restricted only to the data carrier, the data carrier may only publish the result after receiving money from the winning player. Allowing the submission of queries for anyone mitigates this risk. Firstly, it poses no threat to allow the submission for anyone, because only results with valid proofs will be accepted. Secondly, it allows a ransomed winning player to submit the proof himself. To prove to him that he is in fact the winning player, the data carrier must provide the whole proof. Otherwise, the ransomed player cannot be sure that he is really the winner. At the time of the writing, the exemplary application implementation of Provable is vulnerable to this attack since it does in fact restrict the submission of the result only to the data carrier.

## Conclusion

We have looked at two methods for multi-party randomness in Solidity. While the commitment approach is not very useful for most real-world use cases, using an oracle is your best bet at this time. However, it is most definitely not ideal as it is a centralized solution. Unfortunately, there is no perfect approach at this point in time.

**The future**: This might change quite soon. With the introduction of ETH2.0 and their Proof of Stake algorithm, the randomness generation may be used by smart contracts as well. We will discuss the ETH2.0 approach as well as other POS algorithms and how that would help randomness in smart contracts in a later blog post.
