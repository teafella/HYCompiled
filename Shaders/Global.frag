precision mediump float;

uniform vec2 resolution;
uniform vec2 resolution_step;

uniform float pot0;
uniform float pot1;
uniform float pot2;
uniform float pot3;
uniform float pot4;
uniform float pot5;
uniform float pot6;
uniform float pot7;
uniform float pot8;
uniform float pot9;

uniform float cv0;
uniform float cv1;
uniform float cv2;
uniform float cv3;
uniform float cv4;
uniform float cv5;
uniform float cv6;
uniform float cv7;
uniform float cv8;
uniform float cv9;

//joysticks raw
uniform vec2 joy0;
uniform vec2 joy1;

uniform mat3 mod_matrix;

//palette colors
uniform vec3 color0;
uniform vec3 color1;
uniform vec3 color2;

uniform int button0;
uniform int button1;
uniform int button2;
uniform int button3;
uniform int button4;
uniform int button5;
uniform int button6;
uniform int button7;
uniform int button8;
uniform int button9;
uniform int button10;
uniform int button11;
uniform int button12;
uniform int button13;
uniform int button14;
uniform int button15;
uniform int button16;
uniform int button17;
uniform int button18;
uniform int button19;
uniform int button20;
uniform int button21;
uniform int button22;
uniform int button23;
uniform int button24;
uniform int button25;

//alt pots
uniform float alt_pot_0_0;
uniform float alt_pot_0_2;


uniform float alt_pot_1_0;
uniform float alt_pot_1_2;

uniform float alt_pot_2_0;
uniform float alt_pot_2_2;

//preset_pot
uniform float preset_pot_1_0;
uniform float preset_pot_1_1;
uniform float preset_pot_1_2;
uniform float preset_pot_1_3;
uniform float preset_pot_1_4;
uniform float preset_pot_1_5;
uniform float preset_pot_1_6;
uniform float preset_pot_1_7;

varying vec2 tcoord;
uniform float time;

#define PI 3.14159265358979323846
#define TWO_PI 6.28318530718

//Layer Input Vars

// uniform float mirror_amt;
// uniform float axis_rotation;


// vec2 test(vec2 in){
// 	return 0.;
// }

//////////////////////////////////////////////////////////////////////
// sRGB color transform and inverse from 
// https://bottosson.github.io/posts/colorwrong/#what-can-we-do%3F

vec3 srgb_from_linear_srgb(vec3 x) {

    vec3 xlo = 12.92*x;
    vec3 xhi = 1.055 * pow(x, vec3(0.4166666666666667)) - 0.055;
    
    return mix(xlo, xhi, step(vec3(0.0031308), x));

}

vec3 linear_srgb_from_srgb(vec3 x) {

    vec3 xlo = x / 12.92;
    vec3 xhi = pow((x + 0.055)/(1.055), vec3(2.4));
    
    return mix(xlo, xhi, step(vec3(0.04045), x));

}

//////////////////////////////////////////////////////////////////////
// oklab transform and inverse from
// https://bottosson.github.io/posts/oklab/


const mat3 fwdA = mat3(1.0, 1.0, 1.0,
                       0.3963377774, -0.1055613458, -0.0894841775,
                       0.2158037573, -0.0638541728, -1.2914855480);
                       
const mat3 fwdB = mat3(4.0767245293, -1.2681437731, -0.0041119885,
                       -3.3072168827, 2.6093323231, -0.7034763098,
                       0.2307590544, -0.3411344290,  1.7068625689);

const mat3 invB = mat3(0.4121656120, 0.2118591070, 0.0883097947,
                       0.5362752080, 0.6807189584, 0.2818474174,
                       0.0514575653, 0.1074065790, 0.6302613616);
                       
const mat3 invA = mat3(0.2104542553, 1.9779984951, 0.0259040371,
                       0.7936177850, -2.4285922050, 0.7827717662,
                       -0.0040720468, 0.4505937099, -0.8086757660);

vec3 oklab_from_linear_srgb(vec3 c) {

    vec3 lms = invB * c;
            
    return invA * (sign(lms)*pow(abs(lms), vec3(0.3333333333333)));
    
}

vec3 linear_srgb_from_oklab(vec3 c) {

    vec3 lms = fwdA * c;
    
    return fwdB * (lms * lms * lms);
    
}

//////////////////////////////////////////////////////////////////////

// --------ASPECT RATIO-----------------------------------------|
vec2 CorrectAspectRatio(vec2 st){
	float aspect_x = (resolution.x / resolution.y);
	st.x *= aspect_x;
	st.x -= (aspect_x - 1. )/2.;
	return st;
}
//Attn: when using textures that are not thesame size as context you may need to pass context res and use below function overload
vec2 CorrectAspectRatio(vec2 st, vec2 this_resolution){
	float aspect_x = this_resolution.x / this_resolution.y;
	st.x *= aspect_x;
	st.x -= (aspect_x - 1. )/2.;
	return st;
}

vec2 CorrectAspectRatio(vec2 st, vec2 this_resolution, float aspect_nudge){ //expects 0-1 on aspect nudge
	float aspect_x = this_resolution.x / this_resolution.y + ((1.0 - aspect_nudge) *1.5);
	st.x *= aspect_x;
	st.x -= (aspect_x - 1. )/2.;
	return st;
}
float CorrectAspectRatio(float st, float aspect_scalar){
	float aspect_nudge = aspect_scalar;
	st *= aspect_nudge;
	st -= (aspect_nudge - 1. )/2.;
	return st;
}

vec2 RectifyAspectRatio(vec2 st){
	float aspect_x = resolution.x / resolution.y;
	st.x += (aspect_x - 1. )/2.;
	st.x /= aspect_x;
	return st;
}
//Attn: when using textures that are not thesame size as context you may need to pass context res and use below function overload 
vec2 RectifyAspectRatio(vec2 st, vec2 this_resolution){
	float aspect_x = this_resolution.x / this_resolution.y;
	st.x += (aspect_x - 1. )/2.;
	st.x /= aspect_x;
	return st;
}

vec2 RectifyAspectRatio(vec2 st, vec2 this_resolution, float aspect_nudge){
	float aspect_x = this_resolution.x / this_resolution.y + ((1.0 - aspect_nudge) *1.5);
	st.x += (aspect_x - 1. )/2.;
	st.x /= aspect_x;
	return st;
}

float RectifyAspectRatio(float st, float aspect_scalar){
	float aspect_nudge = aspect_scalar;
	st += (aspect_nudge - 1. )/2.;
	st /= aspect_nudge;
	return st;
}



mat2 getRotationMatrix(float _angle) {
	return mat2(cos(_angle), -sin(_angle),
	            sin(_angle), cos(_angle));
}



vec2 rotate2D(vec2 _st, float _angle) {
	_st -= 0.5;
	_st =  mat2(cos(_angle), -sin(_angle),
	            sin(_angle), cos(_angle)) * _st;
	_st += 0.5;
	return _st;
}

vec2 rotate2D(vec2 _st, mat2 rotation_matrix ) {
	_st -= 0.5;
	_st *= rotation_matrix;
	_st += 0.5;
	return _st;
}

mat2 scale(vec2 _scale) {
	return mat2(_scale.x, 0.0,
	            0.0, _scale.y);
}

vec2 toPolar(vec2 st) { // Outputs distance 0 to 1 and Thet
	st = st * 2. - 1.;

	// Angle and radius from the current pixel
	float ang = ( atan(st.y, st.x) + PI ) / TWO_PI; // angle is scaled so you can use this to address stuff and be more shader like
	float rad = sqrt(dot(st, st)) ;

	st = vec2(ang, rad );

	return st;
}

//------Base Screen Scan for All Shapes-------|
vec2 getScan2D(vec2 position){
	return position * 2. -1.;
}
vec2 getScan2D(vec2 position, float polar) {
	vec2 ret;
	if(polar > .007){
		vec2 polarPos = toPolar(position) ;
		polarPos = vec2(polarPos.y);
		ret = mix( position, polarPos , polar ) ;
	}
	else{
		ret = position;
	}
	ret = ret * 2. - 1.;
	return ret;
}

vec2 getScan2DFlipped(vec2 position, float polar) {

	vec2 polarPos = toPolar(position) ;
	polarPos = vec2( sin((polarPos.x ) * PI)  , polarPos.y  );

	vec2 ret = mix( position, polarPos , polar);
	return ret;
}




// Color Space Conversion \-----------------------------|
vec3 rgb2hsv(vec3 c)
{
	vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
	vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
	vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

	float d = q.x - min(q.w, q.y);
	float e = 1.0e-10;
	return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c)
{
	vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
	vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
	return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float luma(vec3 color) {
	return dot(color, vec3(0.299, 0.587, 0.114));
}

float luma(vec4 color) {
	return dot(color.rgb, vec3(0.299, 0.587, 0.114));
}

float okLuma(vec3 color) { //luminance based on okLab
	return oklab_from_linear_srgb(linear_srgb_from_srgb(color)).x;
}

vec3 ColorClamp(vec3 color) {
	// float color_mag = abs(length(color ) );
	// float color_clamp = (step(1., color_mag ) );
	// color = mix( color , normalize(color)  , color_clamp  );
	return color;
}


vec3 InvertColor(vec3 color) {
	return vec3(1.0 - color.r,1.0 -color.g,1.0 -color.b); 
}

vec3 HSVRecolor(vec3 color, float hue_shift, float saturation) {
	color = rgb2hsv(color);
	color.x = color.x + hue_shift;
	color.y = color.y * (saturation);
	color = hsv2rgb(color);
	return color;
}

// vec3 LabRecolor(vec3 color, float hue_shift, float saturation) {
// 	color = oklab_from_linear_srgb(linear_srgb_from_srgb(color));
	
// 	color.x = color.x + hue_shift;
// 	color.y = color.y * (saturation);
// 	color = hsv2rgb(color);
// 	return color;
// }

// Noise and random \-----------------------------|

float random (float x) {
	return fract(sin(x) * 1e4);
}

float random (in vec2 st) {
	return fract(sin(dot(st.xy,
	                     vec2(12.9898, 78.233))) *
	             43758.5453123);
}

float noise (in vec2 st) {
	vec2 i = floor(st);
	vec2 f = fract(st);

	// Four corners in 2D of a tile
	float a = random(i);
	float b = random(i + vec2(1.0, 0.0));
	float c = random(i + vec2(0.0, 1.0));
	float d = random(i + vec2(1.0, 1.0));

	vec2 u = f * f * (3.0 - 2.0 * f);

	return mix(a, b, u.x) +
	       (c - a) * u.y * (1.0 - u.x) +
	       (d - b) * u.x * u.y;
}

float PHI = 1.61803398874989484820459;  // Φ = Golden Ratio   

float gold_noise(vec2 xy){
	float seed = 123.;
    return fract(tan(distance(xy*PHI, xy))*xy.x);
}

float gold_gradient_value_noise(vec2 st) {
	vec2 i = floor(st);
	vec2 f = fract(st);

	// Four corners in 2D of a tile
	float a = gold_noise(i);
	float b = gold_noise(i + vec2(1.0, 0.0));
	float c = gold_noise(i + vec2(0.0, 1.0));
	float d = gold_noise(i + vec2(1.0, 1.0));

	vec2 u = f * f * (3.0 - 2.0 * f);

	return mix(a, b, u.x) +
	       (c - a) * u.y * (1.0 - u.x) +
	       (d - b) * u.x * u.y;
}


vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                        0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                        -0.577350269189626,  // -1.0 + 2.0 * C.x
                        0.024390243902439); // 1.0 / 41.0

float snoise(vec2 v) {
    
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i); // Avoid truncation effects in permutation
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));

    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}



// mat3 rotateX(float a) {
// 	return mat3(
// 	           1.0, 0.0, 0.0,
// 	           0.0, cos(a), sin(a),
// 	           0.0, -sin(a), cos(a)
// 	       );
// }

// mat3 rotateY(float a) {
// 	return mat3(
// 	           cos(a), 0.0, sin(a),
// 	           0.0, 1.0, 0.0,
// 	           -sin(a), 0.0, cos(a)
// 	       );
// }
float HexDist(vec2 p) {
	p = abs(p);

	float c = dot(p, normalize(vec2(1, 1.73)));
	c = max(c, p.x);

	return c;
}

vec4 HexCoords(vec2 uv) {
	vec2 r = vec2(1, 1.73);
	vec2 h = r * .5;

	vec2 a = mod(uv, r) - h;
	vec2 b = mod(uv - h, r) - h;

	vec2 gv = dot(a, a) < dot(b, b) ? a : b;

	float x = atan(gv.x, gv.y);
	float y = .5 - HexDist(gv);
	vec2 id = uv - gv;
	return vec4(x, y, id.x, id.y);
}

vec2 mirror(vec2 st, float cv) {
	// rot = (1. - rot) *1.02 ;

	if (cv > 0.6) {
		// st = rotate2D(st, TWO_PI*rot );
		// st.x = abs(st.x * 2. - 1.);
		// st.y = abs(st.y * 2. - 1.);
		// st.x = st.x;
		// st.x = fract(st.x*4.);

		// st *= 2.;

		// vec2 r = vec2(1, 1.73);
		//    vec2 h = r * .5;

		//    vec2 a = abs(mod(st, r)-h);
		//    vec2 b = abs(mod(st-h, r)-h);

		//    vec2 gv = dot(a, a) < dot(b,b) ? a : b;

		//    vec2 id = st - gv;
		//    st = gv;
		//    st += .5;

	}
	else if (cv > 0.5) {

		// st.y =  abs(st.y * 2. - 1.);
		// st.y = st.y/2.;
		// st.y += .365;
		// st *= 3.;

		// vec2 r = vec2(1, 1.73);
		//    vec2 h = r * .5;

		//    vec2 a = mod(st, r)-h;
		//    vec2 b = mod(st-h, r)-h;

		//    vec2 gv = dot(a, a) < dot(b,b) ? a : b;

		//    vec2 id = st - gv;
		//    // id.y -= 2.;

		//    id.x *= 2.;

		//    gv.x =(HexDist(gv));


		//    if( mod(floor(id.x), 2.)  == 1. ){
		//    	// gv.y = gv.y;
		//    	// gv *= 10.;
		//    	gv.x = 1.-gv.x;
		//    	// gv.x = 0.5 - HexDist(st);
		//    	gv.y = abs(1.-gv.y);
		//    }
		//    // gv.y =atan(gv.x, gv.y);

		//    st = gv;


	}
	else if (cv > 0.4) {
		//    st.y += .365;
		// st *= 1.;

		// vec2 r = vec2(1, 1.73);
		//    vec2 h = r * .5;

		//    vec2 a = mod(st, r)-h;
		//    vec2 b = mod(st-h, r)-h;

		//    vec2 gv = dot(a, a) < dot(b,b) ? a : b;

		//    vec2 id = st - gv;
		//    // id.y -= 2.;

		//    id.x *= 2.;

		//    gv.x =(HexDist(gv));


		//    if( mod(floor(id.x), 2.)  == 1. ){
		//    	// gv.y = gv.y;
		//    	// gv *= 10.;
		//    	gv.x = 1.-gv.x;
		//    	// gv.x = 0.5 - HexDist(st);
		//    	// gv.y = abs(1.-gv.y);
		//    }
		//    gv.y =atan(gv.x, gv.y);

		//    gv.x = log(1.- gv.x)*.8;
		//    // gv.y = log(gv.y*2.);
		//    st = gv;

		st -= .5;
		float angle = cv5 * TWO_PI;
		vec2 n = vec2(sin(angle), cos(angle));

		float d = dot(st, n);

		st -= n * max(0., d) * 2.;
		st += .5;
		return st;

	}
	else if (cv > 0.3) {
		st = st * 4.;
		// st += .5;
	}
	else if (cv > 0.2) {
		st = st + .5;
	}
	else if (cv > 0.1) {
		st.x = st.x + .5;
	}
	return st;
}


vec2 mirror(vec2 st, float cv, mat2 rotation_mat) {
	vec2 n;
	float d;
	float re_scale = 0.;

	st -= .5;

	// angle = rot * TWO_PI;
	// n = vec2(sin(angle), cos(angle));

	// d = dot(st, n);

	// st -= n * max(0., d) * 2.;
	// st.y = 1.-st.y;


	if (cv > .1) {
		st.y = -st.y;


		if (cv > .4) {
			st.x = -abs(st.x);
		}

		if (cv > .8) {
			st.x = abs(st.x);
			// re_scale += 10.;
			re_scale += 1.;

		}
		if (cv > .9) {
			// st.x = fract(st.x *4.);
			// float rad = sqrt(dot(st, st)) ;
			st.y = abs(st.y);
			re_scale += 1.;

		}


		//
		// angle = (rot - .5 * 2.) * 1.5 * PI;
		//rot internal modulation
		// rot_drift = (rot_drift - .5) * 2.;
		// if (abs(rot_drift) > .07) { //dedzone
		// 	angle += (PI * time / 1000. * rot_drift );
		// }

		n = vec2(rotation_mat[0][1], rotation_mat[0][0]); // (sin, cos) from CPU uniform
		st -= n * max(0., dot(st, n)) * 2.;

		if (cv > 0.2) {
			st *= 3.;
			// st -= 1.5;
			st.x = abs(st.x);
			st.x -= .5;
			st -= n * max(0., dot(st, n)) * 2.;
			re_scale += 1.;
		}

		if (cv > 0.3) {
			st *= 3.;
			st -= 1.5;
			st.x = abs(st.x);
			st.x -= .5;
			st -= n * max(0., dot(st, n)) * 2.;
			re_scale += 1.;
		}

		if (cv > 0.4) {
			st *= 3.;
			st -= 1.5;
			st.x = abs(st.x);
			// st.x -= .5;
			st -= n * max(0., dot(st, n)) * 2.;
			re_scale += 1.;
		}

		if (cv > 0.5) {
			st *= 3.;
			st -= 1.5;
			st.x = abs(st.x);
			st.y = -abs(st.y);
			st.x -= .5;
			st -= n * max(0., dot(st, n)) * 2.;
			re_scale += 10.;
		}

		if (cv > 0.6 && cv < .8 ) {
			st *= 3.;
			st -= 1.5;
			st.x = abs(st.x);
			st.x -= .5;
			// st.y = abs(st.y);
			st -= n * max(0., dot(st, n)) * 2.;
			re_scale += 1.;
		}

		if (cv > .7 &&  cv < .8) {
			// st *= 3.;
			// st.x = log(HexDist(st));
			// st.x = abs(st.y);
			// st.x = -st.x;

			// st /= 3.;
			st -= 1.5;
			st.x = abs(st.x);
			st.x -= .5;

			st -= n * max(0., dot(st, n)) * 2.;
			re_scale += 10.;
		}

	}



	if (re_scale > 0.) {
		st /= (re_scale * 3.);
	}

	st += .5;
	
	return st;
}

 // bayer ( Useful for dither effect)
float bayer( int iter, vec2 rc )
{
	float sum = 0.0;
	for( int i=0; i<1; ++i )
	{
		if ( i >= iter ) break;
		vec2 bsize = vec2(pow(2.0, float(i+1)));
		vec2 t = mod(rc, bsize) / bsize;
		int idx = int(dot(floor(t*2.0), vec2(2.0,1.0)));
		float b = 0.0;
		if ( idx == 0 ) { b = 0.0; } else if ( idx==1 ) { b = 2.0; } else if ( idx==2 ) { b = 3.0; } else { b = 1.0; }
		sum += b * pow(4.0, float(iter-i-1));
	}
	float phi = pow(4.0, float(iter))+1.0;
	return (sum+1.0) / phi;
}

//lumakey
float luma_key(float luma, float min, float max){
	luma = clamp(luma, 0.0, 1.0); //ensure correct range
	// min = min * 1.1; //dilate inputs to add a bit of deadzone
	// max = max * 1.1; //leave pure whites in even if max is 1.
	return mix( float( (luma >= min) && (luma <= max ) ) , float( (luma >= min) || (luma <= max ) ) , float( min > max) );
}

//shaping functions
float tri(float x){
	return 1.- 4. * abs((.5) - fract(.5 * x + (.25)));
}


