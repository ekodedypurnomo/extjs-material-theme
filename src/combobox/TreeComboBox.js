/**
 * Created by MGuo on 03/04/2016.
 */
Ext.define('Ext.combobox.TreeComboBox', {
    extend: 'Ext.ux.TreePicker',
    xtype:'treeComboBox',
    requires:['Ext.filter.TreeFilter'],
    enableKeyEvents: true,

    triggerCls: Ext.baseCSSPrefix + 'form-arrow-trigger',

    config: {
        /**
         * @cfg {Ext.data.TreeStore} store
         * A tree store that the tree picker will be bound to
         */
        store: null,

        /**
         * @cfg {String} displayField
         * The field inside the model that will be used as the node's text.
         * Defaults to the default value of {@link Ext.tree.Panel}'s `displayField` configuration.
         */
        displayField: null,

        /**
         * @cfg {Array} columns
         * An optional array of columns for multi-column trees
         */
        columns: null,

        /**
         * @cfg {Boolean} selectOnTab
         * Whether the Tab key should select the currently highlighted item. Defaults to `true`.
         */
        selectOnTab: true,

        /**
         * @cfg {Number} maxPickerHeight
         * The maximum height of the tree dropdown. Defaults to 300.
         */
        maxPickerHeight: 300,

        /**
         * @cfg {Number} minPickerHeight
         * The minimum height of the tree dropdown. Defaults to 100.
         */
        minPickerHeight: 100,
        pickerUI: 'default'
    },

    editable: false,


    /**
     * @event select
     * Fires when a tree node is selected
     * @param {Ext.ux.TreePicker} picker        This tree picker
     * @param {Ext.data.Model} record           The selected record
     */

    initComponent: function() {
        var me = this;

        //me.callParent(arguments);
        //
        //me.mon(me.store, {
        //    scope: me,
        //    load: me.onLoad,
        //    update: me.onUpdate
        //});
    },

    /**
     * Creates and returns the tree panel to be used as this field's picker.
     */
    createPicker: function() {
        var me = this,
            picker = new Ext.tree.Panel({
                baseCls: Ext.baseCSSPrefix + 'boundlist',
                shrinkWrapDock: 2,
                store: me.store,
                floating: true,
                ui:me.pickerUI,
                displayField: me.displayField,
                columns: me.columns,
                minHeight: me.minPickerHeight,
                maxHeight: me.maxPickerHeight,
                manageHeight: true,
                shadow: false,
                rootVisible: false,
                listeners: {
                    scope: me,
                    itemkeydown: me.onPickerKeyDown,
                    checkChange: me.onCheckChange
                },
                plugins: [{
                    ptype: 'treeFilter',
                    allowParentFolders: true
                }]
            }),
            view = picker.getView();

        if (Ext.isIE9 && Ext.isStrict) {
            // In IE9 strict mode, the tree view grows by the height of the horizontal scroll bar when the items are highlighted or unhighlighted.
            // Also when items are collapsed or expanded the height of the view is off. Forcing a repaint fixes the problem.
            view.on({
                scope: me,
                highlightitem: me.repaintPickerView,
                unhighlightitem: me.repaintPickerView,
                afteritemexpand: me.repaintPickerView,
                afteritemcollapse: me.repaintPickerView
            });
        }
        return picker;
    },

    /**
     * repaints the tree view
     */
    repaintPickerView: function() {
        var style = this.picker.getView().getEl().dom.style;
        // can't use Element.repaint because it contains a setTimeout, which results in a flicker effect
        style.display = style.display;
    },

    /**
     * Handles a click even on a tree node
     * @private
     * @param {Ext.tree.View} view
     * @param {Ext.data.Model} record
     * @param {HTMLElement} node
     * @param {Number} rowIndex
     * @param {Ext.event.Event} e
     */
    onCheckChange: function(node, checked, ops) {
        this.selectItem(node);
    },

    /**
     * Handles a keypress event on the picker element
     * @private
     * @param {Ext.event.Event} e
     * @param {HTMLElement} el
     */
    onPickerKeyDown: function(treeView, record, item, index, e) {
        var key = e.getKey();

        if (key === e.ENTER || (key === e.TAB && this.selectOnTab)) {
            this.selectItem(record);
        }
    },

    /**
     * Changes the selection to a given record and closes the picker
     * @private
     * @param {Ext.data.Model} record
     */
    selectItem: function(record) {
        var me = this;
        me.setValue(record.getId(), me.getDisplayField());
        me.fireEvent('select', me, record);
        //me.collapse();
    },

    /**
     * Runs when the picker is expanded.  Selects the appropriate tree node based on the value of the input element,
     * and focuses the picker so that keyboard navigation will work.
     * @private
     */
    onExpand: function() {
        var picker = this.picker,
            store = picker.store,
            value = this.value,
            node;


        if (value) {
            node = store.getNodeById(value);
        }

        if (!node) {
            node = store.getRoot();
        }

        picker.ensureVisible(node, {
            select: true,
            focus: true
        });
    },

    /**
     * Sets the specified value into the field
     * @param {Mixed} value
     * @return {Ext.ux.TreePicker} this
     */
    setValue: function(value, displayField) {
        var fullValList = [];
        if(this.getValue() != undefined){
            fullValList = this.getValue();
        }

        if(fullValList.indexOf(value) == -1){
            fullValList.push(value);
        } else {
            fullValList.splice(fullValList.indexOf(value), 1);
        }

        var me = this,
            record;

        me.value = fullValList;

        if (me.store.loading) {
            // Called while the Store is loading. Ensure it is processed by the onLoad method.
            return me;
        }

        // try to find a record in the store that matches the value
        record = value ? me.store.getNodeById(value) : me.store.getRoot();
        if (value === undefined) {
            record = me.store.getRoot();
            me.value = record.getId();
        } else {
            record = me.store.getNodeById(value);
        }

        // Get the string values to make the combined text field
        var fullDisplayString = '';
        for(var i = 0; i < fullValList.length; i++){
            if(i > 0)
                fullDisplayString = fullDisplayString + ', ';
            fullDisplayString = fullDisplayString + me.store.getNodeById(fullValList[i]).data[displayField];
        }

        //alert("fullDisplayString set to: " + fullDisplayString);

        // set the raw value to the record's display field if a record was found
        me.setRawValue(record ? fullDisplayString: '');

        return me;
    },

    getSubmitValue: function() {
        return this.value;
    },

    /**
     * Returns the current data value of the field (the idProperty of the record)
     * @return {Number}
     */
    getValue: function() {
        return this.value;
    },

    /**
     * Handles the store's load event.
     * @private
     */
    onLoad: function() {
        var value = this.value, me = this;

        if (value) {
            this.setValue(value, me.getDisplayField());
        }
    },

    onUpdate: function(store, rec, type, modifiedFieldNames) {
        var display = this.displayField;

        if (type === 'edit' && modifiedFieldNames && Ext.Array.contains(modifiedFieldNames, display) && this.value === rec.getId()) {
            this.setRawValue(rec.get(display));
        }
    },


    onKeyDown: function (e, eOpts){
        var key = e.getKey();
        var me = this;
        if (key === e.BACKSPACE) {
            me.onKeyPress(this, e, eOpts);
        }
    },


    onKeyPress: function(picker, e, eOpts){
        var me = this;
        var store = me.getStore();
        setTimeout(function(){
            me.picker.filter(me.getRawValue());
        },500);
    }

});