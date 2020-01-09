/* global $ Backbone moment */
/* global ajaxes auth__checkLogin fixButtonLinks modal__showConfirm query__objectToString query__stringToObject
   renderAlert toSnapShot */
/* global renderForm */
/* global renderLocationsPage__views renderLocationDetailsInspectionsPage__views
   renderLocationDetailsNotesPage__currentView renderLocationInspectionDetailsPage_fields
   renderLocationDetailsInspectionsPage__currentView */


/* exported renderLocationDetailsInspectionDetailsPage */
function renderLocationDetailsInspectionDetailsPage(app, $container, router, auth, opt1, id1, opt2, id2, query) {
  if (!(opt1 in renderLocationsPage__views)) {
    const query = query__objectToString({ resetState: 'yes' });
    router.navigate(`${renderLocationsPage__views.all.fragment}/${id1}/${opt2}/${id2}?${query}`, { trigger: true, replace: true });
    return;
  }

  if (!(opt2 in renderLocationDetailsInspectionsPage__views)) {
    const query = query__objectToString({ resetState: 'yes' });
    router.navigate(`${renderLocationDetailsInspectionsPage__views.all.fragment(opt1, id1)}/${id2}?${query}`, { trigger: true, replace: true });
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

    $tabContainer.html(`
      <div class="navbar">
        <ul class="nav nav-tabs">
          <li class="nav-item" role="presentation">
            <a href="#${renderLocationsPage__views[opt1].fragment}/${id1}" class="nav-link">Location</a>
          </li>

          <li class="nav-item" role="presentation">
            <a href="#${renderLocationsPage__views[opt1].fragment}/${id1}/notes/${renderLocationDetailsNotesPage__currentView}" class="nav-link">Notes</a>
          </li>

          <li class="nav-item active" role="presentation">
            <a href="#${renderLocationsPage__views[opt1].fragment}/${id1}/inspections/${renderLocationDetailsInspectionsPage__currentView}" class="nav-link">Inspections</a>
          </li>

          <!--
          <li class="nav-item" role="presentation">
            <a href="#${renderLocationsPage__views[opt1].fragment}/${id1}/inspections/all" class="nav-link">Lockers</a>
          </li>
          -->
        </ul>
      </div>
    `);
    fixButtonLinks($tabContainer);

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
          url: `/* @echo C3DATA_LOCATION_INSPECTIONS_URL */('${id2}')`
        });
      }

      return { data: {} };
    }).then(({ data }) => {
      const Model = Backbone.Model.extend({
        defaults: {
          date: moment().format('YYYY/MM/DD h:mm A'),
          location: id1,
          result: 'OK'
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

            router.navigate(`${renderLocationDetailsInspectionsPage__views[opt2].fragment(opt1, id1)}/${data.id}`, { trigger: false, replace: true });

            const breadcrumbs = [
              { name: app.name, link: '#home' },
              { name: 'Locations', link: `#${renderLocationsPage__views.all.fragment}` },
              { name: renderLocationsPage__views[opt1].breadcrumb, link: `#${renderLocationsPage__views[opt1].fragment}` },
              { name: data.site_name, link: `#${renderLocationsPage__views[opt1].fragment}/${data.id}` },
              { name: 'Inspections', link: `#${renderLocationDetailsInspectionsPage__views.all.fragment(opt1, id1)}` },
              { name: renderLocationDetailsInspectionsPage__views[opt2].breadcrumb, link: `#${renderLocationDetailsInspectionsPage__views[opt2].fragment(opt1, id1)}` },
              { name: data.date, link: `#${renderLocationDetailsInspectionsPage__views[opt2].fragment(opt1, id1)}/${data.id}` }
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
                  Object.assign({}, renderLocationInspectionDetailsPage_fields.date, { className: 'col-sm-4' }),
                  Object.assign({}, renderLocationInspectionDetailsPage_fields.result, { className: 'col-sm-4' })
                ]
              },
              {
                fields: [
                  renderLocationInspectionDetailsPage_fields.note
                ]
              }
            ]
          }
        ]
      };

      return Promise.resolve().then(() => {
        return renderForm($('<div></div>').appendTo($container), definition, model, {
          auth,
          url: '/* @echo C3DATA_LOCATION_INSPECTIONS_URL */',

          saveButtonLabel: (model) => model.isNew() ? 'Create Inspection' : 'Update Inspection',

          cancelButtonLabel: 'Cancel',
          cancelButtonFragment: renderLocationDetailsInspectionsPage__views[opt2].fragment(opt1, id1),

          removeButtonLabel: 'Remove Inspection',
          removePromptValue: 'DELETE'
        });
      }).then(() => {
        if (id2 === 'new') {
          const breadcrumbs = [
            { name: app.name, link: '#home' },
            { name: 'Locations', link: `#${renderLocationsPage__views.all.fragment}` },
            { name: renderLocationsPage__views[opt1].breadcrumb, link: `#${renderLocationsPage__views[opt1].fragment}` },
            { name: site_name, link: `#${renderLocationsPage__views[opt1].fragment}/${id1}` },
            { name: 'Inspections', link: `#${renderLocationDetailsInspectionsPage__views.all.fragment(opt1, id1)}` },
            { name: renderLocationDetailsInspectionsPage__views[opt2].breadcrumb, link: `#${renderLocationDetailsInspectionsPage__views[opt2].fragment(opt1, id1)}` },
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
            { name: 'Inspections', link: `#${renderLocationDetailsInspectionsPage__views.all.fragment(opt1, id1)}` },
            { name: renderLocationDetailsInspectionsPage__views[opt2].breadcrumb, link: `#${renderLocationDetailsInspectionsPage__views[opt2].fragment(opt1, id1)}` },
            { name: data.date, link: `#${renderLocationDetailsInspectionsPage__views[opt2].fragment(opt1, id1)}/${data.id}` }
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
