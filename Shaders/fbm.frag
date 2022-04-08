#include "ShapeUtil.frag"

uniform sampler2D cross_mod_shape; //input from other oscillator
uniform sampler2D feedback_frame; //final frame for feedback

// Shader specific uniforms (Not Updated By Default put these in manually )
uniform sampler2D uv_in;
uniform float frequency;
uniform float drift;
uniform float rotation;
uniform mat2 rotation_mat;
uniform float polarization;

uniform float cross_mod_toggle;
uniform float cross_mod_scale;
uniform float feedback_mod_toggle;
uniform float feedback_mod_scale;

uniform float mirror_amt;
uniform float axis_rotation;
uniform float axis_rotation_drift;

uniform float luma_min;
uniform float luma_max;

#define OCTAVES 1
float fbm (in vec2 st, float val, float amp , float freq ) {
	// Initial values
	float value = val;
	float amplitude = amp;
	float frequency = freq;
	//
	// Loop of octaves
	for (int i = 0; i < OCTAVES; i++) {
		value += amplitude * noise(st) ;
		st *= 2.;
		amplitude *= .5;
	}
	return value;
}


// oscillator
void main( void ) {
	vec2 position = CorrectAspectRatio(tcoord);
	position = mirror(position, mirror_amt, mirror_rotation_mat);

	//frequency
	float this_frequency = frequency * 10.0 ; //log(1.-frequency)  ;
	if(this_frequency <0.){
		this_frequency = 0.;
	}
	//scan
	vec2 scn_pos = vec2( position.x, position.y );
	vec2 fb_pos = tcoord;//, rotation_mat);

	scn_pos = rotate2D(scn_pos, rotation_mat ); //rotate

	float this_cross_scale = ((cross_mod_scale - 0.5) * .5) * 1.2;
	//cross modulation
	scn_pos += cross_mod_toggle * this_cross_scale * ((texture2D( cross_mod_shape , tcoord.xy  ).x + texture2D( cross_mod_shape , tcoord.xy  ).y) - 1.);

	float fb_mod_scale_shifted = feedback_mod_scale - 0.5;
	float this_fb_mod_scale = ((fb_mod_scale_shifted) * .5) * 2.5 * float(abs(fb_mod_scale_shifted) > .08);
	scn_pos += texture2D( feedback_frame , fb_pos  ).xy * feedback_mod_toggle * this_fb_mod_scale;

	float this_polarization = polarization;
	float this_polar_drift = 0.0;
	if (mirror_amt < 0.1) {
		if (this_polarization < .099) {
			this_polarization = 0.0;
		}
		else if (abs((polarization_drift - .5) * 2.) > 0.1) {
			this_polar_drift = tri(y_phase);//( mirror_rotation_mat[1][0] ) ;
			this_polarization += this_polar_drift * this_polarization;
		}
	}

	if (this_polarization >= 1.) {
		this_polarization = 1.;
	}

	vec2 scan = getScan2D(scn_pos , abs(this_polarization) ); //
	
	
	//shape

	float colorX = fbm( (scan * (2.* this_frequency)) + vec2(-phase/1.5, 0.) ,  0.05 , 1. , 0.2 ) ; //noise(scan * this_frequency + vec2(this_drift * time / 2.));//
	colorX = colorX * 2. - 1.;

	colorX *= luma_key( abs(colorX), luma_min,  luma_max);

	float colorY = colorX + 1.; // split range into 2 channels for more bit depth
	float colorZ = 0.0;
	// gl_FragColor = vec4(drawImage(tcoord , vec2(0.,0.), vec2(1.)), 1.0);
	gl_FragColor = vec4( colorX, colorY, colorZ , 1.0);
}
