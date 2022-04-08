#include "ShapeUtil.frag"

uniform sampler2D cross_mod_shape; //input from other oscillator
uniform sampler2D feedback_frame; //final frame for feedback

// Shader specific uniforms (Not Updated By Default put these in manually )
uniform sampler2D frame_in_;
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


void main( void ) {
	// tcoord.x = resolution.x / resolution.y;
	vec2 position = tcoord;
	float aspect_x = resolution.x / resolution.y;
	
	
	position *= .5;
	// position.x = position.x;
	// position = position - vec2(.25);
	position.x = position.x + .25;
	position.y = position.y + .25;

	position.x *= aspect_x; // aspect correction
	position.x -= (aspect_x - 1. )/2.;
	
	position = mirror(position, mirror_amt, mirror_rotation_mat );

	//frequency
	float this_frequency = frequency  * 15.0;
	//scan
	vec2 scn_pos = vec2( position.x, position.y );
	vec2 fb_pos = vec2( position.x, position.y );//, rotation_mat);
	scn_pos = rotate2D(scn_pos, rotation_mat ); //rotate


	float this_fb_mod_scale = ((feedback_mod_scale - 0.5) * .5) * 2.5;
	scn_pos += texture2D( feedback_frame , fb_pos  ).xy * feedback_mod_toggle * this_fb_mod_scale ;
	
	float this_polarization = polarization;
	float this_polar_drift = 0.0;
	if (mirror_amt < 0.1) {
		if (this_polarization < .07) {
			this_polarization = 0.0;
		}
		else if (abs((polarization_drift - .5) * 2.) > 0.1) {
			this_polar_drift = (mirror_rotation_mat[1][0] ) ;
			this_polarization += this_polar_drift * this_polarization;
		}
	}

	vec2 scan = getScan2D(scn_pos , abs(this_polarization) ); //

	//cross mod scaling
	float this_cross_scale = cross_mod_scale-.5;
	//cross modulation
	scan += ((texture2D( cross_mod_shape , position  ).x + texture2D( cross_mod_shape , position  ).y) - 1.) *  cross_mod_toggle * this_cross_scale;
	
	//shape
	// float colorX = polygon(scan, this_frequency, -(phase/4.),  4.) * 2. - 1. ;
	// float colorY = colorX + 1.; // split range into 2 channels for more bit depth
	// float colorZ = 0.0;
	
	scan *= (this_frequency + .5);
	// scan.x = scan.x + .5;
	// scan.y = scan.y + 1.;

	scan.x += phase;
	
	vec4 sample_color = texture2D( frame_in_, scan + .5); //scan + phase
	float sample_luma = luma(sample_color) * 1.8; // drive the brightness a bit

	// float colorX = sample_luma * 2. - 1. ;
	float colorX = sample_luma;
	// float colorY = colorX + 1.; // split range into 2 channels for more bit depth
	float colorY = sample_luma ;
	float colorZ = 0.0;

	sample_color = vec4( colorX, colorY, colorZ , 1.0);

	gl_FragColor = vec4( sample_color.xyz , 0.1);
}
