#pragma strict
private var old_pos : Vector3;
var move : boolean = false;
var speed : float = 1;
var time_shift : float = 0.0;
var move_by : Vector3;

function Start()
{
	old_pos = transform.position;
	tag = "platform";
}

function LateUpdate () {
		if(move)
			transform.position = Vector3.Lerp(old_pos,old_pos+move_by,(Mathf.Sin((Time.time+time_shift)*speed)+1)/2);
	transform.eulerAngles = Vector3.zero;
}