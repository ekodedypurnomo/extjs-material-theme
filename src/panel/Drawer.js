/**
 * Created by JPeruggia on 03/04/2016.
 */
Ext.define('Ext.panel.Drawer', {
    extend: 'Ext.Panel',
    xtype: 'drawer',

    requires: [
        'Ext.fx.Anim',
        'Ext.util.KeyNav'
    ],

    floating: true,
    focusable: true,
    tabIndex: 0,
    closable: true,
    /**
     * @cfg animate
     * Defautls to true, this shows animation when showing or hiding. 
     */
    animate: true,
    
    /**
     * @cfg parent
     * REQUIRED set the parent this drawer is tied to. Defaults to application viewport.
     */
    parent: Ext.ComponentQuery.query('viewport')[0],
    /**
     * @cfg side
     * which side the panel should be present on in regards to the parent it is tied to.
     */
    side: 'right',
    width: 200,
    draggable : false,

    alwaysOnTop:false,

    /**
     * @cfg allowBlur
     * Setting this to false will make the blue event not close the panel.
     */
    allowBlur: true,
    duration: 200,
    listeners:{
        afterrender:function(){
            var me = this;
            Ext.create('Ext.util.KeyNav', this.getEl(), {
                'esc': function(){
                    me.close();
                }
            });

            me.parent.on({
                resize: me.resizeDrawer,
                hide: me.hideParent,
                scope: me
            });
        },
        focusleave:function(){
            var me = this;
            if (me.allowBlur){
                this.close()
            }
        }
    },

    hideParent:function(){
        alert("parent hide");
    },

    resizeDrawer: function(){
        var me = this;
        me.animateIn(me.parent,0,0);
    },

    animateIn:function(container, delay, duration){
        if (this.width != 0)
            this.animationWidth = this.width;
        if (duration)
            this.duration = duration;
        this.width = 0;
        this.parent = container;

        // figure out which side (valid left or right)
        var x = 0; var y = 0; var height = this.height;
        var startX = container.getX() + container.getWidth();

        height = container.getHeight() - container.getEl().getPadding('b'); // reduce height by padding
        this.setHeight(height);
        y = container.getY()+ container.getEl().getPadding('t');

        switch (this.side){
            case 'left':
                x = container.getX() + container.getEl().getPadding('l');
                startX = container.getX();
                break;
            default:
                x = container.getX() + container.getWidth() - this.animationWidth + container.getEl().getPadding('r');// + 10;
                break;
        }
        var me = this;

        if(this.animate) {
            var animation = Ext.create('Ext.fx.Anim', {
                target: me,
                dynamic: true,
                duration: duration,
                delay: delay,
                from: {
                    width: 0,
                    opacity: 0,
                    x: startX
                },
                to: {
                    width: me.animationWidth,
                    opacity: 1,
                    x: x
                }
            });
        } else{
            me.width = me.animationWidth;
        }

        if(this.animate) me.showAt(x,y);
        else me.showAt(startX,y,animation);
    },


    //on escape key
    // on focus leave
    close: function(){
        this.animateOut(this,0,this.duration);
    },

    animateOut: function(container, delay, duration){
        var me =this;
        var finalX = 0;
        //if left or right have different destination x.
        if (me.side == 'right'){
            finalX = me.parent.getX() + me.parent.getWidth();
        }else{
            finalX = me.parent.getX();
        }
        if (this.animate) {
            Ext.create('Ext.fx.Anim', {
                target: me,
                dynamic: false,
                duration: duration,
                delay: delay,
                from: {
                    width: me.width,
                    opacity: 1,
                    x: me.getX()
                },
                to: {
                    width: 0,
                    opacity: 0,
                    x: finalX
                },
                callback: function () {
                    me.parent.removeListener("resize", me.resizeDrawer, me);
                    me.destroy();
                }
            });
        }else{
            me.destroy();
        }
    }
});