const Marketplace = artifacts.require('./Marketplace.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Marketplace', ([deployer, creator, better]) => {
  let marketplace

  before(async () => {
    marketplace = await Marketplace.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await marketplace.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await marketplace.name()
      assert.equal(name, 'Ali\'s Die Roll')
    })
  })


  describe('products', async () => {
    let result, productCount

    before(async () => {
      result = await marketplace.createProduct('Classic', web3.utils.toWei('10', 'Ether'), 0, 0, 0 )
      productCount = await marketplace.productCount()
    })

    it('creates products', async () => {
      // SUCCESS
      assert.equal(productCount, 1)
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct')
      assert.equal(event.name, 'Classic', 'name is correct')
      assert.equal(event.price, '10000000000000000000', 'price is correct')
      assert.equal(event.owner, creator, 'owner is correct')
      assert.equal(event.purchased, false, 'purchased is correct')

      // FAILURE: Product must have a name
      await await marketplace.createProduct('', web3.utils.toWei('10', 'Ether'),0, 0 ,web3.utils.toWei('1', 'Ether'), { from: creator }).should.be.rejected;
      // FAILURE: Product must have a price
      await await marketplace.createProduct('Classic', 0, 0, 0 ,web3.utils.toWei('1', 'Ether'), { from: creator }).should.be.rejected;
    })
  //       it('sells products', async () => {
  //   // Track the creator balance before purchase
  //   let oldCreatorBalance
  //   oldCreatorBalance = await web3.eth.getBalance(creator)
  //   oldCreatorBalance = new web3.utils.BN(oldCreatorBalance)

  //   // SUCCESS: better makes purchase
  //   result = await marketplace.rollDie(productCount, { from: better, value: web3.utils.toWei('10', 'Ether')})

  //   // Check logs
  //   const event = result.logs[0].args
  //   assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct')
  //   assert.equal(event.name, 'Classic', 'name is correct')
  //   assert.equal(event.price, '1000000000000000000', 'price is correct')
  //   assert.equal(event.owner, better, 'owner is correct')
  //   assert.equal(event.purchased, true, 'purchased is correct')

  //   // Check that creator received funds
  //   let newCreatorBalance
  //   newCreatorBalance = await web3.eth.getBalance(creator)
  //   newCreatorBalance = new web3.utils.BN(newCreatorBalance)

  //   let price
  //   price = web3.utils.toWei('10', 'Ether')
  //   price = new web3.utils.BN(price)

  //   const exepectedBalance = oldCreatorBalance.add(price)

  //   assert.equal(newCreatorBalance.toString(), exepectedBalance.toString())

  //   // FAILURE: Tries to buy a product that does not exist, i.e., product must have valid id
  //   await marketplace.rollDie(99, { from: better, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;      // FAILURE: better tries to buy without enough ether
  //   // FAILURE: better tries to buy without enough ether
  //   await marketplace.rollDie(productCount, { from: better, value: web3.utils.toWei('0.5', 'Ether') }).should.be.rejected;
  //   // FAILURE: Deployer tries to buy the product, i.e., product can't be purchased twice
  //   await marketplace.rollDie(productCount, { from: deployer, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected;
  //   // FAILURE: better tries to buy again, i.e., better can't be the creator
  //   await marketplace.rollDie(productCount, { from: better, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected;
  //   })
  })
  
})