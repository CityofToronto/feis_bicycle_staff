/* global moment */
/* global oData__escapeValue query__objectToString */

/* exported entityCustomers__columns */
const entityCustomers__columns = {
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

  first_name: {
    title: 'First Name',
    className: 'minWidth',
    data: 'first_name'
  },
  last_name: {
    title: 'Last Name',
    className: 'minWidth',
    data: 'last_name'
  },
  title: {
    title: 'Title',
    className: 'minWidth',
    data: 'title'
  },

  email: {
    title: 'Email',
    className: 'minWidth',
    data: 'email'
  },
  primary_phone: {
    title: 'Primary Phone',
    className: 'minWidth',
    data: 'primary_phone'
  },
  alternate_phone: {
    title: 'Alternate Phone',
    className: 'minWidth',
    data: 'alternate_phone'
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

  request_type: {},
  request_locker_choice_1: {},
  request_locker_choice_2: {},
  request_locker_choice_3: {},
  request_station_choice_1: {},
  request_station_choice_2: {},
  request_station_choice_3: {},

  bicycle_1_make: {
    title: 'Bicycle 1 Make',
    className: 'minWidth',
    data: 'bicycle_1_make'
  },
  bicycle_1_model: {
    title: 'Bicycle 1 Model',
    className: 'minWidth',
    data: 'bicycle_1_model'
  },
  bicycle_1_colour: {
    title: 'Bicycle 1 Colour',
    className: 'minWidth',
    data: 'bicycle_1_colour'
  },
  bicycle_2_make: {
    title: 'Bicycle 2 Make',
    className: 'minWidth',
    data: 'bicycle_2_make'
  },
  bicycle_2_model: {
    title: 'Bicycle 2 Model',
    className: 'minWidth',
    data: 'bicycle_2_model'
  },
  bicycle_2_colour: {
    title: 'Bicycle 2 Colour',
    className: 'minWidth',
    data: 'bicycle_2_colour'
  },

  subscription_start_date: {},
  subscription_expiration_date: {},
  subscription_end_date: {},

  locker: {
    title: 'Locker ID',
    className: 'minWidth',
    data: 'locker'
  },
  locker__name: {
    title: 'Locker',
    className: 'minWidth',
    data: 'locker__name'
  },
  locker_key_date_assigned: {},
  locker_key_date_returned: {},

  station: {
    title: 'Station ID',
    className: 'minWidth',
    data: 'station'
  },
  station__site_name: {
    title: 'Station',
    className: 'minWidth',
    data: 'station__site_name'
  },

  keyfob: {
    title: 'Key Fob ID',
    className: 'minWidth',
    data: 'keyfob'
  },
  keyfob__number: {
    title: 'Key Fob',
    className: 'minWidth',
    data: 'keyfob__number'
  },
  keyfob_date_assigned: {
    title: 'Key Fob Date Assigned',
    className: 'minWidth',
    data: 'keyfob_date_assigned'
  },
  keyfob_date_returned: {
    title: 'SKey Fob Date Returned',
    className: 'minWidth',
    data: 'keyfob_date_returned'
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
  __Status: {
    title: 'Status',
    className: 'statusWidth',
    data: '__Status',
    type: 'string',
    searchType: 'equals',
    choices: [{ text: 'Active' }, { text: 'Inactive' }],
    render(data) {
      const labelClass = data === 'Active' ? 'success' : data === 'Inactive' ? 'danger' : 'default';
      return `<span class="label label-${labelClass}" style="font-size: 90%;">${data}</span>`;
    }
  }
};
