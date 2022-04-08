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

uniform float context_resolution_x;
uniform float context_resolution_y;



uniform float saturation;
uniform float hue_shift;
uniform float gain;

uniform float input_resolution_x;
uniform float input_resolution_y;

uniform float x_crop;
uniform float y_crop;
uniform float aspect_adjust;

uniform float luma_min;
uniform float luma_max;

uniform float bgr_input;



float myclamp(float value, float min, float max){
	if(value > max){
		return max;
	}
	else if(value < min){
		return min;
	}
	return value;
}


void main( void ) {
	vec2 position = tcoord;

	position *= .5;
	position.x = position.x + .25;
	position.y = position.y + .25;

	position = CorrectAspectRatio(position, vec2(context_resolution_x, context_resolution_y));
	
	position = mirror(position, mirror_amt, mirror_rotation_mat );

	//frequency
	float this_frequency = frequency  * 15.0 ;
	if(this_frequency < 0.){
		this_frequency = 0.;
	}
	//scan
	vec2 scn_pos = vec2( position.x, position.y);
	

	//second correction for user nudge

	float aspect_control = aspect_adjust + ( (input_resolution_x / input_resolution_y)/5. -.1 ) * (1.-float(input_resolution_x == input_resolution_y)) ; // cancel out auto offset for square images (hack? maybe)
	float aspect_adjust_xy = ((aspect_control * 1.5) + 1.) * 2. - 2.5; //-2.5 to 2.5 range
	float y_adjust =  2. - aspect_adjust_xy ;
	if( aspect_control > 0.5 ){
		position.x = CorrectAspectRatio(position.x, aspect_adjust_xy);
	}
	


	vec2 fb_pos = tcoord.xy;//, rotation_mat);
	scn_pos = rotate2D(scn_pos, rotation_mat ); //rotate
	scn_pos.x = 1. - scn_pos.x;
	if( aspect_control > 0.5 ){
		scn_pos.x = RectifyAspectRatio(scn_pos.x, aspect_adjust_xy);
	}
	else{
		scn_pos.y = RectifyAspectRatio(scn_pos.y, y_adjust);
	}
	// scn_pos.y = RectifyAspectRatio(scn_pos.y, aspect_adjust_xy);

	float this_fb_mod_scale = ((feedback_mod_scale - 0.5) * .5) * 2.5;
	scn_pos += texture2D( feedback_frame , fb_pos  ).xy * feedback_mod_toggle * this_fb_mod_scale ;
	

	// polarization (disabled for sampler)
	// float this_polarization = polarization;
	// float this_polar_drift = 0.0;
	// if (mirror_amt < 0.1) {
	// 	if (this_polarization < .099) {
	// 		this_polarization = 0.0;
	// 	}
	// 	else if (abs((polarization_drift - .5) * 2.) > 0.1) {
	// 		this_polar_drift = (mirror_rotation_mat[1][0] ) ;
	// 		this_polarization += this_polar_drift * this_polarization;
	// 	}
	// }

	// vec2 scan = getScan2D(scn_pos , abs(this_polarization) ); //

	// scn_pos.y += polarization/2.;
	vec2 scan = getScan2D(scn_pos);//

	
	bool  MIRROR_HORIZONTAL = true;
	bool  MIRROR_VERTICAL = MIRROR_HORIZONTAL;

	if (mirror_amt < .1) { //if mirroring is disabled rotation knob controls texture repeat mode
		if(axis_rotation > 0.5){
			MIRROR_HORIZONTAL = false;
			MIRROR_VERTICAL = false;
		}
	}

	//cross mod scaling
	float this_cross_scale = cross_mod_scale-.5;
	//cross modulation
	scan += cross_mod_toggle * this_cross_scale * ((texture2D( cross_mod_shape , tcoord.xy  ).x + texture2D( cross_mod_shape , tcoord.xy  ).y) - 1.) ;
	scan *= (this_frequency + .85) + ( float(!MIRROR_VERTICAL || !MIRROR_HORIZONTAL) * .86 ); // +.95
	scan.x += phase/1.5;

	

	scan = scan + (.5 + (.5 * float(!MIRROR_VERTICAL || !MIRROR_HORIZONTAL))) ;
	// scan = scan + .5;
	//calculate scan cropping info
	float x_origin = .5 * (x_crop) ;//(2.- preset_pot_1_6*2.) - .5 ;
	float x_size = (2.- float(!MIRROR_HORIZONTAL) ) - (2.0- float(!MIRROR_HORIZONTAL)) * (x_crop) -0.001;//(0.5 - (.5 * preset_pot_1_4)) + 1. ;//(1.0-preset_pot_1_6)-0.01;
	float y_origin = .5 * (y_crop) ;
	float y_size = (2.- float(!MIRROR_VERTICAL) ) - (2.0- float(!MIRROR_VERTICAL)) * (y_crop) -0.001;

	// scan.y -= x_origin;
	//zoom in to preserve image size
	scan *= x_size/2.;
	scan.y += x_origin;

	scan.y += (polarization*2. - 1.) + (y_phase/1.5) ;///Y Phase/drift

	// zoom in constant
	float y_origin_adjust_scalar = 1.;
	scan.y -= y_origin  ; //* y_origin_adjust_scalar;// * 1.58;

	

	// scan.y += y_size;


	
	//cropping
	
	//X
	// float x_origin = preset_pot_1_5*2.;
	// float x_size = 2.*(1.0-preset_pot_1_4);
	
	// float x_crop = preset_pot_1_6;
	
	float x_is_odd = step(x_size/2., mod(scan.x, x_size) );
	x_is_odd *= float(MIRROR_HORIZONTAL);
	scan.x = mod(scan.x, (x_size));
	scan.x = mix(scan.x , x_size - scan.x , x_is_odd); // MIRROR_HORIZONTAL
	scan.x += x_origin;

	//scan.x *= .5;//test

	//Y
	// float y_size = 2.*(1.0-preset_pot_1_6);
	// float y_origin = preset_pot_1_7*2.;
	// float y_crop = preset_pot_1_4;
	
	

	float y_is_odd = step(y_size/2., mod(scan.y, y_size) );
	y_is_odd *= float(MIRROR_VERTICAL);
	scan.y = mod(scan.y,  y_size);
	scan.y = mix(scan.y , y_size - (scan.y * float(MIRROR_VERTICAL)), y_is_odd); //flip flop? MIRROR_VERTICAL
	scan.y += y_origin;

	vec4 sample_color =  texture2D( frame_in_, scan); //scan + phase
	vec3 linear_sample_color = linear_srgb_from_srgb(sample_color.xyz);
	vec3 sample_for_recolor;
	//Recolor
	//if bgr swap values
	if( bgr_input > 0.0){
		sample_for_recolor = linear_sample_color.zyx;
	}
	else{
		sample_for_recolor = linear_sample_color.xyz;
	}


	// //full color (video in)
	vec3 recolor = (HSVRecolor(sample_for_recolor, hue_shift, saturation)) ;

	// //full color video needs inversion on negative gain
	float this_gain = clamp((gain * 2.) - 1., -0.6, 0.6) / .6;
	float gain_is_positive = float(this_gain > -0.05);
	vec3 out_color = mix( InvertColor(recolor) , (recolor) , gain_is_positive);

	//LumaKey (Sampled from original frame)
	out_color *= luma_key(luma(linear_sample_color), luma_min, luma_max);

	
	//actual gain calculated later in mixer shader

	gl_FragColor = vec4(out_color, sample_color.a);
}
