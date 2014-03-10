#pragma strict
// this script is the animation component for smooth moves animations!
// If you wanna use smooth moves please uncomment this code!
/*
import SmoothMoves;



class SMani
{
	var name : String = "Ani Name"; // name of the animation
	var clipname : String; // name of the animation clip
	var play_after : String = "";
	var blend_animation : boolean = true;
}
var start_animation : String = "";
var animations : SMani[];
private var current_frame : float = 0;
private var current_clip_name ="";
var boneAnimation : BoneAnimation;
var current_animation : int = -1; // the array-id of the current animation
var use_fade_animation : boolean = true;



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
		boneAnimation.CrossFade(animations[ID].clipname);
		current_clip_name = animations[ID].clipname;
	}
	else 
	{
		boneAnimation.Play(animations[ID].clipname,PlayMode.StopAll);
	}
}

function isPlaying()
{
	return boneAnimation.animation.isPlaying;
}

function Start () {
	if(!boneAnimation) // no renderer found? then use the renderer of this object
		if(GetComponent(BoneAnimation))boneAnimation = GetComponent(BoneAnimation);
		else Debug.LogError("No BoneAnimation found. Please fill the 'boneAnimation' variable"); // but if this object has no renderer then ERROR
	if(start_animation.length>0) // there is a start animation? play it!
	{
		play_animation(start_animation);
	}
}

function Update () {

if(current_animation!=-1)
{
	if(!boneAnimation.IsPlaying(animations[current_animation].clipname) && animations[current_animation].play_after.length>0)
	play_animation(animations[current_animation].play_after);
}
}
*/

///DELETE THE FOLLOWING FUNCTIONS AND VARS IF YOU WANT TO USE SMOOTH MOVES!!!

var current_animation : int = -1;

function isPlaying()
{
	return true;
}

function play_animation(name : String) 
{

}

function return_ani_ID(name : String)
{
	return 0;
}