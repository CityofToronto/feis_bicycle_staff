/* global $ Backbone moment */
/* global ajaxes auth__checkLogin fixButtonLinks modal__showConfirm query__objectToString query__stringToObject
   renderAlert toSnapShot */
/* global renderForm */
/* global renderLocationsPage__views renderLocationDetailsNotesPage__views
   renderLocationDetailsNotesPage__currentView:writable renderLocationNoteDetailsPage_fields */


/* exported renderLocationDetailsNoteDetailsPage */
function renderLocationDetailsNoteDetailsPage(app, $container, router, auth, opt1, id1, opt2, id2, query) {
  if (!(opt1 in renderLocationsPage__views)) {
    const query = query__objectToString({ resetState: 'yes' });
    router.navigate(`${renderLocationsPage__views.all.fragment}/${id1}/${opt2}/${id2}?${query}`, { trigger: true, replace: true });
    return;
  }

  if (!(opt2 in renderLocationDetailsNotesPage__views)) {
    const query = query__objectToString({ resetState: 'yes' });
    router.navigate(`${renderLocationDetailsNotesPage__views.all.fragment(opt1, id1)}/${id2}?${query}`, { trigger: true, replace: true });
    return;
  }

  return auth__checkLogin(auth).then((isLoggedIn) => {
    if (!isLoggedIn) {
      return router.navigateToLoginPage();
    }

    const {
      redirectTo = 'Locations',
      redirectToFragment = renderLocationsPage__views.all.fragment,
    } = query__stringToObject(query);

    $container.html(`<p><a href="#${redirectToFragment}">Back to ${redirectTo}</a></p>`);

    const $tabContainer = $('<div></div>').appendTo($container);
    function renderNavBar(id) {
      $tabContainer.html(`
        <div class="navbar">
          <ul class="nav nav-tabs">
            <li class="nav-item" role="presentation">
              <a href="#${renderLocationsPage__views[opt1].fragment}/${id}" class="nav-link">Location</a>
            </li>

            <li class="nav-item active" role="presentation">
              <a href="#${renderLocationsPage__views[opt1].fragment}/${id}/notes/${renderLocationDetailsNotesPage__currentView}" class="nav-link">Notes</a>
            </li>

            <!--
            <li class="nav-item" role="presentation">
              <a href="#locations/${opt1}/${id}/inspections/all" class="nav-link">Inspections</a>
            </li>

            <li class="nav-item" role="presentation">
              <a href="#locations/${opt1}/${id}/inspections/all" class="nav-link">Lockers</a>
            </li>
            -->
          </ul>
        </div>
      `);
      fixButtonLinks($tabContainer);
    }
    renderNavBar(id1);

    let site_name;
    return Promise.resolve().then(() => {
      return ajaxes({
        beforeSend(jqXHR) {
          if (auth && auth.sId) {
            jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
          }
        },
        contentType: 'application/json; charset=utf-8',
        method: 'GET',
        url: `/* @echo C3DATA_LOCATIONS_URL */('${id1}')?$select=site_name`
      });
    }).then(({ data }) => {
      site_name = data.site_name;

      if (id2 !== 'new') {
        return ajaxes({
          beforeSend(jqXHR) {
            if (auth && auth.sId) {
              jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
            }
          },
          contentType: 'application/json; charset=utf-8',
          method: 'GET',
          url: `/* @echo C3DATA_LOCATION_NOTES_URL */('${id2}')`
        });
      }

      return { data: {} };
    }).then(({ data }) => {
      const Model = Backbone.Model.extend({
        defaults: {
          date: moment().format('YYYY/MM/DD h:mm A'),
          location: id1
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

            router.navigate(`${renderLocationDetailsNotesPage__views[opt2].fragment(opt1, id1)}/${data.id}`, { trigger: false, replace: true });

            const breadcrumbs = [
              { name: app.name, link: '#home' },
              { name: 'Locations', link: `#${renderLocationsPage__views.all.fragment}` },
              { name: renderLocationsPage__views[opt1].breadcrumb, link: `#${renderLocationsPage__views[opt1].fragment}` },
              { name: data.site_name, link: `#${renderLocationsPage__views[opt1].fragment}/${data.id}` },
              { name: 'Notes', link: `#${renderLocationDetailsNotesPage__views.all.fragment(opt1, id1)}` },
              { name: renderLocationDetailsNotesPage__views[opt2].breadcrumb, link: `#${renderLocationDetailsNotesPage__views[opt2].fragment(opt1, id1)}` },
              { name: data.date, link: `#${renderLocationDetailsNotesPage__views[opt2].fragment(opt1, id1)}/${data.id}` }
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
          cancelButtonFragment: renderLocationDetailsNotesPage__views[opt2].fragment(opt1, id1),

          removeButtonLabel: 'Remove Location Note',
          removePromptValue: 'DELETE'
        });
      }).then(() => {
        if (id2 === 'new') {
          const breadcrumbs = [
            { name: app.name, link: '#home' },
            { name: 'Locations', link: `#${renderLocationsPage__views.all.fragment}` },
            { name: renderLocationsPage__views[opt1].breadcrumb, link: `#${renderLocationsPage__views[opt1].fragment}` },
            { name: site_name, link: `#${renderLocationsPage__views[opt1].fragment}/${id1}` },
            { name: 'Notes', link: `#${renderLocationDetailsNotesPage__views.all.fragment(opt1, id1)}` },
            { name: renderLocationDetailsNotesPage__views[opt2].breadcrumb, link: `#${renderLocationDetailsNotesPage__views[opt2].fragment(opt1, id1)}` },
            { name: 'New' }
          ];
          app.setBreadcrumb(breadcrumbs, true);

          app.setTitle('New Location');
        } else {
          const breadcrumbs = [
            { name: app.name, link: '#home' },
            { name: 'Locations', link: `#${renderLocationsPage__views.all.fragment}` },
            { name: renderLocationsPage__views[opt1].breadcrumb, link: `#${renderLocationsPage__views[opt1].fragment}` },
            { name: site_name, link: `#${renderLocationsPage__views[opt1].fragment}/${id1}` },
            { name: 'Notes', link: `#${renderLocationDetailsNotesPage__views.all.fragment(opt1, id1)}` },
            { name: renderLocationDetailsNotesPage__views[opt2].breadcrumb, link: `#${renderLocationDetailsNotesPage__views[opt2].fragment(opt1, id1)}` },
            { name: data.date, link: `#${renderLocationDetailsNotesPage__views[opt2].fragment(opt1, id1)}/${data.id}` }
          ];
          app.setBreadcrumb(breadcrumbs, true);

          app.setTitle(site_name);
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
        { name: 'Locations', link: `#${renderLocationsPage__views.all.fragment}` },
        { name: renderLocationsPage__views[opt1].breadcrumb, link: `#${renderLocationsPage__views[opt1].fragment}` },
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
