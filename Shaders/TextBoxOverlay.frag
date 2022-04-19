#include "Global.frag"
uniform sampler2D text_;
uniform sampler2D passthrough_frame_;

uniform float context_resolution_x;
uniform float context_resolution_y;

uniform float text_pos_x;
uniform float text_pos_y;

void main( void ) {
	vec2 uv = tcoord;

	uv.y = 1.0 - uv.y;
	uv = CorrectAspectRatio(uv, vec2(context_resolution_x, context_resolution_y));

	

	// float text_scale = 1.;
	// uv *= text_scale;

	// uv += vec2(text_pos_x, text_pos_y);
	// uv += vec2(.34, .01);


	uv += vec2( .1 , .0);
	// uv += vec2(.22, .01);
	vec4 frame_color;
	vec4 text_color = texture2D( text_, uv);
	vec4 passthrough_color = texture2D( passthrough_frame_, tcoord);

	if(uv.x > 1. || uv.y > 1.|| uv.x < 0. || uv.y < 0.){
		frame_color = passthrough_color;
	}
	else{
		frame_color = text_color;

		float text_color_luma = luma(text_color);
		//take out blacks
		if(text_color_luma < .5 ){
			frame_color = texture2D( passthrough_frame_, tcoord);
		}
		if(text_color_luma > .5 && text_color_luma < .7){
			frame_color = passthrough_color/2.;
		}
	}

	gl_FragColor = vec4( frame_color.xyz, 1.0);

}