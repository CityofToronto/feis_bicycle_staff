/* global moment */
/* global entity__columns */

/* exported locationInspectionsEntity__columns */
const locationInspectionsEntity__columns = {
  action: entity__columns.action,

  id: entity__columns.id,

  location: {
    title: 'Location ID',
    className: 'minWidth',
    data: 'location'
  },
  calc_location_site_name: {
    title: 'Location Site Name',
    orderable: false,
    searchable: false,
    className: 'minWidth',
    render(data, type, row) {
      return row.calc_location_site_name;
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
  result: ({ auth }) => ({
    title: 'Result',
    className: 'minWidth',
    data: 'result',
    choices: {
      beforeSend(jqXHR) {
        if (auth && auth.sId) {
          jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
        }
      },
      contentType: 'application/json; charset=utf-8',
      method: 'GET',
      url: '/* @echo C3DATAMEDIA_INSPECTION_CHOICES */'
    },
    render(data) {
      return `<span class="label label-${data === 'OK' ? 'success' : data === 'Problems' ? 'danger' : 'default'}" style="font-size: 90%;">${data}</span>`;
    }
  }),
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
