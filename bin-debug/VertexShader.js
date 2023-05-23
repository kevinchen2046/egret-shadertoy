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
var shapeVertex = "attribute vec2 aVertexPosition;    \nattribute vec2 aTextureCoord;\nattribute vec2 aColor;\nuniform vec2 projectionVector;\nconst vec2 center = vec2(-1.0, 1.0);\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\nvarying vec4 vPosition;\nvoid main(){\n    vPosition=vec4((aVertexPosition/projectionVector).xy,0.2,0.5);\n    gl_Position=vec4((aVertexPosition/projectionVector) + center,0.0,1.0);\n    vTextureCoord = aTextureCoord;\n    vColor = vec4(aColor.x,aColor.x,aColor.x,aColor.x);\n}";
var shapeFrament = "precision lowp float;\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\nvarying vec4 vPosition;\nuniform float iTime;\nvoid main(void) {\n    vec4 p=vPosition.xyzw;\n    p.x+=sin(iTime);\n    p.y+=cos(iTime);\n    gl_FragColor = vColor*p;\n}";
var VertexShader = (function (_super) {
    __extends(VertexShader, _super);
    function VertexShader() {
        var _this = _super.call(this, shapeVertex, shapeFrament) || this;
        _this.iTime = _this.uniforms["iTime"] = egret.getTimer() / 1000;
        egret.lifecycle.stage.addEventListener(egret.Event.ENTER_FRAME, _this.updateRenderer, _this);
        return _this;
    }
    VertexShader.prototype.updateRenderer = function () {
        var time = egret.getTimer() / 1000;
        this.iTime = time;
        this.uniforms["iTime"] = this.iTime;
    };
    return VertexShader;
}(egret.CustomFilter));
__reflect(VertexShader.prototype, "VertexShader");
