import * as crypto from "crypto";

/**
 * A transaction is a record of an exchange of legos between a payer who sends
 * the money and a payee who receives the money. These two parties are defined
 * by their respective public keys.
 */
class Transaction {

  constructor(
    public amount: number,
    public payer:  string, // payer public key
    public payee:  string  // payee public key
  ) {}

  toString() {
    return JSON.stringify( this );
  }
}

/**
 * A block is a group of transaction which will be an element in the blocks
 * linked list or "chain".
 */
class Block {
  // a random number used in problem for proof of work
  public nonce = Math.round( Math.random() * 999999999 );

  constructor(
    public prevHash: string,
    public transaction: Transaction,
    public ts = Date.now()
  ) {}

  get hash() {
    const str  = JSON.stringify( this );
    const hash = crypto.createHash( 'SHA256' ); // setup hashing function

    // add string to hash
    hash.update( str ).end();

    return hash.digest( 'hex' );
  }
}

/**
 * The chain is a singleton linked list of blocks in the blockchain.
 */
class Chain {
  public static instance = new Chain(); // force singleton

  chain: Block[];

  constructor() {
    this.chain = [ new Block(
      '',
      new Transaction( 100, 'genesis', 'thudsonbu' ) // genisis block of blockchain
    )];
  }

  get lastBlock() {
    return this.chain[ this.chain.length - 1 ];
  }

  /**
   * Mining is the process of finding a random solution to a very difficult
   * problem. This is used to avoid a double spending issue in a blockchain.
   * If two blocks are created, the first to be verified by solving the mining
   * problem and confirmed across all nodes will be added to the blockchain. If
   * the two are confirmed simultaneously, the transaction with the most
   * confirmations will be added to the chain.
   * @param nonce
   */
  mine( nonce: number ) {
    let solution = 1;
    console.log( 'mining...' );

    while( true ) {

      const hash = crypto.createHash( 'MD5' );
      hash.update( ( nonce + solution ).toString() ).end();

      const attempt = hash.digest( 'hex' );

      if ( attempt.substr( 0, 4 ) === '0000' ) {
        console.log( `Solved: ${ solution } ` );
        return solution;
      }

      solution += 1;
    }
  }

  addBlock( transaction: Transaction, senderPublicKey: string, signature: Buffer ) {
    // create a verifier for the transaction
    const verifier = crypto.createVerify( 'SHA256' );
    verifier.update( transaction.toString() );

    // verify created hash with signature
    const isValid = verifier.verify( senderPublicKey, signature );

    if ( isValid ) { // if valid add to chain
      const newBlock = new Block( this.lastBlock.hash, transaction );
      this.chain.push( newBlock );
    }
  }
}


/**
 * The wallet functions as the key manager for a user. When a transaction is
 * created, a hash of the transaction data is first created using sha256. In
 * order to make sure that the transaction was made by the payer, the hash is
 * signed with the payers private key. This makes sure that the transaction
 * cannot be changed as the signed hash can be verified by comparing it with
 * a hash of plain text transaction data after decrypting it with the public
 * key.
 */
class Wallet {
  public publicKey: string;
  public privateKey: string;

  constructor() {
    // create new public and private key pair for wallet
    const keypair = crypto.generateKeyPairSync( 'rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });

    this.privateKey = keypair.privateKey;
    this.publicKey = keypair.publicKey;
  }

  sendMoney( amount: number, payeePublicKey: string ) {
    // create a new transaction
    const transaction = new Transaction( amount, this.publicKey, payeePublicKey );

    // create a hash for the transaction
    const sign = crypto.createSign( 'SHA256' );
    sign.update( transaction.toString() ).end();

    // sign the hash with the private key
    const signature = sign.sign( this.privateKey );

    // add the new block to the chian
    Chain.instance.addBlock( transaction, this.publicKey, signature );
  }
}
