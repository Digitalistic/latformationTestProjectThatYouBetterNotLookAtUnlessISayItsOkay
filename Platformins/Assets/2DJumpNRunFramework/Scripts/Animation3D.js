#pragma strict
class D3ani
{
	var name : String = "Ani Name"; // name of the animation
	var clipname : String; // name of the animation clip
	var play_after : String = "";
	var blend_animation : boolean = true;
}

var start_animation : String = "";
var animations : D3ani[];
var character_pointer : Transform; // the renderer we want to modify
private var current_frame : float = 0;
var current_animation : int = -1; // the array-id of the current animation

function return_ani_ID(name : String) // returns the array ID of a name
{
	for(var i = 0; i < animations.length; i++) // loop over the array
	{
		if(animations[i].name == name)
			return i; // return the ID
	}
	return -1; // -1 if we can't find the animation
}

function play_animation(name : String) // plays an animation by name
{

	var ID : int = return_ani_ID(name);
	if(ID==-1)  // invalid animation name
	{
		Debug.LogError("Can't find animation with name " + name);
		return;
	}
	
	current_frame=0; // reset the framecounter
	current_animation = ID; // set the new ID
	if(animations[ID].blend_animation)
	{
		character_pointer.animation.CrossFade(animations[ID].clipname);
	}
	else
	{
		character_pointer.animation.Play(animations[ID].clipname,PlayMode.StopAll);
	}
}


function Start () {
	if(!character_pointer) // no renderer found? then use the renderer of this object
		if(transform)character_pointer = transform;
		else Debug.LogError("No renderer found. Please fill the 'renderer_pointer' variable"); // but if this object has no renderer then ERROR
	if(start_animation.length>0) // there is a start animation? play it!
	{
		play_animation(start_animation);
	}
}

function Update () {

if(current_animation!=-1)
{
	if(!character_pointer.animation.IsPlaying(animations[current_animation].clipname) && animations[current_animation].play_after.length>0)
	play_animation(animations[current_animation].play_after);
}
}
