#version 300 es
precision highp float;

uniform vec2 u_Resolution;
uniform float u_Opacity;

in vec2 i_Position;
in float i_Age;
in vec2 i_Seed;
in vec3 i_Color;
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
  gl_PointSize = (2. + 4.*i_Seed.y) + 4.*smoothstep(.9985, .9999999, i_Seed.x);
  gl_PointSize *= 1.1;
  v_Color = v_Color * (1. - .6*smoothstep(.9985, .9999999, i_Seed.x));
  // if(i_Age < 10.){
  //   gl_PointSize = 250.;
  // }
  //gl_PointSize = 50. - 49.*smoothstep(30.0, 31.0, v_Age);
  gl_Position = vec4(pos, 0.0, 1.0);
}