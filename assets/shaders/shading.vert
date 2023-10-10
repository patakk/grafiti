#version 300 es
precision highp float;

uniform vec2 u_Resolution;
uniform float u_Opacity;
uniform float u_Scale;

in vec2 i_Position;
in float i_Age;
in vec2 i_Seed;
in vec3 i_Color;
in vec2 i_Velocity;
uniform sampler2D u_InputImage;

out float v_Age;
out vec2 v_Seed;
out vec3 v_Color;

void main() {
  v_Age = i_Age;
  v_Seed = i_Seed;
  v_Color = i_Color;
  vec2 pos = i_Position/u_Resolution*2.0 - 1.0;
  //gl_PointSize = 1.0 + 6.0 * (1.0 - i_Age/i_Seed);

  float ps = i_Seed.x;
  if(ps < 0.998){
    ps = .5+.514*ps;
  }
  else{
    ps = .5 + .5*ps;
  }
  vec2 tc = i_Position/u_Resolution;
  tc.y = 1. - tc.y;
	float texcol = 1. - texture(u_InputImage, tc).r;
  //gl_PointSize = 3.*texcol;

  gl_PointSize = 4. - 3.*v_Age/344.;
  gl_PointSize = (2. + 8.*pow(i_Seed.y, 4.)) + 4.*smoothstep(.9985, .9999999, i_Seed.x);
  gl_PointSize *= 1.02;
  gl_PointSize *= .7 * u_Scale * (1.+length(i_Velocity)/3500.);
  // gl_PointSize *= 1.25;
  v_Color = v_Color * (1. - .6*smoothstep(.9985, .9999999, i_Seed.x));

  // float lele = length(i_Velocity)/40.;
  // lele = clamp(lele, 0.1, 1.1)-.1;
  // gl_PointSize *= lele;

  // if(i_Age > 20.){
  //   gl_PointSize *= 1.-(i_Age-20.)/20.;
  // }
  // if(i_Age > 40.){
  //   gl_PointSize *= 0.;
  // }

  //gl_PointSize = 50. - 49.*smoothstep(30.0, 31.0, v_Age);
  gl_Position = vec4(pos, 0.0, 1.0);
}