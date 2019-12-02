/* global Backbone */
/* global renderForm */

/* exported renderLocationDetailsPage */
function renderLocationDetailsPage($container, id, query, auth, routeCbk) {
  if (id === 'new') {
    id = null;
  }

  if (query) {
    query = `?${query}`;
  } else {
    query = '';
  }

  $container.html(`
    <p><a href="#locations${query}">Back to Locker Locations</a></p>

    ${id ? `
      <div class="navbar">
        <ul class="nav nav-tabs">
          <li class="nav-item active" role="presentation">
            <a class="nav-link">Location</a>
          </li>

          <li class="nav-item" role="presentation">
            <a class="nav-link">Notes</a>
          </li>

          <li class="nav-item" role="presentation">
            <a class="nav-link">Inspections</a>
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
      "locker_count": 0,
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
      "latest_inspection": "string",
      "latest_inspection_date": "2019-01-01T00:00:00.000-05:00",
      "latest_inspection_status": "Ok",
      "latest_inspection_report": "string",
      "latest_note": "string",
      "latest_note_note": "string",

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
                required: true
              }
            ]
          },
          {
            fields: [
              {
                title: 'Street Address',
                bindTo: 'civic_address'
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
    cancelButtonFragment: `locations${query}`,
    removeButtonLabel: 'Remove Locker Location',
    removePromptValue: 'DELETE'
  });
}
