#include "ShapeUtil.frag"

uniform sampler2D cross_mod_shape; //input from other oscillator
uniform sampler2D feedback_frame; //final frame for feedback

// Shader specific uniforms (Not Updated By Default put these in manually )
uniform sampler2D uv_in;
uniform float frequency;
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

uniform float x_crop;
uniform float y_crop;
// uniform float aspect_adjust;

uniform float luma_min;
uniform float luma_max;



void main( void ) {
	vec2 position = CorrectAspectRatio(tcoord);
	position = mirror(position, mirror_amt, mirror_rotation_mat);

	// mat2 rotation_mat = getRotationMatrix(rotation * TWO_PI);

	float this_frequency = frequency;
	float upper_bound = .99;
	if (this_frequency > upper_bound){
		this_frequency = upper_bound;
	}

	//frequency
	this_frequency = (log(1. - this_frequency) * 7.5) + .35;//-frequency  * 20.0 + .35;
	if(this_frequency > 0.){
		this_frequency = 0.;
	}
	//scan
	vec2 scn_pos = vec2( position.x, position.y );
	vec2 fb_pos = tcoord.xy;//, rotation_mat);
	float this_cross_scale = ((cross_mod_scale - 0.5) * .5) * 1.2;
	scn_pos = rotate2D(scn_pos, rotation_mat ); //rotate
	//cross modulation
	scn_pos += cross_mod_toggle * this_cross_scale * ((texture2D( cross_mod_shape , tcoord.xy  ).x + texture2D( cross_mod_shape , tcoord.xy  ).y) - 1.);

	//feedback mod scaling
	float fb_mod_scale_shifted = feedback_mod_scale - 0.5;
	float this_fb_mod_scale = ((fb_mod_scale_shifted) * .5) * 2.5 * float(abs(fb_mod_scale_shifted) > .08);
	scn_pos += texture2D( feedback_frame , fb_pos  ).xy * feedback_mod_toggle * this_fb_mod_scale ;
	

	float this_polarization = polarization;
	float this_polar_drift = 0.0;
	if (mirror_amt < 0.1) {
		if (this_polarization < .099) {
			this_polarization = 0.0;
		}
		else if (abs((polarization_drift - .5) * 2.) > 0.1) {
			this_polar_drift = (mirror_rotation_mat[1][0] ) ;
			this_polarization += this_polar_drift * this_polarization;
		}
	}

	vec2 scan = getScan2D(scn_pos , (this_polarization) ); //
	
	//shape
	float crop_mod = (x_crop) * 8. ;
	
	float my_phase = (((phase * 2.) - PI / 2. ));
	float coef_x = scan.x * (this_frequency) + my_phase;
	float coef_y = scan.y * (this_frequency);
	float base_wave_x = tan(PI * coef_x);
	float base_wave_y = tan(PI * coef_y);
	float saturator_x = tan(coef_x );
	float saturator_y = tan(coef_y );

	float x_component = mix(base_wave_x, saturator_x , y_crop);
	float y_component = mix(base_wave_y, saturator_y , y_crop);
	float colorX = mix(x_component, y_component , x_crop);


	// float colorX = tan(PI * scan.x * this_frequency + (phase) - PI/4. ) ;
	colorX *= luma_key(abs(colorX), luma_min,  luma_max);

	float colorY = colorX + 1.; // split range into 2 channels for more bit depth
	float colorZ = 0.0;
	// gl_FragColor = vec4(drawImage(tcoord , vec2(0.,0.), vec2(1.)), 1.0);
	gl_FragColor = vec4( colorX, colorY, colorZ , 1.0);
}
