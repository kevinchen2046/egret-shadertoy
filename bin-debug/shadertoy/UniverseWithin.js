var shadertoy;
(function (shadertoy) {
    shadertoy.UniverseWithin = "\n    // The Universe Within - by Martijn Steinrucken aka BigWings 2018\n    // Email:countfrolic@gmail.com Twitter:@The_ArtOfCode\n    // License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.\n    \n    // After listening to an interview with Michael Pollan on the Joe Rogan\n    // podcast I got interested in mystic experiences that people seem to\n    // have when using certain psycoactive substances. \n    //\n    // For best results, watch fullscreen, with music, in a dark room.\n    // \n    // I had an unused 'blockchain effect' lying around and used it as\n    // a base for this effect. Uncomment the SIMPLE define to see where\n    // this came from.\n    // \n    // Use the mouse to get some 3d parallax.\n    \n    // Music - Terrence McKenna Mashup - Jason Burruss Remixes\n    // https://soundcloud.com/jason-burruss-remixes/terrence-mckenna-mashup\n    //\n    // YouTube video of this effect:\n    // https://youtu.be/GAhu4ngQa48\n    //\n    // YouTube Tutorial for this effect:\n    // https://youtu.be/3CycKKJiwis\n    \n    \n    #define S(a, b, t) smoothstep(a, b, t)\n    #define NUM_LAYERS 4.\n    \n    //#define SIMPLE\n    \n    \n    float N21(vec2 p) {\n        vec3 a = fract(vec3(p.xyx) * vec3(213.897, 653.453, 253.098));\n        a += dot(a, a.yzx + 79.76);\n        return fract((a.x + a.y) * a.z);\n    }\n    \n    vec2 GetPos(vec2 id, vec2 offs, float t) {\n        float n = N21(id+offs);\n        float n1 = fract(n*10.);\n        float n2 = fract(n*100.);\n        float a = t+n;\n        return offs + vec2(sin(a*n1), cos(a*n2))*.4;\n    }\n    \n    float GetT(vec2 ro, vec2 rd, vec2 p) {\n        return dot(p-ro, rd); \n    }\n    \n    float LineDist(vec3 a, vec3 b, vec3 p) {\n        return length(cross(b-a, p-a))/length(p-a);\n    }\n    \n    float df_line( in vec2 a, in vec2 b, in vec2 p)\n    {\n        vec2 pa = p - a, ba = b - a;\n        float h = clamp(dot(pa,ba) / dot(ba,ba), 0., 1.);\t\n        return length(pa - ba * h);\n    }\n    \n    float line(vec2 a, vec2 b, vec2 uv) {\n        float r1 = .04;\n        float r2 = .01;\n        \n        float d = df_line(a, b, uv);\n        float d2 = length(a-b);\n        float fade = S(1.5, .5, d2);\n        \n        fade += S(.05, .02, abs(d2-.75));\n        return S(r1, r2, d)*fade;\n    }\n    \n    float NetLayer(vec2 st, float n, float t) {\n        vec2 id = floor(st)+n;\n    \n        st = fract(st)-.5;\n       \n        vec2 p[9];\n        // int i=0;\n        // for(float y=-1.; y<=1.; y++) {\n        //     for(float x=-1.; x<=1.; x++) {\n        //         p[j] = GetPos(id, vec2(x,y), t);\n        //     }\n        // }\n        p[0]=GetPos(id, vec2(-1,-1), t);\n        p[1]=GetPos(id, vec2(0,-1), t);\n        p[2]=GetPos(id, vec2(1,-1), t);\n        p[3]=GetPos(id, vec2(-1,0), t);\n        p[4]=GetPos(id, vec2(0,0), t);\n        p[5]=GetPos(id, vec2(1,0), t);\n        p[6]=GetPos(id, vec2(-1,1), t);\n        p[7]=GetPos(id, vec2(0,1), t);\n        p[8]=GetPos(id, vec2(1,1), t);\n\n        float m = 0.;\n        float sparkle = 0.;\n        \n        for(int i=0; i<9; i++) {\n            m += line(p[4], p[i], st);\n    \n            float d = length(st-p[i]);\n    \n            float s = (.005/(d*d));\n            s *= S(1., .7, d);\n            float pulse = sin((fract(p[i].x)+fract(p[i].y)+t)*5.)*.4+.6;\n            pulse = pow(pulse, 20.);\n    \n            s *= pulse;\n            sparkle += s;\n        }\n        \n        m += line(p[1], p[3], st);\n        m += line(p[1], p[5], st);\n        m += line(p[7], p[5], st);\n        m += line(p[7], p[3], st);\n        \n        float sPhase = (sin(t+n)+sin(t*.1))*.25+.5;\n        sPhase += pow(sin(t*.1)*.5+.5, 50.)*5.;\n        m += sparkle*sPhase;//(*.5+.5);\n        \n        return m;\n    }\n    \n    void mainImage( out vec4 fragColor, in vec2 fragCoord ,in sampler2D iChannel0)\n    {   \n        vec2 uv1=vec2(fragCoord.x,fragCoord.y);\n        fragCoord.y*=uTextureSize.y/uTextureSize.x;\n        fragCoord.y-=(1.-uTextureSize.x/uTextureSize.y);\n        vec2 uv = (fragCoord-iResolution.xy*.5)/iResolution.y;\n        vec2 M = iMouse.xy/iResolution.xy-.5;\n        \n        float t = iTime*.1;\n        \n        float s = sin(t);\n        float c = cos(t);\n        mat2 rot = mat2(c, -s, s, c);\n        vec2 st = uv*rot;  \n        M *= rot*2.;\n        \n        float m = 0.;\n        for(float i=0.; i<1.; i+=1./NUM_LAYERS) {\n            float z = fract(t+i);\n            float size = mix(15., 1., z);\n            float fade = S(0., .6, z)*S(1., .8, z);\n            \n            m += fade * NetLayer(st*size-M*z, i, iTime);\n        }\n        \n        float fft  = texture2D(iChannel0,vec2(.7,0.0)).x;\n        float glow = -uv.y*fft*2.;\n       \n        vec3 baseCol = vec3(s, cos(t*.4), -sin(t*.24))*.4+.6;\n        vec3 col = baseCol*m;\n        col += baseCol*glow;\n        \n        #ifdef SIMPLE\n            uv *= 10.;\n            col = vec3(1)*NetLayer(uv, 0., iTime);\n            uv = fract(uv);\n            //if(uv.x>.98 || uv.y>.98) col += 1.;\n        #else\n            col *= 1.-dot(uv,uv);\n            t = mod(iTime, 230.);\n            col *= S(0., 20., t)*S(224., 200., t);\n        #endif\n        col+=vec3(vPosition.x+1.0,vPosition.y+1.0,0.)*0.1;\n        fragColor = vec4(col,1);\n    }";
})(shadertoy || (shadertoy = {}));
