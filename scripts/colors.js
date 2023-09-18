/*

	I MODIFIED THE COLORS (NOW THEY DON'T MATCH THEIR NAMES) TO MAKE THEM MATCH WITH 
	THE COLOR SCHEME OF MY GIIKER SMART CUBE

	In case I push this code without modifying it, you will know that I wasn't drunk
	when name them... just in a hurry to see a nice result!

	COLORS

	Here's a little bootstrapping to create our global Color constants.
	At first it seemed like overkill, but then as the solvers and inspectors
	moved forward having these objects available became highly desirable.
	Sure, ES5 doesn't really have constants but the all-caps alerts you
	to the fact that them thar variables ought not to be messed with.


*/












function Color( name, initial, hex, styleF, styleB ){

	this.name    = name
	this.initial = initial
	this.hex     = hex
	this.styleF  = styleF
	this.styleB  = styleB
}


//  Global constants to describe sticker colors.

var
W = WHITE = new Color(

	'white',
	'W',
	'#FFF',
	'font-weight: bold; color: #888',
	'background-color: #F3F3F3; color: rgba( 0, 0, 0, 0.5 )'
),
O = ORANGE = new Color(

	'orange',
	'O',
	'#E9C0C5',
	'font-weight: bold; color: #E9C0C5',
	'background-color: #E9C0C5; color: rgba( 255, 255, 255, 0.9 )'
),
B = BLUE = new Color(

	'blue',
	'B',
	'#98FB98',
	'font-weight: bold; color: #98FB98',
	'background-color: #98FB98; color: rgba( 255, 255, 255, 0.9 )'
),
R = RED = new Color(

	'red',
	'R',
	'#FA1111',
	'font-weight: bold; color: #FA1111',
	'background-color: #FA1111; color: rgba( 255, 255, 255, 0.9 )'
),
G = GREEN = new Color(

	'green',
	'G',
	'#1111FA',
	'font-weight: bold; color: #1111FA',
	'background-color: #1111FA; color: rgba( 255, 255, 255, 0.9 )'
),
Y = YELLOW = new Color(

	'yellow',
	'Y',
	'#FE0',
	'font-weight: bold; color: #ED0',
	'background-color: #FE0; color: rgba( 0, 0, 0, 0.5 )'
),
COLORLESS = new Color(

	'NA',
	'X',
	'#DDD',
	'color: #EEE',
	'color: #DDD'
)



