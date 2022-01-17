precision highp float;

varying vec2 vTexCoord;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform sampler2D u_text;

float dist(vec2 p0, vec2 p1){
    return sqrt((p1.x-p0.x)*(p1.x-p0.x)+(p1.y-p0.y)*(p1.y-p0.y));
}

vec3 rgb(float r, float g, float b){
  return vec3(r / 255.0, g / 255.0, b / 255.0);
}

void main() {

    vec2 uv = vTexCoord;
    uv.y = 1.0 - uv.y;

    vec4 color = texture2D(u_text, uv);

    vec2 coord = gl_FragCoord.xy/u_resolution;
    coord -= 0.5; // <-0.5,0.5>
    // coord.y *= u_resolution.y/u_resolution.x; // fix aspect ratio

    //flip mouse Y
    vec2 mp = u_mouse / u_resolution;
    mp.y = 1. - mp.y;

    float mdist = smoothstep(0.5, 0.0, dist(coord+vec2(0.5),mp)*2.);
    vec4 final = mix(vec4(color), vec4(vec3(1.0), 1.0), mdist);


    gl_FragColor=vec4(final);
}

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