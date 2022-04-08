#include "ShapeUtil.frag"
precision mediump float;

uniform sampler2D frame_in_;
// uniform float gain_;
uniform float bgr_input;

uniform float context_resolution_x;
uniform float context_resolution_y;
uniform float input_resolution_x;
uniform float input_resolution_y;


void main( void ) {
	vec2 position = vec2( tcoord.x, 1.- tcoord.y);
	// position *= .5;
	// position.x = position.x + .25;
	// position.y = position.y + .25;

	// position = CorrectAspectRatio(position, vec2(context_resolution_x, context_resolution_y));

	vec4 frame_color = texture2D( frame_in_, position ) ;
	// frame_color += vec4(float(button0), float(button1),  float(button2), 1.);

	vec3 out_color;
	if( bgr_input > 0.0){
		out_color = frame_color.zyx;
	}
	else{
		out_color = frame_color.xyz;
	}

	gl_FragColor = vec4( vec3(out_color) , 1.0 );

}