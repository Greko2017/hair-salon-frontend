function permisionListSelector(permissions) {
  return permissions && permissions instanceof Array
    ? permissions.reduce(
        (prev, curr) => {
          // console.log('In permisionListSelector prev reducer :>> ', curr);
          if (curr.codename === 'payslip_can_approve') {
            prev.payslip_can_approve = true;
          }
          if (curr.codename === 'payslip_un_approve') {
            prev.payslip_un_approve = true;
          }
          if (curr.codename === 'can_send_for_approval') {
            prev.can_send_for_approval = true;
          }
          if (curr.codename === 'management_inventory') {
            prev.management_inventory = true;
          }
          if (curr.codename === 'user_inventory') {
            prev.user_inventory = true;
          }
          return prev;
        },
        { payslip_un_approve: false, payslip_can_approve: false },
      )
    : {};
}

export default permisionListSelector;
