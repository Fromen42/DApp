import React, { Component } from 'react';
import Web3 from 'web3'
import logo from '../logo.png';
import './App.css';
import Marketplace from '../abis/Marketplace.json'
import Navbar from './Navbar'
import Main from './Main'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = Marketplace.networks[networkId]
    if(networkData) {
      const dieroll = new web3.eth.Contract(Marketplace.abi, networkData.address)
      this.setState({ dieroll })
      const productCount = await dieroll.methods.productCount().call()
      this.setState({ productCount })
      // Load products
      for (var i = 1; i <= productCount; i++) {
        const product = await dieroll.methods.products(i).call()
        this.setState({
          products: [...this.state.products, product]
        })
      }
      this.setState({loading: false})
      console.log(this.state.products)
    } else {
      window.alert('DieRoll contract not deployed to detected network.')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      productCount: 0,
      products: [],
      loading: true
    }
      this.createProduct = this.createProduct.bind(this)
      // this.purchaseProduct = this.purchaseProduct.bind(this)
      this.rollDie = this.rollDie.bind(this)
  }
  
  createProduct(name, price, sides, currentBet, entry) {
    this.setState({ loading: true })
    this.state.dieroll.methods.createProduct(name, price, sides, currentBet, entry).send({ from: this.state.account, value: price })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
      window.location.reload()
  })
  }

  // purchaseProduct(id, price) {
  //   this.setState({ loading: true })
  //   this.state.dieroll.methods.purchaseProduct(id).send({ from: this.state.account, value: price })
  //   .once('receipt', (receipt) => {
  //     this.setState({ loading: false })
  //   })
  // }
  rollDie(id, entry){
    this.setState({ loading: true })
    this.state.dieroll.methods.rollDie(id).send({ from: this.state.account, value: entry})
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
      window.location.reload()
    })

  }
  


  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className = "container-fluid mt-5">
          <div className = "row">
            <main role="main" className="col-lg-12 d-flex">
              {this.state.loading 
              ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div> 
              : <Main 
                  products = {this.state.products} 
                  purchaseProduct = {this.purchaseProduct}
                  rollDie = {this.rollDie}
                  createProduct = {this.createProduct} /> }
            </main>
          </div>
        </div>  
      </div>
    );
  }
}

export default App;