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
        float intensity = ((abs((mp.x - 0.5) + u_pos[i].x)+1.) * 0.75) * smoothstep(1.0, 0.0, ratio) / 2.; //1.0 - clamp(ratio, 0.0, 1.0);
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

    // float mdist = smoothstep(1.0, 0.0, dist(coord+vec2(0.5),mp)*5.);
    // final = mix(vec4(final.xyz, 1.0), vec4(black, 1.0), mdist);

    gl_FragColor=vec4(final);
}



// void mainImage( out vec4 fragColor, in vec2 fragCoord )
// {   
//     float speed = .1;
//     float scale = 0.002;
//     vec2 p = fragCoord * scale;   
//     for(int i=1; i<10; i++){
//         p.x+=0.3/float(i)*sin(float(i)*3.*p.y+iTime*speed)+iMouse.x/1000.;
//         p.y+=0.3/float(i)*cos(float(i)*3.*p.x+iTime*speed)+iMouse.y/1000.;
//     }
//     float r=cos(p.x+p.y+1.)*.5+.5;
//     float g=sin(p.x+p.y+1.)*.5+.5;
//     float b=(sin(p.x+p.y)+cos(p.x+p.y))*.3+.5;
//     vec3 color = vec3(r,g,b);
//     fragColor = vec4(color,1);
// }



// vec4 renderRipples() {
//     vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);
//     vec3 e = vec3(vec2(3.6)/u_resolution.xy,0.);
//     vec2 sample = gl_FragCoord.xy / u_resolution.xy;
//     float ratio = u_resolution.x / u_resolution.y;
//     vec2 mouse = u_mouse.xy - uv;
    
//     vec4 fragcolour = texture2D(u_buffer, sample);
    
//     float shade = 0.;
    
//     // if(u_mousemoved == false) {
//     //   float t = u_time * 4.;
//     //   mouse = vec2(cos(t)*1.5, sin(t*2.)) * .3 - sample + .5;
//     //   shade = smoothstep(.02 + abs(sin(u_time*10.) * .006), .0, length(mouse)); 
//     // }
    
//     // float shade = 1. - smoothstep(.1, .15, length(mouse));
//     if(u_mouse.z == 1.) {
//       shade = smoothstep(.02 + abs(sin(u_time*10.) * .006), .0, length(mouse)); 
//     }
//     // if(mod(u_time, .1) >= .095) {
//     //   vec2 hash = hash2(vec2(u_time*2., sin(u_time*10.)))*3.-1.;
//     //   shade += smoothstep(.012, .0, length(uv-hash+.5));
//     // }
//     // shade -= (smoothstep(.185, .0, length(mouse))-shade)*2.;

//     vec4 texcol = fragcolour;

//     float d = shade * 2.;

//     float t = texture2D(u_buffer, sample-e.zy, 1.).x;
//     float r = texture2D(u_buffer, sample-e.xz, 1.).x;
//     float b = texture2D(u_buffer, sample+e.xz, 1.).x;
//     float l = texture2D(u_buffer, sample+e.zy, 1.).x;

//     // float t = texture2D(u_buffer, sample + vec2(0., -delta*ratio)).x;
//     // float r = texture2D(u_buffer, sample + vec2(delta, 0.)).x;
//     // float b = texture2D(u_buffer, sample + vec2(0., delta*ratio)).x;
//     // float l = texture2D(u_buffer, sample + vec2(-delta, 0.)).x;

//     // fragcolour = (fragcolour + t + r + b + l) / 5.;
//     d += -(texcol.y-.5)*2. + (t + r + b + l - 2.);
//     d *= .99;
//     d *= float(u_frame > 5);
//     d = d*.5+.5;

//     fragcolour = vec4(d, texcol.x, 0, 0);
    
//     return fragcolour;
//   }