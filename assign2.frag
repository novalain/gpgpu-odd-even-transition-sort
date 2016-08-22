//============================================================
// STUDENT NAME: Michael Novén
// MATRIC NO.  : 
// NUS EMAIL   : 
// ============================================================
//
// FILE: assign2.frag

// The GL_EXT_gpu_shader4 extension extends GLSL 1.10 with 
// 32-bit integer (int) representation, integer bitwise operators, 
// and the modulus operator (%).

#extension GL_EXT_gpu_shader4 : require

#extension GL_ARB_texture_rectangle : require

uniform sampler2DRect InputTex;  // The input texture.

uniform int TexWidth;   // Always an even number.
uniform int TexHeight;

uniform int PassCount;  // For the very first pass, PassCount == 0.

void main()
{

	/*   We have one big quad covering the viewport, that gives a viewport of texWidth*texHeight (200*125) pixels
		 with fragment coordinates of (0.5, 0.5) -> (199.5, 124,5). 
	
		  ___________	(199, 124)
		 |__|__|__|__|
		 |__|__|__|__|	
(0, 0)   |__|__|__|__|
     
	
	Where each fragment maps to a texture value
	*/

    float P1 = texture2DRect( InputTex, floor(gl_FragCoord.xy)).a; // Texture (array) value at each fragment, stored in the alpha channel
    float P2;
	
	int row = int( gl_FragCoord.y );
    int column = int( gl_FragCoord.x );
    int index1D = row * TexWidth + column;	
																
    if ( PassCount % 2 == 0 )  // PassCount is Even, easy pass
	{
		
		// Look at the texel after when even column
		if(column % 2 == 0){

			P2 = texture2DRect(InputTex, vec2(column + 1, row)).a;

			if(P1 < P2)
				gl_FragColor = vec4(P1);
			else
				gl_FragColor = vec4(P2);

		// Look at the texel before
		} else {

			P2 = texture2DRect(InputTex, vec2(column - 1, row)).a;

			if(P1 > P2)
				gl_FragColor = vec4(P1);
			else
				gl_FragColor = vec4(P2);
		
		}	
    }

    else  // PassCount is Odd
    {
		if(index1D == 0 || index1D == TexWidth * TexHeight - 1){ // Corner texels, do nothing

			gl_FragColor = vec4(P1);

		} else if (column == 0){ // Most-left case
			
			P2 = texture2DRect(InputTex, vec2(TexWidth - 1, row - 1)).a;

			if(P1 > P2)
				gl_FragColor = vec4(P1);
			else
				gl_FragColor = vec4(P2);

		} else if (column != 0 && column % (TexWidth - 1) == 0){ // Most-right case
			
			P2 = texture2DRect(InputTex, vec2(0, row + 1)).a;
			if(P1 < P2)
				gl_FragColor = vec4(P1);
			else
				gl_FragColor = vec4(P2);
				
		} else { // No corner cases, in middle somewhere

			if(index1D % 2 == 0){ // Check previous

				P2 = texture2DRect(InputTex, vec2(column - 1, row)).a;

				if(P1 > P2)
					gl_FragColor = vec4(P1);
				else
					gl_FragColor = vec4(P2);
			
			} else { // Check following
			
				P2 = texture2DRect(InputTex, vec2(column + 1, row)).a;

				if(P1 < P2)
					gl_FragColor = vec4(P1);
				else
					gl_FragColor = vec4(P2);

			}
		}
    }
}
