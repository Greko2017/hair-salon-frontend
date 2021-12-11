import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import history from 'utils/history';
import globalReducer, { generaleReducer } from 'global.reducer';
import serviceReducer from 'containers/Service/service.reducer';
import employeeReducer from 'containers/Employee/employee.reducer';
import salaryReducer from 'containers/Salary/salary.reducer';
import salesReducer from 'containers/Sales/sales.reducer';
import customerReducer from 'containers/Customer/customer.reducer';
import servicelineReducer from 'containers/ServiceLine/serviceline.reducer';
import saleslineReducer from 'containers/SalesLine/salesline.reducer';
import testAppReducer from 'containers/TestApp/test_app.reducer';
import productReducer from 'containers/Product/product.reducer';
import payrollReducer from 'containers/Payslip/payroll.reducer';
import otherPaysReducer from 'containers/OtherPay/otherpay.reducer';
import deductionReducer from 'containers/Deduction/deduction.reducer';
import payrollToApproveReducer from 'containers/PayslipToApprove/payroll_to_approve.reducer';
import inventoryReducer from 'containers/Inventory/inventory.reducer';
import categoryReducer from 'containers/Category/category.reducer';
import boardReducer from 'containers/Board/board.reducer';

export default function createReducer(injectedReducers = {}) {
  const appReducer = combineReducers({
    global: globalReducer,
    general: generaleReducer,
    router: connectRouter(history),
    service: serviceReducer,
    employee: employeeReducer,
    salary: salaryReducer,
    sales: salesReducer,
    customer: customerReducer,
    serviceline: servicelineReducer,
    salesline: saleslineReducer,
    test_app: testAppReducer,
    product: productReducer,
    payroll: payrollReducer,
    other_pays: otherPaysReducer,
    deduction: deductionReducer,
    payroll_to_approve: payrollToApproveReducer,
    inventory: inventoryReducer,
    category: categoryReducer,
    board: boardReducer,
    ...injectedReducers,
  });
  const rootReducer = (state, action) => {
    if (action.type === 'AUTH_LOGOUT') {
      state = undefined;
    }
    return appReducer(state, action);
  };
  return rootReducer;
}
