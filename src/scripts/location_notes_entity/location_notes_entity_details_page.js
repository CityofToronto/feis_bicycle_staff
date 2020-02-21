/* global $ Backbone moment */
/* global ajaxes auth__checkLogin modal__showConfirm query__objectToString query__stringToObject renderAlert toSnapShot */
/* global renderForm */
/* global locationNotesEntity__views entityLocationNotesDetails__fields */

/* exported locationNotesEntityDetailsPage */
function locationNotesEntityDetailsPage(app, $container, router, auth, opt1, id1, query) {

  // ---
  const VIEWS = locationNotesEntity__views;

  const VIEW__DEFAULT = VIEWS.all;
  const VIEW__CURRENT = VIEWS[opt1];

  const DEFAULT_REDIRECT = 'Location Notes';
  const DEFAULT_REDIRECT_FRAGMENT = VIEW__DEFAULT.fragment;

  const TITLE__FUNC = function (data) {
    if (data.id) {
      return data.date;
    } else {
      return 'New Location';
    }
  };

  const BREADCRUMBS = [
    { name: app.name, link: '#home' },
    { name: 'Entities', link: `#entities` },
    { name: 'Location Notes', link: `#${VIEW__DEFAULT.fragment}` },
    { name: VIEW__CURRENT.breadcrumb, link: `#${VIEW__CURRENT.fragment}` }
  ];
  const BREADCRUMBS__FUNC = (data) => BREADCRUMBS.concat({
    name: data.id ? data.date : 'New',
    link: data.id ? `#${VIEW__CURRENT.fragment}/${data.id}` : null
  });

  const ITEM = 'Location Note';

  const DATAACCESS_URL = '/* @echo C3DATA_LOCATION_NOTES_URL */';

  const MODEL = Backbone.Model.extend({
    defaults: {
      date: new Date(),
      __Status: 'Active'
    }
  });

  const COT_FORM_SECTIONS = [
    {
      title: 'Details',

      rows: [
        {
          fields: [
            Object.assign({}, entityLocationNotesDetails__fields.location({ auth }), { className: 'col-md-4' }),
            Object.assign({}, entityLocationNotesDetails__fields.date, { className: 'col-md-4' })
          ]
        },
        {
          fields: [
            entityLocationNotesDetails__fields.note
          ]
        }
      ]
    },
    {
      title: 'Details',
      id: 'details',
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
            Object.assign({}, entityLocationNotesDetails__fields.id, { className: 'col-md-8' }),
            Object.assign({}, entityLocationNotesDetails__fields.__Status({ auth }), { className: 'col-md-4' })
          ]
        },
        {
          fields: [
            entityLocationNotesDetails__fields.__CreatedOn,
            entityLocationNotesDetails__fields.__ModifiedOn,
            entityLocationNotesDetails__fields.__Owner
          ]
        }
      ]
    }
  ];

  const FINALIZE_DATA = (data) => {
    const momentDate = moment(data.date, 'YYYY/MM/DD h:mm A');
    if (momentDate.isValid()) {
      data.date = momentDate.format();
    }
  };
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

          FINALIZE_DATA(data);

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
