/* global $ Backbone moment */
/* global ajaxes auth__checkLogin fixButtonLinks modal__showConfirm query__objectToString query__stringToObject
   renderAlert toSnapShot */
/* global renderForm */
/* global location_note_form_sections */

/* exported renderLocationNoteDetailsPage */
function renderLocationNoteDetailsPage(app, $container, router, auth, opt, id, query) {
  return auth__checkLogin(auth).then((isLoggedIn) => {
    if (!isLoggedIn) {
      const query = query__objectToString({ redirect: Backbone.history.getFragment() });
      router.navigate(`login?${query}`, { trigger: true });
      return;
    }

    const breadcrumbs = [{ name: app.name, link: '#home' }, { name: 'Location Notes', link: '#location_notes' }];
    switch (opt) {
      default:
        breadcrumbs.push({ name: 'All', link: `#location_notes/all` });
    }

    const {
      redirectTo = 'Location Notes',
      redirectToFragment = `location_notes/${opt}`
    } = query__stringToObject(query);
    $container.html(`<p><a href="#${redirectToFragment}">Back to ${redirectTo}</a></p>`);

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
          url: `/* @echo C3DATA_LOCATION_NOTES_URL */('${id}')`
        });
      }

      return { data: {} };
    }).then(({ data }) => {
      const $tabContainer = $('<div></div>').appendTo($container);
      function renderNavBar(finalId) {
        $tabContainer.html(`
          <div class="navbar">
            <ul class="nav nav-tabs">
              <li class="nav-item active" role="presentation">
                <a href="#location_notes/${opt}/${finalId}" class="nav-link">Location Note</a>
              </li>
            </ul>
          </div>
        `);
        fixButtonLinks($tabContainer);
      }
      if (id !== 'new') {
        renderNavBar(id);
      }

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
            renderNavBar(data.id);

            router.navigate(`location_notes/${opt}/${data.id}`, { trigger: false, replace: true });
            app.setBreadcrumb(breadcrumbs.concat({ name: data.site_name }), true);
            app.setTitle(data.site_name);

            return { data, textStatus, jqXHR };
          });
        },

        sections: location_note_form_sections(auth)
      };

      const Model = Backbone.Model.extend({
        defaults: {
          date: moment().format('YYYY/MM/DD')
        }
      });
      const model = new Model(data);
      let snapShot = toSnapShot(model.toJSON());

      return Promise.resolve().then(() => {
        return renderForm($('<div></div>').appendTo($container), definition, model, {
          auth,
          url: '/* @echo C3DATA_LOCATION_NOTES_URL */',

          saveButtonLabel: (model) => model.isNew() ? 'Create Location Note' : 'Update Location Note',

          cancelButtonLabel: 'Cancel',
          cancelButtonFragment: `location_notes/${opt}`,

          removeButtonLabel: 'Remove Location Note',
          removePromptValue: 'DELETE'
        });
      }).then(() => {
        if (id === 'new') {
          app.setBreadcrumb(breadcrumbs.concat({ name: 'New Location Note' }), true);
          app.setTitle('New Location Note');
        } else {
          app.setBreadcrumb(breadcrumbs.concat({ name: data.date }), true);
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
      app.setBreadcrumb(breadcrumbs.concat({ name: 'Error' }), true);
      app.setTitle('An Error has Occured');

      renderAlert($container, '<p>An error occured while fetching data.</p>', {
        bootstrayType: 'danger',
        position: 'bottom'
      })

      console.error(error); // eslint-disable-line no-console
    });
  }, (error) => {
    console.error(error); // eslint-disable-line no-console
  });
}
