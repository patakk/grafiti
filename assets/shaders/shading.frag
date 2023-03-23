#version 300 es
precision highp float;

in float v_Age;
in vec2 v_Seed;
in vec3 v_Color;
uniform float u_Colors;
uniform float u_Opacity;
uniform vec3 u_Tint1;
uniform vec3 u_Tint2;
uniform vec2 u_Resolution;

out vec4 o_FragColor;


const float pi = 3.14159265;

const float numBlurPixelsPerSide = 4.0;

float hash13(vec3 p3)
{
	p3  = fract(p3 * .1031);
    p3 += dot(p3, p3.zyx + 31.32);
    return fract((p3.x + p3.y) * p3.z);
}

float hash12(vec2 p)
{
	vec3 p3  = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

vec3 rgb2hsl(vec3 rgb) {
  vec3 hsl;
  float minVal = min(min(rgb.r, rgb.g), rgb.b);
  float maxVal = max(max(rgb.r, rgb.g), rgb.b);
  float delta = maxVal - minVal;
  hsl.z = (maxVal + minVal) / 2.0;
  if (delta == 0.0) {
    hsl.x = 0.0;
    hsl.y = 0.0;
  } else {
    if (hsl.z < 0.5) {
      hsl.y = delta / (maxVal + minVal);
    } else {
      hsl.y = delta / (2.0 - maxVal - minVal);
    }
    float deltaR = (((maxVal - rgb.r) / 6.0) + (delta / 2.0)) / delta;
    float deltaG = (((maxVal - rgb.g) / 6.0) + (delta / 2.0)) / delta;
    float deltaB = (((maxVal - rgb.b) / 6.0) + (delta / 2.0)) / delta;
    if (rgb.r == maxVal) {
      hsl.x = deltaB - deltaG;
    } else if (rgb.g == maxVal) {
      hsl.x = (1.0 / 3.0) + deltaR - deltaB;
    } else if (rgb.b == maxVal) {
      hsl.x = (2.0 / 3.0) + deltaG - deltaR;
    }
    if (hsl.x < 0.0) {
      hsl.x += 1.0;
    } else if (hsl.x > 1.0) {
      hsl.x -= 1.0;
    }
  }
  return hsl;
}

float noise (vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);

    // Four corners2D of a tile
    float a = hash12(i);
    float b = hash12(i + vec2(1.0, 0.0));
    float c = hash12(i + vec2(0.0, 1.0));
    float d = hash12(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

float noise3 (vec2 _st,float t) {
    vec2 i = floor(_st+t);
    vec2 f = fract(_st+t);

    // Four corners2D of a tile
    float a = hash12(i);
    float b = hash12(i + vec2(1.0, 0.0));
    float c = hash12(i + vec2(0.0, 1.0));
    float d = hash12(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define NUM_OCTAVES 8

float fbm (vec2 _st) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5),
                    -sin(0.5), cos(0.50));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(_st);
        _st = rot * _st * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

float fbm3 (vec2 _st, float t) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5),
                    -sin(0.5), cos(0.50));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise3(_st, t);
        _st = rot * _st * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}


vec3 random3(vec3 c) {
	float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));
	vec3 r;
	r.z = fract(512.0*j);
	j *= .125;
	r.x = fract(512.0*j);
	j *= .125;
	r.y = fract(512.0*j);
	return r-0.5;
}
/* skew constants for 3d simplex functions */
const float F3 =  0.3333333;
const float G3 =  0.1666667;

/* 3d simplex noise */
float simplex3d(vec3 p) {
	 /* 1. find current tetrahedron T and it's four vertices */
	 /* s, s+i1, s+i2, s+1.0 - absolute skewed (integer) coordinates of T vertices */
	 /* x, x1, x2, x3 - unskewed coordinates of p relative to each of T vertices*/
	 
	 /* calculate s and x */
	 vec3 s = floor(p + dot(p, vec3(F3)));
	 vec3 x = p - s + dot(s, vec3(G3));
	 
	 /* calculate i1 and i2 */
	 vec3 e = step(vec3(0.0), x - x.yzx);
	 vec3 i1 = e*(1.0 - e.zxy);
	 vec3 i2 = 1.0 - e.zxy*(1.0 - e);
	 	
	 /* x1, x2, x3 */
	 vec3 x1 = x - i1 + G3;
	 vec3 x2 = x - i2 + 2.0*G3;
	 vec3 x3 = x - 1.0 + 3.0*G3;
	 
	 /* 2. find four surflets and store themd */
	 vec4 w, d;
	 
	 /* calculate surflet weights */
	 w.x = dot(x, x);
	 w.y = dot(x1, x1);
	 w.z = dot(x2, x2);
	 w.w = dot(x3, x3);
	 
	 /* w fades from 0.6 at the center of the surflet to 0.0 at the margin */
	 w = max(0.6 - w, 0.0);
	 
	 /* calculate surflet components */
	 d.x = dot(random3(s), x);
	 d.y = dot(random3(s + i1), x1);
	 d.z = dot(random3(s + i2), x2);
	 d.w = dot(random3(s + 1.0), x3);
	 
	 /* multiply d by w^4 */
	 w *= w;
	 w *= w;
	 d *= w;
	 
	 /* 3. return the sum of the four surflets */
	 return dot(d, vec4(52.0));
}

/* const matrices for 3d rotation */
const mat3 rot1 = mat3(-0.37, 0.36, 0.85,-0.14,-0.93, 0.34,0.92, 0.01,0.4);
const mat3 rot2 = mat3(-0.55,-0.39, 0.74, 0.33,-0.91,-0.24,0.77, 0.12,0.63);
const mat3 rot3 = mat3(-0.71, 0.52,-0.47,-0.08,-0.72,-0.68,-0.7,-0.45,0.56);

/* directional artifacts can be reduced by rotating each octave */
float simplex3d_fractal(vec3 m) {
    return 0.5333333*simplex3d(m*rot1)
    +0.2666667*simplex3d(2.0*m*rot2)
    +0.1333333*simplex3d(4.0*m*rot3)
    +0.0666667*simplex3d(8.0*m);
}


float lightness(vec3 c){
    return c.r*0.2126 + c.g*0.7152 + c.b*0.0722;
}

float power(float p, float g) {
    if (p < 0.5)
        return 0.5 * pow(2.*p, g);
    else
        return 1. - 0.5 * pow(2.*(1. - p), g);
}

float map(float v, float v1, float v2, float v3, float v4) {
    return (v - v1) / (v2 - v1) * (v4 - v3) + v3;
}

float constrain(float v, float a, float b){
    float m1 = smoothstep(a, a+0.00001, v);
    float m2 = smoothstep(b-0.00001, b, v);
    return m1*m2*v;
}


/* From http://iquilezles.org/www/articles/palettes/palettes.htm */
vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{  return a + b*cos( 6.28318*(c*t+d) ); }

vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix( vec3(1.0), rgb, c.y);
}

void main() {
  vec4 magic = vec4(
    palette(v_Seed.y,
            vec3(1.0,0.25,0.5),
            vec3(0.5,0.5,0.5),
            vec3(1.0,0.7,0.8),
            vec3(0.0,0.15,0.40)),
            1.0)*.24;
  //if(v_Age > 100.)
  //  discard;
  //o_FragColor = vec4(0.0, 0.0, 0.0, .3*clamp(1. - v_Age/100., 0., 1.));

  //o_FragColor = vec4(0.0, 0.0, 0.0, 0. + .26*clamp(1. - v_Age/100., 0., 1.));

  vec2 pos = gl_PointCoord.xy - vec2(.5, .5);

  vec2 uv = (gl_FragCoord.xy - gl_PointCoord.xy*u_Resolution) + .5;

  float d = length(pos)*2.;

  float alpha = 1. - max(min(length(pos)*2., 1.), 0.);

  // float circle = smoothstep(.9, .2, d)*(1. - v_Age/344.);
  float circle = smoothstep(.9, .8, d);

  float bww = u_Colors*.8;
  vec4 outcol_bw = vec4(.0, .0, .0, u_Opacity);
  vec4 outcol_col = vec4(0.0, 0.0, 0.0, u_Opacity);

  float camp = clamp(1. - v_Age/100., 0., 1.);
  
  vec4 col0 = vec4(.6, .6, .64, 1.)*u_Opacity;
  vec4 col1 = vec4(.69, .73, 0.21, 1.)*(.5 + v_Seed.y*1.5)*u_Opacity;
  vec4 col2 = vec4(0.3, .33, .99, 1.)*(.5 + v_Seed.y*1.5)*u_Opacity;
    
  vec4 tc1 = vec4(u_Tint1, 1.)*(.5 + v_Seed.y*1.5)*u_Opacity;
  vec4 tc2 = vec4(u_Tint2, 1.)*(.5 + v_Seed.y*1.5)*u_Opacity;

  //if(v_Seed.y < 0.7)
  //  outcol_col = col0 + camp*(col1 - col0);
  //else
  //  outcol_col = col0 + camp*(col2 - col0);
  
  if(v_Seed.y < 0.7)
    outcol_col = col0 + camp*(tc1 - col0);
  else
    outcol_col = col0 + camp*(tc2 - col0);

   //outcol_col = (col0 + camp*(col2 - col0)) + power((0.5 + 0.5*sin(v_Seed.y*3.14*2.)), 6.)*((col0 + camp*(col1 - col0)) - (col0 + camp*(col2 - col0)));
   //outcol_col = (col0 + camp*(col2 - col0)) + power(v_Seed.y, 6.)*((col0 + camp*(col1 - col0)) - (col0 + camp*(col2 - col0)));

  vec4 outc = outcol_bw + u_Colors*(outcol_col - outcol_bw)-.4 + 3.8*v_Seed.y;
  outc.a = clamp(1. - v_Age/100., 0., 1.);
  // circle *=  1.-clamp(1. - v_Age/1334., 0., 1.);
  vec3 ccc = v_Color;
  // ccc = v_Color  + vec3(.1*sin(v_Seed.y*3.14*2.+v_Age/10.), .1*sin(v_Seed.y*3.14*3.2+v_Age/10.), .1*sin(v_Seed.y*3.14*4.5+v_Age/10.));
  // ccc = mix(ccc, vec3(.5,.5,.5), 1.-v_Age/1334.);
  o_FragColor = vec4((ccc.rgb + v_Seed.y*.29), 1.);
  float ddot = dot(gl_PointCoord-.5, vec2(.5))*.5+.5;

  float ph = noise(ccc.rb*1.41);
  ph = smoothstep(.19, .81, ph);
  float redtrans = pow(gl_PointCoord.y, 3.);
  vec3 redish = vec3(.07,.01,.0)*redtrans + (1.-redtrans)*vec3(.04,.0,.0);
  vec3 res = vec3(0.);
  res = ph*redish + res*(1.-ph);
  res = v_Color.rgb;

  o_FragColor = vec4(vec3(ph), 1.);
  o_FragColor = vec4(vec3(res+.3*power(ddot, 16.))*alpha, 1.*alpha);
}