/* global Backbone renderForm */

/* exported renderCustomersDetailsPage */
function renderCustomersDetailsPage($container, id, query, auth, routeCbk) {
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
            <a class="nav-link">Staffs</a>
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
      name: 'string',
      description: 'string',
      civic_address: 'string',
      municipality: 'Toronto',
      province: 'Ontario',
      postal_code: 'string',
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
                title: 'Name',
                bindTo: 'name',
                required: true,
                className: 'col-xs-12 col-sm-4'
              },
              {
                title: 'Description',
                bindTo: 'description',
                type: 'textarea',
                rows: 3,
                className: 'col-xs-12 col-sm-8'
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
