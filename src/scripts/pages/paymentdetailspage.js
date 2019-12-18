/* global $ Backbone */
/* global IEversion */
/* global ajaxes */
/* global renderForm */

/* exported paymentDetailsPage__fetch */
function paymentDetailsPage__fetch(id, auth) {
  return Promise.resolve().then(() => {
    if (id != 'new') {
      return ajaxes(`/* @echo C3DATA_CUSTOMERS */('${id}')`, {
        contentType: 'application/json; charset=utf-8',
        method: 'GET',
        beforeSend(jqXHR) {
          if (auth && auth.sId) {
            jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
          }
        }
      });
    }

    return {
      data: {}
    };
  }).then(({ data }) => {
    let Model = Backbone.Model.extend({
      defaults: {
        "date": "string",
        "customer": "string",
        "customer_first_name": "string",
        "customer_last_name": "string",
        "customer_title": "string",
        "customer_email": "string",
        "customer_primary_phone": "string",
        "customer_alternate_phone": "string",
        "customer_civic_address": "string",
        "customer_municipality": "string",
        "customer_province": "string",
        "customer_postal_code": "string",
        "location": "string",
        "location_site_name": "string",
        "location_civic_address": "string",
        "location_municipality": "string",
        "location_province": "string",
        "location_postal_code": "string",
        "locker": "string",
        "locker_number": "string",
        "station_site_name": "string",
        "station_civic_address": "string",
        "station_municipality": "string",
        "station_province": "string",
        "station_postal_code": "string",
        "amount": 0,
        "pay_type": "Cash",
        "sub_total": 0,
        "tax": 0,
        "total": 0,

        __Status: 'Active'
      }
    });

    return new Model(data);
  });
}

/* exported paymentDetailsPage__render */
function paymentDetailsPage__render($container, opt, opt2, id, query, model, auth, updateCallback) {
  $container.html(`
    <p><a href="#customers/${opt}/${opt2}">Back to Customer Request</a></p>

    <div class="navbarContainer"></div>

    <div class="form"></div>
  `);

  function renderNavBar() {
    $container.find('.navbarContainer').html(`
      <div class="navbar">
        <ul class="nav nav-tabs">
          <li class="nav-item active" role="presentation">
            <a href="#customers/${opt}/${opt2}/${model.id}" class="nav-link">Payment</a>
          </li>

          <li class="nav-item" role="presentation">
          <a href="#customers/${opt}/${opt2}/${model.id}/payments" class="nav-link">Payments</a>
          </li>
        </ul>
      </div>
    `);
  }

  if (!model.isNew()) {
    renderNavBar();
  }

  let disableCallbackChaining = false;
  const definition = {
    betterSuccess({ auth, model, url }) {
      let data = model.toJSON();
      delete data.__CreatedOn;
      delete data.__ModifiedOn;
      delete data.__Owner;

      const method = data.id ? 'PUT' : 'POST';

      return ajaxes({
        url: `${url}${data.id ? `('${data.id}')` : ''}`,
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(data),
        dataType: 'json',
        method,
        beforeSend(jqXHR) {
          if (auth && auth.sId) {
            jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
          }
        }
      }).then(({ data }) => {
        model.set(data);
        renderNavBar();
        updateCallback();
      });
    },

    sections: [
      {
        title: 'Customer Information',

        rows: [
          {
            fields: [
              {
                title: 'Customer',
                bindTo: 'customer',
                required: true
              }
            ]
          },
          {
            fields: [
              {
                title: 'First Name',
                bindTo: 'customer_first_name',
                required: true,
                htmlAttr: { readOnly: true }
              },
              {
                title: 'Last Name',
                bindTo: 'customer_last_name',
                required: true,
                htmlAttr: { readOnly: true }
              },
              {
                title: 'Title',
                bindTo: 'customer_title',
                htmlAttr: { readOnly: true }
              }
            ]
          },
          {
            fields: [
              {
                title: 'Email',
                type: 'text',
                bindTo: 'customer_email',
                id: 'email',
                htmlAttr: { readOnly: true },

                validators: {
                  callback: {
                    callback: (input) => {
                      if (!disableCallbackChaining) {
                        disableCallbackChaining = true;
                        const formValidator = $container.find('.form form').data('formValidation');
                        formValidator.revalidateField('primary_phone');
                        formValidator.revalidateField('alternate_phone');
                        disableCallbackChaining = false;
                      }

                      if (input == '' && $('#primary_phone').val() == '' && $('#alternate_phone').val() == '') {
                        return false;
                      }

                      return true;
                    },
                    message: 'Please include atleast 1 contact information.'
                  },
                  regexp: {
                    regexp: new RegExp("^(([^<>()\\[\\]\\\\.,:;\\s@\"]+(\\.[^<>()\\[\\]\\\\.,:;\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$"),
                    message: 'The value is not a valid email address'
                  }
                },
              },
              {
                title: 'Primary Phone',
                type: 'phone',
                bindTo: 'customer_primary_phone',
                id: 'primary_phone',
                htmlAttr: { readOnly: true },

                validators: {
                  callback: {
                    callback: (value, validator, $field) => {
                      if (!disableCallbackChaining) {
                        disableCallbackChaining = true;
                        const formValidator = $container.find('.form form').data('formValidation');
                        formValidator.revalidateField('email');
                        formValidator.revalidateField('alternate_phone');
                        disableCallbackChaining = false;
                      }

                      if (value == '' && $('#email').val() == '' && $('#alternate_phone').val() == '') {
                        return {
                          valid: false,
                          message: 'Please include atleast 1 contact information.'
                        };
                      }

                      if (IEversion < 10) {
                        if (value !== '') {
                          if (value.match(/\d{3}-?\d{3}-?\d{4}/) && value.match(/\d{3}-?\d{3}-?\d{4}/)[0] == value) {
                            $field.val(value.replace(/(\d{3})-?(\d{3})-?(\d{4})/, '$1-$2-$3'));
                            return {
                              valid: true
                            };
                          } else {
                            return {
                              valid: false,
                              message: 'This field must be a valid phone number.'
                            };
                          }
                        } else {
                          return {
                            valid: true
                          };
                        }
                      } else {
                        if (value === '' || $field.intlTelInput('isValidNumber')) {
                          return {
                            valid: true
                          };
                        } else {
                          return {
                            valid: false,
                            message: 'This field must be a valid phone number.'
                          };
                        }
                      }
                    }
                  }
                },
              },
              {
                title: 'Alternate Phone',
                type: 'phone',
                bindTo: 'customer_alternate_phone',
                id: 'alternate_phone',
                htmlAttr: { readOnly: true }
              }
            ]
          },
          {
            fields: [
              {
                title: 'Street Address',
                bindTo: 'customer_civic_address',
                className: 'col-sm-8'
              }
            ]
          },
          {
            fields: [
              {
                title: 'City',
                bindTo: 'customer_municipality'
              },
              {
                title: 'Province',
                bindTo: 'customer_province',
                type: 'dropdown',
                choices: '/* @echo C3DATAMEDIA_PROVINCE_CHOICES */'
              },
              {
                title: 'Postal Code',
                bindTo: 'customer_postal_code',
                validationtype: 'PostalCode'
              }
            ]
          }
        ]
      },
      {
        title: 'Cart',

        rows: [
          {
            grid: {
              title: 'Cart',
              headers: [
                {
                  title: 'Type'
                },
                {
                  title: 'Description'
                },
                {
                  title: 'Total'
                }
              ],
              fields: [
                {
                  type: 'dropdown',
                  choices: [{ text: 'Locker' }]
                },
                {
                  type: 'static'
                },
                {
                  type: 'static'
                }
              ]
            }
          },
          {
            fields: [
              {
                title: 'Total',
                type: 'text',
                value: '0.00',
                htmlAttr: { readOnly: true }
              },
              {
                title: 'Tax (15%)',
                type: 'text',
                value: '0.00',
                htmlAttr: { readOnly: true }
              },
              {
                title: 'After Tax',
                type: 'text',
                value: '0.00',
                htmlAttr: { readOnly: true }
              }
            ]
          }
        ]
      },
      {
        title: 'Payment',

        rows: [
          {
            fields: [
              {
                title: 'Date',
                required: true
              },
              {
                title: 'Type',
                required: true
              },
              {
                title: 'Amount',
                required: true
              },
            ]
          }, {
            fields: [
              {
                title: 'Notes',
                type: 'textarea',
                rows: 10
              }
            ]
          }
        ]
      }
    ],
  };

  return renderForm($container.find('.form'), definition, {
    auth,
    model,
    url: '/* @echo C3DATA_CUSTOMERS */',

    saveButtonLabel: (model) => model.isNew() ? 'Create Customer' : 'Update Customer',

    cancelButtonLabel: 'Cancel',
    cancelButtonFragment: `customers/${opt}/${opt2}`,

    removeButtonLabel: 'Remove Customer',
    removePromptValue: 'DELETE'
  });
}
