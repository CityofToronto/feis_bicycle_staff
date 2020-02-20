/* global moment */
/* global entity__columns */

/* exported locationNotesEntity__columns */
const locationNotesEntity__columns = {
  action: entity__columns.action,

  id: entity__columns.id,

  location: {
    title: 'Location ID',
    data: 'location',
    type: 'string',
    className: 'minWidth'
  },

  calc_location_site_name: {
    title: 'Location Site Name',
    orderable: false,
    searchable: false,
    className: 'minWidth',
    render(data, type, row) {
      return row.calc_location_site_name || '';
    }
  },

  date: {
    title: 'Date',
    data: 'date',
    type: 'date',
    className: 'minWidth',
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
    data: 'note',
    type: 'string',
    className: 'minWidthLarge',
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
