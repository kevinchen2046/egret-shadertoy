const shapeVertex = `attribute vec2 aVertexPosition;    
attribute vec2 aTextureCoord;
attribute vec2 aColor;
uniform vec2 projectionVector;
const vec2 center = vec2(-1.0, 1.0);
varying vec2 vTextureCoord;
varying vec4 vColor;
varying vec4 vPosition;
void main(){
    vPosition=vec4((aVertexPosition/projectionVector).xy,0.2,0.5);
    gl_Position=vec4((aVertexPosition/projectionVector) + center,0.0,1.0);
    vTextureCoord = aTextureCoord;
    vColor = vec4(aColor.x,aColor.x,aColor.x,aColor.x);
}`;
const shapeFrament = `precision lowp float;
varying vec2 vTextureCoord;
varying vec4 vColor;
varying vec4 vPosition;
uniform float iTime;
void main(void) {
    vec4 p=vPosition.xyzw;
    p.x+=sin(iTime);
    p.y+=cos(iTime);
    gl_FragColor = vColor*p;
}`

class VertexShader extends egret.CustomFilter {
    public iTime:number;
    constructor() {
        super(shapeVertex, shapeFrament);
        this.iTime = this.uniforms["iTime"] = egret.getTimer() / 1000;
        egret.lifecycle.stage.addEventListener(egret.Event.ENTER_FRAME, this.updateRenderer, this);
    }
    private updateRenderer() {
        let time = egret.getTimer() / 1000;
        this.iTime = time;
        this.uniforms["iTime"] = this.iTime;
    }
}