/* global $ Backbone */
/* global ajaxes auth__checkLogin fixButtonLinks modal__showConfirm query__objectToString query__stringToObject
   renderAlert toSnapShot */
/* global renderForm */
/* global location_form_sections */

/* exported renderLocationDetailsPage */
function renderLocationDetailsPage(app, $container, router, auth, opt, id, query) {
  return auth__checkLogin(auth).then((isLoggedIn) => {
    if (!isLoggedIn) {
      const query = query__objectToString({ redirect: Backbone.history.getFragment() });
      router.navigate(`login?${query}`, { trigger: true });
      return;
    }

    const breadcrumbs = [{ name: app.name, link: '#home' }, { name: 'Locker Locations', link: '#locations' }];
    switch (opt) {
      default:
        breadcrumbs.push({ name: 'All', link: `#locations/all` });
    }

    const {
      redirectTo = 'Locations',
      redirectToFragment = `locations/${opt}`
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
          url: `/* @echo C3DATA_LOCATIONS_URL */('${id}')`
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
                <a href="#locations/${opt}/${finalId}" class="nav-link">Location</a>
              </li>

              <!--
              <li class="nav-item" role="presentation">
                <a href="#locations/${opt}/${finalId}/inspections/all" class="nav-link">Notes</a>
              </li>

              <li class="nav-item" role="presentation">
                <a href="#locations/${opt}/${finalId}/inspections/all" class="nav-link">Inspections</a>
              </li>

              <li class="nav-item" role="presentation">
                <a href="#locations/${opt}/${finalId}/inspections/all" class="nav-link">Lockers</a>
              </li>
              -->
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

            router.navigate(`locations/${opt}/${data.id}`, { trigger: false, replace: true });
            app.setBreadcrumb(breadcrumbs.concat({ name: data.site_name }), true);
            app.setTitle(data.site_name);

            return { data, textStatus, jqXHR };
          });
        },

        sections: location_form_sections()
      };

      const Model = Backbone.Model.extend({
        defaults: {
          municipality: 'Toronto',
          province: 'Ontario',
        }
      });
      const model = new Model(data);
      let snapShot = toSnapShot(model.toJSON());

      return Promise.resolve().then(() => {
        return renderForm($('<div></div>').appendTo($container), definition, model, {
          auth,
          url: '/* @echo C3DATA_LOCATIONS_URL */',

          saveButtonLabel: (model) => model.isNew() ? 'Create Locker Location' : 'Update Locker Location',

          cancelButtonLabel: 'Cancel',
          cancelButtonFragment: `locations/${opt}`,

          removeButtonLabel: 'Remove Locker Location',
          removePromptValue: 'DELETE'
        });
      }).then(() => {
        if (id === 'new') {
          app.setBreadcrumb(breadcrumbs.concat({ name: 'New Locker Location' }), true);
          app.setTitle('New Locker Location');
        } else {
          app.setBreadcrumb(breadcrumbs.concat({ name: data.site_name }), true);
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
