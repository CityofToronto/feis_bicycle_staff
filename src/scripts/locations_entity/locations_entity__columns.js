/* global moment */
/* global oData__escapeValue */
/* global entity__columns */

/* exported locationsEntity__columns */
const locationsEntity__columns = {
  action: entity__columns.action,

  id: entity__columns.id,

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
  province: ({ auth }) => ({
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
    title: 'Primary Contact - First Name',
    data: 'primary_contact_first_name',
    type: 'string',
    className: 'minWidth'
  },
  primary_contact_last_name: {
    title: 'Primary Contact - Last Name',
    data: 'primary_contact_last_name',
    type: 'string',
    className: 'minWidth'
  },
  primary_contact_email: {
    title: 'Primary Contact - Email',
    data: 'primary_contact_email',
    type: 'string',
    className: 'minWidth'
  },
  primary_contact_primary_phone: {
    title: 'Primary Contact - Primary Phone',
    data: 'primary_contact_primary_phone',
    type: 'string',
    className: 'minWidth'
  },
  primary_contact_alternate_phone: {
    title: 'Primary Contact - Alternate Phone',
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
    title: 'Alternate Contact - First Name',
    data: 'alternate_contact_first_name',
    type: 'string',
    className: 'minWidth'
  },
  alternate_contact_last_name: {
    title: 'Alternate Contact - Last Name',
    data: 'alternate_contact_last_name',
    type: 'string',
    className: 'minWidth'
  },
  alternate_contact_email: {
    title: 'Alternate Contact - Email',
    data: 'alternate_contact_email',
    type: 'string',
    className: 'minWidth'
  },
  alternate_contact_primary_phone: {
    title: 'Alternate Contact - Primary Phone',
    data: 'alternate_contact_primary_phone',
    type: 'string',
    className: 'minWidth'
  },
  alternate_contact_alternate_phone: {
    title: 'Alternate Contact - Alternate Phone',
    data: 'alternate_contact_alternate_phone',
    type: 'string',
    className: 'minWidth'
  },

  lockers_total: {
    title: 'Lockers',
    data: 'lockers_total',
    type: 'number',
    className: 'minWidth'
  },
  occupied: {
    title: 'Occupied',
    data: 'occupied',
    type: 'number',
    className: 'minWidth'
  },
  available: {
    title: 'Available',
    data: 'available',
    type: 'number',
    className: 'minWidth'
  },

  latest_note: {
    title: 'Latest Note - ID',
    data: 'latest_note',
    type: 'string',
    className: 'minWidth'
  },
  latest_note__date: {
    title: 'Latest Note - Date',
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
    title: 'Latest Inspection - ID',
    data: 'latest_inspection',
    type: 'string',
    className: 'minWidth'
  },
  latest_inspection__date: {
    title: 'Latest Inspection - Date',
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
  latest_inspection__result: ({ auth }) => ({
    title: 'Latest Inspection - Result',
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
    title: 'Latest Inspection - Note',
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

  __CreatedOn: entity__columns.__CreatedOn,
  __ModifiedOn: entity__columns.__ModifiedOn,
  __Owner: entity__columns.__Owner,
  __Status: entity__columns.__Status
};
