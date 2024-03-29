#version 300 es
precision highp float;

uniform float u_Time;
uniform vec2 u_Gravity;
uniform vec2 u_Origin1;
uniform vec2 u_Origin2;
uniform vec2 u_Origin3;
uniform vec2 u_Origin4;
uniform vec2 u_Origin5;
uniform sampler2D u_InputImage;
uniform float u_Speed;
uniform float u_Angle;
uniform float u_RepelForce;

uniform vec2 u_Resolution;

in vec2 i_Position;
in vec3 i_Color;
in float i_Age;
in vec2 i_Seed;
in vec2 i_Velocity;

out vec2 v_Position;
out vec3 v_Color;
out float v_Age;
out vec2 v_Seed;
out vec2 v_Velocity;


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
	 
	 /* 2. find four surflets and store them in d */
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
    return   0.5333333*simplex3d(m*rot1)
			+0.2666667*simplex3d(2.0*m*rot2)
			+0.1333333*simplex3d(4.0*m*rot3)
			+0.0666667*simplex3d(8.0*m);
}

float power(float p, float g) {
    if (p < 0.5)
        return 0.5 * pow(2.*p, g);
    else
        return 1. - 0.5 * pow(2.*(1. - p), g);
}

float lightness(vec3 col){
	return col[0]*0.2126 + col[1]*0.7152 + col[2]*0.0722;
}

void main() {
	
   vec2 pos = i_Position;
   vec2 vel = i_Velocity;
   vec2 acc = vec2(0., 0.);
   vec2 seed = i_Seed;
   vec2 resolution = u_Resolution;

   vec2 mouse_1 = vec2(u_Origin1.x, resolution.y-u_Origin1.y);
   vec2 mouse_2 = vec2(u_Origin2.x, resolution.y-u_Origin2.y);
   vec2 mouse_3 = vec2(u_Origin3.x, resolution.y-u_Origin3.y);
   vec2 mouse_4 = vec2(u_Origin4.x, resolution.y-u_Origin4.y);
   vec2 mouse_5 = vec2(u_Origin5.x, resolution.y-u_Origin5.y);

   float speed = u_Speed;
   float time = u_Time;

	ivec2 ipos = ivec2(int(pos.x), int(pos.y));
	vec2 tc =  pos.xy/resolution.xy;
	tc.y = 1. - tc.y;
	float texcol = lightness(texture(u_InputImage, tc).rgb);
	vec3 tex = texture(u_InputImage, tc).rgb;

	float tttime = time*0.0015 + pos.x/resolution.x;
	tttime = mod(tttime, 1.0);
	tttime = pow(tttime, 5.);
   	tttime = 0.0;
	float ttime = floor(time) + tttime;
	vec2 posss = pos.xy/resolution.x;
	vec3 nzpp = vec3(posss.x, posss.y, ttime*0.02);
	float incx = clamp(4. + round(power(simplex3d(nzpp+vec3(0.2589, 0.4891, 1.131)), 4.)*34.), 2., 34.);
	float incy = clamp(4. + round(power(simplex3d(nzpp+vec3(3.2589, 0.4891, 44.131)), 4.)*34.), 2., 34.);
	vec2 poss = pos.xy/resolution.x;
   incx = 1. + 7. * power(clamp(simplex3d_fractal(vec3(mod(time*3., 1000.0)*0.001 + pos.y/resolution.y*.06)), -1., 1.)/2.+.5, 4.);
   incy = 1. + 2. * power(clamp(simplex3d_fractal(vec3(mod(time*3., 1000.0)*0.001 + pos.x/resolution.x*.03 + .41)), -1., 1.)/2.+.5, 4.);
   float incxx = 1. + 1. * power(clamp(simplex3d_fractal(vec3(mod(time*3., 1000.0)*0.001 + pos.y/resolution.y*.06 + .1251)), -1., 1.)/2.+.5, 4.);
   float incyy = 1. + 2. * power(clamp(simplex3d_fractal(vec3(mod(time*3., 1000.0)*0.001 + pos.y/resolution.y*.06+ .8888)), -1., 1.)/2.+.5, 4.);
	poss.x = round(incx*poss.x)/incx + round(incxx)*0.;
	poss.y = round(incy*poss.y)/incy + round(incyy)*.0;
	vec3 nzp = vec3(poss.x, poss.y, ttime*0.002)*2.;
   vec2 noisexy = vec2(0., 0.);
   float qq = clamp(simplex3d(nzp*0.5+vec3(0.2589, 0.4891, 5.1311)), -1.0, 1.0);

   float r = .6;
   if(length(pos.xy/resolution.xy-.5) < 0.1){
      //r *= 4.;
   }

   float ang = 17.*simplex3d(nzp*0.0527*qq);
   float ang2 = 47.*simplex3d(nzp*0.0527*qq);
   //ang = 66.*simplex3d(nzp*.527*qq + time*0.02);


   noisexy.x = r*cos(ang)*.00032 + 0.0*r*cos(ang2);
   noisexy.y = r*sin(ang)*.00032 + 0.0*r*sin(ang2);
   
	// noisexy.x = 1.;
	// noisexy.y = 0.;
   noisexy.x += 0.0*(-1. + 2.*random3(vec3(seed.x)).x);
   noisexy.y += 0.0*(-1. + 2.*random3(vec3(seed.y)).y);

	float maxmouse = resolution.x*u_RepelForce*0.03*.5;
	maxmouse = resolution.x*0.03*1.2;
	
	vec2 possn_1 = pos;
	float angle = simplex3d(vec3(mouse_1.xy*0.0000+13.42, time*0.0018))*3.1415926535897932384626433832795*2.0;
	angle = u_Angle;
	possn_1 -= mouse_1;
	possn_1 = vec2(possn_1.x*cos(angle) - possn_1.y*sin(angle), possn_1.x*sin(angle) + possn_1.y*cos(angle));
	possn_1.y *= 2.1;
	possn_1.x += 30.*simplex3d(vec3(pos.xy*0.01+313.42, time*0.01));
	possn_1.y += 30.*simplex3d(vec3(pos.xy*0.01, time*0.01));
	possn_1 += mouse_1;
	vec2 fromMouse_1 = pos - mouse_1;
	vec2 fromMouse_11 = possn_1 - mouse_1;
	float tomouselen_1 = length(fromMouse_1);
	float tomouselen_11 = length(fromMouse_11);
	// if(abs(fromMouse_11.x)*2. < maxmouse && abs(fromMouse_11.y)*2. < maxmouse){
	if(tomouselen_11 < maxmouse){
		fromMouse_1 = fromMouse_1 / tomouselen_1; // normalized
		// fromMouse_1 = fromMouse_1 * (1. - power(tomouselen_1/maxmouse, 3.)); 
		fromMouse_1 *= 60. + 0.*360.* simplex3d(vec3(pos.xy*0.04, time*0.01));
		// fromMouse_1 *= 260. + 0.*360.* simplex3d(vec3(pos.xy*0.04, time*0.01));
		 if(mod(tomouselen_11, 4.) < .6){fromMouse_1 *= 0.;}
	}
	else{fromMouse_1 = vec2(0.0);}
	
	vec2 possn_2 = pos;
	possn_2 -= mouse_2;
	possn_2 = vec2(possn_2.x*cos(angle) - possn_2.y*sin(angle), possn_2.x*sin(angle) + possn_2.y*cos(angle));
	possn_2.x *= 2.1;
	possn_2.x += 30.*simplex3d(vec3(pos.xy*0.01+313.42, time*0.01));
	possn_2.y += 30.*simplex3d(vec3(pos.xy*0.01, time*0.01));
	possn_2 += mouse_2;
	vec2 fromMouse_2 = possn_2 - mouse_2;
	float tomouselen_2 = length(fromMouse_2);
	if(tomouselen_2 < maxmouse){
		fromMouse_2 = fromMouse_2 / tomouselen_2; // normalized
		// fromMouse_2 = fromMouse_2 * (1. - tomouselen_2/maxmouse); 
		fromMouse_2 *=  60. + 0.*360.* simplex3d(vec3(pos.xy*0.04, time*0.01));
		if(mod(tomouselen_2, 6.) < 6.0/2.){fromMouse_2 *= 0.;}
	}
	else{fromMouse_2 = vec2(0.0);}
	
	vec2 possn_3 = pos;
	possn_3 -= mouse_3;
	possn_3 = vec2(possn_3.x*cos(angle) - possn_3.y*sin(angle), possn_3.x*sin(angle) + possn_3.y*cos(angle));
	possn_3.x *= 2.1;
	possn_3.x += 30.*simplex3d(vec3(pos.xy*0.01+313.42, time*0.01));
	possn_3.y += 30.*simplex3d(vec3(pos.xy*0.01, time*0.01));
	possn_3 += mouse_3;
	vec2 fromMouse_3 = possn_3 - mouse_3;
	float tomouselen_3 = length(fromMouse_3);
	if(tomouselen_3 < maxmouse){
		fromMouse_3 = fromMouse_3 / tomouselen_3; // normalized
		// fromMouse_3 = fromMouse_3 * (1. - tomouselen_3/maxmouse); 
		fromMouse_3 *=  60. + 0.*360.* simplex3d(vec3(pos.xy*0.04, time*0.01));
		if(mod(tomouselen_3, 6.) < 6.0/2.){fromMouse_3 *= 0.;}
	}
	else{fromMouse_3 = vec2(0.0);}
	
	vec2 possn_4 = pos;
	possn_4 -= mouse_4;
	possn_4 = vec2(possn_4.x*cos(angle) - possn_4.y*sin(angle), possn_4.x*sin(angle) + possn_4.y*cos(angle));
	possn_4.x *= 2.1;
	possn_4.x += 30.*simplex3d(vec3(pos.xy*0.01+313.42, time*0.01));
	possn_4.y += 30.*simplex3d(vec3(pos.xy*0.01, time*0.01));
	possn_4 += mouse_4;
	vec2 fromMouse_4 = possn_4 - mouse_4;
	float tomouselen_4 = length(fromMouse_4);
	if(tomouselen_4 < maxmouse){
		fromMouse_4 = fromMouse_4 / tomouselen_4; // normalized
		// fromMouse_4 = fromMouse_4 * (1. - tomouselen_4/maxmouse); 
		fromMouse_4 *=  60. + 0.*360.* simplex3d(vec3(pos.xy*0.04, time*0.01));
		if(mod(tomouselen_4, 6.) < 6.0/2.){fromMouse_4 *= 0.;}
	}
	else{fromMouse_4 = vec2(0.0);}
	
	vec2 possn_5 = pos;
	possn_5 -= mouse_5;
	possn_5 = vec2(possn_5.x*cos(angle) - possn_5.y*sin(angle), possn_5.x*sin(angle) + possn_5.y*cos(angle));
	possn_5.x *= 2.1;
	possn_5.x += 30.*simplex3d(vec3(pos.xy*0.01+313.42, time*0.01));
	possn_5.y += 30.*simplex3d(vec3(pos.xy*0.01, time*0.01));
	possn_5 += mouse_5;
	vec2 fromMouse_5 = possn_5 - mouse_5;
	float tomouselen_5 = length(fromMouse_5);
	if(tomouselen_5 < maxmouse){
		fromMouse_5 = fromMouse_5 / tomouselen_5; // normalized
		// fromMouse_5 = fromMouse_5 * (1. - tomouselen_5/maxmouse); 
		fromMouse_5 *=  60. + 0.*360.* simplex3d(vec3(pos.xy*0.04, time*0.01));
		if(mod(tomouselen_5, 6.) < 6.-1.){fromMouse_5 *= 0.;}
	}
	else{fromMouse_5 = vec2(0.0);}

	ivec2 noise_coord = ivec2(int(pos.x), int(pos.y));

	vec2 fromMouse = fromMouse_1 + fromMouse_2 + fromMouse_3 + fromMouse_4 + fromMouse_5;

   acc.x = -noisexy.x + fromMouse.x*9. + 0.*u_Gravity.x;
   acc.y = noisexy.y + fromMouse.y*9. + 0.*u_Gravity.y;

   float pp = .97;
   float brd = 0.;
   if(pos.x > resolution.x - brd){
		acc += vec2(-35., 0.);
		// pos.x = pos.x - (resolution.x-2.*brd);
   }
   if(pos.y > resolution.y - brd){
		acc += vec2(0., -35.);
		// pos.y = pos.y - (resolution.y-2.*brd);
   }
   if(pos.x < brd){
		acc += vec2(+35., 0.);
		// pos.x = pos.x + (resolution.x-2.*brd);
   }
   if(pos.y < brd){
		acc += vec2(0., +35.);
		// pos.y = pos.y + (resolution.y-2.*brd);
   }

   float drag = 0.4 + 0.425 * i_Seed.y;
//    drag = 0.5 + .4 * i_Seed.y;
   drag = drag  - (.5-abs(texcol-.5))*1.05;
//    drag = drag  - texcol*.7;
//    drag = 1. - drag;


   //vel = vel + acc*1.05;
   vel = vel + .0*vec2(1.,1.)+acc*.991;
   vel = vel * drag;

   vec3 col = i_Color;
   if(i_Age < 13.0 || length(vel*speed) < .5 || texcol > 1110.3){
   	//col = tex.rgb;
   }
//    if(i_Seed.y < .99)
//    	col = vec3(0.);
//    if(mod(i_Age, 10.0) < .99){
//    	col = tex.rgb;
//    }
   
   pos = pos + vel*speed;
   
   //age += u_TimeDelta;

   v_Age = i_Age + 1.0;
   if(texcol > 0.1){
	//   v_Age = 0.0;
   }

   if(length(vel) > 0.1){
	   v_Age = 0.0;
   };
//    float pp = .8;
//    if(pos.x >= resolution.x*(.5 + pp/2.)){
// 		//pos.x = pos.x - resolution.x*pp;
// 		vel.x = -vel.x;
// 		pos += vel*2.*speed;
// 		// v_Age = 11110.0;
//    }
//    if(pos.y > resolution.y*(.5 + pp/2.)){
// 		//pos.y = pos.y - resolution.y*pp;
// 		vel.y = -vel.y;
// 		pos += vel*2.*speed;
// 		// v_Age = 11110.0;
//    }
//    if(pos.x < resolution.x*(.5 - pp/2.)){
// 		//pos.x = pos.x + resolution.x*pp;
// 		vel.x = -vel.x;
// 		pos += vel*2.*speed;
// 		// v_Age = 11110.0;
//    }
//    if(pos.y < resolution.y*(.5 - pp/2.)){
// 		//pos.y = pos.y + resolution.y*pp;
// 		vel.y = -vel.y;
// 		pos += vel*2.*speed;
// 		// v_Age = 11110.0;
//    }

//    col = vec3(0., 0., 0.);
//    col = vec3(smoothstep(.4,.5,tomouselen/resolution.x));

 

   v_Position = pos;
   v_Velocity = vel;
   v_Seed = i_Seed;
   v_Color = col;
}
