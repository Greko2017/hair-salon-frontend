import React from 'react'
import { Route, Switch } from 'react-router'
import PrivateRoute from 'components/PrivateRoute';
import mainRoutes from 'routes/mainRoutes';

function BaseRouter() {
  return (
    <div>
      <Switch>
        {' '}
        {mainRoutes.map(route => (route.auth ? <PrivateRoute {...route} /> : <Route exact {...route} />))}{' '}
      </Switch>{' '}
    </div>
  )
}

export default BaseRouter
