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

          first_name: 'First Name',
          last_name: 'Last Name',
        }
      });
      const model = new Model(data);

      let snapShot = toSnapShot(model.toJSON());

      const definition = {
        successCore(data, options = {}) {
          const { auth, id, url } = options;

          switch (data.request_type) {
            case 'Bicycle Lockers':
              delete data.request_station_choice_1;
              delete data.request_station_choice_2;
              delete data.request_station_choice_3;
              break;

            case 'Bicycle Stations':
              delete data.request_locker_choice_1;
              delete data.request_locker_choice_2;
              delete data.request_locker_choice_3;
              break;

            default:
              delete data.request_locker_choice_1;
              delete data.request_locker_choice_2;
              delete data.request_locker_choice_3;
              delete data.request_station_choice_1;
              delete data.request_station_choice_2;
              delete data.request_station_choice_3;
          }

          switch (data.subscription_type) {
            case 'Bicycle Locker':
              delete data.station;
              delete data.keyfob;
              delete data.keyfob_date_assigned;
              delete data.keyfob_date_returned;
              break;

            case 'Bicycle Station':
              delete data.location;
              delete data.locker;
              delete data.locker_key_date_assigned;
              delete data.locker_key_date_returned;
              break;

            default:
              delete data.location;
              delete data.locker;
              delete data.locker_key_date_assigned;
              delete data.locker_key_date_returned;
              delete data.station;
              delete data.keyfob;
              delete data.keyfob_date_assigned;
              delete data.keyfob_date_returned;
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
                  Object.assign({}, entityCustomerDetails__fields.civic_address, { className: 'col-md-8' })
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
            postRender: ({ section } = {}) => {
              section.$requestTypeElement.trigger('init');
            },

            rows: [
              {
                fields: [
                  Object.assign({}, entityCustomerDetails__fields.request_type(auth), { className: 'col-md-4' })
                ]
              },
              {
                fields: [
                  entityCustomerDetails__fields.choice_1,
                  entityCustomerDetails__fields.choice_2,
                  entityCustomerDetails__fields.choice_3
                ]
              }
            ]
          },
          {
            title: 'Subscription',
            postRender: ({ section } = {}) => {
              section.$subscriptionTypeElement.trigger('init');
              section.$subscriptionLocationElement.trigger('init');
            },

            rows: [
              {
                fields: [
                  Object.assign({}, entityCustomerDetails__fields.subscription_type, {
                    className: 'col-md-4',

                    postRender: ({ section, field } = {}) => {
                      const $element = $(`#${field.id}`);

                      section.$subscriptionTypeElement = $element;

                      $element.on('change', () => {
                        switch ($element.val()) {
                          case 'Bicycle Locker':
                            $('.locationItem').removeClass('hide');
                            $('.stationItem').addClass('hide');
                            break;

                          case 'Bicycle Station':
                            $('.locationItem').addClass('hide');
                            $('.stationItem').removeClass('hide');
                            break;

                          default:
                            $('.locationItem').addClass('hide');
                            $('.stationItem').addClass('hide');
                        }
                      });
                    }
                  }),
                  Object.assign({}, entityCustomerDetails__fields.location(auth), {
                    className: 'col-md-4 hide locationItem',

                    postRender: ({ section, field, model } = {}) => {
                      const $element = $(`#${field.id}`);

                      section.$subscriptionLocationElement = $element;

                      $element.on('init change', () => {
                        if (model.get(field.bindTo)) {
                          ajaxes({
                            beforeSend(jqXHR) {
                              if (auth && auth.sId) {
                                jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
                              }
                            },
                            contentType: 'application/json; charset=utf-8',
                            method: 'GET',
                            url: `/* @echo C3DATA_LOCKERS_URL */?$filter=location eq '${model.get(field.bindTo)}'&$orderby=number`
                          }).then(({ data }) => {
                            const lockerOptions = `
                              <option value="">- Select -</option>
                              ${data.value.map((locker) => `<option value="${locker.id}">${locker.number}</option>`).join('')}
                            `;

                            const ids = data.value.map((locker) => locker.id);

                            const locker = model.get('locker');
                            const options = locker && ids.indexOf(locker) == -1
                              ? `<option value="${locker}">${locker}</option>${lockerOptions}`
                              : lockerOptions;
                            section.$subscriptionLockerElement.html(options);
                            if (locker) {
                              section.$subscriptionLockerElement.val(locker);
                            } else {
                              section.$subscriptionLockerElement.val('');
                            }
                          });
                        } else {
                          section.$subscriptionLockerElement.html('<option value="">- Select a Location -</option>');
                        }

                        section.$subscriptionLockerElement.trigger('init');
                      });
                    }
                  }),
                  {
                    title: 'Locker',
                    required: true,
                    bindTo: 'locker',
                    type: 'dropdown',
                    choices: [{ text: '- Select a Location -', value: '' }],
                    className: 'col-md-4 hide locationItem',

                    postRender: (({ section, field, formValidator } = {}) => {
                      const $element = $(`#${field.id}`);

                      section.$subscriptionLockerElement = $element;

                      $element.on('init', () => {
                        if ($element.val()) {
                          formValidator.validateField(field.id);
                        } else {
                          formValidator.updateStatus(field.id, 'NOT_VALIDATED');
                        }
                      });

                      $element.on('init change', () => {
                        const val = $element.val();
                        switch (model.get('request_type')) {
                          case 'Bicycle Lockers':
                            if (val) {
                              model.set('request_locker_choice_1', val);
                            } else {
                              model.unset('request_locker_choice_1');
                            }
                            break;

                          case 'Bicycle Stations':
                            if (val) {
                              model.set('request_station_choice_1', val);
                            } else {
                              model.unset('request_station_choice_1');
                            }
                            break;
                        }
                      });
                    })
                  },
                  Object.assign({}, entityCustomerDetails__fields.station(auth), {
                    className: 'col-md-4 hide stationItem',

                    postRender: ({ section, field, model } = {}) => {
                      const $element = $(`#${field.id}`);

                      section.$subscriptionStationElement = $element;

                      $element.on('init change', () => {
                        if (model.get(field.bindTo)) {
                          ajaxes({
                            beforeSend(jqXHR) {
                              if (auth && auth.sId) {
                                jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
                              }
                            },
                            contentType: 'application/json; charset=utf-8',
                            method: 'GET',
                            url: `/* @echo C3DATA_KEYFOBS_URL */?$filter=stations/any(s:s eq '${$element.val()}')&$orderby=number`
                          }).then(({ data }) => {
                            const keyfobOptions = `
                              <option value="">- Select -</option>
                              ${data.value.map((keyfob) => `<option value="${keyfob.id}">${keyfob.number}</option>`).join('')}
                            `;

                            const ids = data.value.map((keyfob) => keyfob.id);

                            const keyfob = model.get('keyfob');
                            const options = keyfob && ids.indexOf(keyfob) == -1
                              ? `<option value="${keyfob}">${keyfob}</option>${keyfobOptions}`
                              : keyfobOptions;
                            section.$subscriptionKeyfobElement.html(options);
                            if (keyfob) {
                              section.$subscriptionKeyfobElement.val(keyfob);
                            } else {
                              section.$subscriptionKeyfobElement.val('');
                            }
                          });
                        } else {
                          section.$subscriptionKeyfobElement.html('<option value="">- Select a Location -</option>');
                        }

                        section.$subscriptionKeyfobElement.trigger('init');
                      });
                    }
                  })
                ]
              },
              {
                fields: [
                  entityCustomerDetails__fields.subscription_start_date,
                  entityCustomerDetails__fields.subscription_expiration_date,
                  entityCustomerDetails__fields.subscription_end_date
                ]
              },
              {
                fields: [
                  Object.assign({}, entityCustomerDetails__fields.locker_key_date_assigned, {
                    className: 'col-md-4',

                    postRender: ({ field } = {}) => {
                      const $element = $(`#${field.id}`);

                      const $rowElement = $element.closest('.row');
                      $rowElement.addClass('hide locationItem');
                    }
                  }),
                  Object.assign({}, entityCustomerDetails__fields.locker_key_date_returned, { className: 'col-md-4' })
                ]
              },
              {
                fields: [
                  {
                    title: 'Key Fob',
                    required: false,
                    bindTo: 'keyfob',
                    type: 'dropdown',
                    choices: [{ text: '- Select a Station -', value: '' }],

                    postRender: (({ section, field, formValidator } = {}) => {
                      const $element = $(`#${field.id}`);

                      section.$subscriptionKeyfobElement = $element;

                      const $rowElement = $element.closest('.row');
                      $rowElement.addClass('hide stationItem');

                      $element.on('init', () => {
                        if ($element.val()) {
                          formValidator.validateField(field.id);
                        } else {
                          formValidator.updateStatus(field.id, 'NOT_VALIDATED');
                        }
                      });

                      $element.on('init change', () => {
                        const val = $element.val();
                        switch (model.get('request_type')) {
                          case 'Bicycle Lockers':
                            if (val) {
                              model.set('request_locker_choice_1', val);
                            } else {
                              model.unset('request_locker_choice_1');
                            }
                            break;

                          case 'Bicycle Stations':
                            if (val) {
                              model.set('request_station_choice_1', val);
                            } else {
                              model.unset('request_station_choice_1');
                            }
                            break;
                        }
                      });
                    })
                  },
                  entityCustomerDetails__fields.keyfob_date_assigned,
                  entityCustomerDetails__fields.keyfob_date_returned
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
                  Object.assign({}, entityCustomerDetails__fields.id(model), { className: 'col-md-8' }),
                  Object.assign({}, entityCustomerDetails__fields.__Status(auth, model), { className: 'col-md-4' })
                ]
              },
              {
                fields: [
                  entityCustomerDetails__fields.__CreatedOn(model),
                  entityCustomerDetails__fields.__ModifiedOn(model),
                  entityCustomerDetails__fields.__Owner(model)
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
