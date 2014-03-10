#pragma strict
var circle_timer : float;

var color_image : Texture2D;
var circle_image : Texture2D;
var speed : float = 5;
var target : Transform;

private var public_fader : String;
function Start()
{
	if(!target)
		target = gameObject.FindWithTag("Player").transform;
	circle_fade("in");
	if(tag!="MainCamera")
		Debug.LogError("Please attach the Helper Fadeout to the Camera tagged 'MainCamera'");
}
function circle_fade(fader : String)
{
	if(fader=="in")
	{
		public_fader="in";
		while(circle_timer<3001)
		{
			circle_timer+=((speed*100)*Time.deltaTime)+circle_timer/50;
			if(public_fader=="out") return;
			yield;
		}	
		circle_timer=3001;
	}
	if(fader=="out")
	{
		public_fader="out";
		circle_timer=4000;
		while(circle_timer>-1)
		{
			if(camera.main.audio)if(camera.main.audio.isPlaying)camera.main.audio.volume=Mathf.Min(0.4,circle_timer/5000);
			circle_timer-=(((1+speed)*100)*Time.deltaTime)+circle_timer/50;
			if(public_fader=="in") return;
			yield;
		}	
		circle_timer=-1;
	}
}

function OnGUI()
{
GUI.depth=1;
	var player_pos = camera.main.WorldToScreenPoint(target.position);
	if(circle_timer<3000)
	{
	GUI.DrawTexture(Rect(player_pos.x-circle_timer/2-2000,(camera.main.pixelHeight-player_pos.y)-circle_timer/2-4000,4000,4000),color_image);
	GUI.DrawTexture(Rect(player_pos.x-circle_timer/2-4000,(camera.main.pixelHeight-player_pos.y)-circle_timer/2-1000,4000,4000),color_image);
	GUI.DrawTexture(Rect(player_pos.x+circle_timer/2,(camera.main.pixelHeight-player_pos.y)-circle_timer/2-2000,4000,4000),color_image);
	GUI.DrawTexture(Rect(player_pos.x-circle_timer/2,(camera.main.pixelHeight-player_pos.y)+circle_timer/2,4000,4000),color_image);
	GUI.DrawTexture(Rect(player_pos.x-circle_timer/2,(camera.main.pixelHeight-player_pos.y)-circle_timer/2,circle_timer,circle_timer),circle_image);
	}
}