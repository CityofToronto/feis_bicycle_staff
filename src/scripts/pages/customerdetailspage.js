/* global $ Backbone */
/* global IEversion */
/* global renderForm */

/* exported renderCustomerDetailsPage */
function renderCustomerDetailsPage($container, id, query, auth, routeCbk) {
  if (id === 'new') {
    id = null;
  }

  if (query) {
    query = `?${query}`;
  } else {
    query = '';
  }

  $container.html(`
    <p><a href="#customers${query}">Back to Customers</a></p>

    ${id ? `
      <div class="navbar">
        <ul class="nav nav-tabs">
          <li class="nav-item active" role="presentation">
            <a class="nav-link">Location</a>
          </li>

          <li class="nav-item" role="presentation">
            <a class="nav-link">Notes</a>
          </li>

          <li class="nav-item" role="presentation">
            <a class="nav-link">Registrations</a>
          </li>

          <li class="nav-item" role="presentation">
            <a class="nav-link">Subscriptions</a>
          </li>

          <li class="nav-item" role="presentation">
            <a class="nav-link">Payments</a>
          </li>
        </ul>
      </div>
    ` : ''}

    <div class="form"></div>
  `);

  let Model = Backbone.Model.extend({
    defaults: {
      municipality: 'Toronto',
      province: 'Ontario',
      __Status: 'Active'
    }
  });

  let model = new Model({ id });

  let disableCallbackChaining = false;
  const definition = {
    sections: [
      {
        title: 'Contact Information',

        rows: [
          {
            fields: [
              {
                title: 'First Name',
                bindTo: 'first_name',
                required: true
              },
              {
                title: 'Last Name',
                bindTo: 'last_name',
                required: true
              },
              {
                title: 'Title',
                bindTo: 'title'
              }
            ]
          },
          {
            fields: [
              {
                title: 'Email',
                type: 'text',
                bindTo: 'email',
                id: 'email',

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
                bindTo: 'primary_phone',
                id: 'primary_phone',

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
                bindTo: 'alternate_phone',
                id: 'alternate_phone',

                validators: {
                  callback: {
                    callback: (value, validator, $field) => {
                      if (!disableCallbackChaining) {
                        disableCallbackChaining = true;
                        const formValidator = $container.find('.form form').data('formValidation');
                        formValidator.revalidateField('email');
                        formValidator.revalidateField('primary_phone');
                        disableCallbackChaining = false;
                      }

                      if (value == '' && $('#email').val() == '' && $('#primary_phone').val() == '') {
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
              }
            ]
          },
          {
            fields: [
              {
                title: 'Street Address',
                bindTo: 'civic_address'
              }
            ]
          },
          {
            fields: [
              {
                title: 'City',
                bindTo: 'municipality'
              },
              {
                title: 'Province',
                bindTo: 'province',
                type: 'dropdown',
                choices: '/* @echo C3DATAMEDIA_PROVINCE_CHOICES */'
              },
              {
                title: 'Postal Code',
                bindTo: 'postal_code',
                validationtype: 'PostalCode'
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

    routeCbk,

    saveButtonLabel: (model) => model.isNew() ? 'Create Customer' : 'Update Customer',
    cancelButtonLabel: 'Cancel',
    cancelButtonFragment: `customers${query}`,
    removeButtonLabel: 'Remove Customer',
    removePromptValue: 'DELETE'
  });
}
