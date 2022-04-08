#include "Global.frag"
uniform float re_polar_;
uniform mat2 re_polar_mat_;

float AddDeadzone(float value){
	float deadzone_size = .018;
	float corrected = mix( value - deadzone_size , value + deadzone_size , float(value < 0.0) );
	corrected *= 1.0 + deadzone_size;
	value = mix( corrected, 0.0 , float(abs(value) < deadzone_size) ) ;
	return value;
}

vec2 ZoomUV(vec2 uv, float zoom){// zoom range from 0 to 1
	//zoom factor is bipolar -.5 to .5
	zoom = (zoom - .5);
	zoom = AddDeadzone(zoom);
	//feedback color
	return (scale( vec2(1. + zoom) ) * uv) - vec2( zoom / 2.);
}


vec2 OffsetUV(vec2 uv, float x, float y){ // x and y range from 0 to 1
	//offset UV
		//center deadzone
	float deadzone_size = .018;
	float fbx = (x - .5) * 2.;
	float fby = (y -.5) * 2.;

	fbx = AddDeadzone(fbx);
	fby = AddDeadzone(fby);

	return uv - vec2(fbx , fby);
}


vec3 KeepForeground(vec3 frame_color, vec3 feedback_color, float thresh){ //only keeps color in background, useful for preserving shapes duringfeedback
	
	// float black_clamp = luma(framecolor) < thresh;
	
	// if(feedback_color == vec3(0.0)){ //for full black dont do anythin
	// 	return  vec3(0.0);
	// }

	float this_luma = luma(frame_color);
	// if(this_luma == 0.){
	// 	return vec3(0.0);
	// }
	//otherwise smooth the range
	float smooth_range_size = .08;
	float smooth_range = thresh + smooth_range_size;
	return mix( feedback_color  , vec3(0.0) , smoothstep(thresh, smooth_range, this_luma ) ) ;
}

vec3 HueShift(vec3 frame_color, vec3 feedback_color, float magnitude){ //mag generally 0-1
	vec3 color_hsv = rgb2hsv(feedback_color);

	color_hsv.x = color_hsv.x + (magnitude * luma(frame_color) *10.) ;

	return hsv2rgb(color_hsv) * 1.;
}



//all the FB page operations in one function for convenience
vec2 UVPage(vec2 uv, float zoom, float rotation_amt, mat2 rotation_mat, float x, float y ){

	uv = CorrectAspectRatio(uv);
	
	uv = ZoomUV(uv, zoom );
	//offset
	uv = OffsetUV(uv, x, y);

	//rotation
	uv = rotate2D(uv,  rotation_mat);

	//restore aspect skew after rotation
	uv = RectifyAspectRatio(uv);

	return uv;
}

