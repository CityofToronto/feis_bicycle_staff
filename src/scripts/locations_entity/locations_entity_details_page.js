/* global $ Backbone */
/* global ajaxes auth__checkLogin modal__showConfirm query__objectToString query__stringToObject renderAlert toSnapShot */
/* global renderForm */
/* global locationsEntity__views locationsEntity__fields */

/* exported locationsEntityDetailsPage */
function locationsEntityDetailsPage(app, $container, router, auth, opt1, id1, query) {

  // ---
  const VIEWS = locationsEntity__views;

  const VIEW__DEFAULT = VIEWS.all;
  const VIEW__CURRENT = VIEWS[opt1];

  const DEFAULT_REDIRECT = 'Locations';
  const DEFAULT_REDIRECT_FRAGMENT = VIEW__DEFAULT.fragment;

  const TITLE__FUNC = function (data) {
    if (data.id) {
      return 'New Location';
    } else {
      return data.site_name;
    }
  };

  const BREADCRUMBS = [
    { name: app.name, link: '#home' },
    { name: 'Entities', link: `#entities` },
    { name: 'Locations', link: `#${VIEW__DEFAULT.fragment}` },
    { name: VIEW__CURRENT.breadcrumb, link: `#${VIEW__CURRENT.fragment}` }
  ];
  const BREADCRUMBS__FUNC = (data) => BREADCRUMBS.concat({
    name: data.id ? 'New' : data.id.site_name,
    link: data.id ? null : `#${VIEW__CURRENT.fragment}/${data.id}`
  });

  const ITEM = 'Location';

  const DATAACCESS_URL = '/* @echo C3DATA_LOCATIONS_URL */';

  const MODEL = Backbone.Model.extend({
    defaults: {
      municipality: 'Toronto',
      province: 'Ontario',
      __Status: 'Active'
    }
  });

  const COT_FORM_SECTIONS = [
    {
      title: 'Details',

      rows: [
        {
          fields: [
            Object.assign({}, locationsEntity__fields.site_name, { className: 'col-md-4' }),
            Object.assign({}, locationsEntity__fields.description, { className: 'col-md-8' })
          ]
        },
        {
          fields: [
            Object.assign({}, locationsEntity__fields.civic_address, { className: 'col-md-8' })
          ]
        },
        {
          fields: [
            locationsEntity__fields.municipality,
            locationsEntity__fields.province({ auth }),
            locationsEntity__fields.postal_code
          ]
        }
      ]
    },
    {
      title: 'Contacts',

      rows: [
        {
          fields: [
            locationsEntity__fields.primary_contact_heading
          ]
        },
        {
          fields: [
            Object.assign({}, locationsEntity__fields.primary_contact_first_name, { title: 'First Name', className: 'col-md-4' }),
            Object.assign({}, locationsEntity__fields.primary_contact_last_name, { title: 'Last Name', className: 'col-md-4' })
          ]
        },
        {
          fields: [
            Object.assign({}, locationsEntity__fields.primary_contact_email, { title: 'Email' }),
            Object.assign({}, locationsEntity__fields.primary_contact_primary_phone, { title: 'Primary Phone' }),
            Object.assign({}, locationsEntity__fields.primary_contact_alternate_phone, { title: 'Alternate Phone' })
          ]
        },
        {
          fields: [
            locationsEntity__fields.alternate_contact_heading
          ]
        },
        {
          fields: [
            Object.assign({}, locationsEntity__fields.alternate_contact_first_name, { title: 'First Name', className: 'col-md-4' }),
            Object.assign({}, locationsEntity__fields.alternate_contact_last_name, { title: 'Last Name', className: 'col-md-4' })
          ]
        },
        {
          fields: [
            Object.assign({}, locationsEntity__fields.alternate_contact_email, { title: 'Email' }),
            Object.assign({}, locationsEntity__fields.alternate_contact_primary_phone, { title: 'Primary Phone' }),
            Object.assign({}, locationsEntity__fields.alternate_contact_alternate_phone, { title: 'Alternate Phone' })
          ]
        }
      ]
    },
    {
      title: 'Latest Note',
      id: 'latest_note',
      postRender({ model, section }) {
        const $element = $(`#${section.id}`);
        model.on('init change:id', () => {
          if (model.isNew()) {
            $element.hide();
          } else {
            $element.show();
          }
        });
      },

      rows: [
        {
          fields: [
            Object.assign({}, locationsEntity__fields.latest_note__date, { title: 'Date', className: 'col-md-4' })
          ]
        },
        {
          fields: [
            Object.assign({}, locationsEntity__fields.latest_note__note, { title: 'Note' })
          ]
        }
      ]
    },
    {
      title: 'Latest Inspection',
      id: 'latest_inspection',
      postRender({ model, section }) {
        const $element = $(`#${section.id}`);
        model.on('init change:id', () => {
          if (model.isNew()) {
            $element.hide();
          } else {
            $element.show();
          }
        });
      },

      rows: [
        {
          fields: [
            Object.assign({}, locationsEntity__fields.latest_inspection__date, { title: 'Date', className: 'col-md-4' }),
            Object.assign({}, locationsEntity__fields.latest_inspection__result, { title: 'Result', className: 'col-md-4' })
          ]
        },
        {
          fields: [
            Object.assign({}, locationsEntity__fields.latest_inspection__note, { title: 'Note' })
          ]
        }
      ]
    },
    {
      title: 'Meta',
      id: 'meta',
      postRender({ model, section }) {
        const $element = $(`#${section.id}`);
        model.on('init change:id', () => {
          if (model.isNew()) {
            $element.hide();
          } else {
            $element.show();
          }
        });
      },

      rows: [
        {
          fields: [
            Object.assign({}, locationsEntity__fields.id, { className: 'col-md-8' }),
            Object.assign({}, locationsEntity__fields.__Status({ auth }), { className: 'col-md-4' })
          ]
        },
        {
          fields: [
            locationsEntity__fields.__CreatedOn,
            locationsEntity__fields.__ModifiedOn,
            locationsEntity__fields.__Owner
          ]
        }
      ]
    }
  ];
  // ---

  if (!(opt1 in VIEWS)) {
    return router.navigate(`${VIEW__DEFAULT.fragment}?${query__objectToString({ resetState: 'yes' })}`,
      { trigger: true, replace: true });
    // EXIT
  }

  return auth__checkLogin(auth).then((isLoggedIn) => {
    if (!isLoggedIn) {
      return router.navigateToLoginPage();
      // EXIT
    }

    const {
      redirectTo = DEFAULT_REDIRECT,
      redirectToFragment = DEFAULT_REDIRECT_FRAGMENT
    } = query__stringToObject(query);

    $container.empty();

    // ADD REDIRECT
    $container.append(`<p><a href="#${redirectToFragment}">Back to ${redirectTo}</a></p>`);

    return Promise.resolve().then(() => {
      if (id1 !== 'new') {
        return ajaxes({
          beforeSend(jqXHR) {
            if (auth && auth.sId) {
              jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
            }
          },
          contentType: 'application/json; charset=utf-8',
          method: 'GET',
          url: `${DATAACCESS_URL}('${id1}')`
        });
      }

      return { data: {} };
    }).then(({ data }) => {
      const model = new MODEL(data);

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

            router.navigate(`${VIEW__CURRENT.fragment}/${data.id}`, { trigger: false, replace: true });

            return { data, textStatus, jqXHR };
          }).catch((error) => {
            console.error(error); // eslint-disable-line no-console
            throw error;
          });
        },

        sections: COT_FORM_SECTIONS,

        postRender: ({ model }) => {
          model.trigger('init');
        }
      };

      // ADD COT FORM
      return Promise.resolve().then(() => {
        return renderForm($('<div></div>').appendTo($container), definition, model, {
          auth,
          url: DATAACCESS_URL,

          saveButtonLabel: (model) => model.isNew() ? `Create ${ITEM}` : `Update ${ITEM}`,

          cancelButtonLabel: 'Cancel',
          cancelButtonFragment: VIEW__CURRENT.fragment,

          removeButtonLabel: `Remove ${ITEM}`,
          removePromptValue: 'DELETE'
        });
      }).then(() => {

        // SET TITLE AND BREADCRUMB
        app.setBreadcrumb(BREADCRUMBS__FUNC(model.toJSON()), true);
        app.setTitle(TITLE__FUNC(model.toJSON()));
        model.on('change:id', () => {
          app.setBreadcrumb(BREADCRUMBS__FUNC(model.toJSON()), true);
          app.setTitle(TITLE__FUNC(model.toJSON()));
        });

        // RETURN CLEANUP FUNCTION
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

      // SET TITLE AND BREADCRUMB
      app.setBreadcrumb(BREADCRUMBS.concat({ name: 'Error' }), true);
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
