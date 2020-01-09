/* global moment */
/* global query__objectToString */

/* exported entityLockers__columns */
const entityLockers__columns = {
  action: (fragmentPrefix) => ({
    title: 'Action',
    className: 'excludeFromButtons openButtonWidth',
    data: 'id',
    orderable: false,
    render(data) {
      const href = `#${fragmentPrefix}/${data}?${query__objectToString({ resetState: 'yes' })}`;
      return `<a href="${href}" class="btn btn-default dblclick-target">Open</a>`;
    },
    searchable: false
  }),

  id: {
    title: 'ID',
    className: 'minWidth',
    data: 'id'
  },

  location: {
    title: 'Location ID',
    className: 'minWidth',
    data: 'location'
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
  latest_inspection__result: (auth) => ({
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

  __CreatedOn: {
    title: 'Created On',
    className: 'minWidth',
    data: '__CreatedOn',
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
  __ModifiedOn: {
    title: 'Modified On',
    className: 'minWidth',
    data: '__ModifiedOn',
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
  __Owner: {
    title: 'Modified By',
    className: 'minWidth',
    data: '__Owner',
    type: 'string'
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
      const labelClass = data === 'Active' ? 'success' : data === 'Inactive' ? 'danger' : 'default';
      return `<span class="label label-${labelClass}" style="font-size: 90%;">${data}</span>`;
    }
  })
};
