/* global $ Backbone moment */
/* global ajaxes auth__checkLogin fixButtonLinks modal__showConfirm query__objectToString query__stringToObject
   renderAlert toSnapShot */
/* global renderForm */
/* global locations_form_fields */

/* exported renderLocationDetailsPage */
function renderLocationDetailsPage(app, $container, router, auth, opt, id, query) {
  return auth__checkLogin(auth).then((isLoggedIn) => {
    if (!isLoggedIn) {
      const query = query__objectToString({ redirect: Backbone.history.getFragment() });
      router.navigate(`login?${query}`, { trigger: true });
      return;
    }

    const breadcrumbs = [{ name: app.name, link: '#home' }, { name: 'Locations', link: '#locations' }];
    switch (opt) {
      default:
        breadcrumbs.push({ name: 'All', link: `#locations/all` });
    }

    const {
      redirectTo = 'Locations',
      redirectToFragment = `locations/${opt}`
    } = query__stringToObject(query);
    $container.html(`<p><a href="#${redirectToFragment}">Back to ${redirectTo}</a></p>`);

    return Promise.resolve().then(() => {
      if (id !== 'new') {
        return ajaxes({
          beforeSend(jqXHR) {
            if (auth && auth.sId) {
              jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
            }
          },
          contentType: 'application/json; charset=utf-8',
          method: 'GET',
          url: `/* @echo C3DATA_LOCATIONS_URL */('${id}')`
        });
      }

      return { data: {} };
    }).then(({ data }) => {
      const $tabContainer = $('<div></div>').appendTo($container);
      function renderNavBar(finalId) {
        $tabContainer.html(`
          <div class="navbar">
            <ul class="nav nav-tabs">
              <li class="nav-item active" role="presentation">
                <a href="#locations/${opt}/${finalId}" class="nav-link">Location</a>
              </li>

              <!--
              <li class="nav-item" role="presentation">
                <a href="#locations/${opt}/${finalId}/inspections/all" class="nav-link">Notes</a>
              </li>

              <li class="nav-item" role="presentation">
                <a href="#locations/${opt}/${finalId}/inspections/all" class="nav-link">Inspections</a>
              </li>

              <li class="nav-item" role="presentation">
                <a href="#locations/${opt}/${finalId}/inspections/all" class="nav-link">Lockers</a>
              </li>
              -->
            </ul>
          </div>
        `);
        fixButtonLinks($tabContainer);
      }
      if (id !== 'new') {
        renderNavBar(id);
      }

      const momentLatestNoteDate = moment(data.latest_note__date);
      if (momentLatestNoteDate.isValid()) {
        data.latest_note__date = momentLatestNoteDate.format('YYYY/MM/DD h:mm A');
      }

      const momentLatestInspectionDate = moment(data.latest_inspection__date);
      if (momentLatestInspectionDate.isValid()) {
        data.moment_latest_inspection__date = momentLatestInspectionDate.format('YYYY/MM/DD h:mm A');
      }

      const definition = {
        successCore(data, options = {}) {
          const { auth, id, url } = options;

          const momentLatestNoteDate = moment(data.latest_note__date, 'YYYY/MM/DD h:mm A');
          if (momentLatestNoteDate.isValid()) {
            data.latest_note__date = momentLatestNoteDate.format();
          }

          const momentLatestInspectionDate = moment(data.latest_inspection__date, 'YYYY/MM/DD h:mm A');
          if (momentLatestInspectionDate.isValid()) {
            data.moment_latest_inspection__date = momentLatestInspectionDate.format();
          }

          return ajaxes({
            url: `${url}${id ? `('${id}')` : ''}`,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(data),
            dataType: 'json',
            method: id ? 'PUT' : 'POST',
            beforeSend(jqXHR) {
              if (auth && auth.sId) {
                jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
              }
            }
          }).then(({ data, textStatus, jqXHR }) => {
            const momentLatestNoteDate = moment(data.latest_note__date);
            if (momentLatestNoteDate.isValid()) {
              data.latest_note__date = momentLatestNoteDate.format('YYYY/MM/DD h:mm A');
            }

            const momentLatestInspectionDate = moment(data.latest_inspection__date);
            if (momentLatestInspectionDate.isValid()) {
              data.moment_latest_inspection__date = momentLatestInspectionDate.format('YYYY/MM/DD h:mm A');
            }

            snapShot = toSnapShot(data);
            renderNavBar(data.id);

            router.navigate(`locations/${opt}/${data.id}`, { trigger: false, replace: true });
            app.setBreadcrumb(breadcrumbs.concat({ name: data.site_name }), true);
            app.setTitle(data.site_name);

            return { data, textStatus, jqXHR };
          });
        },

        // sections: location_form_sections()
        sections: [
          {
            title: 'Details',

            rows: [
              {
                fields: [
                  Object.assign({}, locations_form_fields.site_name, { className: 'col-sm-8' })
                ]
              },
              {
                fields: [
                  Object.assign({}, locations_form_fields.civic_address, { className: 'col-sm-8' })
                ]
              },
              {
                fields: [
                  locations_form_fields.municipality,
                  locations_form_fields.province(auth),
                  locations_form_fields.postal_code
                ]
              }
            ]
          },
          {
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
                  Object.assign({}, locations_form_fields.primary_contact_first_name, { title: 'First Name', className: 'col-sm-4' }),
                  Object.assign({}, locations_form_fields.primary_contact_last_name, { title: 'Last Name', className: 'col-sm-4' })
                ]
              },
              {
                fields: [
                  Object.assign({}, locations_form_fields.primary_contact_email, { title: 'Email' }),
                  Object.assign({}, locations_form_fields.primary_contact_primary_phone, { title: 'Primary Phone' }),
                  Object.assign({}, locations_form_fields.primary_contact_alternate_phone, { title: 'Alternate Phone' })
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
                  Object.assign({}, locations_form_fields.alternate_contact_first_name, { title: 'First Name', className: 'col-sm-4' }),
                  Object.assign({}, locations_form_fields.alternate_contact_last_name, { title: 'Last Name', className: 'col-sm-4' })
                ]
              },
              {
                fields: [
                  Object.assign({}, locations_form_fields.alternate_contact_email, { title: 'Email' }),
                  Object.assign({}, locations_form_fields.alternate_contact_primary_phone, { title: 'Primary Phone' }),
                  Object.assign({}, locations_form_fields.alternate_contact_alternate_phone, { title: 'Alternate Phone' })
                ]
              }
            ]
          },
          {
            title: 'Latest Note',
            id: 'latest_note',
            postRender({ model, section }) {
              function handler() {
                if (model.isNew()) {
                  $(`#${section.id}`).hide();
                } else {
                  $(`#${section.id}`).show();
                }
              }
              handler();
              model.on(`change:${model.idAttribute}`, handler);
            },

            rows: [
              {
                fields: [
                  Object.assign({}, locations_form_fields.latest_note__date, { title: 'Date', className: 'col-sm-4' })
                ]
              },
              {
                fields: [
                  Object.assign({}, locations_form_fields.latest_note__note, { title: 'Note' })
                ]
              }
            ]
          },
          {
            title: 'Latest Inspection',
            id: 'latest_inspection',
            postRender({ model, section }) {
              function handler() {
                if (model.isNew()) {
                  $(`#${section.id}`).hide();
                } else {
                  $(`#${section.id}`).show();
                }
              }
              handler();
              model.on(`change:${model.idAttribute}`, handler);
            },

            rows: [
              {
                fields: [
                  Object.assign({}, locations_form_fields.latest_inspection__date, { title: 'Date', className: 'col-sm-4' }),
                  Object.assign({}, locations_form_fields.latest_inspection__result, { title: 'Result', className: 'col-sm-4' })
                ]
              },
              {
                fields: [
                  Object.assign({}, locations_form_fields.latest_inspection__note, { title: 'Note' })
                ]
              }
            ]
          }
        ]
      };

      const Model = Backbone.Model.extend({
        defaults: {
          municipality: 'Toronto',
          province: 'Ontario',
        }
      });
      const model = new Model(data);
      let snapShot = toSnapShot(model.toJSON());

      return Promise.resolve().then(() => {
        return renderForm($('<div></div>').appendTo($container), definition, model, {
          auth,
          url: '/* @echo C3DATA_LOCATIONS_URL */',

          saveButtonLabel: (model) => model.isNew() ? 'Create Location' : 'Update Location',

          cancelButtonLabel: 'Cancel',
          cancelButtonFragment: `locations/${opt}`,

          removeButtonLabel: 'Remove Location',
          removePromptValue: 'DELETE'
        });
      }).then(() => {
        if (id === 'new') {
          app.setBreadcrumb(breadcrumbs.concat({ name: 'New Location' }), true);
          app.setTitle('New Location');
        } else {
          app.setBreadcrumb(breadcrumbs.concat({ name: data.site_name }), true);
          app.setTitle(data.site_name);
        }

        return () => {
          if (snapShot !== toSnapShot(model.toJSON())) {
            return modal__showConfirm('There may be one or more unsaved data. Do you want to continue?', {
              title: 'Confirm',
              confirmButtonLabel: 'Continue'
            });
          }
        };
      });
    }, (error) => {
      app.setBreadcrumb(breadcrumbs.concat({ name: 'Error' }), true);
      app.setTitle('An Error has Occured');

      renderAlert($container, '<p>An error occured while fetching data.</p>', {
        bootstrayType: 'danger',
        position: 'bottom'
      });

      console.error(error); // eslint-disable-line no-console
    });
  }, (error) => {
    console.error(error); // eslint-disable-line no-console
  });
}
