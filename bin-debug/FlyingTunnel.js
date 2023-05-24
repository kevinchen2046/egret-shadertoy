var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var FlyingTunnel = (function (_super) {
    __extends(FlyingTunnel, _super);
    function FlyingTunnel(ItemClazz) {
        var _this = _super.call(this) || this;
        _this.itemClazz = ItemClazz;
        return _this;
    }
    FlyingTunnel.prototype.start = function () {
        // let total = 50;
        // while (total--) {
        //     (this.itemClazz as any).toPool((this.itemClazz as any).fromPool())
        // }
        var timer = new egret.Timer(30, 0);
        timer.start();
        timer.addEventListener("timer", this.onUpdate, this);
    };
    FlyingTunnel.prototype.onUpdate = function () {
        var item = this.itemClazz.fromPool();
        this.addChild(item);
        item.x = 0;
        item.y = 0;
        item.start((Math.random() * 360) >> 0);
    };
    return FlyingTunnel;
}(egret.Sprite));
__reflect(FlyingTunnel.prototype, "FlyingTunnel");
var FlyingTunnelShape = (function (_super) {
    __extends(FlyingTunnelShape, _super);
    function FlyingTunnelShape() {
        return _super.call(this) || this;
    }
    FlyingTunnelShape.fromPool = function () {
        if (this.__pool.length)
            return this.__pool.pop();
        var item = new FlyingTunnelShape();
        item.initialize(500 + Math.random() * 500, 20 + Math.random() * 60, (0xeeeeee + 0x111111 * Math.random()) >> 0);
        return item;
    };
    FlyingTunnelShape.toPool = function (item) {
        if (item.parent)
            item.parent.removeChild(item);
        this.__pool.push(item);
    };
    FlyingTunnelShape.prototype.initialize = function (length, height, color) {
        this.cacheAsBitmap = false;
        var r = color >> 16;
        var g = (color >> 8) & 0x00FF;
        var b = color << 24 >> 24;
        if (r > 0xFF)
            r = 0xFF;
        if (g > 0xFF)
            g = 0xFF;
        if (b > 0xFF)
            b = 0xFF;
        if (r < 0)
            r = 0;
        if (g < 0)
            g = 0;
        if (b < 0)
            b = 0;
        var endColor = r << 16 | (g << 8) | b;
        this.graphics.clear();
        // this.graphics.beginFill(0xFFFFFF, 0.8);
        this.graphics.beginGradientFill(egret.GradientType.RADIAL, [color, endColor], [1, 1], [0, 255]);
        this.graphics.moveTo(0, -height * 0.2);
        this.graphics.lineTo(length, -height);
        this.graphics.lineTo(length, height);
        this.graphics.lineTo(0, height * 0.2);
        this.graphics.endFill();
        this.cacheAsBitmap = true;
    };
    FlyingTunnelShape.prototype.start = function (angle) {
        var _this = this;
        this.rotation = angle;
        FlyingTunnelUtil.Temp = FlyingTunnelUtil.getLinePointByAngle(this.x, this.y, 700, angle, FlyingTunnelUtil.Temp);
        this.scaleX = 0;
        this.scaleY = 0;
        this.alpha = 1;
        egret.Tween.get(this).to({ scaleX: 3, scaleY: 2, x: FlyingTunnelUtil.Temp.x, y: FlyingTunnelUtil.Temp.y, alpha: 0 }, 800, egret.Ease.cubicInOut).call(function () { return FlyingTunnelShape.toPool(_this); });
    };
    FlyingTunnelShape.__pool = [];
    return FlyingTunnelShape;
}(egret.Shape));
__reflect(FlyingTunnelShape.prototype, "FlyingTunnelShape");
var FlyingTunnelBitmap = (function (_super) {
    __extends(FlyingTunnelBitmap, _super);
    function FlyingTunnelBitmap() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FlyingTunnelBitmap.fromPool = function () {
        if (this.__pool.length)
            return this.__pool.pop();
        var item = new FlyingTunnelBitmap();
        item.initialize(500 + Math.random() * 500, 20 + Math.random() * 60, this.sheet.getTexture(((Math.random() * 7) >> 0) + ''));
        return item;
    };
    FlyingTunnelBitmap.toPool = function (item) {
        if (item.parent)
            item.parent.removeChild(item);
        this.__pool.push(item);
    };
    FlyingTunnelBitmap.prototype.initialize = function (length, height, texture) {
        this.texture = texture;
        this.anchorOffsetX = 0;
        this.anchorOffsetY = (texture.textureHeight / 2);
        // this.width = length;
        // this.height = height;
    };
    FlyingTunnelBitmap.prototype.start = function (angle) {
        var _this = this;
        this.rotation = angle;
        var x = this.x;
        var y = this.y;
        this.scaleX = 0;
        this.scaleY = Math.random() * 0.3 + 0;
        this.alpha = 1;
        FlyingTunnelUtil.Temp = FlyingTunnelUtil.getLinePointByAngle(x, y, Math.random() * 100 + 100, angle, FlyingTunnelUtil.Temp);
        egret.Tween.get(this).to({ scaleX: 3 + Math.random() * 2, scaleY: 1 + Math.random() * 2, x: FlyingTunnelUtil.Temp.x, y: FlyingTunnelUtil.Temp.y, alpha: Math.random() * 0.5 + 0.5 }, 300, egret.Ease.sineOut).call(function () {
            FlyingTunnelUtil.Temp = FlyingTunnelUtil.getLinePointByAngle(x, y, 900, angle, FlyingTunnelUtil.Temp);
            egret.Tween.get(_this).to({ scaleX: 5, scaleY: 3, x: FlyingTunnelUtil.Temp.x, y: FlyingTunnelUtil.Temp.y, alpha: 0 }, 500, egret.Ease.sineIn).call(function () {
                FlyingTunnelBitmap.toPool(_this);
            });
        });
    };
    FlyingTunnelBitmap.__pool = [];
    return FlyingTunnelBitmap;
}(egret.Bitmap));
__reflect(FlyingTunnelBitmap.prototype, "FlyingTunnelBitmap");
var FlyingTunnelUtil = (function () {
    function FlyingTunnelUtil() {
    }
    /**
     * 根据角度，长度，获取目标点  //oldName:getLinePoint2
     * @param x
     * @param y
     * @param length
     * @param angle
     * @return
     */
    FlyingTunnelUtil.getLinePointByAngle = function (x, y, length, angle, cache) {
        if (cache === void 0) { cache = null; }
        var vx = x + (length * this.cos(angle));
        var vy = y + (length * this.sin(angle));
        if (!!cache) {
            cache.x = vx;
            cache.y = vy;
            return cache;
        }
        return new egret.Point(vx, vy);
    };
    /**
     * 对sin函数的二次封装，降低sin函数的cpu消耗
     * @param angle
     * @return
     *
     */
    FlyingTunnelUtil.sin = function (angle) {
        angle = angle >> 0;
        angle = this.toLAngle(angle);
        if (!this.sinCache[angle]) {
            this.sinCache[angle] = Math.sin(this.angleToRadian(angle));
        }
        return this.sinCache[angle];
    };
    /**
     * 对cos函数的二次封装，降低cos函数的cpu消耗
     * @param angle
     * @return
     */
    FlyingTunnelUtil.cos = function (angle) {
        angle = angle >> 0;
        angle = this.toLAngle(angle);
        if (!this.cosCache[angle]) {
            this.cosCache[angle] = Math.cos(this.angleToRadian(angle));
        }
        return this.cosCache[angle];
    };
    /**
        * 对角度区间化，返回的角度值 一定会是 0-360之间的数字
        * @param angle
        * @return
        *
        */
    FlyingTunnelUtil.toLAngle = function (angle) {
        if ((angle > -1) && (angle < 360)) {
            return angle;
        }
        angle = angle % 360;
        if (angle < 0) {
            angle = angle + 360;
        }
        return angle;
    };
    /**
    * 角度转弧度
    * @param angle
    * @return
    *
    */
    FlyingTunnelUtil.angleToRadian = function (angle) {
        return (angle * Math.PI) / 180;
    };
    FlyingTunnelUtil.Temp = new egret.Point();
    FlyingTunnelUtil.sinCache = [];
    FlyingTunnelUtil.cosCache = [];
    return FlyingTunnelUtil;
}());
__reflect(FlyingTunnelUtil.prototype, "FlyingTunnelUtil");
