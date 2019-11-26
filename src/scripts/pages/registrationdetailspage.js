/* global $ Backbone */
/* global IEversion */
/* global renderForm */

/* exported renderRegistrationDetailsPage */
function renderRegistrationDetailsPage($container, id, query, auth, routeCbk) {
  if (id === 'new') {
    id = null;
  }

  if (query) {
    query = `?${query}`;
  } else {
    query = '';
  }

  $container.html(`
    <p><a href="#registrations${query}">Back to Registrations</a></p>

    ${id ? `
      <div class="navbar">
        <ul class="nav nav-tabs">
          <li class="nav-item active" role="presentation">
            <a class="nav-link">Registration</a>
          </li>

          <li class="nav-item" role="presentation">
            <a class="nav-link">Notes</a>
          </li>
        </ul>
      </div>
    ` : ''}

    <div class="form"></div>
  `);

  let Model = Backbone.Model.extend({
    defaults: {
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
      },
      {
        title: 'Request Details',

        rows: [
          {
            fields: [
              {
                title: 'Type',
                type: 'dropdown',
                bindTo: 'request_type',
                choices: [
                  { text: 'Bicycle Lockers' },
                  { text: 'Bicycle Stations' }
                ],
                className: 'col-sm-4',
                required: true,

                postRender({ $form, model, field }) {
                  let lastValue = model.get(field.bindTo);

                  const handler = () => {
                    const value = model.get(field.bindTo);

                    const $lockers_group = $form.find('.lockers_group');
                    if (value === 'Bicycle Lockers') {
                      $lockers_group.removeClass('hide');
                    } else {
                      $lockers_group.addClass('hide');
                    }

                    const $stations_group = $form.find('.stations_group');
                    if (value === 'Bicycle Stations') {
                      $stations_group.removeClass('hide');
                    } else {
                      $stations_group.addClass('hide');
                    }

                    let announcements = [];
                    switch (lastValue) {
                      case 'Bicycle Lockers':
                        announcements.push('Bicycle lockers first choice field has been removed.');
                        announcements.push('Bicycle lockers second choice field has been removed.');
                        announcements.push('Bicycle lockers third choice field has been removed.');
                        break;
                      case 'Bicycle Stations':
                        announcements.push('Bicycle stations first choice field has been removed.');
                        announcements.push('Bicycle stations second choice field has been removed.');
                        announcements.push('Bicycle stations third choice field has been removed.');
                        announcements.push('Bicycle information section has been removed.');
                        break;
                    }
                    lastValue = value;
                    switch (value) {
                      case 'Bicycle Lockers':
                        announcements.push('Bicycle lockers first choice field has been added.');
                        announcements.push('Bicycle lockers second choice field has been added.');
                        announcements.push('Bicycle lockers third choice field has been added.');
                        break;
                      case 'Bicycle Stations':
                        announcements.push('Bicycle stations first choice field has been added.');
                        announcements.push('Bicycle stations second choice field has been added.');
                        announcements.push('Bicycle stations third choice field has been added.');
                        announcements.push('Bicycle information section has been added.');
                    }
                    document.querySelector('.js-aria-live').textContent = announcements.join(' ');
                  };
                  model.on(`change:${field.bindTo}`, handler);
                }
              }
            ]
          },
          {
            fields: [
              {
                type: 'html',
                html: '<h4 id="bicycle_lockers">Bicycle Lockers</h4>',
                className: 'col-xs-12 heading',

                postRender({ field }) {
                  $(`#${field.id}Element`).parent().addClass('hide lockers_group');
                }
              }
            ]
          },
          {
            fields: [
              {
                title: 'First Choice',
                type: 'dropdown',
                bindTo: 'lockers_choice_1',
                id: 'lockers_choice_1',
                choices: {
                  url: '/* @echo C3DATA_LOCATIONS */?$select=id,name&$filter=__Status eq \'Active\'',
                  headers: auth && auth.sId ? { Authorization: `AuthSession ${auth.sId}` } : {},
                },
                choicesMap(result) {
                  if (!result || !Array.isArray(result.value)) {
                    return [];
                  }

                  return result.value.map((value) => ({
                    value: value.id,
                    text: value.name
                  })).sort((a, b) => {
                    if (a.text.toLowerCase() < b.text.toLowerCase()) {
                      return -1;
                    }
                    if (a.text.toLowerCase() > b.text.toLowerCase()) {
                      return 1;
                    }
                    return 0;
                  });
                },
                required: true,

                validators: {
                  callback: {
                    callback: (input) => {
                      if (!disableCallbackChaining) {
                        disableCallbackChaining = true;
                        const formValidator = $container.find('.form form').data('formValidation');
                        formValidator.revalidateField('lockers_choice_2');
                        formValidator.revalidateField('lockers_choice_3');
                        disableCallbackChaining = false;
                      }

                      if (input === '') {
                        return true;
                      }

                      if (input == $('#lockers_choice_2').val() || input == $('#lockers_choice_3').val()) {
                        return false;
                      }

                      return true;
                    },
                    message: 'You cannot select the same choice.'
                  }
                },

                postRender({ field }) {
                  $(`#${field.id}Element`).parent().addClass('hide lockers_group');
                  $(`#${field.id}Element`).find('label').attr('aria-labelledby', 'bicycle_lockers');
                }
              },
              {
                title: 'Second Choice',
                type: 'dropdown',
                bindTo: 'lockers_choice_2',
                id: 'lockers_choice_2',
                choices: {
                  url: '/* @echo C3DATA_LOCATIONS */?$select=id,name&$filter=__Status eq \'Active\'',
                  headers: auth && auth.sId ? { Authorization: `AuthSession ${auth.sId}` } : {},
                },
                choicesMap(result) {
                  if (!result || !Array.isArray(result.value)) {
                    return [];
                  }

                  return result.value.map((value) => ({
                    value: value.id,
                    text: value.name
                  })).sort((a, b) => {
                    if (a.text.toLowerCase() < b.text.toLowerCase()) {
                      return -1;
                    }
                    if (a.text.toLowerCase() > b.text.toLowerCase()) {
                      return 1;
                    }
                    return 0;
                  });
                },

                validators: {
                  callback: {
                    callback: (input) => {
                      if (!disableCallbackChaining) {
                        disableCallbackChaining = true;
                        const formValidator = $container.find('.form form').data('formValidation');
                        formValidator.revalidateField('lockers_choice_1');
                        formValidator.revalidateField('lockers_choice_3');
                        disableCallbackChaining = false;
                      }

                      if (input === '') {
                        return true;
                      }

                      if (input == $('#lockers_choice_1').val() || input == $('#lockers_choice_3').val()) {
                        return false;
                      }

                      return true;
                    },
                    message: 'You cannot select the same choice.'
                  }
                },

                postRender({ field }) {
                  $(`#${field.id}Element`).find('label').attr('aria-labelledby', 'bicycle_lockers');
                }
              },
              {
                title: 'Third Choice',
                type: 'dropdown',
                bindTo: 'lockers_choice_3',
                id: 'lockers_choice_3',
                choices: {
                  url: '/* @echo C3DATA_LOCATIONS */?$select=id,name&$filter=__Status eq \'Active\'',
                  headers: auth && auth.sId ? { Authorization: `AuthSession ${auth.sId}` } : {},
                },
                choicesMap(result) {
                  if (!result || !Array.isArray(result.value)) {
                    return [];
                  }

                  return result.value.map((value) => ({
                    value: value.id,
                    text: value.name
                  })).sort((a, b) => {
                    if (a.text.toLowerCase() < b.text.toLowerCase()) {
                      return -1;
                    }
                    if (a.text.toLowerCase() > b.text.toLowerCase()) {
                      return 1;
                    }
                    return 0;
                  });
                },

                validators: {
                  callback: {
                    callback: (input) => {
                      if (!disableCallbackChaining) {
                        disableCallbackChaining = true;
                        const formValidator = $container.find('.form form').data('formValidation');
                        formValidator.revalidateField('lockers_choice_1');
                        formValidator.revalidateField('lockers_choice_2');
                        disableCallbackChaining = false;
                      }

                      if (input === '') {
                        return true;
                      }

                      if (input == $('#lockers_choice_1').val() || input == $('#lockers_choice_2').val()) {
                        return false;
                      }

                      return true;
                    },
                    message: 'You cannot select the same choice.'
                  }
                },

                postRender({ field }) {
                  $(`#${field.id}Element`).find('label').attr('aria-labelledby', 'bicycle_lockers');
                }
              }
            ]
          },
          {
            fields: [
              {
                type: 'html',
                html: '<h4 id="bicycle_stations">Bicycle Stations</h4>',
                className: 'col-xs-12 heading',

                postRender({ field }) {
                  $(`#${field.id}Element`).parent().addClass('hide stations_group');
                }
              }
            ]
          },
          {
            fields: [
              {
                title: 'First Choice',
                type: 'dropdown',
                bindTo: 'stations_choice_1',
                id: 'stations_choice_1',
                choices: {
                  url: '/* @echo C3DATA_STATIONS */?$select=id,name&$filter=__Status eq \'Active\'',
                  headers: auth && auth.sId ? { Authorization: `AuthSession ${auth.sId}` } : {},
                },
                choicesMap(result) {
                  if (!result || !Array.isArray(result.value)) {
                    return [];
                  }

                  return result.value.map((value) => ({
                    value: value.id,
                    text: value.name
                  })).sort((a, b) => {
                    if (a.text.toLowerCase() < b.text.toLowerCase()) {
                      return -1;
                    }
                    if (a.text.toLowerCase() > b.text.toLowerCase()) {
                      return 1;
                    }
                    return 0;
                  });
                },
                required: true,

                validators: {
                  callback: {
                    callback: (input) => {
                      if (!disableCallbackChaining) {
                        disableCallbackChaining = true;
                        const formValidator = $container.find('.form form').data('formValidation');
                        formValidator.revalidateField('stations_choice_2');
                        formValidator.revalidateField('stations_choice_3');
                        disableCallbackChaining = false;
                      }

                      if (input === '') {
                        return true;
                      }

                      if (input == $('#stations_choice_2').val() || input == $('#stations_choice_3').val()) {
                        return false;
                      }

                      return true;
                    },
                    message: 'You cannot select the same choice.'
                  }
                },

                postRender({ field }) {
                  $(`#${field.id}Element`).parent().addClass('hide stations_group');
                  $(`#${field.id}Element`).find('label').attr('aria-labelledby', 'bicycle_stations');
                }
              },
              {
                title: 'Second Choice',
                type: 'dropdown',
                bindTo: 'stations_choice_2',
                id: 'stations_choice_2',
                choices: {
                  url: '/* @echo C3DATA_STATIONS */?$select=id,name&$filter=__Status eq \'Active\'',
                  headers: auth && auth.sId ? { Authorization: `AuthSession ${auth.sId}` } : {},
                },
                choicesMap(result) {
                  if (!result || !Array.isArray(result.value)) {
                    return [];
                  }

                  return result.value.map((value) => ({
                    value: value.id,
                    text: value.name
                  })).sort((a, b) => {
                    if (a.text.toLowerCase() < b.text.toLowerCase()) {
                      return -1;
                    }
                    if (a.text.toLowerCase() > b.text.toLowerCase()) {
                      return 1;
                    }
                    return 0;
                  });
                },

                validators: {
                  callback: {
                    callback: (input) => {
                      if (!disableCallbackChaining) {
                        disableCallbackChaining = true;
                        const formValidator = $container.find('.form form').data('formValidation');
                        formValidator.revalidateField('stations_choice_1');
                        formValidator.revalidateField('stations_choice_3');
                        disableCallbackChaining = false;
                      }

                      if (input === '') {
                        return true;
                      }

                      if (input == $('#stations_choice_1').val() || input == $('#stations_choice_3').val()) {
                        return false;
                      }

                      return true;
                    },
                    message: 'You cannot select the same choice.'
                  }
                },

                postRender({ field }) {
                  $(`#${field.id}Element`).find('label').attr('aria-labelledby', 'bicycle_stations');
                }
              },
              {
                title: 'Third Choice',
                type: 'dropdown',
                bindTo: 'stations_choice_3',
                id: 'stations_choice_3',
                choices: {
                  url: '/* @echo C3DATA_STATIONS */?$select=id,name&$filter=__Status eq \'Active\'',
                  headers: auth && auth.sId ? { Authorization: `AuthSession ${auth.sId}` } : {},
                },
                choicesMap(result) {
                  if (!result || !Array.isArray(result.value)) {
                    return [];
                  }

                  return result.value.map((value) => ({
                    value: value.id,
                    text: value.name
                  })).sort((a, b) => {
                    if (a.text.toLowerCase() < b.text.toLowerCase()) {
                      return -1;
                    }
                    if (a.text.toLowerCase() > b.text.toLowerCase()) {
                      return 1;
                    }
                    return 0;
                  });
                },

                validators: {
                  callback: {
                    callback: (input) => {
                      if (!disableCallbackChaining) {
                        disableCallbackChaining = true;
                        const formValidator = $container.find('.form form').data('formValidation');
                        formValidator.revalidateField('stations_choice_1');
                        formValidator.revalidateField('stations_choice_2');
                        disableCallbackChaining = false;
                      }

                      if (input === '') {
                        return true;
                      }

                      if (input == $('#stations_choice_1').val() || input == $('#stations_choice_2').val()) {
                        return false;
                      }

                      return true;
                    },
                    message: 'You cannot select the same choice.'
                  }
                },

                postRender({ field }) {
                  $(`#${field.id}Element`).find('label').attr('aria-labelledby', 'bicycle_stations');
                }
              }
            ]
          }
        ]
      },
      {
        title: 'Bicycle Information',
        className: 'hide panel-default stations_group',

        rows: [
          {
            fields: [
              {
                type: 'html',
                html: '<h4 id="first_bicycle">First Bicycle</h4>',
                className: 'col-xs-12 heading'
              }
            ]
          },
          {
            fields: [
              {
                title: 'Make',
                bindTo: 'bicycle_1_make',
                required: true,

                postRender({ field }) {
                  $(`#${field.id}Element`).find('label').attr('aria-labelledby', 'first_bicycle');
                }
              },
              {
                title: 'Model',
                bindTo: 'bicycle_1_model',
                required: true,

                postRender({ field }) {
                  $(`#${field.id}Element`).find('label').attr('aria-labelledby', 'first_bicycle');
                }
              },
              {
                title: 'Colour',
                bindTo: 'bicycle_1_colour',
                required: true,

                postRender({ field }) {
                  $(`#${field.id}Element`).find('label').attr('aria-labelledby', 'first_bicycle');
                }
              }
            ]
          },
          {
            fields: [
              {
                type: 'html',
                html: '<h4 id="second_bicycle">Second Bicycle</h4>',
                className: 'col-xs-12 heading'
              }
            ]
          },
          {
            fields: [
              {
                title: 'Make',
                bindTo: 'bicycle_2_make',

                postRender({ field }) {
                  $(`#${field.id}Element`).find('label').attr('aria-labelledby', 'second_bicycle');
                }
              },
              {
                title: 'Model',
                bindTo: 'bicycle_2_model',

                postRender({ field }) {
                  $(`#${field.id}Element`).find('label').attr('aria-labelledby', 'second_bicycle');
                }
              },
              {
                title: 'Colour',
                bindTo: 'bicycle_2_colour',

                postRender({ field }) {
                  $(`#${field.id}Element`).find('label').attr('aria-labelledby', 'second_bicycle');
                }
              }
            ]
          }
        ]
      }
    ],

    postRender({ model }) {
      model.trigger('change:request_type');
    }
  };

  return renderForm($container.find('.form'), definition, {
    auth,
    model,
    url: '/* @echo C3DATA_REGISTRATIONS */',

    routeCbk,

    saveButtonLabel: (model) => model.isNew() ? 'Create Locker Location' : 'Update Locker Location',
    cancelButtonLabel: 'Cancel',
    cancelButtonFragment: `registrations${query}`,
    removeButtonLabel: 'Remove Locker Location',
    removePromptValue: 'DELETE'
  });
}
