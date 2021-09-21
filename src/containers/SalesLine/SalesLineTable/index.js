import React, { Component } from 'react'
import { connect } from 'react-redux'

export class SalesLineTable extends Component {
  render() {
    return (
      <div>
        SalesLineTable
      </div>
    )
  }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(SalesLineTable)
