/**
 * Created by JPeruggia on 02/15/2016.
 */
Ext.define('nTAP.form.field.ComboBox', {
    override: 'Ext.form.field.ComboBox',

    labelAlign: 'top',
    labelSeparator: '',

    listeners: {
        keypress:function(field, e, eOpts){
            if (field.getValue() != "" && field.el) {
                field.el.addCls('not-empty');
            }else if ( field.el){
                field.el.removeCls('not-empty');
            }
        },
        change: function (field, newValue, oldValue, eOpts) {
            if (newValue && field.el) {
                field.el.addCls('not-empty');
            }else if ( field.el){
                field.el.removeCls('not-empty');
            }
        },
        focus: function () {
            this.addCls('had-focus');
        }
    }
});