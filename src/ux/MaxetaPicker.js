Ext.define('Ext.field.picker.MaxetaPicker', {
    extend: 'Ext.ux.TreePicker',
    xtype: 'maxetaPicker',

    requires: [
        'Ext.data.TreeStore'
    ],

    initComponent: function() {

        // Store definition for the Combotree
        var store = Ext.create('Ext.data.TreeStore', {

            root: {
                expanded: true,
                children: [{
                    text: 'Current',
                    expanded: true,
                    children: [{
                        text: 'Current week',
                        leaf: true
                    }, {
                        text: 'Current month',
                        leaf: true
                    }, {
                        text: 'Current year',
                        leaf: true
                    }]
                }, {
                    text: 'Last',
                    expanded: true,
                    children: [{
                        text: '24h',
                        leaf: true
                    }, {
                        text: '7 days',
                        leaf: true
                    }, {
                        text: '30 days',
                        leaf: true
                    }]
                }, {
                    text: 'Previous',
                    expanded: true,
                    children: [{
                        text: 'Previous day',
                        leaf: true
                    }, {
                        text: 'Previous week',
                        leaf: true
                    }, {
                        text: 'previous month',
                        leaf: true
                    }, {
                        text: 'previous year',
                        leaf: true
                    }]
                }, {
                    text: 'By year',
                    expanded: true,
                    children: [{
                        text: '2013',
                        expanded: true,
                        children: [{
                            text: '12-2013 (Dec)',
                            leaf: true
                        }, {
                            text: '11-2013 (Nov)',
                            leaf: true
                        }]
                    }, {
                        text: '2012',
                        leaf: true
                    }, {
                        text: '2021',
                        leaf: true
                    }, {
                        text: '2020',
                        leaf: true
                    }]
                }]
            }
        });


        var me = this;
        me.store = store;

        me.callParent(arguments);

        me.mon(me.store, {
            scope: me,
            load: me.onLoad,
            update: me.onUpdate
        });
    }

});