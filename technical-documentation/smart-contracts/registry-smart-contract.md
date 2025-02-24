# Registry Smart Contract

{% hint style="info" %}
Minting validators can be found in the [`validators` folder,](https://github.com/nftmakerio/masumi-payment-service/tree/main/smart-contracts/registry/validators) and supporting functions in the `lib` folder using `.ak` as a file extension.
{% endhint %}

### Building

Make sure to install Aiken and have it available in your path [Install Aiken](https://aiken-lang.org/installation-instructions#installation-instructions).

To generate the smart contracts just run:

```
aiken build
```



### Running various scripts

To run the scripts you also need to install (Node.js)\[[https://nodejs.org/en/download/package-manager](https://nodejs.org/en/download/package-manager)] and install the dependencies via `npm install`.

Afterwards, to generate a testnet wallet, you can run various scripts:

```
npm run generate-wallet
```

The address will be found in the `wallet.addr` and `wallet.sk` (private key) file. You can top-up some test ADA (here)\[[https://docs.cardano.org/cardano-testnets/tools/faucet/](https://docs.cardano.org/cardano-testnets/tools/faucet/)]

The following commands will require the `BLOCKFROST_API_KEY` environment variable to be set. Make sure to register an account on [Blockfrost](https://blockfrost.io/) and get your key for either the preview or preprod network and use it consistently (cardano has multiple testnets).

```
npm run mint
```

To mint an example registry asset. The metadata can be configured in the `mint-example.mjs` file.

```
npm run defrag
```

To defrag the wallet (if there are no split up utxos containing only lovelace)



### Testing

You can add tests in any module using the `test` keyword. For example:

```
test addition() {
  1 + 1 == 2
}
```

To run all tests, simply do:

```
aiken check
```

### Documentation

If you're writing a library, you might want to generate an HTML documentation for it.

Use:

```
aiken docs
```

### Links

[Github repository](registry-smart-contract.md#links)
