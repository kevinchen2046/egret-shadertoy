module shadertoy {
    export const Synergy=/*glsl*/`
/* "Synergy" by @kishimisu (2023) - https://www.shadertoy.com/view/ms3XWl 
A 31-seconds seamless loop directed by trigonometry
*/
 
 void mainImage(out vec4 O, vec2 F ,in sampler2D iChannel0) {
     vec2 uv=F.xy;
     F.y*=uTextureSize.y/uTextureSize.x;
     F.y-=(1.-uTextureSize.x/uTextureSize.y);
     vec2   g  = iResolution.xy,
            o  = (F+F-g)/g.y/.7; 
            
     float f = iTime*.4-2.;
     vec4 col= O.xyzw;
     col *= 0.;
     vec4 CColor=texture2D(iChannel0,uv);

     for (float l= 0.; l< 55.;l++){ 
        vec4 value=.005/abs(length(o+ vec2(cos(l*(cos(f*.5)*.5+.6)+f), sin(l+f)))-(sin(l+f*4.)*.04+.02))*(cos(l+length(o)*4.+vec4(0,1,2,0))+1.);
        col +=value;
        CColor+=value;
     }
     
     O=col*CColor;
 }`
}