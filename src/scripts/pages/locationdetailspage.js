/* global $ Backbone moment */
/* global query__stringToObject query__objectToString */
/* global renderForm */

/* exported renderLocationDetailsPage */
function renderLocationDetailsPage($container, id, query, auth, routeCbk) {
  if (id === 'new') {
    id = null;
  }

  const { locations, inspections, lockers } = query__stringToObject(query);

  const navQuery = query__objectToString({ locations, inspections, lockers });
  $container.html(`
    <p><a href="#locations?${query__objectToString({ locations })}">Back to Locker Locations</a></p>

    ${id ? `
      <div class="navbar">
        <ul class="nav nav-tabs">
          <li class="nav-item active" role="presentation">
            <a href="#locations/${id}?${navQuery}" class="nav-link">Location</a>
          </li>

          <li class="nav-item" role="presentation">
            <a href="#locations/${id}/inspections?${navQuery}" class="nav-link">Inspections</a>
          </li>

          <li class="nav-item" role="presentation">
            <a class="nav-link">Lockers</a>
          </li>
        </ul>
      </div>
    ` : ''}

    <div class="form"></div>
  `);

  let Model = Backbone.Model.extend({
    defaults: {
      "site_name": "string",

      "civic_address": "55 John Street",
      "municipality": "Toronto",
      "province": "Ontario",
      "postal_code": "M5V 3C6",

      "primary_contact_first_name": "string",
      "primary_contact_last_name": "string",
      "primary_contact_email": "email@toronto.ca",
      "primary_contact_primary_phone": "416-555-5555",
      "primary_contact_alternate_phone": "416-555-5555",

      "alternate_contact_first_name": "string",
      "alternate_contact_last_name": "string",
      "alternate_contact_email": "email@toronto.ca",
      "alternate_contact_primary_phone": "416-555-5555",
      "alternate_contact_alternate_phone": "416-555-5555",

      "notes": "string",

      lockers_total: 0,
      lockers_assigned: 0,
      lockers_available: 0,

      __Status: 'Active'
    }
  });

  let model = new Model({ id });

  const definition = {
    sections: [
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
          },
          {
            fields: [
              {
                title: 'Notes',
                type: 'textarea',
                rows: 10,
                bindTo: 'notes'
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
      }, {
        title: 'Related Information',

        rows: [
          {
            fields: [
              {
                title: 'Total Lockers',
                bindTo: 'lockers_total',
                htmlAttr: { readOnly: true }
              },
              {
                title: 'Available Lockers',
                bindTo: 'lockers_assigned',
                htmlAttr: { readOnly: true }
              },
              {
                title: 'Assigned Lockers',
                bindTo: 'lockers_available',
                htmlAttr: { readOnly: true }
              }
            ]
          },
          {
            fields: [
              {
                type: 'html',
                html: '<h4>Latest Inspection</h4>'
              }
            ]
          },
          {
            fields: [
              {
                title: 'Date',
                bindTo: 'latest_inspection_date',
                htmlAttr: { readOnly: true },
                className: 'col-sm-4',

                postRender({ field }) {
                  $(`#${field.id}`).val(moment(model.get(field.bindTo)).format('YYYY/MM/DD'));
                }
              },
              {
                title: 'Result',
                bindTo: 'latest_inspection_result',
                htmlAttr: { readOnly: true },
                className: 'col-sm-4'
              }
            ],
          }, {
            fields: [
              {
                title: 'Notes',
                bindTo: 'latest_inspection_notes',
                htmlAttr: { readOnly: true },
                type: 'textarea',
                rows: 5
              }
            ]
          },
        ]
      }
    ]
  };

  return renderForm($container.find('.form'), definition, {
    auth,
    model,
    url: '/* @echo C3DATA_LOCATIONS */',

    routeCbk,

    saveButtonLabel: (model) => model.isNew() ? 'Create Locker Location' : 'Update Locker Location',
    cancelButtonLabel: 'Cancel',
    cancelButtonFragment: `locations?${query__objectToString({ locations })}`,
    removeButtonLabel: 'Remove Locker Location',
    removePromptValue: 'DELETE'
  });
}
