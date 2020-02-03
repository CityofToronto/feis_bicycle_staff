/* global $ Backbone */
/* global ajaxes auth__checkLogin modal__showConfirm query__objectToString query__stringToObject
   renderAlert toSnapShot */
/* global renderForm */
/* global renderEntityLockersPage__views entityLockerDetails__fields */

/* exported renderEntityLockerDetailsPage */
function renderEntityLockerDetailsPage(app, $container, router, auth, opt, id, query) {
  if (!(opt in renderEntityLockersPage__views)) {
    const fragment = renderEntityLockersPage__views.all.fragment;
    const query = query__objectToString({ resetState: 'yes' });
    router.navigate(`${fragment}?${query}`, { trigger: true, replace: true });
    return;
  }

  return auth__checkLogin(auth).then((isLoggedIn) => {
    if (!isLoggedIn) {
      return router.navigateToLoginPage();
    }

    const currentLockerView = renderEntityLockersPage__views[opt];

    const {
      redirectTo = 'Lockers',
      redirectToFragment = currentLockerView.fragment
    } = query__stringToObject(query);

    $container.empty();
    const $containerTop = $('<div></div>').appendTo($container);

    const breadcrumbs = [
      { name: app.name, link: '#home' },
      { name: 'Entities', link: '#entities' },
      { name: 'Lockers', link: `#${renderEntityLockersPage__views.all.fragment}` },
      { name: currentLockerView.breadcrumb, link: `#${currentLockerView.fragment}` }
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

            router.navigate(`${currentLockerView.fragment}/${data.id}`, { trigger: false, replace: true });

            breadcrumbs.splice(breadcrumbs.length - 1, 1, {
              name: `${data.location__site_name} ${data.number}`, link: `#${currentLockerView.fragment}/${data.id}`
            });
            app.setBreadcrumb(breadcrumbs, true);
            app.setTitle(`${data.location__site_name} ${data.number}`);

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
                  Object.assign({}, entityLockerDetails__fields.location(auth), { className: 'col-md-4' })
                ]
              },
              {
                fields: [
                  Object.assign({}, entityLockerDetails__fields.number, { className: 'col-md-4' }),
                  Object.assign({}, entityLockerDetails__fields.description, { className: 'col-md-8' })
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
                  Object.assign({}, entityLockerDetails__fields.latest_note__date(model), { title: 'Date', className: 'col-md-4' })
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
                  Object.assign({}, entityLockerDetails__fields.latest_inspection__date(model), { title: 'Date', className: 'col-md-4' }),
                  Object.assign({}, entityLockerDetails__fields.latest_inspection__result(model), { title: 'Result', className: 'col-md-4' })
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
                  Object.assign({}, entityLockerDetails__fields.id(model), { className: 'col-md-8' }),
                  Object.assign({}, entityLockerDetails__fields.__Status(auth, model), { className: 'col-md-4' })
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
          cancelButtonFragment: currentLockerView.fragment,

          removeButtonLabel: 'Remove Locker',
          removePromptValue: 'DELETE'
        });
      }).then(() => {
        $containerTop.html(`<p><a href="#${redirectToFragment}">Back to ${redirectTo}</a></p>`);

        if (id === 'new') {
          breadcrumbs.push({ name: 'New', link: `#${currentLockerView.fragment}/new` });
          app.setBreadcrumb(breadcrumbs, true);
          app.setTitle('New Locker');
        } else {
          breadcrumbs.push({ name: `${data.location__site_name} ${data.number}`, link: `#${currentLockerView.fragment}/${data.id}` });
          app.setBreadcrumb(breadcrumbs, true);
          app.setTitle(`${data.number}`);
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
