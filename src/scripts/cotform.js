/* global cot_form */
// cot_form.prototype.processField = function (oRow, oVal, row, field) {
//   var intFields = row.fields.length;
//   var oField = oRow.appendChild(document.createElement('div'));
//   oField.id = field.id + 'Element';
//   oField.className = field['className'] || ((intFields == 1) ? "col-xs-12" : (intFields == 2) ? "col-xs-12 col-sm-6" : (intFields == 3) ? "col-xs-12 col-md-4" : "col-xs-12 col-sm-6 col-md-3");
//   oField.className += ' form-group form-group-';
//   oField.className += field.orientation || 'vertical';
//   oField.className += field.addclass ? " " + field.addclass : '';
//   var oFieldDiv = oField.appendChild(document.createElement('div'));

//   //LABEL
//   if (['html', 'button', 'cart', 'cartitem'].indexOf(field.type) == -1) {
//     var useLabel = ['static', 'checkbox', 'radio'].indexOf(field.type) === -1;
//     if (useLabel || field.title) {
//       var label = oFieldDiv.appendChild(document.createElement(useLabel ? 'label' : 'span'));
//       label.className = useLabel ? 'control-label' : 'staticlabel' + (field.type != 'static' ? ' ' + field.type : '');
//       if (useLabel) {
//         label.htmlFor = field.id;
//       }

//       var titleSpan = label.appendChild(document.createElement('span'));
//       titleSpan.textContent = field.title;
//       if (field.type === 'multiselect') {
//         $(label).attr('id', field.id + '_label');
//         $(titleSpan).append($('<span class="sr-only">:</span>'));
//       }
//       if (!field.required && field.type != 'static') {
//         var optionalLabel = label.appendChild(document.createElement('span'));
//         optionalLabel.className = 'optional';
//         optionalLabel.textContent = '(optional)';
//       }
//       if (field.infohelp) {
//         var tooltip = label.appendChild(document.createElement('span'));
//         tooltip.className = 'glyphicon glyphicon-info-sign';
//         tooltip.setAttribute('data-toggle', 'tooltip');
//         tooltip.setAttribute('data-placement', 'top');
//         tooltip.tabIndex = 0;
//         tooltip.title = field.infohelp;
//       }
//     }
//   }
//   this.addprehelptext(field, oFieldDiv);
//   this.addformfield(field, oFieldDiv);
//   this.addposthelptext(field, oFieldDiv);
//   this.addfieldvalidation(oVal, field, oFieldDiv);
// };

// cot_form.prototype.cartitemFieldRender = function (fieldOpt, containerEl)  {
//   console.log('CART ITEM', this, 'FIELD OPT', fieldOpt, 'CONTAINER EL', containerEl);
//   return new DocumentFragment();
// };

// cot_form.prototype.cartFieldRender = function (fieldOpt, containerEl) {
//   console.log('CART', this, fieldOpt, containerEl);
//   return new DocumentFragment();
// }

cot_form.prototype.validatorOptions = (function (validatorOptions) {
  return function (fieldDefinition) {
    const retVal = validatorOptions.call(this, fieldDefinition);
    if (fieldDefinition.excluded != null) {
      retVal.excluded = fieldDefinition.excluded;
    }
    return retVal;
  };
})(cot_form.prototype.validatorOptions);
