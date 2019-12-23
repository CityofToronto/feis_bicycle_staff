/* global moment */

/* exported locations_datatable_columns */
const locations_datatable_columns = {
  action: {
    title: 'Action',
    className: 'excludeFromButtons openButtonWidth',
    data: 'id',
    orderable: false,
    searchable: false
  },

  site_name: {
    title: 'Name',
    className: 'minWidth',
    data: 'site_name'
  },

  __CreatedOn: {
    title: 'Created On',
    className: 'minWidth',
    data: '__CreatedOn',
    type: 'date',
    render(data) {
      const dataMoment = moment(data);
      if (dataMoment.isValid()) {
        return dataMoment.format('YYYY/MM/DD');
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
        return dataMoment.format('YYYY/MM/DD');
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
      return `<span class="label label-${data === 'Active' ? 'success' : data === 'Inactive' ? 'danger' : 'default'}" style="font-size: 90%;">${data}</span>`;
    }
  }
};

/* exported location_form_sections */
const location_form_sections = [
  {
    title: 'Details',

    rows: [
      {
        fields: [
          {
            title: 'Site Name',
            bindTo: 'site_name',
            required: true,
            className: 'col-sm-8'
          }
        ]
      },
      {
        fields: [
          {
            title: 'Street Address',
            bindTo: 'civic_address',
            className: 'col-sm-8'
          }
        ]
      },
      {
        fields: [
          {
            title: 'City',
            bindTo: 'municipality'
          },
          {
            title: 'Province',
            bindTo: 'province',
            type: 'dropdown',
            choices: '/* @echo C3DATAMEDIA_PROVINCE_CHOICES */'
          },
          {
            title: 'Postal Code',
            bindTo: 'postal_code',
            validationtype: 'PostalCode'
          }
        ]
      }
    ]
  }, {
    title: 'Contacts',

    rows: [
      {
        fields: [
          {
            type: 'html',
            html: '<h4>Primary Contact</h4>'
          }
        ]
      },
      {
        fields: [
          {
            title: 'First Name',
            bindTo: 'primary_contact_first_name',
            className: 'col-sm-4'
          },
          {
            title: 'Last Name',
            bindTo: 'primary_contact_last_name',
            className: 'col-sm-4'
          }
        ]
      },
      {
        fields: [
          {
            title: 'Email',
            bindTo: 'primary_contact_email'
          },
          {
            title: 'Primary Phone',
            bindTo: 'primary_contact_primary_phone'
          },
          {
            title: 'Alternate Phone',
            bindTo: 'primary_contact_alternate_phone'
          }
        ]
      },
      {
        fields: [
          {
            type: 'html',
            html: '<h4>Alternate Contact</h4>'
          }
        ]
      },
      {
        fields: [
          {
            title: 'First Name',
            bindTo: 'alternate_contact_first_name',
            className: 'col-sm-4'
          },
          {
            title: 'Last Name',
            bindTo: 'alternate_contact_last_name',
            className: 'col-sm-4'
          }
        ]
      },
      {
        fields: [
          {
            title: 'Email',
            bindTo: 'alternate_contact_email'
          },
          {
            title: 'Primary Phone',
            bindTo: 'alternate_contact_primary_phone'
          },
          {
            title: 'Alternate Phone',
            bindTo: 'alternate_contact_alternate_phone'
          }
        ]
      }
    ]
    // }, {
    //   title: 'Related Information',
    //   id: 'related',

    //   rows: [
    //     {
    //       fields: [
    //         {
    //           title: 'Total Lockers',
    //           bindTo: 'lockers_total',
    //           htmlAttr: { readOnly: true }
    //         },
    //         {
    //           title: 'Available Lockers',
    //           bindTo: 'lockers_assigned',
    //           htmlAttr: { readOnly: true }
    //         },
    //         {
    //           title: 'Assigned Lockers',
    //           bindTo: 'lockers_available',
    //           htmlAttr: { readOnly: true }
    //         }
    //       ]
    //     },
    //     {
    //       fields: [
    //         {
    //           type: 'html',
    //           html: '<h4>Latest Inspection</h4>'
    //         }
    //       ]
    //     },
    //     {
    //       fields: [
    //         {
    //           title: 'Date',
    //           bindTo: 'latest_inspection_date',
    //           htmlAttr: { readOnly: true },
    //           className: 'col-sm-4',

    //           postRender({ model, field }) {
    //             if (moment(model.get(field.bindTo)).isValid()) {
    //               $(`#${field.id}`).val(moment(model.get(field.bindTo)).format('YYYY/MM/DD'));
    //             }
    //           }
    //         },
    //         {
    //           title: 'Result',
    //           bindTo: 'latest_inspection_result',
    //           htmlAttr: { readOnly: true },
    //           className: 'col-sm-4'
    //         }
    //       ],
    //     }, {
    //       fields: [
    //         {
    //           title: 'Notes',
    //           bindTo: 'latest_inspection_notes',
    //           htmlAttr: { readOnly: true },
    //           type: 'textarea',
    //           rows: 5
    //         }
    //       ]
    //     }
    // ],

    // postRender({ model, section }) {
    //   const $section = $(`#${section.id}`);
    //   const handler = () => {
    //     if (model.isNew()) {
    //       $section.addClass('hide');
    //     } else {
    //       $section.removeClass('hide');
    //     }
    //   };
    //   model.on('change:id', handler);
    //   handler();
    // }
  }
];
