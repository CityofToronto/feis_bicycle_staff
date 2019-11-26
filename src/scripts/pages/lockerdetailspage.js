/* global Backbone renderForm */

/* exported renderLockerDetailsPage */
function renderLockerDetailsPage($container, id, query, auth, routeCbk) {
  if (id === 'new') {
    id = null;
  }

  if (query) {
    query = `?${query}`;
  } else {
    query = '';
  }

  $container.html(`
    <p><a href="#lockers${query}">Back to Lockers</a></p>

    ${id ? `
      <div class="navbar">
        <ul class="nav nav-tabs">
          <li class="nav-item active" role="presentation">
            <a class="nav-link">Locker</a>
          </li>
        </ul>
      </div>
    ` : ''}

    <div class="form"></div>
  `);

  let Model = Backbone.Model.extend({
    defaults: {
      number: 'string',
      description: 'string',
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
                title: 'Locker Location',
                bindTo: 'location',
                required: true,
                type: 'dropdown',
                choices: {
                  url: '/* @echo C3DATA_LOCATIONS */',
                  headers: auth && auth.sId ? { Authorization: `AuthSession ${auth.sId}` } : {},
                },
                choicesMap(result) {
                  if (!result || !Array.isArray(result.value)) {
                    return [];
                  }

                  return result.value.map((value) => ({
                    value: value.id,
                    text: value.name
                  }));
                }
              }
            ]
          }, {
            fields: [
              {
                title: 'Number',
                bindTo: 'number',
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
          }
        ]
      }
    ]
  };

  return renderForm($container.find('.form'), definition, {
    auth,
    model,
    url: '/* @echo C3DATA_LOCKERS */',

    routeCbk,

    statusChoices: '/* @echo C3DATAMEDIA_LOCKERS_STATUS_CHOICES */',

    saveButtonLabel: (model) => model.isNew() ? 'Create Locker' : 'Update Locker',
    cancelButtonLabel: 'Cancel',
    cancelButtonFragment: `lockers${query}`,
    removeButtonLabel: 'Remove Locker',
    removePromptValue: 'DELETE'
  });
}
