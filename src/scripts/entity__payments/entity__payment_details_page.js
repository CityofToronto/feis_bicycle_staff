/* global $ Backbone */
/* global ajaxes auth__checkLogin modal__showConfirm query__objectToString query__stringToObject
   renderAlert toSnapShot */
/* global renderForm */
/* global renderEntityPaymentsPage__views entityPaymentDetails__fields */

/* exported renderEntityPaymentDetailsPage */
function renderEntityPaymentDetailsPage(app, $container, router, auth, opt, id, query) {
  if (!(opt in renderEntityPaymentsPage__views)) {
    const fragment = renderEntityPaymentsPage__views.all.fragment;
    const query = query__objectToString({ resetState: 'yes' });
    router.navigate(`${fragment}?${query}`, { trigger: true, replace: true });
    return;
  }

  return auth__checkLogin(auth).then((isLoggedIn) => {
    if (!isLoggedIn) {
      return router.navigateToLoginPage();
    }

    const currentPaymentView = renderEntityPaymentsPage__views[opt];

    const {
      redirectTo = 'Payments',
      redirectToFragment = currentPaymentView.fragment
    } = query__stringToObject(query);

    $container.empty();
    const $containerTop = $('<div></div>').appendTo($container);

    const breadcrumbs = [
      { name: app.name, link: '#home' },
      { name: 'Entities', link: '#entities' },
      { name: 'Payments', link: `#${renderEntityPaymentsPage__views.all.fragment}` },
      { name: currentPaymentView.breadcrumb, link: `#${currentPaymentView.fragment}` }
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
          url: `/* @echo C3DATA_PAYMENTS_URL */('${id}')`
        });
      }

      return { data: {} };
    }).then(({ data }) => {
      const Model = Backbone.Model.extend({
        defaults: {}
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

            router.navigate(`${currentPaymentView.fragment}/${data.id}`, { trigger: false, replace: true });

            breadcrumbs.splice(breadcrumbs.length - 1, 1, {
              name: `${data.location__site_name} ${data.number}`, link: `#${currentPaymentView.fragment}/${data.id}`
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
            title: 'Customer',

            rows: [
              {
                fields: [
                  Object.assign({}, entityPaymentDetails__fields.customer(auth), { className: 'col-md-4' }),
                  Object.assign({}, entityPaymentDetails__fields.customer_subscription_type, { className: 'col-md-4' }),
                ]
              },
              {
                fields: [
                  entityPaymentDetails__fields.customer_first_name,
                  entityPaymentDetails__fields.customer_last_name,
                  entityPaymentDetails__fields.customer_title
                ]
              },
              {
                fields: [
                  entityPaymentDetails__fields.customer_email,
                  entityPaymentDetails__fields.customer_primary_phone,
                  entityPaymentDetails__fields.customer_alternate_phone
                ]
              },
              {
                fields: [
                  Object.assign({}, entityPaymentDetails__fields.customer_civic_address, { className: 'col-md-8' })
                ]
              },
              {
                fields: [
                  entityPaymentDetails__fields.customer_municipality,
                  entityPaymentDetails__fields.customer_province,
                  entityPaymentDetails__fields.customer_postal_code
                ]
              }
            ]
          },
          {
            title: 'Payment',

            rows: [
              {
                fields: [
                  Object.assign({}, entityPaymentDetails__fields.locker_item, { className: 'hide col-md-4' }),
                  Object.assign({}, entityPaymentDetails__fields.lockerkey_item, { className: 'hide col-md-4' })
                ]
              },
              {
                fields: [
                  entityPaymentDetails__fields.station_item,
                  entityPaymentDetails__fields.keyfob_item,
                  entityPaymentDetails__fields.registration
                ]
              },
              {
                fields: [
                  // entityPaymentDetails__fields.cart
                  entityPaymentDetails__fields.cart
                ]
              }
            ]
          },
          {
            title: 'Meta',
            id: 'meta',
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
                  Object.assign({}, entityPaymentDetails__fields.id(model), { className: 'col-md-8' }),
                  Object.assign({}, entityPaymentDetails__fields.__Status(auth, model), { className: 'col-md-4' })
                ]
              },
              {
                fields: [
                  entityPaymentDetails__fields.__CreatedOn(model),
                  entityPaymentDetails__fields.__ModifiedOn(model),
                  entityPaymentDetails__fields.__Owner(model)
                ]
              }
            ]
          }
        ]
      };

      return Promise.resolve().then(() => {
        return renderForm($('<div></div>').appendTo($container), definition, model, {
          auth,
          url: '/* @echo C3DATA_PAYMENTS_URL */',

          saveButtonLabel: (model) => model.isNew() ? 'Make Payment' : null, //'Update Payment',

          cancelButtonLabel: 'Cancel',
          cancelButtonFragment: currentPaymentView.fragment,

          removeButtonLabel: null, //'Remove Payment',
          removePromptValue: 'DELETE'
        });
      }).then(() => {
        $containerTop.html(`<p><a href="#${redirectToFragment}">Back to ${redirectTo}</a></p>`);

        if (id === 'new') {
          breadcrumbs.push({ name: 'New', link: `#${currentPaymentView.fragment}/new` });
          app.setBreadcrumb(breadcrumbs, true);
          app.setTitle('New Payment');
        } else {
          breadcrumbs.push({ name: `${data.location__site_name} ${data.number}`, link: `#${currentPaymentView.fragment}/${data.id}` });
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
