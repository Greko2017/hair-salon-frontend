import Board from 'containers/Board';
import SignIn from 'containers/SignIn';
import NotFound from 'containers/NotFound';
import Service from 'containers/Service';
import Sales from 'containers/Sales';
import ServiceLine from 'containers/ServiceLine';
import SalesLine from 'containers/SalesLine';
import TestApp from 'containers/TestApp';

const mainRoutes = [
  {
    exact: true,
    path: '/',
    name: 'Home',
    icon: 'home',
    component: Board,
    auth: true,
    permission: 'admin',
    key:"1"
  },
  {
    path: '/signin',
    name: 'Sign In',
    icon: 'login',
    component: SignIn,
    key:"2"
  },
  {
    path: '/service',
    name: 'Service',
    icon: 'scissore',
    component: Service,
    key:"3"
  },
  {
    path: '/service/:service_id',
    name: 'serviceline',
    icon: 'scissore',
    component: ServiceLine,
    key:"4"
  },
  {
    path: '/sales',
    name: 'Sales',
    icon: 'wallet',
    component: Sales,
    key:"5"
  },
  {
    path: '/sales/:sales_id',
    name: 'SalesLine',
    icon: 'wallet',
    component: SalesLine,
    key:"6"
  },
  {
    path: '/test_app/',
    name: 'TestApp',
    icon: 'test',
    component: TestApp,
    key:"7"
  },
  {
    path: '',
    name: 'Not Found',
    icon: 'close-circle',
    component: NotFound,
    key:"0"
  },
];

export default mainRoutes;
