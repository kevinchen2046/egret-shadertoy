var shadertoy;
(function (shadertoy) {
    shadertoy.Colorello = "\n#define MOD3 vec3(.1031,.11369,.13787)\n#define hue(h) clamp( abs( fract(h + vec4(3,2,1,0)/3.) * 6. - 3.) -1. , 0., 1.)\n\nvec3 hash33(vec3 p3)\n{\n\tp3 = fract(p3 * MOD3);\n    p3 += dot(p3, p3.yxz+19.19);\n    return -1.0 + 2.0 * fract(vec3((p3.x + p3.y)*p3.z, (p3.x+p3.z)*p3.y, (p3.y+p3.z)*p3.x));\n}\n\nfloat simplex_noise(vec3 p)\n{\n    const float K1 = 0.333333333;\n    const float K2 = 0.166666667;\n    \n    vec3 i = floor(p + (p.x + p.y + p.z) * K1);\n    vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);\n        \n    vec3 e = step(vec3(0.0), d0 - d0.yzx);\n\tvec3 i1 = e * (1.0 - e.zxy);\n\tvec3 i2 = 1.0 - e.zxy * (1.0 - e);\n    \n    vec3 d1 = d0 - (i1 - 1.0 * K2);\n    vec3 d2 = d0 - (i2 - 2.0 * K2);\n    vec3 d3 = d0 - (1.0 - 3.0 * K2);\n    \n    vec4 h = max(0.6 - vec4(dot(d0, d0), dot(d1, d1), dot(d2, d2), dot(d3, d3)), 0.0);\n    vec4 n = h * h * h * h * vec4(dot(d0, hash33(i)), dot(d1, hash33(i + i1)), dot(d2, hash33(i + i2)), dot(d3, hash33(i + 1.0)));\n    \n    return dot(vec4(31.316), n);\n}\n\nvoid mainImage( out vec4 fragColor, in vec2 fragCoord ,in sampler2D iChannel0)\n{    \n    vec2 uv = (fragCoord - iResolution.xy*.5)/iResolution.y;     \n    \n    float s = simplex_noise(vec3(uv*10., iTime*1.15));    \n    float s1=s;    \n    s += length(uv)*25. - iTime*2.;               \n    float m = smoothstep(0.25, .0, abs( fract(s) ) );       \n    vec4 color=vec4(hue(s + length(uv) - iTime*.5)) * m;\n    if(color.r+color.g+color.g==0.0){\n        color.rgba=vec4(1.0,1.0,1.0,1.0);\n        fragColor = color * texture2D( uSampler,vTextureCoord* (1.0-s1*0.02));\n    }else{\n        fragColor = color + texture2D( uSampler,vTextureCoord* (1.0-s1*0.01))*0.9;\n    }\n\n    \n}\n";
})(shadertoy || (shadertoy = {}));
