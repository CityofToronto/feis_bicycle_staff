/* global moment */
/* global oData__escapeValue query__objectToString */

/* exported entityStations__columns */
const entityStations__columns = {
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

  site_name: {
    title: 'Site Name',
    className: 'minWidth',
    data: 'site_name'
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

  civic_address: {
    title: 'Address',
    className: 'minWidth',
    data: 'civic_address'
  },
  municipality: {
    title: 'City',
    className: 'minWidth',
    data: 'municipality'
  },
  province: (auth) => ({
    title: 'Province',
    className: 'minWidth',
    data: 'province',
    searchType: 'equals',
    choices: {
      beforeSend(jqXHR) {
        if (auth && auth.sId) {
          jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
        }
      },
      contentType: 'application/json; charset=utf-8',
      method: 'GET',
      url: '/* @echo C3DATAMEDIA_PROVINCE_CHOICES */'
    },
  }),
  postal_code: {
    title: 'Postal Code',
    className: 'minWidth',
    data: 'postal_code'
  },

  address: {
    title: 'Address',
    className: 'minWidth',
    data: 'civic_address',
    select: ['municipality', 'province', 'postal_code'],
    type: 'function',
    render(data, settings, row) {
      const line1 = data;
      const line2 = [row['municipality'], row['province'], row['postal_code']].filter((value) => value).join(' ');
      return [line1, line2].filter((value) => value).join('<br>');
    },
    filter(column) {
      let filterColumns = `concat(concat(province,' '),postal_code)`;
      filterColumns = `concat(concat(municipality,' '),${filterColumns})`;
      filterColumns = `concat(concat(civic_address,' '),${filterColumns})`;

      return column.search.value
        .split(' ')
        .filter((value, index, array) => value && array.indexOf(value) === index)
        .map((value) => `contains(tolower(${filterColumns}),'${oData__escapeValue(value.toLowerCase())}')`)
        .join(' and ');
    },
    orderBy(order) {
      let orderColumns = `concat(concat(province,' '),postal_code)`;
      orderColumns = `concat(concat(municipality,' '),${orderColumns})`;
      orderColumns = `concat(concat(civic_address,' '),${orderColumns})`;
      return `tolower(${orderColumns}) ${order.dir}`;
    }
  },

  primary_contact_first_name: {
    title: 'First Name - Primary Contact',
    className: 'minWidth',
    data: 'primary_contact_first_name'
  },
  primary_contact_last_name: {
    title: 'Last Name - Primary Contact',
    className: 'minWidth',
    data: 'primary_contact_last_name'
  },
  primary_contact_email: {
    title: 'Email - Primary Contact',
    className: 'minWidth',
    data: 'primary_contact_email'
  },
  primary_contact_primary_phone: {
    title: 'Primary Phone - Primary Contact',
    className: 'minWidth',
    data: 'primary_contact_primary_phone'
  },
  primary_contact_alternate_phone: {
    title: 'Alternate Phone - Primary Contact',
    className: 'minWidth',
    data: 'primary_contact_alternate_phone'
  },

  alternate_contact_first_name: {
    title: 'First Name - Alternate Contact',
    className: 'minWidth',
    data: 'alternate_contact_first_name'
  },
  alternate_contact_last_name: {
    title: 'Last Name - Alternate Contact',
    className: 'minWidth',
    data: 'alternate_contact_last_name'
  },
  alternate_contact_email: {
    title: 'Email - Alternate Contact',
    className: 'minWidth',
    data: 'alternate_contact_email'
  },
  alternate_contact_primary_phone: {
    title: 'Primary Phone - Alternate Contact',
    className: 'minWidth',
    data: 'alternate_contact_primary_phone'
  },
  alternate_contact_alternate_phone: {
    title: 'Alternate Phone - Alternate Contact',
    className: 'minWidth',
    data: 'alternate_contact_alternate_phone'
  },

  capacity: {
    title: 'Capacity',
    className: 'minWidth',
    data: 'capacity',
    type: 'number'
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
    className: 'minWidthLarge',
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