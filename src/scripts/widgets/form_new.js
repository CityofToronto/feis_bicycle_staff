/* global $ Backbone moment */
/* global CotForm */
/* global deepCloneObject */

/* exported renderForm2 */
function renderForm2($container, definition, json, options = {}) {
  const {
    includeMeta = true
  } = options;

  const model = new Backbone.Model(json);

  let $form, formValidator;

  definition = deepCloneObject(definition);
  definition.rootPath = definition.rootPath || '/* @echo SRC_PATH *//';
  definition.useBinding = definition.useBinding || true;

  definition.success = definition.success || function (event) {
    event.preventDefault();

    return false;
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
                  $(`#${field.id}`).val(moment(model.get(field.bindTo)).format('YYYY/MM/DD h:mm:ss A'));
                });
                $(`#${field.id}`).val(moment(model.get(field.bindTo)).format('YYYY/MM/DD h:mm:ss A'));
              }
            },
            {
              title: 'Modified On',
              bindTo: '__ModifiedOn',
              required: true,
              htmlAttr: { readOnly: true },

              postRender({ field }) {
                model.on(`change:${field.bindTo}`, () => {
                  $(`#${field.id}`).val(moment(model.get(field.bindTo)).format('YYYY/MM/DD h:mm:ss A'));
                });
                $(`#${field.id}`).val(moment(model.get(field.bindTo)).format('YYYY/MM/DD h:mm:ss A'));
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

  Promise.resolve()
    .then(() => {
      return doPreRender();
    })
    .then(() => {
      const cotForm = new CotForm(definition);
      cotForm.setModel(model);
      cotForm.render({ target: $container });

      $form = $container.find('form');
      formValidator = $form.data('formValidation');

      return doPostRender();
    });
}
