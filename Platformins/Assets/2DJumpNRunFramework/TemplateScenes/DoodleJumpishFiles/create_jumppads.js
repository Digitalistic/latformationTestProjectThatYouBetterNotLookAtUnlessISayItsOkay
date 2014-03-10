#pragma strict
private var the_seed : float = 264.4;
var jumppad : GameObject;
private var the_player : GameObject;
function Start ()
{
	the_player = gameObject.FindWithTag("Player");
	plattform_array = new Array();
	player_start_pos = the_player.transform.position;
}

var heighest_point : float = 0;
var space_height : float = 5;
var x_width : float = 13;
var y_add : float = 15;

var record_height : float;

var smaller_by : float = 0.03;
var max_smaller : float = 5;

var higher_by : float = 0.03;
var max_higher : float = 3;

var bound_collider : GameObject;

var plattform_array : GameObject[];
private var player_start_pos : Vector3;
function reset_game()
{
	for(var i : int = 0; i<plattform_array.length; i++)
	{
		Debug.Log(plattform_array[i]);
		Destroy(plattform_array[i].gameObject);
	}
	plattform_array= new Array();
	the_player.transform.position=player_start_pos;
	heighest_point=0;
}
function Update () 
{	
	Random.seed = the_seed;
	if(the_player.transform.position.y>6+heighest_point)
	{
		heighest_point=the_player.transform.position.y;
		var new_pad = Instantiate(jumppad, Vector3(x_width*Random.Range(-1.0,1.0),6+heighest_point+y_add+Mathf.Min(heighest_point*higher_by,max_higher),0), Quaternion.identity) as GameObject;
		new_pad.transform.localScale.x-= Mathf.Min(heighest_point*smaller_by,max_smaller);
		//plattform_array.Add(new_pad);
		the_seed++;
	}
	if(record_height<the_player.transform.position.y)
	{
		record_height=the_player.transform.position.y;
	}
	bound_collider.transform.position.y = the_player.transform.position.y;
	for(var i : int = 0; i<plattform_array.length; i++)
	{
		if(plattform_array[i].transform.position.y+20<the_player.transform.position.y)
		{
			Destroy(plattform_array[i].gameObject);
		//	plattform_array.RemoveAt(i);
		}
	}
	if(the_player.transform.position.y<heighest_point-20)
	{
		reset_game();
	}
}

function OnGUI()
{
	GUI.Label(Rect(10,10,300,100),"Record: "+Mathf.Round(record_height)+"m");
}