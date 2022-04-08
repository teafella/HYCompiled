#include "Global.frag"

uniform sampler2D shape1;
uniform sampler2D shape2;
uniform sampler2D texFB;

uniform float shape1_mod_toggle;
uniform float shape2_mod_toggle;
uniform float hue;
uniform float hue_shift_A;
uniform float hue_shift_B;
//Attention! All input colors should be linear SRGB (see Global.frag for conversions)

void main( void ) {

	float gain = clamp((cv3 * 2.) - 1., -0.6, 0.6) / .6; //knob scaling n junk
	float abs_gain = abs(gain);

	vec2 posA = tcoord;
	vec2 posB = tcoord;

	//Mixer
	vec3 color = vec3(0.);


	//A input
	vec3 oscA;
	float input_A_is_full_color = float(button0 >= 5); // input is full color OR needs to be colorized

	//regular extended range luma osc (true if !input_A_is_full_color)
	vec3 osc1_in = texture2D( shape1, posA).xyz ;
	float osc1 = (1.0 - input_A_is_full_color) * (osc1_in.x + osc1_in.y - 1.);
	oscA = (1.0 - input_A_is_full_color) * (color1 * (osc1 )) * gain;

	// //full color (video in)
	vec3 pre_gain_A = texture2D( shape1, posA).xyz;
	// oscA += input_A_is_full_color * pre_gain_A * abs_gain ;

	oscA += HSVRecolor(input_A_is_full_color * pre_gain_A * abs_gain, (hue+ .01*0.7) /2. , 1.) ;
	

	//B input
	vec3 oscB;
	float input_B_is_full_color = float(button2 >= 5);// input is full color OR needs to be colorized
	vec3 osc2_in = texture2D( shape2, posB ).xyz;
	float osc2 = (1.0 - input_B_is_full_color) * (osc2_in.x  + osc2_in.y  - 1.);
	oscB = (1.0 - input_B_is_full_color) * (color2 * (osc2)) * gain;

	//full color (video in)
	vec3 pre_gain_B = texture2D( shape2, posB).xyz;
	// oscB += input_B_is_full_color * pre_gain_B * abs_gain ;
	oscB += HSVRecolor(input_B_is_full_color * pre_gain_B * abs_gain, (hue+ .01 *0.7 ) /2. , 1.); 


	//clamp color ranges (unipolar color mixing)
	oscA = clamp(oscA, vec3(0.), vec3(1.));
	oscB = clamp(oscB,  vec3(0.), vec3(1.));

	// oscA = linear_srgb_from_srgb(oscA);
	// oscB = linear_srgb_from_srgb(oscB);

	color += oscA  * shape1_mod_toggle;
	color += oscB  * shape2_mod_toggle;
	//turn osc off at low cv vals ( for shapes ) (disabled)
	// if(button0 > 4){ // if video/sampling is on
	// 	color += oscA  * shape1_mod_toggle;
	// }
	// else{ //regular shapes
	// 	color +=  step(0.07 , cv0) * oscA  * shape1_mod_toggle;  //video has no step (on when slider is down)
	// }

	// if(button2 > 4){ // if video/sampling is on
	// 	color += oscB  * shape2_mod_toggle;
	// }
	// else{ //regular shapes
	// 	color += step(0.07, cv2)  * oscB  * shape2_mod_toggle; //video has no step (on when slider is down)
	// }

	color = clamp(vec3(0.), vec3(1.), color); // back to regular srgb

	// color = texture2D( shape1, tcoord).xyz ;
	gl_FragColor = vec4( color, 1.0 );

}
