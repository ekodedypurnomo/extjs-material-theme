Ext.define('nTAP.form.field.Text', {
    override: 'Ext.form.field.Text',

    labelAlign: 'top',
    labelSeparator: '',

    listeners: {
        change: function (field, value) {
            if (value && field.el) {
                field.el.addCls('not-empty');
            }else if (field.el){
                field.el.removeCls('not-empty');
            }
        },
        focus: function () {
            this.addCls('had-focus');
        }
    }
});