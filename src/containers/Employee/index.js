import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

export class Employee extends Component {
  static propTypes = {
    prop: PropTypes
  }

  render() {
    return (
      <div>
          List All employee
      </div>
    )
  }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Employee)
