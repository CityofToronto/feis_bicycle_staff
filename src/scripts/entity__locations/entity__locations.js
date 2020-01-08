/* global moment */
/* global query__objectToString */

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
    className: 'minWidth'
  },

  site_name: {
    title: 'Site Name',
    data: 'site_name',
    className: 'minWidth'
  },
  description: {
    title: 'Description',
    data: 'description',
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
    className: 'minWidth'
  },
  municipality: {
    title: 'City',
    data: 'municipality',
    className: 'minWidth'
  },
  province: (auth) => ({
    title: 'Province',
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
    className: 'minWidth'
  }),
  postal_code: {
    title: 'Postal Code',
    data: 'postal_code',
    className: 'minWidth'
  },

  primary_contact_first_name: {
    title: 'First Name - Primary Contact',
    data: 'primary_contact_first_name',
    className: 'minWidth'
  },
  primary_contact_last_name: {
    title: 'Last Name - Primary Contact',
    data: 'primary_contact_last_name',
    className: 'minWidth',
  },
  primary_contact_email: {
    title: 'Email - Primary Contact',
    data: 'primary_contact_email',
    className: 'minWidth',
  },
  primary_contact_primary_phone: {
    title: 'Primary Phone - Primary Contact',
    data: 'primary_contact_primary_phone',
    className: 'minWidth',
  },
  primary_contact_alternate_phone: {
    title: 'Alternate Phone - Primary Contact',
    data: 'primary_contact_alternate_phone',
    className: 'minWidth',
  },

  alternate_contact_first_name: {
    title: 'First Name - Alternate Contact',
    data: 'alternate_contact_first_name',
    className: 'minWidth',
  },
  alternate_contact_last_name: {
    title: 'Last Name - Alternate Contact',
    data: 'alternate_contact_last_name',
    className: 'minWidth',
  },
  alternate_contact_email: {
    title: 'Email - Alternate Contact',
    data: 'alternate_contact_email',
    className: 'minWidth',
  },
  alternate_contact_primary_phone: {
    title: 'Primary Phone - Alternate Contact',
    data: 'alternate_contact_primary_phone',
    className: 'minWidth',
  },
  alternate_contact_alternate_phone: {
    title: 'Alternate Phone - Alternate Contact',
    data: 'alternate_contact_alternate_phone',
    className: 'minWidth',
  },

  lockers_total: {
    title: 'Total Lockers',
    className: 'minWidth',
    data: 'id',
    searchable: false
  },

  latest_note: {
    title: 'Latest Note ID',
    className: 'minWidth',
    data: 'id',
    searchable: false
  },
  // latest_note__date: {
  //   title: 'Latest Note Date',
  //   className: 'minWidth',
  //   data: 'id',
  //   searchable: false
  // },
  // latest_note__note: {
  //   title: 'Latest Note',
  //   className: 'minWidthLarge',
  //   data: 'id',
  //   searchable: false
  // },

  latest_inspection: {
    title: 'Latest Inspection ID',
    className: 'minWidth',
    data: 'latest_inspection',
    searchable: false,
    orderable: false
  },
  // latest_inspection__date: {
  //   title: 'Latest Inspection Date',
  //   className: 'minWidth',
  //   data: 'latest_inspection__date',
  //   searchable: false,
  //   orderable: false
  // },
  // latest_inspection__result: {
  //   title: 'Latest Inspection Result',
  //   className: 'minWidth',
  //   data: 'latest_inspection__result',
  //   searchable: false,
  //   orderable: false
  // },
  // latest_inspection__note: {
  //   title: 'Latest Note',
  //   className: 'minWidthLarge',
  //   data: 'latest_inspection__note',
  //   searchable: false,
  //   orderable: false
  // },

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
