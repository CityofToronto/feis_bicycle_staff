/* exported entityKeyfobDetails__fields */
const entityKeyfobDetails__fields = {
  number: {
    title: 'Number',
    bindTo: 'number',
    required: true
  },
  description: {
    title: 'Description',
    bindTo: 'description',
    type: 'textarea'
  },
  stations: (auth) => ({
    title: 'Stations',
    bindTo: 'stations',
    type: 'multiselect',
    multiple: true,
    choices: {
      beforeSend(jqXHR) {
        if (auth && auth.sId) {
          jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
        }
      },
      contentType: 'application/json; charset=utf-8',
      method: 'GET',
      url: '/* @echo C3DATA_STATIONS_URL */?$select=id,site_name&$filter=__Status eq \'Active\''
    },
    choicesMap(data) {
      if (data && data.value) {
        return data.value.sort((a, b) => {
          const a_site_name = a.site_name.toLowerCase();
          const b_site_name = b.site_name.toLowerCase();
          if (a_site_name > b_site_name) {
            return 1;
          }
          if (a_site_name < b_site_name) {
            return -1;
          }
          return 0;
        }).map((item) => {
          return {
            text: item.site_name,
            value: item.id
          };
        });
      }
      return [];
    }
  })
};
