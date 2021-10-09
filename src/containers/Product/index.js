import React, { Component } from 'react'
import { connect } from 'react-redux'

export class Product extends Component {
  render() {
    return (
      <div>
        product List
      </div>
    )
  }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = (dispatch) ({

})

export default connect(mapStateToProps, mapDispatchToProps)(Product)
