var shadertoy;
(function (shadertoy) {
    shadertoy.FlyingIntoDigitalTunnel = "\n    #define RAYMARCH_ITERATIONS 20.0\n    #define TIME (iTime * 0.4)\n    #define LINE_LENGTH 1.0\n    #define LINE_SPACE 1.0\n    #define LINE_WIDTH 0.007\n    #define BOUNDING_CYLINDER 1.8\n    #define INSIDE_CYLINDER 0.32\n    #define EPS 0.0001\n    #define FOG_DISTANCE 5.0\n    \n    #define FIRST_COLOR vec3(1.2, 0.5, 0.2) * 1.2\n    #define SECOND_COLOR vec3(0.2, 0.8, 1.1)\n    \n    float hash12(vec2 x)\n    {\n         return fract(sin(dot(x, vec2(42.2347, 43.4271))) * 342.324234);   \n    }\n    \n    vec2 hash22(vec2 x)\n    {\n         return fract(sin(x * mat2(23.421, 24.4217, 25.3271, 27.2412)) * 342.324234);   \n    }\n    \n    vec3 hash33(vec3 x)\n    {\n         return fract(sin(x * mat3(23.421, 24.4217, 25.3271, 27.2412, 32.21731, 21.27641, 20.421, 27.4217, 22.3271)) * 342.324234);   \n    }\n    \n    \n    mat3 rotationMatrix(vec3 angle)\n    {\n         return \tmat3(cos(angle.z), sin(angle.z), 0.0,\n                     -sin(angle.z), cos(angle.z), 0.0,\n                     0.0, 0.0, 1.0)\n                * mat3(1.0, 0.0, 0.0,\n                        0.0, cos(angle.x), sin(angle.x),\n                        0.0, -sin(angle.x), cos(angle.x))\n                * mat3(cos(angle.y), 0.0, sin(angle.y),\n                        0.0, 1.0, 0.0,\n                        -sin(angle.y), 0.0, cos(angle.y));\n    }\n\n    //Shader License: CC BY 3.0\n//Author: Jan Mr\u00F3z (jaszunio15)\n\nvec3 castPlanePoint(vec2 fragCoord)\n{\n \tvec2 uv = (2.0 * fragCoord - iResolution.xy) / iResolution.x;\n    return vec3(uv.x, uv.y, -1.0);\n}\n\nfloat planeSDF(vec3 point)\n{\n \treturn point.y;\n}\n\n//source https://iquilezles.org/articles/distfunctions\nfloat boxSDF( vec3 point, vec3 bounds )\n{\n    vec3 q = abs(point) - bounds;\n    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);\n}\n\n//rgb - colors\n//a - sdf\nvec4 repeatBoxSDF(vec3 point)\n{\n    vec3 rootPoint = floor(vec3(point.x / LINE_SPACE, point.y / LINE_SPACE, point.z / LINE_LENGTH)); \n    rootPoint.z *= LINE_LENGTH;\n    rootPoint.xy *= LINE_SPACE;\n    float minSDF = 10000.0;\n    vec3 mainColor = vec3(0.0);\n    \n    for (float x = -1.0; x <= 1.1; x++)\n    {\n        for (float y = -1.0; y <= 1.1; y++)\n        {\n\t\t\tfor (float z = -1.0; z <= 1.1; z++)\n            {\n\t\t\t\tvec3 tempRootPoint = rootPoint + vec3(x * LINE_SPACE, y * LINE_SPACE, z * LINE_LENGTH);\n                \n                vec3 lineHash = hash33(tempRootPoint);\n                lineHash.z = pow(lineHash.z, 10.0);\n                \n                float hash = hash12(tempRootPoint.xy) - 0.5;\n                tempRootPoint.z += hash * LINE_LENGTH;\n                \n                vec3 boxCenter = tempRootPoint + vec3(0.5 * LINE_SPACE, 0.5 * LINE_SPACE, 0.5 * LINE_LENGTH);\n                boxCenter.xy += (lineHash.xy - 0.5) * LINE_SPACE;\n                vec3 boxSize = vec3(LINE_WIDTH, LINE_WIDTH, LINE_LENGTH * (1.0 - lineHash.z));\n                \n                vec3 color = FIRST_COLOR;\n                if(lineHash.x < 0.5) color = SECOND_COLOR;\n                \n                float sdf = boxSDF(point - boxCenter, boxSize);\n                if (sdf < minSDF)\n                {\n                    mainColor = color;\n                    minSDF = sdf;\n                }\n            }\n        }\n    }\n    \n    return vec4(mainColor, minSDF);\n}\n\nfloat cylinderSDF(vec3 point, float radius)\n{\n \treturn length(point.xy) - radius;\n}\n\nfloat multiplyObjects(float o1, float o2)\n{\n \treturn max(o1, o2);   \n}\n\nvec3 spaceBounding(vec3 point)\n{\n \treturn vec3(sin(point.z * 0.15) * 5.0, cos(point.z * 0.131) * 5.0, 0.0); \n}\n\n//rgb - color,\n//a - sdf\nvec4 objectSDF(vec3 point)\n{\n    point += spaceBounding(point);\n    \n    vec4 lines = repeatBoxSDF(point);\n    float cylinder = cylinderSDF(point, BOUNDING_CYLINDER);\n    float insideCylinder = -cylinderSDF(point, INSIDE_CYLINDER);\n    \n    float object = multiplyObjects(lines.a, cylinder);\n    object = multiplyObjects(object, insideCylinder);\n \treturn vec4(lines.rgb, object);\n}\n\n\nvec3 rayMarch(vec3 rayOrigin, vec3 rayDirection, out vec3 color)\n{\n    color = vec3(0.0);\n    float dist = 0.0;\n \tfor (float i = 0.0; i < RAYMARCH_ITERATIONS; i++)\n    {\n     \tvec4 sdfData = objectSDF(rayOrigin);\n        color += sdfData.rgb * sqrt(smoothstep(0.8, 0.0, sdfData.a)) * pow(smoothstep(FOG_DISTANCE * 0.6, 0.0, dist), 3.0) * 0.2;\n        rayOrigin += rayDirection * sdfData.a * 0.7;\n        dist += sdfData.a;\n        if (length(rayOrigin.xy) > BOUNDING_CYLINDER + 10.0) break;\n    }\n\n\n    return rayOrigin;\n}\n \nvoid mainImage( out vec4 fragColor, in vec2 fragCoord ,in sampler2D iChannel0)\n{\n\tvec3 cameraCenter = vec3(0.0, 0.0, -TIME * 10.0);\n    cameraCenter -= spaceBounding(cameraCenter);\n    vec3 cameraAngle = vec3(0.0, 0.0, 0.0);\n    \n    vec3 prevCameraCenter = vec3(0.0, 0.0, -(TIME - 0.01) * 10.0);\n    prevCameraCenter -= spaceBounding(prevCameraCenter);\n    vec3 nextCameraCenter = vec3(0.0, 0.0, -(TIME + 0.4) * 10.0);\n    nextCameraCenter -= spaceBounding(nextCameraCenter);\n    \n    vec3 velocityVector = -normalize(nextCameraCenter - prevCameraCenter);\n    vec3 cameraUp = -normalize(cross(velocityVector, vec3(1.0, 0.0, 0.0)));\n    vec3 cameraRight = -(cross(velocityVector, cameraUp));\n    \n    \n    mat3 cameraRotation = mat3(cameraRight, cameraUp, velocityVector);\n    \n    vec3 rayOrigin = cameraCenter;\n    vec3 rayDirection = cameraRotation * normalize(castPlanePoint(fragCoord));\n    \n    vec3 color = vec3(0.0);\n    vec3 hitPoint = rayMarch(rayOrigin, rayDirection, color);\n    vec4 sdf = objectSDF(hitPoint);\n    \n    float vision = smoothstep(0.01, 0.0, sdf.a);\n    \n    float fog = sqrt(smoothstep(FOG_DISTANCE, 0.0, distance(cameraCenter, hitPoint)));\n    \n    vec3 ambient = mix(SECOND_COLOR, FIRST_COLOR, pow(sin(TIME) * 0.5 + 0.5, 2.0) * 0.6);\n    ambient *= sqrt((sin(TIME) + sin(TIME * 3.0)) * 0.25 + 1.0);\n    vec3 bloom = smoothstep(-0.0, 15.0, color);\n    \n    color = color * vision * 0.07 * fog + bloom + ambient * 0.3;\n    color = smoothstep(-0.01, 1.5, color * 1.1);\n    \n    vec4 tColor=texture2D(iChannel0,fragCoord+fragCoord*(hitPoint.xy*0.01));\n    // vec4 tColor=texture2D(iChannel0,fragCoord+fragCoord*(0.01*sdf.a));\n    // vec4 tColor=texture2D(iChannel0,fragCoord+fragCoord*(hitPoint.xy*0.01)*(0.5*sdf.a));\n    fragColor = vec4(color, 1.0)*tColor*10.0;\n}\n";
})(shadertoy || (shadertoy = {}));
