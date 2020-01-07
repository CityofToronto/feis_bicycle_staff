/* global $ Backbone */
/* global ajaxes auth__checkLogin modal__showConfirm query__objectToString query__stringToObject
   renderAlert toSnapShot */
/* global renderForm */
/* global renderEntityCustomersPage__views entityCustomerDetails__fields */

/* exported renderEntityCustomerDetailsPage */
function renderEntityCustomerDetailsPage(app, $container, router, auth, opt, id, query) {
  if (!(opt in renderEntityCustomersPage__views)) {
    const fragment = renderEntityCustomersPage__views.all.fragment;
    const query = query__objectToString({ resetState: 'yes' });
    router.navigate(`${fragment}?${query}`, { trigger: true, replace: true });
    return;
  }

  return auth__checkLogin(auth).then((isLoggedIn) => {
    if (!isLoggedIn) {
      return router.navigateToLoginPage();
    }

    const currentCustomerView = renderEntityCustomersPage__views[opt];

    const {
      redirectTo = 'Customers',
      redirectToFragment = currentCustomerView.fragment
    } = query__stringToObject(query);

    $container.empty();
    const $containerTop = $('<div></div>').appendTo($container);

    const breadcrumbs = [
      { name: app.name, link: '#home' },
      { name: 'Entities', link: '#entities' },
      { name: 'Customers', link: `#${renderEntityCustomersPage__views.all.fragment}` },
      { name: currentCustomerView.breadcrumb, link: `#${currentCustomerView.fragment}` }
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
          url: `/* @echo C3DATA_CUSTOMERS_URL */('${id}')`
        });
      }

      return { data: {} };
    }).then(({ data }) => {
      const Model = Backbone.Model.extend({
        defaults: {
          municipality: 'Toronto',
          province: 'Ontario',
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

            router.navigate(`${currentCustomerView.fragment}/${data.id}`, { trigger: false, replace: true });

            breadcrumbs.splice(breadcrumbs.length - 1, 1, { name: data.site_name, link: `#${currentCustomerView.fragment}/${data.id}` });
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
                  Object.assign({}, entityCustomerDetails__fields.site_name, { className: 'col-sm-4' }),
                  Object.assign({}, entityCustomerDetails__fields.description, { className: 'col-sm-8' })
                ]
              },
              {
                fields: [
                  Object.assign({}, entityCustomerDetails__fields.civic_address, { className: 'col-sm-8' })
                ]
              },
              {
                fields: [
                  entityCustomerDetails__fields.municipality,
                  entityCustomerDetails__fields.province(auth),
                  entityCustomerDetails__fields.postal_code
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
                  Object.assign({}, entityCustomerDetails__fields.primary_contact_first_name, { title: 'First Name', className: 'col-sm-4' }),
                  Object.assign({}, entityCustomerDetails__fields.primary_contact_last_name, { title: 'Last Name', className: 'col-sm-4' })
                ]
              },
              {
                fields: [
                  Object.assign({}, entityCustomerDetails__fields.primary_contact_email, { title: 'Email' }),
                  Object.assign({}, entityCustomerDetails__fields.primary_contact_primary_phone, { title: 'Primary Phone' }),
                  Object.assign({}, entityCustomerDetails__fields.primary_contact_alternate_phone, { title: 'Alternate Phone' })
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
                  Object.assign({}, entityCustomerDetails__fields.alternate_contact_first_name, { title: 'First Name', className: 'col-sm-4' }),
                  Object.assign({}, entityCustomerDetails__fields.alternate_contact_last_name, { title: 'Last Name', className: 'col-sm-4' })
                ]
              },
              {
                fields: [
                  Object.assign({}, entityCustomerDetails__fields.alternate_contact_email, { title: 'Email' }),
                  Object.assign({}, entityCustomerDetails__fields.alternate_contact_primary_phone, { title: 'Primary Phone' }),
                  Object.assign({}, entityCustomerDetails__fields.alternate_contact_alternate_phone, { title: 'Alternate Phone' })
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
                  Object.assign({}, entityCustomerDetails__fields.latest_note__date(model), { title: 'Date', className: 'col-sm-4' })
                ]
              },
              {
                fields: [
                  Object.assign({}, entityCustomerDetails__fields.latest_note__note(model), { title: 'Note' })
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
                  Object.assign({}, entityCustomerDetails__fields.latest_inspection__date(model), { title: 'Date', className: 'col-sm-4' }),
                  Object.assign({}, entityCustomerDetails__fields.latest_inspection__result(model), { title: 'Result', className: 'col-sm-4' })
                ]
              },
              {
                fields: [
                  Object.assign({}, entityCustomerDetails__fields.latest_inspection__note(model), { title: 'Note' })
                ]
              }
            ]
          }
        ]
      };

      return Promise.resolve().then(() => {
        return renderForm($('<div></div>').appendTo($container), definition, model, {
          auth,
          url: '/* @echo C3DATA_CUSTOMERS_URL */',

          saveButtonLabel: (model) => model.isNew() ? 'Create Customer' : 'Update Customer',

          cancelButtonLabel: 'Cancel',
          cancelButtonFragment: currentCustomerView.fragment,

          removeButtonLabel: 'Remove Customer',
          removePromptValue: 'DELETE'
        });
      }).then(() => {
        $containerTop.html(`<p><a href="#${redirectToFragment}">Back to ${redirectTo}</a></p>`);

        if (id === 'new') {
          breadcrumbs.push({ name: 'New', link: `#${currentCustomerView.fragment}/new` });
          app.setBreadcrumb(breadcrumbs, true);
          app.setTitle('New Customer');
        } else {
          breadcrumbs.push({ name: data.site_name, link: `#${currentCustomerView.fragment}/${data.id}` });
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
