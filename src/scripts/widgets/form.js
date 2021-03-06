/* global $ Backbone moment */
/* global CotForm */
/* global ajaxes auth__checkLogin deepCloneObject fixButtonLinks functionToValue oData__getErrorMessage modal__showAlert
  modal__showConfirm modal__showLogin modal__showPrompt stringToFunction */
/* global renderAlert */

/* exported renderForm */
function renderForm($container, definition, model, options = {}) {
  const {
    auth,
    url,

    includeMeta = true,

    saveButtonLabel = (model) => model.isNew() ? 'Create' : 'Update',

    cancelButtonLabel = 'Cancel',
    cancelButtonFragment,

    removeButtonLabel = 'Remove',
    removeButtonFragment = cancelButtonFragment,

    otherButtons,

    saveMessage = (model) => model.isNew()
      ? 'New record has been successfully created.'
      : 'Record has been successfully updated.',

    removeMessage = 'Do you want to permanently remove this record?',
    removeMessageCancelButtonLabel = 'Cancel',
    removeMessageConfirmButtonLabel = 'Continue',
    removeSuccessMessage = 'The record was removed',
    removeFailedMessage = 'The record was not removed',
    removePromptValue,
  } = options;

  model = model || new Backbone.Model();

  let $form, formValidator;

  definition = deepCloneObject(definition);

  definition.rootPath = definition.rootPath || '/* @echo SRC_PATH *//';
  definition.useBinding = definition.useBinding || true;

  definition.successCore = definition.successCore || function (data, options = {}) {
    const { auth, id, url } = options;

    return ajaxes({
      beforeSend(jqXHR) {
        if (auth && auth.sId) {
          jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
        }
      },
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(data),
      dataType: 'json',
      method: id ? 'PUT' : 'POST',
      url: `${url}${id ? `('${id}')` : ''}`
    });
  };

  definition.success = definition.success || function (event) {
    event.preventDefault();

    const doSubmit = () => {
      const $disabled = $form.find('button, input, select').filter(':enabled:visible').prop('disabled', true);

      let data = model.toJSON();
      delete data.__CreatedOn;
      delete data.__ModifiedOn;
      delete data.__Owner;

      return definition.successCore(data, { $form, auth, formValidator, id: model.id, url }).then(({ data } = {}) => {
        $disabled.prop('disabled', false);

        const finalSaveMessage = functionToValue(saveMessage, model);
        if (finalSaveMessage) {
          renderAlert($form, finalSaveMessage);
        }

        if (data) {
          model.clear();
          model.set(data);
        }
      }, ({ jqXHR, errorThrown } = {}) => {
        $disabled.prop('disabled', false);

        renderAlert($form, oData__getErrorMessage(jqXHR, errorThrown), { bootstrayType: 'danger' });

        if (auth) {
          auth__checkLogin(auth, true).then((isLoggedIn) => {
            if (!isLoggedIn) {
              modal__showLogin(auth).then((isLoggedIn) => {
                if (isLoggedIn) {
                  doSubmit();
                }
              });
            }
          });
        }
      });
    };
    doSubmit();

    return false;
  };

  definition.removeCore = definition.removeCore || function (id, url, { auth }) {
    return ajaxes({
      url: `${url}('${id}')`,
      method: 'DELETE',
      beforeSend(jqXHR) {
        if (auth && auth.sId) {
          jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
        }
      }
    });
  };

  if (includeMeta) {
    definition.sections.push({
      title: 'Meta',
      id: 'meta',

      rows: [
        {
          fields: [
            {
              title: 'ID',
              bindTo: 'id',
              required: true,
              class: 'col-sm-8',

              postRender({ field }) {
                $(`#${field.id}`).prop('readonly', true);
                model.on(`change:${field.bindTo}`, () => {
                  $(`#${field.id}`).val(model.get(field.bindTo));
                });
              }
            },
            {
              title: 'Status',
              bindTo: '__Status',
              required: true,
              type: 'radio',
              choices: [{ text: 'Active' }, { text: 'Inactive' }],
              orientation: 'horizontal',
              class: 'col-sm-4',

              postRender({ field }) {
                model.on(`change:${field.bindTo}`, () => {
                  $(`#${field.id}Element input[type="radio"][value="${model.get(field.bindTo)}"]`).prop('checked', true);
                });
              }
            }
          ]
        },
        {
          fields: [
            {
              title: 'Created On',
              bindTo: '__CreatedOn',
              required: true,
              htmlAttr: { readOnly: true },

              postRender({ field }) {
                model.on(`change:${field.bindTo}`, () => {
                  $(`#${field.id}`).val(moment(model.get(field.bindTo)).format('YYYY/MM/DD h:mm A'));
                });
                $(`#${field.id}`).val(moment(model.get(field.bindTo)).format('YYYY/MM/DD h:mm A'));
              }
            },
            {
              title: 'Modified On',
              bindTo: '__ModifiedOn',
              required: true,
              htmlAttr: { readOnly: true },

              postRender({ field }) {
                model.on(`change:${field.bindTo}`, () => {
                  $(`#${field.id}`).val(moment(model.get(field.bindTo)).format('YYYY/MM/DD h:mm A'));
                });
                $(`#${field.id}`).val(moment(model.get(field.bindTo)).format('YYYY/MM/DD h:mm A'));
              }
            },
            {
              title: 'Modified By',
              bindTo: '__Owner',
              required: true,
              htmlAttr: { readOnly: true },

              postRender({ field }) {
                model.on(`change:${field.bindTo}`, () => {
                  $(`#${field.id}`).val(model.get(field.bindTo));
                });
              }
            }
          ]
        }
      ],

      postRender({ section }) {
        const $section = $(`#${section.id}`);
        const handler = () => {
          if (model.isNew()) {
            $section.addClass('hide');
          } else {
            $section.removeClass('hide');
          }
        };
        model.on('change:id', handler);
        handler();
      }
    });
  }

  function doRenderLoop({
    formPreRender,
    sectionPreRender,
    rowPreRender,
    fieldRender,
    rowPostRender,
    sectionPostRender,
    formPostRender
  }) {
    const promises = [];

    if (formPreRender) {
      promises.push(formPreRender());
    }

    if (Array.isArray(definition.sections)) {
      definition.sections.forEach((section) => {
        if (sectionPreRender) {
          promises.push(sectionPreRender({ section }));
        }

        if (Array.isArray(section.rows)) {
          section.rows.forEach((row) => {
            if (rowPreRender) {
              promises.push(rowPreRender({ section, row }));
            }

            if (Array.isArray(row.fields)) {
              row.fields.forEach((field) => {
                if (fieldRender) {
                  promises.push(fieldRender({ section, row, field }));
                }
              });
            }

            if (row.grid && Array.isArray(row.grid.fields)) {
              row.grid.fields.forEach((field) => {
                if (fieldRender) {
                  promises.push(fieldRender({ section, row, grid: row.grid, field }));
                }
              });
            }

            if (row.repeatControl && Array.isArray(row.repeatControl.rows)) {
              row.repeatControl.rows.forEach((repeatControlRow) => {
                if (Array.isArray(repeatControlRow.fields)) {
                  repeatControlRow.fields.forEach((field) => {
                    if (fieldRender) {
                      promises.push(fieldRender({ section, row, repeatControl: row.repeatControl, repeatControlRow, field }));
                    }
                  });
                }
              });
            }

            if (rowPostRender) {
              promises.push(rowPostRender({ section, row }));
            }
          });
        }

        if (sectionPostRender) {
          promises.push(sectionPostRender({ section }));
        }
      });
    }

    if (formPostRender) {
      promises.push(formPostRender());
    }

    return Promise.all(promises);
  }

  function doPreRender() {
    return doRenderLoop({
      formPreRender() {
        const renderer = stringToFunction(definition.preRender);
        if (renderer) {
          return renderer({ model, definition });
        }
      },
      SectionPreRender: ({ section }) => {
        const renderer = stringToFunction(section.preRender);
        if (renderer) {
          return renderer({ model, definition, section });
        }
      },
      rowPreRender: ({ section, row }) => {
        const renderer = stringToFunction(row.preRender);
        if (renderer) {
          return renderer({ model, definition, section, row });
        }
      },
      fieldRender: ({ section, row, grid, repeatControl, repeatControlRow, field }) => {
        return Promise.resolve().then(() => {
          if (field.choices && !Array.isArray(field.choices)) {
            let choices = field.choices;
            if (typeof choices === 'string') {
              choices = {
                url: choices,
                method: 'GET'
              };
            }
            if (typeof choices === 'object' && choices !== null) {
              return ajaxes(choices).then(({ data }) => {
                field.choices = data;
              });
            }
          }
        }).then(() => {
          if (field.choices) {
            if (field.choicesMap) {
              const choicesMap = stringToFunction(field.choicesMap);
              field.choices = choicesMap(field.choices);
            }

            if (field.type === 'dropdown' && (field.choices.length === 0 || field.choices[0].value !== '')) {
              field.choices.unshift({ text: '- Select -', value: '' });
            }

            let value;
            if (field.bindTo && model && model.has(field.bindTo)) {
              value = model.get(field.bindTo);
            } else if (field.value) {
              value = field.value;
            }

            if (value) {
              const choices = field.choices.map((choice) => choice.value != null ? choice.value : choice.text);

              if (!Array.isArray(value)) {
                value = [value];
              }

              value.forEach((val) => {
                if (choices.indexOf(val) === -1) {
                  field.choices.unshift({ text: value, value });
                }
              });
            }
          }

          const renderer = stringToFunction(field.preRender);
          if (renderer) {
            return renderer({ model, definition, section, row, grid, repeatControl, repeatControlRow, field });
          }
        });
      }
    });
  }

  function doPostRender() {
    return doRenderLoop({
      fieldRender: ({ section, row, grid, repeatControl, repeatControlRow, field }) => {
        const renderer = stringToFunction(field.postRender);
        if (renderer) {
          return renderer({ $form, formValidator, model, definition, section, row, grid, repeatControl, repeatControlRow, field });
        }
      },
      rowPostRender: ({ section, row }) => {
        const renderer = stringToFunction(row.postRender);
        if (renderer) {
          return renderer({ $form, formValidator, model, definition, section, row });
        }
      },
      sectionPostRender: ({ section }) => {
        const renderer = stringToFunction(section.postRender);
        if (renderer) {
          return renderer({ $form, formValidator, model, definition, section });
        }
      },
      formPostRender: () => {
        const renderer = stringToFunction(definition.postRender);
        if (renderer) {
          return renderer({ $form, formValidator, model, definition });
        }
      }
    });
  }

  return doPreRender().then(() => {
    const cotForm = new CotForm(definition);
    cotForm.setModel(model);
    cotForm.render({ target: $container });

    $form = $container.find('form');
    fixButtonLinks($form);

    formValidator = $form.data('formValidation');

    const $buttons = $('<div class="row"></div>');
    $buttons.appendTo($form);

    $buttons.on('click', '.btn-save', (event) => {
      event.preventDefault();
      $form.submit();
    });
    $buttons.on('click', '.btn-remove', (event) => {
      event.preventDefault();

      if (removeButtonFragment) {
        const doRemove = () => {
          Promise.resolve().then(() => {
            if (removePromptValue) {
              return modal__showPrompt(`${removeMessage} To continue, enter "${removePromptValue}".`, '', {
                title: 'Confirm',
                cancelButtonLabel: removeMessageCancelButtonLabel,
                confirmButtonLabel: removeMessageConfirmButtonLabel,
                confirmButtonBootstrapType: 'danger',
                validators: {
                  callback: {
                    callback(value) {
                      return value === removePromptValue;
                    }
                  }
                }
              }).then((data) => {
                return data === removePromptValue;
              });
            } else {
              return modal__showConfirm(functionToValue(removeMessage, model), {
                title: 'Confirm',
                cancelButtonLabel: removeMessageCancelButtonLabel,
                confirmButtonLabel: removeMessageConfirmButtonLabel
              });
            }
          }).then((confirm) => {
            if (confirm) {
              definition.removeCore(model.id, url, { auth }).then(() => {
                modal__showAlert(removeSuccessMessage);
                Backbone.history.navigate(removeButtonFragment, { trigger: true });
              }, ({ jqXHR, errorThrown }) => {
                renderAlert($container.find('form'), oData__getErrorMessage(jqXHR, errorThrown), { bootstrayType: 'danger' });

                if (auth) {
                  auth__checkLogin(auth, true).then((isLoggedIn) => {
                    if (!isLoggedIn) {
                      modal__showLogin(auth).then((isLoggedIn) => {
                        if (isLoggedIn) {
                          doRemove();
                        }
                      });
                    }
                  });
                }
              });
            } else {
              modal__showAlert(removeFailedMessage);
            }
          });
        };
        doRemove();
      }
    });

    const doButtons = () => {
      $buttons.empty();

      const $leftColumn = $('<div>');

      const finalSaveButtonLabel = functionToValue(saveButtonLabel, model);
      if (finalSaveButtonLabel) {
        $leftColumn.append(`<button class="btn btn-primary btn-lg btn-save">${finalSaveButtonLabel}</button>`);
      }

      const finalOtherButtons = functionToValue(otherButtons, model);
      if (finalOtherButtons) {
        $leftColumn.append(finalOtherButtons);
      }

      if (cancelButtonFragment) {
        $leftColumn.append(`<a href="#${cancelButtonFragment}" class="btn btn-primary btn-lg btn-cancel">${cancelButtonLabel}</a>`);
      }

      const $rightColumn = $('<div class="text-right">');

      if (!model.isNew()) {
        if (removeButtonFragment) {
          $rightColumn.append(`<button class="btn btn-danger btn-lg btn-remove">${removeButtonLabel}</button>`);
        }
      }

      if ($leftColumn.children().length > 0 && $rightColumn.children().length > 0) {
        $leftColumn.addClass('col-sm-6');
        $rightColumn.addClass('col-sm-6');
        $buttons.append($leftColumn, $rightColumn);
      } else if ($leftColumn.children().length > 0) {
        $leftColumn.addClass('col-xs-12');
        $buttons.append($leftColumn);
      } else if ($rightColumn.children().length > 0) {
        $rightColumn.addClass('col-xs-12');
        $buttons.append($rightColumn);
      }

      $leftColumn.children(':not(:first-child)').before(' ');
      $rightColumn.children(':not(:first-child)').before(' ');

      fixButtonLinks($buttons);
    };
    doButtons();

    model.on(`change:${model.idAttribute}`, () => {
      doButtons();
    });

    return doPostRender().then(() => {
      fixButtonLinks($form);
    });
  });
}
