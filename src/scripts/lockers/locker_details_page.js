/* global $ Backbone */
/* global ajaxes auth__checkLogin fixButtonLinks modal__showConfirm query__objectToString query__stringToObject
   renderAlert toSnapShot */
/* global renderForm */
/* global renderLockersPage__views renderLocationDetailsNotesPage__currentView renderLocationDetailsNotesPage__resetState
   renderLocationDetailsInspectionsPage__resetState renderLocationDetailsInspectionsPage__currentView entityLockerDetails__fields */

/* exported renderLockerDetailsPage */
function renderLockerDetailsPage(app, $container, router, auth, opt, id, query) {
  if (!(opt in renderLockersPage__views)) {
    const query = query__objectToString({ resetState: 'yes' });
    router.navigate(`${renderLockersPage__views.all.fragment}/${id}?${query}`, { trigger: true, replace: true });
    return;
  }

  return auth__checkLogin(auth).then((isLoggedIn) => {
    if (!isLoggedIn) {
      return router.navigateToLoginPage();
    }

    const {
      redirectTo = 'Lockers',
      redirectToFragment = renderLockersPage__views.all.fragment,
      resetState
    } = query__stringToObject(query);

    if (resetState === 'yes') {
      renderLocationDetailsNotesPage__resetState(opt, id);
      renderLocationDetailsInspectionsPage__resetState(opt, id);
    }

    $container.html(`<p><a href="#${redirectToFragment}">Back to ${redirectTo}</a></p>`);

    const $tabContainer = $('<div></div>').appendTo($container);
    function renderNavBar(id) {
      $tabContainer.html(`
        <div class="navbar">
          <ul class="nav nav-tabs">
            <li class="nav-item active" role="presentation">
              <a href="#${renderLockersPage__views[opt].fragment}/${id}" class="nav-link">Location</a>
            </li>

            <li class="nav-item" role="presentation">
              <a href="#${renderLockersPage__views[opt].fragment}/${id}/notes/${renderLocationDetailsNotesPage__currentView}" class="nav-link">Notes</a>
            </li>

            <li class="nav-item" role="presentation">
              <a href="#${renderLockersPage__views[opt].fragment}/${id}/inspections/${renderLocationDetailsInspectionsPage__currentView}" class="nav-link">Inspections</a>
            </li>

            <!--
            <li class="nav-item" role="presentation">
              <a href="#${renderLockersPage__views[opt].fragment}/${id}/lockers/all" class="nav-link">Lockers</a>
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
          url: `/* @echo C3DATA_LOCKERS_URL */('${id}')`
        });
      }

      return { data: {} };
    }).then(({ data }) => {
      const Model = Backbone.Model.extend({
        defaults: {
          number: '0000'
        }
      });
      const model = new Model(data);

      let snapShot = toSnapShot(model.toJSON());

      const definition = {
        successCore(data, options = {}) {
          const { auth, id, url } = options;

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
            snapShot = toSnapShot(data);
            renderNavBar(data.id);

            router.navigate(`${renderLockersPage__views[opt].fragment}/${data.id}`, { trigger: false, replace: true });

            const breadcrumbs = [
              { name: app.name, link: '#home' },
              { name: 'Lockers', link: '#lockers' },
              { name: renderLockersPage__views[opt].breadcrumb, link: `#${renderLockersPage__views[opt].fragment}` },
              { name: data.site_name, link: `#${renderLockersPage__views[opt].fragment}/${data.id}` }
            ];
            app.setBreadcrumb(breadcrumbs, true);

            app.setTitle(data.site_name);

            return { data, textStatus, jqXHR };
          }).catch((error) => {
            console.error(error); // eslint-disable-line no-console
            throw error;
          });
        },

        sections: [
          {
            title: 'Details',

            rows: [
              {
                fields: [
                  Object.assign({}, entityLockerDetails__fields.location(auth), { className: 'col-sm-4' })
                ]
              },
              {
                fields: [
                  Object.assign({}, entityLockerDetails__fields.number, { className: 'col-sm-4' }),
                  Object.assign({}, entityLockerDetails__fields.description, { className: 'col-sm-8' })
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
                  Object.assign({}, entityLockerDetails__fields.latest_note__date(model), { title: 'Date', className: 'col-sm-4' })
                ]
              },
              {
                fields: [
                  Object.assign({}, entityLockerDetails__fields.latest_note__note(model), { title: 'Note' })
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
                  Object.assign({}, entityLockerDetails__fields.latest_inspection__date(model), { title: 'Date', className: 'col-sm-4' }),
                  Object.assign({}, entityLockerDetails__fields.latest_inspection__result(model), { title: 'Result', className: 'col-sm-4' })
                ]
              },
              {
                fields: [
                  Object.assign({}, entityLockerDetails__fields.latest_inspection__note(model), { title: 'Note' })
                ]
              }
            ]
          },
          {
            title: 'Details',
            id: 'details',
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
                  Object.assign({}, entityLockerDetails__fields.id(model), { className: 'col-sm-8' }),
                  Object.assign({}, entityLockerDetails__fields.__Status(auth, model), { className: 'col-sm-4' })
                ]
              },
              {
                fields: [
                  entityLockerDetails__fields.__CreatedOn(model),
                  entityLockerDetails__fields.__ModifiedOn(model),
                  entityLockerDetails__fields.__Owner(model)
                ]
              }
            ]
          }
        ]
      };

      return Promise.resolve().then(() => {
        return renderForm($('<div></div>').appendTo($container), definition, model, {
          auth,
          url: '/* @echo C3DATA_LOCKERS_URL */',

          saveButtonLabel: (model) => model.isNew() ? 'Create Locker' : 'Update Locker',

          cancelButtonLabel: 'Cancel',
          cancelButtonFragment: renderLockersPage__views[opt].fragment,

          removeButtonLabel: 'Remove Locker',
          removePromptValue: 'DELETE'
        });
      }).then(() => {
        if (id === 'new') {
          const breadcrumbs = [
            { name: app.name, link: '#home' },
            { name: 'Lockers', link: `#${renderLockersPage__views.all.fragment}` },
            { name: renderLockersPage__views[opt].breadcrumb, link: `#${renderLockersPage__views[opt].fragment}` },
            { name: 'New' }
          ];
          app.setBreadcrumb(breadcrumbs, true);

          app.setTitle('New Locker');
        } else {
          const breadcrumbs = [
            { name: app.name, link: '#home' },
            { name: 'Lockers', link: `#${renderLockersPage__views.all.fragment}` },
            { name: renderLockersPage__views[opt].breadcrumb, link: `#${renderLockersPage__views[opt].fragment}` },
            { name: data.site_name, link: `#${renderLockersPage__views[opt].fragment}/${data.id}` }
          ];
          app.setBreadcrumb(breadcrumbs, true);

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
      const breadcrumbs = [
        { name: app.name, link: '#home' },
        { name: 'Lockers', link: `#${renderLockersPage__views.all.fragment}` },
        { name: renderLockersPage__views[opt].breadcrumb, link: `#${renderLockersPage__views[opt].fragment}` },
        { name: 'Error' }
      ];
      app.setBreadcrumb(breadcrumbs, true);

      app.setTitle('An Error has Occured');

      renderAlert($container, '<p>An error occured while fetching data.</p>', {
        bootstrayType: 'danger',
        position: 'bottom'
      });

      throw error;
    });
  }).catch((error) => {
    console.error(error); // eslint-disable-line no-console
  });
}
