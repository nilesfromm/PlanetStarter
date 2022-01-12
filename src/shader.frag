precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_scroll;
uniform vec2 u_pos[2];
uniform vec3 u_color[2];

uniform vec3 u_red;
uniform vec3 u_blue;

vec3 red = u_red;
vec3 blue = u_blue;
vec3 black = vec3(0.0);

vec2 pos_red = vec2(0.1,0.1);
vec2 pos_blue = vec2(-0.25,0.25);

float dist(vec2 p0, vec2 p1){
    return sqrt((p1.x-p0.x)*(p1.x-p0.x)+(p1.y-p0.y)*(p1.y-p0.y));
}

vec3 rgb(float r, float g, float b){
  return vec3(r / 255.0, g / 255.0, b / 255.0);
}

// float blend (float src, float dst) {
//   return src * dst;
// }

void main() {

    vec2 coord = gl_FragCoord.xy/u_resolution;
    coord -= 0.5; // <-0.5,0.5>
    coord.y *= u_resolution.y/u_resolution.x; // fix aspect ratio

    vec4 totalColor = vec4(0.0, 0.0, 0.0, 0.0);
    // vec2 center = u_resolution * 0.5;
    // vec2 left = center;
    // left.x = left.x/2.;
    // vec2 right = center;
    // right.x += right.x/2.;

    //flip mouse Y
    vec2 mp = u_mouse / u_resolution;
    mp.y = 1. - mp.y;

    for(int i = 0; i < 2; i++){
        float d = dist(u_pos[i],coord);
        float ratio = d / ((abs((mp.x - 0.5) + u_pos[i].x)+0.4) * 0.5); //0.25;
        float intensity = ((abs((mp.x - 0.5) + u_pos[i].x)+1.) * 0.5) * smoothstep(1.0, 0.0, ratio) / 2.; //1.0 - clamp(ratio, 0.0, 1.0);
        totalColor.x = totalColor.x + u_color[i].x * intensity;
        totalColor.y = totalColor.y + u_color[i].y * intensity;
        totalColor.z = totalColor.z + u_color[i].z * intensity;
        totalColor.w = totalColor.w + intensity;
    }

    // vec4 final = mix(vec4(blue, 1.0), vec4(black, 1.0), d);
    vec4 final = vec4(
        totalColor.x,
        totalColor.y,
        totalColor.z,
        1.
    );

    gl_FragColor=vec4(final);
}