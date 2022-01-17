precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_mouseDist;
// uniform float u_time;
uniform sampler2D u_buffer;
uniform vec2 u_pos[2];
uniform vec3 u_color[2];

#define PI 3.141592653589793
#define TAU 6.283185307179586

float delta = .00075; // + u_mouseDist;

float dist(vec2 p0, vec2 p1){
    return sqrt((p1.x-p0.x)*(p1.x-p0.x)+(p1.y-p0.y)*(p1.y-p0.y));
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);
  vec2 sample = gl_FragCoord.xy / u_resolution.xy;
  sample.y = 1. - sample.y;
  float ratio = u_resolution.x / u_resolution.y;
  
  vec2 mouse = u_mouse.xy - uv;
  
  vec4 fragcolour = texture2D(u_buffer, vec2(sample.x, sample.y));

  float dis = u_mouseDist;
  // dis = 1.;
  
  // float d = 1. - smoothstep(.1, .15, length(mouse));
  float d = smoothstep(dis * .035, .0, length(mouse));
  // d += (smoothstep(.185, .0, length(mouse))-d)*2.;
  
  vec4 texcol = fragcolour;
  
  float t = texture2D(u_buffer, sample + vec2(0., -delta*ratio)).x;
  float r = texture2D(u_buffer, sample + vec2(delta, 0.)).x;
  float b = texture2D(u_buffer, sample + vec2(0., delta*ratio)).x;
  float l = texture2D(u_buffer, sample + vec2(-delta, 0.)).x;
  
  // fragcolour = (fragcolour + t + r + b + l) / 5.;
  d += -(texcol.y-.5)*2.0025 + (t + r + b + l - 2.025);
  // d *= .99;
  // d*= 1.1;
  // d *= float(2>=2); // clear the buffer at iFrame < 2 //u_frame
  d = d*.5+.5;
  
  fragcolour = vec4(d, texcol.x, texcol.x, 1.);
  // fragcolour = vec4(uv.x,uv.y,0.,1.);

  gl_FragColor = fragcolour ;
}