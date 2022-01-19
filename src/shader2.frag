precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform sampler2D u_buffer;
uniform vec2 u_pos[2];
uniform vec3 u_color[2];
uniform float u_brightness;

// #define PI 3.141592653589793
// #define TAU 6.283185307179586

float dist(vec2 p0, vec2 p1){
    return sqrt((p1.x-p0.x)*(p1.x-p0.x)+(p1.y-p0.y)*(p1.y-p0.y));
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);
  vec2 sample = gl_FragCoord.xy / u_resolution.xy;
  sample.y = 1. - sample.y;
  // float ratio = u_resolution.x / u_resolution.y;
  vec2 mp = u_mouse.xy - uv;
  
  vec4 fragcolour = texture2D(u_buffer, sample);
  fragcolour = vec4(fragcolour.xyz, 1.);

  // float shade = smoothstep(0.25, .0, length(mouse));
  // fragcolour = texture2D(u_buffer, sample);
  
  // fragcolour = texture2D(u_buffer, sample + fragcolour.rb * .005);
  // fragcolour = vec4(fragcolour.x * fragcolour.x);
  vec4 bg = vec4(1.0,0.25,0.,1.);
  vec4 bg2 = bg*0.9;

  vec4 totalColor = vec4(0.0, 0.0, 0.0, 0.0);
  for(int i = 0; i < 2; i++){
    float d = dist(u_pos[i],uv);
    float md = 0.6 + (abs(u_pos[i].x))*0.15;
    float ratio = d / ((md) * 1.); //0.25;
    float intensity = smoothstep(1., 0.0, ratio) * 1.; //1.0 - clamp(ratio, 0.0, 1.0);
    totalColor.x = totalColor.x + u_color[i].x * intensity;
    totalColor.y = totalColor.y + u_color[i].y * intensity;
    totalColor.z = totalColor.z + u_color[i].z * intensity;
    totalColor.w = 1.;
  }

  vec4 final = vec4(
    totalColor.x,
    totalColor.y,
    totalColor.z,
    1.
  );

  vec4 black = vec4(vec3(0.0),0.);

  // fragcolour = vec4(fragcolour.x,fragcolour.y,0.,1.);

  final = mix(black, final, u_brightness);

  fragcolour = mix(fragcolour, final, fragcolour.x);

  fragcolour = mix(fragcolour, final, 0.5);

  // fragcolour = vec4(sample.x, sample.y, 0., 1.0);
  
  gl_FragColor = fragcolour;
}