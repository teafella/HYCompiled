#include "FeedbackUtil.frag"

uniform sampler2D frame_in;
uniform sampler2D feedback_frame;

uniform float gain;

uniform sampler2D shape1;
uniform sampler2D shape2;
uniform float shape1_mod_toggle;
uniform float shape2_mod_toggle;

uniform float hue_shift;

uniform float fb_x;
uniform float fb_y;
uniform float fb_rotate_;
uniform mat2 fb_rotation_matrix_;
uniform float zoom_;


void main( void ) {
	float knob_boundary = 0.65;
	float feedback_amp = 80.;
	float feedback_scalar = (((clamp(gain , knob_boundary, 1.) / knob_boundary) - 1.) * 2. + ((clamp(1. - gain , knob_boundary, 1.) / knob_boundary) - 1.) * 2.) * feedback_amp ;

	

	//frame in color
	vec3 frame_color= texture2D( frame_in  , tcoord  ).xyz;

	vec2 fbPos = UVPage(tcoord, zoom_, fb_rotate_,  fb_rotation_matrix_, fb_x, fb_y);
	
	vec3 feedback_color = linear_srgb_from_srgb( texture2D( feedback_frame  , fbPos).xyz );

	feedback_color = HueShift(frame_color, feedback_color, hue_shift);

	//keep new info in the foreground
	float black_thresh = .05;
	// feedback_color = KeepForeground(frame_color, feedback_color, black_thresh);
	// try to preserve feedback color
	feedback_color = ColorClamp(feedback_color);


	//Hyper-Digital Feedback Mode

	frame_color /= (feedback_color * feedback_scalar);

	frame_color = srgb_from_linear_srgb(frame_color);
	gl_FragColor = vec4(frame_color, 1.0);
}
