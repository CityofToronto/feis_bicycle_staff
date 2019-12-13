/* global Backbone moment */
/* global ajaxes */
/* global renderForm */
/* global locationInspectionsPage__lastOpt2 locationInspectionsPage__defaultOpt2 */

/* exported locationInspectionDetailsPage__fetch */
function locationInspectionDetailsPage__fetch(id, id2, auth) {
  return Promise.resolve().then(() => {
    if (id2 != 'new') {
      return ajaxes(`/* @echo C3DATA_LOCATION_INSPECTIONS */('${id2}')`, {
        contentType: 'application/json; charset=utf-8',
        method: 'GET',
        beforeSend(jqXHR) {
          if (auth && auth.sId) {
            jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
          }
        }
      });
    }

    return {
      data: {}
    };
  }).then(({ data }) => {
    let Model = Backbone.Model.extend({
      defaults: {
        date: moment().format('YYYY/MM/DD'),
        location: id,
        __Status: 'Active'
      }
    });

    return new Model(data);
  });
}

/* exported locationInspectionDetailsPage__render */
function locationInspectionDetailsPage__render($container, opt, id, opt2, id2, query, model, auth, updateCallback) {
  $container.html(`
    <p><a href="#locations/${opt}/${id}/inspections/${opt2}">Back to Locker Locations</a></p>

    <div class="navbar">
      <ul class="nav nav-tabs">
        <li class="nav-item" role="presentation">
          <a href="#locations/${opt}/${id}" class="nav-link">Location</a>
        </li>

        <li class="nav-item active" role="presentation">
          <a href="#locations/${opt}/${id}/inspections/${locationInspectionsPage__lastOpt2 || locationInspectionsPage__defaultOpt2}" class="nav-link">Inspections</a>
        </li>
      </ul>
    </div>

    <h2>${id ? 'Update Inspection' : 'New Inspection'}</h2>

    <div class="form"></div>
  `);

  const definition = {
    betterSuccess({ auth, model, url }) {
      let data = model.toJSON();
      delete data.__CreatedOn;
      delete data.__ModifiedOn;
      delete data.__Owner;

      data.date = moment(data.date, 'YYYY/MM/DD').format();

      const method = data.id ? 'PUT' : 'POST';

      return ajaxes({
        url: `${url}${data.id ? `('${data.id}')` : ''}`,
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(data),
        dataType: 'json',
        method,
        beforeSend(jqXHR) {
          if (auth && auth.sId) {
            jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
          }
        }
      }).then(({ data }) => {
        model.set(data);
        updateCallback();
      });
    },

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
    ]
  };

  return renderForm($container.find('.form'), definition, {
    auth,
    model,
    url: '/* @echo C3DATA_LOCATION_INSPECTIONS */',

    saveButtonLabel: (model) => model.isNew() ? 'Create Inspection' : 'Update Inspection',

    cancelButtonLabel: 'Cancel',
    cancelButtonFragment: `locations/${opt}/${id}/inspections/${opt2}`,

    removeButtonLabel: 'Remove Inspection',
    removePromptValue: 'DELETE'
  });
}
