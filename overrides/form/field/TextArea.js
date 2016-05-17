/**
 * Created by JPeruggia on 03/09/2016.
 */
Ext.define('Ext.overrides.form.field.TextArea', {
    override: 'Ext.form.field.TextArea',

    grow: false,

    growAppend: 'W',

    preventScrollbars: false,

    //scrollerParent: null,

    initComponent: function () {
        var scrollerParent = this.scrollerParent;
        this.callParent(arguments);
        this.updateLayoutHeight = 26;

        this.on('autosize', function (me, height) {
            // -1 for border width depending on theme
            me.inputEl.setHeight(height-1);
            var y = 0;
            if (me.scrollerParent != null){
                y = me.scrollerParent.getScrollY();
            }
            if( me.bodyEl.getHeight() != this.updateLayoutHeight) {
                me.updateLayout();
                this.updateLayoutHeight = me.bodyEl.getHeight();
            }
            if (me.scrollerParent!= null) {
                me.scrollerParent.setScrollY(y);
            }

        });
    },

    autoSize: function() {
        var me = this,
            inputEl, height, curWidth, value;

        if (me.grow && me.rendered && me.getSizeModel().height.auto) {
            inputEl = me.inputEl;
            //subtract border/padding to get the available width for the text
            curWidth = inputEl.getWidth(true);

            value = Ext.util.Format.htmlEncode(inputEl.dom.value) || '&#160;';
            value += me.growAppend;

            // Translate newlines to <br> tags
            value = value.replace(/\n/g, '<br/>');

            if(me.up('toolfieldset') && me.up('toolfieldset').down('activityFact')){
                curWidth =  me.up('toolfieldset').down('activityFact').getWidth();
            }else if (me.up('toolfieldset') && me.up('toolfieldset').down('observationConclusion')){
                curWidth = me.up('toolfieldset') && me.up('toolfieldset').down('observationConclusion')
            }
            height = Ext.util.TextMetrics.measure(inputEl, value, curWidth).height +
                inputEl.getPadding('tb') +
                // The element that has the border depends on theme - inputWrap (classic)
                // or triggerWrap (neptune)
                me.inputWrap.getBorderWidth('tb') + me.triggerWrap.getBorderWidth('tb');

            if (height > 23){
                height += 10;
            }
            height = Math.min(Math.max(height, me.growMin), me.growMax);
            me.bodyEl.setHeight(height);
            me.fireEvent('autosize', me, height);
        }
    }

});