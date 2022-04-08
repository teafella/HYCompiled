#include "Global.frag"
uniform sampler2D last_frame_;

void main( void ) {
	vec2 uv = tcoord;
	uv.y = 1.0 - uv.y;
	// uv.x = sin(uv.x);

	vec4 frame_color;

	frame_color = texture2D( last_frame_, uv);

	gl_FragColor = vec4( frame_color);

}