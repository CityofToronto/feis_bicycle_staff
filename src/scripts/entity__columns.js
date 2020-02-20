/* global moment */
/* global query__objectToString */

/* exported entity__columns */
const entity__columns = {
  action: ({ fragment }) => ({
    title: 'Action',
    data: 'id',
    orderable: false,
    searchable: false,
    className: 'excludeFromButtons openButtonWidth',
    render(data) {
      const href = `#${fragment}/${data}?${query__objectToString({ resetState: 'yes' })}`;
      return `<a href="${href}" class="btn btn-default dblclick-target">Open</a>`;
    }
  }),

  id: {
    title: 'ID',
    data: 'id',
    type: 'string',
    className: 'minWidth'
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

  __Status: ({ auth }) => ({
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
      url: '/* @echo C3DATAMEDIA_STATUS_CHOICES */',
      webStorage: sessionStorage
    },
    className: 'statusWidth',
    render(data) {
      const labelClass = data === 'Active' ? 'success' : data === 'Inactive' ? 'danger' : 'default';
      return `<span class="label label-${labelClass}" style="font-size: 90%;">${data}</span>`;
    }
  })
};
