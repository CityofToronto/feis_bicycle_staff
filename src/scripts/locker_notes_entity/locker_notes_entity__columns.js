/* global moment */
/* global entity__columns */

/* exported lockerNotesEntity__columns */
const lockerNotesEntity__columns = {
  action: entity__columns.action,

  id: entity__columns.id,

  locker: {
    title: 'Locker ID',
    className: 'minWidth',
    data: 'locker'
  },
  calc_locker_number: {
    title: 'Locker',
    orderable: false,
    searchable: false,
    className: 'minWidth',
    render(data, type, row) {
      return row.calc_locker_number || '';
    }
  },

  date: {
    title: 'Date',
    className: 'minWidth',
    data: 'date',
    type: 'date',
    render(data) {
      const dataMoment = moment(data);
      if (dataMoment.isValid()) {
        return dataMoment.format('YYYY/MM/DD h:mm A');
      } else {
        return '';
      }
    }
  },
  note: {
    title: 'Note',
    className: 'minWidthLarge',
    data: 'note',
    render(data) {
      if (data) {
        return data.replace(/(?:\r\n|\r|\n)/g, '<br>');
      } else {
        return '';
      }
    }
  },

  __CreatedOn: entity__columns.__CreatedOn,
  __ModifiedOn: entity__columns.__ModifiedOn,
  __Owner: entity__columns.__Owner,
  __Status: entity__columns.__Status
};
