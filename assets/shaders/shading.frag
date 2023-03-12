#version 300 es
precision highp float;

in float v_Age;
in vec2 v_Seed;
in vec3 v_Color;
uniform float u_Colors;
uniform float u_Opacity;
uniform vec3 u_Tint1;
uniform vec3 u_Tint2;

out vec4 o_FragColor;

float power(float p, float g) {
    if (p < 0.5)
        return 0.5 * pow(2.*p, g);
    else
        return 1. - 0.5 * pow(2.*(1. - p), g);
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

  float d = length(pos)*2.;

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
  o_FragColor = vec4((ccc.rgb + v_Seed.y*.29)*(circle), circle);
}