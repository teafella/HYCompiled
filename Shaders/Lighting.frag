#include "Global.frag"

uniform sampler2D frame_in_;
uniform float light_pos_;

void get_normal(vec2 position, float depth){

}

void main( void ) {
	vec3 light_pos =  vec3(1., 0., 1.0);
	vec3 camera_origin = vec3(0., 0.,  -2.5 );
	vec3 direction = normalize( vec3(tcoord, 2.5) );

	vec3 frame_color = texture2D( frame_in_  , tcoord  ).xyz;;

	//syntheiszed depth value, can be based on luma 
	// or feedback number (can feed this as a transparency cooef)
	float depth = -luma( texture2D( frame_in_, tcoord ).xyz ) ; 

	vec3 intersection = camera_origin + direction * depth;


	vec3 frag_pos = vec3(tcoord.x, tcoord.y, depth );
	vec3 normal = normalize(camera_origin - frag_pos);
	normal = normalize( vec3(depth, depth, depth ) );

	vec3 light_dir  = normalize(light_pos - frag_pos); 
	light_dir = normalize(vec3(-1.0, 0., -2.));
	vec3 view_dir   = normalize(camera_origin - frag_pos);
	vec3 halfway_dir = normalize(light_dir + camera_origin);

	float diffuse = dot(light_dir, normal);

	vec3 light_color = vec3(1.0);
	vec3 ambient_color = vec3(0.2, 0.45, 0.7);

	vec3 diffuse_lit = color0 * (diffuse * light_color + ambient_color) ;
	// float shininess = 10.0;
	// float spec = pow(max(dot(normal, halfway_dir), 0.0), shininess);
	// vec3 specular = light_color * spec;

	frame_color = diffuse_lit;

	gl_FragColor = vec4(frame_color , 1.0) ;

}
