#pragma strict
class ani // container for an animation
{
	var name : String = "Ani Name"; // name of the animation
	var graphics : Texture2D[]; // graphic array
	var speed : float = 1.0; // 
	var loop : boolean = false;
	var play_after : String = "";
}

var start_animation : String = "";
var animations : ani[];
var renderer_pointer : Renderer; // the renderer we want to modify

var current_animation : int = -1; // the array-id of the current animation
private var current_frame : float = 0;
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
}


function Start () {
	if(!renderer_pointer) // no renderer found? then use the renderer of this object
		if(renderer)renderer_pointer = renderer;
		else Debug.LogError("No renderer found. Please fill the 'renderer_pointer' variable"); // but if this object has no renderer then ERROR
	if(start_animation.length>0) // there is a start animation? play it!
	{
		play_animation(start_animation);
	}
}

function isPlaying()
{
	if(current_frame==animations[current_animation].graphics.length-1)
	{
		return false;
	}
	else
	{
		return true;
	}
}

function Update () {

	if(current_animation ==-1) return; // nothing to animate? then stop here!
	current_frame+=animations[current_animation].speed*Time.deltaTime; // go trough the frames by speed
	if(animations[current_animation].loop) current_frame = current_frame % animations[current_animation].graphics.length; // a looping animation? start at the beginning at the end
	else 
	{
		current_frame = Mathf.Min(current_frame,animations[current_animation].graphics.length-1); // don't loop? stop at the end
		if(animations[current_animation].play_after.length>0 && current_frame==animations[current_animation].graphics.length-1)
		{
			play_animation(animations[current_animation].play_after);
		}
	}
	
	renderer_pointer.material.mainTexture = animations[current_animation].graphics[Mathf.Floor(current_frame)]; // set the new texture
	
}