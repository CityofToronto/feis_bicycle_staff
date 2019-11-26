/* global Backbone renderForm */

/* exported renderStationDetailsPage */
function renderStationDetailsPage($container, id, query, auth, routeCbk) {
  if (id === 'new') {
    id = null;
  }

  if (query) {
    query = `?${query}`;
  } else {
    query = '';
  }

  $container.html(`
    <p><a href="#stations${query}">Back to Stations</a></p>

    ${id ? `
      <div class="navbar">
        <ul class="nav nav-tabs">
          <li class="nav-item active" role="presentation">
            <a class="nav-link">Station</a>
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
      capacity: 0,
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
                className: 'col-xs-12 col-sm-8',
                type: 'textarea',
                row: 3
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
          },
          {
            fields: [
              {
                title: 'Capacity',
                bindTo: 'capacity',
                type: 'number',
                required: true,
                className: 'col-xs-12 col-sm-4'
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
    url: '/* @echo C3DATA_STATIONS */',

    routeCbk,

    statusChoices: '/* @echo C3DATAMEDIA_STATIONS_STATUS_CHOICES */',

    saveButtonLabel: (model) => model.isNew() ? 'Create Station' : 'Update Station',
    cancelButtonLabel: 'Cancel',
    cancelButtonFragment: `stations${query}`,
    removeButtonLabel: 'Remove Station',
    removePromptValue: 'DELETE'
  });
}
