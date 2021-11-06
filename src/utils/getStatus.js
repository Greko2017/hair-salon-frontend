function getStatusLookup(key) {
  switch (key) {
    case 'draft':
      return 'Draft';

    case 'to_approve':
      return 'To Approve';

    case 'approve':
      return 'Approved';

    case 'un_approve':
      return 'Un Approved';
    default:
      break;
  }
}

export default getStatusLookup;
