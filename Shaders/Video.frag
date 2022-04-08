#include "Global.frag"

uniform sampler2D frame_in_;
uniform float gain_;

void main( void ) {
	vec2 uv = tcoord * 1. * gain_;
	uv.y = 1.0 - uv.y;


	// vec4 frame_color = texture2D( frame_in_, uv ) ;
	 vec4 frame_color = vec4(1., 1., 1.,1.);

	// float gamma = 2.2;
    // frame_color.rgb = pow(frame_color.rgb, vec3(1.0/gamma));

	gl_FragColor = vec4( frame_color.xyz , 1.0 );

}