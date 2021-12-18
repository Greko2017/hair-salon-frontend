import Board from 'containers/Board';
import SignIn from 'containers/SignIn';
import NotFound from 'containers/NotFound';
import Service from 'containers/Service';
import Sales from 'containers/Sales';
import ServiceLine from 'containers/ServiceLine';
import SalesLine from 'containers/SalesLine';
import Payslip from 'containers/Payslip';
import PayslipBatch from 'containers/PayslipBatch';
import PayslipToApprove from 'containers/PayslipToApprove';
import PayslipLine from 'containers/PayslipLine';
import Inventory from 'containers/Inventory';
import Category from 'containers/Category';
import Product from 'containers/Product';
import Customer from 'containers/Customer';

const mainRoutes = [
  // {
  //   exact: true,
  //   path: '/dashboard',
  //   name: 'Dashboard',
  //   icon: 'home',
  //   component: Board,
  //   auth: true,
  //   permission: 'admin',
  //   key: '1',
  // },
  {
    exact: true,
    path: '/',
    name: 'Home',
    icon: 'home',
    component: Board,
    auth: true,
    permission: 'admin',
    key: '1',
  },
  {
    path: '/signin',
    name: 'Sign In',
    icon: 'login',
    component: SignIn,
    key: '2',
  },
  {
    path: '/service',
    name: 'Service',
    icon: 'scissore',
    component: Service,
    key: '3',
  },
  {
    path: '/service/:service_id',
    name: 'serviceline',
    icon: 'scissore',
    component: ServiceLine,
    key: '4',
  },
  {
    path: '/sales',
    name: 'Sales',
    icon: 'wallet',
    component: Sales,
    key: '5',
  },
  {
    path: '/sales/:sales_id',
    name: 'SalesLine',
    icon: 'wallet',
    component: SalesLine,
    key: '6',
  },
  {
    path: '/payslip',
    name: 'payslip',
    icon: 'payslip',
    component: Payslip,
    key: '9',
  },
  {
    path: '/payslip/:payslip_id',
    name: 'payslipLine',
    icon: 'payslip',
    component: PayslipLine,
    key: '9',
  },
  {
    path: '/payslip_batch',
    name: 'payslip_batch',
    icon: 'payslip_batch',
    component: PayslipBatch,
    key: '10',
  },
  {
    path: '/payslip_to_approve',
    name: 'payslip_to_approve',
    icon: 'payslip_to_approve',
    component: PayslipToApprove,
    key: '10',
  },
  {
    path: '/inventory',
    name: 'inventory',
    icon: 'inventory',
    component: Inventory,
    key: '11',
  },
  {
    path: '/category',
    name: 'category',
    icon: 'category',
    component: Category,
    key: '10',
  },
  {
    path: '/product',
    name: 'product',
    icon: 'product',
    component: Product,
    key: '11',
  },
  {
    path: '/customer',
    name: 'customer',
    icon: 'customer',
    component: Customer,
    key: '12',
  },
  {
    path: '',
    name: 'Not Found',
    icon: 'close-circle',
    component: NotFound,
    key: '0',
  },
];

export default mainRoutes;
