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

          <li class="nav-item" role="presentation">
            <a class="nav-link">Notes</a>
          </li>

          <li class="nav-item" role="presentation">
            <a class="nav-link">Inspections</a>
          </li>
        </ul>
      </div>
    ` : ''}

    <div class="form"></div>
  `);

  let Model = Backbone.Model.extend({
    defaults: {
      "location": "string",
      "location_site_name": "string",
      "number": "001",

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
                  beforeSend(jqXHR) {
                    if (auth && auth.sId) {
                      jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
                    }
                  }
                },
                choicesMap(result) {
                  if (!result || !Array.isArray(result.value)) {
                    return [];
                  }

                  return result.value.map((value) => ({
                    value: value.id,
                    text: value.site_name
                  }));
                }
              },
              {
                title: 'Number',
                bindTo: 'number',
                required: true
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

    saveButtonLabel: (model) => model.isNew() ? 'Create Locker' : 'Update Locker',
    cancelButtonLabel: 'Cancel',
    cancelButtonFragment: `lockers${query}`,
    removeButtonLabel: 'Remove Locker',
    removePromptValue: 'DELETE'
  });
}
