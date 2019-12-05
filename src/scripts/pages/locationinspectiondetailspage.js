/* global Backbone moment */
/* global query_objectToString query_stringToObject */
/* global renderForm */

/* exported renderLocationInspectionDetailsPage */
function renderLocationInspectionDetailsPage($container, location, id, query, auth, routeCbk) {
  if (id === 'new') {
    id = null;
  }

  const { locations, inspections, lockers } = query_stringToObject(query);

  const navQuery = query_objectToString({ locations, inspections, lockers });
  $container.html(`
    <p><a href="#locations?${query_objectToString({ locations })}">Back to Locker Locations</a></p>

    <div class="navbar">
      <ul class="nav nav-tabs">
        <li class="nav-item" role="presentation">
          <a href="#locations/${location}?${navQuery}" class="nav-link">Location</a>
        </li>

        <li class="nav-item active" role="presentation">
          <a href="#locations/${location}/inspections?${navQuery}" class="nav-link">Inspections</a>
        </li>

        <li class="nav-item" role="presentation">
          <a class="nav-link">Lockers</a>
        </li>
      </ul>
    </div>

    <h2>${id ? 'Update Inspection' : 'New Inspection'}</h2>

    <div class="form"></div>
  `);

  let Model = Backbone.Model.extend({
    defaults: {
      location,

      date: moment().format('YYYY/MM/DD'),

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
                title: 'Date',
                bindTo: 'date',
                className: 'col-sm-4',
                required: true,
                type: 'datetimepicker',
                options: {
                  format: 'YYYY/MM/DD'
                }
              },
              {
                title: 'Result',
                bindTo: 'result',
                className: 'col-sm-4',
                type: 'dropdown',
                choices: '/* @echo C3DATAMEDIA_INSPECTION_RESULT_CHOICES */',
                required: true
              }
            ],
          }, {
            fields: [
              {
                title: 'Notes',
                bindTo: 'notes',
                type: 'textarea',
                rows: 10
              }
            ]
          },
        ]
      }
    ],

    prepareData(data) {
      data.date = moment(data.date, 'YYYY/MM/DD').format();
      return data;
    }
  };

  return renderForm($container.find('.form'), definition, {
    auth,
    model,
    url: '/* @echo C3DATA_LOCATION_INSPECTIONS */',

    routeCbk() {
      if (!model.isNew()) {
        $container.find('h2').html('Update Inspection');
      }

      routeCbk(model);
    },

    saveButtonLabel: (model) => model.isNew() ? 'Create Inspection' : 'Update Inspection',
    cancelButtonLabel: 'Cancel',
    cancelButtonFragment: `locations/${location}/inspections?${query_objectToString({ locations, inspections, lockers })}`,
    removeButtonLabel: 'Remove Inspection',
    removePromptValue: 'DELETE'
  });
}
