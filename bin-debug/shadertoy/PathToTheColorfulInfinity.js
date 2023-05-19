var shadertoy;
(function (shadertoy) {
    shadertoy.PathToTheColorfulInfinity = "\n    // Created by Benoit Marini - 2020\n    // License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.\n    \n    // Try it fullscreen ;)\n    // Try NUM_LAYERS 80. if your GPU can\n    \n    #define NUM_LAYERS 16.\n    #define ITER 23\n    \n    vec4 tex(vec3 p)\n    {\n        float t = iTime+78.;\n        vec4 o = vec4(p.xyz,3.*sin(t*.1));\n        vec4 dec = vec4 (1.,.9,.1,.15) + vec4(.06*cos(t*.1),0,0,.14*cos(t*.23));\n        for (int i=0 ; i<ITER; i++) o.xzyw = abs(o/dot(o,o)- dec);\n        return o;\n    }\n    \n    void mainImage( out vec4 fragColor, in vec2 uv )\n    {\n    \n        uv = (uv-iResolution.xy*.5)/iResolution.y;\n        vec3 col = vec3(0);   \n        float t= iTime* .3;\n        \n        for(float i=0.; i<=1.; i+=1./NUM_LAYERS)\n        {\n            float d = fract(i+t); // depth\n            float s = mix(5.,.5,d); // scale\n            float f = d * smoothstep(1.,.9,d); //fade\n            col+= tex(vec3(uv*s,i*4.)).xyz*f;\n        }\n        \n        col/=NUM_LAYERS;\n        col*=vec3(2,1.,2.);\n           col=pow(col,vec3(.5 ));  \n    \n        fragColor = vec4(col,1.0);\n    }";
})(shadertoy || (shadertoy = {}));