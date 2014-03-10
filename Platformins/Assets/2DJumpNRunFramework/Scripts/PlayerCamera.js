var camera_pointer : Transform;

var move_with_player : boolean = true;
var lock_x_axis : boolean = false;
var locked_x : float = 0;
var lock_y_axis : boolean = false;
var locked_y : float = 0;
var extra_position : Vector2;
var z_distance : float = 0; // if zero then the start Z distance will be used
var smoothness : float = 0.4;
var max_speed : float = 2;
private var velocity = Vector3.zero;
private var velocity1d : float = 0;
function Start()
{
	if(!camera_pointer)
	{
		Debug.LogError("Need a camera pointer!! Trying to use Main Camera");
		if(!Camera.main)
		{
		Debug.LogError("Can't find Main Camera!");
		return;
		}
		else
		{
		camera_pointer = Camera.main.transform;
		}
	}
	if(z_distance==0)
	{
		if(!camera_pointer.camera.orthographic)z_distance=camera_pointer.position.z;
		else z_distance = camera_pointer.camera.orthographicSize;
	}
	if(locked_x==0) locked_x = camera_pointer.position.x;
	if(locked_y==0) locked_y = camera_pointer.position.y;
}

private var target_position : Vector3;
function FixedUpdate () {
	if(move_with_player && camera_pointer)
	{
		if(!camera_pointer.camera.orthographic)target_position = Vector3(transform.position.x+extra_position.x,transform.position.y+extra_position.y,z_distance);
		else
		{
			target_position = Vector3(transform.position.x+extra_position.x,transform.position.y+extra_position.y,camera_pointer.position.z);
			camera_pointer.camera.orthographicSize = Mathf.SmoothDamp(camera_pointer.camera.orthographicSize,z_distance,velocity1d,smoothness,max_speed);
		}
		if(lock_x_axis) target_position.x = locked_x;
		if(lock_y_axis) target_position.y = locked_y;
		if(smoothness>0)camera_pointer.position = Vector3.SmoothDamp(camera_pointer.position,target_position,velocity,smoothness,max_speed);
		else camera_pointer.position = target_position;
		return;
	}

}