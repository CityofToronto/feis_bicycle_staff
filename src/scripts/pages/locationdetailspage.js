/* global $ Backbone moment */
/* global ajaxes query__stringToObject */
/* global renderForm */
/* global locationInspectionsPage__defaultOpt2 locationInspectionsPage__lastOpt2
  locationInspectionsPage__stateSaveWebStorageKey */

/* exported locationDetailsPage__fetch */
function locationDetailsPage__fetch(id, auth) {
  return Promise.resolve().then(() => {
    if (id != 'new') {
      return ajaxes(`/* @echo C3DATA_LOCATIONS */('${id}')`, {
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
        // "site_name": "string",

        // "civic_address": "55 John Street",
        // "municipality": "Toronto",
        // "province": "Ontario",
        // "postal_code": "M5V 3C6",

        // "primary_contact_first_name": "string",
        // "primary_contact_last_name": "string",
        // "primary_contact_email": "email@toronto.ca",
        // "primary_contact_primary_phone": "416-555-5555",
        // "primary_contact_alternate_phone": "416-555-5555",

        // "alternate_contact_first_name": "string",
        // "alternate_contact_last_name": "string",
        // "alternate_contact_email": "email@toronto.ca",
        // "alternate_contact_primary_phone": "416-555-5555",
        // "alternate_contact_alternate_phone": "416-555-5555",

        // "notes": "string",

        lockers_total: 0,
        lockers_assigned: 0,
        lockers_available: 0,

        __Status: 'Active'
      }
    });

    return new Model(data);
  });
}

/* exported locationDetailsPage__render */
function locationDetailsPage__render($container, opt, id, query, model, auth, updateCallback) {
  const { resetState } = query__stringToObject(query);
  if (resetState === 'yes') {
    sessionStorage.removeItem(locationInspectionsPage__stateSaveWebStorageKey);
  }

  $container.html(`
    <p><a href="#locations/${opt}">Back to Locker Locations</a></p>

    <div class="navbarContainer"></div>

    <div class="form"></div>
  `);

  function renderNavBar() {
    $container.find('.navbarContainer').html(`
      <div class="navbar">
        <ul class="nav nav-tabs">
          <li class="nav-item active" role="presentation">
            <a href="#locations/${opt}/${model.id}" class="nav-link">Location</a>
          </li>

          <li class="nav-item" role="presentation">
            <a href="#locations/${opt}/${id}/inspections/${locationInspectionsPage__lastOpt2 || locationInspectionsPage__defaultOpt2}" class="nav-link">Inspections</a>
          </li>
        </ul>
      </div>
    `);
  }

  if (!model.isNew()) {
    renderNavBar();
  }

  const definition = {
    betterSuccess({ auth, model, url }) {
      let data = model.toJSON();
      delete data.__CreatedOn;
      delete data.__ModifiedOn;
      delete data.__Owner;

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
        renderNavBar();
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
        id: 'related',

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
                  if (moment(model.get(field.bindTo)).isValid()) {
                    $(`#${field.id}`).val(moment(model.get(field.bindTo)).format('YYYY/MM/DD'));
                  }
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
        ],

        postRender({ section }) {
          const $section = $(`#${section.id}`);
          const handler = () => {
            if (model.isNew()) {
              $section.addClass('hide');
            } else {
              $section.removeClass('hide');
            }
          };
          model.on('change:id', handler);
          handler();
        }
      }
    ]
  };

  return renderForm($container.find('.form'), definition, {
    auth,
    model,
    url: '/* @echo C3DATA_LOCATIONS */',

    saveButtonLabel: (model) => model.isNew() ? 'Create Locker Location' : 'Update Locker Location',

    cancelButtonLabel: 'Cancel',
    cancelButtonFragment: `locations/${opt}`,

    removeButtonLabel: 'Remove Locker Location',
    removePromptValue: 'DELETE'
  });
}
