const int MAX_SHAPES = 10;
vec2 spread = vec2(0.3, 0.3);
vec2 offset = vec2(0.0, 0.0);
float shapeSize = 0.3;
const float s = 1.0;
float shapeColors[MAX_SHAPES * 3] = float[MAX_SHAPES * 3] (
  s, 0.0, 0.0,
  0.0, s, 0.0,
  0.0, 0.0, s,
  s, 0.0, 0.0,
  s, 0.0, 0.0,
  s, 0.0, 0.0,
  s, 0.0, 0.0,
  s, 0.0, 0.0,
  s, 0.0, 0.0,
  s, 0.0, 0.0
);

vec2 motionFunction (float i) {
  float t = 0.; //iTime;

  return vec2(
    (cos(t * 0.31 + i * 3.0) + cos(t * 0.11 + i * 14.0) + cos(t * 0.78 + i * 30.0) + cos(t * 0.55 + i * 10.0)) / 4.0,
    (cos(t * 0.13 + i * 33.0) + cos(t * 0.66 + i * 38.0) + cos(t * 0.42 + i * 83.0) + cos(t * 0.9 + i * 29.0)) / 4.0
  );
}

float blend (float src, float dst, float alpha) {
  return alpha * src + (1.0 - alpha) * dst;
}

void mainImage (out vec4 fragColor, in vec2 fragCoord) {
    float aspect = u_resolution.x / u_resolution.y;
    float x = (fragCoord.x / u_resolution.x) - 0.5;
    float y = (fragCoord.y / u_resolution.y) - 0.5;
    vec2 pixel = vec2(x, y / aspect);

    vec4 totalColor = vec4(0.0, 0.0, 0.0, 0.0);
    for (int i = 0; i < MAX_SHAPES; i++) {
        if (i >= 3) {
            break;
        }

        vec2 shapeCenter = motionFunction(float(i));

        shapeCenter *= spread;
        shapeCenter += offset;
        float dx = shapeCenter.x - pixel.x;
        float dy = shapeCenter.y - pixel.y;
        float d = sqrt(dx * dx + dy * dy);
        float ratio = d / shapeSize;
        float intensity = smoothstep(1.0, 0.0, ratio); //1.0 - clamp(ratio, 0.0, 1.0);
        totalColor.x = totalColor.x + shapeColors[i * 3 + 0] * intensity;
        totalColor.y = totalColor.y + shapeColors[i * 3 + 1] * intensity;
        totalColor.z = totalColor.z + shapeColors[i * 3 + 2] * intensity;
        totalColor.w = totalColor.w + intensity;
    }

    float alpha = 1.0; //clamp(totalColor.w, 0.0, 1.0);
    float background = 0.0;
    fragColor = vec4(
        blend(totalColor.x, background, alpha),
        blend(totalColor.y, background, alpha),
        blend(totalColor.z, background, alpha),
        1.0
    );
}