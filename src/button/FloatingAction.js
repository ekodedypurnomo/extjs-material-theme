//noinspection JSCheckFunctionSignatures
/**
 * Created by JPeruggia on 03/02/2016.
 */
Ext.define('Ext.button.FloatingAction', {
    extend: 'Ext.Button',
    xtype: 'floatingactionbutton',

    floating: true,
    shadow: false,
    ui: 'floating-action',
    width: 65,
    height: 65,

    initComponent: function() {
        this.scale = null;

        this.callParent();
    },

    setScale: Ext.emptyFn,

    mask: function () {
        this.callParent(arguments);

        this.setDisabled(true);
    },

    unmask: function () {
        this.callParent(arguments);

        this.setDisabled(false);
    }
});