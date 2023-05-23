
const vertexSrc = `
attribute vec2 aVertexPosition;    
attribute vec2 aTextureCoord;
attribute vec2 aColor;
uniform vec2 projectionVector;
const vec2 center = vec2(-1.0, 1.0);
varying vec2 vTextureCoord;
varying vec4 vColor;
void main(){
    gl_Position=vec4((aVertexPosition/projectionVector) + center,0.0,1.0);
    vTextureCoord = aTextureCoord;
    vColor = vec4(aColor.x,aColor.x,aColor.x,aColor.x);
}`
function formatFragment(content: string) {
    let mainImageFuc = `mainImage(gl_FragColor,vTextureCoord);`;
    let lines = content.split("\n");
    let entry: string;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].indexOf("void mainImage") >= 0) {
            entry = lines[i];
            break;
        }
    }
    if (!entry) {
        console.error("在 chunk 未找到 mainImage 函数,请检查是否为标准shadertoy代码..");
    } else {
        // let start=content.indexOf(entry);
        // let end=content.indexOf("}",start);
        // let entryWholeText=content.substring(start,end);
        content = content.replace(/fragCoord/g, "fragCoord_");

        if (entry.indexOf("in sampler2D iChannel0") > 0) {
            mainImageFuc = `mainImage(gl_FragColor,vTextureCoord,uSampler);`;
        }
    }
    let precision = `precision mediump float;`;
    if (content.indexOf("precision highp float") >= 0) {
        precision = `precision highp float;`;
    }
    return `
${precision}
    
varying vec2 vTextureCoord;
varying vec4 vColor;
uniform sampler2D uSampler;
uniform vec2 projectionVector;
uniform vec2 uTextureSize;
uniform float iTime;
uniform float iTimeDelta;
uniform float iFrame;
uniform float mouseX;
uniform float mouseY;
// #define fragCoord=vTextureCoord
#define iResolution vec2(1.0,1.0)
#define iMouse vec3(mouseX,mouseY,0.5)
${content}
void main(){
    ${mainImageFuc}
}`
}

/**
 * 
 * 需要注意的是 shadertoy的渲染主函数
 * void mainImage( out vec4 fragColor, in vec2 fragCoord )
 * 中的fragCoord名称貌似与egret内部变量冲突,所以更改名称
 */
class ShaderToy extends egret.CustomFilter {
    public iTime: number;
    public iTimeDelta: number;
    public iFrame: number;
    public iMouse: egret.Point;

    constructor(fragmentSrc: string, options?: { debug?: boolean }) {
        fragmentSrc = formatFragment(fragmentSrc);
        super(vertexSrc, fragmentSrc);
        if (options && options.debug) {
            this.log(vertexSrc,"[ vertex ] :");
            this.log(fragmentSrc,"[ fragment ] :");
        }
        this.iMouse = new egret.Point();
        this.iMouse.setTo(0.5, 0.5);
        this.iTime = this.uniforms["iTime"] = egret.getTimer() / 1000;
        this.iTimeDelta = this.uniforms["iFrame"] = 0;
        this.iFrame = this.uniforms["iTimeDelta"] = 0;
        // this.uniforms["iWidth"] = options && options.width ? options.width : 1.0;
        // this.uniforms["iHeight"] = options && options.height ? options.height : 1.0;
        egret.lifecycle.stage.addEventListener(egret.Event.ENTER_FRAME, this.updateRenderer, this);
    }

    private log(code: string,title?:string) {
        console.log((title?`${title}\n`:"")+code.split("\n").map((v, i) => {
            let o=(i+1)+'';
            let total=4-o.length;
            while(total--) o+="-";
            return `${o}| ${v}`;
        }).join("\n"))
    }

    // set width(v: number) {
    //     this.uniforms["iWidth"] = v;
    // }
    // set height(v: number) {
    //     this.uniforms["iHeight"] = v;
    // }
    private updateRenderer() {
        let time = egret.getTimer() / 1000;
        this.iTimeDelta = time - this.iTime;
        this.iTime = time;
        this.uniforms["iTime"] = this.iTime;
        this.uniforms["iFrame"] = ++this.iFrame;
        this.uniforms["iTimeDelta"] = this.iTimeDelta;
        this.uniforms["mouseX"] = this.iMouse.x;
        this.uniforms["mouseY"] = this.iMouse.y;
    }
}