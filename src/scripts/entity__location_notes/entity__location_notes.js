/* global moment */
/* global query__objectToString */

/* exported entityLocationNotes__columns */
const entityLocationNotes__columns = {
  action: (fragmentPrefix) => ({
    title: 'Action',
    data: 'id',
    type: 'string',
    orderable: false,
    searchable: false,
    className: 'excludeFromButtons openButtonWidth',
    render(data) {
      const href = `#${fragmentPrefix}/${data}?${query__objectToString({ resetState: 'yes' })}`;
      return `<a href="${href}" class="btn btn-default dblclick-target">Open</a>`;
    }
  }),

  id: {
    title: 'ID',
    data: 'id',
    type: 'string',
    className: 'minWidth',
  },

  location: {
    title: 'Location ID',
    data: 'location',
    type: 'string',
    className: 'minWidth'
  },
  calc_location_site_name: {
    title: 'Location',
    orderable: false,
    searchable: false,
    className: 'minWidth',
    render(data, type, row) {
      return row.calc_location_site_name;
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

  __CreatedOn: {
    title: 'Created On',
    data: '__CreatedOn',
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
  __ModifiedOn: {
    title: 'Modified On',
    data: '__ModifiedOn',
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
  __Owner: {
    title: 'Modified By',
    data: '__Owner',
    type: 'string',
    className: 'minWidth'
  },
  __Status: (auth) => ({
    title: 'Status',
    data: '__Status',
    type: 'string',
    searchType: 'equals',
    choices: {
      beforeSend(jqXHR) {
        if (auth && auth.sId) {
          jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
        }
      },
      contentType: 'application/json; charset=utf-8',
      method: 'GET',
      url: '/* @echo C3DATAMEDIA_STATUS_CHOICES */'
    },
    className: 'statusWidth',
    render(data) {
      return `<span class="label label-${data === 'Active' ? 'success' : data === 'Inactive' ? 'danger' : 'default'}" style="font-size: 90%;">${data}</span>`;
    }
  })
};
