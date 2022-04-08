#include "Global.frag"

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


void main( void ) {
	vec2 position = CorrectAspectRatio(tcoord);
	position = mirror(tcoord, mirror_amt, mirror_rotation_mat );

	// mat2 rotation_mat = getRotationMatrix(rotation * TWO_PI);

	//drift/speed

	//frequency
	float this_frequency = log(1.-frequency)  * 10.0;
	//scan
	vec2 scn_pos = vec2( position.x, position.y );
	vec2 fb_pos = tcoord.xy;
	//cross mod scaling
	float this_cross_scale = ((cross_mod_scale - 0.5) * .5) * 1.2;
	//cross modulation
	scn_pos += cross_mod_toggle * this_cross_scale * ((texture2D( cross_mod_shape , tcoord.xy  ).x + texture2D( cross_mod_shape , tcoord.xy  ).y) - 1.);

	
	float this_fb_mod_scale = ((feedback_mod_scale - 0.5) * .5) * 2.5;
	scn_pos += texture2D( feedback_frame , fb_pos  ).xy * feedback_mod_toggle * this_fb_mod_scale ;

	// float this_polarization = polarization;
	// float this_polar_drift = 0.0;
	// if(this_polarization < .099){
	// 	this_polarization = 0.0;
	// }
	// else if(abs((polarization_drift - .5) *2.) > 0.1){
	// 	this_polar_drift = (mirror_rotation_mat[1][0] ) ;
	// 	this_polarization += this_polar_drift * this_polarization;
	// }

	// vec2 scan = getScan2D(scn_pos , (this_polarization) ); //

	scn_pos.y += polarization*2. - 1.
	vec2 scan = getScan2D(scn_pos);
	
	//shape
	// float colorX = tan(PI * scan.x * this_frequency + (this_drift * time) ) ;
	float size = .2;
	scan.x = fract(scan.x  * this_frequency + phase);
	float colorX = (step(0., scan.x) * 1.0 - step( size,  scan.x )) * 2. - 1.;
	float colorY = colorX + 1.; // split range into 2 channels for more bit depth
	float colorZ = 0.0;
	// gl_FragColor = vec4(drawImage(tcoord , vec2(0.,0.), vec2(1.)), 1.0);
	gl_FragColor = vec4( colorX, colorY, colorZ , 1.0);
}
