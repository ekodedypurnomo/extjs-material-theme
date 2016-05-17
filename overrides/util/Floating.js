Ext.define('nTAP.util.Floating',{
    override: 'Ext.util.Floating',

    alignTo: function(element, position, offsets, animate){
        var me = this,
            el = me.el;

        // since floaters are rendered to doc body, flaoters could become marooned
        // from its ownerRef if the ownerRef has been rendered to a container that
        // overflows and it is scrolled.
        if (!me._lastAlignToEl){
            // do nothing. override: this caused the floating button to scroll away when scrolling
            // edit window or grid.
        }

        // Let's stash these on the component/element in case it's aligned to something else
        // in its little lifetime.
        me._lastAlignToEl = element;
        me._lastAlignToPos = position;

        me.mixins.positionable.alignTo.call(me, element, position, offsets, animate);
    }
});