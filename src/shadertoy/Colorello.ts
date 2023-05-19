module shadertoy {
	export const Colorello =`
#define MOD3 vec3(.1031,.11369,.13787)
#define hue(h) clamp( abs( fract(h + vec4(3,2,1,0)/3.) * 6. - 3.) -1. , 0., 1.)

vec3 hash33(vec3 p3)
{
	p3 = fract(p3 * MOD3);
    p3 += dot(p3, p3.yxz+19.19);
    return -1.0 + 2.0 * fract(vec3((p3.x + p3.y)*p3.z, (p3.x+p3.z)*p3.y, (p3.y+p3.z)*p3.x));
}

float simplex_noise(vec3 p)
{
    const float K1 = 0.333333333;
    const float K2 = 0.166666667;
    
    vec3 i = floor(p + (p.x + p.y + p.z) * K1);
    vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
        
    vec3 e = step(vec3(0.0), d0 - d0.yzx);
	vec3 i1 = e * (1.0 - e.zxy);
	vec3 i2 = 1.0 - e.zxy * (1.0 - e);
    
    vec3 d1 = d0 - (i1 - 1.0 * K2);
    vec3 d2 = d0 - (i2 - 2.0 * K2);
    vec3 d3 = d0 - (1.0 - 3.0 * K2);
    
    vec4 h = max(0.6 - vec4(dot(d0, d0), dot(d1, d1), dot(d2, d2), dot(d3, d3)), 0.0);
    vec4 n = h * h * h * h * vec4(dot(d0, hash33(i)), dot(d1, hash33(i + i1)), dot(d2, hash33(i + i2)), dot(d3, hash33(i + 1.0)));
    
    return dot(vec4(31.316), n);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ,in sampler2D iChannel0)
{    
    vec2 uv = (fragCoord - iResolution.xy*.5)/iResolution.y;     
    
    float s = simplex_noise(vec3(uv*10., iTime*1.15));    
    float s1=s;    
    s += length(uv)*25. - iTime*2.;               
    float m = smoothstep(0.25, .0, abs( fract(s) ) );       
    vec4 color=vec4(hue(s + length(uv) - iTime*.5)) * m;
    if(color.r+color.g+color.g==0.0){
        color.rgba=vec4(1.0,1.0,1.0,1.0);
        fragColor = color * texture2D( uSampler,vTextureCoord* (1.0-s1*0.02));
    }else{
        fragColor = color + texture2D( uSampler,vTextureCoord* (1.0-s1*0.01))*0.9;
    }

    
}
`
}
