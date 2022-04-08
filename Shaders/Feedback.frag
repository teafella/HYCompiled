#include "FeedbackUtil.frag"

uniform sampler2D frame_in;
uniform sampler2D feedback_frame;

uniform sampler2D shape1;
uniform sampler2D shape2;

uniform float gain;

uniform float hue_shift;
uniform float hue_mod;

uniform float fb_x;
uniform float fb_y;
uniform float fb_rotate_;
uniform mat2 fb_rotation_matrix_;
uniform float zoom_;

#define repeat(v) mod(p + 1., 2.) -1.
#define un(a, b) min(a, b)

//-----------------------------------------|

void main( void ) {
	float knob_boundary = 0.6;
	float feedback_amp = .78;
	float feedback_scalar = (((clamp(gain , knob_boundary, 1.) / knob_boundary) - 1.) * 2. + ((clamp(1. - gain , knob_boundary, 1.) / knob_boundary) - 1.) * 2.) * feedback_amp ;
	
	//frame in color
	vec3 frame_color= texture2D( frame_in  , tcoord  ).xyz;

	// frame_color = HSVRecolor(frame_color, hue_mod, 1.);

	vec2 position = tcoord;
	

	vec2 fbPos = UVPage(position, zoom_, fb_rotate_,  fb_rotation_matrix_, fb_x, fb_y);

	vec3 feedback_color = linear_srgb_from_srgb( texture2D( feedback_frame  , fbPos).xyz );

	feedback_color = HueShift(frame_color, feedback_color, hue_shift);
	feedback_color *= feedback_scalar;
	// feedback_color *= 0.1;
	//keep new info in the foreground
	float black_thresh = .00;
	// float black_thresh = .1;
	feedback_color = KeepForeground(frame_color, feedback_color, black_thresh);
	// try to preserve feedback color
	// feedback_color = ColorClamp(feedback_color); //not working in cmv4?

	// if(re_polar_ >.07 ){
	// 	float dither_amount = min( ((re_polar) - .5) * 2. + .1 , 1.);
	// 	float thresh = bayer(1, uv * (resolution.xy * dither_amount) );
		
	// 	feedback_color = feedback_color * step(thresh, ( (feedback_color.x + feedback_color.y + feedback_color.z) / 3.));
	// }
	

	// frame_color = clamp(vec3(0.), vec3(1.), (frame_color + feedback_color)) ;

	frame_color = srgb_from_linear_srgb(frame_color + feedback_color);
	gl_FragColor = vec4(frame_color, 1.0);
}
