class FlyingTunnel extends egret.Sprite {
    private itemClazz: { new(): IFlyingTunnelItem }
    constructor(ItemClazz: { new(): IFlyingTunnelItem }) {
        super();
        this.itemClazz = ItemClazz;
    }
    start() {
        // let total = 50;
        // while (total--) {
        //     (this.itemClazz as any).toPool((this.itemClazz as any).fromPool())
        // }
        let timer = new egret.Timer(30, 0);
        timer.start();
        timer.addEventListener("timer", this.onUpdate, this);
    }
    private onUpdate() {
        let item = (this.itemClazz as any).fromPool();
        this.addChild(item);
        item.x = 0;
        item.y = 0;
        item.start((Math.random() * 360) >> 0);
    }
}

interface IFlyingTunnelItem {
    start(angle: number)
}

class FlyingTunnelShape extends egret.Shape {

    static __pool: FlyingTunnelShape[] = [];
    static fromPool() {
        if (this.__pool.length) return this.__pool.pop()
        let item = new FlyingTunnelShape();
        item.initialize(500 + Math.random() * 500, 20 + Math.random() * 60, (0xeeeeee + 0x111111 * Math.random()) >> 0);
        return item;
    }

    static toPool(item: FlyingTunnelShape) {
        if (item.parent) item.parent.removeChild(item);
        this.__pool.push(item);
    }


    constructor() {
        super();
    }

    initialize(length: number, height: number, color: number) {
        this.cacheAsBitmap = false;
        var r: number = color >> 16;
        var g: number = (color >> 8) & 0x00FF;
        var b: number = color << 24 >> 24;

        if (r > 0xFF) r = 0xFF;
        if (g > 0xFF) g = 0xFF;
        if (b > 0xFF) b = 0xFF;
        if (r < 0) r = 0;
        if (g < 0) g = 0;
        if (b < 0) b = 0;
        let endColor = r << 16 | (g << 8) | b;
        this.graphics.clear();
        // this.graphics.beginFill(0xFFFFFF, 0.8);
        this.graphics.beginGradientFill(egret.GradientType.RADIAL, [color, endColor], [1, 1], [0, 255]);
        this.graphics.moveTo(0, -height * 0.2);
        this.graphics.lineTo(length, -height);
        this.graphics.lineTo(length, height);
        this.graphics.lineTo(0, height * 0.2);
        this.graphics.endFill();
        this.cacheAsBitmap = true;
    }

    start(angle: number) {
        this.rotation = angle;
        FlyingTunnelUtil.Temp = FlyingTunnelUtil.getLinePointByAngle(this.x, this.y, 700, angle, FlyingTunnelUtil.Temp);
        this.scaleX = 0;
        this.scaleY = 0;
        this.alpha = 1;
        egret.Tween.get(this).to({ scaleX: 3, scaleY: 2, x: FlyingTunnelUtil.Temp.x, y: FlyingTunnelUtil.Temp.y, alpha: 0 }, 800, egret.Ease.cubicInOut).call(() => FlyingTunnelShape.toPool(this))
    }
}
class FlyingTunnelBitmap extends egret.Bitmap {
    static sheet: egret.SpriteSheet
    static __pool: FlyingTunnelBitmap[] = [];
    static fromPool() {
        if (this.__pool.length) return this.__pool.pop()
        let item = new FlyingTunnelBitmap();
        item.initialize(500 + Math.random() * 500, 20 + Math.random() * 60, this.sheet.getTexture(((Math.random() * 7) >> 0) + ''));
        return item;
    }

    static toPool(item: FlyingTunnelBitmap) {
        if (item.parent) item.parent.removeChild(item);
        this.__pool.push(item);
    }

    initialize(length: number, height: number, texture: egret.Texture) {
        this.texture = texture;
        this.anchorOffsetX = 0;
        this.anchorOffsetY = (texture.textureHeight / 2);
        // this.width = length;
        // this.height = height;
    }

    start(angle: number) {
        this.rotation = angle;

        let x = this.x;
        let y = this.y;
        this.scaleX = 0;
        this.scaleY = Math.random() * 0.3 + 0;
        this.alpha = 1;
        FlyingTunnelUtil.Temp = FlyingTunnelUtil.getLinePointByAngle(x, y, Math.random() * 100 + 100, angle, FlyingTunnelUtil.Temp);
        egret.Tween.get(this).to({ scaleX: 3 + Math.random() * 2, scaleY: 1 + Math.random() * 2, x: FlyingTunnelUtil.Temp.x, y: FlyingTunnelUtil.Temp.y, alpha: Math.random() * 0.5 + 0.5 }, 300, egret.Ease.sineOut).call(() => {
            FlyingTunnelUtil.Temp = FlyingTunnelUtil.getLinePointByAngle(x, y, 900, angle, FlyingTunnelUtil.Temp);
            egret.Tween.get(this).to({ scaleX: 5, scaleY: 3, x: FlyingTunnelUtil.Temp.x, y: FlyingTunnelUtil.Temp.y, alpha: 0 }, 500, egret.Ease.sineIn).call(() => {
                FlyingTunnelBitmap.toPool(this)
            })
        })
    }
}
class FlyingTunnelUtil {
    public static Temp = new egret.Point();
    /**
     * 根据角度，长度，获取目标点  //oldName:getLinePoint2
     * @param x
     * @param y
     * @param length
     * @param angle
     * @return 
     */
    public static getLinePointByAngle(x: number, y: number, length: number, angle: number, cache: egret.Point = null): egret.Point {
        let vx: number = x + (length * this.cos(angle));
        let vy: number = y + (length * this.sin(angle));
        if (!!cache) {
            cache.x = vx;
            cache.y = vy;
            return cache;
        }
        return new egret.Point(vx, vy);
    }

    private static sinCache: number[] = [];
    private static cosCache: number[] = [];
    /**
     * 对sin函数的二次封装，降低sin函数的cpu消耗 
     * @param angle
     * @return 
     * 
     */
    public static sin(angle: number): number {
        angle = angle >> 0;
        angle = this.toLAngle(angle);
        if (!this.sinCache[angle]) {
            this.sinCache[angle] = Math.sin(this.angleToRadian(angle));
        }
        return this.sinCache[angle];
    }

    /**
     * 对cos函数的二次封装，降低cos函数的cpu消耗 
     * @param angle
     * @return 
     */
    public static cos(angle: number): number {
        angle = angle >> 0;
        angle = this.toLAngle(angle);
        if (!this.cosCache[angle]) {
            this.cosCache[angle] = Math.cos(this.angleToRadian(angle));
        }
        return this.cosCache[angle];
    }

    /**
        * 对角度区间化，返回的角度值 一定会是 0-360之间的数字 
        * @param angle
        * @return 
        * 
        */
    public static toLAngle(angle: number): number {
        if ((angle > -1) && (angle < 360)) {
            return angle;
        }
        angle = angle % 360;
        if (angle < 0) {
            angle = angle + 360;
        }
        return angle;
    }

    /**
    * 角度转弧度
    * @param angle
    * @return 
    * 
    */
    public static angleToRadian(angle: number): number {
        return (angle * Math.PI) / 180;
    }
}