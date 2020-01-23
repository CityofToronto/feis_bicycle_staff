/* global moment */
/* global oData__escapeValue query__objectToString */

/* exported entityLocations__columns */
const entityLocations__columns = {
  action: (fragmentPrefix) => ({
    title: 'Action',
    data: 'id',
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
    className: 'minWidth'
  },

  site_name: {
    title: 'Site Name',
    data: 'site_name',
    type: 'string',
    className: 'minWidth'
  },
  description: {
    title: 'Description',
    data: 'description',
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

  civic_address: {
    title: 'Address',
    data: 'civic_address',
    type: 'string',
    className: 'minWidth'
  },
  municipality: {
    title: 'City',
    data: 'municipality',
    type: 'string',
    className: 'minWidth'
  },
  province: (auth) => ({
    title: 'Province',
    data: 'province',
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
      url: '/* @echo C3DATAMEDIA_PROVINCE_CHOICES */',
      webStorage: sessionStorage
    },
    className: 'minWidth'
  }),
  postal_code: {
    title: 'Postal Code',
    data: 'postal_code',
    type: 'string',
    className: 'minWidth'
  },

  address: {
    title: 'Address',
    data: 'civic_address',
    type: 'function',
    select: ['municipality', 'province', 'postal_code'],
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
    },
    className: 'minWidth',
    render(data, settings, row) {
      const line1 = data;
      const line2 = [row['municipality'], row['province'], row['postal_code']].filter((value) => value).join(' ');
      return [line1, line2].filter((value) => value).join('<br>');
    }
  },

  primary_contact_first_name: {
    title: 'First Name - Primary Contact',
    data: 'primary_contact_first_name',
    type: 'string',
    className: 'minWidth'
  },
  primary_contact_last_name: {
    title: 'Last Name - Primary Contact',
    data: 'primary_contact_last_name',
    type: 'string',
    className: 'minWidth'
  },
  primary_contact_email: {
    title: 'Email - Primary Contact',
    data: 'primary_contact_email',
    type: 'string',
    className: 'minWidth'
  },
  primary_contact_primary_phone: {
    title: 'Primary Phone - Primary Contact',
    data: 'primary_contact_primary_phone',
    type: 'string',
    className: 'minWidth'
  },
  primary_contact_alternate_phone: {
    title: 'Alternate Phone - Primary Contact',
    data: 'primary_contact_alternate_phone',
    type: 'string',
    className: 'minWidth'
  },

  contact: {
    title: 'Contact',
    data: 'primary_contact_first_name',
    type: 'function',
    select: ['primary_contact_last_name'],
    filter(column) {
      let filterColumns = `concat(concat(primary_contact_first_name,' '),primary_contact_last_name)`;

      return column.search.value
        .split(' ')
        .filter((value, index, array) => value && array.indexOf(value) === index)
        .map((value) => `contains(tolower(${filterColumns}),'${oData__escapeValue(value.toLowerCase())}')`)
        .join(' and ');
    },
    orderBy(order) {
      let orderColumns = `concat(concat(primary_contact_first_name,' '),primary_contact_last_name)`;

      return `tolower(${orderColumns}) ${order.dir}`;
    },
    className: 'minWidth',
    render(data, settings, row) {
      return [data, row['primary_contact_last_name']].filter((value) => value).join(' ');
    }
  },
  phone: {
    title: 'Phone',
    data: 'primary_contact_primary_phone',
    type: 'function',
    select: ['primary_contact_alternate_phone'],
    filter(column) {
      let filterColumns = `concat(concat(primary_contact_primary_phone,' '),primary_contact_alternate_phone)`;

      return column.search.value
        .split(' ')
        .filter((value, index, array) => value && array.indexOf(value) === index)
        .map((value) => `contains(tolower(${filterColumns}),'${oData__escapeValue(value.toLowerCase())}')`)
        .join(' and ');
    },
    orderBy(order) {
      let orderColumns = `concat(concat(primary_contact_primary_phone,' '),primary_contact_alternate_phone)`;

      return `tolower(${orderColumns}) ${order.dir}`;
    },
    className: 'minWidth',
    render(data, settings, row) {
      return [data, row['primary_contact_alternate_phone']].filter((value) => value).join(' / ');
    }
  },

  alternate_contact_first_name: {
    title: 'First Name - Alternate Contact',
    data: 'alternate_contact_first_name',
    type: 'string',
    className: 'minWidth'
  },
  alternate_contact_last_name: {
    title: 'Last Name - Alternate Contact',
    data: 'alternate_contact_last_name',
    type: 'string',
    className: 'minWidth'
  },
  alternate_contact_email: {
    title: 'Email - Alternate Contact',
    data: 'alternate_contact_email',
    type: 'string',
    className: 'minWidth'
  },
  alternate_contact_primary_phone: {
    title: 'Primary Phone - Alternate Contact',
    data: 'alternate_contact_primary_phone',
    type: 'string',
    className: 'minWidth'
  },
  alternate_contact_alternate_phone: {
    title: 'Alternate Phone - Alternate Contact',
    data: 'alternate_contact_alternate_phone',
    type: 'string',
    className: 'minWidth'
  },

  lockers_total: {
    title: 'Total Lockers',
    data: 'lockers_total',
    type: 'number',
    className: 'minWidth'
  },

  latest_note: {
    title: 'Latest Note ID',
    data: 'latest_note',
    type: 'string',
    className: 'minWidth'
  },
  latest_note__date: {
    title: 'Latest Note Date',
    data: 'latest_note__date',
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
  latest_note__note: {
    title: 'Latest Note',
    data: 'latest_note__note',
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

  latest_inspection: {
    title: 'Latest Inspection ID',
    data: 'latest_inspection',
    type: 'string',
    className: 'minWidth'
  },
  latest_inspection__date: {
    title: 'Latest Inspection Date',
    data: 'latest_inspection__date',
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
  latest_inspection__result: (auth) => ({
    title: 'Latest Inspection Result',
    data: 'latest_inspection__result',
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
      url: '/* @echo C3DATAMEDIA_INSPECTION_CHOICES */',
      webStorage: sessionStorage
    },
    className: 'minWidth',
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
    data: 'latest_inspection__note',
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
