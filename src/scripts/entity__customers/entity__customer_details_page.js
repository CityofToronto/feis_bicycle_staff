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
            postRender: ({ section, formValidator } = {}) => {
              section.$requestTypeElement.trigger('change');
              formValidator.updateStatus(section.$requestTypeElement.attr('id'), 'NOT_VALIDATED');
            },

            rows: [
              {
                fields: [
                  Object.assign({}, entityCustomerDetails__fields.request_type, {
                    className: 'col-md-4',

                    postRender: ({ field, section, model } = {}) => {
                      const $element = $(`#${field.id}`);
                      section.$requestTypeElement = $element;

                      $element.on('change', () => {
                        switch (model.get('request_type')) {
                          case 'Bicycle Lockers':
                            ajaxes({
                              beforeSend(jqXHR) {
                                if (auth && auth.sId) {
                                  jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
                                }
                              },
                              contentType: 'application/json; charset=utf-8',
                              method: 'GET',
                              url: '/* @echo C3DATA_LOCATIONS_URL */?$orderby=site_name'
                            }).then(({ data }) => {
                              const locationOptions = `
                                <option value="">- Select -</option>
                                ${data.value.map((location) => `<option value="${location.id}">${location.site_name} - ? of ${location.lockers_total} lockers available</option>`).join('')}
                              `;

                              const ids = data.value.map((location) => location.id);

                              const choice1 = model.get('request_locker_choice_1');
                              const choice1Options = choice1 && ids.indexOf(choice1) == -1
                                ? `<option value="${choice1}">${choice1}</option>${locationOptions}`
                                : locationOptions;
                              section.$requestChoice1Element.html(choice1Options);
                              if (choice1) {
                                section.$requestChoice1Element.val(choice1);
                              } else {
                                section.$requestChoice1Element.val('');
                              }

                              const choice2 = model.get('request_locker_choice_2');
                              const choice2Options = choice2 && ids.indexOf(choice2) == -1
                                ? `<option value="${choice2}">${choice2}</option>${locationOptions}`
                                : locationOptions;
                              section.$requestChoice2Element.html(choice2Options);
                              if (choice2) {
                                section.$requestChoice2Element.val(choice2);
                              } else {
                                section.$requestChoice2Element.val('');
                              }

                              const choice3 = model.get('request_locker_choice_3');
                              const choice3Options = choice3 && ids.indexOf(choice3) == -1
                                ? `<option value="${choice3}">${choice3}</option>${locationOptions}`
                                : locationOptions;
                              section.$requestChoice3Element.html(choice3Options);
                              if (choice3) {
                                section.$requestChoice3Element.val(choice3);
                              } else {
                                section.$requestChoice3Element.val('');
                              }
                            });
                            break;

                          case 'Bicycle Stations':
                            ajaxes({
                              beforeSend(jqXHR) {
                                if (auth && auth.sId) {
                                  jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
                                }
                              },
                              contentType: 'application/json; charset=utf-8',
                              method: 'GET',
                              url: '/* @echo C3DATA_STATIONS_URL */?$orderby=site_name'
                            }).then(({ data }) => {
                              const stationOptions = `
                                <option value="">- Select -</option>
                                ${data.value.map((station) => `<option value="${station.id}">${station.site_name}</option>`).join('')}
                              `;

                              const ids = data.value.map((station) => station.id);

                              const choice1 = model.get('request_station_choice_1');
                              const choice1Options = choice1 && ids.indexOf(choice1) == -1
                                ? `<option value="${choice1}">${choice1}</option>${stationOptions}`
                                : stationOptions;
                              section.$requestChoice1Element.html(choice1Options);
                              if (choice1) {
                                section.$requestChoice1Element.val(choice1);
                              } else {
                                section.$requestChoice1Element.val('');
                              }

                              const choice2 = model.get('request_station_choice_2');
                              const choice2Options = choice2 && ids.indexOf(choice2) == -1
                                ? `<option value="${choice2}">${choice2}</option>${stationOptions}`
                                : stationOptions;
                              section.$requestChoice2Element.html(choice2Options);
                              if (choice2) {
                                section.$requestChoice2Element.val(choice2);
                              } else {
                                section.$requestChoice2Element.val('');
                              }

                              const choice3 = model.get('request_station_choice_3');
                              const choice3Options = choice3 && ids.indexOf(choice3) == -1
                                ? `<option value="${choice3}">${choice3}</option>${stationOptions}`
                                : stationOptions;
                              section.$requestChoice3Element.html(choice3Options);
                              if (choice3) {
                                section.$requestChoice3Element.val(choice3);
                              } else {
                                section.$requestChoice3Element.val('');
                              }
                            });
                            break;

                          default:
                            section.$requestChoice1Element.html('<option value="">- Select a Request Type -</option>');
                            section.$requestChoice2Element.html('<option value="">- Select a Request Type -</option>');
                            section.$requestChoice3Element.html('<option value="">- Select a Request Type -</option>');
                        }
                      });
                    }
                  })
                ]
              },
              {
                fields: [
                  {
                    title: 'Choice 1',
                    required: true,
                    type: 'dropdown',
                    choices: [{ text: '- Select a Request Type -', value: '' }],

                    postRender: ({ field, section }) => {
                      const $element = $(`#${field.id}`);
                      section.$requestChoice1Element = $element;

                      $element.on('change', () => {
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
                    }
                  },
                  {
                    title: 'Choice 2',
                    required: false,
                    type: 'dropdown',
                    choices: [{ text: '- Select a Request Type -', value: '' }],

                    postRender: ({ field, section }) => {
                      const $element = $(`#${field.id}`);
                      section.$requestChoice2Element = $element;

                      $element.on('change', () => {
                        const val = $element.val();
                        switch (model.get('request_type')) {
                          case 'Bicycle Lockers':
                            if (val) {
                              model.set('request_locker_choice_2', val);
                            } else {
                              model.unset('request_locker_choice_2');
                            }
                            break;

                          case 'Bicycle Stations':
                            if (val) {
                              model.set('request_station_choice_2', val);
                            } else {
                              model.unset('request_station_choice_2');
                            }
                            break;
                        }
                      });
                    }
                  },
                  {
                    title: 'Choice 3',
                    required: false,
                    type: 'dropdown',
                    choices: [{ text: '- Select a Request Type -', value: '' }],

                    postRender: ({ field, section }) => {
                      const $element = $(`#${field.id}`);
                      section.$requestChoice3Element = $element;

                      $element.on('change', () => {
                        const val = $element.val();
                        switch (model.get('request_type')) {
                          case 'Bicycle Lockers':
                            if (val) {
                              model.set('request_locker_choice_3', val);
                            } else {
                              model.unset('request_locker_choice_3');
                            }
                            break;

                          case 'Bicycle Stations':
                            if (val) {
                              model.set('request_station_choice_3', val);
                            } else {
                              model.unset('request_station_choice_3');
                            }
                            break;
                        }
                      });
                    }
                  }
                ]
              }
            ]
          },
          {
            title: 'Subscription',

            rows: [
              {
                fields: [
                  Object.assign({}, entityCustomerDetails__fields.subscription_type, {
                    className: 'col-md-4',

                    postRender: ({ field } = {}) => {
                      const $element = $(`#${field.id}`);

                      $element.on('change', () => {
                        switch ($element.val()) {
                          case 'Bicycle Lockers':
                            $('.locationItem').removeClass('hide');
                            $('.stationItem').addClass('hide');
                            $('.subscriptionItem').removeClass('hide');
                            break;

                          case 'Bicycle Stations':
                            $('.locationItem').addClass('hide');
                            $('.stationItem').removeClass('hide');
                            $('.subscriptionItem').removeClass('hide');
                            break;

                          default:
                            $('.locationItem').addClass('hide');
                            $('.stationItem').addClass('hide');
                            $('.subscriptionItem').addClass('hide');
                        }
                      });
                    }
                  }),
                  Object.assign({}, entityCustomerDetails__fields.location(auth), { className: 'col-md-4 hide locationItem' }),
                  Object.assign({}, entityCustomerDetails__fields.locker, { className: 'col-md-4 hide locationItem' }),
                  Object.assign({}, entityCustomerDetails__fields.station(auth), { className: 'col-md-4 hide stationItem' })
                ]
              },
              {
                fields: [
                  Object.assign({}, entityCustomerDetails__fields.subscription_start_date, {
                    postRender: ({ field } = {}) => {
                      const $element = $(`#${field.id}`);

                      const $rowElement = $element.closest('.row');
                      $rowElement.addClass('hide subscriptionItem');
                    }
                  }),
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
                  Object.assign({}, entityCustomerDetails__fields.keyfob(auth), {
                    postRender: ({ field } = {}) => {
                      const $element = $(`#${field.id}`);

                      const $rowElement = $element.closest('.row');
                      $rowElement.addClass('hide stationItem');
                    }
                  }),
                  entityCustomerDetails__fields.keyfob_date_assigned,
                  entityCustomerDetails__fields.keyfob_date_returned
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
