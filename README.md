# egret-shadertoy

 * 需要注意的是：shadertoy的渲染主函数`void mainImage( out vec4 fragColor, in vec2 fragCoord )`中的`fragCoord`名称貌似与egret内部变量冲突,所以更改名称