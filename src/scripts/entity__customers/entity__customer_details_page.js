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
            title: 'Contact',

            rows: [
              {
                fields: [
                  entityCustomerDetails__fields.first_name,
                  entityCustomerDetails__fields.last_name,
                  entityCustomerDetails__fields.title
                ]
              },
              {
                fields: [
                  entityCustomerDetails__fields.email,
                  entityCustomerDetails__fields.primary_phone,
                  entityCustomerDetails__fields.alternate_phone
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
            title: 'Bicycles',

            rows: [
              {
                fields: [
                  {
                    type: 'html',
                    html: '<h4>Bicycle 1</h4>'
                  }
                ]
              },
              {
                fields: [
                  Object.assign({}, entityCustomerDetails__fields.bicycle_1_make, { title: 'Make' }),
                  Object.assign({}, entityCustomerDetails__fields.bicycle_1_model, { title: 'Model' }),
                  Object.assign({}, entityCustomerDetails__fields.bicycle_1_colour, { title: 'Colour' })
                ]
              },
              {
                fields: [
                  {
                    type: 'html',
                    html: '<h4>Bicycle 2</h4>'
                  }
                ]
              },
              {
                fields: [
                  Object.assign({}, entityCustomerDetails__fields.bicycle_2_make, { title: 'Make' }),
                  Object.assign({}, entityCustomerDetails__fields.bicycle_2_model, { title: 'Model' }),
                  Object.assign({}, entityCustomerDetails__fields.bicycle_2_colour, { title: 'Colour' })
                ]
              },
            ]
          },
          {
            title: 'Request',

            rows: [
              {
                fields: [
                  Object.assign({}, entityCustomerDetails__fields.request_type, { className: 'col-sm-4' })
                ]
              },
              {
                fields: [
                  {
                    type: 'html',
                    html: '<h4>Bicycle Locker</h4>'
                  }
                ]
              },
              {
                fields: [
                  Object.assign({}, entityCustomerDetails__fields.request_locker_choice_1, { title: 'Choice 1' }),
                  Object.assign({}, entityCustomerDetails__fields.request_locker_choice_2, { title: 'Choice 2' }),
                  Object.assign({}, entityCustomerDetails__fields.request_locker_choice_3, { title: 'Choice 3' })
                ]
              },
              {
                fields: [
                  {
                    type: 'html',
                    html: '<h4>Bicycle Station</h4>'
                  }
                ]
              },
              {
                fields: [
                  Object.assign({}, entityCustomerDetails__fields.request_station_choice_1, { title: 'Choice 1' }),
                  Object.assign({}, entityCustomerDetails__fields.request_station_choice_2, { title: 'Choice 2' }),
                  Object.assign({}, entityCustomerDetails__fields.request_station_choice_3, { title: 'Choice 3' })
                ]
              }
            ]
          },
          {
            title: 'Subscription',

            rows: [
              {
                fields: [
                  Object.assign({}, entityCustomerDetails__fields.subscription_type, { className: 'col-sm-4' })
                ]
              },
              {
                fields: [
                  entityCustomerDetails__fields.subscription_start_date,
                  entityCustomerDetails__fields.subscription_expiration_date,
                  entityCustomerDetails__fields.subscription_end_date
                ]
              }
            ]
          },
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
