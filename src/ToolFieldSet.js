/**
 * Created by JPeruggia on 02/25/2016.
 */
Ext.define('Ext.ux.form.ToolFieldSet', {
    extend: 'Ext.form.FieldSet',
    alias: 'widget.toolfieldset',

    requires: [
        'Ext.container.Container'
    ],

    tools: [],
    initComponent: function(){
      this.callParent(arguments);
    },
    createLegendCt: function () {
        var me = this,
            items = [],
            legendCfg = {
                baseCls: me.baseCls + '-header',
                // use container layout so we don't get the auto layout innerCt/outerCt
                layout: 'container',
                ui: me.ui,
                id: me.id + '-legend',
                autoEl: 'legend',
                ariaRole: null,
                items: items,
                ownerCt: me,
                shrinkWrap: true,
                ownerLayout: me.componentLayout
            },
            legend;

        // Checkbox
        if (me.checkboxToggle) {
            items.push(me.createCheckboxCmp());
        } else if (me.collapsible) {
            // Toggle button
            items.push(me.createToggleCmp());
        }

        // Title
        items.push(me.createTitleCmp());

        // add extra tools
        if (Ext.isArray(me.tools)){
            for (var i = 0; i < me.tools.length; i ++){
                var tool = me.createToolCmp(me.tools[i]);
                items.push(tool);
            }
        }

        legend = new Ext.container.Container(legendCfg);

        // Mark the legend as immune to collapse so that when the fieldset
        // *is* collapsed and the toggle tool or checkbox is focused,
        // calling isVisible(true) on it will return true instead of false.
        // See also below in createCheckboxCmp and createToggleCmp.
        legend.collapseImmune = true;
        legend.getInherited().collapseImmune = true;

        return legend;
    },

    createToolCmp: function(toolCfg) {
        var me = this;
        // create a tool and return it.
        cfg = {
            type: toolCfg.type,
            listeners: toolCfg.listeners,
            cls: toolCfg.cls,
            tooltip: toolCfg.tooltip,
            disabled: toolCfg.disabled
        };
        var tool = new Ext.panel.Tool(cfg);
        return Ext.widget(tool);
    },

    
    getTools: function(){
        var me = this;
    }
});