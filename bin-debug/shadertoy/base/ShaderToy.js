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
var vertexSrc = "\nattribute vec2 aVertexPosition;    \nattribute vec2 aTextureCoord;\nattribute vec2 aColor;\nuniform vec2 projectionVector;\nconst vec2 center = vec2(-1.0, 1.0);\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\nvoid main(){\n    gl_Position=vec4((aVertexPosition/projectionVector) + center,0.0,1.0);\n    vTextureCoord = aTextureCoord;\n    vColor = vec4(aColor.x,aColor.x,aColor.x,aColor.x);\n}";
function formatFragment(content) {
    var mainImageFuc = "mainImage(gl_FragColor,vTextureCoord);";
    var lines = content.split("\n");
    var entry;
    for (var i = 0; i < lines.length; i++) {
        if (lines[i].indexOf("void mainImage") >= 0) {
            entry = lines[i];
            break;
        }
    }
    if (!entry) {
        console.error("在 chunk 未找到 mainImage 函数,请检查是否为标准shadertoy代码..");
    }
    else {
        // let start=content.indexOf(entry);
        // let end=content.indexOf("}",start);
        // let entryWholeText=content.substring(start,end);
        content = content.replace(/fragCoord/g, "fragCoord_");
        if (entry.indexOf("in sampler2D iChannel0") > 0) {
            mainImageFuc = "mainImage(gl_FragColor,vTextureCoord,uSampler);";
        }
    }
    var precision = "precision mediump float;";
    if (content.indexOf("precision highp float") >= 0) {
        precision = "precision highp float;";
    }
    return "\n" + precision + "\n    \nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\nuniform sampler2D uSampler;\nuniform vec2 projectionVector;\nuniform vec2 uTextureSize;\nuniform float iTime;\nuniform float iTimeDelta;\nuniform float iFrame;\nuniform float mouseX;\nuniform float mouseY;\n// #define fragCoord=vTextureCoord\n#define iResolution vec2(1.0,1.0)\n#define iMouse vec3(mouseX,mouseY,0.5)\n" + content + "\nvoid main(){\n    " + mainImageFuc + "\n}";
}
/**
 *
 * 需要注意的是 shadertoy的渲染主函数
 * void mainImage( out vec4 fragColor, in vec2 fragCoord )
 * 中的fragCoord名称貌似与egret内部变量冲突,所以更改名称
 */
var ShaderToy = (function (_super) {
    __extends(ShaderToy, _super);
    function ShaderToy(fragmentSrc, options) {
        var _this = this;
        fragmentSrc = formatFragment(fragmentSrc);
        _this = _super.call(this, vertexSrc, fragmentSrc) || this;
        if (options && options.debug) {
            _this.log(vertexSrc, "[ vertex ] :");
            _this.log(fragmentSrc, "[ fragment ] :");
        }
        _this.iMouse = new egret.Point();
        _this.iMouse.setTo(0.5, 0.5);
        _this.iTime = _this.uniforms["iTime"] = egret.getTimer() / 1000;
        _this.iTimeDelta = _this.uniforms["iFrame"] = 0;
        _this.iFrame = _this.uniforms["iTimeDelta"] = 0;
        // this.uniforms["iWidth"] = options && options.width ? options.width : 1.0;
        // this.uniforms["iHeight"] = options && options.height ? options.height : 1.0;
        egret.lifecycle.stage.addEventListener(egret.Event.ENTER_FRAME, _this.updateRenderer, _this);
        return _this;
    }
    ShaderToy.prototype.log = function (code, title) {
        console.log((title ? title + "\n" : "") + code.split("\n").map(function (v, i) {
            var o = (i + 1) + '';
            var total = 4 - o.length;
            while (total--)
                o += "-";
            return o + "| " + v;
        }).join("\n"));
    };
    // set width(v: number) {
    //     this.uniforms["iWidth"] = v;
    // }
    // set height(v: number) {
    //     this.uniforms["iHeight"] = v;
    // }
    ShaderToy.prototype.updateRenderer = function () {
        var time = egret.getTimer() / 1000;
        this.iTimeDelta = time - this.iTime;
        this.iTime = time;
        this.uniforms["iTime"] = this.iTime;
        this.uniforms["iFrame"] = ++this.iFrame;
        this.uniforms["iTimeDelta"] = this.iTimeDelta;
        this.uniforms["mouseX"] = this.iMouse.x;
        this.uniforms["mouseY"] = this.iMouse.y;
    };
    return ShaderToy;
}(egret.CustomFilter));
__reflect(ShaderToy.prototype, "ShaderToy");
