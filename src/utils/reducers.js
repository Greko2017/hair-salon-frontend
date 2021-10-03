import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import history from 'utils/history';
import globalReducer from 'global.reducer';
import serviceReducer from 'containers/Service/service.reducer';
import employeeReducer from 'containers/Employee/employee.reducer';
import salaryReducer from 'containers/Salary/salary.reducer';
import salesReducer from 'containers/Sales/sales.reducer';
import customerReducer from 'containers/Customer/customer.reducer';
import servicelineReducer from 'containers/ServiceLine/serviceline.reducer';
import saleslineReducer from 'containers/SalesLine/salesline.reducer';
import testAppReducer from 'containers/TestApp/test_app.reducer';

export default function createReducer(injectedReducers = {}) {
  const rootReducer = combineReducers({
    global: globalReducer,
    router: connectRouter(history),
    service: serviceReducer,
    employee: employeeReducer,
    salary: salaryReducer,
    sales: salesReducer,
    customer: customerReducer,
    serviceline: servicelineReducer,
    salesline: saleslineReducer,
    test_app: testAppReducer,
    ...injectedReducers,
  });

  return rootReducer;
}
