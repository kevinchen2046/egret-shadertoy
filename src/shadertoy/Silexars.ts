module shadertoy {
    export const Silexars=`
    // http://www.pouet.net/prod.php?which=57245
    // If you intend to reuse this shader, please add credits to 'Danilo Guanabara'
    
    #define t iTime
    #define r iResolution.xy
    
    void mainImage( out vec4 fragColor, in vec2 fragCoord,in sampler2D iChannel0){
        vec2 uv=vec2(fragCoord.x,fragCoord.y);
        fragCoord.y*=uTextureSize.y/uTextureSize.x;
        fragCoord.y-=(1.-uTextureSize.x/uTextureSize.y);
        vec3 c;
        float l,z=t;
        for(int i=0;i<3;i++) {
            vec2 uv,p=fragCoord.xy/r;
            uv=p;
            p-=.5;
            p.x*=r.x/r.y;
            z+=.07;
            l=length(p);
            uv+=p/l*(sin(z)+1.)*abs(sin(l*9.-z-z));
            c[i]=.01/length(mod(uv,1.)-.5);
        }
        vec4 tColor=texture2D(iChannel0,uv);
        fragColor=(vec4(c/l,t)*0.8)+tColor;
    }`
}