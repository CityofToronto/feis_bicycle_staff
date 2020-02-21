/* global moment */
/* global entity__columns */

/* exported lockersEntity__columns */
const lockersEntity__columns = {
  action: entity__columns.action,

  id: entity__columns.id,

  location: {
    title: 'Location ID',
    className: 'minWidth',
    data: 'location'
  },
  calc_location_site_name: {
    title: 'Location',
    data: 'location',
    orderable: false,
    searchable: false,
    className: 'minWidth',
    render(data, type, row) {
      return row.calc_location_site_name || '';
    }
  },

  number: {
    title: 'Number',
    className: 'minWidth',
    data: 'number'
  },
  description: {
    title: 'Description',
    className: 'minWidthLarge',
    data: 'description',
    render(data) {
      if (data) {
        return data.replace(/(?:\r\n|\r|\n)/g, '<br>');
      } else {
        return '';
      }
    }
  },

  customer: {
    title: 'Customer',
    className: 'minWidth',
    data: 'customer'
  },
  calc_customer_name: {
    title: 'Customer',
    data: 'customer',
    orderable: false,
    searchable: false,
    className: 'minWidth',
    render(data, type, row) {
      return row.calc_customer_name || '';
    }
  },

  latest_note: {
    title: 'Latest Note ID',
    className: 'minWidth',
    data: 'latest_note'
  },
  latest_note__date: {
    title: 'Latest Note Date',
    className: 'minWidth',
    data: 'latest_note__date',
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
  latest_note__note: {
    title: 'Latest Note',
    className: 'minWidthLarge',
    data: 'latest_note__note',
    render(data) {
      if (data) {
        return data.replace(/(?:\r\n|\r|\n)/g, '<br>');
      } else {
        return '';
      }
    }
  },

  latest_inspection: {
    title: 'Latest Inspection ID',
    className: 'minWidth',
    data: 'latest_inspection'
  },
  latest_inspection__date: {
    title: 'Latest Inspection Date',
    className: 'minWidth',
    data: 'latest_inspection__date',
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
  latest_inspection__result: ({ auth }) => ({
    title: 'Latest Inspection Result',
    className: 'minWidth',
    data: 'latest_inspection__result',
    searchType: 'equals',
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
      if (data) {
        const labelClass = data === 'OK' ? 'success' : data === 'Problems' ? 'danger' : 'default';
        return `<span class="label label-${labelClass}" style="font-size: 90%;">${data}</span>`;
      }
      return '';
    }
  }),
  latest_inspection__note: {
    title: 'Latest Note',
    className: 'minWidth',
    data: 'latest_inspection__note',
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
