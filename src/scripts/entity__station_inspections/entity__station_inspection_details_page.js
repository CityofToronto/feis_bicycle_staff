/* global $ Backbone moment */
/* global ajaxes auth__checkLogin modal__showConfirm query__objectToString query__stringToObject
   renderAlert toSnapShot */
/* global renderForm */
/* global renderEntityStationInspectionsPage__views entityStationInspectionDetails__fields */

/* exported renderEntityStationInspectionDetailsPage */
function renderEntityStationInspectionDetailsPage(app, $container, router, auth, opt, id, query) {
  if (!(opt in renderEntityStationInspectionsPage__views)) {
    const fragment = renderEntityStationInspectionsPage__views.all.fragment;
    const query = query__objectToString({ resetState: 'yes' });
    router.navigate(`${fragment}?${query}`, { trigger: true, replace: true });
    return;
  }

  return auth__checkLogin(auth).then((isLoggedIn) => {
    if (!isLoggedIn) {
      return router.navigateToLoginPage();
    }

    const currentStationInspectionView = renderEntityStationInspectionsPage__views[opt];

    const {
      redirectTo = 'Station Inspections',
      redirectToFragment = currentStationInspectionView.fragment
    } = query__stringToObject(query);

    $container.empty();
    const $containerTop = $('<div></div>').appendTo($container);

    const breadcrumbs = [
      { name: app.name, link: '#home' },
      { name: 'Entities', link: '#entities' },
      { name: 'Station Inspections', link: `#${renderEntityStationInspectionsPage__views.all.fragment}` },
      { name: currentStationInspectionView.breadcrumb, link: `#${currentStationInspectionView.fragment}` }
    ];

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
          url: `/* @echo C3DATA_STATION_INSPECTIONS_URL */('${id}')`
        });
      }

      return { data: {} };
    }).then(({ data }) => {
      const Model = Backbone.Model.extend({
        defaults: {
          date: moment().format('YYYY/MM/DD h:mm A'),
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

            router.navigate(`${currentStationInspectionView.fragment}/${data.id}`, { trigger: false, replace: true });

            breadcrumbs.splice(breadcrumbs.length - 1, 1, { name: data.date, link: `#${currentStationInspectionView.fragment}/${data.id}` });
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
                  entityStationInspectionDetails__fields.station(auth),
                  entityStationInspectionDetails__fields.date,
                  entityStationInspectionDetails__fields.result(auth)
                ]
              },
              {
                fields: [
                  entityStationInspectionDetails__fields.note
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
                  Object.assign({}, entityStationInspectionDetails__fields.id(model), { className: 'col-sm-8' }),
                  Object.assign({}, entityStationInspectionDetails__fields.__Status(auth, model), { className: 'col-sm-4' })
                ]
              },
              {
                fields: [
                  entityStationInspectionDetails__fields.__CreatedOn(model),
                  entityStationInspectionDetails__fields.__ModifiedOn(model),
                  entityStationInspectionDetails__fields.__Owner(model)
                ]
              }
            ]
          }
        ]
      };

      return Promise.resolve().then(() => {
        return renderForm($('<div></div>').appendTo($container), definition, model, {
          auth,
          url: '/* @echo C3DATA_STATION_INSPECTIONS_URL */',

          saveButtonLabel: (model) => model.isNew() ? 'Create Station Inspection' : 'Update Station Inspection',

          cancelButtonLabel: 'Cancel',
          cancelButtonFragment: currentStationInspectionView.fragment,

          removeButtonLabel: 'Remove Station Inspection',
          removePromptValue: 'DELETE'
        });
      }).then(() => {
        $containerTop.html(`<p><a href="#${redirectToFragment}">Back to ${redirectTo}</a></p>`);

        if (id === 'new') {
          breadcrumbs.push({ name: 'New', link: `#${currentStationInspectionView.fragment}/new` });
          app.setBreadcrumb(breadcrumbs, true);
          app.setTitle('New Station Inspection');
        } else {
          breadcrumbs.push({ name: data.date, link: `#${currentStationInspectionView.fragment}/${data.id}` });
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
      breadcrumbs.push({ name: 'Error' });
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
