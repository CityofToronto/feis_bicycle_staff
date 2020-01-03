/* global $ Backbone moment */
/* global ajaxes auth__checkLogin modal__showConfirm query__objectToString query__stringToObject
   renderAlert toSnapShot */
/* global renderForm */
/* global renderEntityLockerInspectionsPage__views entityLockerInspectionDetails__fields */

/* exported renderEntityLockerInspectionDetailsPage */
function renderEntityLockerInspectionDetailsPage(app, $container, router, auth, opt, id, query) {
  if (!(opt in renderEntityLockerInspectionsPage__views)) {
    const fragment = renderEntityLockerInspectionsPage__views.all.fragment;
    const query = query__objectToString({ resetState: 'yes' });
    router.navigate(`${fragment}?${query}`, { trigger: true, replace: true });
    return;
  }

  return auth__checkLogin(auth).then((isLoggedIn) => {
    if (!isLoggedIn) {
      return router.navigateToLoginPage();
    }

    const currentLockerInspectionView = renderEntityLockerInspectionsPage__views[opt];

    const {
      redirectTo = 'Locker Inspections',
      redirectToFragment = currentLockerInspectionView.fragment
    } = query__stringToObject(query);

    $container.empty();
    const $containerTop = $('<div></div>').appendTo($container);

    const breadcrumbs = [
      { name: app.name, link: '#home' },
      { name: 'Entities', link: '#entities' },
      { name: 'Locker Inspections', link: `#${renderEntityLockerInspectionsPage__views.all.fragment}` },
      { name: currentLockerInspectionView.breadcrumb, link: `#${currentLockerInspectionView.fragment}` }
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
          url: `/* @echo C3DATA_LOCKER_INSPECTIONS_URL */('${id}')`
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

            router.navigate(`${currentLockerInspectionView.fragment}/${data.id}`, { trigger: false, replace: true });

            breadcrumbs.splice(breadcrumbs.length - 1, 1, { name: data.date, link: `#${currentLockerInspectionView.fragment}/${data.id}` });
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
                  entityLockerInspectionDetails__fields.locker(auth),
                  entityLockerInspectionDetails__fields.date,
                  entityLockerInspectionDetails__fields.result(auth)
                ]
              },
              {
                fields: [
                  entityLockerInspectionDetails__fields.note
                ]
              }
            ]
          }
        ]
      };

      return Promise.resolve().then(() => {
        return renderForm($('<div></div>').appendTo($container), definition, model, {
          auth,
          url: '/* @echo C3DATA_LOCKER_INSPECTIONS_URL */',

          saveButtonLabel: (model) => model.isNew() ? 'Create Locker Inspection' : 'Update Locker Inspection',

          cancelButtonLabel: 'Cancel',
          cancelButtonFragment: currentLockerInspectionView.fragment,

          removeButtonLabel: 'Remove Locker Inspection',
          removePromptValue: 'DELETE'
        });
      }).then(() => {
        $containerTop.html(`<p><a href="#${redirectToFragment}">Back to ${redirectTo}</a></p>`);

        if (id === 'new') {
          breadcrumbs.push({ name: 'New', link: `#${currentLockerInspectionView.fragment}/new` });
          app.setBreadcrumb(breadcrumbs, true);
          app.setTitle('New Locker Inspection');
        } else {
          breadcrumbs.push({ name: data.date, link: `#${currentLockerInspectionView.fragment}/${data.id}` });
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
