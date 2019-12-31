/* global $ Backbone moment */
/* global ajaxes auth__checkLogin fixButtonLinks modal__showConfirm query__objectToString query__stringToObject
   renderAlert toSnapShot */
/* global renderForm */
/* global renderLockersPage__views */

const renderLockerDetailsPage_fields = {
  location: (auth) => ({
    title: 'Locker Location',
    bindTo: 'location',
    required: true,
    type: 'dropdown',
    choices: {
      beforeSend(jqXHR) {
        if (auth && auth.sId) {
          jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
        }
      },
      contentType: 'application/json; charset=utf-8',
      method: 'GET',
      url: '/* @echo C3DATA_LOCATIONS_URL */?$select=id,site_name&$filter=__Status eq \'Active\''
    },
    choicesMap(data) {
      if (data && data.value) {
        return data.value.sort((a, b) => {
          const a_site_name = a.site_name ? a.site_name.toLowerCase() : '';
          const b_site_name = b.site_name ? b.site_name.toLowerCase() : '';
          if (a_site_name > b_site_name) {
            return 1;
          }
          if (a_site_name < b_site_name) {
            return -1;
          }
          return 0;
        }).map((item) => {
          return {
            text: item.site_name,
            value: item.id
          };
        });
      }
      return [];
    }
  }),

  number: {
    title: 'Number',
    bindTo: 'number',
    required: true
  },

  latest_note__date: (model) => ({
    title: 'Latest Note Date',
    htmlAttr: { readonly: true },

    postRender({ field }) {
      function handler() {
        const momentDate = moment(model.get('latest_note__date'));
        if (momentDate.isValid()) {
          $(`#${field.id}`).val(momentDate.format('YYYY/MM/DD h:mm A'));
        } else {
          $(`#${field.id}`).val('');
        }
      }
      model.on(`change:latest_note__date`, handler);
      handler();
    }
  }),
  latest_note__note: (model) => ({
    title: 'Latest Note',
    type: 'textarea',
    rows: 5,
    htmlAttr: { readonly: true },

    postRender({ field }) {
      function handler() {
        $(`#${field.id}`).val(model.get('latest_note__note'));
      }
      model.on('change:latest_note__note', handler);
      handler();
    }
  }),

  latest_inspection__date: (model) => ({
    title: 'Latest Inspection Date',
    htmlAttr: { readonly: true },

    postRender({ field }) {
      function handler() {
        const momentDate = moment(model.get('latest_inspection__date'));
        if (momentDate.isValid()) {
          $(`#${field.id}`).val(momentDate.format('YYYY/MM/DD h:mm A'));
        } else {
          $(`#${field.id}`).val('');
        }
      }
      model.on(`change:latest_inspection__date`, handler);
      handler();
    }
  }),
  latest_inspection__result: (model) => ({
    title: 'Latest Inspection Result',
    htmlAttr: { readonly: true },

    postRender({ field }) {
      function handler() {
        $(`#${field.id}`).val(model.get('latest_inspection__result'));
      }
      model.on('change:latest_inspection__result', handler);
      handler();
    }
  }),
  latest_inspection__note: (model) => ({
    title: 'Latest Inspection Note',
    type: 'textarea',
    rows: 5,
    htmlAttr: { readonly: true },

    postRender({ field }) {
      function handler() {
        $(`#${field.id}`).val(model.get('latest_inspection__note'));
      }
      model.on('change:latest_inspection__note', handler);
      handler();
    }
  })
};

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
      // renderLocationDetailsNotesPage__resetState(opt, id);
      // renderLocationDetailsInspectionsPage__resetState(opt, id);
    }

    $container.html(`<p><a href="#${redirectToFragment}">Back to ${redirectTo}</a></p>`);

    const $tabContainer = $('<div></div>').appendTo($container);
    function renderNavBar(id) {
      $tabContainer.html(`
        <div class="navbar">
          <ul class="nav nav-tabs">
            <li class="nav-item active" role="presentation">
              <a href="#${renderLockersPage__views[opt].fragment}/${id}" class="nav-link">Locker</a>
            </li>
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
              { name: `${data.location__site_name} - ${data.number}`, link: `#${renderLockersPage__views[opt].fragment}/${data.id}` }
            ];
            app.setBreadcrumb(breadcrumbs, true);

            app.setTitle(`${data.location__site_name} - ${data.number}`);

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
                  Object.assign({}, renderLockerDetailsPage_fields.location(auth), { className: 'col-sm-4' }),
                  Object.assign({}, renderLockerDetailsPage_fields.number, { className: 'col-sm-4' })
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
                  Object.assign({}, renderLockerDetailsPage_fields.latest_note__date(model), { title: 'Date', className: 'col-sm-4' })
                ]
              },
              {
                fields: [
                  Object.assign({}, renderLockerDetailsPage_fields.latest_note__note(model), { title: 'Note' })
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
                  Object.assign({}, renderLockerDetailsPage_fields.latest_inspection__date(model), { title: 'Date', className: 'col-sm-4' }),
                  Object.assign({}, renderLockerDetailsPage_fields.latest_inspection__result(model), { title: 'Result', className: 'col-sm-4' })
                ]
              },
              {
                fields: [
                  Object.assign({}, renderLockerDetailsPage_fields.latest_inspection__note(model), { title: 'Note' })
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
            { name: `${data.location__site_name} - ${data.number}`, link: `#${renderLockersPage__views[opt].fragment}/${data.id}` }
          ];
          app.setBreadcrumb(breadcrumbs, true);

          app.setTitle(`${data.location__site_name} - ${data.number}`);
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
        { name: 'number', link: `#${renderLockersPage__views.all.fragment}` },
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
