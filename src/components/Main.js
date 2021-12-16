import React, { Component } from 'react';

class Main extends Component {

  render() {
    return (
      <div id="content">
        <h1>Bet Properties</h1>
        <form onSubmit={(event) => {
          event.preventDefault()
          const name = this.productName.value
          const price = window.web3.utils.toWei(this.productPrice.value.toString(), 'Ether')
          const sides = this.productSides.value
          const currentBet = this.productCurrentBet.value
          const entry = window.web3.utils.toWei(this.productEntry.value.toString(), 'Ether')
          this.props.createProduct(name, price, sides, currentBet, entry)
        }}>
          <div className="form-group mr-sm-2">
            <input
              id="productName"
              type="text"
              ref={(input) => { this.productName = input }}
              className="form-control"
              placeholder="Name the Bet"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="productPrice"
              type="text"
              ref={(input) => { this.productPrice = input }}
              className="form-control"
              placeholder="Price to Deposit"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="productSides"
              type="text"
              ref={(input) => { this.productSides = input }}
              className="form-control"
              placeholder="Number of Die Sides"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="productCurrentBet"
              type="text"
              ref={(input) => { this.productCurrentBet = input }}
              className="form-control"
              placeholder="Number to Roll Higher or Equal"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="productEntry"
              type="text"
              ref={(input) => { this.productEntry = input }}
              className="form-control"
              placeholder="Entry Fee for Each Roll"
              required />
          </div>
          <button 
                type="submit" 
                className="btn btn-primary" 
                >
                  Make a Bet
          </button>
        </form>
        <p> </p>
        <h2>Active and Previous Bets</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name of the Bet</th>
              <th scope="col">Type of Die</th>
              <th scope="col">Bet to Beat</th>
              <th scope="col">Entry Fee</th>
              <th scope="col">Prize to Win</th>
              <th scope="col">Creator of The Bet</th>
                        {  1 > 0
                        ? <th scope="col">Last Rolled</th>
                        : null
                        }
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="productList">
              { this.props.products.map((product, key) => {
                return(
                    <tr key={key}>
                    <th scope="row">{product.id.toString()}</th>
                    <td>{product.name}</td>
                    <td>{product.sides}</td>
                    <td>{product.currentBet}</td>
                    <td>{window.web3.utils.fromWei(product.entry.toString(), 'Ether')} Eth</td>
                    <td>{window.web3.utils.fromWei(product.price.toString(), 'Ether')} Eth</td>
                    <td>{product.owner}</td>
                    <td>{product.roll}</td>
                   
                    
                    <td>
                        { !product.purchased
                        ? <button
                            name={product.id}
                            value={product.entry}
                            onClick={(event) => {
                                this.props.rollDie(event.target.name, event.target.value)
                            }}
                            >
                            Bet
                            </button>
                        : <div>Winner is {product.owner}</div>
                        }
                    </td>
                    
    </tr>
  )
})}
              
           
          </tbody>
        </table>
      </div>
    );
  }
}

export default Main;