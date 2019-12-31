/* global $ Backbone moment */
/* global ajaxes auth__checkLogin fixButtonLinks modal__showConfirm query__objectToString query__stringToObject
   renderAlert toSnapShot */
/* global renderForm */
/* global renderLocationNotesPage__views */

const renderLocationNoteDetailsPage_fields = {
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
          const a_site_name = a.site_name.toLowerCase();
          const b_site_name = b.site_name.toLowerCase();
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

  date: {
    title: 'Date',
    bindTo: 'date',
    required: true,
    type: 'datetimepicker',
    options: {
      format: 'YYYY/MM/DD h:mm A'
    }
  },

  note: {
    title: 'Note',
    bindTo: 'note',
    required: true,
    type: 'textarea',
    rows: 10
  }
};

/* exported renderLocationNoteDetailsPage */
function renderLocationNoteDetailsPage(app, $container, router, auth, opt, id, query) {
  if (!(opt in renderLocationNotesPage__views)) {
    const query = query__objectToString({ resetState: 'yes' });
    router.navigate(`${renderLocationNotesPage__views.all.fragment}/${id}?${query}`, { trigger: true, replace: true });
    return;
  }

  return auth__checkLogin(auth).then((isLoggedIn) => {
    if (!isLoggedIn) {
      return router.navigateToLoginPage();
    }

    const {
      redirectTo = 'Location Notes',
      redirectToFragment = renderLocationNotesPage__views[opt].fragment
    } = query__stringToObject(query);

    $container.html(`<p><a href="#${redirectToFragment}">Back to ${redirectTo}</a></p>`);

    const $tabContainer = $('<div></div>').appendTo($container);
    function renderNavBar(id) {
      $tabContainer.html(`
        <div class="navbar">
          <ul class="nav nav-tabs">
            <li class="nav-item active" role="presentation">
              <a href="#${renderLocationNotesPage__views[opt].fragment}/${id}" class="nav-link">Location Note</a>
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
          url: `/* @echo C3DATA_LOCATION_NOTES_URL */('${id}')`
        });
      }

      return { data: {} };
    }).then(({ data }) => {
      const Model = Backbone.Model.extend({
        defaults: {
          date: moment().format('YYYY/MM/DD h:mm A')
        }
      });
      const model = new Model(data);

      let snapShot = toSnapShot(model.toJSON());

      const definition = {
        successCore(data, options = {}) {
          const { auth, id, url } = options;

          const momentDate = moment(data.date, 'YYYY/MM/DD h:mm A');
          if (momentDate.isValid()) {
            data.date = momentDate.format();
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
            snapShot = toSnapShot(data);
            renderNavBar(data.id);

            router.navigate(`${renderLocationNotesPage__views[opt].fragment}/${data.id}`, { trigger: false, replace: true });

            const breadcrumbs = [
              { name: app.name, link: '#home' },
              { name: 'Location Notes', link: `#${renderLocationNotesPage__views.all.fragment}` },
              { name: renderLocationNotesPage__views[opt].breadcrumb, link: `#${renderLocationNotesPage__views[opt].fragment}` },
              { name: data.date, link: `#${renderLocationNotesPage__views[opt].fragment}/${data.id}` }
            ];
            app.setBreadcrumb(breadcrumbs, true);

            app.setTitle(data.date);

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
                  Object.assign({}, renderLocationNoteDetailsPage_fields.location(auth), { className: 'col-sm-8' })
                ]
              },
              {
                fields: [
                  Object.assign({}, renderLocationNoteDetailsPage_fields.date, { className: 'col-sm-4' })
                ]
              },
              {
                fields: [
                  renderLocationNoteDetailsPage_fields.note
                ]
              }
            ]
          }
        ]
      };

      return Promise.resolve().then(() => {
        return renderForm($('<div></div>').appendTo($container), definition, model, {
          auth,
          url: '/* @echo C3DATA_LOCATION_NOTES_URL */',

          saveButtonLabel: (model) => model.isNew() ? 'Create Location Note' : 'Update Location Note',

          cancelButtonLabel: 'Cancel',
          cancelButtonFragment: `location_notes/${opt}`,

          removeButtonLabel: 'Remove Location Note',
          removePromptValue: 'DELETE'
        });
      }).then(() => {
        if (id === 'new') {
          const breadcrumbs = [
            { name: app.name, link: '#home' },
            { name: 'Location Notes', link: `#${renderLocationNotesPage__views.all.fragment}` },
            { name: renderLocationNotesPage__views[opt].breadcrumb, link: `#${renderLocationNotesPage__views[opt].fragment}` },
            { name: 'New' }
          ];
          app.setBreadcrumb(breadcrumbs, true);

          app.setTitle('New Location Note');
        } else {
          const breadcrumbs = [
            { name: app.name, link: '#home' },
            { name: 'Location Notes', link: '#location_notes' },
            { name: renderLocationNotesPage__views[opt].breadcrumb, link: `#${renderLocationNotesPage__views[opt].fragment}` },
            { name: data.date, link: `#${renderLocationNotesPage__views[opt].fragment}/${data.id}` }
          ];
          app.setBreadcrumb(breadcrumbs, true);

          app.setTitle(data.date);
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
        { name: 'Location Notes', link: `#${renderLocationNotesPage__views.all.fragment}` },
        { name: renderLocationNotesPage__views[opt].breadcrumb, link: `#${renderLocationNotesPage__views[opt].fragment}` },
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
