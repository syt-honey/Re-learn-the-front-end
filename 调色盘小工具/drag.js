class DragContext {
    constructor({
        $context,
        $dragger,
        name,
        direction,
        initX,
        initY
    }) {
        this.$context = $context;
        this.$dragger = $dragger;
        this.name = name;
        this.direction = direction;
        this._isDragging = false;
        this.init();
        this._x = initX || 0;
        this._y = initY || 0;
        this._rect = this.$context.getBoundingClientRect();
    }

    init() {
        this._addMousedown();
        this._addMousemove();
        this._addMouseup();
    }

    _setDraggerStyles() {
        // this._x =
    }

    _addMousedown() {}

    _addMousemove() {}

    _addMouseup() {}
}