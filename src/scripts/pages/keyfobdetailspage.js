/* global Backbone renderForm */

/* exported renderKeyfobDetailsPage */
function renderKeyfobDetailsPage($container, id, query, auth, routeCbk) {
  if (id === 'new') {
    id = null;
  }

  $container.html(`
    <p><a href="#keyfobs">Back to Station Key Fobs</a></p>

    ${id ? `
      <div class="navbar">
        <ul class="nav nav-tabs">
          <li class="nav-item active" role="presentation">
            <a class="nav-link">Station Key Fob</a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link">Notes</a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link">Stations List</a>
          </li>
        </ul>
      </div>
    ` : ''}

    <div class="form"></div>
  `);

  let Model = Backbone.Model.extend({
    defaults: {
      stations: [],
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
                title: 'number',
                bindTo: 'number',
                required: true,
                className: 'col-xs-12 col-sm-4'
              },
              {
                title: 'Description',
                bindTo: 'description',
                type: 'textarea',
                rows: 5,
                className: 'col-xs-12 col-sm-8'
              }
            ]
          },
          {
            fields: [
              {
                title: 'Stations',
                bindTo: 'stations',
                required: true,
                type: 'multiselect',
                multiple: true,
                choices: {
                  url: '/* @echo C3DATA_STATIONS */',
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
          }
        ]
      }
    ]
  };

  return renderForm($container.find('.form'), definition, {
    auth,
    model,
    url: '/* @echo C3DATA_KEYFOBS */',

    routeCbk,

    statusChoices: '/* @echo C3DATAMEDIA_KEYFOBS_STATUS_CHOICES */',

    saveButtonLabel: (model) => model.isNew() ? 'Create Station Key Fob' : 'Update Station Key Fob',
    cancelButtonLabel: 'Cancel',
    cancelButtonFragment: 'keyfobs',
    removeButtonLabel: 'Remove Station Key Fob',
    removePromptValue: 'DELETE'
  });
}
