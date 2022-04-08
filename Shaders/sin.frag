//includes
#include "ShapeUtil.frag"

uniform sampler2D cross_mod_shape; //input from other oscillator
uniform sampler2D feedback_frame; //final frame for feedback

// Shader specific uniforms (Not Updated By Default put these in manually )

uniform sampler2D uv_in;
uniform float frequency;
uniform float rotation;
uniform float rotation_drift;
uniform mat2 rotation_mat;
uniform float polarization;

uniform float cross_mod_toggle;
uniform float cross_mod_scale;
uniform float feedback_mod_toggle;
uniform float feedback_mod_scale;

uniform float mirror_amt;
uniform float axis_rotation;


uniform float x_crop;
uniform float y_crop;
// uniform float aspect_adjust;

uniform float luma_min;
uniform float luma_max;

//triangle: y = 1.- 4. * abs((1./2.) - fract(.5 * x + (1./4.)));

// sin oscillator
void main( void ) {
	vec2 position = CorrectAspectRatio(tcoord);

	position = mirror(position, mirror_amt, mirror_rotation_mat);

	//cross mod params
	float this_cross_scale = (((cross_mod_scale - 0.5) * .5) * 1.2) ;

	//frequency
	float this_frequency = frequency;
	float upper_bound = .99;
	if (this_frequency > upper_bound){
		this_frequency = upper_bound;
	}

	this_frequency = (log(1.-this_frequency) * 15.0) +.7; //(log(1. - frequency) * 15.0) + .7;
	if(this_frequency > 0.){
		this_frequency = 0.;
	}
	//scan
	vec2 scn_pos = vec2( position.x, position.y );
	vec2 fb_pos = tcoord.xy;
	//feedback mod scaling
	float fb_mod_scale_shifted = feedback_mod_scale - 0.5;
	float this_fb_mod_scale = ((fb_mod_scale_shifted) * .5) * 2.5 * float(abs(fb_mod_scale_shifted) > .08);
	scn_pos += texture2D( feedback_frame , fb_pos  ).xy * feedback_mod_toggle * this_fb_mod_scale ;
	scn_pos = rotate2D(scn_pos, rotation_mat ); //rotate

	scn_pos += cross_mod_toggle * this_cross_scale * ((texture2D( cross_mod_shape , tcoord.xy  ).x + texture2D( cross_mod_shape , tcoord.xy  ).y + texture2D( cross_mod_shape , tcoord.xy  ).z) - 1.);


	// if there isnt mirroring, apply internal modulation to polarization
	// float drift_constant = (axis_rotation_drift - .5) *2.;
	// float polarization_drift = sin((time/150. * (TWO_PI) * (drift_constant * float(abs(drift_constant) > .07) * float(mirror_amt < .1) ) ) );
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

	vec2 scan = getScan2D(scn_pos , (this_polarization) ); //

	

	//cross mod scaling

	//cross modulation
	// scan += ((texture2D( cross_mod_shape , position  ).x - texture2D( cross_mod_shape , position  ).y) - 1.) * cross_mod_toggle * this_cross_scale;

	//shape
	float crop_mod = (x_crop) * 8. ;
	
	float sin_phase = (((phase * 2.) - PI / 2. ));
	float coef_x = scan.x * (this_frequency) + sin_phase;
	float coef_y = scan.y * (this_frequency) ;
	float sin_wave_x = sin(PI * coef_x);
	float sin_wave_y = sin(PI * coef_y);
	float tri_sat_x = tri(coef_x );
	float tri_sat_y = tri(coef_y );
	// float exp_sat = pcurve(sin_wave, x_crop, y_crop);
    // sin_coef_x /= crop_mod;

	// float colorX = sin(sin_coef_x + (tri_sat) * crop_mod) ;
	float x_component = mix(sin_wave_x, tri_sat_x , y_crop);
	float y_component = mix(sin_wave_y, tri_sat_y , y_crop);
	float colorX = mix(x_component, y_component , x_crop);
	//colorX += crop_mod;// mix(1., crop_mod, float(x_crop > .1) );

	//LumaKey (Sampled from original frame)
	colorX *= luma_key( abs(colorX) , luma_min,  luma_max);// can do something with transparency here

	float colorY = colorX + 1.; // split range into 2 channels for more bit depth
	float colorZ = 0.0;
	// gl_FragColor = vec4(drawImage(tcoord , vec2(0.,0.), vec2(1.)), 1.0);
	gl_FragColor = vec4( colorX, colorY, colorZ , 1.0);
	// gl_FragColor = vec4( phase);
}
