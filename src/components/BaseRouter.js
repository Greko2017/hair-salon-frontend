import React from 'react';
import { Route, Switch } from 'react-router';
import PrivateRoute from 'components/PrivateRoute';
import mainRoutes from 'routes/mainRoutes';
import TestApp from 'containers/TestApp';
import TestAppResult from 'containers/TestAppResult';
const test_app_routes = [
  {
    path: '/test_app/',
    name: 'TestApp',
    icon: 'test',
    component: TestApp,
    key: '7',
  },
  {
    path: '/test_app_result/:email_data',
    name: 'TestAppResult',
    icon: 'wallet',
    component: TestAppResult,
    key: '8',
  },
];
function BaseRouter() {
  return (
    <div>
      <Switch>
        {test_app_routes.map(route => (
          <Route exact {...route} />
        ))}{' '}
        {mainRoutes.map(route => (route.auth ? <PrivateRoute {...route} /> : <Route exact {...route} />))}{' '}
      </Switch>{' '}
    </div>
  );
}

export default BaseRouter;
